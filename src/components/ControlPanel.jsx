import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

// 1. MAIN CONTROL PANEL (Folder Grid View)
export default function ControlPanel({ openApp }) {
  const { playSound } = useContext(HardwareContext);

  const panelItems = [
    { id: 'hardware', name: 'Add New Hardware', icon: '🔌' },
    { id: 'programs', name: 'Add/Remove Programs', icon: '💿' },
    { id: 'datetime', name: 'Date/Time', icon: '⏰' },
    { id: 'display', name: 'Display', icon: '🖼' },
    { id: 'fonts', name: 'Fonts', icon: '🔠' },
    { id: 'internet', name: 'Internet Options', icon: '🌐' },
    { id: 'mouse', name: 'Mouse', icon: '🖱' },
    { id: 'multimedia', name: 'Multimedia', icon: '🔊' },
    { id: 'network', name: 'Network', icon: '🖧' },
    { id: 'passwords', name: 'Passwords', icon: '🔑' },
    { id: 'printers', name: 'Printers', icon: '🖨' },
    { id: 'sounds', name: 'Sounds', icon: '📣' },
    { id: 'system', name: 'System', icon: '💻' }
  ];

  const handleDoubleClick = (item) => {
    playSound('beep');
    if (['programs', 'datetime', 'display', 'mouse', 'sounds', 'system'].includes(item.id)) {
      openApp(`control_${item.id}`);
    } else if (item.id === 'hardware') {
      alert('Add New Hardware Wizard: No new Plug and Play ISA/PCI devices detected.');
    } else if (item.id === 'fonts') {
      alert('Fonts Folder: 12 TrueType fonts loaded (MS Sans Serif, Courier New, Times New Roman, Comic Sans).');
    } else if (item.id === 'internet') {
      alert('Internet Settings: Connection configured over Dial-up Networking (ISP Gateway 555-9000).');
    } else if (item.id === 'multimedia') {
      alert('Multimedia Properties: Audio playback routed to SoundBlaster 16 [DMA 1, IRQ 5, Port 220].');
    } else if (item.id === 'network') {
      alert('Network Properties: Client for Microsoft Networks over TCP/IP protocol bound to NE2000 network adapter.');
    } else if (item.id === 'passwords') {
      alert('Passwords Properties: Windows login password cached locally in C:\\Windows\\Guest.pwl.');
    } else if (item.id === 'printers') {
      alert('Printers: 1 printer installed (HP LaserJet 4P on LPT1: Local). Status: Ready.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000' }}>
      
      {/* Menu Bar */}
      <div className="win-menu-bar" style={{ display: 'flex', gap: '8px', padding: '2px 6px', borderBottom: '1px solid #808080' }}>
        <div className="win-menu-item">File</div>
        <div className="win-menu-item">Edit</div>
        <div className="win-menu-item">View</div>
        <div className="win-menu-item">Help</div>
      </div>

      {/* Grid view of items */}
      <div className="win-inset" style={{ flex: 1, backgroundColor: '#fff', padding: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '16px', justifyItems: 'center' }}>
          {panelItems.map(item => (
            <div 
              key={item.id} 
              onDoubleClick={() => handleDoubleClick(item)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
            >
              <div style={{ fontSize: '32px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '10px', wordBreak: 'break-word', lineHeight: '1.2' }}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="win-outset" style={{ padding: '2px 8px', background: 'var(--win-gray)', borderTop: '1px solid #808080', fontSize: '10px', textAlign: 'left' }}>
        13 object(s)
      </div>
    </div>
  );
}

// 2. SUB-WINDOW COMPONENTS (Property Dialog Sheets)

// DISPLAY PROPERTIES DIALOG
export function ControlPanelDisplay() {
  const { displaySettings, setDisplaySettings, desktopTheme, setDesktopTheme, playSound, completedMissions, setHardware } = useContext(HardwareContext);
  const [activeTab, setActiveTab] = useState('background'); // background, themes
  const [selectedWallpaper, setSelectedWallpaper] = useState(localStorage.getItem('desktop_wallpaper') || 'teal');
  const [selectedRes, setSelectedRes] = useState(displaySettings.resolution);
  const [selectedFilter, setSelectedFilter] = useState(displaySettings.filter || 'svga');
  const [selectedFitToScreen, setSelectedFitToScreen] = useState(displaySettings.fitToScreen !== false);

  const handleApply = () => {
    playSound('beep');
    setDisplaySettings(prev => ({ 
      ...prev, 
      resolution: selectedRes, 
      filter: selectedFilter, 
      fitToScreen: selectedFitToScreen 
    }));
    localStorage.setItem('desktop_wallpaper', selectedWallpaper);
    localStorage.setItem('desktop_filter', selectedFilter);
    localStorage.setItem('desktop_fit_to_screen', String(selectedFitToScreen));
    
    // Sync to hardware.video.resolution for resolution missions (m21, m22)
    setHardware(prev => ({
      ...prev,
      video: {
        ...prev.video,
        resolution: selectedRes
      }
    }));

    // Update container classes instantly
    const container = document.querySelector('.crt-container');
    if (container) {
      // Remove any existing filter- class
      container.className = container.className.replace(/\bfilter-\w+\b/g, '');
      container.classList.add(`filter-${selectedFilter}`);
    }
    
    alert('Display properties applied successfully!');
  };

  const handleThemeApply = (thName) => {
    playSound('beep');
    setDesktopTheme(thName);
    localStorage.setItem('desktop_theme', thName);
    alert(`Theme changed to: ${thName.toUpperCase()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '6px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', borderBottom: '2px solid var(--win-dark-gray)', paddingBottom: '0px', marginBottom: '8px' }}>
        <button className={`win-btn ${activeTab === 'background' ? 'pressed' : ''}`} onClick={() => setActiveTab('background')} style={{ padding: '2px 8px' }}>
          Background
        </button>
        <button className={`win-btn ${activeTab === 'themes' ? 'pressed' : ''}`} onClick={() => setActiveTab('themes')} style={{ padding: '2px 8px' }}>
          Appearance Themes
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {activeTab === 'background' ? (
          <>
            <div className="win-inset" style={{ padding: '8px', background: '#fff', flex: 1, overflowY: 'auto' }}>
              <strong>Select Desktop Wallpaper Pattern:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                {['teal', 'clouds', 'bricks', 'houndstooth', ...(completedMissions.length >= 5 ? ['matrix'] : [])].map(wp => (
                  <label key={wp} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input type="radio" name="wallpaper" value={wp} checked={selectedWallpaper === wp} onChange={() => setSelectedWallpaper(wp)} />
                    {wp.toUpperCase()} Pattern {wp === 'matrix' && '🔑 (Unlocked!)'}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flex: 1, minHeight: 0 }}>
              <div className="win-inset" style={{ padding: '8px', background: '#fff', flex: 1 }}>
                <strong>Screen Resolution:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {['640x480', '800x600', '1024x768'].map(res => (
                    <label key={res} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input type="radio" name="resolution" value={res} checked={selectedRes === res} onChange={() => setSelectedRes(res)} />
                      {res} {res === '640x480' ? '(VGA)' : res === '800x600' ? '(SVGA)' : '(High Color)'}
                    </label>
                  ))}
                  <div style={{ borderTop: '1px dashed #ccc', marginTop: '4px', paddingTop: '4px' }}>
                    <label style={{ display: 'flex', gap: '6px', alignItems: 'center', fontWeight: 'bold' }}>
                      <input type="checkbox" checked={selectedFitToScreen} onChange={(e) => setSelectedFitToScreen(e.target.checked)} />
                      Scale/Fit to Screen
                    </label>
                  </div>
                </div>
              </div>

              <div className="win-inset" style={{ padding: '8px', background: '#fff', flex: 1 }}>
                <strong>CRT Screen Filter:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {[
                    { id: 'none', label: 'None (Crisp LCD)' },
                    { id: 'vga', label: 'VGA Scanlines' },
                    { id: 'svga', label: 'SVGA CRT Grid' },
                    { id: 'retro', label: 'Retro TV (Heavy)' }
                  ].map(f => (
                    <label key={f.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input type="radio" name="filter" value={f.id} checked={selectedFilter === f.id} onChange={() => setSelectedFilter(f.id)} />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="win-inset" style={{ padding: '8px', background: '#fff', flex: 1, overflowY: 'auto' }}>
            <strong>Choose Appearance Color Theme:</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
              {[
                { id: 'default', name: 'Standard Teal', color: '#008080' },
                { id: 'plum', name: 'Plum Purple', color: '#400040' },
                { id: 'desert', name: 'Desert Sand', color: '#a08060' },
                { id: 'rose', name: 'Rose Maroon', color: '#800040' },
                { id: 'highcontrast', name: 'High Contrast Black', color: '#000000' },
                ...(completedMissions.length >= 10 ? [{ id: 'hacker', name: 'Underground Hacker 🔑', color: '#00ff00' }] : [])
              ].map(th => (
                <div 
                  key={th.id}
                  onClick={() => handleThemeApply(th.id)}
                  className="win-outset"
                  style={{ padding: '4px', cursor: 'default', display: 'flex', alignItems: 'center', gap: '6px', border: desktopTheme === th.id ? '2px solid #000' : '1px solid #808080' }}
                >
                  <div style={{ width: '16px', height: '12px', background: th.color, border: '1px solid #000' }}></div>
                  <span style={{ fontSize: '9px' }}>{th.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="win-btn" onClick={handleApply} style={{ padding: '4px 12px', fontWeight: 'bold' }}>OK</button>
        <button className="win-btn" style={{ padding: '4px 12px' }}>Cancel</button>
      </div>
    </div>
  );
}

// SOUND PROPERTIES DIALOG
export function ControlPanelSounds() {
  const { soundScheme, setSoundScheme, setHardware, playSound, completedMissions } = useContext(HardwareContext);
  const [selectedScheme, setSelectedScheme] = useState(soundScheme);
  const [sbPort, setSbPort] = useState(localStorage.getItem('sb_port') || '220');
  const [sbIrq, setSbIrq] = useState(localStorage.getItem('sb_irq') || '5');
  const [sbDma, setSbDma] = useState(localStorage.getItem('sb_dma') || '1');

  const handleApply = () => {
    playSound('beep');
    setSoundScheme(selectedScheme);
    localStorage.setItem('sound_scheme', selectedScheme);
    localStorage.setItem('sb_port', sbPort);
    localStorage.setItem('sb_irq', sbIrq);
    localStorage.setItem('sb_dma', sbDma);
    
    setHardware(prev => ({
      ...prev,
      sound: { ...prev.sound, port: sbPort, irq: sbIrq, dma: sbDma }
    }));
    alert('Sound and SoundBlaster Configuration applied!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '8px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left', gap: '8px' }}>
      <strong>Sounds Scheme Properties</strong>
      
      <div className="win-inset" style={{ padding: '8px', background: '#fff' }}>
        <span>Audio Profile Scheme:</span>
        <select 
          value={selectedScheme} 
          onChange={(e) => setSelectedScheme(e.target.value)}
          style={{ width: '100%', background: '#fff', border: '1px solid #808080', marginTop: '4px' }}
        >
          <option value="classic">Classic Windows Startup</option>
          <option value="utopia">Utopia Soundscape</option>
          <option value="jungle">Jungle Adventure</option>
          <option value="robot">Robot Synth System</option>
          {completedMissions.length >= 15 && (
            <option value="hacker">💻 Elite Hacker Sound Scheme (Unlocked!)</option>
          )}
        </select>
      </div>

      <div className="win-inset" style={{ padding: '8px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <strong>SoundBlaster ISA Jumper Settings:</strong>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>I/O Port:</span>
          <select value={sbPort} onChange={(e) => setSbPort(e.target.value)} style={{ background: '#fff' }}>
            <option value="220">0x220 (Default)</option>
            <option value="240">0x240</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>IRQ Interrupt:</span>
          <select value={sbIrq} onChange={(e) => setSbIrq(e.target.value)} style={{ background: '#fff' }}>
            <option value="5">IRQ 5 (Default)</option>
            <option value="7">IRQ 7</option>
            <option value="9">IRQ 9</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>DMA Channel:</span>
          <select value={sbDma} onChange={(e) => setSbDma(e.target.value)} style={{ background: '#fff' }}>
            <option value="1">DMA 1 (Default)</option>
            <option value="3">DMA 3</option>
            <option value="5">DMA 5</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <button className="win-btn" onClick={handleApply} style={{ padding: '4px 12px', fontWeight: 'bold' }}>OK</button>
        <button className="win-btn" style={{ padding: '4px 12px' }}>Cancel</button>
      </div>
    </div>
  );
}

// MOUSE PROPERTIES DIALOG
export function ControlPanelMouse() {
  const { mouseSettings, setMouseSettings, playSound } = useContext(HardwareContext);
  const [speed, setSpeed] = useState(mouseSettings.speed);
  const [trails, setTrails] = useState(mouseSettings.trails);
  const [scheme, setScheme] = useState(mouseSettings.scheme);

  const handleApply = () => {
    playSound('beep');
    setMouseSettings({ speed, trails, scheme });
    localStorage.setItem('mouse_speed', speed.toString());
    localStorage.setItem('mouse_trails', trails.toString());
    localStorage.setItem('mouse_scheme', scheme);
    alert('Mouse configurations applied successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '8px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left', gap: '8px' }}>
      <strong>Mouse Pointer Configurations</strong>
      
      <div className="win-inset" style={{ padding: '8px', background: '#fff' }}>
        <span>Pointer Sensitivity Speed:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <span>Slow</span>
          <input type="range" min="10" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ flex: 1 }} />
          <span>Fast</span>
        </div>
      </div>

      <div className="win-inset" style={{ padding: '8px', background: '#fff' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input type="checkbox" checked={trails} onChange={(e) => setTrails(e.target.checked)} />
          <strong>Show Mouse Pointer Trails</strong>
        </label>
      </div>

      <div className="win-inset" style={{ padding: '8px', background: '#fff' }}>
        <span>Cursor Icon Pack:</span>
        <select value={scheme} onChange={(e) => setScheme(e.target.value)} style={{ width: '100%', background: '#fff', border: '1px solid #808080', marginTop: '4px' }}>
          <option value="default">Standard Beige Retro Pointer</option>
          <option value="black">Extra Large High Visibility Black</option>
          <option value="animated">Dinosaur / Animated Wait</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <button className="win-btn" onClick={handleApply} style={{ padding: '4px 12px', fontWeight: 'bold' }}>OK</button>
        <button className="win-btn" style={{ padding: '4px 12px' }}>Cancel</button>
      </div>
    </div>
  );
}

// DATE / TIME PROPERTIES DIALOG
export function ControlPanelDateTime() {
  const { timeZone, setTimeZone, playSound } = useContext(HardwareContext);
  const [selectedTimezone, setSelectedTimezone] = useState(timeZone);

  const handleApply = () => {
    playSound('beep');
    setTimeZone(selectedTimezone);
    localStorage.setItem('timezone', selectedTimezone);
    alert('System clock date & time updated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '8px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left', gap: '8px' }}>
      <strong>Date & Time Settings</strong>
      
      <div className="win-inset" style={{ padding: '8px', background: '#fff' }}>
        <span>Selected Location Timezone:</span>
        <select 
          value={selectedTimezone} 
          onChange={(e) => setSelectedTimezone(e.target.value)}
          style={{ width: '100%', background: '#fff', border: '1px solid #808080', marginTop: '4px' }}
        >
          <option value="US/Eastern">Eastern Time Zone (US & Canada, GMT-5)</option>
          <option value="US/Pacific">Pacific Time Zone (US & Canada, GMT-8)</option>
          <option value="Europe/London">London / Western Europe (GMT)</option>
          <option value="Europe/Paris">Central European Time (GMT+1)</option>
          <option value="Asia/Tokyo">Tokyo Time Zone (Japan, GMT+9)</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <div className="win-inset" style={{ padding: '8px 16px', background: '#000', color: '#0f0', fontFamily: 'monospace', fontSize: '18px', letterSpacing: '2px', borderRadius: '4px' }}>
          {new Date().toLocaleTimeString('en-US', { timeZone: selectedTimezone })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: 'auto' }}>
        <button className="win-btn" onClick={handleApply} style={{ padding: '4px 12px', fontWeight: 'bold' }}>OK</button>
        <button className="win-btn" style={{ padding: '4px 12px' }}>Cancel</button>
      </div>
    </div>
  );
}

// SYSTEM MOBO PROPERTIES DIALOG
export function ControlPanelSystem() {
  const { hardware, generateSaveData, loadSaveData, playSound } = useContext(HardwareContext);
  const [saveCodeInput, setSaveCodeInput] = useState('');

  const handleExportSave = () => {
    const data = generateSaveData();
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'save_disk.sav';
    link.click();
    URL.revokeObjectURL(url);
    playSound('beep');
    alert('Disquette de sauvegarde exportée ! Le fichier save_disk.sav a été téléchargé sur votre PC.');
  };

  const handleImportSave = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const success = loadSaveData(evt.target.result);
      if (success) {
        alert('Disquette de sauvegarde chargée ! Vos données ont été restaurées.');
        window.location.reload();
      } else {
        alert('Erreur: Fichier de sauvegarde invalide.');
      }
    };
    reader.readAsText(file);
  };

  const handleImportCode = () => {
    const success = loadSaveData(saveCodeInput);
    if (success) {
      alert('Code de sauvegarde importé avec succès !');
      window.location.reload();
    } else {
      alert('Code de sauvegarde invalide.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '8px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left', gap: '8px', overflowY: 'auto' }}>
      <strong>System Specifications & Save Disk</strong>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <div className="win-inset" style={{ padding: '8px', background: '#fff', display: 'flex', gap: '8px', flex: 1.2 }}>
          <span style={{ fontSize: '24px' }}>💻</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px' }}>
            <strong>Microsoft Windows 95</strong>
            <p style={{ margin: '1px 0' }}>Processor: {hardware.cpu.name}</p>
            <p style={{ margin: '1px 0' }}>Memory: {hardware.ram.size} MB RAM</p>
            <p style={{ margin: '1px 0' }}>HDD: {hardware.hddMaster.name}</p>
          </div>
        </div>

        <div className="win-inset" style={{ padding: '8px', background: '#fff', flex: 0.8, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          <strong>💾 Save Floppy Utility:</strong>
          <button className="win-btn" onClick={handleExportSave} style={{ fontSize: '9px', fontWeight: 'bold' }}>
            💾 Export Save
          </button>
          
          <label className="win-btn" style={{ fontSize: '9px', textAlign: 'center', cursor: 'default', display: 'block', padding: '2px' }}>
            📂 Load Save Disk
            <input type="file" accept=".sav" onChange={handleImportSave} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="win-inset" style={{ padding: '8px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <strong>🔑 Backup / Restore Save Code:</strong>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input 
            type="text" 
            placeholder="Paste backup save code string..." 
            value={saveCodeInput} 
            onChange={(e) => setSaveCodeInput(e.target.value)} 
            className="win-input" 
            style={{ flex: 1, background: '#fff', fontSize: '9px' }} 
          />
          <button className="win-btn" onClick={handleImportCode} style={{ fontSize: '9px' }}>Load</button>
        </div>
        <button 
          className="win-btn" 
          onClick={() => {
            const code = generateSaveData();
            navigator.clipboard.writeText(code);
            alert('Save code copied to clipboard!');
          }} 
          style={{ fontSize: '9px', marginTop: '2px' }}
        >
          📋 Copy Current Save Code to Clipboard
        </button>
      </div>
    </div>
  );
}

// ADD/REMOVE PROGRAMS DIALOG
export function ControlPanelPrograms() {
  const { activeViruses, setActiveViruses, playSound } = useContext(HardwareContext);

  const handleUninstall = (prog) => {
    if (prog === 'Happy99') {
      setActiveViruses(prev => prev.filter(v => v !== 'happy99'));
      playSound('beep');
      alert('Happy99 Worm successfully uninstalled and deleted from System directory.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '8px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left', gap: '6px' }}>
      <strong>Add/Remove Applications</strong>
      
      <div className="win-inset" style={{ minHeight: '120px', backgroundColor: '#eee', padding: '6px', flex: 1, overflowY: 'auto' }}>
        {activeViruses.includes('happy99') && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '4px', border: '1px solid #ccc', marginBottom: '4px' }}>
            <span>🐛 Happy99 Worm / Spammer</span>
            <button className="win-btn" onClick={() => handleUninstall('Happy99')}>Uninstall</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '4px', border: '1px solid #ccc', marginBottom: '4px' }}>
          <span>📁 WinZip Archive Unpacker</span>
          <span style={{ color: '#888', fontStyle: 'italic' }}>System Core</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '4px', border: '1px solid #ccc', marginBottom: '4px' }}>
          <span>💬 mIRC Chat client</span>
          <span style={{ color: '#888', fontStyle: 'italic' }}>System Core</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="win-btn" style={{ padding: '4px 16px', fontWeight: 'bold' }}>Close</button>
      </div>
    </div>
  );
}
