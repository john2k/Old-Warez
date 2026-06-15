import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';
import { appsRegistry, Icons } from '../appsRegistry';

// Sub-components import
import MircWindow from './MircWindow';
import IcqWindow from './IcqWindow';
import WinampWindow from './WinampWindow';
import CuteFtpWindow from './CuteFtpWindow';
import BbsTerminal from './BbsTerminal';
import CdrWinWindow from './CdrWinWindow';
import PartitionMagic from './PartitionMagic';
import NetbusWindow from './NetbusWindow';
import WebBrowser from './WebBrowser';
import WebEditor from './WebEditor';
import HardwareShop from './HardwareShop';
import Antivirus from './Antivirus';
import WinCommander from './WinCommander';
import NfoViewer from './NfoViewer';
import WinZip from './WinZip';
import DosSetup from './DosSetup';
import MissionManager from './MissionManager';
import ControlPanel, { ControlPanelDisplay, ControlPanelSounds, ControlPanelMouse, ControlPanelDateTime, ControlPanelSystem, ControlPanelPrograms } from './ControlPanel';
import Explorer from './Explorer';
import Notepad from './Notepad';
import VirusSimulator, { BsdScreen } from './VirusSimulator';
import FindDialog from './FindDialog';
import { WordpadWindow, PptViewerWindow } from './OfficeApps';
import DialUpWindow from './DialUpWindow';
import Napster from './Napster';
import Minesweeper from './Minesweeper';
import Paint from './Paint';
import XdccCatcher from './XdccCatcher';
import NfoGen from './NfoGen';
import NesEmu from './NesEmu';
import SfvChecker from './SfvChecker';
import Subseven from './Subseven';

export default function Desktop({ onReboot }) {
  const { 
    credits, 
    hardware, 
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
    isInternetConnected,
    setIsInternetConnected,
    osInstalled, 
    activeViruses, 
    setActiveViruses, 
    floppyInserted, 
    setFloppyInserted, 
    playSound,
    hddLedActive,
    setHddLedActive,
    floppyLedActive,
    setFloppyLedActive,
    fileSystem,
    setFileSystem,
    completedMissions,
    icqNotifications
  } = useContext(HardwareContext);

  const [openWindows, setOpenWindows] = useState([]); // [{ id, title, zIndex, x, y, width, height, minimized, maximized }]
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [sub7State, setSub7State] = useState({
    swapButtons: localStorage.getItem('sub7_swap_buttons') === 'true',
    hideTaskbar: localStorage.getItem('sub7_hide_taskbar') === 'true',
    hideIcons: localStorage.getItem('sub7_hide_icons') === 'true',
    isNuked: localStorage.getItem('netbus_nuked') === 'true'
  });
  const [sub7ChatMsg, setSub7ChatMsg] = useState(localStorage.getItem('sub7_chat_active') === 'true' ? localStorage.getItem('sub7_last_chat_msg') : '');

  useEffect(() => {
    const checkTrojans = () => {
      setSub7State({
        swapButtons: localStorage.getItem('sub7_swap_buttons') === 'true',
        hideTaskbar: localStorage.getItem('sub7_hide_taskbar') === 'true',
        hideIcons: localStorage.getItem('sub7_hide_icons') === 'true',
        isNuked: localStorage.getItem('netbus_nuked') === 'true'
      });
      if (localStorage.getItem('sub7_chat_active') === 'true') {
        setSub7ChatMsg(localStorage.getItem('sub7_last_chat_msg') || '');
      } else {
        setSub7ChatMsg('');
      }
    };
    const timer = setInterval(checkTrojans, 500);
    return () => clearInterval(timer);
  }, []);

  const [activeWindowId, setActiveWindowId] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  
  // Start menu sub-hover states
  const [hoverSubMenu, setHoverSubMenu] = useState(null); // 'programs', 'settings', 'documents', null
  const [timeStr, setTimeStr] = useState('12:00 PM');
  
  // Context menus
  const [contextMenu, setContextMenu] = useState(null); // { x, y }
  const [hoverContextSubMenu, setHoverContextSubMenu] = useState(null); // 'new', null
  const [iconContextMenu, setIconContextMenu] = useState(null); // { x, y, name }
  const [renamingItem, setRenamingItem] = useState(null); // name string
  const [renameValue, setRenameValue] = useState('');

  // Volume slider pop-up
  const [volumeSliderOpen, setVolumeSliderOpen] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(80);

  // Run dialog window
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [runCommandValue, setRunCommandValue] = useState('');

  // Drag and drop window state refs
  const dragRef = useRef(null); // { windowId, startX, startY, origX, origY }

  // Cursor trails state
  const [trailCoords, setTrailCoords] = useState([]);

  useEffect(() => {
    playSound('beep');
    const tick = () => {
      try {
        const date = new Date();
        const formatted = date.toLocaleTimeString('en-US', {
          timeZone: timeZone || 'US/Eastern',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        setTimeStr(formatted);
      } catch (err) {
        // Fallback if timezone string is invalid
        const date = new Date();
        let hours = date.getHours();
        const mins = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        setTimeStr(`${hours}:${mins} ${ampm}`);
      }
    };
    tick();
    const clockInterval = setInterval(tick, 1000);
  }, [timeZone]);

  // Unlocks dynamic shortcuts based on completed missions count
  useEffect(() => {
    let changed = false;
    setFileSystem(prev => {
      const next = { ...prev };
      const desktop = next['C:']?.files?.['Desktop']?.files;
      if (!desktop) return prev;

      // Unlock XDCC Catcher (>= 5 missions)
      if (completedMissions.length >= 5 && !desktop['XDCC Catcher.lnk']) {
        desktop['XDCC Catcher.lnk'] = { type: 'shortcut', target: 'xdcc', label: 'XDCC Catcher' };
        changed = true;
        playSound('beep');
        alert('✨ System Unlock ✨\n\nStarting from your 5th completed mission, a helper tool has been unlocked:\n"XDCC Catcher v1.2" has been added to your Desktop and Start Menu!\nUse it to quickly automate downloading split multi-volume game packs.');
      }
      
      // Unlock ASCII NFO Generator (>= 8 missions)
      if (completedMissions.length >= 8 && !desktop['ASCII NFO Gen.lnk']) {
        desktop['ASCII NFO Gen.lnk'] = { type: 'shortcut', target: 'nfogen', label: 'ASCII NFO Gen' };
        changed = true;
        playSound('beep');
        alert('✨ System Unlock ✨\n\nStarting from your 8th completed mission, a creative tool has been unlocked:\n"ASCII NFO Gen v1.0" has been added to your Desktop!\nUse it to create custom game information files with retro ASCII art.');
      }

      // Unlock NES/SNES Emulator (>= 20 missions)
      if (completedMissions.length >= 20 && !desktop['NES Emulator.lnk']) {
        desktop['NES Emulator.lnk'] = { type: 'shortcut', target: 'nesemu', label: 'NES Emulator' };
        changed = true;
        playSound('beep');
        alert('✨ System Unlock ✨\n\nStarting from your 20th completed mission, an entertainment utility has been unlocked:\n"NES/SNES Emulator" has been added to your Desktop!\nUse it to play classic ROMs.');
      }

      return changed ? next : prev;
    });
  }, [completedMissions.length, setFileSystem]);

  // Track mouse coordinates for cursor trails
  useEffect(() => {
    if (!mouseSettings.trails) {
      setTrailCoords([]);
      return;
    }

    const handleMouseMove = (e) => {
      const viewport = document.querySelector('.viewport');
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setTrailCoords(prev => {
        const next = [...prev, { x, y, id: Math.random() }];
        if (next.length > 5) {
          next.shift();
        }
        return next;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseSettings.trails]);


  // Monitor files system changes to flash HDD LED
  useEffect(() => {
    const activeTransfers = openWindows.some(w => w.id === 'mirc' || w.id === 'cuteftp' || w.id === 'cdrwin' || w.id === 'winzip');
    if (activeTransfers) {
      const flash = setInterval(() => {
        setHddLedActive(p => !p);
      }, 250);
      return () => {
        clearInterval(flash);
        setHddLedActive(false);
      };
    }
  }, [openWindows]);

  const openApp = (appId, extraProps = {}) => {
    const reg = appsRegistry.find(a => a.id === appId);
    const customApps = ['control', 'find', 'wordpad', 'ppt', 'dialup', 'nfo', 'winzip', 'dossetup', 'missions', 'explorer', 'notepad', 'control_display', 'control_sounds', 'control_mouse', 'control_datetime', 'control_system', 'control_programs'];
    if (!reg && !customApps.includes(appId)) return;

    const openIndex = openWindows.findIndex(w => w.id === appId);
    if (openIndex !== -1) {
      focusWindow(appId);
      return;
    }

    const title = reg ? reg.title : (
      appId === 'control' ? 'Control Panel' :
      appId === 'find' ? 'Find: All Files' :
      appId === 'wordpad' ? 'Document - WordPad' :
      appId === 'ppt' ? 'PowerPoint Viewer' :
      appId === 'dialup' ? 'Dial-Up Connection' :
      appId === 'nfo' ? 'NFO Viewer' : 
      appId === 'winzip' ? 'WinZip' : 
      appId === 'explorer' ? 'Explorer' : 
      appId === 'notepad' ? 'Notepad' : 
      appId === 'missions' ? 'Campaign Missions' : 
      appId === 'control_display' ? 'Display Properties' :
      appId === 'control_sounds' ? 'Sounds Properties' :
      appId === 'control_mouse' ? 'Mouse Properties' :
      appId === 'control_datetime' ? 'Date/Time Properties' :
      appId === 'control_system' ? 'System Properties' :
      appId === 'control_programs' ? 'Add/Remove Programs' :
      'DOS Setup'
    );
    
    let width = reg ? reg.defaultWidth : 440;
    let height = reg ? reg.defaultHeight : 340;
    if (appId === 'control') { width = 450; height = 320; }
    if (appId === 'find') { width = 460; height = 320; }
    if (appId === 'wordpad') { width = 500; height = 380; }
    if (appId === 'ppt') { width = 520; height = 400; }
    if (appId === 'dialup') { width = 340; height = 260; }

    const newWin = {
      id: appId,
      title,
      width,
      height,
      x: 60 + openWindows.length * 20,
      y: 50 + openWindows.length * 20,
      minimized: false,
      maximized: false,
      extraProps
    };

    setOpenWindows(prev => [...prev, newWin]);
    focusWindow(appId);
    setStartMenuOpen(false);
    setHoverSubMenu(null);
  };

  const focusWindow = (windowId) => {
    setActiveWindowId(windowId);
    setOpenWindows(prev => {
      const maxZ = prev.reduce((max, w) => Math.max(max, w.zIndex || 0), 0);
      return prev.map(w => w.id === windowId ? { ...w, zIndex: maxZ + 1 } : w);
    });
  };

  const restoreWindow = (windowId) => {
    setActiveWindowId(windowId);
    setOpenWindows(prev => {
      const maxZ = prev.reduce((max, w) => Math.max(max, w.zIndex || 0), 0);
      return prev.map(w => w.id === windowId ? { ...w, zIndex: maxZ + 1, minimized: false } : w);
    });
  };

  const closeWindow = (windowId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  };

  const toggleMinimizeWindow = (windowId) => {
    setOpenWindows(prev => prev.map(w => {
      if (w.id !== windowId) return w;
      const newMinimized = !w.minimized;
      return { ...w, minimized: newMinimized };
    }));
    // If we just minimized the active window, deselect it
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  };

  const toggleMaximizeWindow = (windowId) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, maximized: !w.maximized } : w));
  };

  const handleTitleMouseDown = (e, windowId) => {
    if (e.target.className.includes('win-title-btn')) return;
    
    const isSwapped = localStorage.getItem('sub7_swap_buttons') === 'true';
    if (isSwapped && e.button !== 2) return;
    if (!isSwapped && e.button !== 0) return;

    focusWindow(windowId);
    const win = openWindows.find(w => w.id === windowId);
    if (!win || win.maximized) return;

    dragRef.current = {
      windowId,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current) return;
    const { windowId, startX, startY, origX, origY } = dragRef.current;
    
    const [resW, resH] = displaySettings.resolution.split('x');
    let scaleVal = 1;
    if (displaySettings.fitToScreen !== false) {
      const bezelW = 56 + 32;
      const bezelH = 68 + 32;
      const targetW = Number(resW) + bezelW;
      const targetH = Number(resH) + bezelH;
      const scaleX = window.innerWidth / targetW;
      const scaleY = window.innerHeight / targetH;
      scaleVal = Math.min(scaleX, scaleY);
    }

    const isMouseInverted = localStorage.getItem('netbus_mouse_inverted') === 'true';
    const multiplier = isMouseInverted ? -1 : 1;

    const dx = ((e.clientX - startX) / scaleVal) * multiplier;
    const dy = ((e.clientY - startY) / scaleVal) * multiplier;

    setOpenWindows(prev => prev.map(w => w.id === windowId ? {
      ...w,
      x: origX + dx,
      y: origY + dy
    } : w));
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleRunFile = (fileName, fullPath) => {
    const ext = fileName.split('.').pop().toLowerCase();
    
    if (ext === 'nfo' || ext === 'diz') {
      const drive = fullPath.substring(0, 2);
      const pathStr = fullPath.substring(3);
      const parts = pathStr.split('/');
      const name = parts.pop();
      let curr = fileSystem[drive]?.files;
      for (const part of parts) {
        if (curr && curr[part]) curr = curr[part].files;
      }
      const fileInfo = curr ? curr[name] : null;
      const content = fileInfo ? fileInfo.content : '';
      openApp('nfo', { nfoContent: content });
      localStorage.setItem('nfo_viewer_content', content);
      localStorage.setItem('nfo_viewer_file', name);
    } else if (fileName.includes('.zip.001') || ext === 'rar' || ext === 'r00') {
      openApp('winzip', { archiveName: fileName });
    } else if (fileName === 'setup.exe') {
      let game = 'Warcraft2';
      if (fullPath.toLowerCase().includes('duke')) game = 'Duke3D';
      else if (fullPath.toLowerCase().includes('doom')) game = 'Doom';
      else if (fullPath.toLowerCase().includes('quake')) game = 'Quake';
      openApp('dossetup', { gameName: game });
    } else if (fileName === 'play.bat' || fileName === 'run.exe') {
      const pathLower = fullPath.toLowerCase();
      
      const gameUrls = {
        doom: 'https://dos.zone/en/play/100000000000000000/doom',
        duke: 'https://dos.zone/duke-nukem-3d-1996/',
        warcraft: 'https://dos.zone/en/play/100000000000000000/warcraft-ii',
        quake: 'https://dos.zone/en/play/100000000000000000/quake',
        diablo: 'https://d1.web.diablo.nokiacoding.de/',
        nfs: 'https://dos.zone/en/play/100000000000000000/the-need-for-speed',
        speed: 'https://dos.zone/en/play/100000000000000000/the-need-for-speed',
        pinball: 'https://classicreload.com/3d-pinball-space-cadet.html',
        age: 'https://classicreload.com/age-of-empires.html',
        empire: 'https://classicreload.com/age-of-empires.html',
        simcity: 'https://dos.zone/en/play/100000000000000000/simcity-2000',
        starcraft: 'https://classicreload.com/starcraft.html',
        cnc: 'https://classicreload.com/command-conquer.html',
        halflife: 'https://classicreload.com/half-life.html',
        fallout: 'https://classicreload.com/fallout.html',
        tombraider: 'https://classicreload.com/tomb-raider.html',
        hexen: 'https://dos.zone/en/play/100000000000000000/hexen-beyond-heretic',
        heretic: 'https://dos.zone/en/play/100000000000000000/heretic',
        descent: 'https://dos.zone/en/play/100000000000000000/descent',
        rct: 'https://classicreload.com/rollercoaster-tycoon.html',
        rollercoaster: 'https://classicreload.com/rollercoaster-tycoon.html',
        themehospital: 'https://classicreload.com/theme-hospital.html',
        gta: 'https://classicreload.com/grand-theft-auto.html',
        prince: 'https://dos.zone/en/play/100000000000000000/prince-of-persia',
        wolf3d: 'https://dos.zone/en/play/100000000000000000/wolfenstein-3d',
        civ: 'https://classicreload.com/civilization-ii.html',
        worms: 'https://classicreload.com/worms-armageddon.html',
        blood: 'https://dos.zone/en/play/100000000000000000/blood',
        unreal: 'https://classicreload.com/unreal-tournament.html',
        systemshock: 'https://classicreload.com/system-shock.html',
        pacman: 'https://free-pacman.org/',
        sonic: 'https://playclassic.games/games/sega-genesis/sonic-the-hedgehog/',
        mario: 'https://snesfun.com/',
        zelda: 'https://snesfun.com/',
        sf2: 'https://playclassic.games/games/arcade/street-fighter-ii-champion-edition/',
        mk3: 'https://playclassic.games/games/sega-genesis/mortal-kombat-3/',
        chrono: 'https://snesfun.com/',
        dkc: 'https://snesfun.com/',
        tetris: 'https://tetris.com/play-tetris',
        rayman: 'https://classicreload.com/rayman.html',
        megaman: 'https://snesfun.com/',
        earthworm: 'https://playclassic.games/games/sega-genesis/earthworm-jim/',
        jazz: 'https://dos.zone/en/play/100000000000000000/jazz-jackrabbit',
        carmageddon: 'https://classicreload.com/carmageddon.html',
        syndicate: 'https://dos.zone/en/play/100000000000000000/syndicate',
        homm3: 'https://classicreload.com/heroes-of-might-and-magic-iii.html',
        baldursgate: 'https://classicreload.com/baldurs-gate.html',
        mechwarrior: 'https://dos.zone/en/play/100000000000000000/mechwarrior-2-31st-century-combat',
        commandos: 'https://classicreload.com/commandos-behind-enemy-lines.html',
        deusex: 'https://classicreload.com/deus-ex.html',
        fifa: 'https://playclassic.games/games/playstation/fifa-road-to-world-cup-98/'
      };

      const matchKey = Object.keys(gameUrls).find(key => pathLower.includes(key));
      const url = matchKey ? gameUrls[matchKey] : 'https://dos.zone/en/play/100000000000000000/doom';

      playSound('beep');
      window.open(url, '_blank', 'width=800,height=600');
    } else if (fileName === 'happy99_installer.exe' || fileName === 'happy99.exe') {
      setActiveViruses(prev => [...new Set([...prev, 'happy99'])]);
      alert('HappyNewYear 1999 Worm is now active in memory!');
    } else if (fileName === 'keygen.exe') {
      const match = fullPath.match(/Program Files\/([^/]+)/);
      const game = match ? match[1] : 'Doom';
      openApp('shop');
      openApp('wincommander', { subApp: 'keygen', game });
    } else if (ext === 'txt' || ext === 'doc' || ext === 'ppt') {
      // Resolve content of text/document file
      const drive = fullPath.substring(0, 2);
      const pathStr = fullPath.substring(3);
      const parts = pathStr.split('/');
      const name = parts.pop();
      let curr = fileSystem[drive]?.files;
      for (const part of parts) {
        if (curr && curr[part]) curr = curr[part].files;
      }
      const fileInfo = curr ? curr[name] : null;
      const content = fileInfo ? fileInfo.content : '';
      
      if (ext === 'txt') {
        openApp('notepad', { filePath: fullPath, fileContent: content });
      } else if (ext === 'doc') {
        openApp('wordpad', { filePath: fullPath, fileContent: content });
        localStorage.setItem('wordpad_opened', 'true');
      } else if (ext === 'ppt') {
        openApp('ppt', { filePath: fullPath, fileContent: content });
        localStorage.setItem('ppt_opened', 'true');
      }
    } else {
      alert(`No default handler registered for: ${fileName}`);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleIconRightClick = (e, name) => {
    e.preventDefault();
    e.stopPropagation();
    setIconContextMenu({ x: e.clientX, y: e.clientY, name });
  };

  // Create folder inside virtual C:\Desktop
  const handleCreateFolder = () => {
    const folderName = `New Folder`;
    let finalName = folderName;
    setFileSystem(prev => {
      const next = { ...prev };
      const desktop = next['C:'].files['Desktop'].files;
      
      // Auto increment folder name if exists
      let idx = 1;
      while (desktop[finalName]) {
        finalName = `${folderName} (${idx})`;
        idx++;
      }

      desktop[finalName] = { type: 'folder', files: {} };
      return next;
    });
    setContextMenu(null);
    setHoverContextSubMenu(null);
    // Auto-focus renaming input for the new folder
    setTimeout(() => {
      setRenamingItem(finalName);
      setRenameValue(finalName);
    }, 120);
  };

  // Create text document inside C:\Desktop
  const handleCreateTextFile = () => {
    const fileName = `New Text Document.txt`;
    let finalName = fileName;
    setFileSystem(prev => {
      const next = { ...prev };
      const desktop = next['C:'].files['Desktop'].files;
      
      let idx = 1;
      while (desktop[finalName]) {
        finalName = `New Text Document (${idx}).txt`;
        idx++;
      }

      desktop[finalName] = { type: 'file', size: 0, content: '' };
      return next;
    });
    setContextMenu(null);
    setHoverContextSubMenu(null);
    // Auto-focus renaming input for the new text file
    setTimeout(() => {
      setRenamingItem(finalName);
      setRenameValue(finalName);
    }, 120);
  };

  // Delete Desktop item
  const handleDeleteDesktopItem = (name) => {
    setFileSystem(prev => {
      const next = { ...prev };
      delete next['C:'].files['Desktop'].files[name];
      return next;
    });
    setIconContextMenu(null);
    playSound('beep');
  };

  // Rename Desktop item
  const handleStartRename = (name) => {
    setRenamingItem(name);
    setRenameValue(name);
    setIconContextMenu(null);
  };

  const handleSaveRename = () => {
    if (!renameValue.trim()) return;

    setFileSystem(prev => {
      const next = { ...prev };
      const desktop = next['C:'].files['Desktop'].files;
      const target = desktop[renamingItem];

      if (target) {
        desktop[renameValue] = target;
        delete desktop[renamingItem];
      }
      return next;
    });

    setRenamingItem(null);
  };

  const changeModemSpeedToggle = () => {
    const isNostalgia = localStorage.getItem('nostalgia_speed') !== 'real';
    localStorage.setItem('nostalgia_speed', isNostalgia ? 'real' : 'nostalgia');
    alert(`Modem download speeds set to: ${isNostalgia ? 'REAL TIME (Very Slow 3KB/s)' : 'NOSTALGIA SCALE (25x Speedup)'}`);
    setContextMenu(null);
  };

  const toggleBootFloppy = () => {
    if (floppyInserted) {
      setFloppyInserted(null);
      playSound('floppy');
      alert('Floppy disk ejected from Drive A:.');
    } else {
      setFloppyInserted('boot_floppy');
      playSound('floppy');
      alert('Floppy disk "Windows 95 Boot Disk" inserted.');
    }
    setContextMenu(null);
  };

  const triggerChernobylCrash = () => {
    setIsOsCorrupted(true);
    setActiveViruses(prev => [...prev, 'cih']);
    setOpenWindows([]);
  };

  // Start menu Run command runner handler
  const handleRunCommandSubmit = (e) => {
    if (e.key === 'Enter') {
      const cmd = runCommandValue.trim().toLowerCase();
      if (cmd) {
        openApp(cmd);
      }
      setRunDialogOpen(false);
      setRunCommandValue('');
    }
  };

  const desktopItems = fileSystem['C:']?.files?.['Desktop']?.files || {};
  const [resWidth, resHeight] = displaySettings.resolution.split('x');
  const resStyle = {
    width: `${resWidth}px`,
    height: `${resHeight}px`
  };

  let monitorScale = 1;
  if (displaySettings.fitToScreen !== false) {
    const bezelWidth = 56 + 32;
    const bezelHeight = 68 + 32;
    const targetW = Number(resWidth) + bezelWidth;
    const targetH = Number(resHeight) + bezelHeight;
    const scaleX = windowSize.width / targetW;
    const scaleY = windowSize.height / targetH;
    monitorScale = Math.min(scaleX, scaleY);
  }

  if (sub7State.isNuked) {
    return (
      <div 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          background: '#0000aa', 
          color: '#fff', 
          fontFamily: 'monospace', 
          padding: '40px', 
          textAlign: 'left', 
          fontSize: '14px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          gap: '15px' 
        }}
      >
        <div style={{ background: '#fff', color: '#0000aa', display: 'inline-block', padding: '2px 8px', fontWeight: 'bold', alignSelf: 'flex-start' }}>
          Windows
        </div>
        <p>A fatal exception 0E has occurred at 0028:C0011A25 in VXD VMM(01) + 0000E32B.</p>
        <p>The current application will be terminated.</p>
        <ul style={{ listStyleType: 'square', paddingLeft: '20px' }}>
          <li>Press any key to terminate the current application.</li>
          <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
        </ul>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button 
            className="win-btn" 
            onClick={() => {
              localStorage.removeItem('netbus_nuked');
              onReboot();
            }}
            style={{ 
              background: '#c0c0c0', 
              color: '#000', 
              padding: '6px 15px', 
              fontFamily: 'monospace', 
              fontWeight: 'bold', 
              fontSize: '12px' 
            }}
          >
            Reboot Virtual System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', backgroundColor: '#3a3a3a', padding: '16px', overflow: 'hidden' }}
      onContextMenu={handleRightClick} 
      onClick={() => { setContextMenu(null); setIconContextMenu(null); setStartMenuOpen(false); setHoverSubMenu(null); setVolumeSliderOpen(false); setHoverContextSubMenu(null); }}
    >
      
      {/* 1. MONITOR FRAME (Beige computer bezel) */}
      <div 
        style={{ 
          border: '28px solid #dcdad5', 
          borderBottomWidth: '40px',
          borderRadius: '12px', 
          boxShadow: 'inset 0 0 10px #000, 10px 10px 30px rgba(0,0,0,0.6)', 
          background: '#000', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          transform: `scale(${monitorScale})`,
          transformOrigin: 'center center'
        }}
      >
        
        {/* CRT Viewport screen */}
        <div 
          className={`crt-container filter-${displaySettings.filter || 'svga'} viewport dither-16 wallpaper-${localStorage.getItem('desktop_wallpaper') || 'teal'} theme-${desktopTheme}`}
          style={{ ...resStyle, overflow: 'hidden', position: 'relative' }}
        >
          {/* Render Cursor Trails */}
          {mouseSettings.trails && trailCoords.map((coord, index) => (
            <div 
              key={coord.id} 
              style={{
                position: 'absolute',
                left: coord.x,
                top: coord.y,
                width: '12px',
                height: '19px',
                pointerEvents: 'none',
                zIndex: 9999999,
                opacity: (index + 1) / (trailCoords.length + 1) * 0.4,
                transform: 'translate(-2px, -2px)'
              }}
            >
              <svg width="12" height="19" viewBox="0 0 12 19" fill="none" style={{ imageRendering: 'pixelated' }}>
                <path d="M0 0V16.5L3.8 12.7L6.8 19L9.5 17.7L6.5 11.5L11 11L0 0Z" fill="white" stroke="black" strokeWidth="1"/>
              </svg>
            </div>
          ))}

          {/* Dynamic Desktop Icons list from filesystem */}
          <div style={{ position: 'absolute', top: 10, left: 10, bottom: 50, display: sub7State.hideIcons ? 'none' : 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'flex-start', gap: '15px', zIndex: 1, pointerEvents: 'none' }}>
            
            {/* My Computer is always static at top */}
            <div onDoubleClick={() => openApp('explorer', { initialDrive: 'root', initialPath: '' })} style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '75px', pointerEvents: 'auto' }}>
              <Icons.Computer />
              <span style={{ fontSize: '11px', color: '#fff', textShadow: '1px 1px 0 #000', fontFamily: 'var(--font-win)', textAlign: 'center' }}>My Computer</span>
            </div>

            {/* Render items dynamically from C:\Desktop */}
            {Object.entries(desktopItems).map(([name, item]) => (
              <div 
                key={name}
                onDoubleClick={() => {
                  if (item.type === 'shortcut') {
                    openApp(item.target);
                  } else {
                    handleRunFile(name, `C:/Desktop/${name}`);
                  }
                }}
                onContextMenu={(e) => handleIconRightClick(e, name)}
                style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '75px', position: 'relative', pointerEvents: 'auto' }}
              >
                {item.type === 'shortcut' && item.target === 'mirc' && <Icons.Mirc />}
                {item.type === 'shortcut' && item.target === 'icq' && <Icons.Icq />}
                {item.type === 'shortcut' && item.target === 'bbs' && <Icons.Bbs />}
                {item.type === 'shortcut' && item.target === 'missions' && <Icons.CD />}
                {item.type === 'shortcut' && item.target === 'dialup' && <Icons.Network />}
                {item.type === 'shortcut' && item.target === 'napster' && <Icons.Napster />}
                {item.type === 'shortcut' && item.target === 'minesweeper' && <Icons.Minesweeper />}
                {item.type === 'shortcut' && item.target === 'paint' && <Icons.Paint />}
                {item.type === 'shortcut' && item.target === 'xdcc' && <Icons.Xdcc />}
                {item.type === 'shortcut' && item.target === 'nfogen' && <Icons.Nfogen />}
                {item.type === 'shortcut' && item.target === 'nesemu' && <Icons.Nesemu />}
                {item.type === 'folder' && <Icons.Folder />}
                {item.type === 'file' && <Icons.File />}

                {renamingItem === name ? (
                  <input 
                    type="text" 
                    value={renameValue} 
                    onChange={(e) => setRenameValue(e.target.value)} 
                    onBlur={handleSaveRename}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                    style={{ width: '70px', fontSize: '10px', textAlign: 'center', fontFamily: 'var(--font-win)', color: '#000', background: '#fff' }}
                    ref={input => input && input.focus()}
                  />
                ) : (
                  <span style={{ fontSize: '11px', color: '#fff', textShadow: '1px 1px 0 #000', fontFamily: 'var(--font-win)', textAlign: 'center', wordBreak: 'break-all' }}>
                    {item.label || name}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Windows render */}
          {openWindows.map(win => {
            if (win.minimized) return null;

            return (
              <div 
                key={win.id}
                className={`win-window win-outset ${activeWindowId === win.id ? 'active-window' : 'inactive-window'}`}
                style={win.maximized ? {
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: 'calc(100% - 40px)',
                  zIndex: win.zIndex
                } : {
                  left: `${win.x}px`,
                  top: `${win.y}px`,
                  width: `${win.width}px`,
                  height: `${win.height}px`,
                  zIndex: win.zIndex
                }}
                onClick={(e) => { e.stopPropagation(); focusWindow(win.id); }}
              >
                {/* Header */}
                <div 
                  className="win-title-bar"
                  onMouseDown={(e) => handleTitleMouseDown(e, win.id)}
                  onDoubleClick={() => toggleMaximizeWindow(win.id)}
                >
                  <span className="win-title-bar-title" style={{ fontFamily: 'var(--font-win)', fontSize: '11px' }}>
                    {win.title}
                  </span>
                  
                  <div className="win-title-bar-controls">
                    <button className="win-btn win-title-btn" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); toggleMinimizeWindow(win.id); }}>_</button>
                    <button className="win-btn win-title-btn" style={{ fontWeight: 'bold' }} onMouseDown={(e) => e.stopPropagation()} onClick={() => toggleMaximizeWindow(win.id)}>🗖</button>
                    <button className="win-btn win-title-btn close-btn" onMouseDown={(e) => e.stopPropagation()} onClick={() => closeWindow(win.id)}>X</button>
                  </div>
                </div>

                {/* Inner app wrapper */}
                <div className="win-window-body" style={{ flex: 1, overflow: 'auto', padding: 0 }}>
                  {win.id === 'mirc' && <MircWindow onClose={() => closeWindow(win.id)} />}
                  {win.id === 'icq' && <IcqWindow />}
                  {win.id === 'winamp' && <WinampWindow />}
                  {win.id === 'cuteftp' && <CuteFtpWindow />}
                  {win.id === 'bbs' && <BbsTerminal />}
                  {win.id === 'cdrwin' && <CdrWinWindow />}
                  {win.id === 'partition' && <PartitionMagic />}
                  {win.id === 'netbus' && <NetbusWindow />}
                  {win.id === 'browser' && <WebBrowser />}
                  {win.id === 'editor' && <WebEditor />}
                  {win.id === 'shop' && <HardwareShop />}
                  {win.id === 'antivirus' && <Antivirus />}
                  {win.id === 'control' && <ControlPanel openApp={openApp} />}
                  {win.id === 'control_display' && <ControlPanelDisplay />}
                  {win.id === 'control_sounds' && <ControlPanelSounds />}
                  {win.id === 'control_mouse' && <ControlPanelMouse />}
                  {win.id === 'control_datetime' && <ControlPanelDateTime />}
                  {win.id === 'control_system' && <ControlPanelSystem />}
                  {win.id === 'control_programs' && <ControlPanelPrograms />}
                  {win.id === 'wincommander' && <WinCommander onRunFile={handleRunFile} />}
                  
                  {win.id === 'explorer' && <Explorer initialDrive={win.extraProps?.initialDrive} initialPath={win.extraProps?.initialPath} onRunFile={handleRunFile} openApp={openApp} />}
                  {win.id === 'nfo' && <NfoViewer nfoContent={win.extraProps?.nfoContent} />}
                  {win.id === 'winzip' && <WinZip archiveName={win.extraProps?.archiveName} onExtractComplete={() => closeWindow('winzip')} />}
                  {win.id === 'dossetup' && <DosSetup gameName={win.extraProps?.gameName} onSetupComplete={() => closeWindow('dossetup')} />}
                  {win.id === 'missions' && <MissionManager />}
                  {win.id === 'notepad' && <Notepad filePath={win.extraProps?.filePath} fileContent={win.extraProps?.fileContent} onClose={() => closeWindow('notepad')} />}
                  {win.id === 'find' && <FindDialog onRunFile={handleRunFile} />}
                  {win.id === 'wordpad' && <WordpadWindow filePath={win.extraProps?.filePath} fileContent={win.extraProps?.fileContent} onClose={() => closeWindow(win.id)} />}
                  {win.id === 'ppt' && <PptViewerWindow filePath={win.extraProps?.filePath} fileContent={win.extraProps?.fileContent} />}
                  {win.id === 'dialup' && <DialUpWindow onClose={() => closeWindow(win.id)} />}
                  {win.id === 'napster' && <Napster />}
                  {win.id === 'minesweeper' && <Minesweeper />}
                  {win.id === 'paint' && <Paint />}
                  {win.id === 'xdcc' && <XdccCatcher />}
                  {win.id === 'nfogen' && <NfoGen />}
                  {win.id === 'nesemu' && <NesEmu />}
                  {win.id === 'sfvchecker' && <SfvChecker />}
                  {win.id === 'subseven' && <Subseven />}
                </div>
              </div>
            );
          })}

          <VirusSimulator />

          {sub7ChatMsg && (
            <div className="win-window win-outset active-window" style={{ position: 'absolute', left: '30%', top: '30%', width: '300px', height: '150px', zIndex: 99999999 }}>
              <div className="win-title-bar">
                <span>ICQ Direct Chat Connection</span>
                <button className="win-btn win-title-btn close-btn" onClick={() => { localStorage.removeItem('sub7_chat_active'); setSub7ChatMsg(''); }}>X</button>
              </div>
              <div className="win-window-body" style={{ padding: '8px', fontSize: '11px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--win-gray)', height: '110px' }}>
                <p style={{ margin: 0, color: '#000' }}><strong>Hacker says:</strong> {sub7ChatMsg}</p>
                <div style={{ display: 'flex', gap: '4px', marginTop: 'auto' }}>
                  <input 
                    type="text" 
                    id="sub7_victim_input"
                    className="win-input" 
                    placeholder="Type reply here..."
                    style={{ flex: 1, background: '#fff', padding: '3px 6px', color: '#000' }} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.target.value;
                        if (val.trim()) {
                          localStorage.setItem('sub7_chat_active', 'false');
                          localStorage.setItem('sub7_victim_reply', val);
                          setSub7ChatMsg('');
                        }
                      }
                    }}
                  />
                  <button 
                    className="win-btn" 
                    onClick={() => {
                      const input = document.getElementById('sub7_victim_input');
                      const val = input ? input.value : '';
                      if (val.trim()) {
                        localStorage.setItem('sub7_chat_active', 'false');
                        localStorage.setItem('sub7_victim_reply', val);
                        setSub7ChatMsg('');
                      }
                    }}
                    style={{ color: '#000' }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Start Menu Run Command Dialog Box */}
          {runDialogOpen && (
            <div className="win-window win-outset active-window" style={{ position: 'absolute', left: '150px', top: '150px', width: '320px', height: '140px', zIndex: 99999999 }}>
              <div className="win-title-bar">
                <span>Run Command Dialog</span>
                <button className="win-btn win-title-btn close-btn" onClick={() => setRunDialogOpen(false)}>X</button>
              </div>
              <div className="win-window-body" style={{ textAlign: 'left', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p>Type the name of a program to execute:</p>
                <input 
                  type="text" 
                  value={runCommandValue} 
                  onChange={(e) => setRunCommandValue(e.target.value)}
                  onKeyDown={handleRunCommandSubmit}
                  className="win-input" 
                  style={{ width: '100%' }}
                  placeholder="e.g. mirc, winamp, icq, shop, control..."
                  ref={input => input && input.focus()}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', justifyContent: 'flex-end' }}>
                  <button className="win-btn" onClick={() => handleRunCommandSubmit({ key: 'Enter' })}>OK</button>
                  <button className="win-btn" onClick={() => setRunDialogOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Right-Click Context Menu */}
          {contextMenu && (
            <div 
              className="win-window win-outset" 
              style={{ position: 'absolute', left: contextMenu.x - 10, top: contextMenu.y - 10, width: '160px', zIndex: 999999, padding: '2px', fontFamily: 'var(--font-win)', fontSize: '11px', color: '#000' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="win-menu-item" style={{ padding: '4px 8px', display: 'flex', justifyContent: 'space-between', position: 'relative' }} onMouseEnter={() => setHoverContextSubMenu('view')} onMouseLeave={() => setHoverContextSubMenu(null)}>
                <span>👁️ View</span>
                <span>▶</span>
                {hoverContextSubMenu === 'view' && (
                  <div className="win-window win-outset" style={{ position: 'absolute', left: '154px', top: '-2px', width: '120px', zIndex: 9999999, padding: '2px' }}>
                    <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={() => { setContextMenu(null); playSound('beep'); }}>✓ Large Icons</div>
                    <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={() => { setContextMenu(null); playSound('beep'); }}>Small Icons</div>
                  </div>
                )}
              </div>
              <div className="win-menu-item" style={{ padding: '4px 8px', display: 'flex', justifyContent: 'space-between', position: 'relative' }} onMouseEnter={() => setHoverContextSubMenu('arrange')} onMouseLeave={() => setHoverContextSubMenu(null)}>
                <span>🗂️ Arrange Icons</span>
                <span>▶</span>
                {hoverContextSubMenu === 'arrange' && (
                  <div className="win-window win-outset" style={{ position: 'absolute', left: '154px', top: '-2px', width: '120px', zIndex: 9999999, padding: '2px' }}>
                    <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={() => { setContextMenu(null); playSound('beep'); }}>By Name</div>
                    <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={() => { setContextMenu(null); playSound('beep'); }}>By Type</div>
                  </div>
                )}
              </div>
              <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={() => { setContextMenu(null); playSound('beep'); }}>🔄 Refresh</div>
              <hr style={{ margin: '3px 0', borderColor: '#808080' }} />
              <div className="win-menu-item" style={{ padding: '4px 8px', color: '#808080' }}>📋 Paste</div>
              <div className="win-menu-item" style={{ padding: '4px 8px', color: '#808080' }}>📋 Paste Shortcut</div>
              <hr style={{ margin: '3px 0', borderColor: '#808080' }} />
              <div className="win-menu-item" style={{ padding: '4px 8px', display: 'flex', justifyContent: 'space-between', position: 'relative' }} onMouseEnter={() => setHoverContextSubMenu('new')} onMouseLeave={() => setHoverContextSubMenu(null)}>
                <span>✨ New</span>
                <span>▶</span>
                {hoverContextSubMenu === 'new' && (
                  <div className="win-window win-outset" style={{ position: 'absolute', left: '154px', top: '-2px', width: '140px', zIndex: 9999999, padding: '2px' }}>
                    <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={handleCreateFolder}>📁 Folder</div>
                    <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={handleCreateTextFile}>📄 Text Document</div>
                  </div>
                )}
              </div>
              <hr style={{ margin: '3px 0', borderColor: '#808080' }} />
              <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={() => { setContextMenu(null); openApp('control'); }}>🛠️ Properties</div>
              <hr style={{ margin: '3px 0', borderColor: '#808080' }} />
              <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={changeModemSpeedToggle}>⚡ Toggle Real Speed</div>
              <div className="win-menu-item" style={{ padding: '4px 8px' }} onClick={toggleBootFloppy}>
                💾 {floppyInserted ? 'Eject Boot Floppy' : 'Insert Boot Floppy'}
              </div>
              <div className="win-menu-item" style={{ padding: '4px 8px', color: 'red' }} onClick={triggerChernobylCrash}>💥 CIH Chernobyl Wipe</div>
            </div>
          )}

          {/* Icon Right-Click Context Menu */}
          {iconContextMenu && (
            <div className="win-window win-outset" style={{ position: 'absolute', left: iconContextMenu.x, top: iconContextMenu.y, width: '120px', zIndex: 999999, padding: '2px' }}>
              <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => handleStartRename(iconContextMenu.name)}>Rename</div>
              <div className="win-menu-item" style={{ padding: '6px', color: 'red' }} onClick={() => handleDeleteDesktopItem(iconContextMenu.name)}>Delete</div>
            </div>
          )}

          {/* ICQ Notifications Stack */}
          <div style={{ position: 'absolute', bottom: '50px', right: '10px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 99999999, pointerEvents: 'auto' }}>
            {icqNotifications.map(notif => (
              <div 
                key={notif.id}
                className="win-window win-outset active-window"
                style={{ 
                  width: '240px', 
                  minHeight: '80px', 
                  boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--win-gray)'
                }}
              >
                <div className="win-title-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 6px', background: '#000080', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#0f0', textShadow: '0 0 2px #fff', fontWeight: 'bold' }}>🌼</span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}>ICQ System Notice</span>
                  </div>
                </div>
                <div className="win-window-body" style={{ padding: '6px', fontSize: '10px', color: '#000', display: 'flex', gap: '6px', alignItems: 'flex-start', flex: 1, overflow: 'hidden' }}>
                  <span style={{ fontSize: '16px' }}>✉️</span>
                  <div style={{ wordBreak: 'break-word', overflowY: 'auto', maxHeight: '60px', flex: 1, fontFamily: 'monospace', textAlign: 'left' }}>
                    {notif.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Taskbar */}
          <div className="win-outset" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40px', background: 'var(--win-gray)', display: sub7State.hideTaskbar ? 'none' : 'flex', alignItems: 'center', padding: '4px', gap: '6px', zIndex: 9999999 }}>
            <button 
              className={`win-btn ${startMenuOpen ? 'pressed' : ''}`}
              onClick={(e) => { e.stopPropagation(); setStartMenuOpen(prev => !prev); }}
              style={{ fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px', padding: '2px 8px' }}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" style={{ marginRight: '4px' }}>
                <rect x="0" y="0" width="6.5" height="5.5" fill="#ff3333" />
                <rect x="7.5" y="0" width="6.5" height="5.5" fill="#33cc33" />
                <rect x="0" y="6.5" width="6.5" height="5.5" fill="#3333ff" />
                <rect x="7.5" y="6.5" width="6.5" height="5.5" fill="#ffcc00" />
              </svg>
              <strong style={{ fontFamily: 'var(--font-win)', fontSize: '12px' }}>Start</strong>
            </button>

            <div style={{ flex: 1, display: 'flex', gap: '4px', overflowX: 'auto', height: '100%' }}>
              {openWindows.map(w => {
                const isActive = activeWindowId === w.id && !w.minimized;
                return (
                  <button 
                    key={w.id} 
                    className={`win-btn ${isActive ? 'pressed' : ''}`}
                    onClick={() => {
                      if (w.minimized) {
                        restoreWindow(w.id);
                      } else if (isActive) {
                        toggleMinimizeWindow(w.id);
                      } else {
                        focusWindow(w.id);
                      }
                    }}
                    style={{ flex: 1, maxWidth: '120px', fontSize: '11px', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {w.title}
                  </button>
                );
              })}
            </div>

            {/* System Tray (volume, clock, dials, notifications) */}
            <div className="win-inset" style={{ height: '100%', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', background: '#ccc', position: 'relative', borderLeft: '1px solid #fff' }}>
              {/* Flashing Modem networking computers */}
              {isInternetConnected && (
                <span 
                  onClick={() => openApp('dialup')}
                  style={{ fontSize: '12px', cursor: 'default', display: 'flex', gap: '2px', paddingRight: '4px' }} 
                  title="Dial-Up Networking Connected"
                >
                  <span style={{ color: hddLedActive ? '#00ff00' : '#777', textShadow: hddLedActive ? '0 0 2px #0f0' : 'none' }}>🖥️</span>
                  <span style={{ color: !hddLedActive ? '#00ff00' : '#777', textShadow: !hddLedActive ? '0 0 2px #0f0' : 'none' }}>🖥️</span>
                </span>
              )}
              {/* Floppy insert status */}
              {floppyInserted && (
                <span style={{ fontSize: '11px', cursor: 'default', color: '#0055aa' }} title="Boot Floppy Inserted in A:">
                  💾
                </span>
              )}
              {/* Antivirus Shield status */}
              <span 
                onClick={() => openApp('antivirus')}
                style={{ fontSize: '11px', cursor: 'default', color: 'green', display: 'flex', alignItems: 'center' }} 
                title="System Shield Active"
              >
                🛡️
              </span>
              {/* Speaker Volume control */}
              <span onClick={(e) => { e.stopPropagation(); setVolumeSliderOpen(prev => !prev); }} style={{ cursor: 'default', borderLeft: '1px solid var(--win-dark-gray)', paddingLeft: '6px' }}>
                🔊
              </span>
              <span style={{ borderLeft: '1px solid var(--win-dark-gray)', paddingLeft: '6px' }}>{timeStr}</span>

              {/* Volume Slider popup */}
              {volumeSliderOpen && (
                <div className="win-window win-outset" style={{ position: 'absolute', right: '40px', bottom: '42px', width: '50px', height: '120px', zIndex: 99999999, padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volumeLevel}
                    onChange={(e) => setVolumeLevel(Number(e.target.value))}
                    style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '80px', width: '16px' }}
                  />
                  <span style={{ fontSize: '9px', marginTop: '4px' }}>{volumeLevel}%</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. REAL WINDOWS 95 START MENU */}
          {startMenuOpen && (
            <div 
              className="win-window win-outset" 
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', bottom: '40px', left: '4px', width: '200px', height: '270px', zIndex: 99999999, display: 'flex', flexDirection: 'row', fontFamily: 'var(--font-win)', background: 'var(--win-gray)' }}
            >
              {/* Vertical side logo banner (light grey vertical gradient with Windows 95 text) */}
              <div 
                style={{ 
                  width: '24px', 
                  background: 'linear-gradient(180deg, #909090 0%, #b0b0b0 100%)', 
                  color: '#fff', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end', 
                  paddingBottom: '8px', 
                  fontWeight: 'bold', 
                  fontSize: '14px', 
                  letterSpacing: '1px' 
                }}
              >
                <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: '#dfdfdf' }}>
                  Windows<span style={{ color: '#fff', marginLeft: '2px' }}>95</span>
                </div>
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px', padding: '2px', textAlign: 'left', position: 'relative' }}>
                
                <div 
                  className="win-menu-item" 
                  onMouseEnter={() => setHoverSubMenu('programs')}
                  style={{ padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📁 Programs</span>
                  <span>▶</span>
                </div>

                <div 
                  className="win-menu-item" 
                  onMouseEnter={() => setHoverSubMenu('settings')}
                  style={{ padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⚙️ Settings</span>
                  <span>▶</span>
                </div>

                <div 
                  className="win-menu-item" 
                  onMouseEnter={() => setHoverSubMenu('documents')}
                  style={{ padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📄 Documents</span>
                  <span>▶</span>
                </div>

                <div 
                  className="win-menu-item" 
                  onMouseEnter={() => setHoverSubMenu(null)} 
                  style={{ padding: '4px 6px' }} 
                  onClick={() => openApp('find')}
                >
                  🔍 Find Files...
                </div>

                <div 
                  className="win-menu-item" 
                  onMouseEnter={() => setHoverSubMenu(null)} 
                  style={{ padding: '4px 6px' }} 
                  onClick={() => {
                    handleRunFile('readme.txt', 'C:/My Documents/readme.txt');
                    setStartMenuOpen(false);
                    localStorage.setItem('help_opened', 'true');
                  }}
                >
                  ❓ Help Topics
                </div>

                <hr style={{ margin: '2px 0', borderColor: '#808080' }} />

                <div className="win-menu-item" onMouseEnter={() => setHoverSubMenu(null)} style={{ padding: '4px 6px' }} onClick={() => openApp('shop')}>
                  🪙 PC Hardware Shop
                </div>
                
                <div className="win-menu-item" onMouseEnter={() => setHoverSubMenu(null)} style={{ padding: '4px 6px' }} onClick={() => openApp('missions')}>
                  🗂 Missions Campaign
                </div>

                <div className="win-menu-item" onMouseEnter={() => setHoverSubMenu(null)} style={{ padding: '4px 6px' }} onClick={() => { setRunDialogOpen(true); setStartMenuOpen(false); }}>
                  🏃 Run...
                </div>

                <hr style={{ margin: '2px 0', borderColor: '#fff' }} />
                
                <div className="win-menu-item" onMouseEnter={() => setHoverSubMenu(null)} style={{ padding: '4px 6px', color: 'red' }} onClick={onReboot}>
                  🔴 Shut Down / Reboot
                </div>

                {/* PROGRAMS SUB-FLYOUT */}
                {hoverSubMenu === 'programs' && (
                  <div className="win-window win-outset" style={{ position: 'absolute', left: '184px', top: '0px', width: '180px', zIndex: 999999999, padding: '2px' }}>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('wincommander')}>💻 File Commander</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('mirc')}>💬 mIRC Client</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('icq')}>📟 ICQ Messenger</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('winamp')}>🔊 Winamp Player</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('cuteftp')}>📁 CuteFTP Client</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('cdrwin')}>💿 CDRWin Burner</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('partition')}>💽 Partition Magic</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('netbus')}>👾 NetBus Hacker</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('browser')}>🌐 Netscape Web</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('editor')}>📝 FrontPage Editor</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('antivirus')}>🛡️ Antivirus Scan</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('sfvchecker')}>✅ QuickSFV Check</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('napster')}>🐱 Napster MP3</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('minesweeper')}>💣 Minesweeper</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('paint')}>🖌 MS Paint</div>
                    <div className="win-menu-item" style={{ padding: '6px', fontWeight: 'bold' }} onClick={() => openApp('subseven')}>😈 SubSeven Server</div>
                  </div>
                )}

                {/* SETTINGS SUB-FLYOUT */}
                {hoverSubMenu === 'settings' && (
                  <div className="win-window win-outset" style={{ position: 'absolute', left: '184px', top: '30px', width: '150px', zIndex: 999999999, padding: '2px' }}>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => openApp('control')}>💻 Control Panel</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => { playSound('beep'); alert('Printers: 1 printer installed (HP LaserJet 4P on LPT1: Local). Status: Ready.'); }}>🖨 Printers</div>
                    <div className="win-menu-item" style={{ padding: '6px' }} onClick={() => { playSound('beep'); alert('Taskbar & Start Menu Properties dialog sheet.'); }}>🗔 Taskbar...</div>
                  </div>
                )}

                {/* DOCUMENTS SUB-FLYOUT */}
                {hoverSubMenu === 'documents' && (
                  <div className="win-window win-outset" style={{ position: 'absolute', left: '184px', top: '60px', width: '180px', zIndex: 999999999, padding: '2px' }}>
                    <div className="win-menu-item" style={{ padding: '4px 6px' }} onClick={() => handleRunFile('readme.txt', 'C:/My Documents/readme.txt')}>📄 readme.txt</div>
                    <div className="win-menu-item" style={{ padding: '4px 6px' }} onClick={() => handleRunFile('History Assignment.doc', 'C:/My Documents/School/History Assignment.doc')}>📄 History Assignment.doc</div>
                    <div className="win-menu-item" style={{ padding: '4px 6px' }} onClick={() => handleRunFile('Geography Presentation.ppt', 'C:/My Documents/School/Geography Presentation.ppt')}>📄 Geography Presentation.ppt</div>
                    <div className="win-menu-item" style={{ padding: '4px 6px' }} onClick={() => handleRunFile('Math Homework.doc', 'C:/My Documents/School/Math Homework.doc')}>📄 Math Homework.doc</div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
        
        {/* Brand logo sticker on Monitor bottom bezel */}
        <div style={{ position: 'absolute', bottom: '-28px', width: '100%', textAlign: 'center', color: '#777', fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'sans-serif' }}>
          🖥 CRT MULTISCAN 15"
        </div>
      </div>

      {/* 2. PHYSICAL TOWER CASE (Right Side) */}
      <div 
        style={{ 
          width: '240px', 
          marginLeft: '32px', 
          background: '#dcdad5', 
          border: '4px solid #fff', 
          borderLeftColor: '#808080', 
          borderTopColor: '#808080', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          borderRadius: '4px', 
          boxShadow: '10px 10px 25px rgba(0,0,0,0.5)', 
          fontFamily: 'sans-serif',
          color: '#333'
        }}
      >
        <div style={{ textAlign: 'left', borderBottom: '2px solid #808080', paddingBottom: '4px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>200MMX TOWER</h2>
          <span style={{ fontSize: '9px', color: '#666' }}>PENTIUM SCENE COMPUTER</span>
        </div>

        {/* 3.5" Floppy Drive Panel */}
        <div className="win-outset" style={{ background: '#c0c0c0', padding: '8px', textAlign: 'left' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>3.5" FLOPPY DRIVE A:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Drive slot */}
            <div className="win-inset" style={{ flex: 1, height: '10px', background: '#111', borderRadius: '1px', position: 'relative' }}>
              {floppyInserted && (
                <div style={{ position: 'absolute', left: '10%', top: '2px', width: '80%', height: '4px', background: '#ccc' }} />
              )}
            </div>
            {/* LED */}
            <div style={{ width: '10px', height: '8px', borderRadius: '50%', background: floppyLedActive ? '#00ff00' : '#304030', border: '1px solid #111', boxShadow: floppyLedActive ? '0 0 8px #0f0' : 'none' }}></div>
          </div>
          <button 
            className="win-btn" 
            onClick={toggleBootFloppy}
            style={{ fontSize: '9px', padding: '1px 4px', marginTop: '6px', width: '100%' }}
          >
            {floppyInserted ? 'Eject Floppy' : 'Insert Disk'}
          </button>
        </div>

        {/* CD-ROM Burner Drive Panel */}
        <div className="win-outset" style={{ background: '#c0c0c0', padding: '8px', textAlign: 'left' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>CD-ROM DRIVE (BURNER)</div>
          <div className="win-inset" style={{ height: '24px', background: '#c0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
            <span style={{ fontSize: '8px', color: '#555' }}>PLEXWRITER 8x</span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: hddLedActive ? '#ff0000' : '#403030' }} />
            <button className="win-btn" style={{ width: '14px', height: '12px', padding: 0, fontSize: '6px' }} onClick={() => playSound('floppy')}>⏏</button>
          </div>
        </div>

        {/* Digital LED CPU Frequency Segment Display */}
        <div className="win-inset" style={{ background: '#000', padding: '10px', borderRadius: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '3px solid #808080' }}>
          <div style={{ fontSize: '9px', color: '#ffcc00', letterSpacing: '1px', marginBottom: '4px', fontWeight: 'bold' }}>CPU MHZ FREQUENCY</div>
          <span style={{ fontSize: '32px', fontFamily: 'monospace', color: '#ff0000', fontWeight: 'bold', letterSpacing: '4px', textShadow: '0 0 10px #f00' }}>
            {hardware.cpu.id === 'p133' ? '133' : hardware.cpu.id === 'p200mmx' ? '200' : '300'}
          </span>
        </div>

        {/* Digital Balance LCD (Credits) */}
        <div className="win-inset" style={{ background: '#052005', padding: '8px', borderRadius: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '3px solid #808080' }}>
          <div style={{ fontSize: '9px', color: '#00ff00', letterSpacing: '1px', marginBottom: '4px', fontWeight: 'bold' }}>CREDITS BALANCE</div>
          <span style={{ fontSize: '24px', fontFamily: 'monospace', color: '#00ff00', fontWeight: 'bold', textShadow: '0 0 8px #0f0' }}>
            ${credits.toString().padStart(4, '0')}
          </span>
        </div>

        {/* LEDs Status Panel (Power, HDD, Turbo) */}
        <div className="win-outset" style={{ display: 'flex', justifyContent: 'space-around', padding: '8px', fontSize: '9px', fontWeight: 'bold', background: '#c0c0c0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span>POWER</span>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff00', boxShadow: '0 0 8px #0f0' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span>HDD</span>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: hddLedActive ? '#ff3300' : '#401000', boxShadow: hddLedActive ? '0 0 8px #f30' : 'none' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span>TURBO</span>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffcc00', boxShadow: '0 0 8px #fc0' }}></div>
          </div>
        </div>

        {/* Front Panel control buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: 'auto' }}>
          {/* Reset button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button 
              className="win-btn" 
              onClick={() => { playSound('beep'); onReboot(); }}
              style={{ width: '30px', height: '30px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '9px', border: '3px outset #fff' }}
            >
              RST
            </button>
            <span style={{ fontSize: '8px', fontWeight: 'bold' }}>RESET</span>
          </div>

          {/* Power Switch */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button 
              className="win-btn" 
              onClick={onReboot}
              style={{ width: '40px', height: '30px', background: '#cc0000', color: '#fff', fontSize: '10px', fontWeight: 'bold', border: '3px outset #fff' }}
            >
              POWER
            </button>
            <span style={{ fontSize: '8px', fontWeight: 'bold' }}>ON/OFF</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
