import React, { useRef, useState, useEffect } from 'react';

export default function Paint() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState('brush'); // brush, eraser

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    localStorage.setItem('paint_drawn', 'true');
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const colorsList = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#4000ff', '#804000',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff8000', '#ff80ff'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      
      {/* Menu bar */}
      <div className="win-menu-bar" style={{ display: 'flex', gap: '8px', padding: '2px 6px', borderBottom: '1px solid #808080' }}>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Image</span>
        <span>Colors</span>
        <span>Help</span>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Tool Box Sidebar */}
        <div style={{ width: '48px', borderRight: '1px solid #808080', padding: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', alignContent: 'start', background: 'var(--win-gray)' }}>
          <button className={`win-btn ${tool === 'brush' ? 'pressed' : ''}`} onClick={() => setTool('brush')} title="Brush" style={{ height: '20px', fontSize: '12px', padding: 0 }}>🖌</button>
          <button className={`win-btn ${tool === 'eraser' ? 'pressed' : ''}`} onClick={() => setTool('eraser')} title="Eraser" style={{ height: '20px', fontSize: '12px', padding: 0 }}>🧽</button>
          <div style={{ gridColumn: 'span 2', height: '1px', background: '#808080', margin: '4px 0' }} />
          <button className="win-btn" onClick={clearCanvas} title="Clear Canvas" style={{ gridColumn: 'span 2', height: '20px', fontSize: '9px', padding: 0 }}>Clear</button>
          
          {/* Brush Sizes */}
          <div style={{ gridColumn: 'span 2', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
            {[2, 4, 8, 12].map(sz => (
              <div 
                key={sz} 
                onClick={() => setBrushSize(sz)}
                style={{ 
                  width: `${sz}px`, 
                  height: `${sz}px`, 
                  borderRadius: '50%', 
                  background: brushSize === sz ? '#000' : '#888',
                  border: brushSize === sz ? '1px solid #ffcc00' : 'none',
                  cursor: 'default'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Canvas area */}
        <div className="win-inset" style={{ flex: 1, background: '#808080', padding: '8px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <canvas 
            ref={canvasRef}
            width={380}
            height={260}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ background: '#ffffff', cursor: 'crosshair', boxShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}
          />
        </div>
      </div>

      {/* Colors palette bar */}
      <div style={{ borderTop: '1px solid #808080', padding: '6px', background: 'var(--win-gray)', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div className="win-inset" style={{ width: '28px', height: '28px', background: color, border: '2px inset #fff', flexShrink: 0 }} title="Selected Color" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 12px)', gap: '2px' }}>
          {colorsList.map(c => (
            <div 
              key={c}
              onClick={() => setColor(c)}
              style={{ width: '12px', height: '12px', background: c, border: '1px solid #000', cursor: 'default' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
