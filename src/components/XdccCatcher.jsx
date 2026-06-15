import React, { useState, useContext, useEffect } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function XdccCatcher() {
  const { addVirtualFile, playSound, isInternetConnected } = useContext(HardwareContext);
  const [search, setSearch] = useState('');
  const [selectedPack, setSelectedPack] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [log, setLog] = useState(['XDCC Catcher v1.2 initialized.', 'Ready to capture mIRC IRC triggers...']);

  const packs = [
    { num: 1, name: 'flt-doom.rar (Doom Release)', prefix: 'flt-doom', size: '4.5MB', files: ['flt-doom.rar', 'flt-doom.r00', 'flt-doom.r01', 'flt-doom.sfv', 'flt-doom.nfo', 'file_id.diz'] },
    { num: 2, name: 'pcp-duke3d.rar (Duke3D Release)', prefix: 'pcp-duke3d', size: '4.2MB', files: ['pcp-duke3d.rar', 'pcp-duke3d.r00', 'pcp-duke3d.r01', 'pcp-duke3d.sfv', 'pcp-duke3d.nfo', 'file_id.diz'] },
    { num: 3, name: 'rld-quake.rar (Quake Release)', prefix: 'rld-quake', size: '4.8MB', files: ['rld-quake.rar', 'rld-quake.r00', 'rld-quake.r01', 'rld-quake.sfv', 'rld-quake.nfo', 'file_id.diz'] },
    { num: 4, name: 'wc2-crk.rar (Warcraft II Release)', prefix: 'wc2-crk', size: '4.1MB', files: ['wc2-crk.rar', 'wc2-crk.r00', 'wc2-crk.r01', 'wc2-crk.sfv', 'wc2-crk.nfo', 'file_id.diz'] },
    { num: 5, name: 'ccd-diablo.rar (Diablo Release)', prefix: 'ccd-diablo', size: '5.2MB', files: ['ccd-diablo.rar', 'ccd-diablo.r00', 'ccd-diablo.r01', 'ccd-diablo.sfv', 'ccd-diablo.nfo', 'file_id.diz'] },
    { num: 6, name: 'rzr-starcraft.rar (StarCraft Release)', prefix: 'rzr-starcraft', size: '5.8MB', files: ['rzr-starcraft.rar', 'rzr-starcraft.r00', 'rzr-starcraft.r01', 'rzr-starcraft.sfv', 'rzr-starcraft.nfo', 'file_id.diz'] },
    { num: 7, name: 'wz62-dgt.rar (WinZip Keygen Release)', prefix: 'wz62-dgt', size: '1.2MB', files: ['wz62-dgt.rar', 'wz62-dgt.r00', 'wz62-dgt.r01', 'wz62-dgt.sfv', 'wz62-dgt.nfo', 'file_id.diz'] }
  ];

  const handleGrab = (pack) => {
    if (!isInternetConnected) {
      alert('Error: Establish ISP Dial-Up connection first.');
      return;
    }
    if (downloading) return;
    
    setSelectedPack(pack);
    setDownloading(true);
    setProgress(0);
    setLog(prev => [...prev, `[XDCC] Sending trigger: "/ctcp WarezBot xdcc send #${pack.num}"`]);
    playSound('beep');

    let fileIdx = 0;
    const processNextFile = () => {
      if (fileIdx < pack.files.length) {
        const file = pack.files[fileIdx];
        setCurrentFile(file);
        setLog(prev => [...prev, `[XDCC] Downloading part: ${file}...`]);

        let fileProg = 0;
        const fileInterval = setInterval(() => {
          fileProg += 10;
          setProgress(fileProg);

          if (fileProg >= 100) {
            clearInterval(fileInterval);
            
            // Add virtual file to Downloads
            let content = 'RAR archive contents';
            let size = 1450000;
            if (file.endsWith('.sfv')) {
              content = `; sfv file\n${pack.prefix}.rar A5C392B1\n${pack.prefix}.r00 B211D4E0\n${pack.prefix}.r01 F33C8B90`;
              size = 250;
            } else if (file.endsWith('.nfo')) {
              content = `[RELEASE INFO]\nGroup: Scene\nType: Game\n\nInstall Notes:\n1. Unpack RARs\n2. Run play.bat\n3. Enjoy!`;
              size = 2100;
            } else if (file === 'file_id.diz') {
              content = `[${pack.prefix.toUpperCase()} RELEASE]\nScene release of classic game.\nGrabbed by XDCC Catcher.`;
              size = 400;
            }
            
            addVirtualFile('C:', 'Downloads', file, size, content);
            setLog(prev => [...prev, `[XDCC] Completed: ${file} saved to C:\\Downloads.`]);
            playSound('beep');

            fileIdx++;
            setTimeout(processNextFile, 300);
          }
        }, 120);
      } else {
        setDownloading(false);
        setCurrentFile('');
        setProgress(100);
        setLog(prev => [...prev, `[XDCC] Batch grab complete! Extracted all parts for ${pack.name} to C:\\Downloads.`]);
        alert(`[XDCC Catcher] Successfully grabbed and combined pack #${pack.num}!`);
      }
    };

    setTimeout(processNextFile, 800);
  };

  const filteredPacks = packs.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '11px', color: '#000', fontFamily: 'var(--font-win)', textAlign: 'left' }}>
      
      {/* Header */}
      <div style={{ background: '#004080', color: '#fff', padding: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--win-dark-gray)' }}>
        <span>🤖 XDCC Catcher v1.2 - Automated Pack Grabber</span>
        <span>Connected to #warez-classic</span>
      </div>

      {/* Search and Layout */}
      <div style={{ display: 'flex', gap: '6px', margin: '6px 0', alignItems: 'center' }}>
        <span>Search Packs:</span>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="win-input" 
          style={{ flex: 1, background: '#fff' }} 
          placeholder="e.g. doom, warcraft..."
        />
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '6px', overflow: 'hidden' }}>
        {/* Left: Pack list */}
        <div className="win-inset" style={{ flex: 1.2, background: '#fff', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr style={{ background: '#dfdfdf', borderBottom: '1px solid #808080', textAlign: 'left' }}>
                <th style={{ padding: '4px' }}>Pack #</th>
                <th style={{ padding: '4px' }}>Pack Name</th>
                <th style={{ padding: '4px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacks.map(p => (
                <tr key={p.num} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '4px' }}>#{p.num}</td>
                  <td style={{ padding: '4px' }}>{p.name} ({p.size})</td>
                  <td style={{ padding: '4px' }}>
                    <button className="win-btn" onClick={() => handleGrab(p)} disabled={downloading} style={{ fontSize: '9px', padding: '1px 6px' }}>Grab</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Grab Console Log */}
        <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className="win-inset" style={{ flex: 1, background: '#000', color: '#00ff00', fontFamily: 'monospace', padding: '6px', overflowY: 'auto', fontSize: '10px' }}>
            {log.map((line, idx) => <div key={idx} style={{ wordBreak: 'break-all' }}>{line}</div>)}
          </div>

          {/* Grab Progress */}
          {downloading && (
            <div className="win-outset" style={{ padding: '6px', background: '#ccc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '9px' }}>
                <span>Downloading: {currentFile}</span>
                <span>{progress}%</span>
              </div>
              <div className="win-inset" style={{ height: '12px', background: '#fff', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#004080' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
