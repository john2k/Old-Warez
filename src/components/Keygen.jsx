import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function Keygen({ targetAppName, onClose }) {
  const { hardware, audioCtxRef } = useContext(HardwareContext);
  const [serial, setSerial] = useState('CLICK GENERATE');
  const [scrollerX, setScrollerX] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(true);
  
  const synthIntervalRef = useRef(null);
  
  // Retro Chiptune Loop synthesizer using Web Audio API
  const startChiptune = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const soundCard = hardware.sound.id;
      let noteIndex = 0;
      
      // Simple retro 8-bit bassline loop
      const melody = [
        261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66, // C4 D4 E4 F4 G4 F4 E4 D4
        220.00, 246.94, 261.63, 293.66, 329.63, 261.63, 220.00, 196.00  // A3 B3 C4 D4 E4 C4 A3 G3
      ];

      // Slow down or simplify synth depending on sound card
      const speed = soundCard === 'speaker' ? 400 : 200;

      synthIntervalRef.current = setInterval(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.frequency.value = melody[noteIndex % melody.length];
        
        if (soundCard === 'speaker') {
          // Harsh beeps
          osc.type = 'square';
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        } else if (soundCard === 'sb16') {
          // FM synthesis simulation
          osc.type = 'triangle';
          // Add modulator oscillator
          const modulator = ctx.createOscillator();
          const modGain = ctx.createGain();
          modulator.frequency.value = osc.frequency.value * 2;
          modGain.gain.value = 100;
          modulator.connect(modGain);
          modGain.connect(osc.frequency);
          modulator.start();
          modulator.stop(ctx.currentTime + 0.18);
          
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        } else {
          // AWE32 rich synth (sine/saw hybrid with delay)
          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          
          // Reverb delay
          const delay = ctx.createDelay();
          delay.delayTime.value = 0.15;
          const delayGain = ctx.createGain();
          delayGain.gain.value = 0.3;
          
          gain.connect(delay);
          delay.connect(delayGain);
          delayGain.connect(ctx.destination);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        
        noteIndex++;
      }, speed);
    } catch (e) {
      console.warn("Keygen music synth error: ", e);
    }
  };

  const stopChiptune = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (musicPlaying) {
      startChiptune();
    } else {
      stopChiptune();
    }
    return () => stopChiptune();
  }, [musicPlaying, hardware.sound.id]);

  useEffect(() => {
    localStorage.setItem('keygen_opened', 'true');
  }, []);

  // Horizontal scroller tick
  useEffect(() => {
    const timer = setInterval(() => {
      setScrollerX(prev => (prev - 2) % 600);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const generateSerial = () => {
    let format = 'XXXX-XXXX-XXXX';
    if (targetAppName?.toLowerCase().includes('winzip')) {
      format = 'WZ62-4389-9920';
    } else if (targetAppName?.toLowerCase().includes('doom')) {
      format = 'DM19-9312-C0DE';
    } else if (targetAppName?.toLowerCase().includes('duke')) {
      format = 'DN3D-KICK-ASS1';
    } else if (targetAppName?.toLowerCase().includes('warcraft')) {
      format = 'WC2D-DARK-PORT';
    } else {
      // General key
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let r = '';
      for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) r += '-';
        r += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      format = r;
    }
    setSerial(format);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serial);
    localStorage.setItem('starcraft_key_copied', 'true');
    localStorage.setItem('winzip_registered', 'true');
    alert('Serial copied to Windows Clipboard!');
  };

  const scrollerText = "+++ CLOUDZ & BEEFCAKE WAREZ GROUP PRESENTS THE ULTIMATE KEYGENERATOR FOR ALL VINTAGE 90s CD COPIES +++ CRAXX DELIVERED DAILY +++ SHOUT OUTS TO APOCALYPSE, FAirLight, DEVIANCE, MYTH, AND RADIUM +++ KEEP THE WAREZ ALIVE +++";

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#00ff00', border: '3px outset #444', height: '100%', display: 'flex', flexDirection: 'column', padding: '16px', fontFamily: 'var(--font-crt)' }}>
      {/* Visualiser Banner */}
      <div className="win-inset" style={{ height: '70px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', border: '2px solid #00ff00' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.3, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const h = Math.floor(Math.random() * 60) + 10;
            return <div key={i} style={{ width: '8px', height: `${h}px`, background: '#00ff00', transition: 'height 0.15s ease' }} />;
          })}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '4px', textShadow: '0 0 10px #00ff00' }}>
          {targetAppName ? targetAppName.toUpperCase() : 'KEYGEN'}
        </div>
      </div>

      {/* Scroller */}
      <div className="win-inset" style={{ height: '28px', background: '#000', marginTop: '12px', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', border: '1px solid #00ff00' }}>
        <div style={{ transform: `translateX(${scrollerX}px)`, fontSize: '16px', fontWeight: 'bold', color: '#ffcc00' }}>
          {scrollerText}
        </div>
      </div>

      {/* Serial display */}
      <div style={{ marginTop: '20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <div className="win-inset" style={{ background: '#000', width: '80%', padding: '8px', fontSize: '24px', textAlign: 'center', border: '2px solid #00ff00', color: '#fff', letterSpacing: '2px' }}>
          {serial}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="win-btn" onClick={generateSerial} style={{ color: '#0f0', borderColor: '#0f0', background: '#000' }}>GENERATE</button>
          <button className="win-btn" onClick={copyToClipboard} style={{ color: '#0f0', borderColor: '#0f0', background: '#000' }}>COPY</button>
          <button className="win-btn" onClick={() => setMusicPlaying(prev => !prev)} style={{ color: '#0f0', borderColor: '#0f0', background: '#000' }}>
            {musicPlaying ? 'MUSIC: ON' : 'MUSIC: OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
