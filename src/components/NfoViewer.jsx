import React from 'react';

export default function NfoViewer({ nfoContent, onClose }) {
  const defaultNfo = `
   ▄████████  ▄██████▄   ▄██████▄  ████████▄  ███    █▄  
  ███    ███ ███    ███ ███    ███ ███    ███ ███    ███ 
  ███    █▀  ███    ███ ███    ███ ███    ███ ███    ███ 
 ▄███▄▄▄     ███    ███ ███    ███ ███    ███ ███    ███ 
▀▀███▀▀▀     ███    ███ ███    ███ ███    ███ ███    ███ 
  ███    █▄  ███    ███ ███    ███ ███    ███ ███    ███ 
  ███    ███ ███    ███ ███    ███ ███    ███ ███    ███ 
  ████████▀   ▀██████▀   ▀██████▀  ████████▀  ████████▀  
  
             CLOUDS WAREZ GROUP PRESENTS
  ┌─────────────────────────────────────────────────────┐
  │ Release Name..: Warcraft II Tides of Darkness       │
  │ Release Date..: 11-15-1995                         │
  │ File Size.....: 2 x 2.8 MB Parts                    │
  │ Protection....: CD-Key / Serial Code Check         │
  └─────────────────────────────────────────────────────┘
  
  [ INSTALLATION NOTES ]
  1. Extract split files doom.zip.001 / warcraft2.zip.001 using WinZip.
  2. Launch keygen.exe from the extracted game directory.
  3. Generate a CD-Key serial code and copy it.
  4. Run setup.exe to configure SoundBlaster hardware:
     - SoundBlaster 16: Port 220, IRQ 5, DMA 1
  5. Run play.bat to launch game. Linking to dos.zone emulator.
  
  * Group Greetz to MYTH, RADIUM, FLT, DEVIANCE, AND CLASS!
  `;

  const finalContent = nfoContent || defaultNfo;

  return (
    <div style={{ backgroundColor: '#050505', color: '#ffffff', border: '3px outset #444', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px', fontFamily: 'monospace' }}>
      {/* NFO Toolbar */}
      <div style={{ background: '#222', padding: '4px', borderBottom: '1px solid #555', display: 'flex', gap: '8px', fontSize: '11px' }}>
        <button className="win-btn" style={{ background: '#333', color: '#fff' }} onClick={() => {
          navigator.clipboard.writeText(finalContent);
          alert('NFO Text Copied!');
        }}>Copy ASCII</button>
      </div>

      {/* ASCII View pane */}
      <pre className="win-inset" style={{ flex: 1, backgroundColor: '#000', color: '#00ff00', padding: '12px', overflow: 'auto', fontSize: '11px', textAlign: 'left', lineHeight: 1.15, whiteSpace: 'pre' }}>
        {finalContent}
      </pre>
    </div>
  );
}
