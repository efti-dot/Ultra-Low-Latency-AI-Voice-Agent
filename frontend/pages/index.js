import { useState, useEffect } from 'react';
import WebSocketClient from './websocket';
import VoicePlayer from './VoicePlayer';

export default function Home() {
  const [message, setMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUserInput = (inputText) => {
    if (inputText) {
      setIsProcessing(true);
      setMessage(inputText);
      websocketClient.sendMessage(inputText);
    }
  };

  const handleVoiceResponse = (response) => {
    setIsProcessing(false);
    setAudioUrl(response.audioUrl);
  };

  const websocketClient = new WebSocketClient(handleVoiceResponse);

  useEffect(() => {
    websocketClient.connect();

    return () => {
      websocketClient.disconnect();
    };
  }, []);

  return (
    <div className="container" style={{ maxWidth: 400, margin: 'auto', padding: 32 }}>
    <h1 style={{ textAlign: 'center' }}>AI Voice Agent</h1>
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        placeholder="Type or speak something..."
        style={{ flex: 1, padding: 8 }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleUserInput(e.target.value);
        }}
      />
      <button style={{ padding: 8 }} disabled={isProcessing}>
        🎤
      </button>
      <button style={{ padding: 8 }} onClick={() => handleUserInput(message)} disabled={isProcessing}>
        {isProcessing ? '...' : 'Send'}
      </button>
    </div>
    <div style={{ marginBottom: 16 }}>
      {audioUrl ? (
        <VoicePlayer audioUrl={audioUrl} />
      ) : (
        <p>{isProcessing ? 'AI is processing your input...' : 'Waiting for input...'}</p>
      )}
    </div>
    <div style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>
      {isConnected ? 'Connected to AI Agent' : 'Connecting...'}
    </div>
  </div>
  );
}
