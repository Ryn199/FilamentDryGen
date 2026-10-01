# Filament Dryer G-Code Generator

[Bahasa Indonesia](README.md) | **English**

A web application to generate 3D printer filament drying G-code using your heated bed (compatible with Marlin, Klipper, RepRap, and most standard 3D printer firmwares).

The generated G-code is designed with safety in mind: it does not perform automatic homing on start, releases all stepper motors, and ensures the nozzle heater stays off so there is zero risk of crashing into an enclosure box placed on the bed.

---

## Workflow & Preparation

Before running the generated G-code file on your 3D printer, follow these simple preparation steps:

1. Turn on the 3D printer.
2. Manually raise the Z axis (toolhead/nozzle) or use the LCD menu until it is high enough to clear your filament spool.
3. Place the filament spool flat on the heated bed.
4. Cover the spool with a cardboard box (e.g. the original filament box) with several small ventilation holes poked on top to allow moisture and humidity to escape.
5. Load and run the generated `.gcode` file via SD card or your printer's web interface (OctoPrint / Mainsail / Fluidd).
6. The heated bed will heat up to the target temperature, maintain it for the specified duration, turn off heating when done, and sound the buzzer/alarm.

---

## Features

- **Material Presets**: One-click recommended temperature and duration settings for PLA, PETG, TPU, ABS/ASA, Nylon (PA), PC, and PVA.
- **Flexible Settings**: Freely adjust temperature (30–125°C) and duration (hours & minutes).
- **Completion Beep / Alarm**:
  - Single tone duration mode (1–30 seconds).
  - Melodic preset mode (Chime, Fanfare, Classic 3-Beep, Alert, Mario Coin, etc.) previewable directly in the browser via Web Audio API.
- **Optional Circulation Fan**: Adjust part cooling fan speed (PWM) to circulate warm air inside the drying enclosure.
- **Built-in Safety**:
  - Hotend heater is explicitly shut off (`M104 S0`).
  - Stepper motors are unlocked (`M84`) to save power and prevent motor heat.
  - Auto-homing is disabled by default to prevent colliding with the cardboard box on the bed.
- **Live Preview & Download**: Instant real-time G-code preview, copy to clipboard, and direct `.gcode` download.

---

## Installation & Running

### 1. Running Locally with Python

**Prerequisite:** Python 3.8 or higher.

1. Clone or download the repository:
   ```bash
   git clone https://github.com/username/filamentDryerGcodeGenerator.git
   cd filamentDryerGcodeGenerator
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the application:
   ```bash
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

---

### 2. Running with Docker Compose (Homeserver)

Recommended for homeservers (CasaOS, Portainer, Unraid, or any Linux server):

1. Make sure Docker and Docker Compose are installed.
2. Run the following command in the project directory:
   ```bash
   docker compose up -d
   ```
3. Access the web interface from your server IP:
   ```
   http://<SERVER-IP>:5000
   ```
4. To stop the container:
   ```bash
   docker compose down
   ```

---

### 3. Build Docker Image Manually

If you prefer building and running a standalone Docker container without compose:

```bash
docker build -t filament-dryer .
docker run -d --name filament-dryer -p 5000:5000 --restart unless-stopped filament-dryer
```

---

## Environment Variables

The application supports the following environment configurations:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Web server listening port |
| `HOST` | `0.0.0.0` | Host bind address |
| `FLASK_ENV` | `production` | Set to `development` to enable automatic template reloading |

Example port customization in `docker-compose.yml`:
```yaml
ports:
  - "8080:5000"
```

---

## Project Structure

```
filamentDryerGcodeGenerator/
├── app.py                 # Flask backend server & API
├── generator.py           # Core G-code generator & duration calculation
├── main.py                # Simple CLI interface
├── templates/
│   └── index.html         # Web UI template
├── static/
│   ├── css/
│   │   └── style.css      # Dark theme styling & layout
│   └── js/
│       └── app.js         # Interactive UI logic, preview & audio synthesizer
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Docker Compose deployment setup
├── requirements.txt       # Python dependencies
├── README.md              # Documentation (Bahasa Indonesia)
└── README.en.md           # Documentation (English)
```

---

## Drying Temperatures & Guidelines

| Material | Recommended Temp | Recommended Time |
|---|---|---|
| PLA / PLA+ | 45 - 50°C | 4 - 6 Hours |
| PETG | 60 - 65°C | 5 - 7 Hours |
| TPU / TPE | 50 - 55°C | 4 - 6 Hours |
| ABS / ASA | 75 - 80°C | 4 - 6 Hours |
| Nylon (PA) | 80 - 90°C | 8 - 12 Hours |
| PC (Polycarbonate) | 90 - 100°C | 6 - 8 Hours |

**Important Notes:**
- Do not exceed the glass transition temperature (Tg) of the filament, especially PLA (keep bed at or below 50°C). Excessive heat will soften the filament and fuse spool strands together.
- Use a clean cardboard box and make sure there are small ventilation holes on top. Without ventilation, evaporating moisture will stay trapped inside the enclosure.
- Ensure proper room ventilation, especially when drying materials like ABS or Nylon.
