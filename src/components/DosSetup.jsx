import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function DosSetup({ gameName, onSetupComplete }) {
  const { hardware, playSound } = useContext(HardwareContext);
  const [soundDevice, setSoundDevice] = useState('speaker'); // speaker, sb16, none
  const [port, setPort] = useState('220');
  const [irq, setIrq] = useState('5');
  const [dma, setDma] = useState('1');
  const [completed, setCompleted] = useState(false);

  const handleSaveConfig = () => {
    // Sound Card validation
    const hasSB = hardware.sound.id === 'sb16' || hardware.sound.id === 'awe32';
    
    // Check if configuration matches typical SoundBlaster settings:
    // Sound device must be sb16, Port must be 220, IRQ must be 5, DMA must be 1.
    const isConfigCorrect = 
      soundDevice === 'sb16' && 
      hasSB &&
      port === '220' && 
      irq === '5' && 
      dma === '1';

    playSound('beep');
    setCompleted(true);
    
    // Save sound settings flag
    localStorage.setItem(`sound_config_${gameName}`, JSON.stringify({
      correct: isConfigCorrect,
      soundDevice,
      port,
      irq,
      dma
    }));

    setTimeout(() => {
      if (onSetupComplete) onSetupComplete(isConfigCorrect);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#000080', color: '#ffff00', fontFamily: 'var(--font-crt)', fontSize: '18px', height: '100%', display: 'flex', flexDirection: 'column', padding: '24px', textAlign: 'left', border: '3px outset #fff' }}>
      
      {/* Title */}
      <div style={{ borderBottom: '2px solid #ffff00', paddingBottom: '6px', textAlign: 'center', color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>
        {gameName.toUpperCase()} SETUP UTILITY v1.0
      </div>

      {!completed ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', flex: 1 }}>
          <p>Please select your Sound Device hardware parameters:</p>

          {/* Sound Card select */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span>Sound Card:</span>
            <select value={soundDevice} onChange={(e) => setSoundDevice(e.target.value)} style={{ background: '#000', color: '#ff0', border: '1px solid #ff0', fontSize: '18px', fontFamily: 'var(--font-crt)' }}>
              <option value="none">None / Silent</option>
              <option value="speaker">PC Speaker (Mono Square)</option>
              <option value="sb16">SoundBlaster 16 or Compatible</option>
            </select>
          </div>

          {soundDevice === 'sb16' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px', borderLeft: '2px dashed #ff0' }}>
              {/* Port */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <span>Address Port:</span>
                <select value={port} onChange={(e) => setPort(e.target.value)} style={{ background: '#000', color: '#ff0', border: '1px solid #ff0', fontSize: '18px', fontFamily: 'var(--font-crt)' }}>
                  <option value="220">Address 220h (Default)</option>
                  <option value="240">Address 240h</option>
                  <option value="330">Address 330h</option>
                </select>
              </div>

              {/* IRQ */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <span>Interrupt (IRQ):</span>
                <select value={irq} onChange={(e) => setIrq(e.target.value)} style={{ background: '#000', color: '#ff0', border: '1px solid #ff0', fontSize: '18px', fontFamily: 'var(--font-crt)' }}>
                  <option value="3">IRQ 3</option>
                  <option value="5">IRQ 5 (SB Default)</option>
                  <option value="7">IRQ 7 (LPT Printer)</option>
                </select>
              </div>

              {/* DMA */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <span>8-Bit DMA Channel:</span>
                <select value={dma} onChange={(e) => setDma(e.target.value)} style={{ background: '#000', color: '#ff0', border: '1px solid #ff0', fontSize: '18px', fontFamily: 'var(--font-crt)' }}>
                  <option value="1">DMA 1 (Default)</option>
                  <option value="3">DMA 3</option>
                  <option value="5">DMA 5 (High)</option>
                </select>
              </div>
            </div>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', gap: '16px' }}>
            <button className="win-btn" onClick={handleSaveConfig} style={{ color: '#ff0', borderColor: '#ff0', background: '#000', fontSize: '18px' }}>
              Save Configuration
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff' }}>
          Configuration file written. Exiting setup...
        </div>
      )}
    </div>
  );
}
