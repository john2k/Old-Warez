import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function BbsTerminal() {
  const { hardware, playSound, addVirtualFile } = useContext(HardwareContext);
  const [terminalLines, setTerminalLines] = useState([
    'Welcome to Microsoft Terminal 4.0',
    'Ready. Type "dial 555-8839" to connect to The Keep BBS.'
  ]);
  const [connectionState, setConnectionState] = useState('disconnected'); // disconnected, dialing, connected
  const [inputVal, setInputVal] = useState('');
  const [bbsMenu, setBbsMenu] = useState('main'); // main, file-area, games
  
  useEffect(() => {
    if (connectionState === 'connected') {
      localStorage.setItem('bbs_connected', 'true');
      localStorage.setItem('bbs_menu_state', bbsMenu);
    } else {
      localStorage.removeItem('bbs_connected');
      localStorage.removeItem('bbs_menu_state');
    }
  }, [connectionState, bbsMenu]);
  
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLines]);

  const handleDial = (number) => {
    setConnectionState('dialing');
    setTerminalLines(prev => [...prev, `Dialing ${number}...`, 'Carrier detected. Connecting...']);
    playSound('dialup');

    setTimeout(() => {
      setConnectionState('connected');
      setTerminalLines(prev => [
        ...prev,
        '==================================================',
        '       WELCOME TO THE KEEP BBS - RETRO SCENE       ',
        '      Running on Wildcat! BBS v5.0, since 1994      ',
        '==================================================',
        'Commands: [F]iles, [D]oor Games, [O]ffline, [H]elp',
        'BBS_MAIN_MENU>'
      ]);
    }, 3000);
  };

  const handleCommandSubmit = (e) => {
    if (e.key === 'Enter') {
      const val = inputVal.trim().toLowerCase();
      if (!val) return;

      const lines = [...terminalLines, `BBS_SHELL&gt; ${inputVal}`];

      if (connectionState === 'disconnected') {
        if (val.startsWith('dial ')) {
          const num = val.substring(5);
          handleDial(num);
        } else {
          lines.push(`Unknown command: '${val}'. Try: dial 555-8839`);
        }
      } else if (connectionState === 'connected') {
        if (val === 'f' || val === 'files') {
          lines.push('');
          lines.push('--- KEEP BBS DOWNLOAD VAULT ---');
          lines.push('1. wz62-dgt.rar      - WinZip 6.2 Keygen bundle (1.2MB, multi-part RAR)');
          lines.push('2. happy99.exe       - Holiday fireworks screensaver! (230KB)');
          lines.push('3. fprot_scan.zip    - F-Prot virus signatures update (600KB)');
          lines.push('Select number [1-3] or type [B]ack:');
          setBbsMenu('file-area');
        } else if (val === 'd' || val === 'doors') {
          lines.push('');
          lines.push('--- Door Games Area ---');
          lines.push('1. Legend of the Red Dragon (LORD) - Node 1');
          lines.push('2. TradeWars 2002 - Node 2');
          lines.push('Select [1-2] or [B]ack:');
          setBbsMenu('games');
        } else if (val === 'o' || val === 'offline' || val === 'exit') {
          setConnectionState('disconnected');
          setBbsMenu('main');
          lines.push('*** Carrier lost. Connection closed.');
          lines.push('A:\\>');
        } else if (bbsMenu === 'file-area') {
          if (val === '1') {
            lines.push('STATUS:> Initiating ZMODEM download of wz62-dgt.rar...');
            setTimeout(() => {
              addVirtualFile('C:', 'Downloads', 'wz62-dgt.rar', 1200000, 'RAR archive contents');
              addVirtualFile('C:', 'Downloads', 'wz62-dgt.r00', 1200000, 'RAR part 00');
              addVirtualFile('C:', 'Downloads', 'wz62-dgt.r01', 1200000, 'RAR part 01');
              addVirtualFile('C:', 'Downloads', 'wz62-dgt.sfv', 250, '; sfv file\nwz62-dgt.rar A5C392B1\nwz62-dgt.r00 B211D4E0\nwz62-dgt.r01 F33C8B90');
              addVirtualFile('C:', 'Downloads', 'wz62-dgt.nfo', 2100, `[RELEASE INFO]\nGroup: DGT\nType: Utility / Keygen\n\nInstall Notes:\n1. Unpack RARs\n2. Run keygen.exe\n3. Enjoy!`);
              addVirtualFile('C:', 'Downloads', 'file_id.diz', 400, `[WINZIP 6.2 DGT]\nRelease of WinZip 6.2 keygen bundle.\nBrought to you by DGT.`);
              setTerminalLines(prev => [...prev, 'ZMODEM transfer complete. Saved wz62-dgt.rar and all parts (.rar, .r00, .r01, .sfv, .nfo, file_id.diz) to C:\\Downloads.']);
              playSound('beep');
            }, 2000);
          } else if (val === '2') {
            lines.push('STATUS:> Initiating ZMODEM download of happy99.exe...');
            setTimeout(() => {
              addVirtualFile('C:', 'Downloads', 'happy99.exe', 230000, 'Happy99 installer payload');
              setTerminalLines(prev => [...prev, 'ZMODEM transfer complete. Warning: run at your own risk!']);
              playSound('beep');
            }, 2000);
          } else if (val === '3') {
            lines.push('STATUS:> Initiating ZMODEM download of fprot_scan.zip...');
            setTimeout(() => {
              addVirtualFile('C:', 'Downloads', 'fprot_scan.zip', 600000, 'F-Prot Virus scanner signatures updates');
              setTerminalLines(prev => [...prev, 'ZMODEM download complete.']);
              playSound('beep');
            }, 2000);
          } else if (val === 'b' || val === 'back') {
            setBbsMenu('main');
            lines.push('Returning to Main Menu.');
          } else {
            lines.push('Invalid selection.');
          }
        } else if (bbsMenu === 'games') {
          if (val === '1') {
            lines.push('Entering LORD... You are attacked by a forest goblin!');
            lines.push('Slashed goblin for 12 damage. You earned 4 gold.');
          } else if (val === 'b' || val === 'back') {
            setBbsMenu('main');
            lines.push('Returning to Main Menu.');
          } else {
            lines.push('Invalid selection.');
          }
        } else {
          lines.push('Commands: [F]iles, [D]oor Games, [O]ffline');
        }
      }

      setTerminalLines(lines);
      setInputVal('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#000', color: '#00ff00', fontFamily: 'monospace', padding: '10px', fontSize: '12px' }}>
      {/* Console area */}
      <div className="win-inset" style={{ flex: 1, backgroundColor: '#050505', padding: '6px', overflowY: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {terminalLines.map((line, idx) => <p key={idx}>{line}</p>)}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', borderTop: '1px solid #333', padding: '4px 0', alignItems: 'center', gap: '4px' }}>
        <span>&gt;</span>
        <input 
          type="text" 
          value={inputVal} 
          onChange={(e) => setInputVal(e.target.value)} 
          onKeyDown={handleCommandSubmit}
          placeholder={connectionState === 'disconnected' ? 'dial 555-8839' : 'Type choice...'} 
          style={{ background: 'transparent', border: 'none', outline: 'none', color: '#00ff00', fontFamily: 'monospace', fontSize: '13px', flex: 1 }}
        />
        <button className="win-btn" onClick={() => handleCommandSubmit({ key: 'Enter' })} style={{ color: '#0f0', borderColor: '#0f0', background: '#000', padding: '1px 8px' }}>Enter</button>
      </div>
    </div>
  );
}
