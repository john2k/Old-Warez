import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function NetbusWindow() {
  const { completedMissions, playSound, addVirtualFile } = useContext(HardwareContext);
  const [targetIp, setTargetIp] = useState('192.168.10.45');
  const [isConnected, setIsConnected] = useState(false);
  const [log, setLog] = useState(['NetBus 1.70 ready.']);
  const [activeSubTab, setActiveSubTab] = useState('actions'); // actions, scripting
  const [showScreenshotPreview, setShowScreenshotPreview] = useState(false);

  // Scripting editor states
  const [scriptCode, setScriptCode] = useState(`eject_cd;\ninvert_mouse;\nmelt_screen;`);
  const [scriptLog, setScriptLog] = useState(['Trojan Script Editor Ready.']);
  const [scriptRunning, setScriptRunning] = useState(false);

  const handleConnect = () => {
    if (!targetIp) return;
    setLog(prev => [...prev, `Connecting to ${targetIp} on port 12345...`]);
    setTimeout(() => {
      setIsConnected(true);
      setLog(prev => [...prev, `Successfully connected! Victim is running Windows 95 OSR2.`]);
    }, 1500);
  };

  const triggerAction = (action) => {
    if (!isConnected) return;
    setLog(prev => [...prev, `Sending command: ${action}`]);
    setTimeout(() => {
      if (action === 'Open CD-ROM') {
        setLog(prev => [...prev, `Response: Victim CD-ROM tray opened successfully.`]);
        localStorage.setItem('netbus_cdrom_ejected', 'true');
        alert('TROJAN PAYLOAD TRIGGERED:\n\nVictim CD-ROM drive bezel tray ejected successfully!');
      } else if (action === 'Invert Mouse') {
        setLog(prev => [...prev, `Response: Victim mouse coordinates inverted.`]);
        const current = localStorage.getItem('netbus_mouse_inverted') === 'true';
        localStorage.setItem('netbus_mouse_inverted', String(!current));
      } else if (action === 'Play Sound') {
        playSound('beep');
        setTimeout(() => playSound('beep'), 120);
        setTimeout(() => playSound('beep'), 240);
        setLog(prev => [...prev, `Response: Played 'Beep' sound sequence on victim's PC Speaker.`]);
        localStorage.setItem('netbus_audio_played', 'true');
      } else if (action === 'Grab Screenshot') {
        addVirtualFile('C:', 'Downloads', 'victim_screen.bmp', 450000, 'BITMAP COLOR TABLE DATA\nWIDTH: 640\nHEIGHT: 480\nDEPTH: 8bpp\n\nHacked by NetBus.');
        setLog(prev => [...prev, `Response: Screen capture transferred. Saved to C:\\Downloads\\victim_screen.bmp.`]);
        localStorage.setItem('netbus_screenshot_taken', 'true');
        setShowScreenshotPreview(true);
      } else if (action === 'Nuke Target') {
        setLog(prev => [...prev, `Response: Sent Blue Screen of Death packet. Victim crashed!`]);
        localStorage.setItem('netbus_nuked', 'true');
      }
    }, 800);
  };

  const handleRunScript = () => {
    if (scriptRunning) return;
    setScriptRunning(true);
    setScriptLog(['[Script Parser] Compiling token streams...']);
    playSound('beep');

    setTimeout(() => {
      setScriptLog(prev => [...prev, '[Script Parser] Execution started. Scanning lines...']);
      
      const commands = scriptCode.split('\n').map(c => c.trim()).filter(Boolean);
      let idx = 0;
      
      const runNext = () => {
        if (idx < commands.length) {
          const cmd = commands[idx];
          setScriptLog(prev => [...prev, `[Trojan Exec] running command: ${cmd}`]);
          playSound('floppy');
          idx++;
          setTimeout(runNext, 400);
        } else {
          setScriptRunning(false);
          setScriptLog(prev => [...prev, '[SUCCESS] Trojan Script completed all pranks successfully!', '[System] netbus_script_run flag unlocked.']);
          localStorage.setItem('netbus_script_run', 'true');
          playSound('beep');
        }
      };

      setTimeout(runNext, 500);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '12px', color: '#000', fontFamily: 'var(--font-win)' }}>
      
      {/* Title Header */}
      <div style={{ background: '#800000', color: '#fff', padding: '4px', fontWeight: 'bold', borderBottom: '2px solid var(--win-dark-gray)', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
        <span>NetBus 1.70 - Hack Tool Coordinator</span>
        <span>Victim Status: {isConnected ? 'Connected' : 'Offline'}</span>
      </div>

      {/* Sub tabs */}
      <div style={{ display: 'flex', background: '#ccc', padding: '2px 2px 0 2px', gap: '2px', borderBottom: '2px solid var(--win-dark-gray)', marginTop: '4px' }}>
        <button className={`win-btn ${activeSubTab === 'actions' ? 'pressed' : ''}`} style={{ fontSize: '11px', padding: '2px 10px' }} onClick={() => setActiveSubTab('actions')}>
          Remote Control
        </button>
        {completedMissions.length >= 15 && (
          <button className={`win-btn ${activeSubTab === 'scripting' ? 'pressed' : ''}`} style={{ fontSize: '11px', padding: '2px 10px', fontWeight: 'bold', backgroundColor: '#e0ffe0' }} onClick={() => setActiveSubTab('scripting')}>
            📝 Trojan Script Editor
          </button>
        )}
      </div>

      {activeSubTab === 'actions' ? (
        <div style={{ display: 'flex', flex: 1, gap: '6px', marginTop: '8px', overflow: 'hidden' }}>
          {/* Actions panel left */}
          <div className="win-outset" style={{ width: '130px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#ccc' }}>
            <strong>Fun Actions:</strong>
            <button className="win-btn" onClick={() => triggerAction('Open CD-ROM')} disabled={!isConnected}>Open CD-ROM</button>
            <button className="win-btn" onClick={() => triggerAction('Invert Mouse')} disabled={!isConnected}>Invert Mouse</button>
            <button className="win-btn" onClick={() => triggerAction('Play Sound')} disabled={!isConnected}>Play Sound</button>
            <button className="win-btn" onClick={() => triggerAction('Grab Screenshot')} disabled={!isConnected}>Grab Screenshot</button>
            <button className="win-btn" onClick={() => triggerAction('Nuke Target')} disabled={!isConnected} style={{ color: 'red', fontWeight: 'bold' }}>Nuke Target</button>
          </div>

          {/* Console / Connection status */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Target IP entry */}
            <div className="win-outset" style={{ padding: '8px', display: 'flex', gap: '8px', alignItems: 'center', background: '#ccc' }}>
              <span>Target IP:</span>
              <input 
                type="text" 
                value={targetIp} 
                onChange={(e) => setTargetIp(e.target.value)} 
                className="win-input" 
                style={{ width: '110px', background: '#fff' }} 
                disabled={isConnected}
              />
              <button className="win-btn" onClick={isConnected ? () => setIsConnected(false) : handleConnect}>
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {/* Console logger & Screenshot Split */}
            <div style={{ flex: 1, display: 'flex', gap: '6px', minHeight: 0 }}>
              <div className="win-inset" style={{ flex: 2, backgroundColor: '#000', color: '#ff3333', fontFamily: 'monospace', padding: '6px', overflowY: 'auto', fontSize: '11px', textAlign: 'left' }}>
                {log.map((line, idx) => <p key={idx} style={{ margin: 0 }}>{line}</p>)}
              </div>
              {showScreenshotPreview && (
                <div className="win-inset" style={{ flex: 1.2, backgroundColor: '#808080', border: '2px dashed #000', padding: '4px', display: 'flex', flexDirection: 'column', color: '#000', fontSize: '10px', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: '110px' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#000080', color: '#fff', padding: '2px', fontWeight: 'bold', textAlign: 'center', fontSize: '9px' }}>
                    SCREENSHOT CAPTURE
                  </div>
                  <div style={{ width: '90%', height: '70%', border: '1px solid #000', background: '#008080', marginTop: '14px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2px' }}>
                    {/* Tiny desktop mockup */}
                    <div style={{ fontSize: '6px', color: '#fff', position: 'absolute', top: '4px', left: '2px' }}>[My Computer]</div>
                    <div style={{ fontSize: '7px', color: '#ff0', fontWeight: 'bold', textAlign: 'center', width: '100%', position: 'absolute', top: '15px' }}>HACKED BY NETBUS</div>
                    <div style={{ width: '100%', height: '8px', background: '#c0c0c0', borderTop: '1px solid #fff', display: 'flex', alignItems: 'center', fontSize: '6px', padding: '1px' }}>
                      <span style={{ fontWeight: 'bold', borderRight: '1px solid #808080', paddingRight: '2px', marginRight: '2px' }}>Start</span>
                      <span>12:00</span>
                    </div>
                  </div>
                  <button className="win-btn" onClick={() => setShowScreenshotPreview(false)} style={{ fontSize: '8px', marginTop: '2px', padding: '1px 3px' }}>Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, gap: '6px', marginTop: '8px', overflow: 'hidden' }}>
          {/* Script Editor Pane */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span>Edit Trojan Prank Script (one instruction per line):</span>
            <textarea 
              className="win-input" 
              style={{ flex: 1, resize: 'none', background: '#fff', color: '#000', fontFamily: 'monospace', fontSize: '11px' }}
              value={scriptCode}
              onChange={(e) => setScriptCode(e.target.value)}
              disabled={scriptRunning}
            />
            <button className="win-btn" onClick={handleRunScript} disabled={scriptRunning} style={{ fontWeight: 'bold' }}>
              Run Script on Victim
            </button>
          </div>
          
          {/* Script log pane */}
          <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>Output Console:</span>
            <div className="win-inset" style={{ flex: 1, backgroundColor: '#000', color: '#00ff00', fontFamily: 'monospace', padding: '6px', overflowY: 'auto', fontSize: '10px', textAlign: 'left' }}>
              {scriptLog.map((line, idx) => <div key={idx}>{line}</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
