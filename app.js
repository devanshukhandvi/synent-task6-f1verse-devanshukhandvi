// F1VERSE Unified Application Engine
// Advanced Level Integrated Features

// --- GLOBAL DATABASE / LOCAL STORAGE STATE ---
const DEFAULT_COURSES = [
    {
        id: "aero-101",
        title: "Apex Hunting & Cornering Dynamics",
        category: "physics",
        price: 29.00,
        desc: "Learn to trace optimum geometric paths. Analyze weight transfer factors and friction circles to capture maximum speed at late apex sectors.",
        modules: [
            {
                name: "Module 1: Apex Geometry",
                lessons: [
                    { id: "l1", title: "Apex Tracing & Racing Lines", content: "Analyze early, mid, and late apex lines. Calculate radius changes to optimize exit throttle vectors.", completed: false },
                    { id: "l2", title: "Trail Braking Dynamics", content: "Modulate brake pedal pressures while entering steering corners. Transfer front-end tire traction smoothly.", completed: false }
                ]
            },
            {
                name: "Module 2: Friction Limits",
                lessons: [
                    { id: "l3", title: "Tire Slip Angle Integration", content: "Measure relative slipping profiles under cornering drift constraints to achieve extreme downforce traction.", completed: false }
                ]
            }
        ]
    },
    {
        id: "telemetry-202",
        title: "Wind Tunnel Telemetry & Downforce",
        category: "aero",
        price: 39.00,
        desc: "Master ground-effect physics, air diffuser curves, and active DRS drag-reduction flap configurations to execute high-speed overtakes.",
        modules: [
            {
                name: "Module 1: Ground-Effect Forces",
                lessons: [
                    { id: "l4", title: "Venturi Diffuser Calibration", content: "Configure aerodynamic low-pressure zones underneath the chassis grid to vacuum the vehicle downwards.", completed: false },
                    { id: "l5", title: "DRS Flap Activation Zones", content: "Reduce active drag coefficients by 12% down long straights by retracting rear wing flap parameters.", completed: false }
                ]
            }
        ]
    },
    {
        id: "weather-303",
        title: "Wet-Weather Traction & Damp Physics",
        category: "strategy",
        price: 49.00,
        desc: "Understand aquaplaning thresholds, intermediate tire compound thermal windows, and tactical pitstop operations under rain variables.",
        modules: [
            {
                name: "Module 1: Damp Operations",
                lessons: [
                    { id: "l6", title: "Aquaplaning Speed Thresholds", content: "Determine exact tire tread water expulsion volumes to maintain contact patches on wet tarmac grids.", completed: false },
                    { id: "l7", title: "Intermediate vs Wet Compound Choice", content: "Analyze active track moisture saturation indicators to time high-value pitstop swaps.", completed: false }
                ]
            }
        ]
    }
];

const DEFAULT_DRIVERS = [
    { id: "ham", name: "Lewis Hamilton", rating: 94, team: "mercedes", price: 32.0, pace: 95, qual: 96, def: 92, iq: 98 },
    { id: "ver", name: "Max Verstappen", rating: 95, team: "redbull", price: 34.0, pace: 97, qual: 95, def: 94, iq: 96 },
    { id: "lec", name: "Charles Leclerc", rating: 92, team: "ferrari", price: 28.0, pace: 93, qual: 97, def: 88, iq: 90 },
    { id: "nor", name: "Lando Norris", rating: 91, team: "mclaren", price: 26.0, pace: 92, qual: 94, def: 89, iq: 92 },
    { id: "alo", name: "Fernando Alonso", rating: 90, team: "aston", price: 22.0, pace: 89, qual: 91, def: 95, iq: 97 }
];

const DEFAULT_SPONSORS = [
    { id: "rolex", name: "Rolex Precision", logo: "fa-solid fa-clock", color: "text-green-500", challenge: "Submit a telemetry support message.", taskType: "contact", reward: "Rolex Telemetry Decal", unlocked: false },
    { id: "pirelli", name: "Pirelli Compound", logo: "fa-solid fa-circle-dot", color: "text-yellow-500", challenge: "Complete one Academy lesson module.", taskType: "lesson", reward: "Pirelli Slick Tire Decal", unlocked: false },
    { id: "petronas", name: "Petronas Synthetics", logo: "fa-solid fa-droplet", color: "text-teal-400", challenge: "Draft a complete Fantasy Roster.", taskType: "fantasy", reward: "Petronas Hologram Decal", unlocked: false }
];

const DEFAULT_CARS = {
    redbull: { name: "RED BULL RB19", pu: "Honda RBPTH001", hp: 1020, speed: "344 km/h", weight: "798 kg", aero: "96% EFF", drs: "98% EFF", chassis: "RB19-M01", reliability: "95%" },
    ferrari: { name: "FERRARI SF-23", pu: "Ferrari 066/10", hp: 1030, speed: "348 km/h", weight: "799 kg", aero: "94% EFF", drs: "93% EFF", chassis: "SF23-F02", reliability: "88%" },
    mercedes: { name: "MERCEDES W14", pu: "Mercedes-AMG M14", hp: 1015, speed: "342 km/h", weight: "798 kg", aero: "95% EFF", drs: "94% EFF", chassis: "W14-S03", reliability: "97%" },
    mclaren: { name: "MCLAREN MCL60", pu: "Mercedes-AMG M14", hp: 1010, speed: "341 km/h", weight: "798 kg", aero: "97% EFF", drs: "96% EFF", chassis: "MCL60-O04", reliability: "92%" }
};

const DEFAULT_TRACKS = {
    monaco: { name: "Circuit de Monaco", corners: 19, laprecord: "1:12.909 (Hamilton)", drs: "1 Zone", elevation: "42m", desc: "Narrow street track featuring sharp corners, close barriers, and extreme qualifying performance weights." },
    silverstone: { name: "Silverstone Circuit", corners: 18, laprecord: "1:27.097 (Verstappen)", drs: "2 Zones", elevation: "11m", desc: "One of the fastest circuits on the calendar, featuring high-speed sweeps like Maggots and Becketts." },
    monza: { name: "Autodromo Nazionale Monza", corners: 11, laprecord: "1:18.887 (Hamilton)", drs: "2 Zones", elevation: "8m", desc: "The legendary Temple of Speed, demanding low-downforce aerodynamic packages and long straight runs." }
};

// Load Database from LocalStorage or initialize with defaults
let dbCourses = JSON.parse(localStorage.getItem("f1_courses")) || DEFAULT_COURSES;
let dbSponsors = JSON.parse(localStorage.getItem("f1_sponsors")) || DEFAULT_SPONSORS;
let activeUser = JSON.parse(localStorage.getItem("f1_active_user")) || null;
let systemRevenue = parseFloat(localStorage.getItem("f1_revenue")) || 0;

function saveDatabase() {
    localStorage.setItem("f1_courses", JSON.stringify(dbCourses));
    localStorage.setItem("f1_sponsors", JSON.stringify(dbSponsors));
    localStorage.setItem("f1_active_user", JSON.stringify(activeUser));
    localStorage.setItem("f1_revenue", systemRevenue.toString());
}

// --- PROCEDURAL WEB AUDIO SYNTHESIZER ---
let audioCtx = null;
let engineOsc = null;
let engineGain = null;
let noiseFilter = null;
let soundProfile = "v8"; // "v8", "v10", "v12", "electric"
let isSoundMuted = false;

function initAudioEngine() {
    if (audioCtx) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        
        engineOsc = audioCtx.createOscillator();
        engineOsc.type = 'sawtooth';
        
        engineGain = audioCtx.createGain();
        engineGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
        
        noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
        
        engineOsc.connect(noiseFilter);
        noiseFilter.connect(engineGain);
        engineGain.connect(audioCtx.destination);
        
        engineOsc.start();
    } catch (e) {
        console.error("Audio Context blocked: ", e);
    }
}

function updateEngineRPM(rpm) {
    if (!audioCtx || isSoundMuted) return;
    
    let baseFreq = 65;
    let freqMultiplier = 500;
    
    // Shift parameters based on sound profile
    if (soundProfile === 'v10') {
        engineOsc.type = 'sawtooth';
        baseFreq = 90;
        freqMultiplier = 950;
    } else if (soundProfile === 'v12') {
        engineOsc.type = 'sawtooth';
        baseFreq = 120;
        freqMultiplier = 1300;
    } else if (soundProfile === 'electric') {
        engineOsc.type = 'sine';
        baseFreq = 50;
        freqMultiplier = 250;
    } else { // default v8
        engineOsc.type = 'sawtooth';
        baseFreq = 65;
        freqMultiplier = 500;
    }
    
    const targetFreq = baseFreq + (rpm / 15000) * freqMultiplier;
    engineOsc.frequency.setValueAtTime(targetFreq, audioCtx.currentTime);
    
    const targetGain = 0.02 + (rpm / 15000) * 0.15;
    engineGain.gain.setValueAtTime(targetGain, audioCtx.currentTime);
}

function changeSoundProfile(profile) {
    soundProfile = profile;
    playRadioBeep();
    showNotification("AUDIO CALIBRATION", `Sound engine profile adapted to: ${profile.toUpperCase()}`, "info");
}

function playTireScreech() {
    if (!audioCtx || isSoundMuted) return;
    
    const bufferSize = audioCtx.sampleRate * 0.8;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2500, audioCtx.currentTime);
    filter.Q.setValueAtTime(8, audioCtx.currentTime);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noiseNode.start();
}

function playRadioBeep() {
    if (!audioCtx || isSoundMuted) return;
    
    const beep = audioCtx.createOscillator();
    const beepGain = audioCtx.createGain();
    
    beep.type = 'sine';
    beep.frequency.setValueAtTime(1200, audioCtx.currentTime);
    
    beepGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    beepGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    
    beep.connect(beepGain);
    beepGain.connect(audioCtx.destination);
    beep.start();
    beep.stop(audioCtx.currentTime + 0.2);
}

function playPitStopGun() {
    if (!audioCtx || isSoundMuted) return;
    
    // Synthesize active tyre gun sweep bursts
    for (let j = 0; j < 3; j++) {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800 - j * 100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
        }, j * 150);
    }
}

function playDRSBeep() {
    if (!audioCtx || isSoundMuted) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

function toggleSound() {
    isSoundMuted = !isSoundMuted;
    const volumeIcon = document.getElementById("volume-icon");
    if (isSoundMuted) {
        if (engineGain) engineGain.gain.setValueAtTime(0, audioCtx.currentTime);
        volumeIcon.setAttribute("data-lucide", "volume-x");
    } else {
        volumeIcon.setAttribute("data-lucide", "volume-2");
    }
    lucide.createImages();
}

// --- FIRST VISIT EXPERIENCE (ONBOARDING) ---
let rpmInterval = null;

document.getElementById("ignition-btn").addEventListener("click", () => {
    initAudioEngine();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const ignitionBtn = document.getElementById("ignition-btn");
    ignitionBtn.classList.add("pointer-events-none");
    ignitionBtn.style.opacity = "0.5";
    
    document.body.classList.add("screen-shake-active");
    document.getElementById("system-status").textContent = "IGNITING";
    document.getElementById("system-status").className = "font-f1 text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse";
    
    let currentRpm = 0;
    rpmInterval = setInterval(() => {
        currentRpm += 375;
        if (currentRpm >= 15000) {
            currentRpm = 15000;
            clearInterval(rpmInterval);
            triggerLightsSequence();
        }
        
        const percent = (currentRpm / 15000) * 100;
        document.getElementById("rpm-bar").style.width = percent + "%";
        document.getElementById("rpm-text").textContent = Math.floor(currentRpm) + " RPM";
        
        updateEngineRPM(currentRpm);
    }, 40);
});

function triggerLightsSequence() {
    const lights = document.querySelectorAll(".race-light");
    let count = 0;
    
    document.getElementById("system-status").textContent = "ARMED";
    document.getElementById("system-status").className = "font-f1 text-[10px] text-f1-gold bg-f1-gold/10 px-2 py-0.5 rounded border border-f1-gold/20 animate-pulse";
    
    const lightsInterval = setInterval(() => {
        if (count < 5) {
            lights[count].style.backgroundColor = "#ff1801";
            lights[count].style.boxShadow = "0 0 15px #ff1801";
            playRadioBeep();
            count++;
        } else {
            clearInterval(lightsInterval);
            
            const delay = 1000 + Math.random() * 800;
            setTimeout(() => {
                lights.forEach(l => {
                    l.style.backgroundColor = "#18181b";
                    l.style.boxShadow = "none";
                });
                
                playTireScreech();
                document.body.classList.add("screen-shake-active");
                
                const carFlyby = document.getElementById("car-flyby");
                carFlyby.style.opacity = "1";
                carFlyby.style.left = "120%";
                
                const cinematicMsg = document.getElementById("cinematic-msg");
                cinematicMsg.textContent = "LIGHTS OUT";
                cinematicMsg.classList.remove("opacity-0");
                cinematicMsg.style.transform = "scale(1.2)";
                cinematicMsg.style.opacity = "1";
                
                setTimeout(() => {
                    cinematicMsg.textContent = "AND AWAY WE GO!";
                    cinematicMsg.style.transform = "scale(1.4)";
                }, 800);
                
                setTimeout(() => {
                    document.getElementById("intro-screen").style.opacity = "0";
                    setTimeout(() => {
                        document.getElementById("intro-screen").style.display = "none";
                        document.body.classList.remove("screen-shake-active");
                        
                        updateEngineRPM(950);
                    }, 1000);
                }, 2000);
                
            }, delay);
        }
    }, 700);
}

// --- CORE NAVIGATION CONTROLLER ---
function navigateTo(pageId) {
    playRadioBeep();
    
    const containers = document.querySelectorAll(".page-container");
    containers.forEach(c => {
        c.classList.remove("active-page");
    });
    
    const activeTarget = document.getElementById("page-" + pageId);
    if (activeTarget) {
        activeTarget.classList.add("active-page");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    const links = document.querySelectorAll(".nav-link");
    links.forEach(l => {
        l.classList.remove("text-white", "font-semibold");
    });
    
    event?.target?.classList?.add("text-white", "font-semibold");

    if (pageId === 'garage') {
        switchGarageTab('showroom');
    }
}

function changeTheme(themeName) {
    playRadioBeep();
    document.body.setAttribute("data-theme", themeName);
    showNotification("THEME CALIBRATION", `Active F1VERSE styling adapted to: ${themeName.toUpperCase()}`, "info");
    
    // Rebuild 3D car to apply new theme paint color immediately
    if (typeof carGroup !== "undefined" && carGroup && document.getElementById("page-garage").classList.contains("active-page") && !document.getElementById("garage-tab-showroom").classList.contains("hidden")) {
        buildProceduralF1Car();
    }
}

// --- DYNAMIC DUAL HUD BACKGROUND CHAMBER ---
const standingCanvas = document.getElementById("standing-chart");
if (standingCanvas) {
    const ctx = standingCanvas.getContext("2d");
    let chartStep = 0;
    
    function drawStandingChart() {
        if (!standingCanvas) return;
        ctx.clearRect(0, 0, standingCanvas.width, standingCanvas.height);
        const w = standingCanvas.width = standingCanvas.clientWidth;
        const h = standingCanvas.height = standingCanvas.clientHeight;
        
        ctx.strokeStyle = "rgba(255,255,255,0.02)";
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }
        for (let j = 0; j < h; j += 25) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(w, j);
            ctx.stroke();
        }
        
        chartStep += 0.02;
        
        // Hamilton Track (Red)
        ctx.strokeStyle = "#FF1801";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255,24,1,0.5)";
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const y = h/2 - 10 + Math.sin(x * 0.01 + chartStep) * 20;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Verstappen (Yellow)
        ctx.strokeStyle = "#FFEC00";
        ctx.shadowColor = "rgba(255,236,0,0.5)";
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const y = h/2 + 15 + Math.cos(x * 0.008 + chartStep) * 25;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Leclerc (Teal)
        ctx.strokeStyle = "#00A19B";
        ctx.shadowColor = "rgba(0,161,155,0.5)";
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const y = h/2 + Math.sin(x * 0.012 - chartStep) * 30;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        requestAnimationFrame(drawStandingChart);
    }
    drawStandingChart();
}

// --- DAMP WEATHER / GP COUNTDOWN DEVIATOR ---
function updateGPCountdown() {
    const targetDate = new Date("Jun 7, 2026 16:00:00").getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) return;
    
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("days").textContent = d.toString().padStart(2, '0');
    document.getElementById("hours").textContent = h.toString().padStart(2, '0');
    document.getElementById("minutes").textContent = m.toString().padStart(2, '0');
    document.getElementById("seconds").textContent = s.toString().padStart(2, '0');
}
setInterval(updateGPCountdown, 1000);

// --- HOLOGRAPHIC 3D CAR ROTATOR ENGINE (THREE.JS WebGL) ---
let scene, camera, renderer, controls;
let carGroup; // The parent group holding all procedural components
let currentViewMode = "real"; // "real", "hologram", "aero", "exploded", "xray"
let selectedCarId = "redbull";
let airParticles = []; // Wind tunnel flow points
let laserScannerMesh; // The sweeping horizontal plane mesh
let isShowroomCinematicActive = false;
let cinematicTime = 0;

// Exploded View positions mapping
const EXPLODED_OFFSETS = {
    frontWing: new THREE.Vector3(0, 0, -2.5),
    rearWing: new THREE.Vector3(0, 0, 2.5),
    chassis: new THREE.Vector3(0, 0, 0),
    floor: new THREE.Vector3(0, -0.8, 0),
    suspension: new THREE.Vector3(0, 0, 0),
    wheelsLF: new THREE.Vector3(-1.8, 0, -1.2),
    wheelsRF: new THREE.Vector3(1.8, 0, -1.2),
    wheelsLR: new THREE.Vector3(-1.8, 0, 1.2),
    wheelsRR: new THREE.Vector3(1.8, 0, 1.2),
    halo: new THREE.Vector3(0, 1.2, 0),
    engine: new THREE.Vector3(0, 1.5, 0.4)
};

// Component References for animation LERPs
let carParts = {};

// Hierarchy Disposal Utility to prevent GPU memory leaks
function disposeHierarchy(obj) {
    if (!obj) return;
    obj.traverse(child => {
        if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    });
}

// Detailed Technical Specs for Exploded Raycast selects
const PART_DETAILS = {
    frontWing: "Front Wing Assembly - Generates up to 38% of total front-end downforce. Configured with adjustable multi-element flaps to fine-tune steering bite.",
    rearWing: "Rear Wing & DRS flap - Drag Reduction System active. Provides crucial rear stability. Retracts flap to increase top speed by 12-14 km/h.",
    chassis: "Monocoque Carbon Chassis - Constructed from layers of high-tensile carbon fiber and honeycomb structures to absorb severe G-force impact grids.",
    floor: "Venturi Underbody Tunnel - Utilizes ground-effect vacuum channels to generate extreme low-pressure regions, sucking the car down to the asphalt.",
    suspension: "Pushrod Suspension Arms - Integrates carbon links and internal torsion bars to maintain consistent tire contact patch ratios during heavy curb loads.",
    halo: "Halo Titanium Guard - Ultra-high-strength cage built to withstand loads of up to 125kN, protecting the driver from heavy flying debris.",
    engine: "1.6L V6 Turbo Hybrid Power Unit - Generates 1,020+ HP. Seamlessly links thermal exhaust turbochargers with kinetic MGU-K recovery systems.",
    wheelsLF: "LF Wheel & Brake Caliper - Carbon-ceramic brake rotors operating at up to 1000°C. Wrapped in Pirelli custom slick compounds.",
    wheelsRF: "RF Wheel & Brake Caliper - Calibrated to expulse heat vectors away from suspension structures.",
    wheelsLR: "LR Wheel - Heavy traction tires designed to withstand longitudinal acceleration forces of up to 4.5G.",
    wheelsRR: "RR Wheel - Critical rear power-transfer contact patches."
};

const OrbitControls = THREE.OrbitControls || window.OrbitControls;

let isGarageLoopRunning = false;

function initThreeGarage() {
    const container = document.getElementById("garage-viewer-container");
    const canvas = document.getElementById("garage-canvas");
    if (!canvas) return;

    if (renderer) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        controls.target.set(0, 0.5, 0);
        controls.update();
        if (!isGarageLoopRunning) {
            isGarageLoopRunning = true;
            animate();
        }
        return;
    }

    // Create Scene, Camera, WebGLRenderer
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.015);

    camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below floor
    controls.minDistance = 3;
    controls.maxDistance = 25;

    // Volumetric/Spot lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 15, 5);
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 10, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Laser scan sweeping plane mesh
    const laserGeo = new THREE.BoxGeometry(6, 0.05, 4);
    const laserMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
    });
    laserScannerMesh = new THREE.Mesh(laserGeo, laserMat);
    laserScannerMesh.position.y = 1;
    scene.add(laserScannerMesh);

    // Dynamic wind tunnel particle setup
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = Math.random() * 12 - 6;      // X
        posArray[i + 1] = Math.random() * 2 + 0.1; // Y
        posArray[i + 2] = Math.random() * 15 - 7.5; // Z
        airParticles.push({
            speed: 0.15 + Math.random() * 0.1,
            startX: posArray[i]
        });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        color: 0x00fff9,
        transparent: true,
        opacity: 0.0
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);
    carParts.aeroParticles = particleSystem;

    // Generate Procedural F1 Car Mesh
    buildProceduralF1Car();

    // Raycast Selector for Exploded components
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvas.addEventListener('click', (e) => {
        if (currentViewMode !== "exploded") return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(carGroup.children, true);

        if (intersects.length > 0) {
            let hitObject = intersects[0].object;
            // Traverse up to find parent in carParts
            let partKey = null;
            while (hitObject && hitObject !== scene) {
                for (let key in carParts) {
                    if (carParts[key] === hitObject) {
                        partKey = key;
                        break;
                    }
                }
                if (partKey) break;
                hitObject = hitObject.parent;
            }

            if (partKey && PART_DETAILS[partKey]) {
                playRadioBeep();
                const card = document.getElementById("exploded-part-card");
                card.classList.remove("hidden");
                document.getElementById("part-title").textContent = partKey.replace(/LF|RF|LR|RR/, "").toUpperCase();
                document.getElementById("part-desc").textContent = PART_DETAILS[partKey];
            }
        }
    });

    // Render Animation Loop
    let sweepDir = 1;
    function animate() {
        if (document.getElementById("garage-tab-showroom").classList.contains("hidden") || 
            !document.getElementById("page-garage").classList.contains("active-page")) {
            isGarageLoopRunning = false;
            return;
        }
        requestAnimationFrame(animate);

        // Update OrbitControls
        controls.update();

        // Laser scan plane animation
        if (currentViewMode === "hologram") {
            laserScannerMesh.visible = true;
            laserScannerMesh.position.y += 0.02 * sweepDir;
            if (laserScannerMesh.position.y > 2.2 || laserScannerMesh.position.y < -0.2) {
                sweepDir *= -1;
            }
        } else {
            laserScannerMesh.visible = false;
        }

        // Aero Vision Wind tunnel particle stream movement
        if (currentViewMode === "aero") {
            particleSystem.material.opacity = 0.85;
            const positions = particleGeo.attributes.position.array;
            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i + 2] -= airParticles[i / 3].speed; // Move Z forward
                
                // Curve particles over the cockpit / chassis center bounds
                if (Math.abs(positions[i]) < 0.8 && positions[i + 2] > -2 && positions[i + 2] < 2) {
                    positions[i + 1] = 0.8 + Math.sin((positions[i + 2] + 2) * 0.8) * 0.4;
                } else {
                    positions[i + 1] = Math.max(0.1, positions[i + 1] - 0.005);
                }

                if (positions[i + 2] < -7.5) {
                    positions[i + 2] = 7.5;
                    positions[i] = Math.random() * 12 - 6;
                    positions[i + 1] = Math.random() * 2 + 0.1;
                }
            }
            particleGeo.attributes.position.needsUpdate = true;
        } else {
            particleSystem.material.opacity = 0.0;
        }

        // Exploded / Normal component coordinates Interpolation LERPs
        for (let key in EXPLODED_OFFSETS) {
            const part = carParts[key];
            if (part) {
                const target = currentViewMode === "exploded" ? EXPLODED_OFFSETS[key] : new THREE.Vector3(0,0,0);
                part.position.lerp(target, 0.08);
            }
        }

        // Rotate wheels slightly while rotating group
        if (carParts.wheelsLF) carParts.wheelsLF.rotation.x += 0.01;
        if (carParts.wheelsRF) carParts.wheelsRF.rotation.x += 0.01;
        if (carParts.wheelsLR) carParts.wheelsLR.rotation.x += 0.01;
        if (carParts.wheelsRR) carParts.wheelsRR.rotation.x += 0.01;

        // Cinematic view camera pan
        if (isShowroomCinematicActive) {
            cinematicTime += 0.01;
            camera.position.x = Math.sin(cinematicTime) * 12;
            camera.position.z = Math.cos(cinematicTime) * 12;
            camera.position.y = 3 + Math.sin(cinematicTime * 2) * 2;
            camera.lookAt(new THREE.Vector3(0, 0.5, 0));
        }

        // Rotate car on platform slowly
        if (carGroup && !isMouseDown) {
            carGroup.rotation.y += 0.003;
        }

        renderer.render(scene, camera);
    }
    
    // Track mouse holds to pause auto rotation
    let isMouseDown = false;
    canvas.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);

    isGarageLoopRunning = true;
    animate();
}

function buildProceduralF1Car() {
    if (carGroup) {
        disposeHierarchy(carGroup);
        scene.remove(carGroup);
    }
    carGroup = new THREE.Group();

    // Default Materials setup
    const teamThemeColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#FF1801';
    
    // Materials
    const pbrPaint = new THREE.MeshStandardMaterial({
        color: new THREE.Color(teamThemeColor),
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const darkCarbon = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.7, metalness: 0.1 });
    const chromeRim = new THREE.MeshStandardMaterial({ color: 0x88888a, roughness: 0.1, metalness: 0.9 });
    const tiresRubber = new THREE.MeshStandardMaterial({ color: 0x1b1b1e, roughness: 0.9, metalness: 0.0 });
    const xrayEngineGlow = new THREE.MeshBasicMaterial({ color: 0xff3c00, transparent: true, opacity: 0.95 });
    const xrayBatteryGlow = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.95 });

    // Chassis Monocoque Tube
    const chassisGeo = new THREE.CylinderGeometry(0.4, 0.6, 4.5, 8);
    const chassisMesh = new THREE.Mesh(chassisGeo, pbrPaint);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.y = 0.5;
    carParts.chassis = chassisMesh;
    carGroup.add(chassisMesh);

    // Front Wing
    const fwGroup = new THREE.Group();
    const fwPlateGeo = new THREE.BoxGeometry(3.2, 0.06, 0.5);
    const fwPlate = new THREE.Mesh(fwPlateGeo, pbrPaint);
    fwGroup.add(fwPlate);

    const endplateLGeo = new THREE.BoxGeometry(0.06, 0.3, 0.6);
    const endplateL = new THREE.Mesh(endplateLGeo, darkCarbon);
    endplateL.position.set(-1.6, 0.1, 0);
    const endplateR = endplateL.clone();
    endplateR.position.set(1.6, 0.1, 0);
    fwGroup.add(endplateL, endplateR);

    fwGroup.position.set(0, 0.2, -2.3);
    carParts.frontWing = fwGroup;
    carGroup.add(fwGroup);

    // Rear Wing
    const rwGroup = new THREE.Group();
    const rwPlateGeo = new THREE.BoxGeometry(2.0, 0.06, 0.6);
    const rwPlate = new THREE.Mesh(rwPlateGeo, pbrPaint);
    rwPlate.position.y = 1.1;
    rwGroup.add(rwPlate);

    const rwStrutLGeo = new THREE.BoxGeometry(0.06, 0.8, 0.1);
    const rwStrutL = new THREE.Mesh(rwStrutLGeo, darkCarbon);
    rwStrutL.position.set(-0.9, 0.7, 0.2);
    const rwStrutR = rwStrutL.clone();
    rwStrutR.position.set(0.9, 0.7, 0.2);
    rwGroup.add(rwStrutL, rwStrutR);

    rwGroup.position.set(0, 0, 2.1);
    carParts.rearWing = rwGroup;
    carGroup.add(rwGroup);

    // Floor Plate
    const floorGeo = new THREE.BoxGeometry(1.6, 0.05, 3.8);
    const floorMesh = new THREE.Mesh(floorGeo, darkCarbon);
    floorMesh.position.set(0, 0.1, 0);
    carParts.floor = floorMesh;
    carGroup.add(floorMesh);

    // Halo protection bar
    const haloGeo = new THREE.TorusGeometry(0.35, 0.06, 8, 24, Math.PI);
    const haloMesh = new THREE.Mesh(haloGeo, darkCarbon);
    haloMesh.rotation.x = Math.PI / 2 + 0.2;
    haloMesh.position.set(0, 0.8, -0.4);
    carParts.halo = haloMesh;
    carGroup.add(haloMesh);

    // Wheels & Suspensions
    const createWheelAssembly = (x, y, z, name) => {
        const assembly = new THREE.Group();
        
        // Susp link rod
        const rodGeo = new THREE.CylinderGeometry(0.03, 0.03, Math.abs(x) - 0.2);
        const rod = new THREE.Mesh(rodGeo, darkCarbon);
        rod.rotation.z = Math.PI / 2;
        rod.position.x = x / 2;
        assembly.add(rod);

        // Wheel tire
        const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.45, 16);
        const tire = new THREE.Mesh(wheelGeo, tiresRubber);
        tire.rotation.z = Math.PI / 2;
        tire.position.x = x;
        assembly.add(tire);

        // Inner rim
        const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.47, 12);
        const rim = new THREE.Mesh(rimGeo, chromeRim);
        rim.rotation.z = Math.PI / 2;
        rim.position.x = x;
        assembly.add(rim);

        assembly.position.set(0, y, z);
        carParts[name] = assembly;
        carGroup.add(assembly);
    };

    createWheelAssembly(-1.2, 0.35, -1.2, "wheelsLF");
    createWheelAssembly(1.2, 0.35, -1.2, "wheelsRF");
    createWheelAssembly(-1.2, 0.35, 1.2, "wheelsLR");
    createWheelAssembly(1.2, 0.35, 1.2, "wheelsRR");

    // Internal Power Unit (X-Ray contents)
    const engineGroup = new THREE.Group();
    const engineBlockGeo = new THREE.BoxGeometry(0.4, 0.45, 0.7);
    const engineBlock = new THREE.Mesh(engineBlockGeo, xrayEngineGlow);
    engineBlock.position.set(0, 0.4, 0.6);
    engineGroup.add(engineBlock);

    const batteryBlockGeo = new THREE.BoxGeometry(0.4, 0.15, 0.5);
    const batteryBlock = new THREE.Mesh(batteryBlockGeo, xrayBatteryGlow);
    batteryBlock.position.set(0, 0.15, 0.6);
    engineGroup.add(batteryBlock);

    carParts.engine = engineGroup;
    carGroup.add(engineGroup);

    // Default: Internal PU is hidden unless X-Ray is on
    engineGroup.visible = false;

    scene.add(carGroup);
}

function setGarageViewMode(mode) {
    currentViewMode = mode;
    playRadioBeep();

    // Toggle button active visual states
    const modes = ["real", "holo", "aero", "exploded", "xray"];
    modes.forEach(m => {
        const btn = document.getElementById("btn-mode-" + (m === 'hologram' ? 'holo' : m));
        if (btn) {
            if (m === mode) {
                btn.classList.add("bg-f1-red", "border-f1-red", "text-white");
            } else {
                btn.classList.remove("bg-f1-red", "border-f1-red", "text-white");
            }
        }
    });

    const activeThemeColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#FF1801';

    // Apply material adaptations
    if (mode === "real" || mode === "aero" || mode === "exploded") {
        buildProceduralF1Car(); // Rebuild standard car first to restore materials
    } else {
        carGroup.traverse(child => {
            if (child.isMesh) {
                if (mode === "hologram") {
                    // Neon glow wireframe
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0x00f0ff,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.3
                    });
                } else if (mode === "xray") {
                    // Transparent shell with outlines
                    if (child === carParts.chassis || child.parent === carParts.frontWing || child.parent === carParts.rearWing || child.parent === carParts.halo) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x00f0ff,
                            transparent: true,
                            opacity: 0.08,
                            wireframe: true
                        });
                    }
                }
            }
        });
    }

    // Handle X-Ray Engine mesh visibility
    if (carParts.engine) {
        carParts.engine.visible = (mode === "xray" || mode === "exploded");
    }

    if (mode === "exploded") {
        showNotification("EXPLODED VIEW ACTIVE", "Click components to view diagnostic specifications.", "info");
    } else {
        closePartDetails();
    }
}

function triggerShowroomCinematic() {
    playRadioBeep();
    if (isShowroomCinematicActive) {
        isShowroomCinematicActive = false;
        controls.enabled = true;
        camera.position.set(0, 5, 12);
        showNotification("CINEMATIC COMPLETED", "Showroom auto camera orbit disabled.", "info");
    } else {
        isShowroomCinematicActive = true;
        controls.enabled = false;
        cinematicTime = 0;
        
        // Rev engine sound full range
        updateEngineRPM(12000);
        setTimeout(() => {
            updateEngineRPM(950);
        }, 1200);
        
        showNotification("SHOWROOM CINEMATIC", "Tony Stark showroom fly-by activated.", "success");
    }
}

function closePartDetails() {
    const card = document.getElementById("exploded-part-card");
    if (card) card.classList.add("hidden");
}

// --- TAB ROUTER SWITCHER ---
function switchGarageTab(tabId) {
    playRadioBeep();
    
    // Hide all tab screens
    document.getElementById("garage-tab-showroom").classList.add("hidden");
    document.getElementById("garage-tab-compare").classList.add("hidden");
    document.getElementById("page-rd-lab").classList.add("hidden");
    
    // Reset buttons
    document.getElementById("tab-garage-btn").className = "glass-button text-[9px] px-4 py-1.5 bg-transparent border-none";
    document.getElementById("tab-comparison-btn").className = "glass-button text-[9px] px-4 py-1.5 bg-transparent border-none";
    document.getElementById("tab-lab-btn").className = "glass-button text-[9px] px-4 py-1.5 bg-transparent border-none";
    
    if (tabId === 'showroom') {
        document.getElementById("garage-tab-showroom").classList.remove("hidden");
        document.getElementById("tab-garage-btn").className = "glass-button text-[9px] px-4 py-1.5 bg-f1-red border-f1-red text-white";
        // Reset view viewport sizing
        setTimeout(initThreeGarage, 50);
    } else if (tabId === 'compare') {
        document.getElementById("garage-tab-compare").classList.remove("hidden");
        document.getElementById("tab-comparison-btn").className = "glass-button text-[9px] px-4 py-1.5 bg-f1-red border-f1-red text-white";
        setTimeout(initComparisonChamber, 50);
    } else if (tabId === 'lab') {
        document.getElementById("page-rd-lab").classList.remove("hidden");
        document.getElementById("tab-lab-btn").className = "glass-button text-[9px] px-4 py-1.5 bg-f1-red border-f1-red text-white";
        setTimeout(initRdLabEngine, 50);
    }
}

// --- TAB 2: CAR COMPARISON CHAMBER ---
let compScene, compCamera, compRenderer, compControls;
let compCarL, compCarR;
let compMaterialMode = "real";

let isCompareLoopRunning = false;

function initComparisonChamber() {
    const canvas = document.getElementById("comparison-canvas");
    if (!canvas) return;

    if (compRenderer) {
        compRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        compCamera.aspect = canvas.clientWidth / canvas.clientHeight;
        compCamera.updateProjectionMatrix();
        compControls.target.set(0, 0, 0);
        compControls.update();
        if (!isCompareLoopRunning) {
            isCompareLoopRunning = true;
            animateCompare();
        }
        return;
    }

    compScene = new THREE.Scene();
    compScene.fog = new THREE.FogExp2(0x050508, 0.02);

    compCamera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    compCamera.position.set(0, 4, 11);

    compRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    compRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    compRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    compControls = new OrbitControls(compCamera, compRenderer.domElement);
    compControls.enableDamping = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    compScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, 10, 5);
    compScene.add(dirLight);

    buildComparisonCars();

    function animateCompare() {
        if (document.getElementById("garage-tab-compare").classList.contains("hidden") || 
            !document.getElementById("page-garage").classList.contains("active-page")) {
            isCompareLoopRunning = false;
            return;
        }
        requestAnimationFrame(animateCompare);
        compControls.update();
        compRenderer.render(compScene, compCamera);
    }
    
    isCompareLoopRunning = true;
    animateCompare();
    runCarComparison();
}

function buildComparisonCars() {
    if (compCarL) {
        disposeHierarchy(compCarL);
        compScene.remove(compCarL);
    }
    if (compCarR) {
        disposeHierarchy(compCarR);
        compScene.remove(compCarR);
    }

    // Procedural Car Builders side-by-side
    compCarL = new THREE.Group();
    compCarR = new THREE.Group();

    const drawCompareCar = (group, teamColor) => {
        const mat = compMaterialMode === 'wire' ? 
            new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true }) :
            new THREE.MeshStandardMaterial({
                color: new THREE.Color(teamColor),
                metalness: 0.9,
                roughness: 0.2,
                transparent: compMaterialMode === 'holo',
                opacity: compMaterialMode === 'holo' ? 0.3 : 1.0,
                wireframe: compMaterialMode === 'holo'
            });

        const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 4.0, 8), mat);
        ch.rotation.x = Math.PI/2;
        ch.position.y = 0.5;
        group.add(ch);

        const wing = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 0.4), mat);
        wing.position.set(0, 0.2, -2.1);
        group.add(wing);

        // Simple Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 8);
        const wMat = new THREE.MeshBasicMaterial({ color: 0x111115 });
        const wLF = new THREE.Mesh(wheelGeo, wMat); wLF.rotation.z = Math.PI/2; wLF.position.set(-1.1, 0.35, -1.0);
        const wRF = wLF.clone(); wRF.position.x = 1.1;
        const wLR = wLF.clone(); wLR.position.set(-1.1, 0.35, 1.0);
        const wRR = wLF.clone(); wRR.position.set(1.1, 0.35, 1.0);
        group.add(wLF, wRF, wLR, wRR);
    };

    const c1 = document.getElementById("compare-select-1").value;
    const c2 = document.getElementById("compare-select-2").value;

    const colors = { redbull: "#001A30", ferrari: "#E00000", mercedes: "#00A19B", mclaren: "#FF8700" };

    drawCompareCar(compCarL, colors[c1]);
    drawCompareCar(compCarR, colors[c2]);

    compCarL.position.set(-2.5, 0, 0);
    compCarR.position.set(2.5, 0, 0);

    compScene.add(compCarL, compCarR);
}

function setCompareMaterial(mode) {
    compMaterialMode = mode;
    playRadioBeep();
    
    const modes = ["real", "holo", "wire"];
    modes.forEach(m => {
        const btn = document.getElementById("btn-comp-" + m);
        if (btn) {
            if (m === mode) btn.classList.add("bg-f1-red", "border-f1-red", "text-white");
            else btn.classList.remove("bg-f1-red", "border-f1-red", "text-white");
        }
    });

    buildComparisonCars();
}

function runCarComparison() {
    const c1 = document.getElementById("compare-select-1").value;
    const c2 = document.getElementById("compare-select-2").value;

    const carL = DEFAULT_CARS[c1];
    const carR = DEFAULT_CARS[c2];
    if (!carL || !carR) return;

    document.getElementById("comp-hp-txt").textContent = `${carL.hp} vs ${carR.hp} HP`;
    document.getElementById("comp-aero-txt").textContent = `${carL.aero} vs ${carR.aero}`;
    document.getElementById("comp-speed-txt").textContent = `${carL.speed} vs ${carR.speed}`;

    // Update progress charts width
    const ratioHp = (carL.hp / (carL.hp + carR.hp)) * 100;
    const ratioAero = (parseInt(carL.aero) / (parseInt(carL.aero) + parseInt(carR.aero))) * 100;
    const ratioSpeed = (parseInt(carL.speed) / (parseInt(carL.speed) + parseInt(carR.speed))) * 100;

    document.getElementById("comp-hp-fill").style.width = ratioHp + "%";
    document.getElementById("comp-aero-fill").style.width = ratioAero + "%";
    document.getElementById("comp-speed-fill").style.width = ratioSpeed + "%";

    buildComparisonCars();
}

// --- TAB 3: F1 DEVELOPMENT LAB (R&D CENTER) ---
let rdScene, rdCamera, rdRenderer, rdControls;
let rdCarMesh = null;
let currentRdEra = 1950;

const ERA_DATA = {
    1950: { title: "1950s: Cigar & Spoke wheels", desc: "Simple cylindrical body monocoques, spoked tires, and absolutely zero wing assemblies. Zero downforce aerodynamics.", code: "F1-50S", aero: "0%" },
    1970: { title: "1970s: Airboxes & Wide Wings", desc: "Introduction of massive overhead engine air scoop chimneys and crude, wide front/rear downforce wings.", code: "F1-70S", aero: "42%" },
    1990: { title: "1990s: Pointy Nose Cones", desc: "Sleek low-nosed profiles, bargeboards, and complex diffuser venturi systems introduced before ground-effects bans.", code: "F1-90S", aero: "65%" },
    2010: { title: "2010s: High Spoilers & DRS", desc: "Highly refined wind tunnel carbon bodies, shark fin panels, and DRS rear wings for long straights.", code: "F1-10S", aero: "85%" },
    2026: { title: "2026s: Active Aerodynamics", desc: "Venturi ground-effect floors, active front/rear wings, and eco hybrid electronic energy recovery loops.", code: "F1-26S", aero: "98%" }
};

let isRdLoopRunning = false;

function initRdLabEngine() {
    const canvas = document.getElementById("rd-lab-canvas");
    if (!canvas) return;

    if (rdRenderer) {
        rdRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        rdCamera.aspect = canvas.clientWidth / canvas.clientHeight;
        rdCamera.updateProjectionMatrix();
        rdControls.target.set(0, 0, 0);
        rdControls.update();
        if (!isRdLoopRunning) {
            isRdLoopRunning = true;
            animateRd();
        }
        return;
    }

    rdScene = new THREE.Scene();
    rdCamera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    rdCamera.position.set(0, 4, 10);

    rdRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    rdRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rdRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    rdControls = new OrbitControls(rdCamera, rdRenderer.domElement);
    rdControls.enableDamping = true;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 5);
    rdScene.add(ambient, dir);

    buildRdLabCar();

    function animateRd() {
        if (document.getElementById("page-rd-lab").classList.contains("hidden") || 
            !document.getElementById("page-garage").classList.contains("active-page")) {
            isRdLoopRunning = false;
            return;
        }
        requestAnimationFrame(animateRd);
        rdControls.update();
        if (rdCarMesh) rdCarMesh.rotation.y += 0.005;
        rdRenderer.render(rdScene, rdCamera);
    }
    
    isRdLoopRunning = true;
    animateRd();
}

function buildRdLabCar() {
    if (rdCarMesh) {
        disposeHierarchy(rdCarMesh);
        rdScene.remove(rdCarMesh);
    }
    rdCarMesh = new THREE.Group();

    const mat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2, metalness: 0.8, wireframe: true });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.9 });

    if (currentRdEra === 1950) {
        // Cigar chassis
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 4.0, 8), mat);
        cyl.rotation.x = Math.PI / 2;
        rdCarMesh.add(cyl);
        
        // Spoke narrow tires
        const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.2, 12);
        const tLF = new THREE.Mesh(tireGeo, tireMat); tLF.rotation.z = Math.PI/2; tLF.position.set(-0.8, 0, -1.5);
        const tRF = tLF.clone(); tRF.position.x = 0.8;
        const tLR = tLF.clone(); tLR.position.set(-0.8, 0, 1.5);
        const tRR = tLF.clone(); tRR.position.x = 0.8;
        rdCarMesh.add(tLF, tRF, tLR, tRR);

    } else if (currentRdEra === 1970) {
        // Blocky chassis + giant airbox chimney
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 3.8), mat);
        const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.3, 0.9, 8), mat);
        chimney.position.set(0, 0.6, 0.3);
        rdCarMesh.add(body, chimney);

        // Crude wings
        const fWing = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.3), mat); fWing.position.set(0, -0.2, -2.0);
        const rWing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.5), mat); rWing.position.set(0, 0.8, 2.0);
        rdCarMesh.add(fWing, rWing);

        // Giant rear wheels
        const frontTireGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.35, 12);
        const rearTireGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.65, 12);
        const tLF = new THREE.Mesh(frontTireGeo, tireMat); tLF.rotation.z = Math.PI/2; tLF.position.set(-1.1, 0, -1.4);
        const tRF = tLF.clone(); tRF.position.x = 1.1;
        const tLR = new THREE.Mesh(rearTireGeo, tireMat); tLR.rotation.z = Math.PI/2; tLR.position.set(-1.3, 0, 1.4);
        const tRR = tLR.clone(); tRR.position.x = 1.3;
        rdCarMesh.add(tLF, tRF, tLR, tRR);

    } else if (currentRdEra === 1990) {
        // Low sleek pointy chassis
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 4.0, 8), mat);
        body.rotation.x = Math.PI/2;
        rdCarMesh.add(body);

        const fWing = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 0.4), mat); fWing.position.set(0, -0.1, -2.2);
        const rWing = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 0.5), mat); rWing.position.set(0, 0.6, 2.1);
        rdCarMesh.add(fWing, rWing);

        // Standard wheels
        const tireGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.45, 12);
        const tLF = new THREE.Mesh(tireGeo, tireMat); tLF.rotation.z = Math.PI/2; tLF.position.set(-1.2, 0, -1.3);
        const tRF = tLF.clone(); tRF.position.x = 1.2;
        const tLR = tLF.clone(); tLR.position.set(-1.2, 0, 1.3);
        const tRR = tLF.clone(); tRR.position.x = 1.2;
        rdCarMesh.add(tLF, tRF, tLR, tRR);

    } else if (currentRdEra === 2010) {
        // High nose cover & shark fin backplate
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.5, 4.2, 8), mat);
        body.rotation.x = Math.PI/2;
        
        const sharkFin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 1.4), mat);
        sharkFin.position.set(0, 0.4, 0.8);
        rdCarMesh.add(body, sharkFin);

        const fWing = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 0.45), mat); fWing.position.set(0, -0.1, -2.3);
        const rWing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.4), mat); rWing.position.set(0, 0.9, 2.2);
        rdCarMesh.add(fWing, rWing);

        const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.45, 12);
        const tLF = new THREE.Mesh(tireGeo, tireMat); tLF.rotation.z = Math.PI/2; tLF.position.set(-1.2, 0, -1.3);
        const tRF = tLF.clone(); tRF.position.x = 1.2;
        const tLR = tLF.clone(); tLR.position.set(-1.2, 0, 1.3);
        const tRR = tLF.clone(); tRR.position.x = 1.2;
        rdCarMesh.add(tLF, tRF, tLR, tRR);

    } else if (currentRdEra === 2026) {
        // Venturi ground effect modern silhouette + Halo loop
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.55, 4.4, 8), mat);
        body.rotation.x = Math.PI/2;
        
        const halo = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 16, Math.PI), mat);
        halo.rotation.x = Math.PI/2;
        halo.position.set(0, 0.6, -0.4);
        rdCarMesh.add(body, halo);

        const fWing = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.05, 0.5), mat); fWing.position.set(0, -0.1, -2.4);
        const rWing = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.6), mat); rWing.position.set(0, 0.8, 2.3);
        rdCarMesh.add(fWing, rWing);

        const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.45, 12);
        const tLF = new THREE.Mesh(tireGeo, tireMat); tLF.rotation.z = Math.PI/2; tLF.position.set(-1.2, 0, -1.4);
        const tRF = tLF.clone(); tRF.position.x = 1.2;
        const tLR = tLF.clone(); tLR.position.set(-1.2, 0, 1.4);
        const tRR = tLF.clone(); tRR.position.x = 1.2;
        rdCarMesh.add(tLF, tRF, tLR, tRR);
    }

    rdScene.add(rdCarMesh);
}

function selectLabEra(year) {
    currentRdEra = parseInt(year);
    playRadioBeep();

    // Toggle active node visuals
    const nodes = [1950, 1970, 1990, 2010, 2026];
    nodes.forEach(y => {
        const node = document.getElementById("rd-node-" + y);
        if (node) {
            if (y === year) node.classList.add("active-node", "border-f1-red");
            else node.classList.remove("active-node", "border-f1-red");
        }
    });

    const data = ERA_DATA[year];
    if (data) {
        document.getElementById("lab-era-title").textContent = data.title;
        document.getElementById("lab-era-desc").textContent = data.desc;
        document.getElementById("lab-era-code").textContent = data.code;
        document.getElementById("lab-era-aero").textContent = data.aero;
    }

    buildRdLabCar();
}

// --- CAR REVEAL CINEMATIC EXPERIENCE ---
function triggerCarReveal(carId) {
    const car = DEFAULT_CARS[carId];
    if (!car) return;
    
    playRadioBeep();
    
    // Close shutter doors
    const sTop = document.getElementById("shutter-top");
    const sBottom = document.getElementById("shutter-bottom");
    const viewer = document.getElementById("garage-viewer-container");
    
    viewer.classList.remove("shutter-open");
    
    setTimeout(() => {
        // Shutter is fully closed. Start pneumatic sounds & update metadata
        playPitStopGun();
        
        selectedCarId = carId;
        document.getElementById("garage-car-name").textContent = car.name;
        document.getElementById("car-detail-pu").textContent = car.pu;
        document.getElementById("car-detail-chassis").textContent = car.chassis;
        document.getElementById("car-detail-speed").textContent = car.speed;
        
        document.getElementById("hud-hp-out").textContent = car.hp + " HP";
        document.getElementById("hud-aero-out").textContent = car.aero;
        
        changeTheme(carId);
        buildProceduralF1Car(); // Rebuild with new colors
        
        // Spawn mist/fog particle elements
        const fogContainer = document.getElementById("fog-container");
        fogContainer.innerHTML = "";
        for (let i = 0; i < 15; i++) {
            const smoke = document.createElement("div");
            smoke.className = "smoke-cloud";
            smoke.style.left = Math.random() * 80 + 10 + "%";
            smoke.style.top = Math.random() * 50 + 40 + "%";
            smoke.style.animationDelay = (i * 100) + "ms";
            fogContainer.appendChild(smoke);
        }
        
        setTimeout(() => {
            // Open shutter doors dynamically
            viewer.classList.add("shutter-open");
            
            // Start high-tech scan materialization sequence
            setGarageViewMode('hologram');
            
            setTimeout(() => {
                setGarageViewMode('xray');
                
                setTimeout(() => {
                    setGarageViewMode('real');
                    // Rev engine sound up and settle
                    updateEngineRPM(9000);
                    setTimeout(() => {
                        updateEngineRPM(950);
                    }, 1000);
                }, 600);
                
            }, 600);
            
        }, 1200);
        
    }, 600);
}


// --- INTERACTIVE TRACK EXPLORER FLYOVER ---
const trackCanvas = document.getElementById("track-flyover-canvas");
let trackLapPercentage = 0;
let activeTrack = "monaco";

if (trackCanvas) {
    const ctx = trackCanvas.getContext("2d");
    
    // Circuit path mapping coordinate nodes
    const TRACK_PATHS = {
        monaco: [
            {x: 50, y: 150}, {x: 100, y: 140}, {x: 150, y: 100},
            {x: 200, y: 60}, {x: 230, y: 80}, {x: 210, y: 120},
            {x: 240, y: 160}, {x: 280, y: 140}, {x: 320, y: 220},
            {x: 260, y: 240}, {x: 180, y: 250}, {x: 120, y: 210},
            {x: 50, y: 150}
        ],
        silverstone: [
            {x: 40, y: 180}, {x: 80, y: 80}, {x: 180, y: 60},
            {x: 240, y: 80}, {x: 280, y: 140}, {x: 340, y: 150},
            {x: 310, y: 220}, {x: 210, y: 240}, {x: 110, y: 230},
            {x: 40, y: 180}
        ],
        monza: [
            {x: 50, y: 100}, {x: 250, y: 80}, {x: 320, y: 150},
            {x: 340, y: 200}, {x: 280, y: 240}, {x: 120, y: 220},
            {x: 80, y: 150}, {x: 50, y: 100}
        ]
    };
    
    function drawTrackExplorer() {
        if (!trackCanvas) return;
        ctx.clearRect(0, 0, trackCanvas.width, trackCanvas.height);
        
        const w = trackCanvas.width = trackCanvas.clientWidth;
        const h = trackCanvas.height = trackCanvas.clientHeight;
        
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }
        
        const path = TRACK_PATHS[activeTrack];
        if (!path) return;
        
        // Draw track outline (Glowing vectors)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        path.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        
        // Draw active racing line
        const activeThemeColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#FF1801';
        ctx.strokeStyle = activeThemeColor;
        ctx.shadowColor = activeThemeColor + "aa";
        ctx.shadowBlur = 8;
        ctx.lineWidth = 3;
        ctx.beginPath();
        path.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        
        // Draw moving F1 dot representing flyover position
        trackLapPercentage += 0.005;
        if (trackLapPercentage > 1.0) trackLapPercentage = 0;
        
        const nodeIdx = Math.floor(trackLapPercentage * (path.length - 1));
        const nextNodeIdx = (nodeIdx + 1) % path.length;
        const currNode = path[nodeIdx];
        const nextNode = path[nextNodeIdx];
        
        const subProgress = (trackLapPercentage * (path.length - 1)) - nodeIdx;
        const dotX = currNode.x + (nextNode.x - currNode.x) * subProgress;
        const dotY = currNode.y + (nextNode.y - currNode.y) * subProgress;
        
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        requestAnimationFrame(drawTrackExplorer);
    }
    drawTrackExplorer();
}

function selectTrack(trackId) {
    const track = DEFAULT_TRACKS[trackId];
    if (!track) return;
    
    playRadioBeep();
    activeTrack = trackId;
    
    document.getElementById("track-meta-title").textContent = track.name;
    document.getElementById("track-meta-desc").textContent = track.desc;
    document.getElementById("track-corners").textContent = track.corners + " Corners";
    document.getElementById("track-laprecord").textContent = track.laprecord;
    document.getElementById("track-drs").textContent = track.drs;
    document.getElementById("track-elevation").textContent = track.elevation;
}

// --- AI STRATEGY HUB & ALT CHAMPIONSHIPS ---
function calculateAITyreStrategy() {
    const rain = parseFloat(document.getElementById("ai-rain-prob").value);
    const wear = parseFloat(document.getElementById("ai-tyre-wear").value);
    
    playRadioBeep();
    
    let recommendation = "";
    if (rain > 60) {
        recommendation = "WET TIRES (Blue) - Tarmac water dispersion threshold exceeded. Opt for heavy treads.";
    } else if (rain > 30) {
        recommendation = "INTERMEDIATE TIRES (Green) - Track moisture levels volatile. Ideal crossover window.";
    } else {
        if (wear > 70) {
            recommendation = "HARD COMPOUND (White) - Degradation maximum. Force tyre longevity.";
        } else {
            recommendation = "SOFT COMPOUND (Red) - Optimum grip thermal window. Push qualifying telemetry.";
        }
    }
    
    showNotification("AI STRATEGY OUTPUT", "Tyre pitstop recommendations recalculated.", "success");
    // Show on screen
    const outBox = document.getElementById("ai-simulated-output");
    outBox.innerHTML = `
        <div class="space-y-2">
            <span class="text-f1-gold font-f1 font-semibold">Tire recommendation:</span>
            <p class="text-white text-xs">${recommendation}</p>
        </div>
    `;
}

function runAIStandingSimulator() {
    const driverAction = document.getElementById("ai-whatif-driver").value;
    playRadioBeep();
    
    let projection = "";
    if (driverAction === 'nor') {
        projection = "NORRIS PROJECTED CHAMPION - Recalculated Monaco GP results adds +25pts to Lando. Verstappen drops to P2 by 4 championship points in final Abu Dhabi decider.";
    } else if (driverAction === 'lec') {
        projection = "FERRARI CONSTRUCTOR THREAT - Leclerc winning Monza boosts Ferrari constructor coefficient by 18%. Ferrari projections overtaking Red Bull Racing for visual grid P1.";
    } else {
        projection = "HAMILTON POLE CLIMB - Lewis winning Silverstone secures historical 105th victory, expanding Mercedes team morale and projecting P3 individual standing tier.";
    }
    
    showNotification("AI SIMULATION COMPLETE", "Alternate standing charts processed.", "success");
    document.getElementById("ai-simulated-output").innerHTML = `
        <div class="space-y-2">
            <span class="text-f1-red font-f1 font-semibold">"What-If" Telemetry Projection:</span>
            <p class="text-white text-xs">${projection}</p>
        </div>
    `;
}

// --- SPOTIFY WRAPPED STORIES SYSTEM ---
let wrappedSlideIndex = 0;
const wrappedSlides = [
    { title: "YOUR F1VERSE RECAP", desc: "Welcome back, Pilot. The telemetry arrays have parsed your data loops for the 2026 season. Let's see your driver wrap!" },
    { title: "FAVORITE CONSTRUCTOR", desc: "Ferrari Passion - You executed 45% of your simulator calibration circuits utilizing the scarlet SF-23 frame!" },
    { title: "ACADEMY LEVEL RECORD", desc: "Active telemetry XP tallying completed: 1,500 XP recorded, unlocking advanced driver frames." },
    { title: "YOUR DRIVER DECAL RECAP", desc: "Pirelli Decal claimed successfully. Best prediction achieved down Monaco GP hairpins!" }
];

function triggerSeasonWrapped() {
    wrappedSlideIndex = 0;
    document.getElementById("wrapped-story-modal").classList.remove("hidden");
    renderWrappedSlide();
}

function closeWrappedStory() {
    playRadioBeep();
    document.getElementById("wrapped-story-modal").classList.add("hidden");
}

function nextWrappedSlide() {
    playRadioBeep();
    wrappedSlideIndex++;
    if (wrappedSlideIndex >= wrappedSlides.length) {
        closeWrappedStory();
    } else {
        renderWrappedSlide();
    }
}

function renderWrappedSlide() {
    const slide = wrappedSlides[wrappedSlideIndex];
    const container = document.getElementById("wrapped-slide-content");
    
    // Update bar indicators
    const bars = document.querySelectorAll(".wrapped-bar");
    bars.forEach((b, idx) => {
        if (idx <= wrappedSlideIndex) {
            b.classList.remove("bg-white/20");
            b.classList.add("bg-f1-red");
        } else {
            b.classList.remove("bg-f1-red");
            b.classList.add("bg-white/20");
        }
    });
    
    container.innerHTML = `
        <span class="telemetry-label font-bold text-f1-gold">SLIDE ${wrappedSlideIndex + 1} OF 4</span>
        <h3 class="font-f1 text-2xl font-black text-white uppercase text-neon-glow">${slide.title}</h3>
        <p class="text-sm text-gray-300 leading-relaxed px-4">${slide.desc}</p>
    `;
}

// --- VISUAL PROGRESSION STORE & SKINS SHOP ---
function buyProfileFrame(frameName, cost) {
    playRadioBeep();
    if (!activeUser) {
        showNotification("SECURITY BLOCK", "Login to spend F1VERSE Coins in shop.", "error");
        return;
    }
    
    if (activeUser.coins < cost) {
        showNotification("INSUFFICIENT FUNDS", "Insufficient coins! Complete academy lessons to earn coins.", "error");
        return;
    }
    
    activeUser.coins -= cost;
    saveDatabase();
    
    // Inject selected active profile frame glow classes onto navbar badge avatar
    const avatarContainer = document.getElementById("user-badge-avatar-container");
    avatarContainer.className = `w-8 h-8 rounded-full flex items-center justify-center bg-f1-red/10 cursor-pointer overflow-hidden relative profile-frame-${frameName}`;
    
    document.getElementById("shop-user-coins").textContent = `${activeUser.coins} Coins`;
    document.getElementById("user-badge-xp").textContent = `${activeUser.xp} XP (${activeUser.rank})`;
    
    showNotification("SKIN ACQUIRED", `Unlocked and equipped the ${frameName.toUpperCase()} frame!`, "success");
}

// --- SOCIAL GRID FEED REACTIONS ---
function handleSocialComment(e) {
    e.preventDefault();
    const input = document.getElementById("social-input");
    const container = document.getElementById("social-feed-container");
    
    const user = activeUser ? activeUser.username : "DriverGuest";
    const commentBox = document.createElement("div");
    commentBox.className = "bg-black/30 p-2.5 rounded border border-white/5 text-xs transition-all duration-300 scale-95 opacity-0";
    commentBox.innerHTML = `
        <div class="flex justify-between font-f1 text-[10px] text-gray-400">
            <span>${user}</span>
            <span>Just now</span>
        </div>
        <p class="text-white mt-1">${input.value}</p>
    `;
    
    container.prepend(commentBox);
    setTimeout(() => {
        commentBox.classList.remove("scale-95", "opacity-0");
    }, 50);
    
    input.value = "";
}

// --- DYNAMIC DRIVERS RENDERING FOR HOME PAGE ---
function renderHomeDrivers() {
    const container = document.getElementById("home-drivers-flex");
    if (!container) return;
    container.innerHTML = "";
    
    DEFAULT_DRIVERS.slice(0, 3).forEach(d => {
        const card = document.createElement("div");
        card.className = "fut-card border-f1-gold hover:scale-105 transition-all";
        card.innerHTML = `
            <div class="fut-rating text-f1-gold">${d.rating}</div>
            <div class="fut-position">${d.id.toUpperCase()}</div>
            <div class="fut-name">${d.name}</div>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" class="fut-avatar">
            <div class="fut-stats">
                <div class="fut-stat-item"><span>PACE</span><span class="fut-stat-val">${d.pace}</span></div>
                <div class="fut-stat-item"><span>QUAL</span><span class="fut-stat-val">${d.qual}</span></div>
                <div class="fut-stat-item"><span>DEF</span><span class="fut-stat-val">${d.def}</span></div>
                <div class="fut-stat-item"><span>IQ</span><span class="fut-stat-val">${d.iq}</span></div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- ACTIVE ACADEMY COURSE SECTOR (TASK 8) ---
function renderAcademyCourses() {
    const grid = document.getElementById("courses-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    dbCourses.forEach(c => {
        const isEnrolled = activeUser?.enrolledCourses?.some(ec => ec.courseId === c.id) || false;
        
        const card = document.createElement("div");
        card.className = "glass-panel p-6 flex flex-col justify-between border-t-4 border-f1-red/60 hover:border-f1-red transition-all duration-300";
        card.innerHTML = `
            <div class="space-y-3">
                <span class="telemetry-label font-bold text-[10px] text-f1-red">${c.category.toUpperCase()}</span>
                <h4 class="font-f1 text-base font-black text-white uppercase">${c.title}</h4>
                <p class="text-xs text-gray-400 leading-relaxed">${c.desc}</p>
            </div>
            
            <div class="flex justify-between items-center mt-6">
                <span class="font-f1 text-lg font-black text-white">$${c.price.toFixed(2)}</span>
                ${isEnrolled ? 
                    `<button onclick="openLearningCockpit('${c.id}')" class="glass-button text-[9px] py-1.5 px-4 bg-green-600 border border-green-500">OPEN PILOT</button>` :
                    `<button onclick="openCourseDetails('${c.id}')" class="glass-button text-[9px] py-1.5 px-4">ENROLL GATEWAY</button>`
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

function openCourseDetails(courseId) {
    const course = dbCourses.find(c => c.id === courseId);
    if (!course) return;
    
    navigateTo("course-detail");
    
    document.getElementById("detail-course-category").textContent = course.category.toUpperCase();
    document.getElementById("detail-course-title").textContent = course.title;
    document.getElementById("detail-course-desc").textContent = course.desc;
    document.getElementById("detail-course-price").textContent = `$${course.price.toFixed(2)}`;
    
    const isEnrolled = activeUser?.enrolledCourses?.some(ec => ec.courseId === course.id) || false;
    
    const countModules = course.modules.length;
    let countLessons = 0;
    course.modules.forEach(m => countLessons += m.lessons.length);
    
    document.getElementById("detail-course-modules-count").textContent = `${countModules} Modules`;
    document.getElementById("detail-course-lessons-count").textContent = `${countLessons} Lessons`;
    
    const mList = document.getElementById("detail-modules-list");
    mList.innerHTML = "";
    
    course.modules.forEach((mod, idx) => {
        const box = document.createElement("div");
        box.className = "bg-black/30 p-4 rounded-lg border border-white/5";
        box.innerHTML = `
            <h5 class="font-f1 text-xs font-bold text-white uppercase">${mod.name}</h5>
            <ul class="mt-2 space-y-2 text-xs text-gray-400">
                ${mod.lessons.map(l => `
                    <li class="flex items-center gap-2">
                        <i data-lucide="play-circle" class="w-3.5 h-3.5 text-f1-red"></i>
                        <span>${l.title}</span>
                    </li>
                `).join('')}
            </ul>
        `;
        mList.appendChild(box);
    });
    
    const btnContainer = document.getElementById("enrollment-btn-container");
    btnContainer.innerHTML = "";
    
    if (isEnrolled) {
        btnContainer.innerHTML = `
            <button onclick="openLearningCockpit('${course.id}')" class="glass-button w-full py-3 bg-green-600 border border-green-500 font-f1 text-xs font-bold tracking-widest">
                OPEN LEARNING COCKPIT
            </button>
        `;
    } else {
        btnContainer.innerHTML = `
            <button onclick="initializeRazorpay('${course.id}')" class="glass-button w-full py-3 bg-f1-gold text-black border border-f1-gold font-f1 text-xs font-bold tracking-widest">
                ENROLL NOW (RAZORPAY TEST)
            </button>
        `;
    }
    
    lucide.createImages();
}

function filterCourses() {
    const search = document.getElementById("course-search").value.toLowerCase();
    const cat = document.getElementById("course-filter-category").value;
    
    const grid = document.getElementById("courses-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    dbCourses.forEach(c => {
        const matchesSearch = c.title.toLowerCase().includes(search) || c.desc.toLowerCase().includes(search);
        const matchesCategory = cat === 'all' || c.category === cat;
        
        if (matchesSearch && matchesCategory) {
            const isEnrolled = activeUser?.enrolledCourses?.some(ec => ec.courseId === c.id) || false;
            const card = document.createElement("div");
            card.className = "glass-panel p-6 flex flex-col justify-between border-t-4 border-f1-red/60 hover:border-f1-red transition-all duration-300";
            card.innerHTML = `
                <div class="space-y-3">
                    <span class="telemetry-label font-bold text-[10px] text-f1-red">${c.category.toUpperCase()}</span>
                    <h4 class="font-f1 text-base font-black text-white uppercase">${c.title}</h4>
                    <p class="text-xs text-gray-400 leading-relaxed">${c.desc}</p>
                </div>
                
                <div class="flex justify-between items-center mt-6">
                    <span class="font-f1 text-lg font-black text-white">$${c.price.toFixed(2)}</span>
                    ${isEnrolled ? 
                        `<button onclick="openLearningCockpit('${c.id}')" class="glass-button text-[9px] py-1.5 px-4 bg-green-600 border border-green-500">OPEN PILOT</button>` :
                        `<button onclick="openCourseDetails('${c.id}')" class="glass-button text-[9px] py-1.5 px-4">ENROLL GATEWAY</button>`
                    }
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

// --- HIGH-TECH RAZORPAY SANDBOX SIMULATOR ---
let currentCheckoutCourseId = null;

function initializeRazorpay(courseId) {
    if (!activeUser) {
        showNotification("SECURITY BLOCK", "Initialize your driver profile license before checkout.", "error");
        openAuthModal('login');
        return;
    }
    
    const course = dbCourses.find(c => c.id === courseId);
    if (!course) return;
    
    currentCheckoutCourseId = courseId;
    
    document.getElementById("rzp-course-title").textContent = course.title;
    document.getElementById("rzp-course-price").textContent = `$${course.price.toFixed(2)}`;
    document.getElementById("razorpay-modal").classList.remove("hidden");
    
    playRadioBeep();
}

function cancelRazorpayPayment() {
    document.getElementById("razorpay-modal").classList.add("hidden");
    showNotification("PAYMENT TRANSACTION", "Razorpay sandboxed checkout transaction aborted by driver.", "warning");
}

function completeRazorpayPayment() {
    const course = dbCourses.find(c => c.id === currentCheckoutCourseId);
    if (!course) return;
    
    document.getElementById("razorpay-modal").classList.add("hidden");
    
    activeUser.enrolledCourses.push({
        courseId: course.id,
        progress: 0,
        completedLessons: []
    });
    
    systemRevenue += course.price;
    activeUser.xp += 250;
    activeUser.coins += 500;
    
    saveDatabase();
    
    showNotification("TELEMETRY CHANNEL SECURED", `Authorized purchase of: ${course.title}. Welcome to the cockpit!`, "success");
    
    checkSponsorUnlock("lesson");
    
    renderAcademyProfile();
    renderAcademyCourses();
    navigateTo("academy");
}

// --- LEARNING SYSTEM COCKPIT ---
let activeLearningCourseId = null;
let activeLessonId = null;

function openLearningCockpit(courseId) {
    const course = dbCourses.find(c => c.id === courseId);
    const userCourse = activeUser?.enrolledCourses?.find(ec => ec.courseId === courseId);
    if (!course || !userCourse) return;
    
    activeLearningCourseId = courseId;
    navigateTo("learning-cockpit");
    
    renderLearningSyllabus(course, userCourse);
    
    const firstLesson = course.modules[0].lessons[0];
    selectActiveLesson(firstLesson.id);
    initTelemetryVisualizer();
}

function renderLearningSyllabus(course, userCourse) {
    const container = document.getElementById("learning-syllabus-container");
    container.innerHTML = "";
    
    let total = 0;
    let completed = 0;
    
    course.modules.forEach(mod => {
        const div = document.createElement("div");
        div.className = "space-y-2";
        div.innerHTML = `<h5 class="font-f1 text-[10px] text-gray-500 uppercase">${mod.name}</h5>`;
        
        const ul = document.createElement("ul");
        ul.className = "space-y-1.5";
        
        mod.lessons.forEach(les => {
            total++;
            const isDone = userCourse.completedLessons.includes(les.id);
            if (isDone) completed++;
            
            const li = document.createElement("li");
            li.className = `p-2 rounded border cursor-pointer transition-colors flex items-center justify-between text-xs ${activeLessonId === les.id ? 'bg-f1-red/15 border-f1-red text-white' : 'bg-black/20 border-white/5 hover:bg-black/40 text-gray-400'}`;
            li.onclick = () => selectActiveLesson(les.id);
            li.innerHTML = `
                <div class="flex items-center gap-2">
                    <i data-lucide="${isDone ? 'check-circle' : 'circle'}" class="w-3.5 h-3.5 ${isDone ? 'text-green-400' : 'text-gray-600'}"></i>
                    <span class="truncate max-w-[140px]">${les.title}</span>
                </div>
            `;
            ul.appendChild(li);
        });
        
        div.appendChild(ul);
        container.appendChild(div);
    });
    
    const percent = total > 0 ? Math.floor((completed / total) * 100) : 0;
    document.getElementById("learning-progress-percent").textContent = percent + "%";
    document.getElementById("learning-progress-bar").style.width = percent + "%";
    
    userCourse.progress = percent;
    saveDatabase();
}

function selectActiveLesson(lessonId) {
    const course = dbCourses.find(c => c.id === activeLearningCourseId);
    let selectedLesson = null;
    
    course.modules.forEach(mod => {
        const found = mod.lessons.find(l => l.id === lessonId);
        if (found) selectedLesson = found;
    });
    
    if (!selectedLesson) return;
    
    activeLessonId = lessonId;
    
    document.getElementById("active-lesson-title").textContent = selectedLesson.title;
    document.getElementById("active-lesson-content").textContent = selectedLesson.content;
    
    const userCourse = activeUser.enrolledCourses.find(ec => ec.courseId === activeLearningCourseId);
    const completeBtn = document.getElementById("complete-lesson-btn");
    
    const isDone = userCourse.completedLessons.includes(lessonId);
    if (isDone) {
        completeBtn.innerHTML = `<i data-lucide="check-square" class="w-4 h-4 mr-1 text-green-400"></i> RESET PROGRESS`;
        completeBtn.className = "glass-button text-xs py-2 px-6 bg-green-950/20 border-green-500 text-green-400";
    } else {
        completeBtn.innerHTML = `<i data-lucide="square" class="w-4 h-4 mr-1"></i> MARK LESSON COMPLETED`;
        completeBtn.className = "glass-button text-xs py-2 px-6 bg-transparent border-f1-red/30 hover:border-f1-red text-white";
    }
    
    renderLearningSyllabus(course, userCourse);
    lucide.createImages();
}

function toggleActiveLessonCompletion() {
    const userCourse = activeUser.enrolledCourses.find(ec => ec.courseId === activeLearningCourseId);
    const isDone = userCourse.completedLessons.includes(activeLessonId);
    
    playRadioBeep();
    
    if (isDone) {
        userCourse.completedLessons = userCourse.completedLessons.filter(id => id !== activeLessonId);
        showNotification("CALIBRATION TRACKING", "Lesson telemetry reset. Complete checks again.", "warning");
    } else {
        userCourse.completedLessons.push(activeLessonId);
        activeUser.xp += 75;
        activeUser.coins += 100;
        saveDatabase();
        showNotification("QUALIFICATION SECURED", "Telemetry checks verified! +75 XP awarded.", "success");
        
        checkSponsorUnlock("lesson");
    }
    
    renderAcademyProfile();
    
    const course = dbCourses.find(c => c.id === activeLearningCourseId);
    selectActiveLesson(activeLessonId);
}

function initTelemetryVisualizer() {
    const canvas = document.getElementById("telemetry-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let xOffset = 0;
    
    function drawTelemetryFrame() {
        if (!canvas || activeLessonId === null) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width = canvas.clientWidth;
        const h = canvas.height = canvas.clientHeight;
        
        xOffset += 1.5;
        
        ctx.strokeStyle = "rgba(224, 0, 0, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const y = h/2 + Math.sin(x * 0.025 + xOffset * 0.05) * 40;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        requestAnimationFrame(drawTelemetryFrame);
    }
    drawTelemetryFrame();
}

function playTelemetryVideo() {
    playRadioBeep();
    showNotification("SIMULATION LAUNCH", "Dynamic circuit lap telemetry synchronized successfully.", "info");
}

// --- JWT AUTHENTICATION SIMULATOR ---
let authMode = "login";

function openAuthModal(mode = "login") {
    authMode = mode;
    const title = document.getElementById("auth-modal-title");
    const signupFields = document.getElementById("signup-fields");
    const toggleBtn = document.getElementById("auth-toggle-btn");
    
    if (mode === 'signup') {
        title.textContent = "REGISTER LICENSE";
        signupFields.classList.remove("hidden");
        toggleBtn.textContent = "Already licensed? Sign In";
    } else {
        title.textContent = "DRIVER SIGN-IN";
        signupFields.classList.add("hidden");
        toggleBtn.textContent = "Need a driver license? Register today";
    }
    
    document.getElementById("auth-modal").classList.remove("hidden");
    document.getElementById("auth-modal").classList.add("flex");
}

function closeAuthModal() {
    document.getElementById("auth-modal").classList.add("hidden");
    document.getElementById("auth-modal").classList.remove("flex");
}

function toggleAuthMode() {
    openAuthModal(authMode === 'login' ? 'signup' : 'login');
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const userVal = document.getElementById("auth-username").value.trim();
    
    if (authMode === 'signup') {
        const emailVal = document.getElementById("auth-email").value.trim();
        activeUser = {
            username: userVal,
            email: emailVal,
            xp: 100,
            coins: 1000,
            rank: "Rookie",
            enrolledCourses: [],
            role: "student"
        };
        showNotification("LICENSE REGISTRATION", `Mock JWT token authorized. Welcoming pilot: ${userVal.toUpperCase()}`, "success");
    } else {
        if (userVal.toLowerCase() === 'admin') {
            activeUser = {
                username: "System Admin",
                email: "admin@f1verse.com",
                xp: 9999,
                coins: 99999,
                rank: "Pit Wall Genius",
                enrolledCourses: [],
                role: "admin"
            };
            showNotification("PIT WALL AUTHORIZATION", "System Admin JWT validated. Control parameters active.", "success");
        } else {
            activeUser = {
                username: userVal,
                email: `${userVal}@driver.com`,
                xp: 150,
                coins: 1200,
                rank: "Strategist",
                enrolledCourses: [],
                role: "student"
            };
            showNotification("COMMS LINK ACTIVE", `Mock JWT verified. Driver Session initialized: ${userVal.toUpperCase()}`, "success");
        }
    }
    
    saveDatabase();
    closeAuthModal();
    syncUserNavbar();
    renderAcademyProfile();
    renderAcademyCourses();
}

function logout() {
    playRadioBeep();
    activeUser = null;
    saveDatabase();
    syncUserNavbar();
    renderAcademyProfile();
    renderAcademyCourses();
    navigateTo("home");
    showNotification("COMMS DE-CALIBRATED", "Driver session terminated safely.", "warning");
}

function syncUserNavbar() {
    const authBtn = document.getElementById("auth-buttons");
    const badge = document.getElementById("user-profile-badge");
    const adminBtn = document.getElementById("admin-nav-btn");
    
    if (activeUser) {
        authBtn.classList.add("hidden");
        badge.classList.remove("hidden");
        
        document.getElementById("user-badge-name").textContent = activeUser.username;
        document.getElementById("user-badge-xp").textContent = `${activeUser.xp} XP (${activeUser.rank})`;
        document.getElementById("shop-user-coins").textContent = `${activeUser.coins} Coins`;
        
        if (activeUser.role === 'admin') {
            adminBtn.classList.remove("hidden");
        } else {
            adminBtn.classList.add("hidden");
        }
    } else {
        authBtn.classList.remove("hidden");
        badge.classList.add("hidden");
        adminBtn.classList.add("hidden");
    }
}

function renderAcademyProfile() {
    const profileSec = document.getElementById("academy-profile-section");
    if (!profileSec) return;
    
    if (activeUser) {
        profileSec.classList.remove("hidden");
        profileSec.classList.add("grid");
        
        document.getElementById("academy-driver-name").textContent = activeUser.username;
        document.getElementById("academy-driver-rank").textContent = activeUser.rank;
        document.getElementById("academy-driver-xp-text").textContent = `${activeUser.xp} XP`;
        
        const xpPercent = Math.min(100, (activeUser.xp / 1000) * 100);
        document.getElementById("academy-driver-xp-progress").style.width = xpPercent + "%";
        
        const progressContainer = document.getElementById("enrolled-courses-progress-container");
        progressContainer.innerHTML = "";
        
        if (activeUser.enrolledCourses.length === 0) {
            progressContainer.innerHTML = `<p class="text-xs text-gray-500 italic py-2">No courses active. Pick one down below to initialize telemetry.</p>`;
        } else {
            activeUser.enrolledCourses.forEach(ec => {
                const c = dbCourses.find(course => course.id === ec.courseId);
                if (c) {
                    const row = document.createElement("div");
                    row.className = "bg-black/30 p-3 rounded-lg border border-white/5 text-left space-y-2 cursor-pointer hover:border-f1-red transition-all" ;
                    row.onclick = () => openLearningCockpit(c.id);
                    row.innerHTML = `
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-semibold text-white truncate max-w-[120px]">${c.title}</span>
                            <span class="font-mono text-f1-gold">${ec.progress}%</span>
                        </div>
                        <div class="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-f1-gold h-full" style="width: ${ec.progress}%"></div>
                        </div>
                    `;
                    progressContainer.appendChild(row);
                }
            });
        }
    } else {
        profileSec.classList.add("hidden");
        profileSec.classList.remove("grid");
    }
}

// --- FANTASY LEAGUE GRID DRAFT SELECTOR ---
let draftedDrivers = [];

function renderFantasyDraft() {
    const grid = document.getElementById("fantasy-drivers-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    DEFAULT_DRIVERS.forEach(d => {
        const isSelected = draftedDrivers.includes(d.id);
        
        const card = document.createElement("div");
        card.className = `glass-panel p-4 flex justify-between items-center transition-all ${isSelected ? 'border-2 border-f1-gold bg-f1-gold/5' : 'border border-white/5 hover:border-white/10'}`;
        card.innerHTML = `
            <div>
                <h4 class="font-f1 text-xs font-bold text-white uppercase">${d.name}</h4>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[8px] text-gray-500 font-f1 uppercase">${d.team}</span>
                    <span class="text-[8px] text-f1-gold font-mono font-bold">RATING: ${d.rating}</span>
                </div>
            </div>
            
            <div class="text-right flex items-center gap-3">
                <span class="font-f1 text-xs text-white font-mono">$${d.price.toFixed(2)}M</span>
                <button onclick="toggleDraftDriver('${d.id}')" class="glass-button text-[9px] py-1 px-3 ${isSelected ? 'bg-red-950/40 text-red-400 border-red-500' : 'bg-f1-gold border-f1-gold text-black'}">
                    ${isSelected ? 'DROP' : 'DRAFT'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    syncFantasyRightPanel();
}

function toggleDraftDriver(driverId) {
    playRadioBeep();
    const isSelected = draftedDrivers.includes(driverId);
    
    if (isSelected) {
        draftedDrivers = draftedDrivers.filter(id => id !== driverId);
    } else {
        if (draftedDrivers.length >= 5) {
            showNotification("DRAFT BLOCK", "Fantasy roster slots fully populated (Max 5).", "error");
            return;
        }
        draftedDrivers.push(driverId);
    }
    renderFantasyDraft();
}

function syncFantasyRightPanel() {
    let spent = 0;
    draftedDrivers.forEach(id => {
        const d = DEFAULT_DRIVERS.find(driver => driver.id === id);
        if (d) spent += d.price;
    });
    
    const budgetRemaining = 100.0 - spent;
    const budgetText = document.getElementById("fantasy-budget");
    budgetText.textContent = `$${budgetRemaining.toFixed(2)}M`;
    
    if (budgetRemaining < 0) {
        budgetText.className = "font-f1 text-xl font-black text-red-500 mt-1 animate-pulse";
    } else {
        budgetText.className = "font-f1 text-xl font-black text-green-400 mt-1";
    }
    
    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`f-slot-${i}`);
        if (draftedDrivers[i-1]) {
            const d = DEFAULT_DRIVERS.find(driver => driver.id === draftedDrivers[i-1]);
            slot.textContent = d.name.toUpperCase();
            slot.className = "text-white font-f1 font-semibold";
        } else {
            slot.textContent = "UNASSIGNED";
            slot.className = "text-gray-500 font-f1";
        }
    }
}

function submitFantasyTeam() {
    playRadioBeep();
    if (draftedDrivers.length === 0) {
        showNotification("ROSTER ERROR", "Draft active drivers before submitting team configurations.", "error");
        return;
    }
    
    let spent = 0;
    draftedDrivers.forEach(id => {
        const d = DEFAULT_DRIVERS.find(driver => driver.id === id);
        if (d) spent += d.price;
    });
    
    if (spent > 100.0) {
        showNotification("BUDGET COMPROMISED", "Draft budget exceeded! Roster must stay below $100M.", "error");
        return;
    }
    
    showNotification("ROSTER SUBMISSION", "Fantasy telemetry layout saved successfully to active leagues.", "success");
    checkSponsorUnlock("fantasy");
}

// --- SPONSOR CONTRACTS & UNLOCK DECALS ---
function renderSponsorsHub() {
    const grid = document.getElementById("sponsors-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    dbSponsors.forEach(s => {
        const card = document.createElement("div");
        card.className = "glass-panel p-6 flex flex-col justify-between border-t-4 border-white/5 space-y-6";
        card.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <div class="p-3 bg-white/5 rounded-lg ${s.color}">
                        <i class="${s.logo} text-2xl"></i>
                    </div>
                    <div>
                        <h4 class="font-f1 text-sm font-black text-white">${s.name}</h4>
                        <span class="text-[8px] text-gray-500 font-f1">ELITE SPONSOR PARTNER</span>
                    </div>
                </div>
                
                <div class="bg-black/30 p-3 rounded border border-white/5 text-xs">
                    <span class="text-gray-400 block font-semibold mb-1">Contract requirement:</span>
                    <p class="text-gray-300">${s.challenge}</p>
                </div>
                
                <div class="text-[10px] text-gray-400">
                    <span>Reward package: </span><span class="${s.color} font-bold font-f1">${s.reward}</span>
                </div>
            </div>
            
            <button onclick="signSponsorContract('${s.id}')" class="glass-button w-full text-xs ${s.unlocked ? 'bg-green-600/20 border-green-500 text-green-400 pointer-events-none' : ''}">
                ${s.unlocked ? 'CONTRACT SECURED' : 'SIGN SPONSOR CONTRACT'}
            </button>
        `;
        grid.appendChild(card);
    });
}

function signSponsorContract(sponsorId) {
    playRadioBeep();
    if (!activeUser) {
        showNotification("SECURITY BLOCK", "Initialize your driver profile license before signing sponsorships.", "error");
        openAuthModal('login');
        return;
    }
    showNotification("CONTRACT INITIATED", `Contract with ${sponsorId.toUpperCase()} signed. Complete the task to claim rewards!`, "info");
}

function checkSponsorUnlock(taskType) {
    dbSponsors.forEach(s => {
        if (s.taskType === taskType && !s.unlocked) {
            s.unlocked = true;
            saveDatabase();
            showNotification("ACHIEVEMENT UNLOCKED", `Sponsor milestone achieved! Unlocked: ${s.reward}`, "success");
            renderSponsorsHub();
            syncGarageDecals();
        }
    });
}

function syncGarageDecals() {
    const list = document.getElementById("unlocked-decals-list");
    if (!list) return;
    list.innerHTML = "";
    
    let activeDecals = dbSponsors.filter(s => s.unlocked);
    if (activeDecals.length === 0) {
        list.innerHTML = `<span class="text-[10px] text-gray-500 bg-neutral-900 border border-white/5 px-2.5 py-1 rounded">No sponsor active</span>`;
    } else {
        activeDecals.forEach(s => {
            const badge = document.createElement("span");
            badge.className = `text-[9px] font-f1 border border-white/10 px-2.5 py-1 rounded bg-black/40 ${s.color} font-semibold uppercase animate-pulse`;
            badge.innerHTML = `<i class="${s.logo} mr-1"></i> ${s.name.split(' ')[0]}`;
            list.appendChild(badge);
        });
    }
}

// --- PIT WALL ADMINISTRATION CRUD VIEW ---
function renderAdminPitWall() {
    const coursesList = document.getElementById("admin-courses-list");
    if (!coursesList) return;
    coursesList.innerHTML = "";
    
    dbCourses.forEach(c => {
        const row = document.createElement("div");
        row.className = "flex justify-between items-center bg-black/40 border border-white/5 p-4 rounded-lg hover:border-white/10 transition-colors";
        row.innerHTML = `
            <div>
                <h4 class="font-f1 text-xs font-bold text-white uppercase">${c.title}</h4>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[8px] text-f1-red bg-f1-red/10 border border-f1-red/20 px-2 rounded font-f1 uppercase">${c.category}</span>
                    <span class="text-[8px] text-gray-400 font-mono">Price: $${c.price.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="flex gap-2">
                <button onclick="openCourseCrudModal('edit', '${c.id}')" class="glass-button text-[8px] py-1 px-3 bg-blue-900/20 text-blue-400 border border-blue-500/20 hover:border-blue-500">EDIT</button>
                <button onclick="deleteAcademyCourse('${c.id}')" class="glass-button text-[8px] py-1 px-3 bg-red-950/40 text-red-400 border border-red-500/20 hover:border-red-500">DELETE</button>
            </div>
        `;
        coursesList.appendChild(row);
    });
    
    document.getElementById("admin-stat-courses").textContent = dbCourses.length;
    document.getElementById("admin-stat-revenue").textContent = `$${systemRevenue.toFixed(2)}`;
    
    const usersList = document.getElementById("admin-users-list");
    usersList.innerHTML = "";
    
    if (activeUser) {
        const uRow = document.createElement("div");
        uRow.className = "bg-neutral-900/40 border border-white/5 p-3 rounded-md flex justify-between items-center text-xs";
        uRow.innerHTML = `
            <div>
                <span class="text-white font-semibold">${activeUser.username}</span>
                <p class="text-[9px] text-gray-500 font-mono mt-0.5">${activeUser.email}</p>
            </div>
            <span class="text-f1-gold font-mono text-[9px]">${activeUser.xp} XP</span>
        `;
        usersList.appendChild(uRow);
    } else {
        usersList.innerHTML = `<p class="text-xs text-gray-500 italic">No students active in simulator nodes.</p>`;
    }
}

let crudModalMode = "add";

function openCourseCrudModal(mode = "add", courseId = null) {
    crudModalMode = mode;
    const title = document.getElementById("crud-modal-title");
    const cIdField = document.getElementById("crud-course-id");
    
    playRadioBeep();
    
    if (mode === 'edit') {
        title.textContent = "EDIT COURSE TELEMETRY";
        const course = dbCourses.find(c => c.id === courseId);
        
        cIdField.value = course.id;
        document.getElementById("crud-title").value = course.title;
        document.getElementById("crud-category").value = course.category;
        document.getElementById("crud-price").value = course.price;
        document.getElementById("crud-desc").value = course.desc;
    } else {
        title.textContent = "REGISTER NEW TELEMETRY";
        cIdField.value = "";
        document.getElementById("crud-title").value = "";
        document.getElementById("crud-category").value = "aero";
        document.getElementById("crud-price").value = "19.99";
        document.getElementById("crud-desc").value = "";
    }
    
    document.getElementById("course-crud-modal").classList.remove("hidden");
    document.getElementById("course-crud-modal").classList.add("flex");
}

function closeCourseCrudModal() {
    document.getElementById("course-crud-modal").classList.add("hidden");
    document.getElementById("course-crud-modal").classList.remove("flex");
}

function handleCourseCrudSubmit(e) {
    e.preventDefault();
    
    const courseId = document.getElementById("crud-course-id").value;
    const titleVal = document.getElementById("crud-title").value.trim();
    const catVal = document.getElementById("crud-category").value;
    const priceVal = parseFloat(document.getElementById("crud-price").value);
    const descVal = document.getElementById("crud-desc").value.trim();
    
    const demoLessonTitle = document.getElementById("crud-lesson-title").value.trim();
    const demoLessonContent = document.getElementById("crud-lesson-content").value.trim();
    
    if (crudModalMode === 'edit') {
        const course = dbCourses.find(c => c.id === courseId);
        course.title = titleVal;
        course.category = catVal;
        course.price = priceVal;
        course.desc = descVal;
        showNotification("TELEMETRY MODIFIED", "Academy course values committed successfully.", "success");
    } else {
        const newCourse = {
            id: "course-" + Date.now(),
            title: titleVal,
            category: catVal,
            price: priceVal,
            desc: descVal,
            modules: [
                {
                    name: "Module 1: Telemetry Introduction",
                    lessons: [
                        { id: "l-" + Date.now(), title: demoLessonTitle, content: demoLessonContent, completed: false }
                    ]
                }
            ]
        };
        dbCourses.push(newCourse);
        showNotification("TELEMETRY INSTALLED", "New Academy course registered successfully.", "success");
    }
    
    saveDatabase();
    closeCourseCrudModal();
    renderAcademyCourses();
    renderAdminPitWall();
}

function deleteAcademyCourse(courseId) {
    playRadioBeep();
    dbCourses = dbCourses.filter(c => c.id !== courseId);
    saveDatabase();
    renderAcademyCourses();
    renderAdminPitWall();
    showNotification("TELEMETRY ERASED", "Course entry deleted successfully.", "warning");
}

function resetAcademyDatabase() {
    playRadioBeep();
    localStorage.removeItem("f1_courses");
    localStorage.removeItem("f1_sponsors");
    localStorage.removeItem("f1_revenue");
    dbCourses = DEFAULT_COURSES;
    dbSponsors = DEFAULT_SPONSORS;
    systemRevenue = 0;
    saveDatabase();
    
    renderAcademyCourses();
    renderAdminPitWall();
    syncGarageDecals();
    showNotification("DATABASE RE-CALIBRATED", "Registry reset to F1 default configurations.", "warning");
}

// --- COMMS & NOTIFICATION MODULES ---
function showNotification(title, body, type = "info") {
    const toast = document.getElementById("email-notification");
    const tTitle = document.getElementById("email-notif-title");
    const tBody = document.getElementById("email-notif-body");
    
    tTitle.textContent = title;
    tBody.textContent = body;
    
    toast.classList.remove("translate-y-20", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
    
    playRadioBeep();
    
    setTimeout(() => {
        closeNotification();
    }, 4500);
}

function closeNotification() {
    const toast = document.getElementById("email-notification");
    toast.classList.add("translate-y-20", "opacity-0");
    toast.classList.remove("translate-y-0", "opacity-100");
}

function handleContactSubmit(e) {
    e.preventDefault();
    playRadioBeep();
    document.getElementById("contact-form").reset();
    showNotification("TRANSMISSION COMPLETED", "Driver support payload transmitted successfully to pit wall telemetry.", "success");
    
    checkSponsorUnlock("contact");
}

// --- INITIALIZER BOOTSTRAPPER ---
window.addEventListener("DOMContentLoaded", () => {
    lucide.createImages();
    syncUserNavbar();
    renderAcademyCourses();
    renderFantasyDraft();
    renderSponsorsHub();
    renderAdminPitWall();
    syncGarageDecals();
    renderHomeDrivers();
});
