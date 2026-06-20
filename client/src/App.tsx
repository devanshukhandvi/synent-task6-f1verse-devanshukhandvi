import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Power, Volume2, VolumeX, Activity, MapPin, Film, LogOut, Play, 
  CheckSquare, ArrowLeft, Trash2, Plus, RefreshCw, Send
} from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { soundEngine } from './services/soundEngine';
import { OpenF1Service, F1Driver, F1Session, F1Weather, F1Position } from './services/openf1';
import { BackendService, AcademyCourse, UserState } from './services/api';

const HERO_BG = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200";

const DEFAULT_CARS = {
  redbull: { name: "Red Bull Racing RB19", pu: "Honda RBPTH001", hp: 1020, speed: "344 km/h", weight: "798 kg", aero: "96% EFF", drs: "98% EFF", chassis: "RB19-M01", reliability: "95%", desc: "Venturi tunnels and structural aerodynamic efficiency." },
  ferrari: { name: "Ferrari SF-23", pu: "Ferrari 066/10", hp: 1030, speed: "348 km/h", weight: "799 kg", aero: "94% EFF", drs: "93% EFF", chassis: "SF23-F02", reliability: "88%", desc: "Passion-red high horsepower profile with sharp drag configurations." },
  mercedes: { name: "Mercedes W14", pu: "Mercedes-AMG M14", hp: 1015, speed: "342 km/h", weight: "798 kg", aero: "95% EFF", drs: "94% EFF", chassis: "W14-S03", reliability: "97%", desc: "Zero-sidepod body configuration mapping extreme cooling arrays." },
  mclaren: { name: "McLaren MCL60", pu: "Mercedes-AMG M14", hp: 1010, speed: "341 km/h", weight: "798 kg", aero: "97% EFF", drs: "96% EFF", chassis: "MCL60-O04", reliability: "92%", desc: "Papaya speed frame calibrated for high downforce circuits." }
};

const ERA_DATA = {
  1950: { title: "1950s: Cigar & Spoke wheels", desc: "Simple cylindrical body monocoques, spoked tires, and absolutely zero wing assemblies. Zero downforce aerodynamics.", code: "F1-50S", aero: "0%" },
  1970: { title: "1970s: Airboxes & Wide Wings", desc: "Introduction of massive overhead engine air scoop chimneys and crude, wide front/rear downforce wings.", code: "F1-70S", aero: "42%" },
  1990: { title: "1990s: Pointy Nose Cones", desc: "Sleek low-nosed profiles, bargeboards, and complex diffuser venturi systems introduced before ground-effects bans.", code: "F1-90S", aero: "65%" },
  2010: { title: "2010s: High Spoilers & DRS", desc: "Highly refined wind tunnel carbon bodies, shark fin panels, and DRS rear wings for long straights.", code: "F1-10S", aero: "85%" },
  2026: { title: "2026s: Active Aerodynamics", desc: "Venturi ground-effect floors, active front/rear wings, and eco hybrid electronic energy recovery loops.", code: "F1-26S", aero: "98%" }
};

const DEFAULT_TRACKS = {
  monaco: { name: "Circuit de Monaco", corners: 19, laprecord: "1:12.909 (Hamilton)", drs: "1 Zone", elevation: "42m", desc: "Narrow street track featuring sharp corners, close barriers, and extreme qualifying performance weights." },
  silverstone: { name: "Silverstone Circuit", corners: 18, laprecord: "1:27.097 (Verstappen)", drs: "2 Zones", elevation: "11m", desc: "One of the fastest circuits on the calendar, featuring high-speed sweeps like Maggots and Becketts." },
  monza: { name: "Autodromo Nazionale Monza", corners: 11, laprecord: "1:18.887 (Hamilton)", drs: "2 Zones", elevation: "8m", desc: "The legendary Temple of Speed, demanding low-downforce aerodynamic packages and long straight runs." }
};

const FANTASY_DRIVERS = [
  { id: 1, name: "Max Verstappen", team: "Red Bull Racing", price: 34.0, rating: 95 },
  { id: 44, name: "Lewis Hamilton", team: "Mercedes", price: 32.0, rating: 94 },
  { id: 16, name: "Charles Leclerc", team: "Ferrari", price: 28.0, rating: 92 },
  { id: 4, name: "Lando Norris", team: "McLaren", price: 26.0, rating: 91 },
  { id: 14, name: "Fernando Alonso", team: "Aston Martin", price: 22.0, rating: 90 },
  { id: 81, name: "Oscar Piastri", team: "McLaren", price: 20.0, rating: 88 },
  { id: 63, name: "George Russell", team: "Mercedes", price: 21.0, rating: 89 },
  { id: 55, name: "Carlos Sainz", team: "Ferrari", price: 23.0, rating: 90 }
];

const DEFAULT_SPONSORS = [
  { id: "rolex", name: "Rolex Precision", logo: "fa-solid fa-clock", color: "text-green-500", challenge: "Submit a telemetry support message.", taskType: "contact", reward: "Rolex Telemetry Decal", unlocked: false },
  { id: "pirelli", name: "Pirelli Compound", logo: "fa-solid fa-circle-dot", color: "text-yellow-500", challenge: "Complete one Academy lesson module.", taskType: "lesson", reward: "Pirelli Slick Tire Decal", unlocked: false },
  { id: "petronas", name: "Petronas Synthetics", logo: "fa-solid fa-droplet", color: "text-teal-400", challenge: "Draft a complete Fantasy Roster.", taskType: "fantasy", reward: "Petronas Hologram Decal", unlocked: false }
];

export default function App() {
  // Navigation & Theme
  const [activePage, setActivePage] = useState<string>('home');
  const [activeTheme, setActiveTheme] = useState<string>('ferrari');
  
  // Onboarding / Ignition Sequence
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [ignitionState, setIgnitionState] = useState<'STANDBY' | 'IGNITING' | 'ARMED' | 'LIGHTS_OUT'>('STANDBY');
  const [rpm, setRpm] = useState<number>(0);
  const [lightsCount, setLightsCount] = useState<number>(0);
  const [cinematicMsg, setCinematicMsg] = useState<string>('');
  const [carFlybyLeft, setCarFlybyLeft] = useState<string>('-100%');
  const [carFlybyOpacity, setCarFlybyOpacity] = useState<number>(0);

  // Audio configuration
  const [soundProfile, setSoundProfile] = useState<string>('v8');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  // OpenF1 Data states
  const [liveSessions, setLiveSessions] = useState<F1Session[]>([]);
  const [liveDrivers, setLiveDrivers] = useState<F1Driver[]>([]);
  const [liveWeather, setLiveWeather] = useState<F1Weather | null>(null);
  const [livePositions, setLivePositions] = useState<F1Position[]>([]);
  const [selectedSessionKey, setSelectedSessionKey] = useState<number>(9839);
  const [loadingOpenFOpenF1, setLoadingOpenF1] = useState<boolean>(true);
  const [openF1Error, setOpenF1Error] = useState<string | null>(null);

  // Search & Filtering (for Drivers Tab)
  const [driverSearch, setDriverSearch] = useState<string>('');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // Interactive 3D Garage states
  const [garageTab, setGarageTab] = useState<'showroom' | 'compare' | 'lab'>('showroom');
  const [garageViewMode, setGarageViewMode] = useState<'real' | 'hologram' | 'aero' | 'exploded' | 'xray'>('real');
  const [selectedGarageCar, setSelectedGarageCar] = useState<string>('redbull');
  const [explodedPartName, setExplodedPartName] = useState<string | null>(null);
  const [explodedPartDesc, setExplodedPartDesc] = useState<string | null>(null);
  const [compareCar1, setCompareCar1] = useState<string>('ferrari');
  const [compareCar2, setCompareCar2] = useState<string>('mercedes');
  const [compareMaterial, setCompareMaterial] = useState<'real' | 'holo' | 'wire'>('real');
  const [currentRdEra, setCurrentRdEra] = useState<number>(1950);
  const [shutterState, setShutterState] = useState<'open' | 'closed'>('open');
  const [isShroomCinematic, setIsShroomCinematic] = useState<boolean>(false);

  // Track Explorer states
  const [activeTrack, setActiveTrack] = useState<string>('monaco');
  const [trackLapPercent, setTrackLapPercent] = useState<number>(0);

  // User & DB profiles
  const [currentUser, setCurrentUser] = useState<UserState | null>(null);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [authUsername, setAuthUsername] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [enrolledCourseId, setEnrolledCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [simVideoPlaying, setSimVideoPlaying] = useState<boolean>(false);

  // Fantasy drafting
  const [fantasyDrivers, setFantasyDrivers] = useState<number[]>([]);
  const [fantasyBudget, setFantasyBudget] = useState<number>(150.0);

  // AI strategy
  const [aiWhatIfDriver, setAiWhatIfDriver] = useState<string>('nor');
  const [aiSimulatedOutput, setAiSimulatedOutput] = useState<string>('');
  const [aiRainChance, setAiRainChance] = useState<number>(40);
  const [aiTyreWear, setAiTyreWear] = useState<number>(65);

  // visual shop & sponsors
  const [sponsors, setSponsors] = useState<any[]>(DEFAULT_SPONSORS);
  const [activeFrameSkin, setActiveFrameSkin] = useState<string>('');
  const [socialLogs, setSocialLogs] = useState<Array<{ user: string; text: string; time: string }>>([
    { user: "Driver#3204", text: "That Web Audio engine rev vibration is literally INSANE. Sounds like a V10! 🏎️💨", time: "Just now" }
  ]);
  const [socialInput, setSocialInput] = useState<string>('');

  // Wrapped Story Modals
  const [showWrappedModal, setShowWrappedModal] = useState<boolean>(false);
  const [wrappedSlide, setWrappedSlide] = useState<number>(0);
  const wrappedSlides = [
    { title: "YOUR F1VERSE RECAP", desc: "Welcome back, Pilot. The telemetry arrays have parsed your data loops for the 2026 season. Let's see your driver wrap!" },
    { title: "FAVORITE CONSTRUCTOR", desc: "Ferrari Passion - You executed 45% of your simulator calibration circuits utilizing the scarlet SF-23 frame!" },
    { title: "ACADEMY LEVEL RECORD", desc: "Active telemetry XP tallying completed: 1,500 XP recorded, unlocking advanced driver frames." },
    { title: "YOUR DRIVER DECAL RECAP", desc: "Pirelli Decal claimed successfully. Best prediction achieved down Monaco GP hairpins!" }
  ];

  // Admin Dashboard States
  const [adminTitle, setAdminTitle] = useState<string>('');
  const [adminCategory, setAdminCategory] = useState<string>('physics');
  const [adminPrice, setAdminPrice] = useState<number>(29.0);
  const [adminDesc, setAdminDesc] = useState<string>('');

  // Contact inquiries
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactMsg, setContactMsg] = useState<string>('');

  // Refs for 3D Canvasses
  const showroomCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const compareCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const labCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const telemetryCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const standingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Procedural 3D variable scopes
  const showroomObjRef = useRef<{ scene: any; camera: any; renderer: any; controls: any; carGroup: any; parts: any } | null>(null);
  const compareObjRef = useRef<{ scene: any; camera: any; renderer: any; controls: any; carL: any; carR: any } | null>(null);
  const labObjRef = useRef<{ scene: any; camera: any; renderer: any; controls: any; carMesh: any } | null>(null);

  // Initialize DB and OpenF1 APIs on Mount
  useEffect(() => {
    document.body.setAttribute('data-theme', activeTheme);
    loadCoursesData();
    fetchOpenF1Data();
    
    // Check local storage for authenticated user
    const cachedUser = localStorage.getItem('f1verse_active_user');
    if (cachedUser) {
      try {
        setCurrentUser(JSON.parse(cachedUser));
      } catch (e) {}
    }
  }, []);

  const loadCoursesData = async () => {
    const data = await BackendService.getCourses();
    setCourses(data);
  };

  const fetchOpenF1Data = async (sessionKey = 9839) => {
    setLoadingOpenF1(true);
    setOpenF1Error(null);
    try {
      const sessions = await OpenF1Service.getSessions();
      setLiveSessions(sessions);
      
      const drivers = await OpenF1Service.getDrivers(sessionKey);
      setLiveDrivers(drivers);
      
      const weather = await OpenF1Service.getWeather(sessionKey);
      setLiveWeather(weather);
      
      const positions = await OpenF1Service.getPositions(sessionKey);
      setLivePositions(positions);
    } catch (e) {
      setOpenF1Error("Telemetry extraction failure. Re-calibrating live feeds.");
    } finally {
      setLoadingOpenF1(false);
    }
  };

  const triggerToast = (title: string, desc: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ title, desc, type });
    soundEngine.playBeep();
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sound Synth profile configuration overrides
  const triggerSoundProfile = (profile: string) => {
    setSoundProfile(profile);
    soundEngine.playBeep();
    triggerToast("AUDIO DEVIATION", `Sound engine profile changed to: ${profile.toUpperCase()}`, "info");
  };

  const toggleSynthMute = () => {
    const isNowMuted = soundEngine.toggleMute();
    setIsMuted(isNowMuted);
    triggerToast("COMMS", isNowMuted ? "Volume muted" : "Volume restored", "info");
  };

  // Ignition engine start sequence
  const startIgnitionSequence = () => {
    if (ignitionState !== 'STANDBY') return;
    setIgnitionState('IGNITING');
    soundEngine.init();
    
    let curRpm = 0;
    const rpmInterval = setInterval(() => {
      curRpm += 375;
      if (curRpm >= 15000) {
        curRpm = 15000;
        clearInterval(rpmInterval);
        triggerRaceCountdown();
      }
      setRpm(curRpm);
      soundEngine.setRPM(curRpm);
    }, 45);
  };

  const triggerRaceCountdown = () => {
    setIgnitionState('ARMED');
    let count = 0;
    const countdownInterval = setInterval(() => {
      if (count < 5) {
        count++;
        setLightsCount(count);
        soundEngine.playBeep();
      } else {
        clearInterval(countdownInterval);
        
        // Random latency for lights out
        setTimeout(() => {
          setLightsCount(0);
          setIgnitionState('LIGHTS_OUT');
          soundEngine.playTireScreech();
          setCarFlybyOpacity(1);
          setCarFlybyLeft('125%');
          setCinematicMsg("LIGHTS OUT");
          
          setTimeout(() => {
            setCinematicMsg("AND AWAY WE GO!");
            
            setTimeout(() => {
              setShowIntro(false);
              soundEngine.setRPM(950);
            }, 1200);
          }, 800);
          
        }, 800 + Math.random() * 800);
      }
    }, 700);
  };

  // Authenticate triggers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername.trim() || !authPassword.trim()) return;
    
    try {
      if (authModal === 'login') {
        const data = await BackendService.login(authUsername, authPassword);
        setCurrentUser(data.user);
        localStorage.setItem('f1verse_active_user', JSON.stringify(data.user));
        triggerToast("ACCESS CLEARED", `Welcome back, Pilot ${data.user.username}.`, "success");
      } else {
        const data = await BackendService.signup(authUsername, authEmail, authPassword);
        setCurrentUser(data.user);
        localStorage.setItem('f1verse_active_user', JSON.stringify(data.user));
        triggerToast("ACADEMY REGISTERED", "New driver profile telemetry locked.", "success");
      }
      
      setAuthModal(null);
      setAuthUsername('');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      triggerToast("AUTH FAILURE", err.message || "Credential authentication error", "error");
    }
  };

  const logoutUser = () => {
    BackendService.clearToken();
    localStorage.removeItem('f1verse_active_user');
    setCurrentUser(null);
    setActiveFrameSkin('');
    triggerToast("SYSTEM STANDBY", "Driver disconnected from cockpit.", "info");
  };

  // Drawing standing wave graphics
  useEffect(() => {
    const canvas = standingCanvasRef.current;
    if (!canvas || showIntro) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width = canvas.clientWidth;
      const h = canvas.height = canvas.clientHeight;

      // Draw faint cyber mesh grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }
      for (let j = 0; j < h; j += 25) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
      }

      step += 0.02;

      // Draw line 1 (Hamilton - Red)
      ctx.strokeStyle = "#FF1801";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255, 24, 1, 0.5)";
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h/2 - 10 + Math.sin(x * 0.015 + step) * 20;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw line 2 (Verstappen - Yellow)
      ctx.strokeStyle = "#FFEC00";
      ctx.shadowColor = "rgba(255, 236, 0, 0.5)";
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h/2 + 15 + Math.cos(x * 0.01 + step) * 25;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw line 3 (Leclerc - Cyan)
      ctx.strokeStyle = "#00D4FF";
      ctx.shadowColor = "rgba(0, 212, 255, 0.5)";
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h/2 + Math.sin(x * 0.012 - step) * 30;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [showIntro, activePage]);

  // SVG-based dynamic flyover loop for tracks
  useEffect(() => {
    if (activePage !== 'tracks') return;
    
    let frameId: number;
    let progress = 0;
    
    const tick = () => {
      progress += 0.003;
      if (progress > 1.0) progress = 0;
      setTrackLapPercent(progress);
      frameId = requestAnimationFrame(tick);
    };
    
    tick();
    return () => cancelAnimationFrame(frameId);
  }, [activePage, activeTrack]);

  // Track vector rendering inside canvas
  useEffect(() => {
    const canvas = trackCanvasRef.current;
    if (!canvas || activePage !== 'tracks') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Track coordinates
    const TRACK_PATHS: Record<string, Array<{x: number; y: number}>> = {
      monaco: [
        {x: 80, y: 220}, {x: 140, y: 190}, {x: 210, y: 140},
        {x: 290, y: 80}, {x: 340, y: 110}, {x: 320, y: 170},
        {x: 360, y: 220}, {x: 420, y: 200}, {x: 460, y: 300},
        {x: 380, y: 320}, {x: 260, y: 340}, {x: 180, y: 290},
        {x: 80, y: 220}
      ],
      silverstone: [
        {x: 60, y: 250}, {x: 110, y: 100}, {x: 240, y: 80},
        {x: 320, y: 110}, {x: 390, y: 180}, {x: 480, y: 200},
        {x: 420, y: 310}, {x: 280, y: 330}, {x: 150, y: 310},
        {x: 60, y: 250}
      ],
      monza: [
        {x: 70, y: 150}, {x: 340, y: 110}, {x: 440, y: 210},
        {x: 470, y: 280}, {x: 390, y: 330}, {x: 180, y: 310},
        {x: 120, y: 220}, {x: 70, y: 150}
      ]
    };

    let animId: number;

    const renderTrack = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width = canvas.clientWidth;
      const h = canvas.height = canvas.clientHeight;

      // Draw meshes background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }

      const path = TRACK_PATHS[activeTrack];
      if (!path) return;

      // Draw background thick border track
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      path.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Draw telemetry glowing overlay line
      const activeColor = activeTheme === 'mercedes' ? '#00D4FF' : activeTheme === 'mclaren' ? '#FF8700' : activeTheme === 'redbull' ? '#FFEC00' : '#FF1801';
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 12;
      ctx.shadowColor = activeColor;
      ctx.beginPath();
      path.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw current position of flyover dot
      const nodeIdx = Math.floor(trackLapPercent * (path.length - 1));
      const nextNodeIdx = (nodeIdx + 1) % path.length;
      const currNode = path[nodeIdx];
      const nextNode = path[nextNodeIdx];

      if (currNode && nextNode) {
        const sub = (trackLapPercent * (path.length - 1)) - nodeIdx;
        const dotX = currNode.x + (nextNode.x - currNode.x) * sub;
        const dotY = currNode.y + (nextNode.y - currNode.y) * sub;

        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing radar glow
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 12 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderTrack);
    };

    renderTrack();
    return () => cancelAnimationFrame(animId);
  }, [activePage, activeTrack, trackLapPercent, activeTheme]);

  // WebGL 3D Garage Showroom (Standard Three.js implementation inside React useEffect)
  useEffect(() => {
    if (activePage !== 'garage' || garageTab !== 'showroom') return;
    const canvas = showroomCanvasRef.current;
    if (!canvas) return;

    // Dimensions
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.018);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 11);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't sink below grid
    controls.minDistance = 3;
    controls.maxDistance = 22;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.85);
    mainLight.position.set(5, 12, 5);
    scene.add(mainLight);

    const neonSpot = new THREE.SpotLight(0xffffff, 1.8);
    neonSpot.position.set(0, 8, 0);
    neonSpot.angle = Math.PI / 4;
    neonSpot.penumbra = 0.8;
    neonSpot.castShadow = true;
    scene.add(neonSpot);

    // Scanner laser sweeping line mesh
    const laserGeo = new THREE.BoxGeometry(6, 0.04, 3.8);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const laserScannerMesh = new THREE.Mesh(laserGeo, laserMat);
    laserScannerMesh.position.y = 1;
    scene.add(laserScannerMesh);

    // Flow particles for wind tunnel
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = Math.random() * 10 - 5;      // X
      posArray[i + 1] = Math.random() * 1.8 + 0.1; // Y
      posArray[i + 2] = Math.random() * 14 - 7;    // Z
      particleSpeeds.push(0.12 + Math.random() * 0.08);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x00d4ff,
      transparent: true,
      opacity: 0
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Car Parent Group
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Parts storage
    const parts: Record<string, any> = {};

    // Build the car
    const colors: Record<string, string> = { redbull: "#061D3B", ferrari: "#E10600", mercedes: "#00A19B", mclaren: "#FF8700" };
    const activeColor = colors[selectedGarageCar] || "#FF1801";

    // Premium clearcoat visual mapping
    const pbrPaint = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeColor),
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const carbonParts = new THREE.MeshStandardMaterial({ color: 0x18181e, roughness: 0.7, metalness: 0.1 });
    const chromeRim = new THREE.MeshStandardMaterial({ color: 0xa1a1a6, roughness: 0.1, metalness: 0.9 });
    const rubberTire = new THREE.MeshStandardMaterial({ color: 0x202024, roughness: 0.9 });
    const engineBlockGlow = new THREE.MeshBasicMaterial({ color: 0xff1801, transparent: true, opacity: 0.9 });
    const batteryBlockGlow = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.9 });

    // Chassis Tube
    const chassisGeo = new THREE.CylinderGeometry(0.38, 0.58, 4.2, 8);
    const chassisMesh = new THREE.Mesh(chassisGeo, pbrPaint);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.position.y = 0.5;
    parts.chassis = chassisMesh;
    carGroup.add(chassisMesh);

    // Front Wing
    const fwGroup = new THREE.Group();
    const fwPlate = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 0.45), pbrPaint);
    fwGroup.add(fwPlate);
    const epL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.55), carbonParts);
    epL.position.set(-1.5, 0.1, 0);
    const epR = epL.clone();
    epR.position.set(1.5, 0.1, 0);
    fwGroup.add(epL, epR);
    fwGroup.position.set(0, 0.22, -2.1);
    parts.frontWing = fwGroup;
    carGroup.add(fwGroup);

    // Rear Wing
    const rwGroup = new THREE.Group();
    const rwPlate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.55), pbrPaint);
    rwPlate.position.y = 1.05;
    rwGroup.add(rwPlate);
    const strutsL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.75, 0.1), carbonParts);
    strutsL.position.set(-0.8, 0.68, 0.15);
    const strutsR = strutsL.clone();
    strutsR.position.set(0.8, 0.68, 0.15);
    rwGroup.add(strutsL, strutsR);
    rwGroup.position.set(0, 0, 1.95);
    parts.rearWing = rwGroup;
    carGroup.add(rwGroup);

    // Floor
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 3.6), carbonParts);
    floorMesh.position.set(0, 0.12, 0);
    parts.floor = floorMesh;
    carGroup.add(floorMesh);

    // Halo protection cage
    const haloMesh = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 24, Math.PI), carbonParts);
    haloMesh.rotation.x = Math.PI / 2 + 0.15;
    haloMesh.position.set(0, 0.78, -0.38);
    parts.halo = haloMesh;
    carGroup.add(haloMesh);

    // Internal hybrid engine block
    const engineGroup = new THREE.Group();
    const eBlock = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, 0.6), engineBlockGlow);
    eBlock.position.set(0, 0.4, 0.5);
    const batBlock = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.45), batteryBlockGlow);
    batBlock.position.set(0, 0.15, 0.5);
    engineGroup.add(eBlock, batBlock);
    parts.engine = engineGroup;
    carGroup.add(engineGroup);
    engineGroup.visible = false;

    // Wheel assemblies
    const buildWheel = (x: number, y: number, z: number, name: string) => {
      const assembly = new THREE.Group();
      
      const link = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, Math.abs(x) - 0.2), carbonParts);
      link.rotation.z = Math.PI / 2;
      link.position.x = x / 2;
      assembly.add(link);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.42, 16), rubberTire);
      tire.rotation.z = Math.PI / 2;
      tire.position.x = x;
      assembly.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.44, 12), chromeRim);
      rim.rotation.z = Math.PI / 2;
      rim.position.x = x;
      assembly.add(rim);

      assembly.position.set(0, y, z);
      parts[name] = assembly;
      carGroup.add(assembly);
    };

    buildWheel(-1.15, 0.35, -1.15, "wheelsLF");
    buildWheel(1.15, 0.35, -1.15, "wheelsRF");
    buildWheel(-1.15, 0.35, 1.15, "wheelsLR");
    buildWheel(1.15, 0.35, 1.15, "wheelsRR");

    // Apply material modifiers for other modes
    const applyViewModes = () => {
      if (garageViewMode === "hologram") {
        carGroup.traverse((child: any) => {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: 0x00f4ff,
              wireframe: true,
              transparent: true,
              opacity: 0.25
            });
          }
        });
        particleMat.opacity = 0;
        engineGroup.visible = false;
      } else if (garageViewMode === "xray") {
        carGroup.traverse((child: any) => {
          if (child.isMesh && child.material !== engineBlockGlow && child.material !== batteryBlockGlow) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x00d4ff,
              transparent: true,
              opacity: 0.06,
              wireframe: true
            });
          }
        });
        particleMat.opacity = 0;
        engineGroup.visible = true;
      } else if (garageViewMode === "aero") {
        particleMat.opacity = 0.8;
        engineGroup.visible = false;
      } else if (garageViewMode === "exploded") {
        particleMat.opacity = 0;
        engineGroup.visible = true;
      } else {
        particleMat.opacity = 0;
        engineGroup.visible = false;
      }
    };

    applyViewModes();

    // Exploded View positions mapping
    const EXPLODED_OFFSETS: Record<string, THREE.Vector3> = {
      frontWing: new THREE.Vector3(0, 0, -2.2),
      rearWing: new THREE.Vector3(0, 0, 2.2),
      chassis: new THREE.Vector3(0, 0, 0),
      floor: new THREE.Vector3(0, -0.6, 0),
      halo: new THREE.Vector3(0, 1.0, 0),
      engine: new THREE.Vector3(0, 1.2, 0.3),
      wheelsLF: new THREE.Vector3(-1.6, 0, -1.0),
      wheelsRF: new THREE.Vector3(1.6, 0, -1.0),
      wheelsLR: new THREE.Vector3(-1.6, 0, 1.0),
      wheelsRR: new THREE.Vector3(1.6, 0, 1.0)
    };

    // Save details to ref scopes
    showroomObjRef.current = { scene, camera, renderer, controls, carGroup, parts };

    // Setup interactive component click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      if (garageViewMode !== 'exploded') return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(carGroup.children, true);

      if (intersects.length > 0) {
        let hitObject = intersects[0].object;
        let partKey: string | null = null;
        while (hitObject && hitObject !== scene) {
          for (const key in parts) {
            if (parts[key] === hitObject || parts[key].children?.includes(hitObject)) {
              partKey = key;
              break;
            }
          }
          if (partKey) break;
          hitObject = hitObject.parent as any;
        }

        const PART_DETAILS: Record<string, string> = {
          frontWing: "Front Wing Assembly - Generates up to 38% of total front-end downforce. Configured with adjustable multi-element flaps to fine-tune steering bite.",
          rearWing: "Rear Wing & DRS flap - Drag Reduction System active. Provides crucial rear stability. Retracts flap to increase top speed by 12-14 km/h.",
          chassis: "Monocoque Carbon Chassis - Constructed from layers of high-tensile carbon fiber and honeycomb structures to absorb severe G-force impact grids.",
          floor: "Venturi Underbody Tunnel - Utilizes ground-effect vacuum channels to generate extreme low-pressure regions, sucking the car down to the asphalt.",
          halo: "Halo Titanium Guard - Ultra-high-strength cage built to withstand loads of up to 125kN, protecting the driver from heavy flying debris.",
          engine: "1.6L V6 Turbo Hybrid Power Unit - Generates 1,020+ HP. Seamlessly links thermal exhaust turbochargers with kinetic MGU-K recovery systems.",
          wheelsLF: "LF Wheel - Carbon-ceramic brake rotors operating at up to 1000°C. Wrapped in Pirelli custom slick compounds.",
          wheelsRF: "RF Wheel - Calibrated to expulse heat vectors away from suspension structures.",
          wheelsLR: "LR Wheel - Heavy traction tires designed to withstand longitudinal acceleration forces of up to 4.5G.",
          wheelsRR: "RR Wheel - Critical rear power-transfer contact patches."
        };

        if (partKey && PART_DETAILS[partKey]) {
          setExplodedPartName(partKey.replace(/LF|RF|LR|RR/, "").toUpperCase());
          setExplodedPartDesc(PART_DETAILS[partKey]);
          soundEngine.playBeep();
        }
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Animation Loop
    let animId: number;
    let sweepDir = 1;
    let time = 0;

    const tick = () => {
      controls.update();

      // Sweep animation laser scanner
      if (garageViewMode === 'hologram') {
        laserScannerMesh.visible = true;
        laserScannerMesh.position.y += 0.015 * sweepDir;
        if (laserScannerMesh.position.y > 2.0 || laserScannerMesh.position.y < -0.1) {
          sweepDir *= -1;
        }
      } else {
        laserScannerMesh.visible = false;
      }

      // Wind tunnel particles
      if (garageViewMode === 'aero') {
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i + 2] -= particleSpeeds[i / 3]; // Z moves forward
          
          // curve stream over cockpit
          if (Math.abs(positions[i]) < 0.65 && positions[i + 2] > -1.8 && positions[i + 2] < 1.8) {
            positions[i + 1] = 0.75 + Math.sin((positions[i + 2] + 1.8) * 0.85) * 0.38;
          } else {
            positions[i + 1] = Math.max(0.12, positions[i + 1] - 0.003);
          }

          if (positions[i + 2] < -7) {
            positions[i + 2] = 7;
            positions[i] = Math.random() * 10 - 5;
            positions[i + 1] = Math.random() * 1.8 + 0.1;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      // LERP parts during Exploded view
      for (const key in EXPLODED_OFFSETS) {
        const part = parts[key];
        if (part) {
          const target = garageViewMode === 'exploded' ? EXPLODED_OFFSETS[key] : new THREE.Vector3(0, 0, 0);
          part.position.lerp(target, 0.07);
        }
      }

      // Roll tires
      if (parts.wheelsLF) parts.wheelsLF.rotation.x += 0.015;
      if (parts.wheelsRF) parts.wheelsRF.rotation.x += 0.015;
      if (parts.wheelsLR) parts.wheelsLR.rotation.x += 0.015;
      if (parts.wheelsRR) parts.wheelsRR.rotation.x += 0.015;

      // Pan camera if showroom cinematic
      if (isShroomCinematic) {
        time += 0.01;
        camera.position.x = Math.sin(time) * 11;
        camera.position.z = Math.cos(time) * 11;
        camera.position.y = 3.2 + Math.sin(time * 2) * 1.5;
        camera.lookAt(new THREE.Vector3(0, 0.45, 0));
      } else {
        carGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // Cleanups
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', handleCanvasClick);
      renderer.dispose();
      scene.clear();
    };

  }, [activePage, garageTab, selectedGarageCar, garageViewMode, isShroomCinematic]);

  // Comparison chamber WebGL Canvas
  useEffect(() => {
    if (activePage !== 'garage' || garageTab !== 'compare') return;
    const canvas = compareCanvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 11);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambient = new THREE.AmbientLight(0xffffff, 0.22);
    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(0, 10, 5);
    scene.add(ambient, dir);

    // Dual Cars Builder helper
    const buildCompareCar = (teamId: string, posX: number) => {
      const colors: Record<string, string> = { redbull: "#001A30", ferrari: "#E00000", mercedes: "#00A19B", mclaren: "#FF8700" };
      const themeColor = colors[teamId] || "#FF1801";

      const mat = compareMaterial === 'wire' ? 
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true }) :
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(themeColor),
          metalness: 0.9,
          roughness: 0.2,
          transparent: compareMaterial === 'holo',
          opacity: compareMaterial === 'holo' ? 0.35 : 1.0,
          wireframe: compareMaterial === 'holo'
        });

      const group = new THREE.Group();

      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.52, 3.8, 8), mat);
      tube.rotation.x = Math.PI / 2;
      tube.position.y = 0.5;
      group.add(tube);

      const wing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.05, 0.4), mat);
      wing.position.set(0, 0.22, -1.9);
      group.add(wing);

      // Tires
      const tireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.38, 8);
      const tireMat = new THREE.MeshBasicMaterial({ color: 0x18181a });
      
      const tLF = new THREE.Mesh(tireGeo, tireMat); tLF.rotation.z = Math.PI/2; tLF.position.set(-1.0, 0.35, -1.0);
      const tRF = tLF.clone(); tRF.position.x = 1.0;
      const tLR = tLF.clone(); tLR.position.set(-1.0, 0.35, 1.0);
      const tRR = tLF.clone(); tRR.position.x = 1.0;
      group.add(tLF, tRF, tLR, tRR);

      group.position.set(posX, 0, 0);
      scene.add(group);
      return group;
    };

    const carL = buildCompareCar(compareCar1, -2.3);
    const carR = buildCompareCar(compareCar2, 2.3);

    compareObjRef.current = { scene, camera, renderer, controls, carL, carR };

    let animId: number;
    const tick = () => {
      controls.update();
      carL.rotation.y += 0.003;
      carR.rotation.y += 0.003;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, [activePage, garageTab, compareCar1, compareCar2, compareMaterial]);

  // Morphing Era timeline WebGL canvas
  useEffect(() => {
    if (activePage !== 'garage' || garageTab !== 'lab') return;
    const canvas = labCanvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 8, 3);
    scene.add(ambient, dir);

    const group = new THREE.Group();
    scene.add(group);

    // Morph shapes based on current Rd Era selection
    const mat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, roughness: 0.15, metalness: 0.85, wireframe: true });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.9 });

    if (currentRdEra === 1950) {
      // Cigar tube
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 3.8, 8), mat);
      body.rotation.x = Math.PI / 2;
      group.add(body);

      const tLF = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.18, 10), tireMat);
      tLF.rotation.z = Math.PI / 2;
      tLF.position.set(-0.8, 0, -1.4);
      const tRF = tLF.clone(); tRF.position.x = 0.8;
      const tLR = tLF.clone(); tLR.position.set(-0.8, 0, 1.4);
      const tRR = tLF.clone(); tRR.position.x = 0.8;
      group.add(tLF, tRF, tLR, tRR);

    } else if (currentRdEra === 1970) {
      // Wide airbox, square wings
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 3.6), mat);
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 0.85, 8), mat);
      scope.position.set(0, 0.55, 0.2);
      group.add(body, scope);

      const fWing = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.05, 0.35), mat);
      fWing.position.set(0, -0.15, -1.8);
      const rWing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.45), mat);
      rWing.position.set(0, 0.75, 1.8);
      group.add(fWing, rWing);

      const tLF = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 10), tireMat);
      tLF.rotation.z = Math.PI/2; tLF.position.set(-1.0, 0, -1.3);
      const tRF = tLF.clone(); tRF.position.x = 1.0;
      const tLR = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.6, 10), tireMat);
      tLR.rotation.z = Math.PI/2; tLR.position.set(-1.25, 0, 1.3);
      const tRR = tLR.clone(); tRR.position.x = 1.25;
      group.add(tLF, tRF, tLR, tRR);

    } else if (currentRdEra === 1990) {
      // Pointy nose
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.48, 3.8, 8), mat);
      body.rotation.x = Math.PI/2;
      group.add(body);

      const fWing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.05, 0.4), mat); fWing.position.set(0, -0.1, -2.0);
      const rWing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.45), mat); rWing.position.set(0, 0.6, 1.9);
      group.add(fWing, rWing);

      const tLF = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.4, 10), tireMat);
      tLF.rotation.z = Math.PI/2; tLF.position.set(-1.1, 0, -1.25);
      const tRF = tLF.clone(); tRF.position.x = 1.1;
      const tLR = tLF.clone(); tLR.position.set(-1.1, 0, 1.25);
      const tRR = tLF.clone(); tRR.position.x = 1.1;
      group.add(tLF, tRF, tLR, tRR);

    } else if (currentRdEra === 2010) {
      // Shark fins
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.48, 4.0, 8), mat);
      body.rotation.x = Math.PI/2;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.72, 1.3), mat);
      fin.position.set(0, 0.4, 0.75);
      group.add(body, fin);

      const fWing = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.05, 0.4), mat); fWing.position.set(0, -0.1, -2.1);
      const rWing = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.38), mat); rWing.position.set(0, 0.85, 2.0);
      group.add(fWing, rWing);

      const tLF = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.42, 10), tireMat);
      tLF.rotation.z = Math.PI/2; tLF.position.set(-1.15, 0, -1.35);
      const tRF = tLF.clone(); tRF.position.x = 1.15;
      const tLR = tLF.clone(); tLR.position.set(-1.15, 0, 1.35);
      const tRR = tLF.clone(); tRR.position.x = 1.15;
      group.add(tLF, tRF, tLR, tRR);

    } else if (currentRdEra === 2026) {
      // Halo cage, active aerofoil lines
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.55, 4.4, 8), mat);
      body.rotation.x = Math.PI/2;
      const haloNode = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 8, 16, Math.PI), mat);
      haloNode.rotation.x = Math.PI/2;
      haloNode.position.set(0, 0.55, -0.35);
      group.add(body, haloNode);

      const fWing = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 0.48), mat); fWing.position.set(0, -0.1, -2.2);
      const rWing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.55), mat); rWing.position.set(0, 0.78, 2.15);
      group.add(fWing, rWing);

      const tLF = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.42, 10), tireMat);
      tLF.rotation.z = Math.PI/2; tLF.position.set(-1.15, 0, -1.35);
      const tRF = tLF.clone(); tRF.position.x = 1.15;
      const tLR = tLF.clone(); tLR.position.set(-1.15, 0, 1.35);
      const tRR = tLF.clone(); tRR.position.x = 1.15;
      group.add(tLF, tRF, tLR, tRR);
    }

    labObjRef.current = { scene, camera, renderer, controls, carMesh: group };

    let animId: number;
    const tick = () => {
      controls.update();
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, [activePage, garageTab, currentRdEra]);

  // Learning cockpit draw
  useEffect(() => {
    if (activePage !== 'academy' || !enrolledCourseId || !activeLessonId) return;
    const canvas = telemetryCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const renderGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width = canvas.clientWidth;
      const h = canvas.height = canvas.clientHeight;

      ctx.strokeStyle = "rgba(0, 212, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }

      time += 0.04;

      // Draw active sine curves representing telemetry telemetry data
      ctx.strokeStyle = "#00D4FF";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00D4FF";
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * 0.02 + time) * (h / 3);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Cosine telemetry line
      ctx.strokeStyle = "#FF1801";
      ctx.shadowColor = "#FF1801";
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2.5 + Math.cos(x * 0.015 - time * 0.8) * (h / 4);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(renderGraph);
    };

    renderGraph();
    return () => cancelAnimationFrame(animId);
  }, [activePage, enrolledCourseId, activeLessonId]);

  // Car switch trigger
  const triggerCarReveal = (carId: string) => {
    soundEngine.playBeep();
    setShutterState('closed');
    setTimeout(() => {
      setSelectedGarageCar(carId);
      setExplodedPartName(null);
      setExplodedPartDesc(null);
      
      // Update team color scheme variables
      setActiveTheme(carId);
      
      // Simulate pit stop guns
      soundEngine.playTireScreech();
      
      setTimeout(() => {
        setShutterState('open');
        setGarageViewMode('hologram');
        setTimeout(() => {
          setGarageViewMode('xray');
          setTimeout(() => {
            setGarageViewMode('real');
          }, 600);
        }, 600);
      }, 1200);
    }, 600);
  };

  // R&D timeline changer
  const changeRdEra = (year: number) => {
    soundEngine.playBeep();
    setCurrentRdEra(year);
    triggerToast("CHASSIS CONFIGURED", `Rule era shape loaded: ${year}S`, "success");
  };

  // Course Enrollment Sandbox (Razorpay integration mock)
  const enrollInCourse = async (courseId: string, price: number) => {
    if (!currentUser) {
      triggerToast("SECURITY DETECTED", "Login to register courses in simulator academy.", "error");
      setAuthModal('login');
      return;
    }

    try {
      const orderId = await BackendService.createPaymentOrder(courseId, price);
      
      // Trigger Razorpay Simulation
      triggerToast("GATEWAY OPEN", `Razorpay Order ${orderId} initialized.`, "info");
      
      setTimeout(() => {
        // Mock successful transaction
        const updatedUser = { ...currentUser };
        updatedUser.enrolledCourses = updatedUser.enrolledCourses || [];
        updatedUser.enrolledCourses.push({ courseId, progress: 0 });
        updatedUser.coins += 200; // Reward bonus
        
        setCurrentUser(updatedUser);
        localStorage.setItem('f1verse_active_user', JSON.stringify(updatedUser));
        loadCoursesData();
        triggerToast("CALIBRATION LOCKED", "Simulation Course Enrolled! Check Sandbox dashboard.", "success");
      }, 1500);
    } catch (e) {
      triggerToast("GATEWAY FAILURE", "Order initialization failed", "error");
    }
  };

  // Marking lesson checks
  const toggleLessonStatus = (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    soundEngine.playBeep();

    const updatedUser = { ...currentUser };
    const courseEnroll = updatedUser.enrolledCourses.find(ec => ec.courseId === courseId);
    if (courseEnroll) {
      // Find course details
      const course = courses.find(c => c.id === courseId);
      if (!course) return;
      
      // Count total lessons
      let totalLessons = 0;
      course.modules.forEach(m => totalLessons += m.lessons.length);

      // Check local storage for lesson completion checks
      const key = `completed_${currentUser.username}_${lessonId}`;
      const isCompleted = localStorage.getItem(key) === 'true';
      
      if (isCompleted) {
        localStorage.removeItem(key);
        triggerToast("UNCOMPLETED", "Lesson parameters reset", "info");
      } else {
        localStorage.setItem(key, 'true');
        updatedUser.xp += 50;
        updatedUser.coins += 30;
        
        // check challenge sponsor challenge completion
        sponsors.forEach((sp, idx) => {
          if (sp.id === 'pirelli' && !sp.unlocked) {
            const copy = [...sponsors];
            copy[idx].unlocked = true;
            setSponsors(copy);
            triggerToast("CHALLENGE MET", `Sponsor Pirelli challenge completed!`, "success");
          }
        });

        triggerToast("COMPLETED", "Gained +50 XP and +30 Coins!", "success");
      }

      // Re-calculate progress
      let completedCount = 0;
      course.modules.forEach(m => {
        m.lessons.forEach(l => {
          if (localStorage.getItem(`completed_${currentUser.username}_${l.id}`) === 'true') {
            completedCount++;
          }
        });
      });
      
      courseEnroll.progress = Math.round((completedCount / totalLessons) * 100);
      setCurrentUser(updatedUser);
      localStorage.setItem('f1verse_active_user', JSON.stringify(updatedUser));
    }
  };

  // Draft Fantasy elements
  const selectFantasyDriver = (id: number, price: number) => {
    soundEngine.playBeep();
    if (fantasyDrivers.includes(id)) {
      setFantasyDrivers(fantasyDrivers.filter(x => x !== id));
      setFantasyBudget(prev => +(prev + price).toFixed(1));
    } else {
      if (fantasyDrivers.length >= 5) {
        triggerToast("DRAFT COMPLETED", "Draft capacity maximum reached: 5 drivers.", "error");
        return;
      }
      if (fantasyBudget < price) {
        triggerToast("INSUFFICIENT FUNDS", "Draft capital limit exceeded.", "error");
        return;
      }
      setFantasyDrivers([...fantasyDrivers, id]);
      setFantasyBudget(prev => +(prev - price).toFixed(1));
    }
  };

  const submitFantasyRoster = () => {
    if (fantasyDrivers.length < 5) {
      triggerToast("INCOMPLETE GRID", "Roster requires 5 active drivers to calibrate.", "error");
      return;
    }
    soundEngine.playBeep();
    triggerToast("GRID DEPLOYED", "Fantasy roster coordinates locked into system telemetry.", "success");
    
    // Unlock Petronas decal sponsor challenge
    sponsors.forEach((sp, idx) => {
      if (sp.id === 'petronas' && !sp.unlocked) {
        const copy = [...sponsors];
        copy[idx].unlocked = true;
        setSponsors(copy);
        triggerToast("CHALLENGE MET", "Sponsor Petronas contract active!", "success");
      }
    });
  };

  // AI strategy advisors
  const runTyreStrategy = () => {
    soundEngine.playBeep();
    let recommendation = "";
    if (aiRainChance > 60) {
      recommendation = "WET DAMP TIRES (Blue) - Track moisture levels exceeded water dispersion thresholds. Deploy deep treads.";
    } else if (aiRainChance > 30) {
      recommendation = "INTERMEDIATE TIRES (Green) - Track damp indices volatile. Ideal crossover window.";
    } else {
      if (aiTyreWear > 70) {
        recommendation = "HARD SLICK TIRES (White) - Tyre degradation maximum. Prioritize longevity.";
      } else {
        recommendation = "SOFT SLICK TIRES (Red) - Optimum friction thermal window. Push qualifying sprint telemetry.";
      }
    }
    setAiSimulatedOutput(recommendation);
    triggerToast("AI PROJECTION SUCCESS", "Pitstop advisor matrix calculated.", "success");
  };

  const runAlternateStanding = () => {
    soundEngine.playBeep();
    let projection = "";
    if (aiWhatIfDriver === 'nor') {
      projection = "NORRIS PROJECTED CHAMPION - Recalculated Monaco GP results adds +25pts to Lando. Verstappen drops to P2 by 4 championship points in final Abu Dhabi decider.";
    } else if (aiWhatIfDriver === 'lec') {
      projection = "FERRARI CONSTRUCTOR THREAT - Leclerc winning Monza boosts Ferrari constructor coefficient by 18%. Ferrari projections overtaking Red Bull Racing for visual grid P1.";
    } else {
      projection = "HAMILTON POLE CLIMB - Lewis winning Silverstone secures historical 105th victory, expanding Mercedes team morale and projecting P3 individual standing tier.";
    }
    setAiSimulatedOutput(projection);
    triggerToast("AI RESIMULATOR RUN", "Alternate standing models mapped.", "success");
  };

  // Visual Progression Skins purchasing
  const purchaseFrameSkin = (frame: string, cost: number) => {
    soundEngine.playBeep();
    if (!currentUser) {
      triggerToast("SECURITY CHECK", "Access login credentials to spend coins.", "error");
      return;
    }
    if (currentUser.coins < cost) {
      triggerToast("INSUFFICIENT COINS", "Simulate more Academy lessons to collect F1Verse coins.", "error");
      return;
    }

    const updatedUser = { ...currentUser };
    updatedUser.coins -= cost;
    updatedUser.purchasedFrames = updatedUser.purchasedFrames || [];
    updatedUser.purchasedFrames.push(frame);
    
    setCurrentUser(updatedUser);
    localStorage.setItem('f1verse_active_user', JSON.stringify(updatedUser));
    setActiveFrameSkin(frame);
    triggerToast("DECAL LOCKED", `Purchased and equipped ${frame.toUpperCase()} animated frame border.`, "success");
  };

  // CRUD Course triggers
  const createAdminCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle.trim() || !currentUser || currentUser.role !== 'admin') return;

    const newCourse: AcademyCourse = {
      id: `course_${Date.now()}`,
      title: adminTitle,
      category: adminCategory,
      price: adminPrice,
      desc: adminDesc,
      modules: [
        {
          name: "Module 1: General Parameters",
          lessons: [
            { id: `l_${Date.now()}_1`, title: "Basic Setup Overview", content: "Calibrating baseline telemetry points on race tracks.", completed: false }
          ]
        }
      ]
    };

    await BackendService.createCourse(newCourse);
    loadCoursesData();
    triggerToast("CRUD COMPLETED", "New telemetry course written to DB.", "success");
    
    setAdminTitle('');
    setAdminDesc('');
  };

  const deleteAdminCourse = async (courseId: string, mongoId?: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    await BackendService.deleteCourse(courseId, mongoId);
    loadCoursesData();
    triggerToast("CRUD COMPLETED", "Telemetry course deleted from database.", "success");
  };

  const resetTelemetryDB = () => {
    localStorage.removeItem('f1verse_courses');
    loadCoursesData();
    triggerToast("DB RE-CALIBRATED", "System database restored to default configurations.", "info");
  };

  // submit support inquiries
  const submitContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playBeep();
    triggerToast("TRANSMITTED", "Message package delivered safely.", "success");
    
    // Unlock Rolex decal sponsor challenge
    sponsors.forEach((sp, idx) => {
      if (sp.id === 'rolex' && !sp.unlocked) {
        const copy = [...sponsors];
        copy[idx].unlocked = true;
        setSponsors(copy);
        triggerToast("CHALLENGE MET", "Sponsor Rolex precision contract signed!", "success");
      }
    });

    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  // community commentary feed
  const postSocialLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialInput.trim()) return;

    const name = currentUser ? currentUser.username : "DriverGuest";
    const log = { user: name, text: socialInput, time: "Just now" };
    setSocialLogs([log, ...socialLogs]);
    setSocialInput('');
    soundEngine.playBeep();
  };

  // Real-time Driver Search and Filtering for the Drivers Gallery Tab
  const filteredDrivers = liveDrivers.filter(d => {
    const matchesSearch = d.full_name.toLowerCase().includes(driverSearch.toLowerCase());
    const matchesTeam = teamFilter === 'all' || d.team_name.toLowerCase().includes(teamFilter.toLowerCase());
    const matchesCountry = countryFilter === 'all' || d.country_code.toLowerCase() === countryFilter.toLowerCase();
    return matchesSearch && matchesTeam && matchesCountry;
  });

  return (
    <div className={`relative min-h-screen ${ignitionState === 'IGNITING' ? 'screen-shake-active' : ''} text-[#A8A8A8]`}>
      <div className="cyber-grid"></div>
      <div className="scanlines"></div>

      {/* Global Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[1000] w-80 glass-panel p-4 border-l-4 ${toastMessage.type === 'error' ? 'border-[#FF1801]' : toastMessage.type === 'success' ? 'border-[#00D4FF]' : 'border-[#FFEC00]'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg text-white ${toastMessage.type === 'error' ? 'bg-[#FF1801]/30' : toastMessage.type === 'success' ? 'bg-[#00D4FF]/30' : 'bg-[#FFEC00]/30'}`}>
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <span className="font-f1 text-[10px] text-white tracking-widest uppercase">{toastMessage.title}</span>
                <p className="text-xs text-white mt-1">{toastMessage.desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ignition Sequence Intro Screen */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center select-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,24,1,0.06)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div className="z-10 text-center flex flex-col items-center max-w-lg px-6">
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.9, scale: 1 }}
                className="font-f1 text-5xl sm:text-6xl font-black tracking-widest text-white mb-2"
              >
                F1<span className="text-[#FF1801]">VERSE</span>
              </motion.h1>
              <p className="font-f1 text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-12">BEYOND FORMULA 1</p>

              {/* HUD Telemetry RPM bar */}
              <div className="glass-panel w-full p-6 bg-black/40 border border-white/5 mb-8 text-left">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-f1 text-[10px] text-zinc-500 tracking-wider">ENGINE RPM TELEMETRY</span>
                  <span className={`font-f1 text-[9px] px-2 py-0.5 rounded border ${
                    ignitionState === 'STANDBY' ? 'text-[#FFEC00] bg-[#FFEC00]/10 border-[#FFEC00]/20' :
                    ignitionState === 'IGNITING' ? 'text-red-500 bg-red-500/10 border-red-500/20' :
                    'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/20'
                  } animate-pulse`}>
                    {ignitionState}
                  </span>
                </div>
                
                <div className="relative w-full h-8 bg-zinc-900 border border-white/5 rounded overflow-hidden flex items-end p-0.5 gap-[2px]">
                  <div className="absolute inset-0 flex justify-between px-2 py-1 pointer-events-none font-f1 text-[8px] text-zinc-600 z-10">
                    <span>0K</span><span>4K</span><span>8K</span><span>12K</span><span>15K LIMIT</span>
                  </div>
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-[#FF1801] transition-all duration-75 ease-out"
                    style={{ width: `${(rpm / 15000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 font-f1 text-xs">
                  <span className="text-zinc-400">PUNIT INJECT DYNAMICS:</span>
                  <span className="text-white font-bold">{rpm} RPM</span>
                </div>
              </div>

              {/* Race lights countdown grid */}
              <div className="flex gap-4 mb-12 justify-center">
                {[1, 2, 3, 4, 5].map((lightIndex) => (
                  <div 
                    key={lightIndex}
                    className="w-8 h-8 rounded-full border border-white/10 transition-all duration-300"
                    style={{
                      backgroundColor: lightsCount >= lightIndex ? '#FF1801' : '#18181b',
                      boxShadow: lightsCount >= lightIndex ? '0 0 15px #FF1801' : 'none'
                    }}
                  ></div>
                ))}
              </div>

              {/* Start Trigger */}
              <button
                onClick={startIgnitionSequence}
                disabled={ignitionState !== 'STANDBY'}
                className="glass-button text-sm px-10 py-4 border-2 border-[#FF1801]/30 hover:border-[#FF1801] bg-[#FF1801]/10 text-white font-bold tracking-widest relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Power className="w-5 h-5 text-[#FF1801] group-hover:text-white animate-pulse" />
                  START ENGINE
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#FF1801] to-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </button>
            </div>

            {/* Moving SVG Car Flyby */}
            <div 
              className="absolute bottom-10 w-[400px] h-[100px] pointer-events-none transition-all duration-500 ease-in z-30"
              style={{ left: carFlybyLeft, opacity: carFlybyOpacity }}
            >
              <svg viewBox="0 0 100 40" className="w-full h-full fill-[#FF1801] drop-shadow-[0_0_15px_#FF1801]">
                <path d="M5 25 L15 25 L18 20 L25 20 L30 24 L55 24 L62 12 L70 12 L75 22 L90 22 L95 18 L98 25 L92 27 L70 27 L66 30 L50 30 L46 27 L15 27 Z"></path>
                <circle cx="28" cy="28" r="7" className="fill-zinc-900 stroke-[#FF1801] stroke-2"></circle>
                <circle cx="82" cy="28" r="7" className="fill-zinc-900 stroke-[#FF1801] stroke-2"></circle>
              </svg>
            </div>
            
            <h2 className="absolute font-f1 text-4xl sm:text-6xl font-black text-white tracking-widest uppercase z-50 pointer-events-none">
              {cinematicMsg}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Cockpit HUD Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 self-start md:self-auto">
          <a href="#" onClick={() => { setActivePage('home'); soundEngine.playBeep(); }} className="font-f1 text-2xl font-black tracking-wider text-white flex items-center gap-2">
            <span className="f1-logo-badge">F1</span>
            <span className="text-white font-black uppercase tracking-wider ml-1">VERSE 2.0</span>
          </a>
          
          <div className="hidden lg:flex items-center gap-5 font-f1 text-[10px] uppercase tracking-widest text-[#A8A8A8]">
            {['home', 'drivers', 'academy', 'garage', 'tracks', 'fantasy', 'ai', 'shop', 'sponsors'].map((p) => (
              <button 
                key={p} 
                onClick={() => { setActivePage(p); soundEngine.playBeep(); }}
                className={`hover:text-white transition-colors py-1 relative ${activePage === p ? 'text-white border-b border-[#FF1801]' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 self-end md:self-auto justify-end w-full md:w-auto">
          {/* Audio synthe knobs */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-white/5 text-xs">
            <select 
              value={soundProfile} 
              onChange={(e) => triggerSoundProfile(e.target.value)}
              className="bg-transparent border-none text-[#A8A8A8] font-f1 text-[9px] outline-none cursor-pointer"
            >
              <option value="v8">Aggressive V8</option>
              <option value="v10">Classic V10</option>
              <option value="v12">Screaming V12</option>
              <option value="electric">Stealth Electric</option>
            </select>
            
            <button onClick={toggleSynthMute} className="text-zinc-400 hover:text-white ml-2">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-[#00D4FF]" />}
            </button>
            <input 
              type="range" min="0" max="1" step="0.1" value={volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
              }}
              className="w-12 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#FF1801]"
            />
          </div>

          {/* Theme colors */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 p-1 rounded-lg">
            {['ferrari', 'mercedes', 'mclaren', 'redbull', 'aston'].map((themeName) => (
              <button 
                key={themeName} 
                onClick={() => {
                  setActiveTheme(themeName);
                  soundEngine.playBeep();
                }}
                className={`w-4 h-4 rounded-full border border-white/10 hover:scale-110 transition-transform ${
                  themeName === 'ferrari' ? 'bg-[#FF1801]' :
                  themeName === 'mercedes' ? 'bg-[#00D4FF]' :
                  themeName === 'mclaren' ? 'bg-[#FF8700]' :
                  themeName === 'redbull' ? 'bg-[#FFEC00]' :
                  'bg-[#00875A]'
                }`}
                title={themeName.toUpperCase()}
              ></button>
            ))}
          </div>

          {/* Auth Badges */}
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setAuthModal('login')} className="glass-button text-[9px] px-3 py-1.5 bg-transparent">Login</button>
              <button onClick={() => setAuthModal('signup')} className="glass-button text-[9px] px-3 py-1.5 bg-[#FF1801] border-[#FF1801]">Register</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="font-f1 text-[11px] font-semibold text-white">{currentUser.username}</span>
                <span className="text-[8px] text-[#FFEC00] tracking-wider font-mono">{currentUser.xp} XP ({currentUser.role.toUpperCase()})</span>
              </div>
              <div 
                className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-[#FF1801]/10 cursor-pointer overflow-hidden relative ${
                  activeFrameSkin === 'gold' ? 'profile-frame-gold' :
                  activeFrameSkin === 'cyan' ? 'profile-frame-cyan' :
                  activeFrameSkin === 'crimson' ? 'profile-frame-crimson' : ''
                }`}
                onClick={() => setActivePage('academy')}
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                  className="w-full h-full object-cover" 
                  alt="Avatar"
                />
              </div>
              
              {currentUser.role === 'admin' && (
                <button 
                  onClick={() => setActivePage('admin')}
                  className="glass-button text-[9px] px-2 py-1 bg-blue-600 border-blue-500 font-f1"
                >
                  Pit Wall
                </button>
              )}
              
              <button onClick={logoutUser} className="text-zinc-500 hover:text-[#FF1801] transition-colors" title="Disconnect">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Session Ticker */}
      <div className="f1-session-tracker border-b border-white/5 bg-zinc-950/60 backdrop-blur-sm">
        <div className="f1-session-title">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          ACTIVE SESSION GPS: {liveSessions[0]?.circuit_short_name || "MONACO"} GP
        </div>
        <div className="w-[1px] h-3 bg-white/10"></div>
        <div className="f1-session-items-wrapper">
          <div className="f1-session-item">
            <span className="f1-session-item-name">Practice 1</span>
            <span className="f1-session-item-time">FRI 11:30</span>
            <span className="f1-session-status finished">Finished</span>
          </div>
          <div className="f1-session-item">
            <span className="f1-session-item-name">Qualifying</span>
            <span className="f1-session-item-time">SAT 14:00</span>
            <span className="f1-session-status finished">Finished</span>
          </div>
          <div className="f1-session-item">
            <span className="f1-session-item-name">Grand Prix</span>
            <span className="f1-session-item-time">SUN 15:00</span>
            <span className="f1-session-status upcoming">LIVE CALIBRATION</span>
          </div>
        </div>
      </div>

      {/* Mobile nav indicator bar */}
      <div className="lg:hidden flex justify-around bg-zinc-900/90 border-b border-white/5 p-2 font-f1 text-[9px] tracking-wider">
        {['home', 'drivers', 'academy', 'garage', 'tracks', 'fantasy', 'ai', 'shop'].map((p) => (
          <button 
            key={p} 
            onClick={() => setActivePage(p)}
            className={`text-zinc-400 capitalize ${activePage === p ? 'text-white font-bold' : ''}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Main Single Page Layout Container */}
      <main className="relative min-h-[calc(100vh-140px)] w-full py-8 px-6 max-w-7xl mx-auto overflow-hidden">
        
        {/* ================= HOME SECTION ================= */}
        {activePage === 'home' && (
          <div className="space-y-12">
            
            {/* Immersive 3D Hero Section */}
            <div 
              className="relative rounded overflow-hidden min-h-[460px] flex items-center p-8 border border-white/5 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(to right, rgba(10,10,10,0.98) 45%, rgba(10,10,10,0.2) 100%), url(${HERO_BG})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
              
              <div className="max-w-xl space-y-6 relative z-10 text-left">
                <div className="inline-flex items-center gap-2 bg-[#FF1801]/10 border border-[#FF1801]/20 text-[#FF1801] px-3 py-1 rounded-sm font-f1 text-[10px] tracking-wider uppercase animate-pulse">
                  <Activity className="w-3.5 h-3.5" /> LIVE GP DATA CENTER ACTIVE
                </div>
                
                <h2 className="font-f1 text-5xl sm:text-6xl font-black leading-tight text-white italic tracking-wider">
                  F1<span className="text-[#FF1801]">VERSE</span> <br />
                  <span className="text-zinc-400 text-3xl sm:text-4xl not-italic tracking-wide">DIGITAL UNIVERSE</span>
                </h2>
                
                <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
                  Step inside the carbon fiber simulator workspace. Analyze volumetric downforces, morph historical rules shapes, buy custom visual frames, and draft elite fantasy rosters.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActivePage('academy')}
                    className="glass-button px-6 py-3 bg-[#FF1801] border-[#FF1801] text-white"
                  >
                    Academy Portal
                  </button>
                  <button 
                    onClick={() => setActivePage('garage')}
                    className="glass-button px-6 py-3 bg-transparent border-white/10 hover:border-[#00D4FF]"
                  >
                    3D Garage View
                  </button>
                </div>
              </div>

              {/* Float holographic UI component absolute placement */}
              <div className="absolute hidden lg:flex top-12 right-12 glass-panel p-4 flex-col gap-2 w-52 text-left border-[#00D4FF]">
                <span className="telemetry-label font-bold text-[8px] text-[#00D4FF]">TELEMETRY STREAM</span>
                <div className="text-white font-mono text-xs">GRID CONNECTIVITY: 98%</div>
                <div className="h-1 bg-zinc-950 rounded overflow-hidden mt-1">
                  <div className="h-full bg-[#00D4FF] w-[98%] animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Countdown & Standing canvas charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Monaco Countdown */}
              <div className="glass-panel p-6 flex flex-col justify-between border-t-4 border-[#FF1801] space-y-6 text-left">
                <div>
                  <span className="telemetry-label font-bold text-[8px] text-[#FF1801]">GP CALENDAR CALIBRATOR</span>
                  <h3 className="font-f1 text-lg font-black italic mt-1 text-white uppercase">MONACO GRAND PRIX</h3>
                </div>
                
                {/* Visual count-up timeline boxes */}
                <div className="grid grid-cols-4 gap-2 font-mono text-center">
                  <div className="bg-[#101015] p-2.5 rounded border border-white/5">
                    <span className="font-f1 text-xl font-bold text-white">02</span>
                    <div className="text-[7px] text-zinc-500 uppercase tracking-widest mt-1">Days</div>
                  </div>
                  <div className="bg-[#101015] p-2.5 rounded border border-white/5">
                    <span className="font-f1 text-xl font-bold text-white">14</span>
                    <div className="text-[7px] text-zinc-500 uppercase tracking-widest mt-1">Hours</div>
                  </div>
                  <div className="bg-[#101015] p-2.5 rounded border border-white/5">
                    <span className="font-f1 text-xl font-bold text-white">32</span>
                    <div className="text-[7px] text-zinc-500 uppercase tracking-widest mt-1">Mins</div>
                  </div>
                  <div className="bg-[#101015] p-2.5 rounded border border-white/5">
                    <span className="font-f1 text-xl font-bold text-white">45</span>
                    <div className="text-[7px] text-zinc-500 uppercase tracking-widest mt-1">Secs</div>
                  </div>
                </div>

                <button 
                  onClick={() => setActivePage('tracks')}
                  className="glass-button w-full text-[10px] py-2.5"
                >
                  <MapPin className="w-4 h-4 mr-1 text-[#FF1801]" /> Map Circuit Explorer
                </button>
              </div>

              {/* Dynamic Standing wave canvas */}
              <div className="glass-panel p-6 lg:col-span-2 flex flex-col justify-between space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="telemetry-label font-bold text-[8px] text-[#00D4FF]">LIVE TELEMETRY DYNAMICS</span>
                    <h3 className="font-f1 text-xs font-semibold mt-1 text-white uppercase">Championship Battle Waveforms</h3>
                  </div>
                  <div className="flex gap-3 text-[9px] font-mono">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#FF1801] rounded-full"></span> HAM</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#FFEC00] rounded-full"></span> VER</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#00D4FF] rounded-full"></span> LEC</span>
                  </div>
                </div>

                <div className="relative w-full h-36 bg-black/20 rounded overflow-hidden border border-white/5">
                  <canvas ref={standingCanvasRef} className="w-full h-full"></canvas>
                </div>
              </div>
            </div>

            {/* Live OpenF1 Command Center Panel */}
            <div className="glass-panel p-6 space-y-6 text-left border-t-4 border-[#00D4FF]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="telemetry-label font-bold text-[8px] text-[#00D4FF]">COCKPIT TELEMETRY CENTER</span>
                  <h3 className="font-f1 text-xl font-black text-white italic">LIVE F1 COMMAND CONSOLE</h3>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedSessionKey}
                    onChange={(e) => {
                      const key = parseInt(e.target.value);
                      setSelectedSessionKey(key);
                      fetchOpenF1Data(key);
                    }}
                    className="bg-black/60 border border-white/10 px-3 py-1.5 rounded text-xs font-f1 outline-none text-white focus:border-[#FF1801]"
                  >
                    <option value="9839">Monaco Grand Prix - Race</option>
                    <option value="9840">Silverstone GP - Qualifying</option>
                    <option value="9841">Monza GP - Practice 1</option>
                  </select>
                  
                  <button 
                    onClick={() => fetchOpenF1Data(selectedSessionKey)}
                    className="p-2 bg-zinc-800 rounded border border-white/10 text-white hover:bg-zinc-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {loadingOpenFOpenF1 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-28 bg-zinc-900 border border-white/5 rounded"></div>
                  ))}
                </div>
              ) : openF1Error ? (
                <div className="p-6 bg-red-950/20 border border-red-500/20 text-red-400 rounded flex flex-col items-center gap-3">
                  <span>{openF1Error}</span>
                  <button onClick={() => fetchOpenF1Data(selectedSessionKey)} className="glass-button text-[9px] px-4 py-1.5 bg-[#FF1801]">Retry Connection</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Driver Spotlight */}
                  <div className="bg-[#101015] p-4 rounded border border-white/5 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="telemetry-label text-[8px] text-[#00D4FF]">Driver Spotlight</span>
                      <h4 className="font-f1 text-sm font-bold text-white mt-1">
                        {liveDrivers[0]?.full_name || "Max Verstappen"}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        No. {liveDrivers[0]?.driver_number || 1} | {liveDrivers[0]?.team_name || "Red Bull"}
                      </p>
                    </div>
                    <span 
                      className="text-[9px] px-2 py-0.5 rounded font-f1 max-w-max text-white uppercase"
                      style={{ backgroundColor: `#${liveDrivers[0]?.team_colour || '061D3B'}` }}
                    >
                      {liveDrivers[0]?.name_acronym || "VER"}
                    </span>
                  </div>

                  {/* Session Information */}
                  <div className="bg-[#101015] p-4 rounded border border-white/5 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="telemetry-label text-[8px] text-[#FF1801]">Session GPS Details</span>
                      <h4 className="font-f1 text-sm font-bold text-white mt-1">
                        {liveSessions.find(s => s.session_key === selectedSessionKey)?.session_name || "Grand Prix"}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {liveSessions.find(s => s.session_key === selectedSessionKey)?.circuit_short_name || "Monte Carlo"}, {liveSessions.find(s => s.session_key === selectedSessionKey)?.country_name || "Monaco"}
                      </p>
                    </div>
                    <div className="text-[9px] font-mono text-zinc-400">
                      KEY: {selectedSessionKey}
                    </div>
                  </div>

                  {/* Weather Dashboard */}
                  <div className="bg-[#101015] p-4 rounded border border-white/5 space-y-2">
                    <span className="telemetry-label text-[8px] text-[#FFEC00]">Weather Dashboard</span>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div>
                        <span className="text-zinc-500 text-[9px]">Air Temp</span>
                        <p className="text-white font-bold">{liveWeather?.air_temperature || 24}°C</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[9px]">Track Temp</span>
                        <p className="text-white font-bold">{liveWeather?.track_temperature || 36}°C</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[9px]">Wind Speed</span>
                        <p className="text-white font-bold">{liveWeather?.wind_speed || 12} km/h</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[9px]">Rainfall</span>
                        <p className="text-[#00D4FF] font-bold">{liveWeather?.rainfall === 1 ? "WET" : "DRY"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard positions */}
                  <div className="bg-[#101015] p-4 rounded border border-white/5 flex flex-col justify-between max-h-[140px] overflow-hidden">
                    <span className="telemetry-label text-[8px] text-zinc-500">Live Grid Standings</span>
                    <div className="space-y-1 overflow-y-auto mt-2 pr-1 scrollbar-thin text-[9px]">
                      {livePositions.slice(0, 5).map(pos => {
                        const drv = liveDrivers.find(d => d.driver_number === pos.driver_number);
                        return (
                          <div key={pos.driver_number} className="flex justify-between border-b border-white/5 pb-0.5">
                            <span className="text-white">P{pos.position} {drv?.name_acronym || `N.${pos.driver_number}`}</span>
                            <span className="text-zinc-500">{drv?.team_name.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Drivers & Social Comments Roster */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left driver grid */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-f1 text-lg font-bold border-l-4 border-[#FF1801] pl-3 text-white">FEATURED GRID DRIVERS</h3>
                  <button 
                    onClick={() => { setShowWrappedModal(true); setWrappedSlide(0); soundEngine.playBeep(); }} 
                    className="glass-button text-[9px] bg-[#FFEC00]/10 border-[#FFEC00] text-[#FFEC00]"
                  >
                    <Film className="w-3.5 h-3.5 mr-1" /> Season Wrapped Recap
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 justify-start">
                  {liveDrivers.slice(0, 3).map((d, index) => {
                    const nameParts = d.full_name.split(' ');
                    const first = nameParts[0];
                    const last = nameParts.slice(1).join(' ');
                    return (
                      <div 
                        key={d.driver_number}
                        className="f1-standings-card"
                        style={{ '--team-color': `#${d.team_colour}` } as any}
                      >
                        <div className="f1-standings-rank">{index + 1}</div>
                        <img src={d.headshot_url} className="f1-standings-avatar" alt={d.full_name} />
                        <div className="f1-standings-details">
                          <div className="f1-standings-name">
                            <span>{first}</span>{last}
                          </div>
                          <div className="f1-standings-team">{d.team_name.toUpperCase()} | {d.country_code}</div>
                        </div>
                        <div className="f1-standings-points-box">
                          <div className="f1-standings-points">{d.points || 150}</div>
                          <div className="f1-standings-points-label">PTS</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Radio comments */}
              <div className="space-y-6 text-left">
                <h3 className="font-f1 text-lg font-bold border-l-4 border-[#FF1801] pl-3 text-white uppercase">COMMUNITY RADIO FEED</h3>
                
                <div className="glass-panel p-4 space-y-4">
                  <div className="max-h-56 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {socialLogs.map((log, idx) => (
                      <div key={idx} className="bg-black/40 p-3 rounded border border-white/5 text-xs">
                        <div className="flex justify-between font-f1 text-[9px] text-zinc-500">
                          <span>{log.user}</span>
                          <span>{log.time}</span>
                        </div>
                        <p className="text-white mt-1 leading-relaxed">{log.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={postSocialLog} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type radio logs..." 
                      value={socialInput}
                      onChange={(e) => setSocialInput(e.target.value)}
                      required 
                      className="bg-black/50 border border-white/10 px-3 py-2 rounded text-xs outline-none focus:border-[#FF1801] flex-1 text-white"
                    />
                    <button type="submit" className="glass-button text-[9px] px-3 bg-[#FF1801] border-[#FF1801]">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= HOLOGRAPHIC DRIVERS GALLERY ================= */}
        {activePage === 'drivers' && (
          <div className="space-y-8 text-left">
            <div>
              <h2 className="font-f1 text-2xl font-black border-l-4 border-[#FF1801] pl-3 text-white uppercase tracking-wider">Holographic Driver Gallery</h2>
              <p className="text-[10px] text-zinc-400 mt-1">Draft lineup configurations and analyze telemetry indexes.</p>
            </div>

            {/* Filters dashboard */}
            <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-black/40 border-white/5">
              <div className="w-full md:flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Search driver signature..." 
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  className="bg-black/50 border border-white/10 w-full px-4 py-2 rounded text-xs outline-none text-white focus:border-[#FF1801] font-f1"
                />
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="hud-input-group mb-0 flex-1 md:flex-initial">
                  <select 
                    value={teamFilter} 
                    onChange={(e) => { setTeamFilter(e.target.value); soundEngine.playBeep(); }}
                    className="hud-input py-2 text-xs font-f1"
                  >
                    <option value="all">All Teams</option>
                    <option value="red bull">Red Bull</option>
                    <option value="ferrari">Ferrari</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="mclaren">McLaren</option>
                    <option value="aston">Aston Martin</option>
                  </select>
                </div>

                <div className="hud-input-group mb-0 flex-1 md:flex-initial">
                  <select 
                    value={countryFilter}
                    onChange={(e) => { setCountryFilter(e.target.value); soundEngine.playBeep(); }}
                    className="hud-input py-2 text-xs font-f1"
                  >
                    <option value="all">All Countries</option>
                    <option value="NED">Netherlands</option>
                    <option value="GBR">Great Britain</option>
                    <option value="MON">Monaco</option>
                    <option value="ESP">Spain</option>
                    <option value="AUS">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              <AnimatePresence>
                {filteredDrivers.map(d => (
                  <motion.div
                    key={d.driver_number}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="fut-card relative border-t-4"
                    style={{ borderColor: `#${d.team_colour}` }}
                  >
                    <div className="fut-rating" style={{ color: `#${d.team_colour}` }}>{d.rating || 88}</div>
                    <div className="fut-position">{d.name_acronym}</div>
                    <img src={d.headshot_url} className="fut-avatar" alt={d.full_name} />
                    
                    <h4 className="fut-name">{d.full_name.split(' ').slice(1).join(' ') || d.full_name}</h4>
                    <span className="text-[8px] uppercase text-zinc-500 font-mono tracking-wider">{d.team_name} | {d.country_code}</span>

                    <div className="fut-stats">
                      <div className="fut-stat-item">
                        <span>Pace</span><span className="fut-stat-val" style={{ color: `#${d.team_colour}` }}>{d.pace}</span>
                      </div>
                      <div className="fut-stat-item">
                        <span>Qual</span><span className="fut-stat-val" style={{ color: `#${d.team_colour}` }}>{d.qualifying}</span>
                      </div>
                      <div className="fut-stat-item">
                        <span>Def</span><span className="fut-stat-val" style={{ color: `#${d.team_colour}` }}>{d.defense}</span>
                      </div>
                      <div className="fut-stat-item">
                        <span>Exp</span><span className="fut-stat-val" style={{ color: `#${d.team_colour}` }}>{d.experience}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ================= ACADEMY SECTION ================= */}
        {activePage === 'academy' && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-f1 text-2xl font-black border-l-4 border-[#FF1801] pl-3 text-white uppercase tracking-wider">DRIVER PROGRESSION COCKPIT</h2>
                <p className="text-[10px] text-zinc-400 mt-1">Enroll in elite telemetry modules to accumulate XP and unlock animated badges.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input 
                  type="text" placeholder="Search Academy..."
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  className="bg-black/40 border border-white/10 px-4 py-2 rounded text-xs font-f1 outline-none focus:border-[#FF1801] w-full md:w-44"
                />
              </div>
            </div>

            {/* Profile dashboards if logged in */}
            {currentUser && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-panel p-6 border-l-4 border-[#FFEC00] space-y-4">
                  <span className="telemetry-label">DRIVER LICENSE STATUS</span>
                  <h3 className="font-f1 text-lg font-bold text-white">{currentUser.username}</h3>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-[#FFEC00] bg-[#FFEC00]/10 px-2 py-0.5 rounded border border-[#FFEC00]/20 font-f1 font-semibold uppercase">{currentUser.rank}</span>
                    <span className="text-zinc-400 font-mono">{currentUser.xp} XP</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FFEC00] h-full" style={{ width: `${Math.min((currentUser.xp / 2000) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="glass-panel p-6 md:col-span-3 flex flex-col justify-between">
                  <span className="telemetry-label">ACTIVE MODULES PROGRESS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    {currentUser.enrolledCourses?.length > 0 ? (
                      currentUser.enrolledCourses.map(ec => {
                        const c = courses.find(x => x.id === ec.courseId);
                        if (!c) return null;
                        return (
                          <div key={ec.courseId} className="bg-black/30 p-3 rounded border border-white/5 flex flex-col justify-between">
                            <span className="font-f1 text-[9px] text-[#00D4FF] uppercase">{c.category}</span>
                            <h4 className="text-xs font-bold text-white mt-1 truncate">{c.title}</h4>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-[10px] text-zinc-500">{ec.progress}% Progress</span>
                              <button 
                                onClick={() => {
                                  setEnrolledCourseId(ec.courseId);
                                  setActiveLessonId(c.modules[0]?.lessons[0]?.id || null);
                                }}
                                className="text-[8px] bg-zinc-800 px-2 py-1 rounded border border-white/10 hover:border-[#FF1801] text-white"
                              >
                                OPEN Sandbox
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-zinc-500 italic col-span-3">No simulation modules active. Choose a telemetry course below to enroll.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Learning Cockpit Sandbox screen */}
            {enrolledCourseId && activeLessonId && (
              <div className="glass-panel p-6 border-t-4 border-[#00D4FF] space-y-6">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => { setEnrolledCourseId(null); setActiveLessonId(null); }}
                    className="text-zinc-400 hover:text-white flex items-center gap-1 text-xs font-f1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Close Sandbox Console
                  </button>
                  <span className="text-xs font-f1 text-[#FFEC00] uppercase font-bold">LIVE CALIBRATION ROOM</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left canvas visualizer */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="h-64 bg-black/90 rounded border border-white/5 relative overflow-hidden flex items-center justify-center">
                      <canvas ref={telemetryCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
                      
                      <div className="absolute top-4 left-4 z-10 font-f1 text-[8px] text-red-500 border border-red-500/20 px-2 py-0.5 rounded bg-red-500/5 animate-pulse uppercase">
                        LIVE TELEMETRY CALIBRATION: ACTIVE
                      </div>

                      <div className="z-10 flex flex-col items-center gap-2">
                        <button 
                          onClick={() => {
                            setSimVideoPlaying(prev => !prev);
                            soundEngine.playBeep();
                          }}
                          className="w-12 h-12 rounded-full bg-[#FF1801] text-white flex items-center justify-center hover:scale-105 transition-transform"
                        >
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </button>
                        <span className="text-[10px] text-white font-f1 tracking-wider uppercase">
                          {simVideoPlaying ? "PAUSE SIMULATION VIDEO" : "PLAY RACING SIMULATION FEED"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#101015] p-5 rounded border border-white/5 space-y-3">
                      <h3 className="font-f1 text-md font-bold text-white uppercase">
                        {courses.find(c => c.id === enrolledCourseId)?.modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId)?.title || "Select Lesson"}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {courses.find(c => c.id === enrolledCourseId)?.modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId)?.content || "Syllabus outlines loaded."}
                      </p>
                      
                      <button 
                        onClick={() => toggleLessonStatus(enrolledCourseId, activeLessonId)}
                        className="glass-button text-xs py-2 px-6 border-[#FF1801]/30 hover:border-[#FF1801] text-white bg-transparent"
                      >
                        <CheckSquare className="w-4 h-4 mr-1 text-[#FF1801]" /> 
                        {localStorage.getItem(`completed_${currentUser?.username}_${activeLessonId}`) === 'true' ? "Lesson Completed (Click to Reset)" : "Mark Lesson Completed"}
                      </button>
                    </div>
                  </div>

                  {/* Syllabus outline sidebar */}
                  <div className="space-y-4">
                    <span className="telemetry-label font-bold text-[8px]">Syllabus Roadmap</span>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
                      {courses.find(c => c.id === enrolledCourseId)?.modules.map((m, mIdx) => (
                        <div key={mIdx} className="space-y-2">
                          <h4 className="text-xs font-f1 text-white font-bold tracking-wider">{m.name}</h4>
                          <div className="space-y-1">
                            {m.lessons.map(l => {
                              const done = localStorage.getItem(`completed_${currentUser?.username}_${l.id}`) === 'true';
                              return (
                                <button
                                  key={l.id}
                                  onClick={() => setActiveLessonId(l.id)}
                                  className={`w-full text-left p-2.5 rounded text-xs flex justify-between items-center transition-colors ${
                                    activeLessonId === l.id ? 'bg-[#FF1801]/10 border border-[#FF1801]/30 text-white' : 'bg-black/40 border border-white/5 hover:border-zinc-700 text-zinc-400'
                                  }`}
                                >
                                  <span className="truncate mr-2">{l.title}</span>
                                  {done && <span className="text-green-400 text-[10px] font-f1">DONE</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Roster */}
            <div className="space-y-6">
              <h3 className="font-f1 text-lg font-bold border-l-4 border-[#FF1801] pl-3 text-white uppercase">AVAILABLE TELEMETRY COURSES</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses
                  .filter(c => c.title.toLowerCase().includes(driverSearch.toLowerCase()))
                  .map(c => {
                    const isEnrolled = currentUser?.enrolledCourses?.some(ec => ec.courseId === c.id) || false;
                    return (
                      <div key={c.id} className="glass-panel p-6 flex flex-col justify-between border-t-4 border-zinc-800 hover:border-[#FF1801] transition-all">
                        <div className="space-y-3">
                          <span className="telemetry-label font-bold text-[8px] text-[#FF1801]">{c.category.toUpperCase()}</span>
                          <h4 className="font-f1 text-md font-bold text-white uppercase">{c.title}</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed">{c.desc}</p>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                          <span className="font-f1 text-lg font-black text-white">${c.price.toFixed(2)}</span>
                          {isEnrolled ? (
                            <button 
                              onClick={() => {
                                setEnrolledCourseId(c.id);
                                setActiveLessonId(c.modules[0]?.lessons[0]?.id || null);
                                soundEngine.playBeep();
                              }}
                              className="glass-button text-[9px] py-1.5 px-4 bg-green-600 border-green-500 text-white"
                            >
                              OPEN Sandbox
                            </button>
                          ) : (
                            <button 
                              onClick={() => enrollInCourse(c.id, c.price)}
                              className="glass-button text-[9px] py-1.5 px-4 border-white/10 hover:border-[#FF1801]"
                            >
                              Enroll Gateway
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3D GARAGE SECTION ================= */}
        {activePage === 'garage' && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-f1 text-2xl font-black border-l-4 border-[#FF1801] pl-3 text-white uppercase tracking-wider">F1 DEVELOPMENT LAB & GARAGE</h2>
                <p className="text-[10px] text-zinc-400 mt-1">Stark mechanical lab - Volumetric 3D telemetry scanner</p>
              </div>

              <div className="flex gap-1 bg-black/40 border border-white/5 p-1 rounded">
                {(['showroom', 'compare', 'lab'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setGarageTab(tab); soundEngine.playBeep(); }}
                    className={`glass-button text-[9px] px-4 py-1.5 border-none ${garageTab === tab ? 'bg-[#FF1801] text-white font-bold' : 'bg-transparent text-zinc-400'}`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB 1: SHOWROOM */}
            {garageTab === 'showroom' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* 3D viewport canvas window */}
                <div 
                  className={`lg:col-span-3 h-[480px] bg-black border border-white/5 rounded relative overflow-hidden flex items-center justify-center ${
                    shutterState === 'closed' ? '' : 'shutter-open'
                  }`}
                >
                  {/* Shutter Doors */}
                  <div className="shutter-door-top flex items-end justify-center pb-2">
                    <span className="font-f1 text-[9px] text-zinc-600 tracking-[0.2em]">PNEUMATIC SECURE SEAL</span>
                  </div>
                  <div className="shutter-door-bottom flex items-start justify-center pt-2">
                    <span className="font-f1 text-[9px] text-zinc-600 tracking-[0.2em]">LAB SHIELD LOCK</span>
                  </div>

                  <div className="laser-scanner-line"></div>
                  <div className="volumetric-cone" style={{ '--primary-glow': activeTheme === 'mercedes' ? 'rgba(0,212,255,0.15)' : 'rgba(255,24,1,0.15)' } as any}></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 neon-floor-grid pointer-events-none"></div>

                  <div className="absolute top-4 left-4 z-10 font-f1 text-[8px] text-green-400 border border-green-500/20 px-2 py-0.5 rounded bg-green-500/5 animate-pulse uppercase">
                    LAB SCANNER STATUS: ONLINE
                  </div>

                  {/* Render target */}
                  <canvas ref={showroomCanvasRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-0"></canvas>

                  {/* Floating HUD info panels */}
                  <div className="holo-card-hud top-12 right-4 text-left">
                    <span className="telemetry-label text-[8px] text-[#FFEC00]">HP output</span>
                    <div className="text-white font-bold text-xs mt-0.5">{DEFAULT_CARS[selectedGarageCar as keyof typeof DEFAULT_CARS]?.hp || 1020} HP</div>
                  </div>
                  <div className="holo-card-hud bottom-24 right-4 text-left">
                    <span className="telemetry-label text-[8px] text-[#00D4FF]">Reliability</span>
                    <div className="text-[#00D4FF] font-bold text-xs mt-0.5">{DEFAULT_CARS[selectedGarageCar as keyof typeof DEFAULT_CARS]?.reliability || "95%"}</div>
                  </div>

                  {/* Click component popup */}
                  {explodedPartName && explodedPartDesc && (
                    <div className="exploded-details-panel p-4 rounded text-left">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-2">
                        <h4 className="font-f1 text-xs font-bold text-white uppercase">{explodedPartName}</h4>
                        <button onClick={() => { setExplodedPartName(null); setExplodedPartDesc(null); }} className="text-zinc-500 hover:text-white">✕</button>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">{explodedPartDesc}</p>
                    </div>
                  )}

                  {/* Bottom toolbar */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between gap-4 pointer-events-none z-20">
                    <div className="flex gap-1 pointer-events-auto">
                      {(['real', 'hologram', 'aero', 'exploded', 'xray'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => { setGarageViewMode(mode); soundEngine.playBeep(); }}
                          className={`glass-button text-[9px] py-1.5 px-3 ${garageViewMode === mode ? 'bg-[#FF1801] border-[#FF1801] text-white' : ''}`}
                        >
                          {mode.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setIsShroomCinematic(prev => !prev)}
                      className="glass-button text-[9px] py-1.5 px-3 bg-[#FFEC00] text-black border-[#FFEC00] pointer-events-auto"
                    >
                      <Film className="w-3.5 h-3.5 mr-1" /> PAN CAMERA
                    </button>
                  </div>
                </div>

                {/* Right configuration inspector */}
                <div className="glass-panel p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="telemetry-label">VOLUMETRIC SPECIFICATIONS</span>
                    <h3 className="font-f1 text-lg font-black text-white italic">{DEFAULT_CARS[selectedGarageCar as keyof typeof DEFAULT_CARS]?.name.toUpperCase() || "RED BULL RB19"}</h3>
                    
                    <div className="space-y-2.5 text-xs border-y border-white/5 py-4 font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Power Unit:</span>
                        <span className="text-white">{DEFAULT_CARS[selectedGarageCar as keyof typeof DEFAULT_CARS]?.pu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Chassis ID:</span>
                        <span className="text-white">{DEFAULT_CARS[selectedGarageCar as keyof typeof DEFAULT_CARS]?.chassis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Top Velocity:</span>
                        <span className="text-white">{DEFAULT_CARS[selectedGarageCar as keyof typeof DEFAULT_CARS]?.speed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Body Aerofoil:</span>
                        <span className="text-white truncate max-w-[120px]" title={DEFAULT_CARS[selectedGarageCar as keyof typeof DEFAULT_CARS]?.desc}>
                          {DEFAULT_CARS[selectedGarageCar as keyof typeof DEFAULT_CARS]?.desc}
                        </span>
                      </div>
                    </div>

                    <div className="hud-input-group mt-6">
                      <select 
                        value={selectedGarageCar}
                        onChange={(e) => triggerCarReveal(e.target.value)}
                        className="hud-input font-f1 text-xs"
                      >
                        <option value="redbull">Red Bull Racing RB19</option>
                        <option value="ferrari">Ferrari SF-23</option>
                        <option value="mercedes">Mercedes W14</option>
                        <option value="mclaren">McLaren MCL60</option>
                      </select>
                      <label className="hud-label">SELECT TELEMETRY FRAME</label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="telemetry-label font-bold text-[8px]">Unlocked Sponsor Decals</span>
                    <div className="flex gap-2 flex-wrap text-[9px] font-mono">
                      {sponsors.some(s => s.unlocked) ? (
                        sponsors.filter(s => s.unlocked).map(s => (
                          <span key={s.id} className="bg-green-950/20 border border-green-500/20 text-green-400 px-2.5 py-1 rounded">
                            {s.reward}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-500 italic">No decals equipped. Complete sponsor agreements.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COMPARE CHAMBER */}
            {garageTab === 'compare' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Viewport */}
                <div className="lg:col-span-3 h-[420px] bg-black border border-white/5 rounded relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,#000_100%)] pointer-events-none z-10"></div>
                  
                  {/* render target */}
                  <canvas ref={compareCanvasRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-0"></canvas>

                  <div className="absolute bottom-4 left-4 z-20 flex gap-1">
                    {(['real', 'holo', 'wire'] as const).map(mat => (
                      <button
                        key={mat}
                        onClick={() => { setCompareMaterial(mat); soundEngine.playBeep(); }}
                        className={`glass-button text-[9px] py-1 px-3 ${compareMaterial === mat ? 'bg-[#FF1801] border-[#FF1801] text-white' : ''}`}
                      >
                        {mat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specs comparison */}
                <div className="glass-panel p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="telemetry-label font-bold text-[#FFEC00]">COMPARISON SPECS</span>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <select 
                        value={compareCar1}
                        onChange={(e) => { setCompareCar1(e.target.value); soundEngine.playBeep(); }}
                        className="hud-input bg-zinc-900 border border-white/10 text-white font-f1 text-[9px] py-1.5"
                      >
                        <option value="redbull">Red Bull RB19</option>
                        <option value="ferrari">Ferrari SF-23</option>
                        <option value="mercedes">Mercedes W14</option>
                        <option value="mclaren">McLaren MCL60</option>
                      </select>
                      
                      <select 
                        value={compareCar2}
                        onChange={(e) => { setCompareCar2(e.target.value); soundEngine.playBeep(); }}
                        className="hud-input bg-zinc-900 border border-white/10 text-white font-f1 text-[9px] py-1.5"
                      >
                        <option value="redbull">Red Bull RB19</option>
                        <option value="ferrari">Ferrari SF-23</option>
                        <option value="mercedes">Mercedes W14</option>
                        <option value="mclaren">McLaren MCL60</option>
                      </select>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5 text-[10px] text-left">
                      <div className="space-y-1">
                        <div className="flex justify-between font-f1">
                          <span>Horsepower</span>
                          <span className="text-white font-mono">{DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.hp} vs {DEFAULT_CARS[compareCar2 as keyof typeof DEFAULT_CARS]?.hp} HP</span>
                        </div>
                        <div className="comparison-stat-bar">
                          <div 
                            className="comparison-stat-fill"
                            style={{ width: `${(DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.hp / (DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.hp + DEFAULT_CARS[compareCar2 as keyof typeof DEFAULT_CARS]?.hp)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-f1">
                          <span>Aerodynamics</span>
                          <span className="text-white font-mono">{DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.aero} vs {DEFAULT_CARS[compareCar2 as keyof typeof DEFAULT_CARS]?.aero}</span>
                        </div>
                        <div className="comparison-stat-bar">
                          <div 
                            className="comparison-stat-fill"
                            style={{ width: `${(parseInt(DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.aero) / (parseInt(DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.aero) + parseInt(DEFAULT_CARS[compareCar2 as keyof typeof DEFAULT_CARS]?.aero))) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-f1">
                          <span>Top Speed</span>
                          <span className="text-white font-mono">{DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.speed} vs {DEFAULT_CARS[compareCar2 as keyof typeof DEFAULT_CARS]?.speed}</span>
                        </div>
                        <div className="comparison-stat-bar">
                          <div 
                            className="comparison-stat-fill"
                            style={{ width: `${(parseInt(DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.speed) / (parseInt(DEFAULT_CARS[compareCar1 as keyof typeof DEFAULT_CARS]?.speed) + parseInt(DEFAULT_CARS[compareCar2 as keyof typeof DEFAULT_CARS]?.speed))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase text-center">
                    Dual diagnostic viewport comparator
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: R&D TIMELINE */}
            {garageTab === 'lab' && (
              <div className="glass-panel p-6 space-y-6">
                <div>
                  <span className="telemetry-label font-bold text-[#FFEC00]">HISTORICAL MORPHING SYSTEM</span>
                  <h3 className="font-f1 text-lg font-black text-white uppercase mt-0.5">Rules Evolution Timeline</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* render target */}
                  <div className="lg:col-span-2 h-[350px] bg-black border border-white/5 rounded relative flex items-center justify-center">
                    <canvas ref={labCanvasRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-0"></canvas>
                    <div className="absolute top-4 left-4 z-10 font-f1 text-[8px] text-[#00D4FF] border border-[#00D4FF]/20 px-2 py-0.5 rounded bg-[#00D4FF]/5 animate-pulse uppercase">
                      Morphing Engine Status: LOCKED
                    </div>
                  </div>

                  {/* Era controls */}
                  <div className="glass-panel p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <span className="telemetry-label">Select Rule Era</span>
                      <div className="rd-timeline-nav">
                        {[1950, 1970, 1990, 2010, 2026].map(year => (
                          <div
                            key={year}
                            onClick={() => changeRdEra(year)}
                            className={`rd-timeline-node ${currentRdEra === year ? 'active-node border-[#FF1801]' : ''}`}
                          >
                            {year}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-2 text-left">
                        <h4 className="font-f1 font-bold text-white uppercase text-sm">
                          {ERA_DATA[currentRdEra as keyof typeof ERA_DATA]?.title}
                        </h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          {ERA_DATA[currentRdEra as keyof typeof ERA_DATA]?.desc}
                        </p>
                      </div>
                    </div>

                    <div className="bg-black/40 p-3 rounded border border-white/5 text-[9px] text-zinc-500 flex justify-between font-mono">
                      <span>CODE: <span className="text-white">{ERA_DATA[currentRdEra as keyof typeof ERA_DATA]?.code}</span></span>
                      <span>Downforce: <span className="text-white">{ERA_DATA[currentRdEra as keyof typeof ERA_DATA]?.aero}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TRACK EXPLORER SECTION ================= */}
        {activePage === 'tracks' && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-f1 text-2xl font-black border-l-4 border-[#FF1801] pl-3 text-white uppercase tracking-wider">TRACK EXPLORER</h2>
                <p className="text-[10px] text-zinc-400 mt-1">Vector GPS flyovers and telemetry profiles</p>
              </div>

              <div className="hud-input-group mb-0 w-full md:w-56">
                <select 
                  value={activeTrack}
                  onChange={(e) => { setActiveTrack(e.target.value); soundEngine.playBeep(); }}
                  className="hud-input font-f1 text-xs"
                >
                  <option value="monaco">Monaco GP (Monte Carlo)</option>
                  <option value="silverstone">Silverstone Circuit (UK)</option>
                  <option value="monza">Monza GP (Temple of Speed)</option>
                </select>
                <label className="hud-label">ACTIVE CIRCUIT FRAME</label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Vector render canvas */}
              <div className="lg:col-span-2 h-[400px] bg-black/80 border border-white/5 rounded flex items-center justify-center relative">
                <div className="absolute top-4 left-4 z-10 font-f1 text-[8px] text-[#00D4FF] border border-[#00D4FF]/20 px-2 py-0.5 rounded bg-[#00D4FF]/5 animate-pulse uppercase">
                  3D GPS SIMULATOR TRACKING: ACTIVE
                </div>
                
                <canvas ref={trackCanvasRef} className="w-full h-full"></canvas>
              </div>

              {/* Specification stats card */}
              <div className="glass-panel p-6 flex flex-col justify-between space-y-6 border-t-4 border-[#FF1801]">
                <div className="space-y-4">
                  <span className="telemetry-label">Circuit Parameters</span>
                  <h3 className="font-f1 text-xl font-bold text-white italic">{DEFAULT_TRACKS[activeTrack as keyof typeof DEFAULT_TRACKS]?.name || "Monaco GP"}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {DEFAULT_TRACKS[activeTrack as keyof typeof DEFAULT_TRACKS]?.desc}
                  </p>

                  <div className="space-y-2.5 text-xs pt-4 border-t border-white/5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Corner sectors:</span>
                      <span className="text-white font-bold">{DEFAULT_TRACKS[activeTrack as keyof typeof DEFAULT_TRACKS]?.corners} Corners</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Lap record index:</span>
                      <span className="text-[#FF1801] font-bold">{DEFAULT_TRACKS[activeTrack as keyof typeof DEFAULT_TRACKS]?.laprecord}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">DRS active zones:</span>
                      <span className="text-white font-bold">{DEFAULT_TRACKS[activeTrack as keyof typeof DEFAULT_TRACKS]?.drs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Elevation deviation:</span>
                      <span className="text-white font-bold">{DEFAULT_TRACKS[activeTrack as keyof typeof DEFAULT_TRACKS]?.elevation}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    soundEngine.playTireScreech();
                    triggerToast("TELEMETRY", "Simulated flyover sound loaded", "success");
                  }}
                  className="glass-button w-full text-xs py-2.5"
                >
                  <Play className="w-4 h-4 mr-1 text-[#FF1801]" /> SIMULATE FLYOVER RADIO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= FANTASY LEAGUE SECTION ================= */}
        {activePage === 'fantasy' && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 gap-4">
              <div>
                <h2 className="font-f1 text-2xl font-black text-white uppercase tracking-wider">FANTASY LEAGUE 2.0</h2>
                <p className="text-xs text-zinc-400 mt-1">Draft 5 drivers inside a strict $150M telemetry cap budget.</p>
              </div>
              <div className="text-right">
                <span className="telemetry-label">REMAINING DRAFT CAPITAL</span>
                <div className={`font-f1 text-2xl font-black mt-0.5 ${fantasyBudget < 15.0 ? 'text-red-500' : 'text-green-400'}`}>
                  ${fantasyBudget.toFixed(2)}M
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Drafting drivers grid */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-f1 text-sm font-bold border-l-4 border-[#FF1801] pl-3 text-white">DRAFT DRIVERS</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FANTASY_DRIVERS.map(fd => {
                    const isDrafted = fantasyDrivers.includes(fd.id);
                    return (
                      <div 
                        key={fd.id}
                        className={`p-4 rounded border flex justify-between items-center transition-all ${
                          isDrafted ? 'bg-[#FF1801]/10 border-[#FF1801]' : 'bg-[#101015] border-white/5 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <h4 className="font-f1 text-sm font-bold text-white">{fd.name}</h4>
                          <span className="text-[10px] text-zinc-500 uppercase">{fd.team} | Rating: {fd.rating}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-[#FFEC00] font-bold">${fd.price.toFixed(1)}M</span>
                          <button
                            onClick={() => selectFantasyDriver(fd.id, fd.price)}
                            className={`px-3 py-1 rounded text-[9px] font-f1 ${
                              isDrafted ? 'bg-[#FF1801] text-white' : 'bg-zinc-800 text-zinc-300 hover:text-white'
                            }`}
                          >
                            {isDrafted ? "DRAFTED" : "DRAFT"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* draft slots summary */}
              <div className="glass-panel p-6 flex flex-col justify-between space-y-6 border-t-4 border-[#FFEC00]">
                <div className="space-y-4">
                  <span className="telemetry-label font-bold text-[#FFEC00]">Roster Slots (5 total)</span>
                  
                  <div className="space-y-3 font-mono text-xs">
                    {[0, 1, 2, 3, 4].map(idx => {
                      const dId = fantasyDrivers[idx];
                      const driver = FANTASY_DRIVERS.find(x => x.id === dId);
                      return (
                        <div key={idx} className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-zinc-500">Slot #{idx+1}:</span>
                          <span className="text-white font-bold">{driver ? driver.name.toUpperCase() : "UNASSIGNED"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={submitFantasyRoster}
                  className="glass-button w-full py-3 bg-[#FFEC00] border-[#FFEC00] text-black font-bold uppercase"
                >
                  Deploy Team Telemetry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= AI HUB SECTION ================= */}
        {activePage === 'ai' && (
          <div className="space-y-8 text-left">
            <div>
              <h2 className="font-f1 text-2xl font-black border-l-4 border-[#FF1801] pl-3 text-white uppercase tracking-wider">AI STRATEGY & STANDINGS</h2>
              <p className="text-[10px] text-zinc-400 mt-1">Predict alternate championships and calculate tyre compound pitstops</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Standings Re-simulator */}
              <div className="lg:col-span-2 glass-panel p-6 space-y-6 border-t-4 border-[#FF1801]">
                <span className="telemetry-label font-bold text-white">"WHAT-IF" CHAMPIONSHIP SIMULATOR</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="hud-input-group mb-0">
                    <select 
                      value={aiWhatIfDriver}
                      onChange={(e) => setAiWhatIfDriver(e.target.value)}
                      className="hud-input text-xs font-f1"
                    >
                      <option value="nor">Lando Norris wins Monaco GP</option>
                      <option value="lec">Charles Leclerc wins Monza GP</option>
                      <option value="ham">Lewis Hamilton wins Silverstone GP</option>
                    </select>
                    <label className="hud-label">CHAMPIONSHIP ALTERATION KEY</label>
                  </div>

                  <button 
                    onClick={runAlternateStanding}
                    className="glass-button bg-[#FF1801] border-[#FF1801] text-xs h-[42px] font-bold"
                  >
                    Simulate Standing Adjusts
                  </button>
                </div>

                <div className="bg-black/50 p-4 rounded border border-white/5 min-h-[140px] flex flex-col justify-between">
                  <span className="telemetry-label text-[8px]">Simulated Forecast Projections</span>
                  <div className="text-xs text-white mt-4 italic leading-relaxed">
                    {aiSimulatedOutput || "Process parameters above to output strategy simulation logs."}
                  </div>
                </div>
              </div>

              {/* Pitstop advisor */}
              <div className="glass-panel p-6 flex flex-col justify-between space-y-6 border-t-4 border-[#00D4FF]">
                <div className="space-y-4">
                  <span className="telemetry-label font-bold text-[#00D4FF]">AI TYRE STRATEGY MATRIX</span>
                  
                  <div className="hud-input-group">
                    <input 
                      type="number" value={aiRainChance}
                      onChange={(e) => setAiRainChance(parseInt(e.target.value) || 0)}
                      className="hud-input"
                    />
                    <label className="hud-label">SIMULATED RAIN PROBABILITY (%)</label>
                  </div>

                  <div className="hud-input-group">
                    <input 
                      type="number" value={aiTyreWear}
                      onChange={(e) => setAiTyreWear(parseInt(e.target.value) || 0)}
                      className="hud-input"
                    />
                    <label className="hud-label">TYRE DEGRADATION COEFFICIENT (%)</label>
                  </div>
                </div>

                <button 
                  onClick={runTyreStrategy}
                  className="glass-button w-full bg-[#00D4FF] border-[#00D4FF] text-black font-bold"
                >
                  Calculate Tire Compound
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= SHOP SECTION ================= */}
        {activePage === 'shop' && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 gap-4">
              <div>
                <h2 className="font-f1 text-2xl font-black text-white uppercase tracking-wider">VISUAL PROGRESSION STORE</h2>
                <p className="text-xs text-zinc-400 mt-1">Acquire glowing holographic border frames to personalize your profile status.</p>
              </div>
              <div className="text-right">
                <span className="telemetry-label">YOUR ACTIVE PROFILE COINS</span>
                <div className="font-f1 text-2xl font-black text-[#FFEC00] mt-0.5">
                  {currentUser ? `${currentUser.coins} Coins` : "0 Coins (Guest)"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Frame 1 */}
              <div className="glass-panel p-6 flex flex-col justify-between border-t-2 border-[#FFEC00] h-60">
                <div className="space-y-2">
                  <h4 className="font-f1 text-sm font-black text-white uppercase tracking-wider">Gold Hologram Decal</h4>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Applies a premium glowing gold circular frame layout around your active navbar avatar frame.
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="font-f1 text-xs text-[#FFEC00] font-bold">400 Coins</span>
                  <button 
                    onClick={() => purchaseFrameSkin('gold', 400)}
                    className="glass-button text-[9px] py-1.5 px-4 bg-[#FFEC00] text-black border-[#FFEC00]"
                  >
                    Acquire Skin
                  </button>
                </div>
              </div>

              {/* Frame 2 */}
              <div className="glass-panel p-6 flex flex-col justify-between border-t-2 border-[#00D4FF] h-60">
                <div className="space-y-2">
                  <h4 className="font-f1 text-sm font-black text-white uppercase tracking-wider">Cyber Cyan Glitch Frame</h4>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Equip an animated electric cyan pulsing neon glitch layout surrounding your active status badge.
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="font-f1 text-xs text-[#00D4FF] font-bold">500 Coins</span>
                  <button 
                    onClick={() => purchaseFrameSkin('cyan', 500)}
                    className="glass-button text-[9px] py-1.5 px-4 bg-[#00D4FF] text-black border-[#00D4FF]"
                  >
                    Acquire Skin
                  </button>
                </div>
              </div>

              {/* Frame 3 */}
              <div className="glass-panel p-6 flex flex-col justify-between border-t-2 border-[#FF1801] h-60">
                <div className="space-y-2">
                  <h4 className="font-f1 text-sm font-black text-white uppercase tracking-wider">Crimson Pulse Laser frame</h4>
                  <p className="text-xs text-zinc-400 leading-normal">
                    Equips a high-speed carbon red pulsing visual frame representation representing speed vectors.
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="font-f1 text-xs text-[#FF1801] font-bold">600 Coins</span>
                  <button 
                    onClick={() => purchaseFrameSkin('crimson', 600)}
                    className="glass-button text-[9px] py-1.5 px-4 bg-[#FF1801] text-white border-[#FF1801]"
                  >
                    Acquire Skin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SPONSORS SECTION ================= */}
        {activePage === 'sponsors' && (
          <div className="space-y-8 text-left">
            <div>
              <h2 className="font-f1 text-2xl font-black border-l-4 border-[#FF1801] pl-3 text-white uppercase tracking-wider">SPONSORSHIPS HUB</h2>
              <p className="text-[10px] text-zinc-400 mt-1">Unlock custom vehicle decals by completing telemetry challenge tasks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sponsors.map(sp => (
                <div key={sp.id} className={`glass-panel p-6 flex flex-col justify-between border-t-4 ${sp.unlocked ? 'border-green-500' : 'border-zinc-800'} h-64`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-f1 text-md font-bold text-white uppercase tracking-wider">{sp.name}</h4>
                      <i className={`${sp.logo} ${sp.color} text-lg`} />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Challenge constraint: {sp.challenge}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500">REWARD: {sp.reward}</span>
                    {sp.unlocked ? (
                      <span className="text-xs text-green-400 font-f1 font-bold">CONTRACT SIGNED</span>
                    ) : (
                      <button 
                        onClick={() => {
                          if (sp.taskType === 'contact') setActivePage('tracks');
                          else if (sp.taskType === 'lesson') setActivePage('academy');
                          else setActivePage('fantasy');
                          soundEngine.playBeep();
                        }}
                        className="glass-button text-[8px] py-1.5 px-3 border-zinc-700 text-zinc-400"
                      >
                        Execute Challenge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Contact Inquiry Form underneath */}
            <div className="max-w-xl mx-auto glass-panel p-8 mt-12">
              <h3 className="font-f1 text-md font-bold text-white uppercase tracking-wider border-l-4 border-[#FF1801] pl-3 mb-6">Simulator Inquiry Transmit</h3>
              <form onSubmit={submitContactForm} className="space-y-6">
                <div className="hud-input-group">
                  <input 
                    type="text" required value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="hud-input"
                  />
                  <label className="hud-label">DRIVER IDENTIFICATION</label>
                </div>
                <div className="hud-input-group">
                  <input 
                    type="email" required value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="hud-input"
                  />
                  <label className="hud-label">TELEMETRY COMMS EMAIL</label>
                </div>
                <div className="hud-input-group">
                  <textarea 
                    rows={4} required value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="hud-input resize-none"
                  />
                  <label className="hud-label">MESSAGE DATA PAYLOAD</label>
                </div>
                <button type="submit" className="glass-button w-full py-3 bg-[#FF1801] border-[#FF1801]">
                  Transmit Comms Packet <Send className="w-3.5 h-3.5 ml-1" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= PIT WALL ADMIN SECTION ================= */}
        {activePage === 'admin' && currentUser?.role === 'admin' && (
          <div className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-f1 text-2xl font-black border-l-4 border-blue-500 pl-3 text-white uppercase tracking-wider">PIT WALL ADMIN CONSOLE</h2>
                <p className="text-[10px] text-zinc-400 mt-1">Create, read, update and delete simulation academy telemetry courses.</p>
              </div>
              <button 
                onClick={resetTelemetryDB}
                className="glass-button text-[9px] bg-red-950/20 border-red-500 text-red-400 font-bold"
              >
                Reset Database Defaults
              </button>
            </div>

            {/* Admin layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course form creator */}
              <div className="glass-panel p-6 border-t-4 border-blue-500 space-y-6">
                <span className="telemetry-label font-bold text-white">Simulated course writer</span>
                
                <form onSubmit={createAdminCourse} className="space-y-6 pt-4">
                  <div className="hud-input-group">
                    <input 
                      type="text" required value={adminTitle}
                      onChange={(e) => setAdminTitle(e.target.value)}
                      className="hud-input"
                    />
                    <label className="hud-label">COURSE TITLE</label>
                  </div>

                  <div className="hud-input-group">
                    <select 
                      value={adminCategory}
                      onChange={(e) => setAdminCategory(e.target.value)}
                      className="hud-input text-xs"
                    >
                      <option value="physics">Track Physics</option>
                      <option value="aero">Aerodynamics</option>
                      <option value="strategy">Race Strategy</option>
                    </select>
                    <label className="hud-label">CATEGORY</label>
                  </div>

                  <div className="hud-input-group">
                    <input 
                      type="number" required value={adminPrice}
                      onChange={(e) => setAdminPrice(parseFloat(e.target.value) || 0)}
                      className="hud-input"
                    />
                    <label className="hud-label">PRICE PACKAGE ($)</label>
                  </div>

                  <div className="hud-input-group">
                    <textarea 
                      rows={3} required value={adminDesc}
                      onChange={(e) => setAdminDesc(e.target.value)}
                      className="hud-input resize-none"
                    />
                    <label className="hud-label">DESCRIPTION SUMMARY</label>
                  </div>

                  <button type="submit" className="glass-button w-full py-3 bg-blue-600 border-blue-500 text-white">
                    <Plus className="w-4 h-4 mr-1" /> Save telemetry course
                  </button>
                </form>
              </div>

              {/* Roster lists of courses */}
              <div className="lg:col-span-2 glass-panel p-6 space-y-4">
                <span className="telemetry-label">DATABASE ENTRIES REGISTERED</span>
                
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin">
                  {courses.map(c => (
                    <div key={c.id} className="p-4 bg-black/40 rounded border border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="font-f1 text-xs font-bold text-white uppercase">{c.title}</h4>
                        <p className="text-[10px] text-zinc-500 mt-1 capitalize">{c.category} | ${c.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => deleteAdminCourse(c.id, c._id)}
                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Login & signup modal overlays */}
      {authModal && (
        <div className="rzp-modal-overlay">
          <div className="rzp-modal text-left">
            <div className="bg-[#101015] p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-f1 text-sm font-black text-white uppercase italic">
                {authModal === 'login' ? "SECURE DRIVER DOCK" : "ACADEMY COCKPIT SIGNUP"}
              </h3>
              <button onClick={() => { setAuthModal(null); setAuthPassword(''); }} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="p-6 space-y-6">
              <div className="hud-input-group">
                <input 
                  type="text" required value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="hud-input"
                />
                <label className="hud-label">PILOT SIGNATURE CALLSIGN</label>
              </div>

              {authModal === 'signup' && (
                <div className="hud-input-group">
                  <input 
                    type="email" required value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="hud-input"
                  />
                  <label className="hud-label">COMMS COMMUNICATIONS EMAIL</label>
                </div>
              )}

              <div className="hud-input-group">
                <input 
                  type="password" required value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="hud-input"
                />
                <label className="hud-label">PILOT PASSKEY / PASSWORD</label>
              </div>

              <button 
                type="submit" 
                className="glass-button w-full py-3 bg-[#FF1801] border-[#FF1801] font-bold text-white"
              >
                {authModal === 'login' ? "INITIALIZE CALIBRATION" : "REGISTER INTERFACE"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Spotify wrapped modal layout */}
      {showWrappedModal && (
        <div className="wrapped-overlay">
          <div className="wrapped-card text-left">
            <div className="wrapped-glow-ball"></div>
            
            <div className="flex gap-2.5">
              {[0, 1, 2, 3].map(slideIdx => (
                <div 
                  key={slideIdx}
                  className={`wrapped-bar flex-1 h-1 rounded ${
                    slideIdx <= wrappedSlide ? 'bg-[#FF1801]' : 'bg-white/20'
                  }`}
                ></div>
              ))}
            </div>

            <div className="space-y-4 my-auto relative z-10">
              <span className="telemetry-label font-bold text-[#FFEC00]">SLIDE {wrappedSlide + 1} OF 4</span>
              <h3 className="font-f1 text-2xl font-black text-white uppercase text-neon-glow leading-tight">
                {wrappedSlides[wrappedSlide].title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {wrappedSlides[wrappedSlide].desc}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button onClick={() => setShowWrappedModal(false)} className="text-zinc-500 hover:text-white text-xs font-f1">
                CLOSE
              </button>
              <button 
                onClick={() => {
                  if (wrappedSlide >= 3) {
                    setShowWrappedModal(false);
                  } else {
                    setWrappedSlide(prev => prev + 1);
                    soundEngine.playBeep();
                  }
                }}
                className="glass-button text-[9px] py-1.5 px-4 bg-[#FF1801] border-[#FF1801]"
              >
                {wrappedSlide === 3 ? "DISMISS" : "NEXT SLIDE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
