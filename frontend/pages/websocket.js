export default class WebSocketClient {
  constructor(onMessageCallback) {
    this.websocket = null;
    this.onMessageCallback = onMessageCallback;
  }

  connect() {
    this.websocket = new WebSocket('ws://localhost:8000/ws'); 

    this.websocket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    this.websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.audioUrl) {
        this.onMessageCallback(response);
      }
    };

    this.websocket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  sendMessage(message) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      const data = JSON.stringify({ message });
      this.websocket.send(data);
    } else {
      console.log('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
