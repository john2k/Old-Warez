import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function Antivirus() {
  const { activeViruses, setActiveViruses, fileSystem, playSound } = useContext(HardwareContext);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState(['Virus database loaded: 14,204 signatures.']);
  const [foundInfections, setFoundInfections] = useState([]);

  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanProgress(0);
    setFoundInfections([]);
    setScanLog(l => [...l, 'STATUS:> Starting full scan of Drive C:\\...']);
    playSound('beep');

    // Gather file names to simulate scanning
    const filesToScan = [];
    const traverseFs = (folder) => {
      Object.entries(folder).forEach(([name, info]) => {
        if (info.type === 'file') {
          filesToScan.push(name);
        } else if (info.type === 'folder') {
          traverseFs(info.files);
        }
      });
    };
    
    // Traverse C drive
    if (fileSystem['C:']?.files) {
      traverseFs(fileSystem['C:'].files);
    }

    let fileIdx = 0;
    const interval = setInterval(() => {
      if (fileIdx < filesToScan.length) {
        const file = filesToScan[fileIdx];
        setScanLog(l => [...l, `Scanning: C:\\...\\${file}`]);
        
        // Mock Virus hit detection: Happy99 file signature match
        if (file.toLowerCase().includes('happy99') && activeViruses.includes('happy99')) {
          setFoundInfections(prev => [...prev, { file, type: 'Happy99 Worm' }]);
          setScanLog(l => [...l, `WARNING:> Found infection: Happy99 Worm in ${file}`]);
        }
        if (file.toLowerCase().includes('keygen') && activeViruses.includes('cascade')) {
          setFoundInfections(prev => [...prev, { file, type: 'Cascade Virus' }]);
          setScanLog(l => [...l, `WARNING:> Found infection: Cascade.A in ${file}`]);
        }

        setScanProgress(Math.min(95, ((fileIdx + 1) / filesToScan.length) * 100));
        fileIdx++;
      } else {
        clearInterval(interval);
        setScanProgress(100);
        setScanning(false);
        setScanLog(l => [
          ...l,
          'STATUS:> Scan complete.',
          `STATUS:> Files scanned: ${filesToScan.length}`,
          `STATUS:> Infections found: ${activeViruses.length}`
        ]);
        playSound('beep');
      }
    }, 180);
  };

  const handleCleanInfections = () => {
    setActiveViruses([]);
    setFoundInfections([]);
    localStorage.setItem('system_cleaned', 'true');
    setScanLog(l => [
      ...l,
      'STATUS:> Quarantine cleaned.',
      'STATUS:> All viruses removed from active RAM memory!'
    ]);
    playSound('beep');
    alert('System clean! Active viruses successfully neutralized.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '12px' }}>
      
      {/* Header */}
      <div style={{ background: '#008000', color: '#fff', padding: '4px', fontWeight: 'bold', borderBottom: '2px solid var(--win-dark-gray)', textAlign: 'left' }}>
        <span>F-PROT Antivirus Scanner for Windows 95</span>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '6px', marginTop: '8px', overflow: 'hidden' }}>
        {/* Controls list */}
        <div className="win-outset" style={{ width: '120px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#ccc' }}>
          <strong>Scan Options:</strong>
          <button className="win-btn" onClick={startScan} disabled={scanning}>Scan Drive C:</button>
          <button className="win-btn" onClick={handleCleanInfections} disabled={activeViruses.length === 0 || scanning}>Clean Viruses</button>
        </div>

        {/* Scan Log Console panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className="win-inset" style={{ flex: 1, backgroundColor: '#000', color: '#00ff00', fontFamily: 'monospace', padding: '6px', overflowY: 'auto', fontSize: '11px', textAlign: 'left' }}>
            {scanLog.map((line, idx) => <p key={idx}>{line}</p>)}
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="win-inset" style={{ flex: 1, height: '18px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: `${scanProgress}%`, height: '100%', background: 'green' }} />
              <span style={{ position: 'absolute', width: '100%', textAlign: 'center', left: 0, top: 1, fontWeight: 'bold', fontSize: '11px', color: scanProgress > 50 ? '#fff' : '#000' }}>
                {Math.round(scanProgress)}% Scan Progress
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
