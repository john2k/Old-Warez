import React, { useState, useEffect, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function CuteFtpWindow() {
  const { hardware, playSound, addVirtualFile } = useContext(HardwareContext);
  const [ftpLog, setFtpLog] = useState([
    'STATUS:>  Connecting to FTP site ftp.scene-warez.org:21...',
    'STATUS:>  Socket connected. Waiting for welcome message...',
    '220-Welcome to SceneWarez Private FTP.',
    '220-Ratio is enforced at 1:3 (Upload 1MB to download 3MB).',
    'USER anonymous',
    '331 Guest login ok, send your email address as password.',
    'PASS anonymous@retro-web.com',
    '230 Guest login ok, access restrictions apply.',
    'STATUS:>  Login successful.'
  ]);
  const [localFiles, setLocalFiles] = useState([
    { name: 'my_mp3_cover.jpg', size: 150000, type: 'file' },
    { name: 'backup.zip', size: 850000, type: 'file' }
  ]);
  const [remoteFiles, setRemoteFiles] = useState([
    { name: 'Warcraft2_crk.ppf', size: 450000, type: 'file' },
    { name: 'duke3d_sound_patch.zip', size: 1200000, type: 'file' },
    { name: 'happy99_installer.exe', size: 230000, type: 'file' } // infected file!
  ]);

  const [bytesUploaded, setBytesUploaded] = useState(0);
  const [bytesDownloaded, setBytesDownloaded] = useState(0);

  const [activeLocal, setActiveLocal] = useState(null);
  const [activeRemote, setActiveRemote] = useState(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferFile, setTransferFile] = useState('');
  const [transferProgress, setTransferProgress] = useState(0);

  const calculatedRatio = bytesUploaded === 0 ? 0 : bytesDownloaded / bytesUploaded;
  const ratioLimit = 3.0;

  const handleUpload = () => {
    if (!activeLocal || isTransferring) return;
    const file = localFiles.find(f => f.name === activeLocal);
    if (!file) return;

    setIsTransferring(true);
    setTransferFile(`Uploading ${file.name}`);
    setTransferProgress(0);

    const baseSpeed = hardware.modem.speedKbps * 128; // Kbps to Bytes/sec
    const isNostalgiaSpeed = localStorage.getItem('nostalgia_speed') !== 'real';
    const speed = isNostalgiaSpeed ? baseSpeed * 25 : baseSpeed;

    const timer = setInterval(() => {
      setTransferProgress(prev => {
        const next = prev + (speed / file.size) * 10;
        if (next >= 100) {
          clearInterval(timer);
          setIsTransferring(false);
          setBytesUploaded(p => p + file.size);
          setFtpLog(l => [
            ...l,
            `STOR ${file.name}`,
            `150 Opening BINARY mode data connection for ${file.name}.`,
            `226 Transfer complete. Uploaded ${file.size} bytes.`
          ]);
          playSound('beep');
          return 100;
        }
        return next;
      });
    }, 100);
  };

  const handleDownload = () => {
    if (!activeRemote || isTransferring) return;
    const file = remoteFiles.find(f => f.name === activeRemote);
    if (!file) return;

    // Check ratio
    const potentialRatio = bytesUploaded === 0 ? 999 : (bytesDownloaded + file.size) / bytesUploaded;
    if (potentialRatio > ratioLimit && bytesUploaded === 0) {
      setFtpLog(l => [
        ...l,
        `ERROR:> Download rejected: Ratio Exceeded (1:3 limit). Please upload some files first!`
      ]);
      playSound('beep');
      return;
    }

    setIsTransferring(true);
    setTransferFile(`Downloading ${file.name}`);
    setTransferProgress(0);

    const baseSpeed = hardware.modem.speedKbps * 128; // Kbps to Bytes/sec
    const isNostalgiaSpeed = localStorage.getItem('nostalgia_speed') !== 'real';
    const speed = isNostalgiaSpeed ? baseSpeed * 25 : baseSpeed;

    const timer = setInterval(() => {
      setTransferProgress(prev => {
        const next = prev + (speed / file.size) * 10;
        if (next >= 100) {
          clearInterval(timer);
          setIsTransferring(false);
          setBytesDownloaded(p => p + file.size);
          
          // Save downloaded file to virtual downloads folder
          addVirtualFile('C:', 'Downloads', file.name, file.size, `FTP Downloaded ${file.name}`);
          
          setFtpLog(l => [
            ...l,
            `RETR ${file.name}`,
            `150 Opening BINARY mode data connection for ${file.name}.`,
            `226 Transfer complete. Downloaded ${file.size} bytes.`
          ]);
          playSound('beep');
          return 100;
        }
        return next;
      });
    }, 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)' }}>
      {/* FTP connection log screen */}
      <div className="win-inset" style={{ height: '100px', backgroundColor: '#000', color: '#00ff00', fontFamily: 'monospace', padding: '6px', overflowY: 'auto', fontSize: '11px', textAlign: 'left', marginBottom: '4px' }}>
        {ftpLog.map((line, idx) => <p key={idx}>{line}</p>)}
      </div>

      {/* Pane Layout */}
      <div style={{ display: 'flex', flex: 1, gap: '4px', overflow: 'hidden' }}>
        {/* Local pane */}
        <div className="win-inset" style={{ flex: 1, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: 'var(--win-blue)', color: '#fff', padding: '2px', fontSize: '11px', fontWeight: 'bold' }}>
            Local Drive (C:\My Documents)
          </div>
          <div style={{ flex: 1, overflowY: 'auto', textAlign: 'left', fontSize: '12px' }}>
            {localFiles.map(file => (
              <div 
                key={file.name} 
                onClick={() => setActiveLocal(file.name)}
                style={{ padding: '4px', cursor: 'default', background: activeLocal === file.name ? 'var(--win-blue)' : 'transparent', color: activeLocal === file.name ? '#fff' : '#000' }}
              >
                📄 {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </div>
            ))}
          </div>
        </div>

        {/* Transfer buttons center */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', gap: '8px', padding: '4px' }}>
          <button className="win-btn" onClick={handleUpload} disabled={!activeLocal || isTransferring} style={{ minWidth: '36px' }}>➔</button>
          <button className="win-btn" onClick={handleDownload} disabled={!activeRemote || isTransferring} style={{ minWidth: '36px' }}>&lt;─</button>
        </div>

        {/* Remote pane */}
        <div className="win-inset" style={{ flex: 1, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: 'var(--win-blue)', color: '#fff', padding: '2px', fontSize: '11px', fontWeight: 'bold' }}>
            Remote FTP Site (/)
          </div>
          <div style={{ flex: 1, overflowY: 'auto', textAlign: 'left', fontSize: '12px' }}>
            {remoteFiles.map(file => (
              <div 
                key={file.name} 
                onClick={() => setActiveRemote(file.name)}
                style={{ padding: '4px', cursor: 'default', background: activeRemote === file.name ? 'var(--win-blue)' : 'transparent', color: activeRemote === file.name ? '#fff' : '#000' }}
              >
                📄 {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress & ratio display */}
      <div className="win-outset" style={{ padding: '6px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <div>
          <span>Ratio: <strong>{calculatedRatio === 0 ? '0' : calculatedRatio.toFixed(2)}</strong> / {ratioLimit} limit</span>
          <span style={{ marginLeft: '12px' }}>Uploaded: <strong>{(bytesUploaded / 1024).toFixed(0)} KB</strong></span>
        </div>
        
        {isTransferring && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{transferFile}</span>
            <div className="win-inset" style={{ width: '80px', height: '14px', background: '#fff', overflow: 'hidden' }}>
              <div style={{ width: `${transferProgress}%`, height: '100%', background: 'var(--win-blue)' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
