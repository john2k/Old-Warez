import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function VirusSimulator() {
  const { activeViruses } = useContext(HardwareContext);
  const [cascadeChars, setCascadeChars] = useState([]);
  const canvasRef = useRef(null);

  // Cascade Falling Characters Virus
  useEffect(() => {
    if (activeViruses.includes('cascade')) {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+';
      const interval = setInterval(() => {
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        const left = Math.floor(Math.random() * window.innerWidth);
        const top = -20;
        setCascadeChars(prev => [
          ...prev.slice(-40), // Limit total active on screen
          { id: Math.random(), char, left, top }
        ]);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setCascadeChars([]);
    }
  }, [activeViruses]);

  // Screen Melting Canvas filter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeViruses.includes('melt')) return;
    const ctx = canvas.getContext('2d');
    let animId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw solid teal background or dither
    ctx.fillStyle = '#008080';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const columns = Math.floor(canvas.width / 8);
    const yOffsets = Array(columns).fill(0);

    const melt = () => {
      // Shift sections downward randomly
      for (let i = 0; i < columns; i++) {
        const x = i * 8;
        const y = yOffsets[i];
        if (Math.random() > 0.8) {
          const shift = Math.floor(Math.random() * 4) + 1;
          ctx.drawImage(canvas, x, y, 8, canvas.height - y, x, y + shift, 8, canvas.height - y);
          yOffsets[i] += shift;
        }
      }
      animId = requestAnimationFrame(melt);
    };

    melt();
    return () => cancelAnimationFrame(animId);
  }, [activeViruses]);

  if (activeViruses.length === 0) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 999999, overflow: 'hidden' }}>
      
      {/* Cascade text drops */}
      {activeViruses.includes('cascade') && cascadeChars.map(c => (
        <span 
          key={c.id} 
          className="falling-letter" 
          style={{ left: `${c.left}px`, top: `${c.top}px` }}
        >
          {c.char}
        </span>
      ))}

      {/* Screen melting canvas background */}
      {activeViruses.includes('melt') && (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', opacity: 0.4 }} />
      )}

      {/* Happy99 spam popup box */}
      {activeViruses.includes('happy99') && Math.random() > 0.7 && (
        <div className="win-window active-window" style={{ width: '300px', height: '120px', left: `${Math.random() * 60}%`, top: `${Math.random() * 60}%`, pointerEvents: 'auto' }}>
          <div className="win-title-bar">
            <span className="win-title-bar-title">Happy99 Worm Spammer</span>
          </div>
          <div className="win-window-body" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <p style={{ fontWeight: 'bold', color: 'red' }}>A Happy New Year 1999!!</p>
            <p style={{ fontSize: '11px', marginTop: '6px' }}>Worm sending DCC links to all contacts on mIRC...</p>
          </div>
        </div>
      )}
    </div>
  );
}
export function BsdScreen({ onReset }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000082', color: '#ffffff', zIndex: 9999999, padding: '40px', fontFamily: 'monospace', fontSize: '20px', textAlign: 'left' }}>
      <center>
        <span style={{ background: '#ffffff', color: '#000082', padding: '2px 8px', fontWeight: 'bold' }}>Windows</span>
      </center>
      <br/><br/>
      <p>A fatal exception 0E has occurred at 0028:C0011A3E in VXD VMM(01) + 00010A3E. The current application will be terminated.</p>
      <br/>
      <p>* Press double Ctrl+Alt+Del (Ctrl+Alt+Backspace) to restart your computer. You will lose any unsaved information in all applications.</p>
      <p>* If you ran a suspect executable (such as Chernobyl CIH), your boot sectors on C: drive may have been permanently wiped!</p>
      <br/>
      <center>
        <p>Press any key to continue _</p>
      </center>
      <div style={{ marginTop: '40px' }}>
        <button className="win-btn" onClick={onReset} style={{ color: '#fff', borderColor: '#fff', background: '#000082' }}>Virtual System Reset</button>
      </div>
    </div>
  );
}
