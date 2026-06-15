import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function Napster() {
  const { playSound, addVirtualFile, isInternetConnected } = useContext(HardwareContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [downloads, setDownloads] = useState({}); // filename -> progress

  const mp3Database = [
    { title: 'Millencolin - No Cigar.mp3', size: '3.4 MB', bytes: 3565100 },
    { title: 'Limp Bizkit - Nookie.mp3', size: '4.1 MB', bytes: 4300000 },
    { title: 'Britney Spears - Baby One More Time.mp3', size: '3.6 MB', bytes: 3770000 },
    { title: 'Metallica - Enter Sandman.mp3', size: '5.2 MB', bytes: 5450000 },
    { title: 'Eminem - My Name Is.mp3', size: '4.2 MB', bytes: 4400000 },
    { title: 'The Offspring - Pretty Fly (For a White Guy).mp3', size: '3.1 MB', bytes: 3200000 },
    { title: 'Blink-182 - All The Small Things.mp3', size: '2.8 MB', bytes: 2900000 },
    { title: 'Rage Against The Machine - Guerrilla Radio.mp3', size: '3.3 MB', bytes: 3450000 }
  ];

  const handleSearch = () => {
    if (!isInternetConnected) {
      playSound('beep');
      alert('Napster Error: You must establish a internet connection first! Double-click "Dial-Up Connection" on Desktop.');
      return;
    }

    setIsSearching(true);
    localStorage.setItem('napster_searched', 'true');
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const filtered = mp3Database.filter(mp3 => 
        mp3.title.toLowerCase().includes(query)
      );
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const startDownload = (mp3) => {
    if (downloads[mp3.title] !== undefined) return;

    playSound('beep');
    setDownloads(prev => ({ ...prev, [mp3.title]: 0 }));

    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setDownloads(prev => ({ ...prev, [mp3.title]: Math.min(prog, 100) }));

      if (prog >= 100) {
        clearInterval(interval);
        const base = mp3.title.replace('.mp3', '');
        addVirtualFile('C:', 'Downloads', mp3.title, mp3.bytes, `MP3 audio content of ${mp3.title}`);
        addVirtualFile('C:', 'Downloads', `${base}.nfo`, 800, `Artist: ${base.split(' - ')[0]}\nTitle: ${base.split(' - ')[1]}\nGenre: Retro\nBitrate: 128 kbps (joint-stereo)\nSize: ${mp3.size}`);
        addVirtualFile('C:', 'Downloads', `${base}.m3u`, 100, `#EXTM3U\n#EXTINF:180,${base}\n${mp3.title}`);
        addVirtualFile('C:', 'Downloads', `${base}.sfv`, 150, `; sfv created by Napster\n${mp3.title} C2B93D0E`);
        playSound('beep');
      }
    }, 150);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      {/* Brand Header */}
      <div style={{ background: '#000080', color: '#fff', padding: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>🐱🎧</span>
        <span>Napster v2.0 Beta - Share Your Music</span>
      </div>

      {/* Navigation tabs */}
      <div style={{ display: 'flex', gap: '2px', background: '#ccc', padding: '4px 4px 0 4px', borderBottom: '1px solid #808080' }}>
        <button className="win-btn pressed" style={{ padding: '2px 12px' }}>Search</button>
        <button className="win-btn" style={{ padding: '2px 12px' }} disabled>Transfer</button>
        <button className="win-btn" style={{ padding: '2px 12px' }} disabled>Chat</button>
      </div>

      {/* Main search body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px', gap: '8px', minHeight: 0 }}>
        
        {/* Search input bar */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span>Search for MP3 Audio Files:</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="win-input"
            style={{ flex: 1, background: '#fff' }}
            placeholder="e.g. blink, Spears, metallica..."
          />
          <button className="win-btn" onClick={handleSearch} style={{ padding: '2px 12px', fontWeight: 'bold' }}>Find</button>
        </div>

        {/* Results grid */}
        <div className="win-inset" style={{ flex: 1, background: '#fff', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr style={{ background: '#dfdfdf', borderBottom: '1px solid #808080', textAlign: 'left' }}>
                <th style={{ padding: '4px' }}>Filename</th>
                <th style={{ padding: '4px' }}>Size</th>
                <th style={{ padding: '4px', width: '120px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isSearching ? (
                <tr>
                  <td colSpan="3" style={{ padding: '12px', textAlign: 'center', color: '#555' }}>Searching Napster Peer-to-Peer Network...</td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '12px', textAlign: 'center', color: '#555' }}>No files found. Enter query and click Find.</td>
                </tr>
              ) : (
                results.map((mp3, idx) => {
                  const progress = downloads[mp3.title];
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '4px' }}>{mp3.title}</td>
                      <td style={{ padding: '4px' }}>{mp3.size}</td>
                      <td style={{ padding: '4px' }}>
                        {progress === undefined ? (
                          <button className="win-btn" onClick={() => startDownload(mp3)} style={{ padding: '0 8px', fontSize: '9px' }}>Download</button>
                        ) : progress < 100 ? (
                          <div style={{ width: '100px', height: '12px', border: '1px solid #808080', position: 'relative' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: '#000080' }} />
                            <span style={{ position: 'absolute', width: '100%', textAlign: 'center', fontSize: '8px', top: -1, color: progress > 50 ? '#fff' : '#000' }}>
                              {progress}%
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
