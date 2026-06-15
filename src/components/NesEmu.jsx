import React, { useState, useContext, useEffect } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function NesEmu() {
  const { playSound } = useContext(HardwareContext);
  const [selectedRom, setSelectedRom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [playing, setPlaying] = useState(false);

  const roms = [
    { id: 'chrono', name: 'Chrono Trigger (USA) - 4.0MB' },
    { id: 'mario', name: 'Super Mario World (USA) - 1.0MB' },
    { id: 'zelda', name: 'Zelda: Link to the Past (USA) - 2.0MB' }
  ];

  const handleLoadRom = (rom) => {
    if (loading || playing) return;
    setSelectedRom(rom);
    setLoading(true);
    setPercent(0);
    playSound('beep');

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setPercent(p);
      playSound('floppy');
      if (p >= 100) {
        clearInterval(interval);
        setLoading(false);
        setPlaying(true);
        localStorage.setItem('emu_played', 'true');
        playSound('beep');
      }
    }, 150);
  };

  const handleStop = () => {
    setPlaying(false);
    setSelectedRom(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      
      {/* Header */}
      <div style={{ background: '#800000', color: '#fff', padding: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--win-dark-gray)' }}>
        <span>🎮 Snes9x v1.26 - Retro Emulator</span>
        <span>ROMs loaded: 3</span>
      </div>

      {!playing && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginTop: '10px' }}>
          <strong>Select a virtual ROM to boot:</strong>
          <div className="win-inset" style={{ background: '#fff', flex: 1, overflowY: 'auto', padding: '4px' }}>
            {roms.map(r => (
              <div 
                key={r.id}
                onClick={() => handleLoadRom(r)}
                style={{ padding: '6px', cursor: 'default', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}
                className="win-menu-item"
              >
                <span>👾 {r.name}</span>
                <span style={{ color: '#006600', fontWeight: 'bold' }}>Load ROM</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '10px' }}>
          <strong>Loading ROM: {selectedRom?.name}...</strong>
          <div className="win-inset" style={{ width: '80%', height: '16px', background: '#fff' }}>
            <div style={{ width: `${percent}%`, height: '100%', background: '#800000' }} />
          </div>
          <span>{percent}% (Caching to RAM buffer...)</span>
        </div>
      )}

      {playing && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px', marginTop: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Running: {selectedRom?.name}</strong>
            <button className="win-btn" onClick={handleStop} style={{ padding: '1px 8px' }}>Stop Emulator</button>
          </div>
          
          {/* Simulated Game screen screen mockup */}
          <div className="win-inset" style={{ flex: 1, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            {selectedRom?.id === 'chrono' && (
              <>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffcc00', textShadow: '2px 2px 0 #800000', marginBottom: '8px' }}>CHRONO TRIGGER</div>
                <div style={{ fontSize: '10px', color: '#888' }}>[16-BIT ACTIVE BATTLE SYSTEM MODE]</div>
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,128,0.7)', border: '1px solid #fff', padding: '4px', fontSize: '9px', width: '90%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Crono: HP 240/240</span>
                    <span>Marle: HP 190/190</span>
                    <span>Lucca: HP 178/178</span>
                  </div>
                </div>
              </>
            )}
            {selectedRom?.id === 'mario' && (
              <>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#55ff55', textShadow: '2px 2px 0 #000', marginBottom: '8px' }}>SUPER MARIO WORLD</div>
                <div style={{ fontSize: '11px', color: '#ffcc00' }}>SCORE: 002490   TIME: 284   LIVES: 05</div>
                <div style={{ marginTop: '10px', fontSize: '24px' }}>🦖 👨</div>
              </>
            )}
            {selectedRom?.id === 'zelda' && (
              <>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff3333', textShadow: '2px 2px 0 #000', marginBottom: '8px' }}>THE LEGEND OF ZELDA</div>
                <div style={{ fontSize: '10px', color: '#ffcc00' }}>- A LINK TO THE PAST -</div>
                <div style={{ marginTop: '10px', fontSize: '14px' }}>🛡️ 🗡️ HP: ❤️❤️❤️❤️❤️</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
