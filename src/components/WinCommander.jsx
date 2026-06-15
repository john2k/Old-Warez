import React, { useState, useContext, useEffect } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function WinCommander({ onRunFile }) {
  const { fileSystem, setFileSystem, playSound, hardware } = useContext(HardwareContext);
  const [leftDrive, setLeftDrive] = useState('C:');
  const [leftPath, setLeftPath] = useState(''); 
  const [rightDrive, setRightDrive] = useState('C:');
  const [rightPath, setRightPath] = useState('');

  const [activePane, setActivePane] = useState('left'); 
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);

  // Navigate folder helper
  const getDirectoryContents = (drive, pathStr) => {
    if (!fileSystem[drive] || !fileSystem[drive].formatted) return [];
    
    let current = fileSystem[drive].files;
    const parts = pathStr.split('/').filter(Boolean);
    for (const part of parts) {
      if (current[part] && current[part].type === 'folder') {
        current = current[part].files;
      } else {
        return [];
      }
    }

    const items = [];
    if (pathStr) {
      items.push({ name: '..', type: 'parent' });
    }

    Object.entries(current).forEach(([name, info]) => {
      items.push({ name, ...info });
    });

    return items;
  };

  const handleItemClick = (pane, item) => {
    if (pane === 'left') {
      setSelectedLeft(item.name);
      setActivePane('left');
    } else {
      setSelectedRight(item.name);
      setActivePane('right');
    }
  };

  const handleItemDoubleClick = (pane, item) => {
    const isLeft = pane === 'left';
    const drive = isLeft ? leftDrive : rightDrive;
    const currentPath = isLeft ? leftPath : rightPath;
    const setPath = isLeft ? setLeftPath : setRightPath;

    if (item.type === 'parent') {
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      setPath(parts.join('/'));
      isLeft ? setSelectedLeft(null) : setSelectedRight(null);
    } else if (item.type === 'folder') {
      const nextPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      setPath(nextPath);
      isLeft ? setSelectedLeft(null) : setSelectedRight(null);
    } else if (item.type === 'file') {
      const fullPath = `${drive}/${currentPath}/${item.name}`.replace(/\/\/+/g, '/');
      onRunFile(item.name, fullPath);
    }
  };

  const leftItems = getDirectoryContents(leftDrive, leftPath);
  const rightItems = getDirectoryContents(rightDrive, rightPath);
  const formattedDrives = Object.keys(fileSystem).filter(d => fileSystem[d].formatted);

  const handleCopy = () => {
    const isLeft = activePane === 'left';
    const sourceDrive = isLeft ? leftDrive : rightDrive;
    const sourcePath = isLeft ? leftPath : rightPath;
    const sourceName = isLeft ? selectedLeft : selectedRight;

    const destDrive = isLeft ? rightDrive : leftDrive;
    const destPath = isLeft ? rightPath : leftPath;

    if (!sourceName || sourceName === '..') {
      alert('Please select a file or folder to copy first.');
      return;
    }

    setFileSystem(prev => {
      const next = { ...prev };
      
      const sourceParts = sourcePath.split('/').filter(Boolean);
      let sCurr = next[sourceDrive].files;
      for (const p of sourceParts) {
        sCurr = sCurr[p]?.files;
      }
      const itemToCopy = sCurr ? sCurr[sourceName] : null;

      if (!itemToCopy) {
        alert('Source item not found.');
        return prev;
      }

      // Resolve destination folder
      const destParts = destPath.split('/').filter(Boolean);
      let dCurr = next[destDrive].files;
      for (const p of destParts) {
        if (!dCurr[p]) {
          dCurr[p] = { type: 'folder', files: {} };
        }
        dCurr = dCurr[p].files;
      }

      // Copy item
      dCurr[sourceName] = JSON.parse(JSON.stringify(itemToCopy));
      
      // Hook for Warcraft 2 map transfer to A: (Floppy) or copying maps
      if (destDrive === 'A:' && (sourceName.toLowerCase().includes('map') || sourceName.toLowerCase().includes('play.bat') || sourceName.toLowerCase().includes('readme'))) {
        localStorage.setItem('map_transferred_floppy', 'true');
      }

      playSound('beep');
      alert(`Copied "${sourceName}" successfully to ${destDrive}\\${destPath}`);
      return next;
    });
  };

  const handleDelete = () => {
    const isLeft = activePane === 'left';
    const drive = isLeft ? leftDrive : rightDrive;
    const pathStr = isLeft ? leftPath : rightPath;
    const name = isLeft ? selectedLeft : selectedRight;

    if (!name || name === '..') {
      alert('Select an item to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    setFileSystem(prev => {
      const next = { ...prev };
      const parts = pathStr.split('/').filter(Boolean);
      let curr = next[drive].files;
      for (const p of parts) {
        curr = curr[p]?.files;
      }
      if (curr && curr[name]) {
        delete curr[name];
        playSound('beep');
        alert(`${name} deleted.`);
      }
      return next;
    });
    isLeft ? setSelectedLeft(null) : setSelectedRight(null);
  };

  const handleGhostClone = () => {
    playSound('beep');
    if (!fileSystem['D:'] || !fileSystem['D:'].formatted) {
      alert('Error: Local Disk D: is not connected or formatted. Please connect it from the Hardware Shop first.');
      return;
    }
    if (window.confirm('Start Symantec Norton Ghost 2001 partition backup (C: -> D:)?')) {
      alert('Cloning C: drive sector-by-sector...\nProgress: 100% complete.');
      localStorage.setItem('ghost_cloned', 'true');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#000' }}>
      
      {/* Top Title Bar info */}
      <div style={{ background: '#000080', color: '#fff', padding: '3px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>WinCommander 96 - Dual Directory Shell</span>
        <span>Registered Copy</span>
      </div>

      {/* Operations header */}
      <div style={{ background: '#ccc', padding: '4px', display: 'flex', gap: '8px', borderBottom: '1px solid #808080', marginBottom: '4px' }}>
        <button className="win-btn" onClick={handleCopy}>Copy Selected</button>
        <button className="win-btn" onClick={handleDelete} style={{ color: 'red' }}>Delete Selected</button>
        <button className="win-btn" onClick={handleGhostClone} style={{ fontWeight: 'bold' }}>Norton Ghost Clone</button>
      </div>

      {/* Main double panes */}
      <div style={{ display: 'flex', flex: 1, gap: '4px', overflow: 'hidden' }}>
        {/* Left Pane */}
        <div className="win-inset" style={{ flex: 1, backgroundColor: '#000', color: '#00ff00', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: activePane === 'left' ? '2px solid #00ff00' : '2px solid #808080' }}>
          {/* Drive selector */}
          <div style={{ background: '#222', padding: '3px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#fff' }}>Drive:</span>
            <select value={leftDrive} onChange={(e) => { setLeftDrive(e.target.value); setLeftPath(''); }} style={{ background: '#000', color: '#0f0', border: '1px solid #0f0', fontSize: '11px', fontFamily: 'monospace' }}>
              {formattedDrives.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{ color: '#aaa', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leftDrive}\\{leftPath}</span>
          </div>

          {/* Directory items */}
          <div style={{ flex: 1, overflowY: 'auto', textAlign: 'left', padding: '4px' }}>
            {leftItems.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic', padding: '6px' }}>Empty directory</div>
            ) : (
              leftItems.map(item => (
                <div 
                  key={item.name}
                  onClick={() => handleItemClick('left', item)}
                  onDoubleClick={() => handleItemDoubleClick('left', item)}
                  style={{ 
                    padding: '3px', 
                    cursor: 'default', 
                    background: selectedLeft === item.name && activePane === 'left' ? '#000080' : 'transparent',
                    color: selectedLeft === item.name && activePane === 'left' ? '#fff' : (item.type === 'folder' || item.type === 'parent' ? '#ffcc00' : '#00ff00')
                  }}
                >
                  {item.type === 'folder' || item.type === 'parent' ? `📁 [${item.name}]` : `📄 ${item.name}`}
                  {item.size !== undefined && ` (${(item.size / 1024).toFixed(0)} KB)`}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane */}
        <div className="win-inset" style={{ flex: 1, backgroundColor: '#000', color: '#00ff00', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: activePane === 'right' ? '2px solid #00ff00' : '2px solid #808080' }}>
          {/* Drive selector */}
          <div style={{ background: '#222', padding: '3px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#fff' }}>Drive:</span>
            <select value={rightDrive} onChange={(e) => { setRightDrive(e.target.value); setRightPath(''); }} style={{ background: '#000', color: '#0f0', border: '1px solid #0f0', fontSize: '11px', fontFamily: 'monospace' }}>
              {formattedDrives.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{ color: '#aaa', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rightDrive}\\{rightPath}</span>
          </div>

          {/* Directory items */}
          <div style={{ flex: 1, overflowY: 'auto', textAlign: 'left', padding: '4px' }}>
            {rightItems.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic', padding: '6px' }}>Empty directory</div>
            ) : (
              rightItems.map(item => (
                <div 
                  key={item.name}
                  onClick={() => handleItemClick('right', item)}
                  onDoubleClick={() => handleItemDoubleClick('right', item)}
                  style={{ 
                    padding: '3px', 
                    cursor: 'default', 
                    background: selectedRight === item.name && activePane === 'right' ? '#000080' : 'transparent',
                    color: selectedRight === item.name && activePane === 'right' ? '#fff' : (item.type === 'folder' || item.type === 'parent' ? '#ffcc00' : '#00ff00')
                  }}
                >
                  {item.type === 'folder' || item.type === 'parent' ? `📁 [${item.name}]` : `📄 ${item.name}`}
                  {item.size !== undefined && ` (${(item.size / 1024).toFixed(0)} KB)`}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Function Keys list at bottom */}
      <div style={{ display: 'flex', background: '#222', padding: '4px', gap: '4px', borderTop: '1px solid var(--win-dark-gray)', color: '#fff', fontSize: '10px' }}>
        <div style={{ flex: 1, cursor: 'default' }} onClick={handleCopy}>F5 Copy</div>
        <div style={{ flex: 1, cursor: 'default' }} onClick={handleDelete}>F8 Delete</div>
      </div>
    </div>
  );
}
