import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';
import { Icons } from '../appsRegistry';

export default function Explorer({ initialDrive = 'C:', initialPath = '', onRunFile, openApp }) {
  const { fileSystem, hardware, floppyInserted, playSound } = useContext(HardwareContext);
  const [drive, setDrive] = useState(initialDrive);
  const [path, setPath] = useState(initialPath);

  // Navigate folder helper
  const getDirectoryContents = () => {
    if (!fileSystem[drive] || !fileSystem[drive].formatted) return [];
    
    let current = fileSystem[drive].files;
    const parts = path.split('/').filter(Boolean);
    for (const part of parts) {
      if (current[part] && current[part].type === 'folder') {
        current = current[part].files;
      } else {
        return [];
      }
    }

    const items = [];
    if (path) {
      items.push({ name: '..', type: 'parent' });
    }

    Object.entries(current).forEach(([name, info]) => {
      items.push({ name, ...info });
    });

    return items;
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === 'parent') {
      const parts = path.split('/').filter(Boolean);
      parts.pop();
      setPath(parts.join('/'));
    } else if (item.type === 'folder') {
      const nextPath = path ? `${path}/${item.name}` : item.name;
      setPath(nextPath);
    } else if (item.type === 'file') {
      const fullPath = `${drive}/${path}/${item.name}`.replace(/\/\/+/g, '/');
      onRunFile(item.name, fullPath);
    }
  };

  const items = getDirectoryContents();
  const isMyComputer = drive === 'root';

  const navigateToDrive = (d) => {
    setDrive(d);
    setPath('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000' }}>
      
      {/* File Explorer Menu Bar */}
      <div className="win-menu-bar" style={{ display: 'flex', gap: '8px', padding: '2px 6px', borderBottom: '1px solid #808080', background: 'var(--win-gray)' }}>
        <div className="win-menu-item">File</div>
        <div className="win-menu-item">Edit</div>
        <div className="win-menu-item">View</div>
        <div className="win-menu-item">Favorites</div>
        <div className="win-menu-item">Tools</div>
        <div className="win-menu-item">Help</div>
      </div>

      {/* Retro Standard Buttons Toolbar */}
      <div style={{ display: 'flex', gap: '4px', padding: '4px 6px', borderBottom: '1px solid #808080', background: 'var(--win-gray)', alignItems: 'center' }}>
        <button 
          className="win-btn" 
          onClick={() => {
            if (path) {
              const parts = path.split('/').filter(Boolean);
              parts.pop();
              setPath(parts.join('/'));
            } else if (!isMyComputer) {
              setDrive('root');
            }
          }}
          disabled={isMyComputer && !path}
          style={{ padding: '2px 6px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
        >
          <span>⬆️</span> Up
        </button>
        <div style={{ width: '1px', height: '16px', background: '#808080', margin: '0 4px' }} />
        <button className="win-btn" style={{ padding: '2px 6px', fontSize: '10px', color: '#888' }} disabled>✂️ Cut</button>
        <button className="win-btn" style={{ padding: '2px 6px', fontSize: '10px', color: '#888' }} disabled>📋 Copy</button>
        <button className="win-btn" style={{ padding: '2px 6px', fontSize: '10px', color: '#888' }} disabled>📋 Paste</button>
        <div style={{ width: '1px', height: '16px', background: '#808080', margin: '0 4px' }} />
        <button className="win-btn" style={{ padding: '2px 6px', fontSize: '10px', color: '#888' }} disabled>↩️ Undo</button>
        <button className="win-btn" style={{ padding: '2px 6px', fontSize: '10px', color: '#888' }} disabled>❌ Delete</button>
        <button className="win-btn" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => openApp('control')}>🛠️ Properties</button>
      </div>

      {/* Address Bar */}
      <div style={{ display: 'flex', padding: '4px 8px', gap: '6px', alignItems: 'center', borderBottom: '1px solid #808080', background: 'var(--win-gray)' }}>
        <span style={{ color: '#555' }}>Address:</span>
        <div className="win-inset" style={{ flex: 1, background: '#fff', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px', minHeight: '20px', textAlign: 'left' }}>
          <span style={{ fontSize: '12px' }}>{isMyComputer ? '💻' : '📁'}</span>
          <span>{isMyComputer ? 'My Computer' : `${drive}\\${path}`}</span>
        </div>
        <button className="win-btn" style={{ padding: '2px 10px', fontWeight: 'bold' }}>Go</button>
      </div>

      {/* File & Folder Grid View */}
      <div className="win-inset" style={{ flex: 1, backgroundColor: '#fff', padding: '12px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '16px', justifyItems: 'center' }}>
          
          {isMyComputer ? (
            <>
              {/* Drive A: (Floppy) */}
              <div 
                onDoubleClick={() => {
                  if (floppyInserted) {
                    navigateToDrive('A:');
                  } else {
                    alert('Drive A: is empty. Please insert a 3 1/2 Floppy Diskette first (use floppy tray icon or right-click Desktop -> Insert Floppy).');
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (window.confirm('Do you want to format Drive A: (3.5" Floppy, 1.44MB)?')) {
                    alert('Formatting Drive A:... 100% complete.');
                    localStorage.setItem('floppy_formatted', 'true');
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
                title="Right-click to Format Floppy"
              >
                <Icons.Folder />
                <span>3½ Floppy (A:)</span>
              </div>

              {/* Drive C: */}
              <div 
                onDoubleClick={() => navigateToDrive('C:')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
              >
                <Icons.PartitionMagic />
                <span>Local Disk (C:)</span>
              </div>

              {/* Drive D: (Slave) */}
              <div 
                onDoubleClick={() => {
                  if (hardware.hddSlave) {
                    navigateToDrive('D:'); // In context, you can format it.
                  } else {
                    alert('Drive D: is not connected. Buy Fujitsu 4.3GB in Shop.');
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center', opacity: hardware.hddSlave ? 1 : 0.4 }}
              >
                <Icons.PartitionMagic />
                <span>Local Disk (D:)</span>
              </div>

              {/* DVD-RAM Drive E: */}
              <div 
                onDoubleClick={() => alert('DVD-RAM Drive E: is empty. Insert CD from Missions.')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
              >
                <Icons.CD />
                <span>DVD-RAM Drive (E:)</span>
              </div>

              {/* Control Panel Shortcut */}
              <div 
                onDoubleClick={() => openApp('control')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
              >
                <Icons.Hardware />
                <span>Control Panel</span>
              </div>

              {/* Shared Documents Folder */}
              <div 
                onDoubleClick={() => alert('Shared Documents is empty.')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
              >
                <Icons.Folder />
                <span>Shared Documents</span>
              </div>

              {/* Dial-Up Networking */}
              <div 
                onDoubleClick={() => openApp('dialup')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
              >
                <Icons.Network />
                <span>Dial-Up Networking</span>
              </div>

              {/* USB Video Device */}
              <div 
                onDoubleClick={() => alert('USB Video Device: No active camera feed found.')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
              >
                <span style={{ fontSize: '32px' }}>📷</span>
                <span>USB Video Device</span>
              </div>
            </>
          ) : (
            // Inner drive folders / files
            items.map(item => (
              <div 
                key={item.name}
                onDoubleClick={() => handleItemDoubleClick(item)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'default', width: '75px', textAlign: 'center' }}
              >
                {item.type === 'parent' ? (
                  <>
                    <Icons.Folder />
                    <span>[Up]</span>
                  </>
                ) : item.type === 'folder' ? (
                  <>
                    <Icons.Folder />
                    <span style={{ wordBreak: 'break-all' }}>{item.name}</span>
                  </>
                ) : (
                  <>
                    {item.name.toLowerCase().endsWith('.zip.001') ? <Icons.Zip /> : <Icons.File />}
                    <span style={{ wordBreak: 'break-all' }}>{item.name}</span>
                  </>
                )}
              </div>
            ))
          )}

        </div>
      </div>

      {/* Classic bottom Status Bar */}
      <div className="win-outset" style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 8px', background: 'var(--win-gray)', borderTop: '1px solid #808080', fontSize: '10px' }}>
        <span>{isMyComputer ? '6 objects' : `${items.filter(i => i.type !== 'parent').length} objects`}</span>
        <div style={{ width: '1px', background: '#808080', margin: '0 4px' }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>💻</span> My Computer
        </span>
      </div>
    </div>
  );
}
