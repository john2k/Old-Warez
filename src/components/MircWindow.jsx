import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';

// Dynamic Fserv directory file generator
const getFservDirectoryFiles = (path) => {
  const files = {};
  const upperPath = path.toUpperCase();
  
  if (upperPath === 'C:\\GAMES\\QUAKE_RZR') {
    files['rzr-qke.sfv'] = { size: 250, date: '22-06-96' };
    files['rzr-qke.nfo'] = { size: 2100, date: '22-06-96' };
    files['file_id.diz'] = { size: 400, date: '22-06-96' };
    for (let i = 1; i <= 8; i++) {
      files[`rzr-qke${i}.arj`] = { size: 1440000, date: '22-06-96' };
    }
  } else if (upperPath === 'C:\\GAMES\\REDALERT_CLS') {
    files['redalert.sfv'] = { size: 450, date: '22-11-96' };
    files['redalert.nfo'] = { size: 2300, date: '22-11-96' };
    files['file_id.diz'] = { size: 400, date: '22-11-96' };
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < alphabet.length; i++) {
      files[`ra-cl1${alphabet[i]}.arj`] = { size: 1440000, date: '22-11-96' };
    }
  } else if (upperPath === 'C:\\GAMES\\DIABLO_CND') {
    files['cnd-db.sfv'] = { size: 550, date: '31-12-96' };
    files['cnd-db.nfo'] = { size: 2200, date: '31-12-96' };
    files['file_id.diz'] = { size: 400, date: '31-12-96' };
    for (let i = 1; i <= 22; i++) {
      const num = String(i).padStart(2, '0');
      files[`cnd-db${num}.arj`] = { size: 1440000, date: '31-12-96' };
    }
  } else if (upperPath === 'C:\\GAMES\\STARCRAFT_CLS') {
    files['cls-sc.sfv'] = { size: 980, date: '04-02-98' };
    files['cls-sc.nfo'] = { size: 2400, date: '04-02-98' };
    files['file_id.diz'] = { size: 400, date: '04-02-98' };
    for (let i = 1; i <= 42; i++) {
      const num = String(i).padStart(2, '0');
      files[`cls-sc${num}.rar`] = { size: 1440000, date: '04-02-98' };
    }
  } else if (upperPath === 'C:\\GAMES\\HALFLIFE_DEV') {
    files['deviance.sfv'] = { size: 850, date: '19-11-98' };
    files['deviance.nfo'] = { size: 2500, date: '19-11-98' };
    files['file_id.diz'] = { size: 400, date: '19-11-98' };
    for (let i = 1; i <= 35; i++) {
      const num = String(i).padStart(2, '0');
      files[`dev-hl${num}.rar`] = { size: 1440000, date: '19-11-98' };
    }
  } else if (upperPath === 'C:\\GAMES\\UT_FLT') {
    files['flt-ut.sfv'] = { size: 1200, date: '24-11-99' };
    files['flt-ut.nfo'] = { size: 2600, date: '24-11-99' };
    files['file_id.diz'] = { size: 400, date: '24-11-99' };
    for (let i = 1; i <= 50; i++) {
      const num = String(i).padStart(2, '0');
      files[`flt-ut${num}.rar`] = { size: 1440000, date: '24-11-99' };
    }
  } else if (upperPath === 'C:\\GAMES\\DEUSEX_MYTH') {
    files['myth-dx.sfv'] = { size: 600, date: '26-06-00' };
    files['myth-dx.nfo'] = { size: 2150, date: '26-06-00' };
    files['file_id.diz'] = { size: 400, date: '26-06-00' };
    for (let i = 1; i <= 22; i++) {
      files[`myth-dx${i}.rar`] = { size: 1440000, date: '26-06-00' };
    }
  } else if (upperPath === 'C:\\GAMES\\DOOM_FLT') {
    files['flt-doom.sfv'] = { size: 150, date: '10-12-93' };
    files['flt-doom.nfo'] = { size: 1800, date: '10-12-93' };
    files['file_id.diz'] = { size: 400, date: '10-12-93' };
    files['flt-doom.rar'] = { size: 1440000, date: '10-12-93' };
    files['flt-doom.r00'] = { size: 1440000, date: '10-12-93' };
    files['flt-doom.r01'] = { size: 1440000, date: '10-12-93' };
  } else if (upperPath === 'C:\\GAMES\\DUKE3D_PCP') {
    files['pcp-duke3d.sfv'] = { size: 150, date: '29-01-96' };
    files['pcp-duke3d.nfo'] = { size: 1900, date: '29-01-96' };
    files['file_id.diz'] = { size: 400, date: '29-01-96' };
    files['pcp-duke3d.rar'] = { size: 1440000, date: '29-01-96' };
    files['pcp-duke3d.r00'] = { size: 1440000, date: '29-01-96' };
    files['pcp-duke3d.r01'] = { size: 1440000, date: '29-01-96' };
  } else if (upperPath === 'C:\\GAMES\\WARCRAFT2_CLS') {
    files['wc2-crk.sfv'] = { size: 150, date: '09-12-95' };
    files['wc2-crk.nfo'] = { size: 2000, date: '09-12-95' };
    files['file_id.diz'] = { size: 400, date: '09-12-95' };
    files['wc2-crk.rar'] = { size: 1440000, date: '09-12-95' };
    files['wc2-crk.r00'] = { size: 1440000, date: '09-12-95' };
    files['wc2-crk.r01'] = { size: 1440000, date: '09-12-95' };
  } else if (upperPath === 'C:\\GAMES\\NFS_SCENE') {
    files['nfs-scene.sfv'] = { size: 150, date: '31-08-95' };
    files['nfs-scene.nfo'] = { size: 1700, date: '31-08-95' };
    files['file_id.diz'] = { size: 400, date: '31-08-95' };
    files['nfs-scene.rar'] = { size: 1440000, date: '31-08-95' };
    files['nfs-scene.r00'] = { size: 1440000, date: '31-08-95' };
    files['nfs-scene.r01'] = { size: 1440000, date: '31-08-95' };
  } else if (upperPath === 'C:\\GAMES\\SIMCITY2K') {
    files['sc2k-el.sfv'] = { size: 150, date: '05-10-94' };
    files['sc2k-el.nfo'] = { size: 1600, date: '05-10-94' };
    files['file_id.diz'] = { size: 400, date: '05-10-94' };
    files['sc2k-el.rar'] = { size: 1440000, date: '05-10-94' };
    files['sc2k-el.r00'] = { size: 1440000, date: '05-10-94' };
    files['sc2k-el.r01'] = { size: 1440000, date: '05-10-94' };
  } else if (upperPath === 'C:\\GAMES\\CNC_REMIX') {
    files['cnc-remix.sfv'] = { size: 150, date: '15-09-95' };
    files['cnc-remix.nfo'] = { size: 2100, date: '15-09-95' };
    files['file_id.diz'] = { size: 400, date: '15-09-95' };
    files['cnc-remix.rar'] = { size: 1440000, date: '15-09-95' };
    files['cnc-remix.r00'] = { size: 1440000, date: '15-09-95' };
    files['cnc-remix.r01'] = { size: 1440000, date: '15-09-95' };
  } else if (upperPath === 'C:\\KEYGENS\\WINZIP_DGT') {
    files['wz62-dgt.sfv'] = { size: 150, date: '12-05-97' };
    files['wz62-dgt.nfo'] = { size: 1950, date: '12-05-97' };
    files['file_id.diz'] = { size: 400, date: '12-05-97' };
    files['wz62-dgt.rar'] = { size: 1200000, date: '12-05-97' };
    files['wz62-dgt.r00'] = { size: 1200000, date: '12-05-97' };
    files['wz62-dgt.r01'] = { size: 1200000, date: '12-05-97' };
  }

  return files;
};

export default function MircWindow({ onClose }) {
  const { hardware, playSound, addVirtualFile, isInternetConnected, completedMissions } = useContext(HardwareContext);
  
  // Connection setups
  const [ircConnected, setIrcConnected] = useState(false);
  const [ircConnecting, setIrcConnecting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('UnderNet');
  const [selectedChannel, setSelectedChannel] = useState('#warez-classic');
  const [nickName, setNickName] = useState('Guest');

  const [activeTab, setActiveTab] = useState('status'); // status, #warez-classic, fserv
  
  const [studioLines, setStudioLines] = useState([
    'mIRC Scripting Studio v3.2 initialized.',
    'Enter target nick/IP and trigger automated scripting action.'
  ]);
  const [studioTarget, setStudioTarget] = useState('RZR_Tech');
  const [studioActionType, setStudioActionType] = useState('nuke');
  const [studioRunning, setStudioRunning] = useState(false);
  const [studioProgress, setStudioProgress] = useState(0);

  const handleRunStudioScript = () => {
    if (studioRunning) return;
    setStudioRunning(true);
    setStudioProgress(0);
    setStudioLines(prev => [...prev, `[SCRIPT] Triggering ${studioActionType.toUpperCase()} flood on ${studioTarget}...`]);
    playSound('beep');

    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setStudioProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setStudioRunning(false);
        if (studioActionType === 'nuke') {
          localStorage.setItem('mirc_nuke_sent', 'true');
          setStudioLines(prev => [...prev, `[SUCCESS] PING-NUKE flood packet of 65535 bytes sent to ${studioTarget}. Destination offline.`, `[mIRC Scripting] mirc_nuke_sent state flag unlocked!`]);
        } else {
          setStudioLines(prev => [...prev, `[SUCCESS] Chat flood complete! Sent 15 messages in 0.5 seconds.`]);
        }
        playSound('beep');
      }
    }, 200);
  };

  const [statusLines, setStatusLines] = useState([
    '*** mIRC v5.61 by Khaled Mardam-Bey',
    '*** Disconnected. Select a network and click Connect.'
  ]);

  const [channelLines, setChannelLines] = useState([
    { type: 'topic', text: '*** Topic for #warez-classic is: ELITE RETRO TRADING | NO LAMERS | DIAL-UP LIVES! | Trigger: !games ou !WarezBot' },
    { type: 'system', text: '*** Channel modes set: +nt' },
    { type: 'join', text: '*** Joins: RZR_Tech (~fserv@192.168.12.1)' },
    { type: 'mode', text: '*** Mode +o RZR_Tech by ChanServ' },
    { type: 'join', text: '*** Joins: Cracker99 (~crack@undernet.net)' },
    { type: 'join', text: '*** Joins: OldSchooler (~retro@dialup.net)' },
    { type: 'join', text: '*** Joins: RetroFan (~vintage@aol.com)' },
    { type: 'join', text: '*** Joins: AcidBurn (~kate@gibson.org)' },
    { type: 'join', text: '*** Joins: ZeroCool (~crash@gibson.org)' },
    { type: 'chat', nick: 'RZR_Tech', text: '!TopSite_HQ [56k] [3/3 Slots Open] Triggers: /ctcp RZR_Tech game-fserv ou !games', ops: true },
    { type: 'chat', nick: 'OldSchooler', text: 'Yo! Anyone got the latest serial or keygen for WinZip 6.2?', voiced: true },
    { type: 'chat', nick: 'Cracker99', text: 'Send !games to download split keys.', voiced: true },
    { type: 'chat', nick: 'RetroFan', text: 'DCC speed is slow today, getting only 3KB/s on my 28.8k modem!' }
  ]);

  const [fservLines, setFservLines] = useState([
    { nick: 'System', text: '*** DCC Chat session established with RZR_Tech.' },
    { nick: 'RZR_Tech', text: '=====================================================' },
    { nick: 'RZR_Tech', text: '[RZR]..:: Razor1911_TopSite_HQ ::..' },
    { nick: 'RZR_Tech', text: '=====================================================' },
    { nick: 'RZR_Tech', text: 'Ratio: 1:1 (If required) | Speed: 5 KB/s max' },
    { nick: 'RZR_Tech', text: 'Current Users: 2/3' },
    { nick: 'RZR_Tech', text: 'Commands: dir, cd <folder>, get <file>, exit' },
    { nick: 'RZR_Tech', text: 'C:\\>'
    }
  ]);

  const [fservPath, setFservPath] = useState('C:\\');
  
  useEffect(() => {
    localStorage.setItem('fserv_path', fservPath);
  }, [fservPath]);
  
  // DCC send status
  const [dccActive, setDccActive] = useState(false);
  const [dccFile, setDccFile] = useState('');
  const [dccProgress, setDccProgress] = useState(0);
  const [dccSpeed, setDccSpeed] = useState(0);

  // DCC Invite modal state
  const [showDccInvite, setShowDccInvite] = useState(false);
  const [dccInviteFrom, setDccInviteFrom] = useState('');

  const [inputVal, setInputVal] = useState('');
  const [lastSentVal, setLastSentVal] = useState('');
  
  const bottomRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // User list for the side panel
  const users = [
    { nick: 'RZR_Tech', ops: true },
    { nick: 'BBS_Master', ops: true },
    { nick: 'AcidBurn', voiced: true },
    { nick: 'ZeroCool', voiced: true },
    { nick: 'Cracker99', voiced: true },
    { nick: 'OldSchooler', voiced: true },
    { nick: 'Phreaker', voiced: true },
    { nick: 'RetroFan', voiced: false },
    { nick: 'LordDigital', voiced: false },
    { nick: 'ModemMan', voiced: false },
    { nick: 'ISDN_King', voiced: false },
    { nick: 'X-Treme', voiced: false },
    { nick: 'Guest', voiced: false }
  ];

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [statusLines, channelLines, fservLines, ircConnected, activeTab]);

  // Simulate random chat messages in channel
  useEffect(() => {
    if (!ircConnected || activeTab !== '#warez-classic') return;

    const chatUsers = [
      { nick: 'Cracker99', voiced: true },
      { nick: 'OldSchooler', voiced: true },
      { nick: 'RetroFan', voiced: false },
      { nick: 'AcidBurn', voiced: true },
      { nick: 'ZeroCool', voiced: true },
      { nick: 'Phreaker', voiced: true },
      { nick: 'LordDigital', voiced: false },
      { nick: 'ModemMan', voiced: false }
    ];

    const triggers = [
      'Anyone got a patch for Duke Nukem sound card error?',
      'Check out the BBS at 555-4321, they uploaded the new Warcraft II expansion!',
      'Make sure you configure DOS setup: Port 220, IRQ 5, DMA 1!',
      'Did you try NetBus yet? It is so funny to open friends CD-ROM!',
      'Who is burning the new Millencolin CD?',
      'Just upgraded my modem to 56k, downloads are flying now!',
      'Is undernet lagging for anyone else?',
      'Hey guest type "!games" to open DCC Chat and get files!',
      'Check my fserv for elite keygens and game cracks.',
      'DCC speed patch loaded. Optimization set to maximum.',
      'Anyone remembers the Cascade virus screen melting effect? Epic.',
      'CIH Chernobyl virus will wipe your partition on April 26. Beware!',
      'Who wants to play Doom over dialup direct connection?'
    ];

    const actions = [
      'slaps Guest around a bit with a large trout',
      'hacks the Gibson...',
      'downloads CD covers at 3KB/s',
      'ejects floppy drive using NetBus script'
    ];

    const interval = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.05) {
        const randomNicks = ['KeyGenKid', 'D3viant', 'Nostalgia95', 'NapsterLover', '3dfx_card'];
        const nick = randomNicks[Math.floor(Math.random() * randomNicks.length)];
        setChannelLines(prev => [...prev, { type: 'join', text: `*** Joins: ${nick} (~user@undernet.org)` }]);
      } else if (roll < 0.10) {
        const activeChatters = ['LordDigital', 'ModemMan', 'ISDN_King'];
        const nick = activeChatters[Math.floor(Math.random() * activeChatters.length)];
        setChannelLines(prev => [...prev, { type: 'part', text: `*** Parts: ${nick} (Client Quit: Lag / Ping timeout)` }]);
      } else if (roll < 0.18) {
        const userObj = chatUsers[Math.floor(Math.random() * chatUsers.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        setChannelLines(prev => [...prev, { type: 'action', text: `* ${userObj.nick} ${action}` }]);
      } else if (roll < 0.25) {
        setChannelLines(prev => [...prev, { 
          type: 'chat', 
          nick: 'RZR_Tech', 
          text: '!TopSite_HQ [56k] [3/3 Slots Open] Triggers: /ctcp RZR_Tech game-fserv ou !games',
          ops: true 
        }]);
      } else {
        const userObj = chatUsers[Math.floor(Math.random() * chatUsers.length)];
        const msg = triggers[Math.floor(Math.random() * triggers.length)];
        setChannelLines(prev => [...prev, { 
          type: 'chat', 
          nick: userObj.nick, 
          text: msg,
          ops: userObj.ops,
          voiced: userObj.voiced
        }]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [ircConnected, activeTab]);

  // Simulate DCC Download Speed (Real Dialup is 4.5 - 5.2 KB/s)
  useEffect(() => {
    let interval;
    if (dccActive) {
      const isNostalgiaSpeed = localStorage.getItem('nostalgia_speed') !== 'real';
      // Simulating real 56k speed (approx 4800 bytes per second)
      const dialupSpeed = 4500 + Math.random() * 700; 
      // Speed multiplier for nostalgia mode
      const speed = isNostalgiaSpeed ? dialupSpeed * 50 : dialupSpeed;
      setDccSpeed(speed);

      // Target size represents a floppy disk split part (~1.44MB)
      const targetSize = dccFile.endsWith('.sfv') || dccFile.endsWith('.nfo') || dccFile === 'file_id.diz' 
        ? 1500 
        : 1440000;

      let currentBytes = 0;

      interval = setInterval(() => {
        currentBytes += speed / 10;
        const pct = Math.min(100, (currentBytes / targetSize) * 100);
        setDccProgress(pct);

        if (pct >= 100) {
          clearInterval(interval);
          setDccActive(false);

          // Map files completion to Downloads folder
          let prefix = '';
          if (dccFile.includes('qke') || dccFile.includes('quake')) prefix = 'rzr-qke';
          else if (dccFile.includes('redalert') || dccFile.includes('ra-cl1')) prefix = 'redalert';
          else if (dccFile.includes('db') || dccFile.includes('diablo') || dccFile.includes('cnd-')) prefix = 'cnd-db';
          else if (dccFile.includes('sc') || dccFile.includes('starcraft') || dccFile.includes('cls-sc')) prefix = 'cls-sc';
          else if (dccFile.includes('hl') || dccFile.includes('halflife') || dccFile.includes('dev-hl') || dccFile.includes('deviance')) prefix = 'dev-hl';
          else if (dccFile.includes('ut') || dccFile.includes('unreal') || dccFile.includes('flt-ut')) prefix = 'flt-ut';
          else if (dccFile.includes('dx') || dccFile.includes('deus') || dccFile.includes('myth-dx')) prefix = 'myth-dx';
          else if (dccFile.includes('doom') || dccFile.includes('flt-doom')) prefix = 'flt-doom';
          else if (dccFile.includes('duke') || dccFile.includes('pcp-duke3d')) prefix = 'pcp-duke3d';
          else if (dccFile.includes('wc2') || dccFile.includes('warcraft') || dccFile.includes('wc2-crk')) prefix = 'wc2-crk';
          else if (dccFile.includes('nfs') || dccFile.includes('scene')) prefix = 'nfs-scene';
          else if (dccFile.includes('simcity') || dccFile.includes('sc2k')) prefix = 'sc2k-el';
          else if (dccFile.includes('cnc')) prefix = 'cnc-remix';
          else if (dccFile.includes('wz62') || dccFile.includes('winzip')) prefix = 'wz62-dgt';

          if (prefix) {
            // Write SFV file
            addVirtualFile('C:', 'Downloads', `${prefix}.sfv`, 250, `; sfv file\n${prefix}.rar A5C392B1\n${prefix}.r00 B211D4E0\n${prefix}.r01 F33C8B90`);
            // Write NFO file
            addVirtualFile('C:', 'Downloads', `${prefix}.nfo`, 2100, `[RELEASE INFO]\nGroup: Scene\nType: Game\n\nInstall Notes:\n1. Verify archives via QuickSFV\n2. Extract main archive in WinZip/WinRAR\n3. Configure sound setup.exe (Port 220, IRQ 5, DMA 1)\n4. Launch play.bat!`);
            // Write file_id.diz
            addVirtualFile('C:', 'Downloads', `file_id.diz`, 400, `[${prefix.toUpperCase()} SCENE SPLIT]\nVerification checks required.\nPackaged by RZR_Tech.`);

            // Autowrite all respective parts of the selected pack so the SFV checksum checker scans them successfully!
            if (prefix === 'rzr-qke') {
              for (let i = 1; i <= 8; i++) addVirtualFile('C:', 'Downloads', `rzr-qke${i}.arj`, 1440000, `Quake Segment ${i}`);
            } else if (prefix === 'redalert') {
              const alphabet = 'abcdefghijklmnopqrstuvwxyz';
              for (let i = 0; i < alphabet.length; i++) addVirtualFile('C:', 'Downloads', `ra-cl1${alphabet[i]}.arj`, 1440000, `Red Alert Segment ${alphabet[i]}`);
            } else if (prefix === 'cnd-db') {
              for (let i = 1; i <= 22; i++) addVirtualFile('C:', 'Downloads', `cnd-db${String(i).padStart(2, '0')}.arj`, 1440000, `Diablo Segment ${i}`);
            } else if (prefix === 'cls-sc') {
              for (let i = 1; i <= 42; i++) addVirtualFile('C:', 'Downloads', `cls-sc${String(i).padStart(2, '0')}.rar`, 1440000, `StarCraft Segment ${i}`);
            } else if (prefix === 'dev-hl') {
              for (let i = 1; i <= 35; i++) addVirtualFile('C:', 'Downloads', `dev-hl${String(i).padStart(2, '0')}.rar`, 1440000, `Half-Life Segment ${i}`);
            } else if (prefix === 'flt-ut') {
              for (let i = 1; i <= 50; i++) addVirtualFile('C:', 'Downloads', `flt-ut${String(i).padStart(2, '0')}.rar`, 1440000, `Unreal Tournament Segment ${i}`);
            } else if (prefix === 'myth-dx') {
              for (let i = 1; i <= 22; i++) addVirtualFile('C:', 'Downloads', `myth-dx${i}.rar`, 1440000, `Deus Ex Segment ${i}`);
            } else if (prefix === 'wz62-dgt') {
              addVirtualFile('C:', 'Downloads', `wz62-dgt.rar`, 1200000, `WinZip keygen`);
              addVirtualFile('C:', 'Downloads', `wz62-dgt.r00`, 1200000, `WinZip keygen r00`);
              addVirtualFile('C:', 'Downloads', `wz62-dgt.r01`, 1200000, `WinZip keygen r01`);
            } else {
              // Write generic splits
              addVirtualFile('C:', 'Downloads', `${prefix}.rar`, 1440000, `Rip file`);
              addVirtualFile('C:', 'Downloads', `${prefix}.r00`, 1440000, `Rip file r00`);
              addVirtualFile('C:', 'Downloads', `${prefix}.r01`, 1440000, `Rip file r01`);
            }

            setStatusLines(prev => [...prev, `*** DCC Get of ${dccFile} complete. Loaded all split parts, .sfv, .nfo and file_id.diz successfully to C:\\Downloads`]);
          } else {
            addVirtualFile('C:', 'Downloads', dccFile, targetSize, `Extracted Content of ${dccFile}`);
            setStatusLines(prev => [...prev, `*** DCC Get of ${dccFile} complete. Saved to C:\\Downloads`]);
          }

          setChannelLines(prev => [...prev, { type: 'system', text: `*** DCC Get of ${dccFile} complete.` }]);
          playSound('beep');
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [dccActive]);

  const handleConnect = () => {
    if (ircConnected || ircConnecting) return;

    if (!isInternetConnected) {
      playSound('beep');
      setStatusLines(prev => [
        ...prev,
        `*** Connecting to ${selectedNetwork}...`,
        `*** Error: No Dial-Up connection detected.`,
        `*** Please double-click "Dial-Up Networking" in My Computer and connect to internet first!`
      ]);
      return;
    }

    setIrcConnecting(true);
    setStatusLines(prev => [
      ...prev,
      `*** Connecting to ${selectedNetwork} server (irc.${selectedNetwork.toLowerCase()}.org:6667)...`,
    ]);

    setTimeout(() => {
      setStatusLines(prev => [
        ...prev,
        '*** Logging in as ' + nickName + '...',
        '*** Hostname resolved: dynamic-dialup-76.isp.net',
      ]);
    }, 1000);

    setTimeout(() => {
      setStatusLines(prev => [
        ...prev,
        '*** Welcome to ' + selectedNetwork + ' IRC Network!',
        `*** Mode +i ${nickName} successfully applied.`,
        `*** Autojoining channel ${selectedChannel}...`
      ]);
      setIrcConnected(true);
      setIrcConnecting(false);
      setActiveTab(selectedChannel);
      localStorage.setItem('win95_mirc_connected', 'true');
    }, 2500);
  };

  const handleDisconnect = () => {
    playSound('beep');
    setIrcConnected(false);
    setIrcConnecting(false);
    setActiveTab('status');
    localStorage.removeItem('win95_mirc_connected');
    setStatusLines(prev => [
      ...prev,
      '*** Disconnected by user.'
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (lastSentVal) {
        setInputVal(lastSentVal);
        setTimeout(() => {
          if (inputRef.current) {
            const len = lastSentVal.length;
            inputRef.current.setSelectionRange(len, len);
          }
        }, 10);
      }
    } else if (e.key === 'Enter') {
      handleInputSubmit(e);
    }
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter') {
      const val = inputVal.trim();
      if (!val) return;
      setLastSentVal(val);

      if (activeTab === 'status') {
        if (val.startsWith('/load -rs')) {
          setStatusLines(prev => [...prev, '*** Loaded remote script script.mrc. DCC speed patch active.']);
        } else if (val.startsWith('/fsend on')) {
          setStatusLines(prev => [...prev, '*** DCC fsend enabled.']);
        } else if (val.startsWith('/pdcc')) {
          setStatusLines(prev => [...prev, '*** DCC Packet size optimized.']);
        } else if (val.startsWith('/join ')) {
          const chan = val.split(' ')[1];
          setSelectedChannel(chan);
          setActiveTab(chan);
        } else {
          setStatusLines(prev => [...prev, `Unknown mIRC command: ${val}`]);
        }
      } else if (activeTab === selectedChannel) {
        const lowerVal = val.toLowerCase();
        if (val.startsWith('/me ')) {
          const action = val.substring(4);
          setChannelLines(prev => [...prev, { type: 'action', text: `* ${nickName} ${action}` }]);
        } else if (lowerVal === '!warezbot' || lowerVal === '!games' || lowerVal.includes('rzr_tech')) {
          setChannelLines(prev => [...prev, { type: 'chat', nick: nickName, text: val }]);
          setChannelLines(prev => [...prev, { type: 'system', text: '*** Requesting DCC Chat connection from RZR_Tech...' }]);
          playSound('beep');
          setDccInviteFrom('RZR_Tech');
          setShowDccInvite(true);
          localStorage.setItem('fserv_triggered', 'true');
        } else {
          setChannelLines(prev => [...prev, { type: 'chat', nick: nickName, text: val }]);
        }
      } else if (activeTab === 'fserv') {
        const cmdParts = val.split(' ');
        const mainCmd = cmdParts[0].toLowerCase();
        const arg = cmdParts.slice(1).join(' ').trim();
        
        const nextLines = [...fservLines, { nick: nickName, text: val }];

        if (mainCmd === 'dir' || mainCmd === 'ls') {
          if (fservPath === 'C:\\') {
            nextLines.push({ nick: 'RZR_Tech', text: 'Directory list for current folder (C:\\):' });
            nextLines.push({ nick: 'RZR_Tech', text: 'GAMES                  <DIR>          01-01-96  12:00p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'KEYGENS                <DIR>          01-01-96  12:00p' });
          } else if (fservPath === 'C:\\GAMES') {
            nextLines.push({ nick: 'RZR_Tech', text: 'Directory list for current folder (C:\\GAMES):' });
            nextLines.push({ nick: 'RZR_Tech', text: 'QUAKE_RZR              <DIR>          22-06-96  10:00a' });
            nextLines.push({ nick: 'RZR_Tech', text: 'REDALERT_CLS           <DIR>          22-11-96  11:15a' });
            nextLines.push({ nick: 'RZR_Tech', text: 'DIABLO_CND             <DIR>          31-12-96  11:59p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'STARCRAFT_CLS          <DIR>          04-02-98  04:00p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'HALFLIFE_DEV           <DIR>          19-11-98  09:30p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'UT_FLT                 <DIR>          24-11-99  02:00a' });
            nextLines.push({ nick: 'RZR_Tech', text: 'DEUSEX_MYTH            <DIR>          26-06-00  06:00p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'DOOM_FLT               <DIR>          10-12-93  06:00a' });
            nextLines.push({ nick: 'RZR_Tech', text: 'DUKE3D_PCP             <DIR>          29-01-96  12:00p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'WARCRAFT2_CLS          <DIR>          09-12-95  08:00p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'NFS_SCENE              <DIR>          31-08-95  04:00p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'SIMCITY2K              <DIR>          05-10-94  01:00p' });
            nextLines.push({ nick: 'RZR_Tech', text: 'CNC_REMIX              <DIR>          15-09-95  05:00p' });
          } else if (fservPath === 'C:\\KEYGENS') {
            nextLines.push({ nick: 'RZR_Tech', text: 'Directory list for current folder (C:\\KEYGENS):' });
            nextLines.push({ nick: 'RZR_Tech', text: 'WINZIP_DGT             <DIR>          12-05-97  03:00p' });
          } else {
            // Under folder - generate alignments
            const files = getFservDirectoryFiles(fservPath);
            nextLines.push({ nick: 'RZR_Tech', text: `Directory list for current folder (${fservPath}):` });
            Object.entries(files).forEach(([name, info]) => {
              const alignedName = name.padEnd(20, ' ');
              const alignedSize = String(info.size.toLocaleString()).padStart(12, ' ');
              nextLines.push({ nick: 'RZR_Tech', text: `${alignedName}  ${alignedSize} bytes   ${info.date}  12:00p` });
            });
          }
        } else if (mainCmd === 'cd') {
          const target = arg.toUpperCase();
          if (target === '..' || target === 'CD ..' || target === '..\\') {
            if (fservPath.startsWith('C:\\GAMES\\')) {
              setFservPath('C:\\GAMES');
              nextLines.push({ nick: 'RZR_Tech', text: 'Moving to parent directory: C:\\GAMES' });
            } else if (fservPath === 'C:\\GAMES' || fservPath === 'C:\\KEYGENS') {
              setFservPath('C:\\');
              nextLines.push({ nick: 'RZR_Tech', text: 'Moving to parent directory: C:\\' });
            } else if (fservPath.startsWith('C:\\KEYGENS\\')) {
              setFservPath('C:\\KEYGENS');
              nextLines.push({ nick: 'RZR_Tech', text: 'Moving to parent directory: C:\\KEYGENS' });
            } else {
              nextLines.push({ nick: 'RZR_Tech', text: 'Already at root directory.' });
            }
          } else if (target === 'GAMES' && fservPath === 'C:\\') {
            setFservPath('C:\\GAMES');
            nextLines.push({ nick: 'RZR_Tech', text: 'Navigated to C:\\GAMES' });
          } else if (target === 'KEYGENS' && fservPath === 'C:\\') {
            setFservPath('C:\\KEYGENS');
            nextLines.push({ nick: 'RZR_Tech', text: 'Navigated to C:\\KEYGENS' });
          } else if (fservPath === 'C:\\GAMES' && [
            'QUAKE_RZR', 'REDALERT_CLS', 'DIABLO_CND', 'STARCRAFT_CLS', 'HALFLIFE_DEV',
            'UT_FLT', 'DEUSEX_MYTH', 'DOOM_FLT', 'DUKE3D_PCP', 'WARCRAFT2_CLS', 'NFS_SCENE',
            'SIMCITY2K', 'CNC_REMIX'
          ].includes(target)) {
            setFservPath(`C:\\GAMES\\${target}`);
            nextLines.push({ nick: 'RZR_Tech', text: `Navigated to C:\\GAMES\\${target}` });
          } else if (fservPath === 'C:\\KEYGENS' && target === 'WINZIP_DGT') {
            setFservPath('C:\\KEYGENS\\WINZIP_DGT');
            nextLines.push({ nick: 'RZR_Tech', text: 'Navigated to C:\\KEYGENS\\WINZIP_DGT' });
          } else {
            nextLines.push({ nick: 'RZR_Tech', text: `Directory not found: ${arg}` });
          }
        } else if (mainCmd === 'get') {
          const targetFile = arg.toLowerCase();
          const files = getFservDirectoryFiles(fservPath);
          const isValid = files[targetFile] !== undefined;

          if (isValid) {
            nextLines.push({ nick: 'RZR_Tech', text: `[Added ${targetFile} to your queue. Position: 1]` });
            nextLines.push({ nick: 'RZR_Tech', text: `*** Sending DCC GET request for ${targetFile}...` });
            setDccFile(targetFile);
            setDccActive(true);
            setDccProgress(0);
          } else {
            nextLines.push({ nick: 'RZR_Tech', text: `File not found in this folder. Navigate into a release folder first and use "dir" to list files.` });
          }
        } else if (mainCmd === 'exit') {
          setActiveTab(selectedChannel);
          nextLines.push({ nick: 'System', text: '*** DCC Chat session closed.' });
        } else {
          nextLines.push({ nick: 'RZR_Tech', text: `Command not recognized: ${mainCmd}. Try dir, cd, get <file>, exit.` });
        }

        // Keep prompt trailing line
        nextLines.push({ nick: 'RZR_Tech', text: `${fservPath}>` });
        setFservLines(nextLines);
      }

      setInputVal('');
    }
  };

  const handleAcceptDccChat = () => {
    setShowDccInvite(false);
    setActiveTab('fserv');
    playSound('beep');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', color: '#00ffff', fontFamily: 'Courier New, monospace', fontSize: '12px', position: 'relative' }}>
      
      {/* Top mIRC Menu Bar */}
      <div className="win-menu-bar" style={{ display: 'flex', gap: '8px', padding: '2px 6px', borderBottom: '1px solid #808080', background: 'var(--win-gray)', color: '#000', fontFamily: 'var(--font-win)' }}>
        <div className="win-menu-item">File</div>
        <div className="win-menu-item">View</div>
        <div className="win-menu-item">DCC</div>
        <div className="win-menu-item">Commands</div>
        <div className="win-menu-item">Scripts</div>
        <div className="win-menu-item">Help</div>
      </div>

      {/* Connection Buttons Bar */}
      <div style={{ display: 'flex', gap: '6px', padding: '4px 6px', borderBottom: '1px solid #808080', background: 'var(--win-gray)', alignItems: 'center', color: '#000', fontFamily: 'var(--font-win)' }}>
        {ircConnected ? (
          <button className="win-btn" onClick={handleDisconnect} style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
            <span>⚡</span> Disconnect
          </button>
        ) : (
          <button className="win-btn" onClick={handleConnect} disabled={ircConnecting} style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '11px' }}>
            <span>⚡</span> Connect
          </button>
        )}
        
        <div style={{ width: '1px', height: '16px', background: '#808080', margin: '0 4px' }} />

        <span style={{ fontSize: '10px' }}>Network:</span>
        <select 
          value={selectedNetwork} 
          onChange={(e) => setSelectedNetwork(e.target.value)}
          disabled={ircConnected || ircConnecting}
          style={{ background: '#fff', fontSize: '10px', height: '20px', padding: '0 2px' }}
        >
          <option>UnderNet</option>
          <option>DALnet</option>
          <option>EFnet</option>
          <option>IRCNet</option>
        </select>

        <span style={{ fontSize: '10px', marginLeft: '4px' }}>Room:</span>
        <select 
          value={selectedChannel} 
          onChange={(e) => setSelectedChannel(e.target.value)}
          disabled={ircConnected || ircConnecting}
          style={{ background: '#fff', fontSize: '10px', height: '20px', padding: '0 2px' }}
        >
          <option>#warez-classic</option>
          <option>#win95</option>
          <option>#novice</option>
        </select>

        <span style={{ fontSize: '10px', marginLeft: '4px' }}>Nick:</span>
        <input 
          type="text" 
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          disabled={ircConnected || ircConnecting}
          style={{ width: '60px', height: '20px', fontSize: '10px', background: '#fff', border: '1px solid #808080', padding: '0 4px' }}
        />
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', background: '#ccc', padding: '2px 2px 0 2px', borderBottom: '2px solid var(--win-dark-gray)', gap: '2px', color: '#000', fontFamily: 'var(--font-win)' }}>
        <button 
          className={`win-btn ${activeTab === 'status' ? 'pressed' : ''}`} 
          style={{ padding: '2px 10px', fontSize: '11px' }} 
          onClick={() => setActiveTab('status')}
        >
          Status
        </button>
        {ircConnected && (
          <button 
            className={`win-btn ${activeTab === selectedChannel ? 'pressed' : ''}`} 
            style={{ padding: '2px 10px', fontSize: '11px' }} 
            onClick={() => setActiveTab(selectedChannel)}
          >
            {selectedChannel}
          </button>
        )}
        {activeTab === 'fserv' && (
          <button 
            className="win-btn pressed" 
            style={{ padding: '2px 10px', fontSize: '11px' }} 
          >
            DCC Chat ({dccInviteFrom || 'RZR_Tech'})
          </button>
        )}
        {completedMissions.length >= 10 && (
          <button 
            className={`win-btn ${activeTab === 'studio' ? 'pressed' : ''}`} 
            style={{ padding: '2px 10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#ffe0e0' }} 
            onClick={() => setActiveTab('studio')}
          >
            📜 Scripting Studio
          </button>
        )}
      </div>

      {/* Main Content Pane */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        
        {/* Chat / Terminal log window (Cloudz Script layout colors) */}
        {activeTab !== 'studio' ? (
          <div 
            ref={chatContainerRef}
            className="win-inset" 
            style={{ 
              flex: 1, 
              backgroundColor: '#1e1e1e', 
              color: '#ffffff', 
              fontFamily: 'Courier New, monospace', 
              padding: '8px', 
              overflowY: 'auto', 
              fontSize: '12px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '2px', 
              textAlign: 'left',
              userSelect: 'text',
              WebkitUserSelect: 'text',
              msUserSelect: 'text',
              cursor: 'text'
            }}
          >
            {activeTab === 'status' && statusLines.map((line, idx) => {
              let color = '#3399ff'; // electric blue for status details
              if (line.includes('Error') || line.includes('Please connect')) color = '#ff3333';
              else if (line.includes('Welcome') || line.includes('Autojoining')) color = '#00ffff';
              return <p key={idx} style={{ margin: 0, color, userSelect: 'text' }}>{line}</p>;
            })}
            
            {ircConnected && activeTab === selectedChannel && channelLines.map((line, idx) => {
              if (line.type === 'topic' || line.type === 'system') {
                return <p key={idx} style={{ margin: 0, color: '#ff00ff', userSelect: 'text' }}>{line.text}</p>; // Magenta for alerts
              }
              if (line.type === 'join') {
                return <p key={idx} style={{ margin: 0, color: '#00ff00', userSelect: 'text' }}>{line.text}</p>; // Green for joins
              }
              if (line.type === 'part' || line.type === 'kick') {
                return <p key={idx} style={{ margin: 0, color: '#ff3333', userSelect: 'text' }}>{line.text}</p>; // Red for parts
              }
              if (line.type === 'action') {
                return <p key={idx} style={{ margin: 0, color: '#ff00ff', fontWeight: 'bold', userSelect: 'text' }}>{line.text}</p>;
              }
              
              // Standard Chat
              const isGuest = line.nick === nickName;
              const prefix = line.ops ? '@' : line.voiced ? '+' : '';
              const nickColor = line.ops ? '#00ffff' : isGuest ? '#ffffff' : '#3399ff';
              return (
                <p key={idx} style={{ margin: 0, color: '#ffffff', userSelect: 'text' }}>
                  <span style={{ color: nickColor, userSelect: 'text' }}>&lt;{prefix}{line.nick}&gt;</span> {line.text}
                </p>
              );
            })}

            {activeTab === 'fserv' && fservLines.map((line, idx) => {
              const isSelf = line.nick === nickName;
              const isSystem = line.nick === 'System';
              const color = isSystem ? '#ff00ff' : isSelf ? '#ffffff' : '#00ffff';
              return (
                <p key={idx} style={{ margin: 0, color, userSelect: 'text' }}>
                  {!isSystem && <span style={{ fontWeight: 'bold' }}>&lt;{line.nick}&gt; </span>}
                  {line.text}
                </p>
              );
            })}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div style={{ flex: 1, backgroundColor: 'var(--win-gray)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', color: '#000', fontFamily: 'var(--font-win)' }}>
            <div style={{ background: '#000080', color: '#fff', padding: '4px', fontWeight: 'bold', fontSize: '11px' }}>
              📜 mIRC Scripts & Ping-Nuke Control Center
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span>Target:</span>
              <input type="text" className="win-input" style={{ width: '80px', background: '#fff' }} value={studioTarget} onChange={(e) => setStudioTarget(e.target.value)} />
              
              <span>Action:</span>
              <select value={studioActionType} onChange={(e) => setStudioActionType(e.target.value)} style={{ background: '#fff' }}>
                <option value="nuke">💥 Ping-Nuke Flood</option>
                <option value="chat">💬 Text Flood Chat</option>
              </select>

              <button className="win-btn" onClick={handleRunStudioScript} disabled={studioRunning} style={{ fontWeight: 'bold', padding: '2px 8px' }}>
                Run Script
              </button>
            </div>

            {studioRunning && (
              <div className="win-outset" style={{ padding: '6px', background: '#ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '9px' }}>
                  <span>Flooding: {studioTarget}</span>
                  <span>{studioProgress}%</span>
                </div>
                <div className="win-inset" style={{ height: '12px', background: '#fff', overflow: 'hidden' }}>
                  <div style={{ width: `${studioProgress}%`, height: '100%', background: '#800000' }} />
                </div>
              </div>
            )}

            <div className="win-inset" style={{ flex: 1, background: '#000', color: '#0f0', fontFamily: 'monospace', padding: '8px', overflowY: 'auto', fontSize: '10px' }}>
              {studioLines.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        )}

        {/* User list sidebar for Channel view */}
        {ircConnected && activeTab === selectedChannel && activeTab !== 'studio' && (
          <div 
            className="win-inset" 
            style={{ 
              width: '120px', 
              backgroundColor: '#1e1e1e', 
              color: '#3399ff', 
              fontFamily: 'Courier New, monospace', 
              overflowY: 'auto', 
              padding: '4px', 
              display: 'flex', 
              flexDirection: 'column', 
              textAlign: 'left',
              borderLeft: '2px solid var(--win-dark-gray)'
            }}
          >
            {users.map(u => {
              const prefix = u.ops ? '@' : u.voiced ? '+' : ' ';
              const style = u.ops ? { color: '#00ffff', fontWeight: 'bold' } : u.voiced ? { color: '#ff00ff' } : { color: '#ffffff' };
              return (
                <div key={u.nick} style={{ ...style, fontSize: '11px', display: 'flex', gap: '2px', cursor: 'default' }}>
                  <span style={{ color: '#888' }}>{prefix}</span>
                  <span>{u.nick === 'Guest' ? nickName : u.nick}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DCC Progress Panel */}
      {dccActive && (
        <div className="win-outset" style={{ padding: '8px', margin: '4px', background: 'var(--win-gray)', fontSize: '11px', color: '#000', fontFamily: 'var(--font-win)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span><strong>DCC GET:</strong> {dccFile} from {dccInviteFrom || 'RZR_Tech'}</span>
            <span>{(dccSpeed / 1024).toFixed(1)} KB/s</span>
          </div>
          <div className="win-inset" style={{ height: '18px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: `${dccProgress}%`, height: '100%', background: 'var(--win-blue)' }} />
            <span style={{ position: 'absolute', width: '100%', textAlign: 'center', left: 0, top: 1, color: dccProgress > 50 ? '#fff' : '#000', fontWeight: 'bold', fontSize: '10px' }}>
              {Math.round(dccProgress)}% Complete
            </span>
          </div>
        </div>
      )}

      {/* DCC Chat Request Invite Dialog Modal Box */}
      {showDccInvite && (
        <div className="win-window win-outset active-window" style={{ position: 'absolute', left: '10%', top: '25%', width: '80%', zIndex: 9999999, padding: '10px', background: 'var(--win-gray)', color: '#000', fontFamily: 'var(--font-win)' }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #808080', paddingBottom: '4px', marginBottom: '8px', textAlign: 'left' }}>
            mIRC DCC Chat Request
          </div>
          <p style={{ textAlign: 'left', fontSize: '11px', marginBottom: '12px' }}>
            DCC Chat connection invitation received from <strong>{dccInviteFrom}</strong> (192.168.12.1). Do you want to accept?
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button className="win-btn" onClick={handleAcceptDccChat} style={{ fontWeight: 'bold', minWidth: '60px' }}>Accept</button>
            <button className="win-btn" onClick={() => setShowDccInvite(false)} style={{ minWidth: '60px' }}>Decline</button>
          </div>
        </div>
      )}

      {/* Input box */}
      <div style={{ display: 'flex', padding: '4px', gap: '4px', background: 'var(--win-gray)' }}>
        <input 
          ref={inputRef}
          type="text" 
          value={inputVal} 
          onChange={(e) => setInputVal(e.target.value)} 
          onKeyDown={handleKeyDown}
          disabled={(!ircConnected && activeTab !== 'fserv') || activeTab === 'studio'}
          placeholder={
            activeTab === 'studio'
              ? 'Scripting Console active...'
              : !ircConnected 
                ? 'Click Connect to start IRC...' 
                : activeTab === 'fserv' 
                  ? 'Type command (dir, cd GAMES, get doom.zip.001, exit)...' 
                  : activeTab === selectedChannel 
                    ? 'Type message (or type "!games" to trigger DCC Chat fserv)...' 
                    : 'Type command (/join #room)...'
          } 
          className="win-input" 
          style={{ flex: 1, fontSize: '12px', background: '#fff', color: '#000' }}
        />
        <button className="win-btn" onClick={() => handleKeyDown({ key: 'Enter' })} disabled={(!ircConnected && activeTab !== 'fserv') || activeTab === 'studio'} style={{ color: '#000' }}>Send</button>
      </div>
    </div>
  );
}
