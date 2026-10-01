document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    //  BEEP PRESETS DEFINITIONS
    //  Each note: { freq: Hz (0 = rest/pause), ms: duration }
    // =========================================================
    const BEEP_PRESETS = [
        {
            id: 'single_long',
            name: 'Satu Nada Panjang',
            // Bell icon
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
            desc: '1 nada penuh 3 detik',
            color: '#10b981',
            notes: [{ freq: 1000, ms: 3000 }]
        },
        {
            id: 'triple_short',
            name: 'Tiga Nada Pendek',
            // Volume-2 / radio waves icon
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
            desc: 'Tiga beep 200ms berurutan',
            color: '#06b6d4',
            notes: [
                { freq: 1000, ms: 200 }, { freq: 0, ms: 120 },
                { freq: 1000, ms: 200 }, { freq: 0, ms: 120 },
                { freq: 1000, ms: 200 }
            ]
        },
        {
            id: 'ascending',
            name: 'Nada Naik',
            // Trending-up icon
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
            desc: 'Empat nada Do-Mi-Sol-Do tinggi',
            color: '#f59e0b',
            notes: [
                { freq: 523, ms: 250 }, { freq: 0, ms: 60 },
                { freq: 659, ms: 250 }, { freq: 0, ms: 60 },
                { freq: 784, ms: 250 }, { freq: 0, ms: 60 },
                { freq: 1047, ms: 600 }
            ]
        },
        {
            id: 'alarm',
            name: 'Alarm Darurat',
            // Alert-octagon icon
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
            desc: 'Nada tinggi-rendah bergantian 6x',
            color: '#ef4444',
            notes: [
                { freq: 2000, ms: 150 }, { freq: 500, ms: 150 },
                { freq: 2000, ms: 150 }, { freq: 500, ms: 150 },
                { freq: 2000, ms: 150 }, { freq: 500, ms: 150 }
            ]
        },
        {
            id: 'victory',
            name: 'Victory!',
            // Star icon
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
            desc: 'Fanfare singkat — selesai!',
            color: '#8b5cf6',
            notes: [
                { freq: 523, ms: 120 }, { freq: 0, ms: 30 },
                { freq: 523, ms: 120 }, { freq: 0, ms: 30 },
                { freq: 523, ms: 120 }, { freq: 0, ms: 30 },
                { freq: 523, ms: 360 }, { freq: 0, ms: 30 },
                { freq: 415, ms: 360 }, { freq: 0, ms: 30 },
                { freq: 466, ms: 360 }, { freq: 0, ms: 30 },
                { freq: 523, ms: 720 }
            ]
        },
        {
            id: 'double_high',
            name: 'Dua Nada Tegas',
            // Zap / bolt icon
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
            desc: 'Dua bunyi tegas dengan aksen tinggi',
            color: '#ec4899',
            notes: [
                { freq: 880, ms: 400 }, { freq: 0, ms: 180 },
                { freq: 1047, ms: 700 }
            ]
        }
    ];

    // =========================================================
    //  DOM ELEMENTS
    // =========================================================
    const tempRange = document.getElementById('input-temp-range');
    const tempInput = document.getElementById('input-temp');
    const tempDisplay = document.getElementById('temp-display');
    const targetTempPill = document.getElementById('target-temp-pill');

    const hoursInput = document.getElementById('input-hours');
    const minsInput = document.getElementById('input-minutes');
    const durationDisplay = document.getElementById('duration-display');
    const totalTimePill = document.getElementById('total-time-pill');
    const finishTimeEstimate = document.getElementById('finish-time-estimate');

    const btnHoursMinus = document.getElementById('btn-hours-minus');
    const btnHoursPlus = document.getElementById('btn-hours-plus');
    const btnMinsMinus = document.getElementById('btn-mins-minus');
    const btnMinsPlus = document.getElementById('btn-mins-plus');

    const togglePark = document.getElementById('toggle-park');
    const toggleBeep = document.getElementById('toggle-beep');
    const beepOptions = document.getElementById('beep-options');

    // Beep mode switcher
    const beepModeCustomBtn = document.getElementById('beep-mode-custom');
    const beepModePresetBtn = document.getElementById('beep-mode-preset');
    const beepCustomPanel = document.getElementById('beep-custom-panel');
    const beepPresetPanel = document.getElementById('beep-preset-panel');
    const beepPresetsContainer = document.getElementById('beep-presets-container');

    // Custom mode inputs
    const beepSecInput = document.getElementById('input-beep-sec');
    const beepFreqInput = document.getElementById('input-beep-freq');
    const btnPlayCustom = document.getElementById('btn-play-custom');

    const toggleFan = document.getElementById('toggle-fan');
    const fanOptions = document.getElementById('fan-options');
    const fanSpeedInput = document.getElementById('input-fan-speed');
    const fanSpeedDisplay = document.getElementById('fan-speed-display');

    const toggleSteppers = document.getElementById('toggle-steppers');
    const customFilenameInput = document.getElementById('input-custom-filename');

    const gcodeOutput = document.getElementById('gcode-output');
    const codeFilenameTag = document.getElementById('code-filename-tag');
    const fileSizeInfo = document.getElementById('file-size-info');
    const btnCopy = document.getElementById('btn-copy');
    const btnDownload = document.getElementById('btn-download');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    const presetButtons = document.querySelectorAll('.preset-pill');
    const quickAddButtons = document.querySelectorAll('.quick-btn');

    // =========================================================
    //  STATE
    // =========================================================
    let currentGcode = '';
    let currentFilename = '';
    let activePresetId = null;
    let beepMode = 'custom';          // 'custom' | 'preset'
    let activeBeepPresetId = null;
    let audioCtx = null;
    let currentPlayBtn = null;        // Button being animated during playback
    let playbackStopFn = null;        // Function to stop ongoing playback

    // =========================================================
    //  WEB AUDIO API HELPERS
    // =========================================================
    function getAudioCtx() {
        if (!audioCtx || audioCtx.state === 'closed') {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    /**
     * Play a sequence of notes via Web Audio API.
     * @param {Array} notes - [{freq, ms}] — freq=0 is a rest
     * @param {HTMLElement} btn - button element to animate
     * @returns {Function} stopFn — call to abort playback
     */
    function playNoteSequence(notes, btn) {
        // Stop any previous playback
        if (playbackStopFn) playbackStopFn();

        const ctx = getAudioCtx();
        let startTime = ctx.currentTime + 0.03; // tiny scheduling buffer
        const scheduledNodes = [];
        let stopped = false;

        notes.forEach((note) => {
            const durationSec = note.ms / 1000;
            if (note.freq > 0) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(note.freq, startTime);

                // Soft envelope: fade in 5ms, hold, fade out 20ms
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.25, startTime + 0.005);
                gain.gain.setValueAtTime(0.25, startTime + durationSec - 0.02);
                gain.gain.linearRampToValueAtTime(0, startTime + durationSec);

                osc.start(startTime);
                osc.stop(startTime + durationSec);
                scheduledNodes.push(osc);
            }
            startTime += durationSec;
        });

        // Total duration for UI reset
        const totalMs = notes.reduce((sum, n) => sum + n.ms, 0);

        // Mark button as playing
        if (btn) {
            btn.classList.add('playing');
            currentPlayBtn = btn;
        }

        const resetTimeout = setTimeout(() => {
            if (!stopped) finishPlayback(btn);
        }, totalMs + 100);

        const stopFn = () => {
            stopped = true;
            clearTimeout(resetTimeout);
            scheduledNodes.forEach(n => {
                try { n.stop(); } catch (_) {}
            });
            finishPlayback(btn);
        };

        playbackStopFn = stopFn;
        return stopFn;
    }

    function finishPlayback(btn) {
        if (btn) btn.classList.remove('playing');
        if (currentPlayBtn === btn) currentPlayBtn = null;
        playbackStopFn = null;
    }

    // =========================================================
    //  BUILD BEEP PRESET CARDS
    // =========================================================
    function buildBeepPresetCards() {
        beepPresetsContainer.innerHTML = '';
        BEEP_PRESETS.forEach((preset) => {
            const card = document.createElement('div');
            card.className = 'beep-preset-card';
            card.dataset.id = preset.id;
            card.style.setProperty('--preset-color', preset.color);
            card.title = preset.desc;

            card.innerHTML = `
                <div class="beep-card-top">
                    <span class="beep-card-icon">${preset.icon}</span>
                    <button type="button" class="beep-card-play" data-id="${preset.id}" title="Preview di browser">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                    </button>
                </div>
                <div class="beep-card-name">${preset.name}</div>
                <div class="beep-card-desc">${preset.desc}</div>
            `;

            // Select card (does NOT play automatically)
            card.addEventListener('click', (e) => {
                if (e.target.closest('.beep-card-play')) return; // handled separately
                selectBeepPreset(preset.id);
            });

            // Play button
            const playBtn = card.querySelector('.beep-card-play');
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const alreadyPlaying = playBtn.classList.contains('playing');
                if (alreadyPlaying) {
                    if (playbackStopFn) playbackStopFn();
                } else {
                    playNoteSequence(preset.notes, playBtn);
                }
            });

            beepPresetsContainer.appendChild(card);
        });
    }

    function selectBeepPreset(id) {
        activeBeepPresetId = id;
        document.querySelectorAll('.beep-preset-card').forEach(c => {
            c.classList.toggle('active', c.dataset.id === id);
        });
        triggerGenerate();
    }

    // =========================================================
    //  BEEP MODE SWITCHING
    // =========================================================
    function setBeepMode(mode) {
        beepMode = mode;
        beepModeCustomBtn.classList.toggle('active', mode === 'custom');
        beepModePresetBtn.classList.toggle('active', mode === 'preset');
        beepCustomPanel.classList.toggle('hidden', mode !== 'custom');
        beepPresetPanel.classList.toggle('hidden', mode !== 'preset');
        triggerGenerate();
    }

    beepModeCustomBtn.addEventListener('click', () => setBeepMode('custom'));
    beepModePresetBtn.addEventListener('click', () => setBeepMode('preset'));

    // =========================================================
    //  CUSTOM BEEP PREVIEW
    // =========================================================
    btnPlayCustom.addEventListener('click', () => {
        const freq = parseInt(beepFreqInput.value || 1000, 10);
        const sec = parseFloat(beepSecInput.value || 5);
        const ms = Math.max(100, Math.min(10000, Math.round(sec * 1000)));

        const alreadyPlaying = btnPlayCustom.classList.contains('playing');
        if (alreadyPlaying) {
            if (playbackStopFn) playbackStopFn();
        } else {
            playNoteSequence([{ freq, ms }], btnPlayCustom);
        }
    });

    beepSecInput.addEventListener('input', triggerGenerate);
    beepFreqInput.addEventListener('input', triggerGenerate);

    // =========================================================
    //  TEMPERATURE CONTROLS
    // =========================================================
    function updateTemp(value) {
        let val = parseInt(value, 10);
        if (isNaN(val)) val = 60;
        val = Math.max(30, Math.min(125, val));
        tempRange.value = val;
        tempInput.value = val;
        tempDisplay.textContent = `${val}°C`;
        targetTempPill.textContent = `${val}°C`;
        triggerGenerate();
    }

    tempRange.addEventListener('input', (e) => updateTemp(e.target.value));
    tempInput.addEventListener('change', (e) => updateTemp(e.target.value));

    // =========================================================
    //  DURATION CONTROLS
    // =========================================================
    btnHoursMinus.addEventListener('click', () => {
        hoursInput.value = Math.max(0, parseInt(hoursInput.value || 0, 10) - 1);
        triggerGenerate();
    });
    btnHoursPlus.addEventListener('click', () => {
        hoursInput.value = Math.min(72, parseInt(hoursInput.value || 0, 10) + 1);
        triggerGenerate();
    });
    btnMinsMinus.addEventListener('click', () => {
        minsInput.value = Math.max(0, parseInt(minsInput.value || 0, 10) - 5);
        triggerGenerate();
    });
    btnMinsPlus.addEventListener('click', () => {
        minsInput.value = Math.min(55, parseInt(minsInput.value || 0, 10) + 5);
        triggerGenerate();
    });

    hoursInput.addEventListener('input', triggerGenerate);
    minsInput.addEventListener('input', triggerGenerate);

    quickAddButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const addH = parseInt(btn.dataset.addHours, 10);
            hoursInput.value = Math.min(72, parseInt(hoursInput.value || 0, 10) + addH);
            triggerGenerate();
        });
    });

    // =========================================================
    //  FILAMENT PRESETS
    // =========================================================
    presetButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePresetId = btn.dataset.id;
            updateTemp(btn.dataset.temp);
            hoursInput.value = btn.dataset.hours;
            minsInput.value = btn.dataset.mins;
            triggerGenerate();
        });
    });

    // =========================================================
    //  TOGGLE HANDLERS
    // =========================================================
    toggleBeep.addEventListener('change', () => {
        beepOptions.classList.toggle('hidden', !toggleBeep.checked);
        triggerGenerate();
    });

    toggleFan.addEventListener('change', () => {
        if (toggleFan.checked) {
            fanOptions.classList.remove('hidden');
        } else {
            fanOptions.classList.add('hidden');
        }
        triggerGenerate();
    });

    fanSpeedInput.addEventListener('input', (e) => {
        fanSpeedDisplay.textContent = `${e.target.value}%`;
        triggerGenerate();
    });

    togglePark.addEventListener('change', triggerGenerate);
    toggleSteppers.addEventListener('change', triggerGenerate);
    customFilenameInput.addEventListener('input', triggerGenerate);

    // =========================================================
    //  FINISH TIME ESTIMATE
    // =========================================================
    function updateFinishTime(hours, minutes) {
        const now = new Date();
        const finishDate = new Date(now.getTime() + (hours * 3600 + minutes * 60) * 1000);
        const timeStr = finishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const todayDate = new Date(now);
        todayDate.setHours(0, 0, 0, 0);
        const finishDay = new Date(finishDate);
        finishDay.setHours(0, 0, 0, 0);
        const diffDays = Math.round((finishDay - todayDate) / 86400000);

        let dayStr = '';
        if (diffDays === 0) dayStr = 'Hari ini';
        else if (diffDays === 1) dayStr = 'Besok';
        else dayStr = finishDate.toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric' });

        finishTimeEstimate.textContent = `${dayStr}, pukul ${timeStr}`;
    }

    // =========================================================
    //  DEBOUNCED GENERATE
    // =========================================================
    let debounceTimer = null;
    function triggerGenerate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(generateGcode, 80);
    }

    // =========================================================
    //  GCODE GENERATION (API CALL)
    // =========================================================
    async function generateGcode() {
        const temp = parseInt(tempInput.value || 60, 10);
        let hours = parseInt(hoursInput.value || 0, 10);
        let mins = parseInt(minsInput.value || 0, 10);

        if (hours === 0 && mins === 0) {
            mins = 15;
            minsInput.value = 15;
        }

        durationDisplay.textContent = `${hours} Jam ${mins} Menit`;
        totalTimePill.textContent = `${hours}h ${mins}m`;
        updateFinishTime(hours, mins);

        // Build beep payload depending on mode
        let beepSequence = null;
        let beepPresetName = '';
        if (beepMode === 'preset' && activeBeepPresetId) {
            const preset = BEEP_PRESETS.find(p => p.id === activeBeepPresetId);
            if (preset) {
                beepSequence = preset.notes;
                beepPresetName = preset.name;
            }
        }

        const payload = {
            temperature: temp,
            duration_hours: hours,
            duration_minutes: mins,
            beep_enabled: toggleBeep.checked,
            beep_seconds: parseInt(beepSecInput.value || 5, 10),
            beep_freq: parseInt(beepFreqInput.value || 1000, 10),
            beep_sequence: beepSequence,
            beep_preset_name: beepPresetName,
            park_toolhead: togglePark.checked,
            fan_circulation: toggleFan.checked,
            fan_speed_pct: parseInt(fanSpeedInput.value || 20, 10),
            disable_steppers: toggleSteppers.checked,
            custom_filename: customFilenameInput.value.trim()
        };

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (json.success) {
                currentGcode = json.data.gcode;
                currentFilename = json.data.filename;
                codeFilenameTag.textContent = currentFilename;
                gcodeOutput.textContent = currentGcode;
                const lineCount = currentGcode.split('\n').length;
                const byteSize = new Blob([currentGcode]).size;
                fileSizeInfo.textContent = `${lineCount} baris • ${(byteSize / 1024).toFixed(1)} KB`;
            }
        } catch (err) {
            console.error('Error generating G-code:', err);
        }
    }

    // =========================================================
    //  DOWNLOAD
    // =========================================================
    btnDownload.addEventListener('click', () => {
        if (!currentGcode) return;
        const blob = new Blob([currentGcode], { type: 'text/x-gcode;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFilename || 'filament_dryer.gcode';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Mengunduh ${currentFilename}...`);
    });

    // =========================================================
    //  COPY TO CLIPBOARD
    // =========================================================
    btnCopy.addEventListener('click', async () => {
        if (!currentGcode) return;
        try {
            await navigator.clipboard.writeText(currentGcode);
            showToast('G-code berhasil disalin ke clipboard!');
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = currentGcode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('G-code berhasil disalin!');
        }
    });

    // =========================================================
    //  TOAST HELPER
    // =========================================================
    function showToast(msg) {
        toastText.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2800);
    }

    // =========================================================
    //  INITIALIZE
    // =========================================================
    buildBeepPresetCards();

    // Default: select first beep preset (for when user switches to preset mode)
    if (BEEP_PRESETS.length > 0) {
        activeBeepPresetId = BEEP_PRESETS[0].id;
        // Don't visually activate yet (user is in custom mode by default)
    }

    // Select PLA filament preset
    const plaBtn = document.querySelector('.preset-pill[data-id="pla"]');
    if (plaBtn) {
        plaBtn.click();
    } else {
        triggerGenerate();
    }
});
