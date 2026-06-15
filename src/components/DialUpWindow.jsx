import React, { useState, useContext, useEffect } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function DialUpWindow({ onClose }) {
  const { playSound, isInternetConnected, setIsInternetConnected, hardware } = useContext(HardwareContext);
  const [phoneNumber, setPhoneNumber] = useState('555-9000');
  const [userName, setUserName] = useState('Guest');
  const [password, setPassword] = useState('••••••••');
  const [status, setStatus] = useState('disconnected'); // disconnected, dialing, verifying, connected
  const [statusMsg, setStatusMsg] = useState('Click Connect to establish internet connection.');

  const handleConnect = () => {
    if (status !== 'disconnected') return;
    
    setStatus('dialing');
    setStatusMsg('Dialing ' + phoneNumber + '...');
    playSound('dialup');

    // Steps of connection
    setTimeout(() => {
      setStatus('verifying');
      setStatusMsg('Verifying user name and password...');
    }, 2500);

    setTimeout(() => {
      setStatus('connected');
      setIsInternetConnected(true);
      const speed = hardware.modem.speedKbps;
      setStatusMsg(`Connected. Speed: ${speed} Kbps.`);
    }, 4500);
  };

  const handleDisconnect = () => {
    setStatus('disconnected');
    setIsInternetConnected(false);
    setStatusMsg('Click Connect to establish internet connection.');
    playSound('beep');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '12px', fontSize: '11px', fontFamily: 'var(--font-win)', color: '#000', textAlign: 'left' }}>
      
      {/* Title/Banner section */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #808080', paddingBottom: '8px' }}>
        <span style={{ fontSize: '32px' }}>🖳</span>
        <div>
          <strong style={{ fontSize: '12px' }}>Dial-Up Networking</strong>
          <p style={{ margin: '2px 0 0 0', color: '#555' }}>Connect to the UnderNet IRC Gateway and World Wide Web.</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="win-inset" style={{ padding: '8px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '90px' }}>User name:</span>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
              disabled={status !== 'disconnected'}
              style={{ flex: 1, padding: '2px 4px', fontSize: '11px', fontFamily: 'var(--font-win)', border: '1px solid #808080' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '90px' }}>Password:</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={status !== 'disconnected'}
              style={{ flex: 1, padding: '2px 4px', fontSize: '11px', fontFamily: 'var(--font-win)', border: '1px solid #808080' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '90px' }}>Phone number:</span>
            <input 
              type="text" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={status !== 'disconnected'}
              style={{ flex: 1, padding: '2px 4px', fontSize: '11px', fontFamily: 'var(--font-win)', border: '1px solid #808080' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '90px' }}>Device:</span>
            <select disabled style={{ flex: 1, padding: '2px 4px', fontSize: '11px', fontFamily: 'var(--font-win)', background: '#eee', border: '1px solid #808080' }}>
              <option>{hardware.modem.name} on COM1</option>
            </select>
          </div>
        </div>

        {/* Status Box */}
        <div className="win-inset" style={{ padding: '6px', background: '#dfdfdf', border: '1px solid #808080', minHeight: '36px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>
            {status === 'disconnected' && '❌'}
            {status === 'dialing' && '📳'}
            {status === 'verifying' && '🖧'}
            {status === 'connected' && '⚡'}
          </span>
          <span style={{ fontWeight: 'bold' }}>{statusMsg}</span>
        </div>
      </div>

      {/* Button controls */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
        {status === 'connected' ? (
          <button className="win-btn" onClick={handleDisconnect} style={{ width: '80px', fontWeight: 'bold' }}>Disconnect</button>
        ) : (
          <button 
            className="win-btn" 
            onClick={handleConnect} 
            disabled={status !== 'disconnected'} 
            style={{ width: '80px', fontWeight: status === 'disconnected' ? 'bold' : 'normal' }}
          >
            Connect
          </button>
        )}
        <button className="win-btn" onClick={onClose} style={{ width: '80px' }}>Cancel</button>
      </div>
    </div>
  );
}
