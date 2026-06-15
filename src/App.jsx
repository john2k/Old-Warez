import React, { useState } from 'react';
import { HardwareProvider } from './context/HardwareContext';
import BootScreen from './components/BootScreen';
import Desktop from './components/Desktop';

function MainApp() {
  const [booted, setBooted] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!booted ? (
        <BootScreen onBootComplete={() => setBooted(true)} />
      ) : (
        <Desktop onReboot={() => setBooted(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <HardwareProvider>
      <MainApp />
    </HardwareProvider>
  );
}
