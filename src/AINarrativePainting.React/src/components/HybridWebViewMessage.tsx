import { useCallback, useEffect } from 'react'

export interface HybridWebViewMessage {
  message: string;
  timestamp?: number;
  type?: string;
}

interface HybridWebViewEvent extends CustomEvent {
  detail: HybridWebViewMessage;
}

type MessageHandler = (message: HybridWebViewMessage) => void;

const useHybridWebView = (onMessage?: MessageHandler) => {
  const handleHybridMessage = useCallback((event: HybridWebViewEvent) => {
    try {
      const messageData = {
        ...event.detail,
        timestamp: event.detail.timestamp || Date.now()
      };
      
      console.log('HybridWebViewMessageReceived:', messageData);
      onMessage?.(messageData);
    } catch (error) {
      console.error('Error handling HybridWebView message:', error);
    }
  }, [onMessage]);

  useEffect(() => {
    const handler = handleHybridMessage as EventListener;
    window.addEventListener('HybridWebViewMessageReceived', handler);
    return () => window.removeEventListener('HybridWebViewMessageReceived', handler);
  }, [handleHybridMessage]);
};

interface Props {
  onMessage?: MessageHandler;
}

const HybridWebViewMessage: React.FC<Props> = ({ onMessage }) => {
  useHybridWebView(onMessage);
  return null;
};

export default HybridWebViewMessage;
