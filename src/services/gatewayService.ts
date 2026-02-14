import { WebSocket } from 'ws';
import { Mission, SideHustle, SystemStatus, AgentStatus } from '@/types';

class GatewayService {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second

  // Callbacks for data updates
  private onMissionsUpdate: ((missions: Mission[]) => void) | null = null;
  private onSideHustlesUpdate: ((sideHustles: SideHustle[]) => void) | null = null;
  private onSystemStatusUpdate: ((status: SystemStatus) => void) | null = null;
  private onAgentStatusUpdate: ((agents: AgentStatus[]) => void) | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      // In a browser environment, we would use the native WebSocket
      // For Node.js environments, we use the 'ws' library
      if (typeof window !== 'undefined') {
        this.ws = new WebSocket('ws://127.0.0.1:18789') as any;
      } else {
        this.ws = new WebSocket('ws://127.0.0.1:18789');
      }

      this.ws.onopen = () => {
        console.log('Connected to OpenClaw gateway');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onclose = () => {
        console.log('Disconnected from OpenClaw gateway');
        this.isConnected = false;
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to OpenClaw gateway:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts); // Exponential backoff
    } else {
      console.error('Max reconnect attempts reached. Please check the OpenClaw gateway.');
    }
  }

  private handleMessage(data: WebSocket.Data) {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'missions_update':
          if (this.onMissionsUpdate) {
            this.onMissionsUpdate(message.data);
          }
          break;
        case 'side_hustles_update':
          if (this.onSideHustlesUpdate) {
            this.onSideHustlesUpdate(message.data);
          }
          break;
        case 'system_status_update':
          if (this.onSystemStatusUpdate) {
            this.onSystemStatusUpdate(message.data);
          }
          break;
        case 'agent_status_update':
          if (this.onAgentStatusUpdate) {
            this.onAgentStatusUpdate(message.data);
          }
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  // Set callbacks for data updates
  public setMissionsUpdateCallback(callback: (missions: Mission[]) => void) {
    this.onMissionsUpdate = callback;
  }

  public setSideHustlesUpdateCallback(callback: (sideHustles: SideHustle[]) => void) {
    this.onSideHustlesUpdate = callback;
  }

  public setSystemStatusUpdateCallback(callback: (status: SystemStatus) => void) {
    this.onSystemStatusUpdate = callback;
  }

  public setAgentStatusUpdateCallback(callback: (agents: AgentStatus[]) => void) {
    this.onAgentStatusUpdate = callback;
  }

  // Send a message to the gateway
  public sendMessage(type: string, data?: any) {
    if (this.isConnected && this.ws) {
      const message = {
        type,
        data
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('Not connected to gateway. Message not sent:', type);
    }
  }

  // Close the connection
  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Export a singleton instance
export const gatewayService = new GatewayService();