import React, { useState, useContext, useEffect } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function Notepad({ filePath, fileContent, onClose }) {
  const { fileSystem, setFileSystem } = useContext(HardwareContext);
  const [text, setText] = useState(fileContent || '');

  // Extract drive and path details from filePath (e.g., "C:/Desktop/readme.txt")
  const handleSave = () => {
    if (!filePath) {
      alert("Cannot save: No file path specified.");
      return;
    }

    const drive = filePath.substring(0, 2);
    const pathStr = filePath.substring(3);
    const parts = pathStr.split('/');
    const fileName = parts.pop();

    setFileSystem(prev => {
      const next = { ...prev };
      if (!next[drive] || !next[drive].formatted) return prev;

      let curr = next[drive].files;
      for (const part of parts) {
        if (!curr[part]) {
          curr[part] = { type: 'folder', files: {} };
        }
        curr = curr[part].files;
      }

      curr[fileName] = { 
        type: 'file', 
        size: text.length, 
        content: text 
      };
      return next;
    });

    alert("File saved successfully!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', fontSize: '12px' }}>
      {/* Menu bar */}
      <div className="win-menu-bar" style={{ display: 'flex', gap: '8px', padding: '2px 6px', borderBottom: '1px solid #808080' }}>
        <div className="win-menu-item" onClick={handleSave}>File &gt; Save</div>
        <div className="win-menu-item" onClick={onClose}>Exit</div>
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, padding: '2px', display: 'flex', flexDirection: 'column' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="win-inset"
          style={{ 
            flex: 1, 
            backgroundColor: '#fff', 
            color: '#000', 
            fontFamily: 'monospace', 
            fontSize: '13px', 
            padding: '8px', 
            border: '2px solid #808080', 
            outline: 'none',
            resize: 'none'
          }}
        />
      </div>

      <div className="win-status-bar" style={{ fontSize: '11px', display: 'flex', gap: '4px', padding: '2px' }}>
        <div className="win-status-panel" style={{ flex: 1 }}>File: {filePath || 'Untitled.txt'}</div>
        <div className="win-status-panel" style={{ width: '100px' }}>Characters: {text.length}</div>
      </div>
    </div>
  );
}
