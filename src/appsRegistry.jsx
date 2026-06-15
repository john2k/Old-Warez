import React from 'react';

// Pixel-perfect Windows 95 style inline SVGs
export const Icons = {
  Computer: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Monitor frame */}
      <rect x="3" y="3" width="26" height="18" fill="#c0c0c0" stroke="#000" strokeWidth="2"/>
      <rect x="5" y="5" width="22" height="14" fill="#fff" stroke="#808080" strokeWidth="1"/>
      <rect x="6" y="6" width="20" height="12" fill="#000080"/>
      {/* Stand */}
      <path d="M12,21 L10,27 H22 L20,21 Z" fill="#c0c0c0" stroke="#000" strokeWidth="2"/>
      <line x1="8" y1="27" x2="24" y2="27" stroke="#fff" strokeWidth="2"/>
      {/* Shadow */}
      <line x1="28" y1="4" x2="28" y2="20" stroke="#808080" strokeWidth="1"/>
      <line x1="4" y1="20" x2="28" y2="20" stroke="#808080" strokeWidth="1"/>
    </svg>
  ),
  Network: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Monitor 1 */}
      <rect x="2" y="2" width="12" height="10" fill="#c0c0c0" stroke="#000" strokeWidth="1.5"/>
      <rect x="4" y="4" width="8" height="6" fill="#000080"/>
      <path d="M6,12 L5,15 H11 L10,12 Z" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
      
      {/* Monitor 2 */}
      <rect x="18" y="2" width="12" height="10" fill="#c0c0c0" stroke="#000" strokeWidth="1.5"/>
      <rect x="20" y="4" width="8" height="6" fill="#000080"/>
      <path d="M22,12 L21,15 H27 L26,12 Z" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>

      {/* Network Cables */}
      <path d="M8,15 V18 H24 V15" stroke="#000" strokeWidth="1.5" fill="none"/>
      <line x1="16" y1="18" x2="16" y2="22" stroke="#000" strokeWidth="1.5"/>

      {/* Hub connector */}
      <rect x="12" y="22" width="8" height="6" fill="#808080" stroke="#000" strokeWidth="1.5"/>
      <circle cx="16" cy="25" r="1.5" fill="#ff0000"/>
    </svg>
  ),
  Folder: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <path d="M2 6V26H30V9H14L10 6H2Z" fill="#ffdf80" stroke="#b38600" strokeWidth="1.5"/>
      <path d="M3 10H29V25H3V10Z" fill="#ffe066"/>
      <line x1="3" y1="9" x2="13" y2="9" stroke="#fff" strokeWidth="1"/>
    </svg>
  ),
  File: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <polygon points="4,2 20,2 28,10 28,30 4,30" fill="#fff" stroke="#808080" strokeWidth="2"/>
      <polygon points="20,2 20,10 28,10" fill="#c0c0c0" stroke="#808080" strokeWidth="1.5"/>
      <line x1="8" y1="14" x2="24" y2="14" stroke="#c0c0c0" strokeWidth="1"/>
      <line x1="8" y1="18" x2="24" y2="18" stroke="#c0c0c0" strokeWidth="1"/>
      <line x1="8" y1="22" x2="20" y2="22" stroke="#c0c0c0" strokeWidth="1"/>
    </svg>
  ),
  Mirc: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="28" height="28" fill="#00e1e1" stroke="#000" strokeWidth="2" rx="4"/>
      <text x="16" y="22" fill="#000" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="Arial">IRC</text>
    </svg>
  ),
  Icq: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Green flower */}
      <circle cx="16" cy="16" r="5" fill="#ffcc00" stroke="#000" strokeWidth="1.5"/>
      <circle cx="16" cy="8" r="4" fill="#00ff00" stroke="#000" strokeWidth="1"/>
      <circle cx="24" cy="12" r="4" fill="#00ff00" stroke="#000" strokeWidth="1"/>
      <circle cx="24" cy="20" r="4" fill="#00ff00" stroke="#000" strokeWidth="1"/>
      <circle cx="16" cy="24" r="4" fill="#00ff00" stroke="#000" strokeWidth="1"/>
      <circle cx="8" cy="20" r="4" fill="#00ff00" stroke="#000" strokeWidth="1"/>
      <circle cx="8" cy="12" r="4" fill="#00ff00" stroke="#000" strokeWidth="1"/>
    </svg>
  ),
  Winamp: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="6" width="28" height="20" fill="#2d2d34" stroke="#000" strokeWidth="2"/>
      <circle cx="8" cy="16" r="4" fill="#00ff00" stroke="#000" strokeWidth="1"/>
      <circle cx="24" cy="16" r="4" fill="#00ff00" stroke="#000" strokeWidth="1"/>
      <line x1="12" y1="16" x2="20" y2="16" stroke="#ff0" strokeWidth="2"/>
    </svg>
  ),
  CuteFtp: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <path d="M4,12 L12,4 L28,4 L28,28 L4,28 Z" fill="#fff" stroke="#000" strokeWidth="2"/>
      <polygon points="12,16 20,16 16,8" fill="#1084d0" stroke="#000" strokeWidth="1"/>
      <rect x="8" y="20" width="16" height="4" fill="#000080"/>
    </svg>
  ),
  Bbs: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="6" width="28" height="20" fill="#000" stroke="#c0c0c0" strokeWidth="2"/>
      <text x="16" y="19" fill="#0f0" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TELNET</text>
    </svg>
  ),
  CD: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <circle cx="16" cy="16" r="12" fill="#dfdfdf" stroke="#808080" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="4" fill="#c0c0c0" stroke="#808080" strokeWidth="1"/>
      <circle cx="16" cy="16" r="2" fill="#fff" stroke="#000" strokeWidth="1"/>
      <path d="M8,16 A8,8 0 0,1 24,16" stroke="#ff00ff" strokeWidth="1.5" fill="none" opacity="0.4"/>
    </svg>
  ),
  PartitionMagic: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="6" width="24" height="20" fill="#c0c0c0" stroke="#000" strokeWidth="2"/>
      <rect x="8" y="10" width="16" height="12" fill="#808080" stroke="#000" strokeWidth="1"/>
      <circle cx="12" cy="16" r="2" fill="#00ff00"/>
    </svg>
  ),
  Netbus: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="4" width="24" height="24" fill="#000" stroke="#808080" strokeWidth="2"/>
      <polygon points="16,8 8,24 24,24" fill="#ff0000" stroke="#000" strokeWidth="1"/>
      <text x="16" y="22" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">PATCH</text>
    </svg>
  ),
  Web: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <circle cx="16" cy="16" r="13" fill="#3a6ea5" stroke="#000" strokeWidth="2"/>
      <ellipse cx="16" cy="16" rx="6" ry="13" stroke="#fff" strokeWidth="1" fill="none"/>
      <line x1="3" y1="16" x2="29" y2="16" stroke="#fff" strokeWidth="1"/>
    </svg>
  ),
  FrontPage: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="4" width="24" height="24" fill="#ffe066" stroke="#000" strokeWidth="2"/>
      <line x1="8" y1="10" x2="24" y2="10" stroke="#000" strokeWidth="2"/>
      <line x1="8" y1="16" x2="20" y2="16" stroke="#000" strokeWidth="2"/>
    </svg>
  ),
  Nfo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="6" y="3" width="20" height="26" fill="#fff" stroke="#000" strokeWidth="2"/>
      <text x="16" y="20" fill="#000080" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="serif">i</text>
    </svg>
  ),
  Keygen: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="8" width="24" height="16" fill="#808080" stroke="#000" strokeWidth="2"/>
      <circle cx="10" cy="16" r="3" fill="#ffcc00" stroke="#000" strokeWidth="1"/>
      <line x1="13" y1="16" x2="24" y2="16" stroke="#ffcc00" strokeWidth="2"/>
    </svg>
  ),
  Hardware: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="6" width="28" height="20" fill="#c0c0c0" stroke="#000" strokeWidth="2"/>
      <rect x="6" y="10" width="20" height="12" fill="#808080" stroke="#000" strokeWidth="1"/>
      <circle cx="16" cy="16" r="2" fill="#ff0000"/>
    </svg>
  ),
  Antivirus: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <polygon points="16,3 28,9 28,23 16,29 4,23 4,9" fill="#ffe066" stroke="#000" strokeWidth="2"/>
      <path d="M11,16 L15,20 L22,12" stroke="#ff0000" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  Zip: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="6" y="2" width="20" height="28" fill="#ffd11a" stroke="#000" strokeWidth="2"/>
      <rect x="11" y="8" width="10" height="16" fill="#808080" stroke="#000" strokeWidth="1"/>
      <text x="16" y="20" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">ZIP</text>
    </svg>
  ),
  Napster: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <circle cx="16" cy="16" r="10" fill="#000080" stroke="#000" strokeWidth="1.5"/>
      <circle cx="11" cy="15" r="2" fill="#fff"/>
      <circle cx="21" cy="15" r="2" fill="#fff"/>
      <path d="M10,8 C12,10 20,10 22,8" stroke="#fff" strokeWidth="1.5" fill="none"/>
      <path d="M6,16 A12,12 0 0,0 26,16" stroke="#00ffff" strokeWidth="2.5" fill="none"/>
    </svg>
  ),
  Minesweeper: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
      <circle cx="16" cy="16" r="6" fill="#000"/>
      <line x1="16" y1="4" x2="16" y2="28" stroke="#000" strokeWidth="1.5"/>
      <line x1="4" y1="16" x2="28" y2="16" stroke="#000" strokeWidth="1.5"/>
      <circle cx="13" cy="13" r="1.5" fill="#fff"/>
    </svg>
  ),
  Paint: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <path d="M4,24 C4,28 12,28 16,24 C20,20 28,16 28,12 C28,8 24,4 20,4 C16,4 12,12 8,16 Z" fill="#fff" stroke="#000" strokeWidth="1.5"/>
      <circle cx="22" cy="8" r="2" fill="#ff0000"/>
      <circle cx="18" cy="12" r="2" fill="#00ff00"/>
      <circle cx="14" cy="16" r="2" fill="#0000ff"/>
    </svg>
  ),
  Xdcc: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="4" width="24" height="24" fill="#000" stroke="#808080" strokeWidth="2"/>
      <polygon points="16,6 8,18 24,18" fill="#00ff00" stroke="#000" strokeWidth="1"/>
      <rect x="12" y="18" width="8" height="8" fill="#0080ff" stroke="#000" strokeWidth="1"/>
      <text x="16" y="25" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">XDCC</text>
    </svg>
  ),
  Nfogen: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="3" width="24" height="26" fill="#c0c0c0" stroke="#000" strokeWidth="2"/>
      <rect x="8" y="7" width="16" height="18" fill="#fff" stroke="#808080" strokeWidth="1.5"/>
      <text x="16" y="21" fill="#c00000" fontSize="15" fontWeight="bold" textAnchor="middle" fontFamily="monospace">N!</text>
    </svg>
  ),
  Nesemu: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="6" width="26" height="20" fill="#dfdfdf" stroke="#808080" strokeWidth="2"/>
      <rect x="5" y="8" width="22" height="16" fill="#800000" stroke="#000" strokeWidth="1.5"/>
      <circle cx="21" cy="16" r="2.5" fill="#000"/>
      <circle cx="25" cy="16" r="2.5" fill="#000"/>
      <polygon points="10,12 12,12 12,14 14,14 14,16 12,16 12,18 10,18 10,16 8,16 8,14 10,14" fill="#000"/>
    </svg>
  ),
  Sfv: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="4" width="24" height="24" fill="#ffd11a" stroke="#000" strokeWidth="2"/>
      <polygon points="12,16 16,20 22,10" fill="none" stroke="#008000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="16" y="26" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SFV</text>
    </svg>
  )
};
 
export const appsRegistry = [
  { id: 'mirc', title: 'mIRC Chat Client', icon: Icons.Mirc, defaultWidth: 500, defaultHeight: 380 },
  { id: 'icq', title: 'ICQ Messenger', icon: Icons.Icq, defaultWidth: 260, defaultHeight: 450 },
  { id: 'winamp', title: 'Winamp 2.6', icon: Icons.Winamp, defaultWidth: 320, defaultHeight: 220 },
  { id: 'cuteftp', title: 'CuteFTP 3.0', icon: Icons.CuteFtp, defaultWidth: 520, defaultHeight: 390 },
  { id: 'bbs', title: 'BBS Terminal', icon: Icons.Bbs, defaultWidth: 500, defaultHeight: 380 },
  { id: 'cdrwin', title: 'CDRWin & CD Creator', icon: Icons.CD, defaultWidth: 460, defaultHeight: 340 },
  { id: 'partition', title: 'Partition Magic 3.0', icon: Icons.PartitionMagic, defaultWidth: 460, defaultHeight: 320 },
  { id: 'netbus', title: 'NetBus Trojan Hacker', icon: Icons.Netbus, defaultWidth: 420, defaultHeight: 340 },
  { id: 'browser', title: 'Netscape Navigator', icon: Icons.Web, defaultWidth: 600, defaultHeight: 460 },
  { id: 'editor', title: 'Microsoft FrontPage 98', icon: Icons.FrontPage, defaultWidth: 540, defaultHeight: 420 },
  { id: 'shop', title: 'PC Hardware Shop', icon: Icons.Hardware, defaultWidth: 450, defaultHeight: 360 },
  { id: 'antivirus', title: 'F-Prot Antivirus', icon: Icons.Antivirus, defaultWidth: 420, defaultHeight: 320 },
  { id: 'wincommander', title: 'WinCommander 96', icon: Icons.Computer, defaultWidth: 580, defaultHeight: 400 },
  { id: 'napster', title: 'Napster Peer-to-Peer', icon: Icons.Napster, defaultWidth: 440, defaultHeight: 350 },
  { id: 'minesweeper', title: 'Minesweeper', icon: Icons.Minesweeper, defaultWidth: 200, defaultHeight: 250 },
  { id: 'paint', title: 'Paint', icon: Icons.Paint, defaultWidth: 460, defaultHeight: 380 },
  { id: 'xdcc', title: 'XDCC Catcher v1.2', icon: Icons.Xdcc, defaultWidth: 440, defaultHeight: 330 },
  { id: 'nfogen', title: 'ASCII NFO Gen v1.0', icon: Icons.Nfogen, defaultWidth: 460, defaultHeight: 350 },
  { id: 'nesemu', title: 'NES/SNES Emulator', icon: Icons.Nesemu, defaultWidth: 500, defaultHeight: 380 },
  { id: 'sfvchecker', title: 'QuickSFV v1.2', icon: Icons.Sfv, defaultWidth: 400, defaultHeight: 300 },
  { id: 'subseven', title: 'SubSeven Trojan Server v2.1', icon: Icons.Netbus, defaultWidth: 460, defaultHeight: 360 }
];
