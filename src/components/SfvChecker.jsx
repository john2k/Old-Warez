import React, { useState, useEffect, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function SfvChecker() {
  const { fileSystem, playSound } = useContext(HardwareContext);
  const [sfvFiles, setSfvFiles] = useState([]);
  const [selectedSfv, setSelectedSfv] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verificationResults, setVerificationResults] = useState([]); // [{ name, status: 'pending' | 'ok' | 'missing' }]
  const [statusMessage, setStatusMessage] = useState('Select an SFV file to verify.');

  // Scan C:\Downloads for sfv files
  useEffect(() => {
    const downloads = fileSystem['C:']?.files?.['Downloads']?.files || {};
    const sfvList = Object.keys(downloads).filter(k => k.toLowerCase().endsWith('.sfv'));
    setSfvFiles(sfvList);
    if (sfvList.length > 0 && !selectedSfv) {
      setSelectedSfv(sfvList[0]);
    }
  }, [fileSystem, selectedSfv]);

  // Load files contained inside the selected SFV file
  useEffect(() => {
    if (!selectedSfv) {
      setVerificationResults([]);
      return;
    }

    const downloads = fileSystem['C:']?.files?.['Downloads']?.files || {};
    const sfvFile = downloads[selectedSfv];
    if (!sfvFile || !sfvFile.content) {
      setVerificationResults([]);
      return;
    }

    // Parse files from SFV content (lines format: filename crc32)
    const lines = sfvFile.content.split('\n');
    const filesToVerify = [];
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(';')) return;
      const parts = trimmed.split(/\s+/);
      if (parts.length > 0) {
        filesToVerify.push({ name: parts[0], status: 'pending' });
      }
    });

    setVerificationResults(filesToVerify);
    setStatusMessage(`Ready to verify ${filesToVerify.length} file(s).`);
    setProgress(0);
    setVerifying(false);
  }, [selectedSfv, fileSystem]);

  const handleVerify = () => {
    if (verificationResults.length === 0 || verifying) return;
    setVerifying(true);
    setProgress(0);
    setStatusMessage('QuickSFV v1.2: Checking CRC32 checksums...');

    const downloads = fileSystem['C:']?.files?.['Downloads']?.files || {};
    let currentIdx = 0;
    const totalFiles = verificationResults.length;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(100, prev + (100 / totalFiles));
        
        // Update status of the current file in the list
        if (currentIdx < totalFiles) {
          const fileToVerify = verificationResults[currentIdx];
          const exists = downloads[fileToVerify.name] !== undefined;
          
          setVerificationResults(prevResults => 
            prevResults.map((r, i) => 
              i === currentIdx 
                ? { ...r, status: exists ? 'ok' : 'missing' } 
                : r
            )
          );
          
          if (exists) {
            playSound('beep');
          } else {
            playSound('beep'); // simple buzz or alert sound
          }
          currentIdx++;
        }

        if (next >= 100) {
          clearInterval(interval);
          setVerifying(false);
          
          // Check if everything is OK
          const hasMissing = verificationResults.some(r => {
            const exists = downloads[r.name] !== undefined;
            return !exists;
          });

          if (!hasMissing && totalFiles > 0) {
            const archivePrefix = selectedSfv.replace('.sfv', '');
            localStorage.setItem(`sfv_verified_${archivePrefix}`, 'true');
            setStatusMessage('SUCCESS: All files verified! Checksums match (CRC32 OK).');
            playSound('beep');
          } else {
            setStatusMessage('ERROR: Some files are missing or contain CRC mismatch errors!');
          }
        }
        return next;
      });
    }, 150);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      <div style={{ background: '#000080', color: '#fff', padding: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>QuickSFV v1.2 - Simple File Verification</span>
        <span>CRC32 Checker</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
        <span>SFV File:</span>
        <select 
          value={selectedSfv} 
          onChange={(e) => setSelectedSfv(e.target.value)} 
          disabled={verifying}
          style={{ flex: 1, background: '#fff', border: '1px solid #808080', padding: '2px' }}
        >
          {sfvFiles.length === 0 ? (
            <option value="">(No .sfv files found in C:\Downloads)</option>
          ) : (
            sfvFiles.map(f => <option key={f} value={f}>{f}</option>)
          )}
        </select>
        <button 
          className="win-btn" 
          onClick={handleVerify} 
          disabled={verifying || sfvFiles.length === 0} 
          style={{ fontWeight: 'bold', padding: '2px 10px' }}
        >
          Verify SFV
        </button>
      </div>

      {/* Verification Logs list */}
      <div className="win-inset" style={{ flex: 1, backgroundColor: '#000', color: '#0f0', fontFamily: 'monospace', padding: '8px', overflowY: 'auto', marginBottom: '8px' }}>
        {verificationResults.length === 0 ? (
          <div style={{ color: '#888' }}>Download file packs with a .sfv file via mIRC DCC Chat to run verification checks.</div>
        ) : (
          verificationResults.map(r => (
            <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{r.name} .....................................</span>
              {r.status === 'pending' && <span style={{ color: '#888' }}>PENDING</span>}
              {r.status === 'ok' && <span style={{ color: '#0f0', fontWeight: 'bold' }}>OK</span>}
              {r.status === 'missing' && <span style={{ color: '#f55', fontWeight: 'bold' }}>MISSING</span>}
            </div>
          ))
        )}
      </div>

      {/* Bottom Progress and Status */}
      <div className="win-outset" style={{ padding: '6px', background: '#ccc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>{statusMessage}</div>
        {verifying && (
          <div className="win-inset" style={{ height: '14px', background: '#fff', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--win-blue)' }} />
            <span style={{ position: 'absolute', width: '100%', textAlign: 'center', left: 0, top: 0, fontWeight: 'bold', fontSize: '9px', color: progress > 50 ? '#fff' : '#000' }}>
              {Math.round(progress)}% Verified
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
