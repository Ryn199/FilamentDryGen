import os
import io
import sys
from flask import Flask, render_template, request, jsonify, send_file
from generator import generate_dryer_gcode

# Ensure UTF-8 output on Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

app = Flask(__name__)
# Enable template auto-reload only in development (not in Docker production)
if os.environ.get("FLASK_ENV") == "development":
    app.config["TEMPLATES_AUTO_RELOAD"] = True

FILAMENT_PRESETS = [
    {
        "id": "pla",
        "name": "PLA / PLA+",
        "temp": 50,
        "hours": 5,
        "minutes": 0,
        "color": "#10b981",
        "badge": "Popular",
        "description": "Standard PLA, Silk, PLA+. Bed temperature should stay below 55°C to avoid softening."
    },
    {
        "id": "petg",
        "name": "PETG",
        "temp": 65,
        "hours": 6,
        "minutes": 0,
        "color": "#06b6d4",
        "badge": "Common",
        "description": "Prone to stringing when wet. 65°C removes surface and core moisture effectively."
    },
    {
        "id": "tpu",
        "name": "TPU / TPE",
        "temp": 55,
        "hours": 5,
        "minutes": 0,
        "color": "#f59e0b",
        "badge": "Flexible",
        "description": "Very hygroscopic flexible filament. Dry thoroughly to prevent popping bubbles while printing."
    },
    {
        "id": "abs",
        "name": "ABS / ASA",
        "temp": 80,
        "hours": 4,
        "minutes": 0,
        "color": "#ef4444",
        "badge": "Enclosed",
        "description": "High temperature filament. Use cardboard box or cover over bed for best heat retention."
    },
    {
        "id": "nylon",
        "name": "Nylon (PA / PA-CF)",
        "temp": 85,
        "hours": 10,
        "minutes": 0,
        "color": "#8b5cf6",
        "badge": "Engineering",
        "description": "Extremely moisture sensitive. Requires high temperature and longer duration."
    },
    {
        "id": "pc",
        "name": "PC (Polycarbonate)",
        "temp": 95,
        "hours": 7,
        "minutes": 0,
        "color": "#ec4899",
        "badge": "High Temp",
        "description": "Requires maximum bed temperature (90-100°C) with enclosure/cover."
    },
    {
        "id": "pva",
        "name": "PVA / PVB",
        "temp": 45,
        "hours": 8,
        "minutes": 0,
        "color": "#14b8a6",
        "badge": "Water Soluble",
        "description": "Water-soluble support material. Keep drying temperature gentle (<= 45°C)."
    }
]


@app.route("/")
def index():
    return render_template("index.html", presets=FILAMENT_PRESETS)


@app.route("/api/presets", methods=["GET"])
def get_presets():
    return jsonify({"success": True, "presets": FILAMENT_PRESETS})


@app.route("/api/generate", methods=["POST"])
def api_generate():
    data = request.get_json() or {}
    try:
        temp = int(data.get("temperature", 60))
        hours = int(data.get("duration_hours", 8))
        minutes = int(data.get("duration_minutes", 0))
        beep_enabled = bool(data.get("beep_enabled", True))
        beep_seconds = int(data.get("beep_seconds", 5))
        beep_freq = int(data.get("beep_freq", 1000))
        # Melody / sequence mode: list of {freq, ms} dicts
        beep_sequence = data.get("beep_sequence", None)
        if not isinstance(beep_sequence, list):
            beep_sequence = None
        beep_preset_name = str(data.get("beep_preset_name", "")).strip()
        park_toolhead = bool(data.get("park_toolhead", False))
        park_x = int(data.get("park_x", 10))
        park_y = int(data.get("park_y", 200))
        park_z = int(data.get("park_z", 60))
        fan_circulation = bool(data.get("fan_circulation", False))
        fan_speed_pct = int(data.get("fan_speed_pct", 20))
        disable_steppers = bool(data.get("disable_steppers", True))
        notes = str(data.get("notes", "")).strip()

        result = generate_dryer_gcode(
            temperature=temp,
            duration_hours=hours,
            duration_minutes=minutes,
            beep_enabled=beep_enabled,
            beep_seconds=beep_seconds,
            beep_freq=beep_freq,
            beep_sequence=beep_sequence,
            beep_preset_name=beep_preset_name,
            park_toolhead=park_toolhead,
            park_x=park_x,
            park_y=park_y,
            park_z=park_z,
            fan_circulation=fan_circulation,
            fan_speed_pct=fan_speed_pct,
            disable_steppers=disable_steppers,
            notes=notes
        )

        custom_name = str(data.get("custom_filename", "")).strip()
        if custom_name:
            if not custom_name.endswith(".gcode"):
                custom_name += ".gcode"
            result["filename"] = custom_name

        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/download", methods=["POST"])
def api_download():
    # Can receive either raw gcode content or parameter set
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()

    gcode_content = data.get("gcode")
    filename = data.get("filename", "filament_dryer.gcode")

    # If gcode is not directly supplied, generate from params
    if not gcode_content:
        temp = int(data.get("temperature", 60))
        hours = int(data.get("duration_hours", 8))
        minutes = int(data.get("duration_minutes", 0))
        beep_enabled = str(data.get("beep_enabled", "true")).lower() in ("true", "1", "yes")
        beep_seconds = int(data.get("beep_seconds", 5))
        park_toolhead = str(data.get("park_toolhead", "true")).lower() in ("true", "1", "yes")
        fan_circulation = str(data.get("fan_circulation", "false")).lower() in ("true", "1", "yes")

        result = generate_dryer_gcode(
            temperature=temp,
            duration_hours=hours,
            duration_minutes=minutes,
            beep_enabled=beep_enabled,
            beep_seconds=beep_seconds,
            park_toolhead=park_toolhead,
            fan_circulation=fan_circulation
        )
        gcode_content = result["gcode"]
        filename = result["filename"]

    if not filename.endswith(".gcode"):
        filename += ".gcode"

    mem_file = io.BytesIO()
    mem_file.write(gcode_content.encode("utf-8"))
    mem_file.seek(0)

    return send_file(
        mem_file,
        as_attachment=True,
        download_name=filename,
        mimetype="text/x-gcode"
    )


@app.route("/health")
def health():
    return jsonify({"status": "healthy", "service": "filament-dryer-gcode-generator"})


if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    print(f"🚀 Filament Dryer Web Server running on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
