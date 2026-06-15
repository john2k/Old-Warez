import React, { useState } from 'react';

// WordPad component for viewing and editing .doc documents
export function WordpadWindow({ filePath, fileContent, onClose }) {
  const [content, setContent] = useState(fileContent || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      {/* Menu bar */}
      <div className="win-menu-bar" style={{ display: 'flex', gap: '8px', padding: '2px 6px', borderBottom: '1px solid #808080' }}>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Insert</span>
        <span>Format</span>
        <span>Help</span>
      </div>

      {/* Ribbon toolbar */}
      <div style={{ display: 'flex', gap: '4px', padding: '4px 6px', borderBottom: '1px solid #808080', background: 'var(--win-gray)', alignItems: 'center' }}>
        <button className="win-btn" style={{ padding: '2px 4px', fontWeight: 'bold' }}>B</button>
        <button className="win-btn" style={{ padding: '2px 4px', fontStyle: 'italic' }}>I</button>
        <button className="win-btn" style={{ padding: '2px 4px', textDecoration: 'underline' }}>U</button>
        <div style={{ width: '1px', height: '16px', background: '#808080', margin: '0 4px' }} />
        <select style={{ background: '#fff' }} disabled>
          <option>Times New Roman</option>
        </select>
        <select style={{ background: '#fff' }} disabled>
          <option>12</option>
        </select>
      </div>

      {/* Editor area */}
      <div className="win-inset" style={{ flex: 1, background: '#fff', margin: '6px', overflowY: 'auto' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', height: '100%', border: 'none', resize: 'none', padding: '16px', fontSize: '13px', fontFamily: '"Times New Roman", Times, serif', outline: 'none' }}
        />
      </div>

      {/* Status Bar */}
      <div className="win-outset" style={{ padding: '2px 8px', background: 'var(--win-gray)', borderTop: '1px solid #808080', fontSize: '10px' }}>
        For Help, press F1
      </div>
    </div>
  );
}

// PowerPoint Viewer component for viewing slideshow .ppt presentations
export function PptViewerWindow({ filePath, fileContent }) {
  const slides = (fileContent || '').split('\n').filter(Boolean);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      
      {/* Slide Canvas area */}
      <div 
        className="win-inset" 
        style={{ 
          flex: 1, 
          background: 'linear-gradient(135deg, #103060 0%, #206090 100%)', 
          margin: '8px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#fff',
          padding: '24px',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
          position: 'relative'
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '2px solid #ffcc00', paddingBottom: '6px', textAlign: 'center', width: '80%' }}>
          Presentation Slide {currentSlide + 1}
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'center', whiteSpace: 'pre-line' }}>
          {slides[currentSlide] || 'No Content Available.'}
        </div>

        {/* Footer inside canvas */}
        <span style={{ position: 'absolute', bottom: '10px', right: '15px', fontSize: '9px', color: '#ffcc00' }}>
          PowerPoint Viewer 95
        </span>
      </div>

      {/* Control panel */}
      <div style={{ display: 'flex', gap: '8px', padding: '6px 12px', background: 'var(--win-gray)', borderTop: '1px solid #808080', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px' }}>Slide {currentSlide + 1} of {slides.length}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            className="win-btn" 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            style={{ padding: '2px 8px' }}
          >
            ◀ Back
          </button>
          <button 
            className="win-btn" 
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            style={{ padding: '2px 8px' }}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
