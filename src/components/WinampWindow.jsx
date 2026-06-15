import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function WinampWindow() {
  const { hardware, audioCtxRef, completedMissions, credits, playSound } = useContext(HardwareContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [timeStr, setTimeStr] = useState('00:00');
  const [volume, setVolume] = useState(80);
  const canvasRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const timeElapsedRef = useRef(0);
  
  // Custom skin state loaded from localStorage
  const [selectedSkin, setSelectedSkin] = useState(localStorage.getItem('winamp_skin') || 'classic');

  const basePlaylist = [
    { title: 'Millencolin - No Cigar', url: 'https://www.youtube.com/watch?v=5_Ch0DFpnPU' },
    { title: 'Limp Bizkit - Nookie', url: 'https://www.youtube.com/watch?v=JTMVOzVY8y4' },
    { title: 'Britney Spears - ...Baby One More Time', url: 'https://www.youtube.com/watch?v=C-u5WLJ9Yk4' },
    { title: 'Metallica - Enter Sandman', url: 'https://www.youtube.com/watch?v=CD-E-LDc384' },
    { title: 'Eiffel 65 - Blue (Da Ba Dee)', url: 'https://www.youtube.com/watch?v=68ugkg9RePc' },
    { title: 'Aqua - Barbie Girl', url: 'https://www.youtube.com/watch?v=ZyhrYis509A' },
    { title: 'The Offspring - Pretty Fly (For a White Guy)', url: 'https://www.youtube.com/watch?v=QtTR-_Klcq8' },
    { title: 'Blink-182 - All The Small Things', url: 'https://www.youtube.com/watch?v=9Ht55G4eA6c' },
    { title: 'Eminem - My Name Is', url: 'https://www.youtube.com/watch?v=sNPnbI1arSE' },
    { title: 'Smash Mouth - All Star', url: 'https://www.youtube.com/watch?v=L_jWHffIx5E' },
    { title: 'Nirvana - Smells Like Teen Spirit', url: 'https://www.youtube.com/watch?v=hTWKbfoikeg' },
    { title: 'Green Day - Basket Case', url: 'https://www.youtube.com/watch?v=NUTGr5t3MoY' },
    { title: 'Rage Against The Machine - Killing In The Name', url: 'https://www.youtube.com/watch?v=bWXaztAEwsE' },
    { title: 'Spice Girls - Wannabe', url: 'https://www.youtube.com/watch?v=gJLIiF15wjQ' },
    { title: 'Daft Punk - Around the World', url: 'https://www.youtube.com/watch?v=LKYPYj2XX80' },
    { title: 'Beastie Boys - Intergalactic', url: 'https://www.youtube.com/watch?v=qORYO0atB6g' },
    { title: 'Radiohead - Creep', url: 'https://www.youtube.com/watch?v=XFkzRNyygfk' },
    { title: 'The Prodigy - Firestarter', url: 'https://www.youtube.com/watch?v=wmin5WkOuPw' },
    { title: 'Foo Fighters - Everlong', url: 'https://www.youtube.com/watch?v=eBG7P-K-r1Y' },
    { title: 'Red Hot Chili Peppers - Californication', url: 'https://www.youtube.com/watch?v=YlUKcNNmywk' },
    { title: 'Backstreet Boys - I Want It That Way', url: 'https://www.youtube.com/watch?v=4fndeDfaWCg' },
    { title: 'Linkin Park - In The End', url: 'https://www.youtube.com/watch?v=eVTXPUF4Oz4' },
    { title: 'Darude - Sandstorm', url: 'https://www.youtube.com/watch?v=y6120Q5MgtY' },
    { title: 'Bloodhound Gang - The Bad Touch', url: 'https://www.youtube.com/watch?v=xat1GVnl8-k' },
    { title: 'Savage Garden - Truly Madly Deeply', url: 'https://www.youtube.com/watch?v=AR8D2yqgQ1U' }
  ];

  const playlist = [
    { 
      title: completedMissions.length >= 10 ? 'Keygen Music - Retro Chiptune' : '🔑 Keygen Music - Unlocks at 10 Missions', 
      url: 'https://www.youtube.com/watch?v=s3Z-lI7Z19I', 
      locked: completedMissions.length < 10 
    },
    ...basePlaylist
  ];

  const currentSong = playlist[currentSongIndex];

  // Colors based on selected skin
  const skinStyles = {
    classic: { bg: '#2d2d34', accent: '#00e100', wave: '#00ff00' },
    acid: { bg: '#052005', accent: '#33ff33', wave: '#33ff33' },
    neon: { bg: '#333300', accent: '#ffff00', wave: '#ffff00' },
    midnight: { bg: '#000040', accent: '#00ffff', wave: '#00ffff' }
  };
  const colors = skinStyles[selectedSkin] || skinStyles.classic;

  const playWinampSong = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const songNotes = [
        329.63, 329.63, 349.23, 392.00, 392.00, 349.23, 329.63, 293.66,
        261.63, 261.63, 293.66, 329.63, 329.63, 293.66, 293.66
      ];
      let idx = 0;

      audioIntervalRef.current = setInterval(() => {
        timeElapsedRef.current += 0.25;
        const mins = Math.floor(timeElapsedRef.current / 60).toString().padStart(2, '0');
        const secs = Math.floor(timeElapsedRef.current % 60).toString().padStart(2, '0');
        setTimeStr(`${mins}:${secs}`);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(songNotes[idx % songNotes.length], ctx.currentTime);
        
        if (hardware.sound.id === 'speaker') {
          osc.type = 'square';
          gain.gain.setValueAtTime(0.02 * (volume / 100), ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        } else if (hardware.sound.id === 'sb16') {
          osc.type = 'triangle';
          gain.gain.setValueAtTime(0.04 * (volume / 100), ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        } else {
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.05 * (volume / 100), ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.23);

        idx++;
      }, 250);
    } catch (e) {
      console.warn("Winamp audio error: ", e);
    }
  };

  const stopWinampSong = () => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (currentSong.locked) {
        setIsPlaying(false);
        playSound('beep');
        alert('This track is locked! Complete at least 10 missions to unlock keygen music.');
        return;
      }
      playWinampSong();
      localStorage.setItem('winamp_playing', 'true');
    } else {
      stopWinampSong();
    }
    return () => stopWinampSong();
  }, [isPlaying, currentSongIndex, hardware.sound.id, volume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        const barWidth = 4;
        const spacing = 2;
        const numBars = Math.floor(canvas.width / (barWidth + spacing));

        for (let i = 0; i < numBars; i++) {
          const h = Math.random() * (canvas.height - 4) + 2;
          ctx.fillStyle = colors.wave;
          ctx.fillRect(i * (barWidth + spacing), canvas.height - h, barWidth, h);
        }
      } else {
        ctx.strokeStyle = colors.wave;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, colors.wave]);

  const handleNext = () => {
    setCurrentSongIndex(prev => (prev + 1) % playlist.length);
    timeElapsedRef.current = 0;
  };

  const handlePrev = () => {
    setCurrentSongIndex(prev => (prev - 1 + playlist.length) % playlist.length);
    timeElapsedRef.current = 0;
  };

  const watchOnYoutube = () => {
    window.open(currentSong.url, '_blank', 'width=800,height=600');
  };

  const handleSkinChange = (skin) => {
    setSelectedSkin(skin);
    localStorage.setItem('winamp_skin', skin);
    playSound('beep');
  };

  return (
    <div style={{ backgroundColor: colors.bg, color: colors.accent, border: '3px outset #666', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px', fontFamily: 'monospace', gap: '8px', transition: 'all 0.3s ease' }}>
      
      {/* LCD Info Screen */}
      <div className="win-inset" style={{ background: '#000', padding: '6px', display: 'flex', justifyContent: 'space-between', border: '2px solid #555' }}>
        <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
          <div style={{ fontSize: '11px', color: '#ffea00', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {currentSongIndex + 1}. {currentSong.title}.mp3
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.wave, marginTop: '4px' }}>
            {timeStr}
          </div>
        </div>
        
        {/* Canvas Visualizer */}
        <canvas ref={canvasRef} width="100" height="36" className="win-inset" style={{ background: '#000', border: '1px solid #333' }} />
      </div>

      {/* Skin and Volume selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', gap: '6px' }}>
        {credits >= 500 ? (
          <div>
            <span>SKIN: </span>
            <select value={selectedSkin} onChange={(e) => handleSkinChange(e.target.value)} style={{ background: '#fff', color: '#000', fontSize: '9px', border: '1px solid #808080' }}>
              <option value="classic">Classic</option>
              <option value="acid">Acid Green</option>
              <option value="neon">Neon Yellow</option>
              <option value="midnight">Midnight Blue</option>
            </select>
          </div>
        ) : (
          <span style={{ color: '#888' }}>🔒 Skins ($500)</span>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>VOL:</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={(e) => setVolume(Number(e.target.value))} 
            style={{ width: '60px', cursor: 'default' }}
          />
        </div>
      </div>

      {/* Buttons controls */}
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        <button className="win-btn" style={{ minWidth: '40px', fontWeight: 'bold', fontSize: '10px' }} onClick={handlePrev}>◀◀ PREV</button>
        <button className="win-btn" style={{ minWidth: '40px', fontWeight: 'bold', fontSize: '10px' }} onClick={() => setIsPlaying(true)}>▶ PLAY</button>
        <button className="win-btn" style={{ minWidth: '40px', fontWeight: 'bold', fontSize: '10px' }} onClick={() => setIsPlaying(false)}>■ STOP</button>
        <button className="win-btn" style={{ minWidth: '40px', fontWeight: 'bold', fontSize: '10px' }} onClick={handleNext}>NEXT ▶▶</button>
      </div>

      {/* YouTube Button */}
      <button className="win-btn" onClick={watchOnYoutube} style={{ fontWeight: 'bold', width: '100%', padding: '4px', color: '#cc0000', border: '2px outset #fff', fontSize: '10px' }}>
        📺 Play Real Song on YouTube
      </button>

      {/* Playlist Selector */}
      <div className="win-inset" style={{ flex: 1, background: '#000', color: colors.accent, overflowY: 'auto', padding: '4px', textAlign: 'left', minHeight: '80px', maxHeight: '120px', fontSize: '10px', border: '2px solid #555' }}>
        {playlist.map((song, idx) => (
          <div 
            key={idx}
            onDoubleClick={() => {
              setCurrentSongIndex(idx);
              timeElapsedRef.current = 0;
              setIsPlaying(true);
            }}
            style={{ 
              padding: '2px 4px', 
              cursor: 'default',
              background: currentSongIndex === idx ? '#000080' : 'transparent',
              color: currentSongIndex === idx ? '#ffffff' : song.locked ? '#555' : colors.accent
            }}
          >
            {idx + 1}. {song.title}.mp3
          </div>
        ))}
      </div>

      <div style={{ fontSize: '9px', color: '#888', textAlign: 'center' }}>
        WINAMP - IT REALLY WHIPS THE LAMA'S ASS!
      </div>
    </div>
  );
}
