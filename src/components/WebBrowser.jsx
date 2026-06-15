import React, { useState } from 'react';

export default function WebBrowser() {
  const [addressBar, setAddressBar] = useState('http://www.gamecopyworld.com');
  const [currentUrl, setCurrentUrl] = useState('http://www.gamecopyworld.com');

  const handleGo = (e) => {
    if (e) e.preventDefault();
    setCurrentUrl(addressBar);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)' }}>
      {/* Netscape Navigator Top Menu Bar */}
      <div className="win-menu-bar">
        <div className="win-menu-item">File</div>
        <div className="win-menu-item">Edit</div>
        <div className="win-menu-item">View</div>
        <div className="win-menu-item">Go</div>
        <div className="win-menu-item">Bookmarks</div>
        <div className="win-menu-item">Help</div>
      </div>

      {/* Address Bar */}
      <form onSubmit={handleGo} style={{ display: 'flex', gap: '4px', padding: '4px', background: 'var(--win-gray)', borderBottom: '2px solid var(--win-dark-gray)', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Netsite:</span>
        <input 
          type="text" 
          value={addressBar} 
          onChange={(e) => setAddressBar(e.target.value)} 
          className="win-input" 
          style={{ flex: 1 }}
        />
        <button className="win-btn" type="submit">Go</button>
      </form>

      {/* Page Content Display Area */}
      <div className="win-inset" style={{ flex: 1, backgroundColor: '#fff', overflowY: 'auto', padding: '16px', color: '#000', fontFamily: 'Times New Roman' }}>
        
        {/* GameCopyWorld */}
        {currentUrl.includes('gamecopyworld') && (
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontFamily: 'Comic Sans MS', color: '#000080', fontSize: '28px', textAlign: 'center', borderBottom: '4px double #ff5500', paddingBottom: '6px' }}>
              🎮 GAMECOPYWORLD 🎮
            </h1>
            <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
              <blink>Welcome to the #1 PC Game cracks and patches repository!</blink>
            </p>
            <br/>
            <table border="1" cellPadding="6" style={{ width: '100%', borderColor: '#ff5500', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#ff5500', color: '#fff' }}>
                  <th>Game Target</th>
                  <th>Crack Category</th>
                  <th>File Link</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Doom (v1.9)</td>
                  <td>Keygen & SB16 Setup Fix</td>
                  <td><a href="#download" onClick={() => alert('Download keygen.exe from BBS or mIRC Warez bot to register!')} style={{ color: 'blue', textDecoration: 'underline' }}>doom_setup_fix.zip</a></td>
                </tr>
                <tr>
                  <td>Warcraft II</td>
                  <td>Buffer Underrun ISO patch</td>
                  <td><a href="#download" onClick={() => alert('Search CuteFTP remote tree for Warcraft2_crk.ppf to apply!')} style={{ color: 'blue', textDecoration: 'underline' }}>Warcraft2_crk.ppf</a></td>
                </tr>
                <tr>
                  <td>Duke Nukem 3D</td>
                  <td>Sound IRQ Config Patch</td>
                  <td><a href="#download" onClick={() => alert('Configure SoundBlaster in DOS Setup to Port 220, IRQ 5, DMA 1.')} style={{ color: 'blue', textDecoration: 'underline' }}>duke3d_sound.zip</a></td>
                </tr>
              </tbody>
            </table>
            <br/>
            <div style={{ textAlign: 'center', margin: '20px 0', border: '1px dashed #000', padding: '10px' }}>
              <p>Visitor Counter:</p>
              <span style={{ background: '#000', color: '#00ff00', fontFamily: 'monospace', padding: '4px 8px', fontSize: '16px', fontWeight: 'bold' }}>
                0 0 4 8 2 9
              </span>
            </div>
          </div>
        )}

        {/* Vintage Fansite */}
        {!currentUrl.includes('gamecopyworld') && (
          <div style={{ textAlign: 'left', fontFamily: 'Comic Sans MS' }}>
            <h2 style={{ color: '#ff00ff', textAlign: 'center' }}>★ WELCOME TO MY COOLEST RETRO HOMEPAGE ★</h2>
            <br/>
            <center>
              <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q1NDVmMjEyMGM3NzdjMzQ5ODFlMmE1Y2JhYzA5NTQwN2I5ZDYwMSZjdD1n/xT0xeQ948L11uXW70Q/giphy.gif" alt="under construction" width="150" />
            </center>
            <br/>
            <p style={{ fontSize: '14px' }}>Welcome! This is my retro fanpage build using Microsoft FrontPage. Sign my Guestbook below! I like skating, playing doom, and listening to Millencolin!</p>
            <br/>
            <div style={{ border: '2px solid #800080', padding: '8px', background: '#ffe0ff' }}>
              <h4>Sign the Guestbook:</h4>
              <textarea style={{ width: '100%', height: '50px', marginTop: '6px' }} placeholder="Write a nice comment..."></textarea>
              <button className="win-btn" style={{ marginTop: '4px' }} onClick={() => alert('Guestbook entry submitted!')}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
