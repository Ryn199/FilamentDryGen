"""
Filament Dryer G-Code Generator (CLI Version)
Untuk versi Website / Homeserver, jalankan: python app.py
"""

from pathlib import Path
import sys
from generator import generate_dryer_gcode

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ==============================
# SETTINGS
# ==============================
temperature = 60          # Suhu heatbed (°C)
duration_hours = 8        # Durasi jam
duration_minutes = 0      # Durasi menit
beep_seconds = 10         # Lama beep saat selesai
park_toolhead = True      # Parkir nozzle menjauh dari bed
fan_circulation = False   # Kipas sirkulasi

# Generate
result = generate_dryer_gcode(
    temperature=temperature,
    duration_hours=duration_hours,
    duration_minutes=duration_minutes,
    beep_seconds=beep_seconds,
    park_toolhead=park_toolhead,
    fan_circulation=fan_circulation
)

filename = result["filename"]
gcode = result["gcode"]

# Save to local file
output_path = Path(filename)
output_path.write_text(gcode, encoding="utf-8")

print("=" * 55)
print("♨️ FILAMENT DRYER G-CODE GENERATOR")
print("=" * 55)
print(f"File berhasil dibuat: {output_path.resolve()}")
print(f"Temperatur Bed      : {temperature}°C")
print(f"Durasi              : {duration_hours} Jam {duration_minutes} Menit")
print("=" * 55)
print("💡 Tip: Jalankan 'python app.py' untuk membuka antarmuka website!")