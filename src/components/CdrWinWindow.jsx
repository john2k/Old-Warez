import React, { useState, useEffect, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function CdrWinWindow() {
  const { hardware, fileSystem, playSound } = useContext(HardwareContext);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [burnSpeed, setBurnSpeed] = useState(2); // 2x, 4x, 8x
  const [isBurning, setIsBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);
  const [burnLog, setBurnLog] = useState([]);
  const [isPatchApplied, setIsPatchApplied] = useState(false);

  // Scan Downloads for burnable files
  const downloads = fileSystem['C:']?.files?.['Downloads']?.files || {};
  const audioFiles = Object.keys(downloads).filter(name => 
    name.toLowerCase().endsWith('.mp3') || name.toLowerCase().endsWith('.wav')
  );

  useEffect(() => {
    // Check if user has downloaded the buffer underrun patch
    const patchExists = downloads['cdrwin_patch.ppf'] || downloads['Warcraft2_crk.ppf'];
    if (patchExists) {
      setIsPatchApplied(true);
    }
  }, [downloads]);

  const toggleTrackSelection = (track) => {
    setSelectedTracks(prev => 
      prev.includes(track) 
        ? prev.filter(t => t !== track) 
        : [...prev, track]
    );
  };

  const startBurning = () => {
    if (selectedTracks.length === 0 || isBurning) return;

    setIsBurning(true);
    setBurnProgress(0);
    setBurnLog([
      'STATUS:> Preparing CD layout compilation...',
      'STATUS:> Analyzing audio wave frames...',
      'STATUS:> Initializing CD-R recorder laser calibration...',
      `STATUS:> Starting write operation at ${burnSpeed}x speed...`
    ]);

    const ramSize = hardware.ram.size;
    const cpuId = hardware.cpu.id;
    
    // Buffer Underrun Conditions
    // Fast burn speed (e.g. 8x) on low RAM (16MB) or low CPU (p133) triggers Buffer Underrun
    // Unless the buffer patch is applied
    const willTriggerBufferUnderrun = 
      burnSpeed >= 4 && 
      (ramSize <= 16 || cpuId === 'p133') && 
      !isPatchApplied;

    const burnDuration = 100; // Tick steps
    const failPercent = 45; // Fail at 45% if underrun

    const timer = setInterval(() => {
      setBurnProgress(prev => {
        const next = prev + 4;
        
        if (willTriggerBufferUnderrun && next >= failPercent) {
          clearInterval(timer);
          setIsBurning(false);
          setBurnLog(l => [
            ...l,
            `STATUS:> [Write Sector 14209] - Buffer utilization dropped below 1%`,
            `ERROR:> CDRWin: Buffer Underrun error occurred.`,
            `ERROR:> Burning aborted. Disk is now a drink coaster.`,
            `TIP:> Upgrade RAM/CPU or download CDRWin buffer patch from GameCopyWorld!`
          ]);
          playSound('beep');
          return failPercent;
        }

        if (next >= 100) {
          clearInterval(timer);
          setIsBurning(false);
          setBurnLog(l => [
            ...l,
            'STATUS:> Writing CD lead-out session...',
            'STATUS:> Finalizing session allocation...',
            'STATUS:> Burning operation completed successfully!',
            `STATUS:> CD-R ejected. Delivery ready.`
          ]);
          playSound('beep');
          
          // Eject/Burn Success Session Flag
          localStorage.setItem('burned_cd_tracks', JSON.stringify(selectedTracks));
          return 100;
        }

        return next;
      });
    }, 120);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '12px' }}>
      
      {/* Title Header */}
      <div style={{ background: '#000080', color: '#fff', padding: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--win-dark-gray)' }}>
        <span>CDRWin 3.8a - CD-ROM Recording System</span>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '6px', marginTop: '8px', overflow: 'hidden' }}>
        {/* Track compile selection */}
        <div className="win-inset" style={{ width: '160px', backgroundColor: '#fff', padding: '6px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <strong>Add Audio tracks:</strong>
          {audioFiles.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic', marginTop: '8px', fontSize: '11px' }}>
              No MP3/WAV files located in Downloads. Get them from mIRC Fserv!
            </p>
          ) : (
            audioFiles.map(track => (
              <label 
                key={track} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0', fontSize: '11px', cursor: 'default' }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedTracks.includes(track)} 
                  onChange={() => toggleTrackSelection(track)}
                />
                {track}
              </label>
            ))
          )}
        </div>

        {/* Burn log / options */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Options */}
          <div className="win-outset" style={{ padding: '8px', textAlign: 'left', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Burner Speed:</span>
            <select 
              value={burnSpeed} 
              onChange={(e) => setBurnSpeed(Number(e.target.value))} 
              style={{ padding: '2px', fontFamily: 'var(--font-win)' }}
              disabled={isBurning}
            >
              <option value="2">2x Write Speed</option>
              <option value="4">4x Write Speed</option>
              <option value="8">8x Write Speed (Requires Fast hardware)</option>
            </select>

            <span style={{ fontSize: '11px', color: isPatchApplied ? 'green' : 'red' }}>
              Patch: {isPatchApplied ? 'Applied' : 'None'}
            </span>
          </div>

          {/* Burn Console Output Log */}
          <div className="win-inset" style={{ flex: 1, backgroundColor: '#000', color: '#00ff00', fontFamily: 'monospace', padding: '6px', overflowY: 'auto', fontSize: '11px', textAlign: 'left' }}>
            {burnLog.map((line, idx) => <p key={idx}>{line}</p>)}
          </div>

          {/* Burn action & progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="win-inset" style={{ flex: 1, height: '18px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: `${burnProgress}%`, height: '100%', background: 'var(--win-blue)' }} />
              <span style={{ position: 'absolute', width: '100%', textAlign: 'center', left: 0, top: 1, fontWeight: 'bold', fontSize: '11px' }}>
                {Math.round(burnProgress)}% Write complete
              </span>
            </div>

            <button 
              className="win-btn" 
              onClick={startBurning} 
              disabled={selectedTracks.length === 0 || isBurning}
              style={{ fontWeight: 'bold', width: '80px' }}
            >
              BURN CD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
