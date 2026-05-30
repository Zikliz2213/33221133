const WS_URL = 'wss://pipipupu-production.up.railway.app';

export type WSMessage = {
  type: string;
  data: any;
};

export type WSMessageHandler = (message: WSMessage) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private token: string;
  private handlers: Map<string, Set<WSMessageHandler>> = new Map();
  private reconnectTimeout: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(token: string) {
    this.token = token;
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(`${WS_URL}?token=${this.token}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      this.reconnectTimeout = window.setTimeout(() => {
        this.connect();
      }, delay);
    }
  }

  private handleMessage(message: WSMessage) {
    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }

    // Also trigger wildcard handlers
    const wildcardHandlers = this.handlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => handler(message));
    }
  }

  public on(type: string, handler: WSMessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
  }

  public off(type: string, handler: WSMessageHandler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public send(type: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
