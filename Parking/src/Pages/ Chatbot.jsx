import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, User as UserIcon } from 'lucide-react';
import API from '../apis/config';

const Chatbot = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm Parkly Sais GPT. How can I help you today?",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await API.post('/rag/ask/', { question: inputValue });
      const botMessage = {
        id: messages.length + 2,
        text: response.data.answer || "I'm sorry, I couldn't process your request.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = "Sorry, I'm having trouble connecting. Please try again later.";
      if (error.response?.status === 401) {
        errorMessage = "Please login to continue chatting.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      }
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
      {isOpen ? (
        <div className={`
          w-[90vw] h-[80vh] max-w-[28rem] max-h-[32rem] 
          flex flex-col rounded-xl shadow-2xl overflow-hidden 
          transition-all transform
          ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
        `}>
          {/* Responsive Chat Header */}
          <div className={`flex items-center justify-between p-3 sm:p-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'}`}>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-semibold text-sm sm:text-lg">Parkly Sais GPT</span>
            </div>
            <button 
              onClick={toggleChat}
              className={`p-1 sm:p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-700'}`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Responsive Messages Area */}
          <div className={`flex-1 p-3 sm:p-4 overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-3 sm:mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[80%] sm:max-w-md p-3 sm:p-4 rounded-xl
                    ${message.sender === 'user' 
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') 
                      : (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')
                    }
                  `}
                >
                  <div className="flex items-center mb-1 sm:mb-2">
                    {message.sender === 'user' ? (
                      <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    ) : (
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    )}
                    <span className="text-xs sm:text-sm opacity-80">{message.timestamp}</span>
                  </div>
                  <p className="text-sm sm:text-base">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3 sm:mb-4">
                <div className={`max-w-[80%] sm:max-w-xs p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Responsive Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className={`p-3 sm:p-4 border-t ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className={`
                  flex-1 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base 
                  rounded-l-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  }
                `}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`
                  py-2 sm:py-3 px-3 sm:px-4 rounded-r-xl 
                  ${darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } 
                  ${(!inputValue.trim() || isLoading) && 'opacity-50 cursor-not-allowed'}
                `}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className={`
            p-4 sm:p-5 rounded-full shadow-lg 
            ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} 
            text-white transition-all transform hover:scale-110
          `}
        >
          <Bot className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;