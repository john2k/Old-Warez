import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function Subseven() {
  const { playSound, addVirtualFile } = useContext(HardwareContext);
  const [targetIp, setTargetIp] = useState('192.168.12.87');
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('connect'); // connect, keys, chat, pranks
  const [log, setLog] = useState(['SubSeven v2.1 MuRe... Init.']);
  const [keyboardFeed, setKeyboardFeed] = useState([
    '[SYSTEM] Keylogger Hook Installed.',
    '[13:42:05] User opened Explorer.exe',
    '[13:42:12] User typed: cd games',
    '[13:42:25] User typed: format a: /q'
  ]);
  
  // Pranks State (synced to localstorage to trigger desktop changes)
  const [swapButtons, setSwapButtons] = useState(localStorage.getItem('sub7_swap_buttons') === 'true');
  const [hideTaskbar, setHideTaskbar] = useState(localStorage.getItem('sub7_hide_taskbar') === 'true');
  const [hideIcons, setHideIcons] = useState(localStorage.getItem('sub7_hide_icons') === 'true');

  // Chat window state
  const [chatLog, setChatLog] = useState([
    { sender: 'Hacker', text: 'You have been compromised by SubSeven!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleConnect = () => {
    if (!targetIp) return;
    setLog(prev => [...prev, `Resolving socket handshake with ${targetIp}:1243...`]);
    playSound('dialup');
    setTimeout(() => {
      setIsConnected(true);
      setLog(prev => [...prev, `Connected! Sub7 Server v2.1 active. OS: Windows 95 OSR2`]);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setLog(prev => [...prev, 'Disconnected from server.']);
  };

  // Keyboard spy simulation
  useEffect(() => {
    if (!isConnected || activeTab !== 'keys') return;
    
    // Auto-generate some dummy keys being typed on target system
    const phrases = [
      'admin123',
      'nicos_nfo_file.doc',
      'rzr_rules_the_scene',
      'format c: /autotest',
      'help_topics.hlp',
      'subseven_reaper'
    ];
    
    const interval = setInterval(() => {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      const time = new Date().toLocaleTimeString();
      setKeyboardFeed(prev => [
        ...prev,
        `[${time}] Key capture: ${randomPhrase}`
      ]);
      playSound('beep');
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, activeTab]);

  // Handle Prank toggles
  const handleTogglePrank = (type) => {
    if (!isConnected) return;
    playSound('beep');
    if (type === 'swap') {
      const next = !swapButtons;
      setSwapButtons(next);
      localStorage.setItem('sub7_swap_buttons', String(next));
      setLog(prev => [...prev, `[Prank] Mouse button swap set to: ${next}`]);
      alert(`[Sub7 Payloads] Swapping victim mouse buttons. Left clicks now act as Right clicks.`);
    } else if (type === 'taskbar') {
      const next = !hideTaskbar;
      setHideTaskbar(next);
      localStorage.setItem('sub7_hide_taskbar', String(next));
      setLog(prev => [...prev, `[Prank] Taskbar visibility toggled. Hidden: ${next}`]);
    } else if (type === 'icons') {
      const next = !hideIcons;
      setHideIcons(next);
      localStorage.setItem('sub7_hide_icons', String(next));
      setLog(prev => [...prev, `[Prank] Desktop icons visibility toggled. Hidden: ${next}`]);
    }
  };

  useEffect(() => {
    const checkVictimReply = () => {
      const reply = localStorage.getItem('sub7_victim_reply');
      if (reply) {
        localStorage.removeItem('sub7_victim_reply');
        setChatLog(prev => [
          ...prev,
          { sender: 'Victim', text: reply }
        ]);
        playSound('beep');
      }
    };
    const timer = setInterval(checkVictimReply, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    
    const playerMsg = { sender: 'Hacker', text: chatInput };
    setChatLog(prev => [...prev, playerMsg]);
    
    localStorage.setItem('sub7_chat_active', 'true');
    localStorage.setItem('sub7_last_chat_msg', chatInput);
    
    setChatInput('');
    playSound('beep');

    setTimeout(() => {
      const responses = [
        'Who is this? How are you typing on my screen??',
        'Please leave my computer alone, I have school homework to finish!',
        'Is this a virus? I am running F-Prot scan right now!',
        'No, please do not delete my C:\\ drive!',
        'Leave me alone!'
      ];
      const botMsg = {
        sender: 'Victim',
        text: responses[Math.floor(Math.random() * responses.length)]
      };
      setChatLog(prev => [...prev, botMsg]);
      playSound('beep');
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#141414', color: '#00ff00', fontFamily: 'monospace', fontSize: '11px', textAlign: 'left' }}>
      
      {/* 1. Left side controls tabs */}
      <div style={{ width: '110px', background: '#0a0a0a', borderRight: '2px solid #333', display: 'flex', flexDirection: 'column', padding: '6px', gap: '4px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffff00', borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '6px', textAlign: 'center', textShadow: '0 0 5px #ff0' }}>
          SUBSEVEN 2.1
        </div>
        <button 
          onClick={() => setActiveTab('connect')} 
          style={{ width: '100%', padding: '4px', background: activeTab === 'connect' ? '#00ff00' : '#222', color: activeTab === 'connect' ? '#000' : '#00ff00', border: '1px solid #00ff00', cursor: 'default', fontFamily: 'monospace', fontWeight: 'bold' }}
        >
          Connection
        </button>
        <button 
          onClick={() => setActiveTab('keys')} 
          disabled={!isConnected}
          style={{ width: '100%', padding: '4px', background: activeTab === 'keys' ? '#00ff00' : '#222', color: activeTab === 'keys' ? '#000' : '#00ff00', border: '1px solid #00ff00', opacity: isConnected ? 1 : 0.4, cursor: 'default', fontFamily: 'monospace', fontWeight: 'bold' }}
        >
          Keylogger
        </button>
        <button 
          onClick={() => setActiveTab('chat')} 
          disabled={!isConnected}
          style={{ width: '100%', padding: '4px', background: activeTab === 'chat' ? '#00ff00' : '#222', color: activeTab === 'chat' ? '#000' : '#00ff00', border: '1px solid #00ff00', opacity: isConnected ? 1 : 0.4, cursor: 'default', fontFamily: 'monospace', fontWeight: 'bold' }}
        >
          Victim Chat
        </button>
        <button 
          onClick={() => setActiveTab('pranks')} 
          disabled={!isConnected}
          style={{ width: '100%', padding: '4px', background: activeTab === 'pranks' ? '#00ff00' : '#222', color: activeTab === 'pranks' ? '#000' : '#00ff00', border: '1px solid #00ff00', opacity: isConnected ? 1 : 0.4, cursor: 'default', fontFamily: 'monospace', fontWeight: 'bold' }}
        >
          Pranks List
        </button>

        {/* Status info indicator */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '6px', fontSize: '9px', color: '#ffcc00' }}>
          STATUS:<br/>
          {isConnected ? '⚡ ONLINE' : '❌ OFFLINE'}
        </div>
      </div>

      {/* 2. Main working content view */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px', minHeight: 0 }}>
        
        {activeTab === 'connect' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <strong>Establish Connection Node:</strong>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span>Victim IP:</span>
              <input 
                type="text" 
                value={targetIp} 
                onChange={(e) => setTargetIp(e.target.value)} 
                disabled={isConnected}
                style={{ background: '#000', color: '#00ff00', border: '1px solid #00ff00', padding: '3px', fontFamily: 'monospace', fontSize: '11px', flex: 1 }}
              />
              <button 
                onClick={isConnected ? handleDisconnect : handleConnect}
                style={{ background: '#222', color: '#00ff00', border: '1px solid #00ff00', padding: '3px 10px', fontFamily: 'monospace', cursor: 'default' }}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {/* Subseven controller logs */}
            <div style={{ flex: 1, border: '1px solid #333', background: '#000', padding: '6px', height: '140px', overflowY: 'auto', fontSize: '10px', color: '#ffcc00' }}>
              {log.map((line, idx) => <div key={idx}>&gt; {line}</div>)}
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', minHeight: 0 }}>
            <strong>Victim Keyboard Spy (Keylogger):</strong>
            <div style={{ flex: 1, border: '1px solid #00ff00', background: '#000', padding: '6px', overflowY: 'auto', minHeight: '130px', color: '#00ff00' }}>
              {keyboardFeed.map((feed, idx) => <div key={idx}>{feed}</div>)}
            </div>
            <span style={{ fontSize: '9px', color: '#888' }}>* Re-key captures update automatically every 5 seconds.</span>
          </div>
        )}

        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', minHeight: 0 }}>
            <strong>Force Chat Interface with Target:</strong>
            <div style={{ flex: 1, border: '1px solid #00ff00', background: '#000', padding: '6px', overflowY: 'auto', minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {chatLog.map((msg, idx) => (
                <div key={idx} style={{ color: msg.sender === 'Hacker' ? '#00ff00' : '#ff5555' }}>
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type text to send to victim..."
                style={{ background: '#000', color: '#00ff00', border: '1px solid #00ff00', padding: '3px', flex: 1, fontFamily: 'monospace' }}
              />
              <button 
                onClick={handleSendChat}
                style={{ background: '#222', color: '#00ff00', border: '1px solid #00ff00', padding: '3px 12px', cursor: 'default' }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'pranks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <strong>Sub7 Desktop Workstation Pranks:</strong>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* Swap mouse buttons */}
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #333', paddingBottom: '6px' }}>
                <div>
                  <strong>Swap Mouse Buttons</strong>
                  <div style={{ fontSize: '10px', color: '#888' }}>Left clicks trigger context menus, Right clicks drag.</div>
                </div>
                <button 
                  onClick={() => handleTogglePrank('swap')} 
                  style={{ background: swapButtons ? '#00ff00' : '#222', color: swapButtons ? '#000' : '#00ff00', border: '1px solid #00ff00', padding: '4px 12px', fontWeight: 'bold' }}
                >
                  {swapButtons ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              {/* Hide Taskbar */}
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #333', paddingBottom: '6px' }}>
                <div>
                  <strong>Hide Start Taskbar</strong>
                  <div style={{ fontSize: '10px', color: '#888' }}>Hides the bottom Windows taskbar on screen.</div>
                </div>
                <button 
                  onClick={() => handleTogglePrank('taskbar')} 
                  style={{ background: hideTaskbar ? '#00ff00' : '#222', color: hideTaskbar ? '#000' : '#00ff00', border: '1px solid #00ff00', padding: '4px 12px', fontWeight: 'bold' }}
                >
                  {hideTaskbar ? 'HIDDEN' : 'VISIBLE'}
                </button>
              </div>

              {/* Hide Desktop Icons */}
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #333', paddingBottom: '6px' }}>
                <div>
                  <strong>Hide Desktop Icons</strong>
                  <div style={{ fontSize: '10px', color: '#888' }}>Removes all item shortcuts on wallpaper.</div>
                </div>
                <button 
                  onClick={() => handleTogglePrank('icons')} 
                  style={{ background: hideIcons ? '#00ff00' : '#222', color: hideIcons ? '#000' : '#00ff00', border: '1px solid #00ff00', padding: '4px 12px', fontWeight: 'bold' }}
                >
                  {hideIcons ? 'HIDDEN' : 'VISIBLE'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
