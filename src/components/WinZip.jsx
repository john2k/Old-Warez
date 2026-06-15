import React, { useState, useContext, useEffect } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function WinZip({ archiveName, onExtractComplete }) {
  const { addVirtualFile, playSound, hardware } = useContext(HardwareContext);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState([]);
  
  const archive = archiveName ? archiveName.toLowerCase() : 'flt-doom.rar';
  const isRar = archive.endsWith('.rar') || archive.includes('.r0');
  
  let defaultFolder = 'Doom';
  if (archive.includes('duke')) defaultFolder = 'Duke3D';
  else if (archive.includes('warcraft') || archive.includes('wc2')) defaultFolder = 'Warcraft2';
  else if (archive.includes('quake') || archive.includes('rld')) defaultFolder = 'Quake';
  else if (archive.includes('diablo') || archive.includes('ccd') || archive.includes('d1')) defaultFolder = 'Diablo';
  else if (archive.includes('starcraft') || archive.includes('rzr')) defaultFolder = 'StarCraft';
  else if (archive.includes('nfs') || archive.includes('speed')) defaultFolder = 'NeedForSpeed';
  else if (archive.includes('pinball') || archive.includes('pb')) defaultFolder = 'Pinball';
  else if (archive.includes('age') || archive.includes('aoe')) defaultFolder = 'AgeOfEmpires';
  else if (archive.includes('simcity') || archive.includes('sc2k')) defaultFolder = 'SimCity2000';
  else if (archive.includes('cnc')) defaultFolder = 'CommandAndConquer';
  else if (archive.includes('hl') || archive.includes('valve') || archive.includes('halflife')) defaultFolder = 'HalfLife';
  else if (archive.includes('winzip') || archive.includes('wz62')) defaultFolder = 'WinZip';

  const [unzipPath, setUnzipPath] = useState(`C:\\GAMES\\${defaultFolder}`);

  useEffect(() => {
    setUnzipPath(`C:\\GAMES\\${defaultFolder}`);
    setLogLines([]);
    setProgress(0);
    setExtracting(false);
  }, [archiveName]);

  const startExtraction = () => {
    if (extracting) return;

    // Resolve prefix
    let prefix = 'wz62-dgt';
    if (archive.includes('doom')) prefix = 'flt-doom';
    else if (archive.includes('duke')) prefix = 'pcp-duke3d';
    else if (archive.includes('wc2') || archive.includes('warcraft')) prefix = 'wc2-crk';
    else if (archive.includes('qke') || archive.includes('quake')) prefix = 'rzr-qke';
    else if (archive.includes('db') || archive.includes('diablo')) prefix = 'cnd-db';
    else if (archive.includes('sc') || archive.includes('starcraft')) prefix = 'cls-sc';
    else if (archive.includes('hl') || archive.includes('halflife')) prefix = 'dev-hl';
    else if (archive.includes('ut') || archive.includes('unreal')) prefix = 'flt-ut';
    else if (archive.includes('dx') || archive.includes('deus')) prefix = 'myth-dx';
    else if (archive.includes('nfs') || archive.includes('scene')) prefix = 'nfs-scene';
    else if (archive.includes('aoe') || archive.includes('age')) prefix = 'aoe-crk';
    else if (archive.includes('sc2k') || archive.includes('simcity')) prefix = 'sc2k-el';
    else if (archive.includes('cnc')) prefix = 'cnc-remix';
    else if (archive.includes('wz62') || archive.includes('winzip')) prefix = 'wz62-dgt';

    const verified = localStorage.getItem(`sfv_verified_${prefix}`) === 'true';
    if (!verified) {
      playSound('beep');
      alert(`CRC32 INTEGRITY ERROR!\n\nCannot extract "${archive}" because the Simple File Verification checksum has not been validated.\n\nPlease launch "QuickSFV" from your Start Menu or Desktop to scan and verify the file checksums first!`);
      return;
    }

    setExtracting(true);
    setProgress(0);
    setLogLines([]);
    playSound('beep');

    const lines = [];
    if (isRar) {
      lines.push(`Opening multi-part RAR archive: ${archive}`);
      lines.push("Locating volume parts...");
    } else {
      lines.push(`Opening ZIP self-extracting archive: ${archive}`);
    }
    setLogLines([...lines]);

    const steps = isRar ? [
      { pct: 10, msg: "Scanning: part 1 (wz62-dgt.rar / *.rar)... Found." },
      { pct: 25, msg: "Scanning: part 2 (*.r00)... Found." },
      { pct: 40, msg: "Scanning: part 3 (*.r01)... Found." },
      { pct: 55, msg: "SFV CRC32 Checksum verification: OK." },
      { pct: 70, msg: "Decompressing files..." },
      { pct: 90, msg: "Creating destination directory and writing files..." },
      { pct: 100, msg: "Done!" }
    ] : [
      { pct: 20, msg: "Reading file tables..." },
      { pct: 50, msg: "Inflating files..." },
      { pct: 80, msg: "Creating destination directory..." },
      { pct: 100, msg: "Done!" }
    ];

    let currentStep = 0;
    const intervalTime = Math.max(15, 150 / hardware.cpu.speedMultiplier);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 4;
        
        // Check if we hit a step milestone
        if (currentStep < steps.length && next >= steps[currentStep].pct) {
          const stepMsg = steps[currentStep].msg;
          // Make file names match the actual prefix if game
          let processedMsg = stepMsg;
          if (isRar && archive.includes('-')) {
            const prefix = archive.split('.')[0];
            processedMsg = stepMsg
              .replace('wz62-dgt.rar', `${prefix}.rar`)
              .replace('*.rar', `${prefix}.rar`)
              .replace('*.r00', `${prefix}.r00`)
              .replace('*.r01', `${prefix}.r01`);
          }
          setLogLines(prevLines => [...prevLines, processedMsg]);
          currentStep++;
        }

        if (next >= 100) {
          clearInterval(timer);
          setExtracting(false);
          playSound('beep');

          // Parse target directory
          let targetPath = unzipPath.trim();
          if (!targetPath) targetPath = `C:\\GAMES\\${defaultFolder}`;
          
          let drive = 'C:';
          let pathStr = 'GAMES/' + defaultFolder;

          if (targetPath.length >= 2 && targetPath[1] === ':') {
            drive = targetPath.substring(0, 2);
            let rawPath = targetPath.substring(2);
            pathStr = rawPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
          }

          let files = {
            'play.bat': 'Run game shortcut',
            'setup.exe': 'Sound configuration utility',
            'readme.txt': `Installation log for ${defaultFolder}`
          };

          if (archive.includes('winzip') || archive.includes('wz62')) {
            files = { 
              'keygen.exe': 'Keygen app for WinZip',
              'install.txt': 'Please launch keygen.exe to register your WinZip 6.2 program!'
            };
          }

          // Write files
          Object.entries(files).forEach(([name, content]) => {
            addVirtualFile(drive, pathStr, name, 15000, content);
          });

          alert(`Successfully extracted archive to ${drive}\\${pathStr.replace(/\//g, '\\')}!`);
          if (onExtractComplete) onExtractComplete(defaultFolder);
          return 100;
        }
        return next;
      });
    }, intervalTime);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '16px', fontSize: '12px', fontFamily: 'var(--font-win)', color: '#000' }}>
      
      {/* Title */}
      <div className="win-inset" style={{ padding: '6px', background: isRar ? '#800000' : '#000080', color: '#fff', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>{isRar ? 'WinRAR(R) Archive Extractor' : 'WinZip(R) Self-Extractor'} - {archiveName || 'Archive.rar'}</span>
      </div>

      <div className="win-outset" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', minHeight: 0 }}>
        <p style={{ margin: 0 }}>
          This utility will extract the contents of the archive <strong>{archiveName || 'Archive.rar'}</strong> to the destination path below:
        </p>
        
        {/* Destination target input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span>Destination folder:</span>
          <input 
            type="text" 
            value={unzipPath} 
            onChange={(e) => setUnzipPath(e.target.value)}
            disabled={extracting}
            style={{ width: '100%', padding: '3px 6px', fontSize: '11px', background: '#fff', border: '1px solid #808080', fontFamily: 'monospace' }}
          />
        </div>

        {/* Console / Log area */}
        <div className="win-inset" style={{ flex: 1, background: '#000', color: '#0f0', fontFamily: 'monospace', padding: '6px', overflowY: 'auto', fontSize: '11px', minHeight: '80px' }}>
          {logLines.length === 0 ? (
            <span style={{ color: '#666' }}>Ready to extract. Click Extract button below.</span>
          ) : (
            logLines.map((line, idx) => (
              <div key={idx} style={{ lineBreak: 'anywhere' }}>{line}</div>
            ))
          )}
        </div>

        {!extracting ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button className="win-btn" onClick={startExtraction} style={{ fontWeight: 'bold', width: '120px', padding: '4px' }}>
              Extract / Unpack
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <span>Extracting...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="win-inset" style={{ height: '16px', background: '#fff', overflow: 'hidden', marginTop: '2px' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: isRar ? '#800000' : 'var(--win-blue)' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
