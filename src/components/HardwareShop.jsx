import React, { useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function HardwareShop() {
  const { credits, hardware, buyUpgrade, upgradeCosts } = useContext(HardwareContext);

  const renderUpgradeRow = (category, itemId, itemInfo) => {
    const isOwned = 
      category === 'hddSlave' 
        ? hardware.hddSlave !== null
        : hardware[category].id === itemId;

    const currentOwnedInCat = hardware[category]?.id;

    // Casing checks for higher upgrades
    let canBuy = credits >= itemInfo.cost && !isOwned;
    if (category === 'cpu' && currentOwnedInCat === 'pii300' && itemId === 'p200mmx') canBuy = false;
    if (category === 'ram' && itemId === 'ram32' && (currentOwnedInCat === 'ram64' || currentOwnedInCat === 'ram128')) canBuy = false;
    if (category === 'ram' && itemId === 'ram64' && currentOwnedInCat === 'ram128') canBuy = false;
    if (category === 'sound') {
      const soundRank = { speaker: 0, sb16: 1, awe32: 2, gus: 3, awe64gold: 4 };
      const currentRank = soundRank[currentOwnedInCat || 'speaker'];
      const targetRank = soundRank[itemId];
      if (targetRank <= currentRank) canBuy = false;
    }
    if (category === 'video' && currentOwnedInCat === 'matrox' && itemId === 's3virge') canBuy = false;
    if (category === 'modem' && currentOwnedInCat === 'modem56' && itemId === 'modem33') canBuy = false;
    if (category === 'burner' && currentOwnedInCat === 'burn8x' && itemId === 'burn2x') canBuy = false;

    return (
      <div 
        key={itemId} 
        className="win-outset-shallow" 
        style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e1e1e1', marginBottom: '4px', fontSize: '12px' }}
      >
        <div>
          <strong>{itemInfo.name}</strong>
          <p style={{ fontSize: '11px', color: '#555' }}>
            {category === 'cpu' && `Speeds up boots, loading times & file extraction.`}
            {category === 'ram' && `Enables CD burning without buffer underruns.`}
            {category === 'sound' && (
              itemId === 'sb16' ? `Basic SoundBlaster 16 supporting FM synth tones.` :
              itemId === 'awe32' ? `SoundBlaster AWE32 with reverb effects.` :
              itemId === 'gus' ? `Gravis UltraSound supporting high-fidelity panned stereo tracks.` :
              `SoundBlaster AWE64 Gold with premium chorus flanger synthesis.`
            )}
            {category === 'video' && `Unlocks higher desktop resolutions and true colors.`}
            {category === 'modem' && `Increases simulated download rates (mIRC, CuteFTP).`}
            {category === 'burner' && `Allows writing ISO files to CD (needs fast RAM).`}
            {category === 'hddSlave' && `Fujitsu 4.3GB secondary drive (needs partitioning).`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#a00000' }}>${itemInfo.cost}</span>
          <button 
            className="win-btn" 
            disabled={!canBuy || isOwned}
            onClick={() => buyUpgrade(category, itemId)}
            style={{ width: '80px' }}
          >
            {isOwned ? 'Owned' : 'Buy'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '8px' }}>
      
      {/* Wallet Balance Board */}
      <div className="win-inset" style={{ padding: '8px', background: '#000080', color: '#fff', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>Retro PC Hardware Shop</span>
        <span>My Balance: <span style={{ color: '#00ff00' }}>${credits} Credits</span></span>
      </div>

      {/* Main scrolling item shelf */}
      <div className="win-inset" style={{ flex: 1, backgroundColor: '#fff', overflowY: 'auto', padding: '6px' }}>
        <h4 style={{ textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #ccc', margin: '6px 0', paddingBottom: '2px', color: '#333', textAlign: 'left' }}>Processors (CPU)</h4>
        {Object.entries(upgradeCosts.cpu).map(([id, info]) => renderUpgradeRow('cpu', id, info))}

        <h4 style={{ textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #ccc', margin: '12px 0 6px', paddingBottom: '2px', color: '#333', textAlign: 'left' }}>Memory RAM Sticks</h4>
        {Object.entries(upgradeCosts.ram).map(([id, info]) => renderUpgradeRow('ram', id, info))}

        <h4 style={{ textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #ccc', margin: '12px 0 6px', paddingBottom: '2px', color: '#333', textAlign: 'left' }}>Modems (DCC Download Speed)</h4>
        {Object.entries(upgradeCosts.modem).map(([id, info]) => renderUpgradeRow('modem', id, info))}

        <h4 style={{ textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #ccc', margin: '12px 0 6px', paddingBottom: '2px', color: '#333', textAlign: 'left' }}>Sound Cards (Audio FM Synthesis)</h4>
        {Object.entries(upgradeCosts.sound).map(([id, info]) => renderUpgradeRow('sound', id, info))}

        <h4 style={{ textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #ccc', margin: '12px 0 6px', paddingBottom: '2px', color: '#333', textAlign: 'left' }}>Video Graphic Cards (Resolutions)</h4>
        {Object.entries(upgradeCosts.video).map(([id, info]) => renderUpgradeRow('video', id, info))}

        <h4 style={{ textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #ccc', margin: '12px 0 6px', paddingBottom: '2px', color: '#333', textAlign: 'left' }}>CD-RW Burners</h4>
        {Object.entries(upgradeCosts.burner).map(([id, info]) => renderUpgradeRow('burner', id, info))}

        <h4 style={{ textTransform: 'uppercase', fontSize: '11px', borderBottom: '1px solid #ccc', margin: '12px 0 6px', paddingBottom: '2px', color: '#333', textAlign: 'left' }}>Hard Drives (Storage capacity)</h4>
        {Object.entries(upgradeCosts.hddSlave).map(([id, info]) => renderUpgradeRow('hddSlave', id, info))}
      </div>
    </div>
  );
}
