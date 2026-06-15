import React, { useState, useContext } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function PartitionMagic() {
  const { hardware, setHardware, setFileSystem, playSound } = useContext(HardwareContext);
  const [selectedDisk, setSelectedDisk] = useState(1); // 1 = Master, 2 = Slave
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatPercent, setFormatPercent] = useState(0);
  const [fsType, setFsType] = useState('FAT32');
  const [driveLetter, setDriveLetter] = useState('D');

  const masterDisk = hardware.hddMaster;
  const slaveDisk = hardware.hddSlave;

  const handleFormatAndMount = () => {
    if (selectedDisk === 2 && slaveDisk && !slaveDisk.formatted) {
      setIsFormatting(true);
      setFormatPercent(0);
      playSound('beep');

      const timer = setInterval(() => {
        setFormatPercent(prev => {
          const next = prev + 5;
          if (next >= 100) {
            clearInterval(timer);
            setIsFormatting(false);
            
            // Format and mount drive letter D: or E: in virtual filesystem
            setHardware(prevHw => ({
              ...prevHw,
              hddSlave: {
                ...prevHw.hddSlave,
                formatted: true,
                driveLetter: driveLetter,
                fsType: fsType
              }
            }));

            setFileSystem(prevFs => ({
              ...prevFs,
              [`${driveLetter}:`]: {
                label: 'BACKUP_VOL',
                formatted: true,
                files: {}
              }
            }));
            
            playSound('beep');
            alert(`Drive ${driveLetter}: successfully formatted as ${fsType} and mounted!`);
            return 100;
          }
          return next;
        });
      }, 100);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)', padding: '10px', fontSize: '12px' }}>
      {/* Title logo and details */}
      <div style={{ background: 'linear-gradient(90deg, #ff0000, #0000ff)', color: '#fff', padding: '6px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--win-dark-gray)', fontSize: '13px' }}>
        <span>PartitionMagic(R) 3.01 by PowerQuest</span>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '8px', marginTop: '8px', overflow: 'hidden' }}>
        {/* Drive select panel */}
        <div className="win-inset" style={{ width: '130px', backgroundColor: '#fff', padding: '4px', textAlign: 'left' }}>
          <strong>Physical Drives:</strong>
          <div 
            onClick={() => setSelectedDisk(1)}
            style={{ padding: '6px 4px', margin: '4px 0', cursor: 'default', background: selectedDisk === 1 ? 'var(--win-blue)' : 'transparent', color: selectedDisk === 1 ? '#fff' : '#000' }}
          >
            💾 Disk 1 (C:) <br/> {masterDisk.name}
          </div>
          {slaveDisk ? (
            <div 
              onClick={() => setSelectedDisk(2)}
              style={{ padding: '6px 4px', margin: '4px 0', cursor: 'default', background: selectedDisk === 2 ? 'var(--win-blue)' : 'transparent', color: selectedDisk === 2 ? '#fff' : '#000' }}
            >
              💾 Disk 2 ({slaveDisk.formatted ? `${slaveDisk.driveLetter}:` : '?'}) <br/> {slaveDisk.name}
            </div>
          ) : (
            <div style={{ padding: '6px 4px', color: '#888', fontStyle: 'italic' }}>
              No Secondary Slave IDE HDD detected.
            </div>
          )}
        </div>

        {/* Partition config panel */}
        <div className="win-outset" style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
          {selectedDisk === 1 ? (
            <div>
              <h3>Primary Master Drive:</h3>
              <p style={{ marginTop: '8px' }}>Drive Label: <strong>SYSTEM (C:)</strong></p>
              <p>Capacity: <strong>1.2 GB (1,200,000,000 bytes)</strong></p>
              <p>File System: <strong>FAT16</strong></p>
              <p>Status: <strong>Active / Primary</strong></p>
              <p style={{ color: '#005500', marginTop: '12px', fontWeight: 'bold' }}>All clusters ok. Partition locked by active OS.</p>
            </div>
          ) : (
            slaveDisk && (
              <div>
                <h3>Primary Slave Drive:</h3>
                <p style={{ marginTop: '4px' }}>Capacity: <strong>4.3 GB (4,300,000,000 bytes)</strong></p>
                
                {slaveDisk.formatted ? (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p>Drive Label: <strong>BACKUP_VOL ({slaveDisk.driveLetter}:)</strong></p>
                    <p>File System: <strong>{slaveDisk.fsType}</strong></p>
                    <p>Status: <strong>Extended / Formatted</strong></p>
                    <p style={{ color: '#00aa00', fontWeight: 'bold', marginTop: '8px' }}>Volume ready for read/write file execution.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <p style={{ color: '#a00000', fontWeight: 'bold' }}>Status: UNALLOCATED / NOT FORMATTED</p>
                    
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '6px' }}>
                      <span>Format Type:</span>
                      <select value={fsType} onChange={(e) => setFsType(e.target.value)} style={{ padding: '2px', fontFamily: 'var(--font-win)' }}>
                        <option value="FAT32">FAT32 (LBA)</option>
                        <option value="FAT16">FAT16 (2GB limit)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span>Drive Letter:</span>
                      <select value={driveLetter} onChange={(e) => setDriveLetter(e.target.value)} style={{ padding: '2px', fontFamily: 'var(--font-win)' }}>
                        <option value="D">D:\</option>
                        <option value="E">E:\</option>
                        <option value="F">F:\</option>
                      </select>
                    </div>

                    <button 
                      className="win-btn" 
                      onClick={handleFormatAndMount} 
                      disabled={isFormatting}
                      style={{ marginTop: '12px', width: '150px', fontWeight: 'bold' }}
                    >
                      Format & Mount Drive
                    </button>

                    {isFormatting && (
                      <div style={{ marginTop: '8px' }}>
                        <p>Writing cluster table: {formatPercent}%...</p>
                        <div className="win-inset" style={{ height: '16px', background: '#fff', overflow: 'hidden', marginTop: '4px' }}>
                          <div style={{ width: `${formatPercent}%`, height: '100%', background: 'blue' }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
