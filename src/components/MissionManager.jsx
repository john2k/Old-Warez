import React, { useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function MissionManager() {
  const { credits, setCredits, completedMissions, setCompletedMissions, fileSystem, hardware, resetGame, playSound, isInternetConnected, activeViruses } = useContext(HardwareContext);

  const missions = [
    // --- CONNECTIVITY & BASIC UTILITIES (1-15) ---
    {
      id: 'm1_dialup',
      title: '1. Spoof Telephone Line & Connect (Dial-Up)',
      difficulty: 'Easy',
      reward: 50,
      description: 'Initialize telephone line hijack sequence by double-clicking Dial-Up Connection on the Desktop and patching to the ISP.',
      check: () => isInternetConnected === true
    },
    {
      id: 'm2_mirc_connect',
      title: '2. Infiltrate IRC Underground Channels',
      difficulty: 'Easy',
      reward: 50,
      description: 'Open mIRC Chat, connect to the UnderNet server to find local warez scene channels.',
      check: () => localStorage.getItem('win95_mirc_connected') === 'true'
    },
    {
      id: 'm3_bbs_dial',
      title: '3. Tap Keep BBS Cyberdeck Node',
      difficulty: 'Easy',
      reward: 60,
      description: 'Open BBS Term, dial 555-8839 to hook into the Keep BBS underground board.',
      check: () => localStorage.getItem('bbs_connected') === 'true'
    },
    {
      id: 'm4_bbs_files',
      title: '4. Scan BBS Directory for Leaked Code',
      difficulty: 'Easy',
      reward: 50,
      description: 'Press [F] inside Keep BBS to dump and view the hidden files and programs directory.',
      check: () => localStorage.getItem('bbs_menu_state') === 'file-area'
    },
    {
      id: 'm5_bbs_doors',
      title: '5. Exploit Sandbox via BBS Door Gateway',
      difficulty: 'Easy',
      reward: 50,
      description: 'Press [D] inside Keep BBS to access the door network and scan for local terminal escape vectors.',
      check: () => localStorage.getItem('bbs_menu_state') === 'games'
    },
    {
      id: 'm6_napster_search',
      title: '6. Locate Unreleased Music Leak (Napster)',
      difficulty: 'Easy',
      reward: 50,
      description: 'Query the Napster database for leaked pre-release music tracks.',
      check: () => localStorage.getItem('napster_searched') === 'true'
    },
    {
      id: 'm7_napster_download',
      title: '7. Snatch Locked MP3 via P2P Link',
      difficulty: 'Easy',
      reward: 80,
      description: 'Initiate a download of any scene MP3 track over Napster to your local files.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return Object.keys(dl).some(k => k.toLowerCase().endsWith('.mp3'));
      }
    },
    {
      id: 'm8_winamp_tunes',
      title: '8. Audit MP3 Waveforms in Winamp',
      difficulty: 'Easy',
      reward: 80,
      description: 'Play a downloaded audio file in Winamp to analyze sample rate parameters.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm9_paint_launch',
      title: '9. Sketch Hacking Group ANSI Art Logo',
      difficulty: 'Easy',
      reward: 40,
      description: 'Open MS Paint and render a pixel-based ANSI art draft for your release group\'s splash screen.',
      check: () => localStorage.getItem('paint_drawn') === 'true'
    },
    {
      id: 'm10_minesweeper_play',
      title: '10. Trace Stack Offsets via Minesweeper Shell',
      difficulty: 'Easy',
      reward: 40,
      description: 'Launch Minesweeper and trigger a tile grid generation to scan memory seed distribution.',
      check: () => localStorage.getItem('minesweeper_played') === 'true'
    },
    {
      id: 'm11_help_topics',
      title: '11. Audit Undocumented OS API Manual',
      difficulty: 'Easy',
      reward: 40,
      description: 'Browse Windows Help Topics (Start -> Help) to lookup system kernel interrupts.',
      check: () => localStorage.getItem('help_opened') === 'true'
    },
    {
      id: 'm12_wordpad_assign',
      title: '12. Decrypt Teacher\'s Stolen History Grade Log',
      difficulty: 'Easy',
      reward: 50,
      description: 'Double-click History Assignment.doc inside C:\\My Documents\\School to parse student notes.',
      check: () => localStorage.getItem('wordpad_opened') === 'true'
    },
    {
      id: 'm13_ppt_view',
      title: '13. Infiltrate School Geography Database File',
      difficulty: 'Easy',
      reward: 50,
      description: 'Open Geography Presentation.ppt inside School folder to read teaching modules.',
      check: () => localStorage.getItem('ppt_opened') === 'true'
    },
    {
      id: 'm14_find_tool',
      title: '14. Audit Local Drives for Hacked File Artifacts',
      difficulty: 'Easy',
      reward: 50,
      description: 'Launch Start -> Find and execute a file scan across system partitions.',
      check: () => localStorage.getItem('find_searched') === 'true'
    },
    {
      id: 'm15_create_folder',
      title: '15. Create Encrypted Partition Directory',
      difficulty: 'Easy',
      reward: 40,
      description: 'Right-click the Desktop and create a New Folder to act as your secure stash container.',
      check: () => {
        const desktop = fileSystem['C:']?.files?.['Desktop']?.files || {};
        return Object.keys(desktop).some(k => k.startsWith('New Folder') || (k !== 'readme.txt' && !k.endsWith('.lnk') && desktop[k].type === 'folder'));
      }
    },
 
    // --- SYSTEM OPTIONS & APPEARANCE (16-30) ---
    {
      id: 'm16_theme_plum',
      title: '16. Set Terminal Palette: Plum Hack',
      difficulty: 'Easy',
      reward: 50,
      description: 'Set scheme to Plum in Display Properties to dim contrast for late-night hacking sessions.',
      check: () => localStorage.getItem('desktop_theme') === 'plum'
    },
    {
      id: 'm17_theme_desert',
      title: '17. Set Terminal Palette: Desert Storm',
      difficulty: 'Easy',
      reward: 50,
      description: 'Set scheme to Desert in Display Properties to minimize screen glare.',
      check: () => localStorage.getItem('desktop_theme') === 'desert'
    },
    {
      id: 'm18_theme_hacker',
      title: '18. Initialize Matrix HUD Interface',
      difficulty: 'Easy',
      reward: 80,
      description: 'Change theme to Underground Hacker to turn the UI into terminal green phosphor.',
      check: () => localStorage.getItem('desktop_theme') === 'hacker'
    },
    {
      id: 'm19_theme_contrast',
      title: '19. Enable High Contrast Console Mode',
      difficulty: 'Easy',
      reward: 50,
      description: 'Change Display Properties to High Contrast Black for high-visibility terminal look.',
      check: () => localStorage.getItem('desktop_theme') === 'highcontrast'
    },
    {
      id: 'm20_mouse_trails',
      title: '20. Calibrate CRT Refresh Rate Lag (Mouse Trails)',
      difficulty: 'Easy',
      reward: 50,
      description: 'Enable mouse trails in Control Panel -> Mouse to calibrate cursor tracing latency.',
      check: () => localStorage.getItem('mouse_trails') === 'true'
    },
    {
      id: 'm21_res_svga',
      title: '21. Override Resolution limits to SVGA (800x600)',
      difficulty: 'Medium',
      reward: 80,
      description: 'Repatch Display resolution settings to 800x600 (SVGA) to fit more shells on screen.',
      check: () => hardware.video.resolution === '800x600' || hardware.video.resolution === '1024x768'
    },
    {
      id: 'm22_res_hi',
      title: '22. Repatch Display Pipeline to XGA (1024x768)',
      difficulty: 'Hard',
      reward: 100,
      description: 'Increase CRT pixel density to 1024x768 to monitor multiple compiler panes.',
      check: () => hardware.video.resolution === '1024x768'
    },
    {
      id: 'm23_timezone',
      title: '23. Spoof Gateway Location (System Timezone)',
      difficulty: 'Easy',
      reward: 40,
      description: 'Modify date & time timezone configuration to hide your real connection origin.',
      check: () => localStorage.getItem('timezone') !== 'US/Eastern' && localStorage.getItem('timezone') !== null
    },
    {
      id: 'm24_screen_vga_filter',
      title: '24. Calibrate VGA Scanlines Rasterizer',
      difficulty: 'Easy',
      reward: 50,
      description: 'Apply the VGA Scanlines filter in Display settings to stabilize refresh sync.',
      check: () => localStorage.getItem('desktop_filter') === 'vga'
    },
    {
      id: 'm25_screen_svga_filter',
      title: '25. Calibrate SVGA CRT Pixel Grid',
      difficulty: 'Easy',
      reward: 50,
      description: 'Apply the SVGA Grid rasterizer filter to match retro terminal hardware grids.',
      check: () => localStorage.getItem('desktop_filter') === 'svga'
    },
    {
      id: 'm26_screen_retro_filter',
      title: '26. Calibrate Heavy CRT Phosphor Glow',
      difficulty: 'Easy',
      reward: 50,
      description: 'Apply Retro TV filter for maximum retro scanline dispersion.',
      check: () => localStorage.getItem('desktop_filter') === 'retro'
    },
    {
      id: 'm27_create_txt',
      title: '27. Initialize Release NFO Outline File',
      difficulty: 'Easy',
      reward: 40,
      description: 'Create a new Text Document on the Desktop to write release group info.',
      check: () => {
        const desktop = fileSystem['C:']?.files?.['Desktop']?.files || {};
        return Object.keys(desktop).some(k => k.toLowerCase().endsWith('.txt') && k !== 'readme.txt');
      }
    },
    {
      id: 'm28_format_floppy',
      title: '28. Wipe & Format Physical Save/Load Floppy',
      difficulty: 'Medium',
      reward: 120,
      description: 'Format 3 1/2 Floppy Diskette A: to make it a bootable save drive.',
      check: () => localStorage.getItem('floppy_formatted') === 'true'
    },
    {
      id: 'm29_copy_map_floppy',
      title: '29. Write Hacked Warcraft 2 Level to Floppy',
      difficulty: 'Medium',
      reward: 120,
      description: 'Transfer warcraft2_map.pod or play.bat between A: and C: partitions to clone files.',
      check: () => localStorage.getItem('map_transferred_floppy') === 'true'
    },
    {
      id: 'm30_norton_ghost',
      title: '30. Norton Ghost: Image Hacked Partition C: to D:',
      difficulty: 'Hard',
      reward: 200,
      description: 'Run Norton Ghost Clone inside WinCommander to clone C: to backup disk D:.',
      check: () => localStorage.getItem('ghost_cloned') === 'true'
    },

    // --- WAREZ DOWNLOADS & DCC (31-50) ---
    {
      id: 'm31_warez_trigger',
      title: '31. Trigger DCC chat from Bot',
      difficulty: 'Easy',
      reward: 50,
      description: 'Type !WarezBot inside mIRC room #warez-classic.',
      check: () => localStorage.getItem('fserv_triggered') === 'true'
    },
    {
      id: 'm32_fserv_games',
      title: '32. Enter GAMES folder in Fserv',
      difficulty: 'Easy',
      reward: 50,
      description: 'In Fserv console, type cd GAMES.',
      check: () => localStorage.getItem('fserv_path') === 'C:\\GAMES'
    },
    {
      id: 'm33_fserv_doom',
      title: '33. Enter DOOM-FLT release folder',
      difficulty: 'Easy',
      reward: 60,
      description: 'In Fserv console, type cd DOOM-FLT.',
      check: () => (localStorage.getItem('fserv_path') || '').includes('DOOM-FLT')
    },
    {
      id: 'm34_dcc_diz',
      title: '34. Download description file_id.diz',
      difficulty: 'Medium',
      reward: 80,
      description: 'Enter a game folder in DCC and type get file_id.diz.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['file_id.diz'] !== undefined;
      }
    },
    {
      id: 'm35_view_diz',
      title: '35. Read file_id.diz in NFO Viewer',
      difficulty: 'Easy',
      reward: 60,
      description: 'Double-click file_id.diz in C:\\Downloads to open in NFO viewer.',
      check: () => localStorage.getItem('nfo_viewer_file') === 'file_id.diz'
    },
    {
      id: 'm36_dcc_doom',
      title: '36. Download Doom RAR release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to DOOM-FLT folder in DCC and download flt-doom.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['flt-doom.rar'] !== undefined;
      }
    },
    {
      id: 'm37_dcc_duke3d',
      title: '37. Download Duke Nukem 3D release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to DUKE3D-PCP folder in DCC and download pcp-duke3d.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['pcp-duke3d.rar'] !== undefined;
      }
    },
    {
      id: 'm38_dcc_quake',
      title: '38. Download Quake release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to QUAKE-RELOADED folder in DCC and download rld-quake.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['rld-quake.rar'] !== undefined;
      }
    },
    {
      id: 'm39_dcc_warcraft',
      title: '39. Download Warcraft II release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to WARCRAFT2-COMPRESS in DCC and download wc2-crk.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['wc2-crk.rar'] !== undefined;
      }
    },
    {
      id: 'm40_dcc_diablo',
      title: '40. Download Diablo release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to DIABLO-CLONECD and download ccd-diablo.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['ccd-diablo.rar'] !== undefined;
      }
    },
    {
      id: 'm41_dcc_nfs',
      title: '41. Download Need For Speed release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to NFS-SCENE and download nfs-scene.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['nfs-scene.rar'] !== undefined;
      }
    },
    {
      id: 'm42_dcc_aoe',
      title: '42. Download Age of Empires release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to AGEOFEMPIRES-CRK and download aoe-crk.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['aoe-crk.rar'] !== undefined;
      }
    },
    {
      id: 'm43_dcc_simcity',
      title: '43. Download SimCity 2000 release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to SIMCITY2K and download sc2k-el.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['sc2k-el.rar'] !== undefined;
      }
    },
    {
      id: 'm44_dcc_cnc',
      title: '44. Download Command & Conquer',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to CNC-REMIX and download cnc-remix.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['cnc-remix.rar'] !== undefined;
      }
    },
    {
      id: 'm45_dcc_halflife',
      title: '45. Download Half-Life release',
      difficulty: 'Medium',
      reward: 100,
      description: 'Go to HALFLIFE-VALVE and download valve-hl.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['valve-hl.rar'] !== undefined;
      }
    },
    {
      id: 'm46_dcc_winzip_rar',
      title: '46. Download WinZip Keygen via mIRC',
      difficulty: 'Medium',
      reward: 80,
      description: 'Navigate to WINZIP-DGT under keygens and get wz62-dgt.rar.',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['wz62-dgt.rar'] !== undefined;
      }
    },
    {
      id: 'm47_nfo_generator',
      title: '47. Generate ASCII NFO File',
      difficulty: 'Medium',
      reward: 100,
      description: 'Launch NFO Gen (unlocked at 8 completed missions), type details, click "Generate NFO" to write it to your downloads folder.',
      check: () => localStorage.getItem('nfo_generated') === 'true'
    },
    {
      id: 'm48_mirc_join_win95',
      title: '48. Join room #win95',
      difficulty: 'Easy',
      reward: 40,
      description: 'Inside mIRC status console, type "/join #win95".',
      check: () => localStorage.getItem('win95_mirc_connected') === 'true' // Simplified check
    },
    {
      id: 'm49_mirc_nuke',
      title: '49. Test mIRC Ping-Nuke flood',
      difficulty: 'Medium',
      reward: 80,
      description: 'Open mIRC Scripting Studio console (unlocked at 10 completed missions) and trigger a ping-nuke flood.',
      check: () => localStorage.getItem('mirc_nuke_sent') === 'true'
    },
    {
      id: 'm50_bbs_happy99',
      title: '50. Download happy99.exe from BBS',
      difficulty: 'Easy',
      reward: 60,
      description: 'Connect to Keep BBS files and download option 2 (happy99.exe).',
      check: () => {
        const dl = fileSystem['C:']?.files?.['Downloads']?.files || {};
        return dl['happy99.exe'] !== undefined;
      }
    },

    // --- EXTRACTION & SETUP EMULATOR LAUNCHERS (51-75) ---
    {
      id: 'm51_extract_winzip_u',
      title: '51. Extract wz62-dgt.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click wz62-dgt.rar in Downloads and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['WinZip'] !== undefined;
      }
    },
    {
      id: 'm52_extract_doom_u',
      title: '52. Extract flt-doom.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click flt-doom.rar and unpack files to C:\\GAMES\\Doom.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['Doom'] !== undefined;
      }
    },
    {
      id: 'm53_extract_duke3d_u',
      title: '53. Extract pcp-duke3d.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click pcp-duke3d.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['Duke3D'] !== undefined;
      }
    },
    {
      id: 'm54_extract_quake_u',
      title: '54. Extract rld-quake.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click rld-quake.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['Quake'] !== undefined;
      }
    },
    {
      id: 'm55_extract_warcraft_u',
      title: '55. Extract wc2-crk.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click wc2-crk.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['Warcraft2'] !== undefined;
      }
    },
    {
      id: 'm56_extract_diablo_u',
      title: '56. Extract ccd-diablo.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click ccd-diablo.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['Diablo'] !== undefined;
      }
    },
    {
      id: 'm57_extract_nfs_u',
      title: '57. Extract nfs-scene.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click nfs-scene.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['NeedForSpeed'] !== undefined;
      }
    },
    {
      id: 'm58_extract_aoe_u',
      title: '58. Extract aoe-crk.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click aoe-crk.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['AgeOfEmpires'] !== undefined;
      }
    },
    {
      id: 'm59_extract_simcity_u',
      title: '59. Extract sc2k-el.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click sc2k-el.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['SimCity2000'] !== undefined;
      }
    },
    {
      id: 'm60_extract_cnc_u',
      title: '60. Extract cnc-remix.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click cnc-remix.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['CommandAndConquer'] !== undefined;
      }
    },
    {
      id: 'm61_extract_halflife_u',
      title: '61. Extract valve-hl.rar',
      difficulty: 'Medium',
      reward: 100,
      description: 'Double click valve-hl.rar and extract files.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['HalfLife'] !== undefined;
      }
    },
    {
      id: 'm62_setup_doom',
      title: '62. Sound Config: Doom',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\Doom\\setup.exe and save IRQ/DMA options.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_Doom') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm63_setup_duke3d',
      title: '63. Sound Config: Duke Nukem 3D',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\Duke3D\\setup.exe and save SoundBlaster options.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_Duke3D') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm64_setup_warcraft',
      title: '64. Sound Config: Warcraft II',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\Warcraft2\\setup.exe and save sound jumper options.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_Warcraft2') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm65_setup_quake',
      title: '65. Sound Config: Quake',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\Quake\\setup.exe and configure sound card jumper.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_Quake') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm66_setup_diablo',
      title: '66. Sound Config: Diablo',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\Diablo\\setup.exe and save settings.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_Diablo') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm67_setup_nfs',
      title: '67. Sound Config: Need For Speed',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\NeedForSpeed\\setup.exe and save settings.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_NeedForSpeed') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm68_setup_aoe',
      title: '68. Sound Config: Age of Empires',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\AgeOfEmpires\\setup.exe and save settings.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_AgeOfEmpires') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm69_setup_simcity',
      title: '69. Sound Config: SimCity 2000',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\SimCity2000\\setup.exe and save settings.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_SimCity2000') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm70_setup_cnc',
      title: '70. Sound Config: Command & Conquer',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\CommandAndConquer\\setup.exe and save settings.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_CommandAndConquer') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm71_setup_halflife',
      title: '71. Sound Config: Half-Life',
      difficulty: 'Hard',
      reward: 120,
      description: 'Launch C:\\GAMES\\HalfLife\\setup.exe and save settings.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('sound_config_HalfLife') || '{}').correct === true;
        } catch { return false; }
      }
    },
    {
      id: 'm72_launch_doom',
      title: '72. Run Doom game emulator',
      difficulty: 'Hard',
      reward: 150,
      description: 'Configure sound card, then double-click play.bat inside C:\\GAMES\\Doom.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['Doom'] !== undefined;
      }
    },
    {
      id: 'm73_launch_warcraft',
      title: '73. Run Warcraft II game emulator',
      difficulty: 'Hard',
      reward: 150,
      description: 'Configure sound card, then double-click play.bat inside C:\\GAMES\\Warcraft2.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['Warcraft2'] !== undefined;
      }
    },
    {
      id: 'm74_launch_starcraft',
      title: '74. Run StarCraft game emulator',
      difficulty: 'Hard',
      reward: 150,
      description: 'Double-click play.bat inside C:\\GAMES\\StarCraft.',
      check: () => {
        const games = fileSystem['C:']?.files?.['GAMES']?.files || {};
        return games['StarCraft'] !== undefined;
      }
    },
    {
      id: 'm75_snes_emulator',
      title: '75. Play Chrono Trigger on SNES Emulator',
      difficulty: 'Hard',
      reward: 150,
      description: 'Launch the NES/SNES Emulator from desktop (unlocked at 20 missions) and start Chrono Trigger.',
      check: () => localStorage.getItem('emu_played') === 'true'
    },

    // --- PC UPGRADES & SHOP ITEMS (76-95) ---
    {
      id: 'm76_up_ram32',
      title: '76. Buy 32MB EDO RAM',
      difficulty: 'Medium',
      reward: 100,
      description: 'Purchase 32 MB RAM upgrade in PC Hardware Shop ($80).',
      check: () => hardware.ram.size >= 32
    },
    {
      id: 'm77_up_ram64',
      title: '77. Buy 64MB SDRAM',
      difficulty: 'Medium',
      reward: 100,
      description: 'Purchase 64 MB RAM upgrade in PC Hardware Shop ($150).',
      check: () => hardware.ram.size >= 64
    },
    {
      id: 'm78_up_ram128',
      title: '78. Buy 128MB SDRAM',
      difficulty: 'Hard',
      reward: 150,
      description: 'Purchase 128 MB RAM upgrade in PC Hardware Shop ($280).',
      check: () => hardware.ram.size === 128
    },
    {
      id: 'm79_up_cpu200',
      title: '79. Buy Pentium MMX 200MHz',
      difficulty: 'Medium',
      reward: 100,
      description: 'Buy Pentium 200 MHz MMX upgrade ($120) from Shop.',
      check: () => hardware.cpu.id === 'p200mmx' || hardware.cpu.id === 'pii300'
    },
    {
      id: 'm80_up_cpu300',
      title: '80. Buy Pentium II 300MHz',
      difficulty: 'Hard',
      reward: 150,
      description: 'Buy Pentium II 300 MHz CPU ($250) from Shop.',
      check: () => hardware.cpu.id === 'pii300'
    },
    {
      id: 'm81_up_sound_sb16',
      title: '81. Buy SoundBlaster 16',
      difficulty: 'Medium',
      reward: 100,
      description: 'Buy SoundBlaster 16 PnP sound card ($60) from Shop.',
      check: () => hardware.sound.id === 'sb16' || hardware.sound.id === 'awe32'
    },
    {
      id: 'm82_up_sound_awe32',
      title: '82. Buy SoundBlaster AWE32',
      difficulty: 'Hard',
      reward: 150,
      description: 'Buy SoundBlaster AWE32 sound card ($140) from Shop.',
      check: () => hardware.sound.id === 'awe32'
    },
    {
      id: 'm83_up_modem_33',
      title: '83. Buy 33.6k Modem',
      difficulty: 'Medium',
      reward: 100,
      description: 'Buy 33.6k Modem ($50) from Shop.',
      check: () => hardware.modem.speedKbps >= 33.6
    },
    {
      id: 'm84_up_modem_56',
      title: '84. Buy 56k Modem',
      difficulty: 'Hard',
      reward: 150,
      description: 'Buy 56k Modem ($95) from Shop.',
      check: () => hardware.modem.speedKbps === 56.0
    },
    {
      id: 'm85_up_burner_2x',
      title: '85. Buy 2x CD Burner',
      difficulty: 'Medium',
      reward: 100,
      description: 'Buy 2x CD Writer burner ($110) from Shop.',
      check: () => hardware.burner.speed >= 2
    },
    {
      id: 'm86_up_burner_8x',
      title: '86. Buy 8x CD Burner',
      difficulty: 'Hard',
      reward: 150,
      description: 'Buy 8x CD Writer burner ($190) from Shop.',
      check: () => hardware.burner.speed === 8
    },
    {
      id: 'm87_up_slave_hdd',
      title: '87. Buy Fujitsu 4.3GB Slave HDD',
      difficulty: 'Hard',
      reward: 150,
      description: 'Buy the secondary master/slave Fujitsu 4.3GB IDE drive ($130).',
      check: () => hardware.hddSlave !== null
    },
    {
      id: 'm88_up_video_s3',
      title: '88. Buy S3 ViRGE 3D (4MB)',
      difficulty: 'Medium',
      reward: 100,
      description: 'Buy S3 ViRGE 3D PCI video card ($90) from Shop.',
      check: () => hardware.video.id === 's3virge' || hardware.video.id === 'matrox'
    },
    {
      id: 'm89_up_video_matrox',
      title: '89. Buy Matrox Mystique (8MB)',
      difficulty: 'Hard',
      reward: 150,
      description: 'Buy Matrox Mystique AGP video card ($180) from Shop.',
      check: () => hardware.video.id === 'matrox'
    },
    {
      id: 'm90_burn_compilation',
      title: '90. Burn compilation CD',
      difficulty: 'Hard',
      reward: 200,
      description: 'Burn tracks onto a CD compilation inside CDRWin.',
      check: () => {
        try {
          return JSON.parse(localStorage.getItem('burned_cd_tracks') || '[]').length > 0;
        } catch { return false; }
      }
    },
    {
      id: 'm91_format_slave_hdd',
      title: '91. Format Disk D: via Partition Magic',
      difficulty: 'Hard',
      reward: 180,
      description: 'Partition and format Disk D: as FAT16 in Partition Magic.',
      check: () => hardware.hddSlave !== null && hardware.hddSlave.formatted === true
    },
    {
      id: 'm92_scan_fprot',
      title: '92. Scan C: drive with F-Prot',
      difficulty: 'Medium',
      reward: 100,
      description: 'Run F-Prot and scan Drive C:.',
      check: () => localStorage.getItem('system_cleaned') === 'true' // Simple validation
    },
    {
      id: 'm93_clean_fprot',
      title: '93. Clean Active Worms from RAM',
      difficulty: 'Medium',
      reward: 150,
      description: 'Run F-Prot and clean active infections.',
      check: () => localStorage.getItem('system_cleaned') === 'true' && activeViruses.length === 0
    },
    {
      id: 'm94_netbus_matrix',
      title: '94. Hack Professor\'s PC & Modify School Grades',
      difficulty: 'Easy',
      reward: 60,
      description: 'Deploy NetBus patch server payload to the Professor\'s IP, connect, and hijack the system terminal to force database write execution.',
      check: () => localStorage.getItem('netbus_nuked') === 'true' // simplified tracker
    },
    {
      id: 'm95_netbus_prank_script',
      title: '95. Execute Professor grade bypass database prank script',
      difficulty: 'Medium',
      reward: 120,
      description: 'Open the NetBus Script Editor (unlocked at 15 completed missions) and trigger a remote payload script to clean logs and seal your modified grade records.',
      check: () => localStorage.getItem('netbus_script_run') === 'true'
    },

    // --- MUSIC TUNES WINAMP ENTHUSIAST (96-112) ---
    {
      id: 'm96_wa_millencolin',
      title: '96. Listen to Millencolin',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "Millencolin - No Cigar" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm97_wa_limpbizkit',
      title: '97. Listen to Limp Bizkit',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "Limp Bizkit - Nookie" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm98_wa_spears',
      title: '98. Listen to Britney Spears',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "Britney Spears - ...Baby One More Time" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm99_wa_metallica',
      title: '99. Listen to Metallica',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "Metallica - Enter Sandman" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm100_wa_eiffel',
      title: '100. Listen to Eiffel 65',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "Eiffel 65 - Blue (Da Ba Dee)" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm101_wa_aqua',
      title: '101. Listen to Aqua',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "Aqua - Barbie Girl" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm102_wa_offspring',
      title: '102. Listen to The Offspring',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "The Offspring - Pretty Fly" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm103_wa_blink',
      title: '103. Listen to Blink-182',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "Blink-182 - All The Small Things" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm104_wa_eminem',
      title: '104. Listen to Eminem',
      difficulty: 'Easy',
      reward: 50,
      description: 'Play track "Eminem - My Name Is" in Winamp.',
      check: () => localStorage.getItem('winamp_playing') === 'true'
    },
    {
      id: 'm105_wa_skin',
      title: '105. Apply custom Winamp Theme Skin',
      difficulty: 'Easy',
      reward: 80,
      description: 'Earn at least $500 credits, open Winamp, and change the skin to Acid Green or Neon Yellow.',
      check: () => {
        const skin = localStorage.getItem('winamp_skin');
        return skin && skin !== 'classic';
      }
    },
    {
      id: 'm106_system_properties',
      title: '106. Probe System CPU / RAM Registers',
      difficulty: 'Easy',
      reward: 40,
      description: 'Open Control Panel -> System to dump processor frequency details and RAM hardware configurations.',
      check: () => {
        return localStorage.getItem('win95_simulator_save') !== null; // Simple checker
      }
    },
    {
      id: 'm107_find_homework',
      title: '107. Search Local Registry for Infiltrated School Data',
      difficulty: 'Easy',
      reward: 50,
      description: 'Use the Find tool (Start -> Find) to scan local directories for decrypted "homework" file indices.',
      check: () => localStorage.getItem('find_searched') === 'true'
    },
    {
      id: 'm108_wincommander_mk',
      title: '108. Boot WinCommander Dual Directory Shell',
      difficulty: 'Easy',
      reward: 40,
      description: 'Open WinCommander 96 from the Start Menu -> Programs to view dual active disk partitions.',
      check: () => {
        return true; // Auto-pass when opened
      }
    },
    {
      id: 'm109_disconnect_dialup',
      title: '109. Drop Phone Line Connection to Evade Trace Detectors',
      difficulty: 'Easy',
      reward: 50,
      description: 'Terminate the active ISP Dial-up handshake to clear routing logs and evade tracing.',
      check: () => isInternetConnected === false
    },
    {
      id: 'm110_campaign_claimed',
      title: '110. Reach Elite Warez Legend status',
      difficulty: 'Expert',
      reward: 1000,
      description: 'Claim rewards for at least 100 other task campaign missions in this checklist!',
      check: () => completedMissions.length >= 100
    }
  ];

  const [hideCompleted, setHideCompleted] = React.useState(localStorage.getItem('hide_completed_missions') === 'true');

  const handleClaim = (mission) => {
    setCredits(prev => prev + mission.reward);
    setCompletedMissions(prev => [...prev, mission.id]);
    playSound('beep');
    alert(`Congratulations! You claimed your reward of $${mission.reward} Credits! Progress autosaved.`);
  };

  const handleManualSave = () => {
    playSound('beep');
    alert('System State successfully synchronized and saved to BIOS (LocalStorage)!');
  };

  const toggleHideCompleted = () => {
    const val = !hideCompleted;
    setHideCompleted(val);
    localStorage.setItem('hide_completed_missions', String(val));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '12px', color: '#000', fontFamily: 'var(--font-win)' }}>
      {/* Title Header */}
      <div style={{ background: '#000080', color: '#fff', padding: '6px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--win-dark-gray)' }}>
        <span>Retro Task Campaign Manager (110 Missions)</span>
        <span>Completed: {completedMissions.length} / {missions.length}</span>
      </div>

      {/* Hide completed options bar */}
      <div className="win-outset" style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', marginTop: '4px', background: '#ccc', border: '1px solid #808080' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            checked={hideCompleted} 
            onChange={toggleHideCompleted} 
            style={{ margin: 0 }}
          />
          <span>Hide completed missions</span>
        </label>
      </div>

      {/* Main Mission List View */}
      <div className="win-inset" style={{ flex: 1, backgroundColor: '#fff', overflowY: 'auto', padding: '8px', marginTop: '6px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {missions
          .filter(mission => !hideCompleted || !completedMissions.includes(mission.id))
          .map(mission => {
            const isCompleted = completedMissions.includes(mission.id);
            const meetsCriteria = mission.check();

            return (
              <div 
                key={mission.id} 
                className="win-outset-shallow" 
                style={{ padding: '8px 10px', background: isCompleted ? '#dfdfdf' : '#f5f5f5', border: '1px solid #808080' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #bbb', paddingBottom: '3px', alignItems: 'center' }}>
                  <strong style={{ color: isCompleted ? '#666' : '#000' }}>{mission.title}</strong>
                  <span style={{ 
                    color: mission.difficulty === 'Easy' ? 'green' : (mission.difficulty === 'Medium' ? 'orange' : mission.difficulty === 'Hard' ? 'red' : 'purple'),
                    fontWeight: 'bold',
                    fontSize: '10px'
                  }}>
                  [{mission.difficulty}]
                </span>
              </div>
              <p style={{ margin: '4px 0', fontSize: '11px', color: isCompleted ? '#666' : '#333' }}>{mission.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontWeight: 'bold', color: isCompleted ? '#666' : '#005500', fontSize: '11px' }}>Reward: ${mission.reward} Credits</span>
                
                {isCompleted ? (
                  <span style={{ color: '#00aa00', fontWeight: 'bold', fontSize: '11px' }}>✓ Claimed & Saved</span>
                ) : meetsCriteria ? (
                  <button className="win-btn" onClick={() => handleClaim(mission)} style={{ fontWeight: 'bold', background: '#d4ffd4', padding: '2px 8px' }}>
                    Claim Reward
                  </button>
                ) : (
                  <span style={{ color: '#888', fontStyle: 'italic', fontSize: '10px' }}>Requirements pending...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save State & Reset Controls Panel */}
      <div className="win-outset" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', marginTop: '8px', background: '#ccc', border: '1px solid #808080', gap: '8px' }}>
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '11px' }}>💾 Auto-Save Persistence</span>
          <span style={{ fontSize: '9px', color: '#555' }}>Your progress and hardware upgrades are saved automatically.</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="win-btn" onClick={handleManualSave} style={{ padding: '3px 10px', fontSize: '11px' }}>Save State</button>
          <button className="win-btn" onClick={resetGame} style={{ padding: '3px 10px', fontSize: '11px', color: '#800000', fontWeight: 'bold' }}>Reset Game</button>
        </div>
      </div>
    </div>
  );
}
