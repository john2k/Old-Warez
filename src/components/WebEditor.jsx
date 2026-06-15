import React, { useState } from 'react';

export default function WebEditor() {
  const [htmlCode, setHtmlCode] = useState(
    `<html>\n<body bgcolor="#008080">\n  <center>\n    <h1>Welcome to My New Site!</h1>\n    <p><blink>Created with FrontPage 98!</blink></p>\n    <table border="2" bgcolor="#c0c0c0">\n      <tr><td>Item 1</td><td>Cool CD Burns</td></tr>\n    </table>\n  </center>\n</body>\n</html>`
  );
  const [previewActive, setPreviewActive] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)' }}>
      {/* Menu bar */}
      <div className="win-menu-bar">
        <div className="win-menu-item" onClick={() => setPreviewActive(false)}>Code View</div>
        <div className="win-menu-item" onClick={() => {
          setPreviewActive(true);
          localStorage.setItem('web_previewed', 'true');
          if (htmlCode.toLowerCase().includes('hacked') || htmlCode.toLowerCase().includes('deface') || htmlCode.toLowerCase().includes('leet')) {
            localStorage.setItem('web_defaced', 'true');
          }
        }}>Preview Page</div>
        <div className="win-menu-item" onClick={() => {
          localStorage.setItem('web_previewed', 'true');
          alert('HTML document saved successfully!');
        }}>Save Site</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px' }}>
        {!previewActive ? (
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="win-inset"
            style={{ flex: 1, backgroundColor: '#000', color: '#00ff00', fontFamily: 'monospace', fontSize: '13px', padding: '8px', border: '2px solid #808080', outline: 'none' }}
          />
        ) : (
          <div 
            className="win-inset" 
            style={{ flex: 1, backgroundColor: '#fff', overflowY: 'auto', border: '2px solid #808080' }}
            dangerouslySetInnerHTML={{ __html: htmlCode }}
          />
        )}
      </div>

      <div className="win-status-bar">
        <div className="win-status-panel">Mode: {previewActive ? 'WYSIWYG Preview' : 'Source Code Editor'}</div>
        <div className="win-status-panel">Lines: {htmlCode.split('\n').length}</div>
      </div>
    </div>
  );
}
