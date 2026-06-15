import React, { useState, useEffect, useContext, useRef } from 'react';
import { HardwareContext } from '../context/HardwareContext';

export default function IcqWindow() {
  const { playSound, credits } = useContext(HardwareContext);
  const [activeChat, setActiveChat] = useState(null); // 'buddy_mike', 'client_dave'
  const [messageText, setMessageText] = useState('');
  const [chats, setChats] = useState({
    buddy_mike: [
      { sender: 'Mike', text: 'Yo! Have you seen that new site consolecopyworld?' },
      { sender: 'Mike', text: 'They got the buffer underrun patch for CDRWin there!' },
      { sender: 'You', text: 'Nice, I will check it.' }
    ],
    client_dave: [
      { sender: 'Dave', text: 'Hey, are you home? Can you burn me that King Africa CD?' },
      { sender: 'Dave', text: 'I need it for a party tonight. Plus that Millencolin album.' }
    ]
  });

  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, activeChat]);

  // Simulate an incoming ICQ message event
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uh-oh!
      playSound('beep'); // fallback
      
      setChats(prev => ({
        ...prev,
        buddy_mike: [
          ...prev.buddy_mike,
          { sender: 'Mike', text: 'By the way, do NOT open any keygens from the BBS, there is a Melissa virus going around!' }
        ]
      }));
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChat) return;
    
    setChats(prev => ({
      ...prev,
      [activeChat]: [
        ...prev[activeChat],
        { sender: 'You', text: messageText }
      ]
    }));
    
    // Simple bot reply logic
    const userText = messageText.toLowerCase();
    const buddy = activeChat;
    
    setTimeout(() => {
      let reply = "I'm busy downloading a massive 2.8MB split file right now, talk later!";
      if (buddy === 'client_dave') {
        if (userText.includes('burn') || userText.includes('cd') || userText.includes('done')) {
          reply = "Awesome! Let me know when you have the burned CD ready. I will pay you $150 credits!";
        } else {
          reply = "Did you get the MP3s from mIRC fserv? I need King Africa and Millencolin.";
        }
      } else if (buddy === 'buddy_mike') {
        if (userText.includes('virus') || userText.includes('infected')) {
          reply = "Bro, if you get infected by Chernobyl/CIH, you will need a Windows 95 boot floppy to format C: and reinstall setup!";
        } else if (userText.includes('sound') || userText.includes('doom')) {
          reply = "Remember, Duke Nukem needs IRQ 5, Port 220 in the Setup utility, otherwise it won't load the SoundBlaster!";
        }
      }

      setChats(prev => ({
        ...prev,
        [buddy]: [
          ...prev[buddy],
          { sender: buddy === 'buddy_mike' ? 'Mike' : 'Dave', text: reply }
        ]
      }));
      playSound('beep'); // Trigger ICQ alert
    }, 15000);

    setMessageText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--win-gray)' }}>
      {/* ICQ Header logo */}
      <div style={{ background: '#008000', color: '#fff', padding: '6px', fontSize: '14px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--win-dark-gray)' }}>
        <span>ICQ - Online</span>
        <span>My UIN: 1048293</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Contact list side */}
        <div className="win-inset" style={{ width: '100px', backgroundColor: '#fff', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '2px' }}>
          <div 
            onClick={() => setActiveChat('buddy_mike')} 
            style={{ padding: '6px 4px', cursor: 'default', background: activeChat === 'buddy_mike' ? 'var(--win-blue)' : 'transparent', color: activeChat === 'buddy_mike' ? '#fff' : '#000', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
          >
            <span style={{ color: '#0f0' }}>●</span> Mike (Online)
          </div>
          <div 
            onClick={() => setActiveChat('client_dave')} 
            style={{ padding: '6px 4px', cursor: 'default', background: activeChat === 'client_dave' ? 'var(--win-blue)' : 'transparent', color: activeChat === 'client_dave' ? '#fff' : '#000', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
          >
            <span style={{ color: '#0f0' }}>●</span> Dave (Online)
          </div>
        </div>

        {/* Chat box area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--win-gray)', padding: '4px' }}>
          {activeChat ? (
            <>
              <div className="win-inset" style={{ flex: 1, background: '#fff', padding: '6px', overflowY: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                {chats[activeChat].map((msg, idx) => (
                  <div key={idx}>
                    <strong style={{ color: msg.sender === 'You' ? '#000080' : '#800000' }}>{msg.sender}:</strong>
                    <p style={{ margin: '2px 0 0 4px', color: '#111' }}>{msg.text}</p>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                <input 
                  type="text" 
                  value={messageText} 
                  onChange={(e) => setMessageText(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="win-input" 
                  style={{ flex: 1 }} 
                  placeholder="Type message..." 
                />
                <button className="win-btn" onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#606060', fontSize: '12px' }}>
              Select a contact to chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
