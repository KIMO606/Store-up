import { useState, useEffect } from 'react';
import { sendMessageToOpenRouter, isEcommerceRelated } from '../services/openrouterService';

const useChatbot = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'مرحباً بك في مساعد Storeup الذكي! كيف يمكنني مساعدتك في متجرك الإلكتروني اليوم؟\n\nWelcome to Storeup Assistant! How can I help you with your e-commerce store today?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('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');
  
  // Load messages and API key from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('storeup-chat-messages');
    const storedApiKey = localStorage.getItem('storeup-openrouter-key');
    
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (err) {
        console.error('Error parsing stored messages:', err);
      }
    }
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      // Store the default API key in localStorage
      localStorage.setItem('storeup-openrouter-key', apiKey);
    }
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('storeup-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);
  
  // Save API key to localStorage
  const saveApiKey = (key) => {
    localStorage.setItem('storeup-openrouter-key', key);
    setApiKey(key);
  };
  
  // Clear API key to force re-entry
  const clearApiKey = () => {
    localStorage.removeItem('storeup-openrouter-key');
    setApiKey('');
  };
  
  // Send message to OpenRouter
  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Check if message is related to e-commerce
    if (!isEcommerceRelated(message)) {
      const notRelatedMessage = {
        role: 'assistant',
        content: 'يمكنني فقط الإجابة على الأسئلة المتعلقة بالتجارة الإلكترونية أو التسوق عبر الإنترنت أو منصة Storeup. يرجى طرح سؤال يتعلق بهذه المواضيع.\n\nI can only answer questions related to e-commerce, online shopping, or the Storeup platform. Please ask a question related to these topics.'
      };
      
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', content: message },
        notRelatedMessage
      ]);
      
      return;
    }
    
    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', content: message }
    ]);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Format messages for OpenRouter API
      const formattedMessages = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      formattedMessages.push({ role: 'user', content: message });
      
      // Send to OpenRouter
      const response = await sendMessageToOpenRouter(formattedMessages, apiKey);
      
      // Add bot response to chat with model information
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: response.content,
          modelUsed: response.modelUsed
        }
      ]);
    } catch (err) {
      setError(err.message || 'Failed to get response from Llama model');
      
      // Check if it's an API key error
      const isApiKeyError = err.message?.includes('مفتاح API غير صالح') || err.message?.includes('API key');
      
      // Add error message to chat with custom styling for API key errors
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: err.message || 'حدث خطأ أثناء الاتصال بالنموذج.\n\nAn error occurred while connecting to the model.',
          isError: true,
          isApiKeyError: isApiKeyError
        }
      ]);
      
      // If API key error, suggest opening the API key modal
      if (isApiKeyError) {
        // We could automatically open the modal here if desired
        // But for now, we'll just show the error message
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear chat history
  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'مرحباً بك في مساعد Storeup الذكي! كيف يمكنني مساعدتك في متجرك الإلكتروني اليوم؟\n\nWelcome to Storeup Assistant! How can I help you with your e-commerce store today?'
    }]);
    localStorage.removeItem('storeup-chat-messages');
  };
  
  return {
    messages,
    isLoading,
    error,
    apiKey,
    sendMessage,
    saveApiKey,
    clearApiKey,
    clearChat
  };
};

export default useChatbot; 