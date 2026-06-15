import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function FindDialog({ onRunFile }) {
  const { fileSystem } = useContext(HardwareContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Recursive search helper
  const searchFiles = (fsNode, query, currentPath = '') => {
    let results = [];
    if (!fsNode || typeof fsNode !== 'object') return [];

    // Search files inside this node
    Object.entries(fsNode.files || {}).forEach(([name, item]) => {
      const match = name.toLowerCase().includes(query.toLowerCase());
      const fullPath = `${currentPath}/${name}`.replace(/\/\/+/g, '/');

      if (item.type === 'folder') {
        if (match) {
          results.push({ name, type: 'folder', path: `C:${fullPath}`, item });
        }
        results = [...results, ...searchFiles(item, query, fullPath)];
      } else {
        if (match) {
          results.push({ name, type: item.type || 'file', path: `C:${fullPath}`, item });
        }
      }
    });

    return results;
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    localStorage.setItem('find_searched', 'true');
    setTimeout(() => {
      const results = searchFiles(fileSystem['C:'], searchQuery, '');
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '8px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      
      {/* Search Input Area */}
      <div className="win-outset" style={{ padding: '8px', display: 'flex', gap: '8px', background: '#ccc', marginBottom: '8px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '50px' }}>Named:</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="win-input" 
              style={{ flex: 1, background: '#fff' }}
              placeholder="e.g. readme, setup, .doc..."
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '50px' }}>Look in:</span>
            <select style={{ flex: 1, background: '#fff', border: '1px solid #808080' }} disabled>
              <option>Local Disk (C:)</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button className="win-btn" onClick={handleSearch} style={{ width: '80px', fontWeight: 'bold' }}>Find Now</button>
          <button className="win-btn" onClick={handleReset} style={{ width: '80px' }}>New Search</button>
        </div>
      </div>

      {/* Search Results list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {isSearching ? 'Searching...' : `${searchResults.length} file(s) found`}
        </div>
        <div className="win-inset" style={{ flex: 1, background: '#fff', overflowY: 'auto', padding: '4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr style={{ background: '#dfdfdf', borderBottom: '1px solid #808080', textAlign: 'left' }}>
                <th style={{ padding: '2px 4px' }}>Name</th>
                <th style={{ padding: '2px 4px' }}>In Folder</th>
                <th style={{ padding: '2px 4px' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((res, idx) => (
                <tr 
                  key={idx} 
                  onDoubleClick={() => onRunFile(res.name, res.path)}
                  style={{ cursor: 'default', borderBottom: '1px solid #eee' }}
                  className="win-menu-item"
                >
                  <td style={{ padding: '2px 4px' }}>{res.name}</td>
                  <td style={{ padding: '2px 4px' }}>{res.path.substring(0, res.path.lastIndexOf('/'))}</td>
                  <td style={{ padding: '2px 4px' }}>{res.type.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
