import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function BootScreen({ onBootComplete }) {
  const { hardware, playSound, floppyInserted, isOsCorrupted, setOsInstalled, osInstalled, loadSaveData } = useContext(HardwareContext);
  const [bootStep, setBootStep] = useState('power-off'); // power-off, bios-ram, bios-ide, dos-starting, win-splash, dos-menu, dos-prompt, boot-error
  const [ramCount, setRamCount] = useState(0);
  const [dosChoice, setDosChoice] = useState(1);
  const [formatProgress, setFormatProgress] = useState(null);
  const [commandLine, setCommandLine] = useState('');
  const [consoleLines, setConsoleLines] = useState([]);
  const consoleBottomRef = useRef(null);

  // Double Escape / Reset triggers & Boot Save Loader
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && (e.key === 'Delete' || e.key === 'Backspace')) {
        setBootStep('bios-ram');
        setRamCount(0);
        playSound('beep');
      }
      
      // Load save state from floppy disk file on boot screen
      if (e.key.toLowerCase() === 'l' && (bootStep === 'bios-ram' || bootStep === 'bios-ide' || bootStep === 'power-off')) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.sav';
        input.onchange = (evt) => {
          const file = evt.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (readEvt) => {
            const success = loadSaveData(readEvt.target.result);
            if (success) {
              alert('Save disk successfully loaded from floppy! Booting system...');
              setBootStep('win-splash');
            } else {
              alert('Failed to read save disk floppy.');
            }
          };
          reader.readAsText(file);
        };
        input.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootStep, loadSaveData]);

  // Scroll console to bottom
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLines, formatProgress]);

  // BIOS Ram test
  useEffect(() => {
    if (bootStep === 'bios-ram') {
      playSound('beep');
      let current = 0;
      const target = hardware.ram.size * 1024;
      const intervalTime = Math.max(10, 40 / hardware.cpu.speedMultiplier);
      const step = Math.ceil(target / 120);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          playSound('floppy');
          setTimeout(() => {
            setBootStep('bios-ide');
          }, 600);
        }
        setRamCount(current);
      }, intervalTime);
      return () => clearInterval(timer);
    }
  }, [bootStep]);

  // BIOS Ide & Floppy Detection
  useEffect(() => {
    if (bootStep === 'bios-ide') {
      const timer = setTimeout(() => {
        if (floppyInserted === 'boot_floppy') {
          setBootStep('dos-menu');
        } else if (isOsCorrupted) {
          setBootStep('boot-error');
        } else {
          setBootStep('dos-starting');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bootStep, floppyInserted, isOsCorrupted]);

  // DOS starting step
  useEffect(() => {
    if (bootStep === 'dos-starting') {
      const timer = setTimeout(() => {
        setBootStep('win-splash');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  // Windows 95 Splash Complete
  useEffect(() => {
    if (bootStep === 'win-splash') {
      const timer = setTimeout(() => {
        onBootComplete();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  // Turn on PC
  const handlePowerOn = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }
    setBootStep('bios-ram');
  };

  const handleDosMenuSubmit = (choice) => {
    setBootStep('dos-prompt');
    setConsoleLines([
      'Starting MS-DOS...',
      choice === 1 
        ? 'Device=C:\\Windows\\oakcdrom.sys /D:mscd001' 
        : 'Skipping CD-ROM support...',
      choice === 1 ? 'MSCDEX Version 2.23. Drive E: assigned.' : '',
      'Microsoft(R) Windows 95 Desktop DOS Shell',
      '(C)Copyright Microsoft Corp 1981-1995.',
      'A:\\>'
    ].filter(Boolean));
  };

  const handleCommandRun = (e) => {
    if (e.key === 'Enter') {
      const cmd = commandLine.trim().toLowerCase();
      const newLines = [...consoleLines, `A:\\>${commandLine}`];
      
      if (cmd === 'format c: /s') {
        newLines.push('WARNING, ALL DATA ON NON-REMOVABLE DISK');
        newLines.push('DRIVE C: WILL BE LOST!');
        newLines.push('Proceed with Format (Y/N)?');
        setConsoleLines(newLines);
        setCommandLine('');
        setBootStep('dos-format-confirm');
      } else if (cmd === 'setup') {
        if (!osInstalled && !isOsCorrupted) {
          newLines.push('Starting Windows 95 Setup...');
          newLines.push('Initializing drive recovery...');
          setConsoleLines(newLines);
          setTimeout(() => {
            setBootStep('win-splash');
            setOsInstalled(true);
          }, 2000);
        } else if (isOsCorrupted) {
          newLines.push('Windows 95 files are corrupted. Please format C: first!');
          setConsoleLines(newLines);
        } else {
          newLines.push('Windows 95 is already installed. Reboot without Floppy.');
          setConsoleLines(newLines);
        }
        setCommandLine('');
      } else if (cmd === 'dir') {
        newLines.push(' Volume in drive A has no label');
        newLines.push(' Volume Serial Number is 1337-C0DE');
        newLines.push(' Directory of A:\\');
        newLines.push('');
        newLines.push('COMMAND  COM     93,890  07-11-95   9:50a COMMAND.COM');
        newLines.push('FORMAT   COM     49,575  07-11-95   9:50a FORMAT.COM');
        newLines.push('SETUP    EXE    120,400  07-11-95   9:50a SETUP.EXE');
        newLines.push('        3 file(s)        263,865 bytes');
        newLines.push('        0 dir(s)               0 bytes free');
        setConsoleLines(newLines);
        setCommandLine('');
      } else {
        newLines.push(`Bad command or file name: '${cmd}'`);
        setConsoleLines(newLines);
        setCommandLine('');
      }
    }
  };

  const handleFormatConfirm = (e) => {
    const char = e.key.toLowerCase();
    if (char === 'y') {
      setBootStep('dos-formatting');
      setFormatProgress(0);
      let pct = 0;
      const interval = setInterval(() => {
        pct += 2;
        setFormatProgress(pct);
        if (pct >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setConsoleLines(prev => [
              ...prev,
              'Formatting 1.2GB',
              'Format complete.',
              'Writing system files to C:',
              'System files transferred.',
              'A:\\>'
            ]);
            setBootStep('dos-prompt');
          }, 500);
        }
      }, 50);
    } else {
      setConsoleLines(prev => [...prev, 'Format aborted.', 'A:\\>']);
      setBootStep('dos-prompt');
    }
  };

  return (
    <div className="crt-container" style={{ color: '#00ff00', backgroundColor: '#000', fontFamily: 'var(--font-crt)', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', padding: bootStep === 'win-splash' ? '0px' : '24px', position: 'relative' }}>
      
      {/* Power Off Screen */}
      {bootStep === 'power-off' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#222', border: '8px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,0,0,0.8)' }} onClick={handlePowerOn}>
            <div style={{ width: '40px', height: '40px', background: '#ff0000', borderRadius: '50%', animation: 'flicker 1.5s infinite', border: '2px solid #500' }}></div>
          </div>
          <div style={{ fontSize: '24px', color: '#ff0000', fontWeight: 'bold' }}>TURN ON PC</div>
          <div style={{ marginTop: '16px', padding: '12px 20px', border: '1px dashed #00ff00', textAlign: 'center', fontSize: '14px' }}>
            <p style={{ color: '#ffcc00', marginBottom: '6px' }}>💾 Save Disk Detected?</p>
            <p style={{ color: '#aaa', fontSize: '12px' }}>Press <strong style={{ color: '#00ff00' }}>[L]</strong> or click below to load your save_disk.sav before booting</p>
            <label style={{ marginTop: '8px', display: 'inline-block', padding: '4px 12px', border: '1px solid #00ff00', color: '#00ff00', cursor: 'pointer', fontSize: '12px' }}>
              📂 INSERT SAVE DISK
              <input type="file" accept=".sav" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                  const success = loadSaveData(evt.target.result);
                  if (success) {
                    alert('Save disk loaded! Booting...');
                    setBootStep('win-splash');
                  } else {
                    alert('Invalid save disk file.');
                  }
                };
                reader.readAsText(file);
              }} />
            </label>
          </div>
        </div>
      )}

      {/* BIOS Screen */}
      {(bootStep === 'bios-ram' || bootStep === 'bios-ide') && (
        <div style={{ fontSize: '18px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', lineHeight: 1.3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p>AMIBIOS (C) 1996 American Megatrends Inc.</p>
              <p>Pentium(R)-MMX CPU at {hardware.cpu.id === 'p133' ? '133MHz' : hardware.cpu.id === 'p200mmx' ? '200MHz' : '300MHz'}</p>
            </div>
            <div style={{ border: '2px solid #00ff00', padding: '4px', fontSize: '14px', width: '90px', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '28px', color: '#ffcc00' }}>★</span>
              <span>ENERGY</span>
            </div>
          </div>
          <br/>
          <p>Memory Test : {ramCount}KB OK</p>
          <br/>
          {bootStep === 'bios-ide' && (
            <div>
              <p>Detecting IDE Primary Master ... {hardware.hddMaster.name}</p>
              <p>Detecting IDE Primary Slave  ... {hardware.hddSlave ? hardware.hddSlave.name : 'None'}</p>
              <p>Detecting IDE Secondary Master ... Mitsumi 8x CD-ROM</p>
              <br/>
              <p>Floppy drive A: Found (3.5" 1.44MB)</p>
              <p>Sound Card detected: {hardware.sound.name}</p>
            </div>
          )}
          <div style={{ marginTop: '12px', padding: '8px', border: '1px dashed #ffcc00', fontSize: '14px', color: '#ffcc00' }}>
            Press <strong>[L]</strong> to load Save Disk Floppy &nbsp;|&nbsp; <strong>[DEL]</strong> to enter Setup
          </div>
        </div>
      )}

      {/* Boot Failure Error */}
      {bootStep === 'boot-error' && (
        <div style={{ textAlign: 'left', fontSize: '20px', display: 'flex', flexDirection: 'column', gap: '24px', color: '#ff3333' }}>
          <div>
            <p>DISK BOOT FAILURE, INSERT SYSTEM DISK AND PRESS ENTER</p>
            <p>Non-System disk or disk error</p>
            <p>Replace and strike any key when ready</p>
          </div>
          <div style={{ border: '2px dashed #ff3333', padding: '16px', background: '#200' }}>
            <p style={{ color: '#fff', fontSize: '16px' }}>Tip: Insert the "Windows 95 Boot Floppy" from your Floppy actions to boot into MS-DOS and fix your partition magic system!</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="win-btn" style={{ background: '#300', color: '#ff3333', borderColor: '#ff3333' }} onClick={() => setBootStep('bios-ram')}>Reboot (Ctrl+Alt+Del)</button>
          </div>
        </div>
      )}

      {/* Starting MS-DOS message */}
      {bootStep === 'dos-starting' && (
        <div style={{ textAlign: 'left', fontSize: '16px', color: '#fff', fontFamily: 'monospace', padding: '10px' }}>
          Starting Windows 95...
        </div>
      )}

      {/* MS-DOS CD-ROM Boot Selection Menu */}
      {bootStep === 'dos-menu' && (
        <div style={{ textAlign: 'left', fontSize: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#fff', borderBottom: '2px solid #00ff00', paddingBottom: '8px' }}>Microsoft Windows 95 Startup Menu</p>
          <p>1. Boot with CD-ROM support</p>
          <p>2. Boot without CD-ROM support</p>
          <br/>
          <p>Enter your choice [1-2]: </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="win-btn" style={{ color: '#0f0', borderColor: '#0f0', background: '#000' }} onClick={() => handleDosMenuSubmit(1)}>1. With CD</button>
            <button className="win-btn" style={{ color: '#0f0', borderColor: '#0f0', background: '#000' }} onClick={() => handleDosMenuSubmit(2)}>2. Without CD</button>
          </div>
        </div>
      )}

      {/* DOS Command Line Shell */}
      {(bootStep === 'dos-prompt' || bootStep === 'dos-format-confirm' || bootStep === 'dos-formatting') && (
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
          <div style={{ flex: 1 }}>
            {consoleLines.map((line, idx) => (
              <p key={idx} style={{ minHeight: '1.2em' }}>{line}</p>
            ))}
            {bootStep === 'dos-formatting' && (
              <p style={{ color: '#ffcc00' }}>Formatting cluster table: {formatProgress}% complete...</p>
            )}
          </div>
          
          {bootStep === 'dos-prompt' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>A:\&gt;</span>
              <input 
                ref={input => input && input.focus()}
                type="text" 
                value={commandLine} 
                onChange={(e) => setCommandLine(e.target.value)} 
                onKeyDown={handleCommandRun}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#00ff00', fontFamily: 'var(--font-crt)', fontSize: '18px', flex: 1 }}
              />
            </div>
          )}

          {bootStep === 'dos-format-confirm' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>(Y/N)?</span>
              <input 
                ref={input => input && input.focus()}
                type="text" 
                maxLength={1}
                onKeyDown={handleFormatConfirm}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#00ff00', fontFamily: 'var(--font-crt)', fontSize: '18px', width: '20px' }}
              />
            </div>
          )}
          <div ref={consoleBottomRef} />
        </div>
      )}

      {/* HIGH FIDELITY WINDOWS 95 SPLASH SCREEN */}
      {bootStep === 'win-splash' && (
        <div style={{ 
          flex: 1, 
          background: 'linear-gradient(180deg, #1078b0 0%, #a2c6dc 60%, #ffffff 100%)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#000', 
          position: 'relative',
          width: '100%',
          height: '100%',
          fontFamily: 'sans-serif'
        }}>
          {/* Clouds backdrop simulation using overlay gradients */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
          }} />

          {/* Microsoft text sub-logo */}
          <div style={{ fontSize: '20px', fontFamily: '"Times New Roman", Times, serif', fontWeight: 'bold', fontStyle: 'italic', color: '#000', letterSpacing: '2px', transform: 'scaleY(0.9)', marginBottom: '8px', zIndex: 1 }}>
            Microsoft
          </div>

          {/* Waving Windows Flag Logo */}
          <div style={{ display: 'flex', position: 'relative', width: '120px', height: '100px', marginBottom: '20px', zIndex: 1, justifyContent: 'center' }}>
            {/* flag logo waving effect */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              width: '90px',
              height: '80px',
              border: '4px solid #000',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '8px 8px 0px rgba(0,0,0,0.2)',
              transform: 'skewY(-6deg) rotate(-4deg)'
            }}>
              <div style={{ background: '#ff3333', borderRight: '2px solid #000', borderBottom: '2px solid #000' }}></div>
              <div style={{ background: '#33cc33', borderBottom: '2px solid #000' }}></div>
              <div style={{ background: '#3333ff', borderRight: '2px solid #000' }}></div>
              <div style={{ background: '#ffcc00' }}></div>
            </div>
            
            {/* Flying trailing particles on the left */}
            <div style={{ position: 'absolute', left: '-25px', top: '10px', width: '8px', height: '8px', background: '#ff3333', border: '1px solid #000' }} />
            <div style={{ position: 'absolute', left: '-15px', top: '25px', width: '6px', height: '6px', background: '#3333ff', border: '1px solid #000' }} />
            <div style={{ position: 'absolute', left: '-30px', top: '40px', width: '10px', height: '10px', background: '#ffcc00', border: '1px solid #000' }} />
            <div style={{ position: 'absolute', left: '-10px', top: '55px', width: '7px', height: '7px', background: '#33cc33', border: '1px solid #000' }} />
          </div>

          {/* Main Windows 95 text */}
          <div style={{ fontSize: '52px', fontWeight: '900', color: '#0a2550', letterSpacing: '-2px', textShadow: '1px 1px 0px #fff', fontFamily: 'Impact, sans-serif', zIndex: 1, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span>Windows</span>
            <span style={{ fontSize: '64px', color: '#ff6600', fontStyle: 'italic', fontWeight: 'bold' }}>95</span>
          </div>

          {/* Internet Explorer subtext */}
          <div style={{ marginTop: '24px', fontSize: '15px', fontWeight: 'bold', color: '#105080', letterSpacing: '1px', zIndex: 1 }}>
            Microsoft Internet Explorer
          </div>

          {/* Scrolling loading bar at the very bottom */}
          <div style={{ 
            position: 'absolute',
            bottom: '40px',
            width: '260px',
            height: '14px',
            background: '#e0e0e0',
            border: '2px solid',
            borderColor: '#808080 #fff #fff #808080',
            overflow: 'hidden',
            zIndex: 1
          }}>
            <div 
              style={{
                height: '100%',
                width: '60px',
                background: 'linear-gradient(90deg, transparent 0%, #104080 50%, transparent 100%)',
                animation: 'win95-load-slide 2s infinite linear'
              }}
            />
          </div>

          {/* Inline animations */}
          <style>{`
            @keyframes win95-load-slide {
              0% { transform: translateX(-60px); }
              100% { transform: translateX(260px); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
