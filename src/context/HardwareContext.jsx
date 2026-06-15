import React, { createContext, useState, useEffect, useRef } from 'react';

export const HardwareContext = createContext();

// Initial File System
const initialFileSystem = {
  'A:': {
    label: 'BOOT_FLOPPY',
    formatted: true,
    files: {
      'io.sys': { type: 'file', size: 40000, content: 'MS-DOS IO Core System' },
      'msdos.sys': { type: 'file', size: 1000, content: 'MS-DOS Configuration File' },
      'command.com': { type: 'file', size: 93880, content: 'Command Interpreter Shell' },
      'warcraft2_map.pod': { type: 'file', size: 22000, content: 'Warcraft II Multiplayer Map: Garden of War' }
    }
  },
  'C:': {
    label: 'SYSTEM',
    formatted: true,
    files: {
      'Windows': {
        type: 'folder',
        files: {
          'System': { type: 'folder', files: {} },
          'oakcdrom.sys': { type: 'file', size: 45000, content: 'CD-ROM Driver' },
          'win.ini': { type: 'file', size: 1200, content: '[windows]\nrun=\nload=' }
        }
      },
      'My Documents': {
        type: 'folder',
        files: {
          'readme.txt': { type: 'file', size: 520, content: 'Welcome to your 200MMX PC!\nEarn credits by completing tasks from your friends on ICQ.\nUse these credits to upgrade your hardware in the Hardware Shop.\nWatch out for suspicious files from IRC or BBS, they might contain viruses!' },
          'School': {
            type: 'folder',
            files: {
              'History Assignment.doc': { type: 'file', size: 2400, content: 'Title: The Industrial Revolution\n\nThis essay discusses the late 19th-century transition to machine manufacturing in Western Europe, the emergence of steam power, factory labor movements, and the corresponding social and urban changes.' },
              'Geography Presentation.ppt': { type: 'file', size: 3800, content: 'Slide 1: Global Climates & Rainforests\nSlide 2: Tropical ecosystems, rainfall distribution, and biodiversity values.\nSlide 3: Desertification causes and environmental mitigation factors.' },
              'Math Homework.doc': { type: 'file', size: 1200, content: 'Algebra Homework - Grade 9\n\nSolve the following equations:\n1) 2x + 5 = 15  => 2x = 10  => x = 5\n2) x^2 - 4 = 0   => x^2 = 4   => x = 2 or -2' }
            }
          }
        }
      },
      'Desktop': {
        type: 'folder',
        files: {
          'mIRC Chat.lnk': { type: 'shortcut', target: 'mirc', label: 'mIRC Chat' },
          'ICQ.lnk': { type: 'shortcut', target: 'icq', label: 'ICQ' },
          'BBS Term.lnk': { type: 'shortcut', target: 'bbs', label: 'BBS Term' },
          'Missions.lnk': { type: 'shortcut', target: 'missions', label: 'Missions' },
          'Dial-Up Connection.lnk': { type: 'shortcut', target: 'dialup', label: 'Dial-Up Connection' },
          'Napster.lnk': { type: 'shortcut', target: 'napster', label: 'Napster' },
          'Minesweeper.lnk': { type: 'shortcut', target: 'minesweeper', label: 'Minesweeper' },
          'MS Paint.lnk': { type: 'shortcut', target: 'paint', label: 'MS Paint' },
          'readme.txt': { type: 'file', size: 520, content: 'Welcome to your 200MMX PC!\nEarn credits by completing tasks from your friends on ICQ.\nUse these credits to upgrade your hardware in the Hardware Shop.\nWatch out for suspicious files from IRC or BBS, they might contain viruses!' }
        }
      },
      'Downloads': {
        type: 'folder',
        files: {}
      },
      'Program Files': {
        type: 'folder',
        files: {}
      }
    }
  }
};

export const HardwareProvider = ({ children }) => {
  // Credits & Mission State
  const [credits, setCredits] = useState(250); // Start with $250
  const [completedMissions, setCompletedMissions] = useState([]);
  const [currentMission, setCurrentMission] = useState(null);

  // Hardware State
  const [hardware, setHardware] = useState({
    cpu: { id: 'p133', name: 'Pentium 133 MHz', speedMultiplier: 1 },
    ram: { id: 'ram16', name: '16 MB EDO RAM', size: 16, bufferMultiplier: 1 },
    sound: { id: 'speaker', name: 'PC Speaker' },
    video: { id: 'trident', name: 'Trident 9680 PCI (1MB)', resolution: '640x480', colors: 16 },
    modem: { id: 'modem28', name: '28.8k Modem', speedKbps: 28.8 },
    burner: { id: 'none', name: 'None', speed: 0 },
    hddMaster: { id: 'quantum12', name: 'Quantum ProDrive 1.2GB', capacityBytes: 1200000000 },
    hddSlave: null // Upgradable to Fujitsu 4.3GB
  });

  // Screen Display settings (can be modified in Display properties)
  const [displaySettings, setDisplaySettings] = useState({
    resolution: '640x480',
    colors: 16,
    filter: localStorage.getItem('desktop_filter') || 'svga'
  });

  const [desktopTheme, setDesktopTheme] = useState(localStorage.getItem('desktop_theme') || 'default');
  const [mouseSettings, setMouseSettings] = useState({
    speed: Number(localStorage.getItem('mouse_speed') || '50'),
    trails: localStorage.getItem('mouse_trails') === 'true',
    scheme: localStorage.getItem('mouse_scheme') || 'default'
  });
  const [soundScheme, setSoundScheme] = useState(localStorage.getItem('sound_scheme') || 'classic');
  const [timeZone, setTimeZone] = useState(localStorage.getItem('timezone') || 'US/Eastern');

  // OS State
  const [isOsCorrupted, setIsOsCorrupted] = useState(false);
  const [osInstalled, setOsInstalled] = useState(true);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [activeViruses, setActiveViruses] = useState([]); // 'happy99', 'cascade', 'cih'
  const [infectedFiles, setInfectedFiles] = useState({}); // path -> virusName
  const [floppyInserted, setFloppyInserted] = useState(null); // 'boot_floppy' or null
  const [hddLedActive, setHddLedActive] = useState(false);
  const [floppyLedActive, setFloppyLedActive] = useState(false);

  // File System State
  const [fileSystem, setFileSystem] = useState(initialFileSystem);

  // Audio Engine Refs
  const audioCtxRef = useRef(null);

  // Helper to trigger virtual sound synthesize
  const playSound = (type) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const soundCard = hardware.sound.id;

      if (type === 'beep') {
        // BIOS PC Speaker beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'floppy') {
        setFloppyLedActive(true);
        setTimeout(() => setFloppyLedActive(false), 500);
        // Floppy grind click
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 1000) * 0.3;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        noise.connect(filter);
        filter.connect(ctx.destination);
        noise.start();
      } else if (type === 'dialup') {
        // Simulated dialup handshake sound
        if (soundCard === 'speaker') {
          // PC Speaker just makes a simple square wave buzzer
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.5);
          return;
        }

        // SB16 or AWE32 realistic sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.frequency.setValueAtTime(350, ctx.currentTime);
        osc2.frequency.setValueAtTime(440, ctx.currentTime); // US Dial tone
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
          // Screaming static sound (handshake)
          const handshakeOsc = ctx.createOscillator();
          const handshakeGain = ctx.createGain();
          handshakeOsc.type = 'sawtooth';
          handshakeOsc.frequency.setValueAtTime(1200, ctx.currentTime);
          // Modulate frequency to simulate dial-up noise
          let t = ctx.currentTime;
          handshakeOsc.frequency.linearRampToValueAtTime(800, t + 0.3);
          handshakeOsc.frequency.linearRampToValueAtTime(1600, t + 0.6);
          handshakeOsc.frequency.linearRampToValueAtTime(600, t + 0.9);
          
          handshakeGain.gain.setValueAtTime(0.04, ctx.currentTime);
          handshakeOsc.connect(handshakeGain);
          
          if (soundCard === 'awe32') {
            // Add custom reverb for AWE32
            const delay = ctx.createDelay();
            delay.delayTime.value = 0.05;
            const feedback = ctx.createGain();
            feedback.gain.value = 0.4;
            handshakeGain.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(ctx.destination);
          }
          
          handshakeGain.connect(ctx.destination);
          handshakeOsc.start();
          handshakeOsc.stop(ctx.currentTime + 1.2);
        }, 800);
      }
    } catch (e) {
      console.warn("Audio synthesis error: ", e);
    }
  };

  // Upgrades registry cost definitions
  const upgradeCosts = {
    cpu: {
      p200mmx: { cost: 120, name: 'Pentium 200 MHz MMX', payload: { id: 'p200mmx', speedMultiplier: 2.2 } },
      pii300: { cost: 250, name: 'Pentium II 300 MHz', payload: { id: 'pii300', speedMultiplier: 4.5 } }
    },
    ram: {
      ram32: { cost: 80, name: '32 MB EDO RAM', size: 32, payload: { id: 'ram32', size: 32, bufferMultiplier: 2.5 } },
      ram64: { cost: 150, name: '64 MB SDRAM', size: 64, payload: { id: 'ram64', size: 64, bufferMultiplier: 5 } },
      ram128: { cost: 280, name: '128 MB SDRAM', size: 128, payload: { id: 'ram128', size: 128, bufferMultiplier: 10 } }
    },
    sound: {
      sb16: { cost: 60, name: 'SoundBlaster 16', payload: { id: 'sb16', name: 'SoundBlaster 16 PnP' } },
      awe32: { cost: 140, name: 'SoundBlaster AWE32', payload: { id: 'awe32', name: 'SoundBlaster AWE32 ISA' } }
    },
    video: {
      s3virge: { cost: 90, name: 'S3 ViRGE 3D (4MB)', payload: { id: 's3virge', name: 'S3 ViRGE 3D PCI (4MB)', maxResolution: '800x600', colors: 256 } },
      matrox: { cost: 180, name: 'Matrox Mystique (8MB)', payload: { id: 'matrox', name: 'Matrox Mystique AGP (8MB)', maxResolution: '1024x768', colors: 65536 } }
    },
    modem: {
      modem33: { cost: 50, name: '33.6k Modem', payload: { id: 'modem33', name: 'USRobotics 33.6k', speedKbps: 33.6 } },
      modem56: { cost: 95, name: '56k Flex Modem', payload: { id: 'modem56', name: 'Diamond SupraExpress 56k', speedKbps: 56.0 } }
    },
    burner: {
      burn2x: { cost: 110, name: '2x/2x/6x CD-RW', payload: { id: 'burn2x', name: 'HP SureStore 2x CD-Writer', speed: 2 } },
      burn8x: { cost: 190, name: '8x/4x/32x CD-RW', payload: { id: 'burn8x', name: 'Plextor PlexWriter 8x', speed: 8 } }
    },
    hddSlave: {
      fujitsu43: { cost: 130, name: 'Fujitsu 4.3GB IDE', payload: { id: 'fujitsu43', name: 'Fujitsu 4.3GB Drive', capacityBytes: 4300000000 } }
    }
  };

  const buyUpgrade = (category, itemId) => {
    const info = upgradeCosts[category][itemId];
    if (!info) return false;
    if (credits < info.cost) return false;

    setCredits(prev => prev - info.cost);
    setHardware(prev => {
      const nextHardware = { ...prev };
      if (category === 'hddSlave') {
        nextHardware.hddSlave = { ...info.payload, formatted: false, label: '' };
      } else {
        nextHardware[category] = { ...prev[category], ...info.payload };
      }
      return nextHardware;
    });

    return true;
  };

  // Add virtual files to the file system helper
  const addVirtualFile = (drive, pathStr, fileName, size, content) => {
    setFileSystem(prev => {
      const next = { ...prev };
      if (!next[drive] || !next[drive].formatted) return prev;
      
      const parts = pathStr.split('/').filter(Boolean);
      let curr = next[drive].files;
      for (const part of parts) {
        if (!curr[part]) {
          curr[part] = { type: 'folder', files: {} };
        }
        curr = curr[part].files;
      }
      
      curr[fileName] = { type: 'file', size, content };
      return next;
    });
  };

  // Load state on mount
  useEffect(() => {
    const raw = localStorage.getItem('win95_simulator_save');
    if (raw) {
      try {
        const state = JSON.parse(raw);
        if (state.credits !== undefined) setCredits(state.credits);
        if (state.completedMissions !== undefined) setCompletedMissions(state.completedMissions);
        if (state.hardware !== undefined) setHardware(state.hardware);
        if (state.displaySettings !== undefined) setDisplaySettings(state.displaySettings);
        if (state.desktopTheme !== undefined) setDesktopTheme(state.desktopTheme);
        if (state.activeViruses !== undefined) setActiveViruses(state.activeViruses);
        if (state.fileSystem !== undefined) setFileSystem(state.fileSystem);
      } catch (e) {
        console.error("Auto-load failed: ", e);
      }
    }
  }, []);

  // Auto-save state on changes
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const state = {
      credits,
      completedMissions,
      hardware,
      displaySettings,
      desktopTheme,
      activeViruses,
      fileSystem
    };
    localStorage.setItem('win95_simulator_save', JSON.stringify(state));
  }, [credits, completedMissions, hardware, displaySettings, desktopTheme, activeViruses, fileSystem]);

  const resetGame = () => {
    localStorage.removeItem('win95_simulator_save');
    localStorage.removeItem('sound_config_Warcraft2');
    localStorage.removeItem('burned_cd_tracks');
    localStorage.removeItem('winamp_playing');
    localStorage.removeItem('system_cleaned');
    setCredits(250);
    setCompletedMissions([]);
    setHardware({
      cpu: { id: 'p133', name: 'Pentium 133 MHz', speedMultiplier: 1 },
      ram: { id: 'ram16', name: '16 MB EDO RAM', size: 16, bufferMultiplier: 1 },
      sound: { id: 'speaker', name: 'PC Speaker' },
      video: { id: 'trident', name: 'Trident 9680 PCI (1MB)', resolution: '640x480', colors: 16 },
      modem: { id: 'modem28', name: '28.8k Modem', speedKbps: 28.8 },
      burner: { id: 'none', name: 'None', speed: 0 },
      hddMaster: { id: 'quantum12', name: 'Quantum ProDrive 1.2GB', capacityBytes: 1200000000 },
      hddSlave: null
    });
    setFileSystem(initialFileSystem);
    setActiveViruses([]);
    playSound('beep');
    alert('Game simulation successfully reset!');
    window.location.reload();
  };

  const generateSaveData = () => {
    const state = {
      credits,
      completedMissions,
      hardware,
      displaySettings,
      desktopTheme,
      activeViruses,
      fileSystem
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  };

  const loadSaveData = (dataString) => {
    try {
      const decoded = decodeURIComponent(escape(atob(dataString.trim())));
      const state = JSON.parse(decoded);
      if (state.credits !== undefined) setCredits(state.credits);
      if (state.completedMissions !== undefined) setCompletedMissions(state.completedMissions);
      if (state.hardware !== undefined) setHardware(state.hardware);
      if (state.displaySettings !== undefined) setDisplaySettings(state.displaySettings);
      if (state.desktopTheme !== undefined) setDesktopTheme(state.desktopTheme);
      if (state.activeViruses !== undefined) setActiveViruses(state.activeViruses);
      if (state.fileSystem !== undefined) setFileSystem(state.fileSystem);
      playSound('beep');
      return true;
    } catch (e) {
      console.error("Failed to load save state string: ", e);
      return false;
    }
  };

  return (
    <HardwareContext.Provider value={{
      credits,
      setCredits,
      completedMissions,
      setCompletedMissions,
      currentMission,
      setCurrentMission,
      hardware,
      setHardware,
      displaySettings,
      setDisplaySettings,
      desktopTheme,
      setDesktopTheme,
      mouseSettings,
      setMouseSettings,
      soundScheme,
      setSoundScheme,
      timeZone,
      setTimeZone,
      isOsCorrupted,
      setIsOsCorrupted,
      osInstalled,
      setOsInstalled,
      isInternetConnected,
      setIsInternetConnected,
      activeViruses,
      setActiveViruses,
      infectedFiles,
      setInfectedFiles,
      floppyInserted,
      setFloppyInserted,
      hddLedActive,
      setHddLedActive,
      floppyLedActive,
      setFloppyLedActive,
      fileSystem,
      setFileSystem,
      playSound,
      upgradeCosts,
      buyUpgrade,
      addVirtualFile,
      audioCtxRef,
      resetGame,
      generateSaveData,
      loadSaveData
    }}>
      {children}
    </HardwareContext.Provider>
  );
};
