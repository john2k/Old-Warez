import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function NfoGen() {
  const { addVirtualFile, playSound } = useContext(HardwareContext);
  const [group, setGroup] = useState('CLASSIC_WAREZ');
  const [title, setTitle] = useState('Game Title');
  const [notes, setNotes] = useState('Unpack & enjoy!');
  const [artType, setArtType] = useState('heavy');

  const getBorder = (side) => {
    if (artType === 'heavy') return side === 'top' ? '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄' : '▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀';
    if (artType === 'light') return side === 'top' ? '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░' : '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░';
    return side === 'top' ? '=======================================' : '=======================================';
  };

  const generateNfoText = () => {
    const border = getBorder('top');
    const borderBottom = getBorder('bottom');
    return `${border}
  █   ▄▄▄▄▄   ▄▄▄▄▄  ▄▄▄▄▄  ███▄ ▄███   █
  █  ██       ██     ██     ██ ▀█▀ ██   █
  █  ██  ███  ████   ████   ██  ▀  ██   █
  █  ██   ██  ██     ██     ██     ██   █
  █   ▀▀▀▀▀   ▀▀▀▀▀  ▀▀▀▀▀  ██     ██   █
${border}
  [RELEASE INFO]
  Group:       ${group.toUpperCase()}
  Title:       ${title}
  Date:        1998-04-12
  
  [INSTALLATION NOTES]
  ${notes}
  
  Greets: all BBS Sysops & dialup users!
${borderBottom}`;
  };

  const handleSave = () => {
    const text = generateNfoText();
    const fileName = `${title.toLowerCase().replace(/\s+/g, '_')}.nfo`;
    addVirtualFile('C:', 'Downloads', fileName, text.length, text);
    localStorage.setItem('nfo_generated', 'true');
    playSound('beep');
    alert(`[NFO Generator] File "${fileName}" successfully generated and saved to C:\\Downloads!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
          <span>Release Group:</span>
          <input type="text" className="win-input" value={group} onChange={(e) => setGroup(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
          <span>Title:</span>
          <input type="text" className="win-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
        <span>Install / Play Notes:</span>
        <textarea className="win-input" style={{ height: '50px', resize: 'none' }} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <span style={{ marginRight: '6px' }}>Border Art Type:</span>
          <select value={artType} onChange={(e) => setArtType(e.target.value)} style={{ background: '#fff', border: '1px solid #808080' }}>
            <option value="heavy">██ Block Border</option>
            <option value="light">░░ Shade Border</option>
            <option value="dash">== Dash Border</option>
          </select>
        </div>
        <button className="win-btn" onClick={handleSave} style={{ fontWeight: 'bold', padding: '2px 12px' }}>Generate NFO</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <span>Live NFO ASCII Preview:</span>
        <pre className="win-inset" style={{ flex: 1, background: '#000', color: '#00ff00', overflow: 'auto', padding: '8px', fontSize: '10px', fontFamily: 'monospace', margin: '4px 0 0 0' }}>
          {generateNfoText()}
        </pre>
      </div>
    </div>
  );
}
