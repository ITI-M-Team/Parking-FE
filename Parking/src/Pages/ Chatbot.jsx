// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Bot, X, User as UserIcon } from 'lucide-react';
// import API from '../apis/config';

// const Chatbot = ({ darkMode }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Initial greeting message
//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       setMessages([
//         {
//           id: 1,
//           text: "Hello! I'm Parkly Sais GPT. How can I help you today?",
//           sender: 'bot',
//           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         }
//       ]);
//     }
//   }, [isOpen]);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;

//     const userMessage = {
//       id: messages.length + 1,
//       text: inputValue,
//       sender: 'user',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       const response = await API.post('/rag/ask/', { question: inputValue });
//       const botMessage = {
//         id: messages.length + 2,
//         text: response.data.answer || "I'm sorry, I couldn't process your request.",
//         sender: 'bot',
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };
//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       let errorMessage = "Sorry, I'm having trouble connecting. Please try again later.";
//       if (error.response?.status === 401) {
//         errorMessage = "Please login to continue chatting.";
//       } else if (error.response?.status === 500) {
//         errorMessage = "Server error occurred. Please try again later.";
//       }
//       setMessages(prev => [...prev, {
//         id: messages.length + 2,
//         text: errorMessage,
//         sender: 'bot',
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
//       {isOpen ? (
//         <div className={`
//           w-[90vw] h-[80vh] max-w-[28rem] max-h-[32rem] 
//           flex flex-col rounded-xl shadow-2xl overflow-hidden 
//           transition-all transform
//           ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
//         `}>
//           {/* Responsive Chat Header */}
//           <div className={`flex items-center justify-between p-3 sm:p-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'}`}>
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
//               <span className="font-semibold text-sm sm:text-lg">Parkly Sais GPT</span>
//             </div>
//             <button 
//               onClick={toggleChat}
//               className={`p-1 sm:p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-700'}`}
//             >
//               <X className="w-4 h-4 sm:w-5 sm:h-5" />
//             </button>
//           </div>

//           {/* Responsive Messages Area */}
//           <div className={`flex-1 p-3 sm:p-4 overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
//             {messages.map((message) => (
//               <div 
//                 key={message.id} 
//                 className={`mb-3 sm:mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div 
//                   className={`
//                     max-w-[80%] sm:max-w-md p-3 sm:p-4 rounded-xl
//                     ${message.sender === 'user' 
//                       ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') 
//                       : (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')
//                     }
//                   `}
//                 >
//                   <div className="flex items-center mb-1 sm:mb-2">
//                     {message.sender === 'user' ? (
//                       <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
//                     ) : (
//                       <Bot className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
//                     )}
//                     <span className="text-xs sm:text-sm opacity-80">{message.timestamp}</span>
//                   </div>
//                   <p className="text-sm sm:text-base">{message.text}</p>
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start mb-3 sm:mb-4">
//                 <div className={`max-w-[80%] sm:max-w-xs p-3 sm:p-4 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
//                   <div className="flex space-x-1 sm:space-x-2">
//                     <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
//                     <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
//                     <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Responsive Input Area */}
//           <form 
//             onSubmit={handleSendMessage}
//             className={`p-3 sm:p-4 border-t ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
//           >
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder="Type your message..."
//                 className={`
//                   flex-1 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base 
//                   rounded-l-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 
//                   ${darkMode 
//                     ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
//                     : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
//                   }
//                 `}
//                 disabled={isLoading}
//               />
//               <button
//                 type="submit"
//                 disabled={!inputValue.trim() || isLoading}
//                 className={`
//                   py-2 sm:py-3 px-3 sm:px-4 rounded-r-xl 
//                   ${darkMode 
//                     ? 'bg-blue-600 hover:bg-blue-700 text-white' 
//                     : 'bg-blue-500 hover:bg-blue-600 text-white'
//                   } 
//                   ${(!inputValue.trim() || isLoading) && 'opacity-50 cursor-not-allowed'}
//                 `}
//               >
//                 <Send className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </form>
//         </div>
//       ) : (
//         <button
//           onClick={toggleChat}
//           className={`
//             p-4 sm:p-5 rounded-full shadow-lg 
//             ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} 
//             text-white transition-all transform hover:scale-110
//           `}
//         >
//           <Bot className="w-6 h-6 sm:w-8 sm:h-8" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Chatbot;

// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Bot, X, User as UserIcon, Minimize2, MessageCircle, Copy, RotateCcw } from 'lucide-react';
// import API from '../apis/config';

// const Chatbot = ({ darkMode }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   // Enhanced initial greeting with typing animation
//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       setIsTyping(true);
//       setTimeout(() => {
//         setMessages([
//           {
//             id: 1,
//             text: "Hi there! 👋 I'm Parkly Sais GPT, your intelligent parking assistant. I'm here to help you with parking information, availability, pricing, and any questions you might have!",
//             sender: 'bot',
//             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//           }
//         ]);
//         setIsTyping(false);
//       }, 1500);
//     }
//   }, [isOpen]);

//   // Auto-scroll with smooth animation
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ 
//         behavior: 'smooth',
//         block: 'end'
//       });
//     }
//   }, [messages, isTyping]);

//   // Focus input when chat opens
//   useEffect(() => {
//     if (isOpen && !isMinimized && inputRef.current) {
//       setTimeout(() => inputRef.current.focus(), 100);
//     }
//   }, [isOpen, isMinimized]);

//   // Update unread count
//   useEffect(() => {
//     if (!isOpen && messages.length > 0) {
//       const lastMessage = messages[messages.length - 1];
//       if (lastMessage.sender === 'bot') {
//         setUnreadCount(prev => prev + 1);
//       }
//     } else if (isOpen) {
//       setUnreadCount(0);
//     }
//   }, [messages, isOpen]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim() || isLoading) return;

//     const userMessage = {
//       id: Date.now(),
//       text: inputValue.trim(),
//       sender: 'user',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsLoading(true);
//     setIsTyping(true);

//     try {
//       const response = await API.post('/rag/ask/', { question: inputValue.trim() });
      
//       // Simulate realistic typing delay
//       setTimeout(() => {
//         const botMessage = {
//           id: Date.now() + 1,
//           text: response.data.answer || "I apologize, but I couldn't process your request at the moment. Please try rephrasing your question.",
//           sender: 'bot',
//           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         };
//         setMessages(prev => [...prev, botMessage]);
//         setIsTyping(false);
//       }, Math.random() * 1000 + 800);
      
//     } catch (error) {
//       console.error('Error sending message:', error);
      
//       setTimeout(() => {
//         let errorMessage = "I'm experiencing some technical difficulties. Please try again in a moment.";
        
//         if (error.response?.status === 401) {
//           errorMessage = "🔐 Please log in to continue our conversation.";
//         } else if (error.response?.status === 500) {
//           errorMessage = "⚠️ Server is temporarily unavailable. Please try again later.";
//         } else if (error.response?.status === 429) {
//           errorMessage = "⏳ Too many requests. Please wait a moment before trying again.";
//         }
        
//         setMessages(prev => [...prev, {
//           id: Date.now() + 1,
//           text: errorMessage,
//           sender: 'bot',
//           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         }]);
//         setIsTyping(false);
//       }, 800);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const copyMessage = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       // Could add a toast notification here
//     });
//   };

//   const clearChat = () => {
//     setMessages([]);
//     setTimeout(() => {
//       setMessages([
//         {
//           id: 1,
//           text: "Chat cleared! How can I assist you today? 🚗",
//           sender: 'bot',
//           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         }
//       ]);
//     }, 300);
//   };

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//     setIsMinimized(false);
//   };

//   const toggleMinimize = () => {
//     setIsMinimized(!isMinimized);
//   };

//   // Quick reply suggestions
//   const quickReplies = [
//     "Find parking near me",
//     "Check parking rates",
//     "Available spots",
//     "How does Parkly work?"
//   ];

//   const handleQuickReply = (reply) => {
//     setInputValue(reply);
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
//       {isOpen ? (
//         <div className={`
//           w-[95vw] h-[85vh] max-w-[26rem] max-h-[34rem] 
//           flex flex-col rounded-2xl shadow-2xl overflow-hidden 
//           transition-all duration-300 transform
//           ${isMinimized ? 'h-16' : ''}
//           ${darkMode 
//             ? 'bg-gray-900 border border-gray-700 shadow-gray-800/50' 
//             : 'bg-white border border-gray-200 shadow-black/20'
//           }
//         `}>
          
//           {/* Enhanced Header */}
//           <div className={`
//             flex items-center justify-between p-4 backdrop-blur-sm
//             ${darkMode 
//               ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
//               : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
//             }
//           `}>
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <Bot className="w-6 h-6" />
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
//               </div>
//               <div>
//                 <span className="font-bold text-base">Parkly Sais GPT</span>
//                 <div className="text-xs opacity-80">
//                   {isTyping ? 'Typing...' : 'Online'}
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button 
//                 onClick={clearChat}
//                 className="p-2 rounded-full hover:bg-white/20 transition-colors"
//                 title="Clear chat"
//               >
//                 <RotateCcw className="w-4 h-4" />
//               </button>
//               <button 
//                 onClick={toggleMinimize}
//                 className="p-2 rounded-full hover:bg-white/20 transition-colors"
//                 title={isMinimized ? "Expand" : "Minimize"}
//               >
//                 <Minimize2 className="w-4 h-4" />
//               </button>
//               <button 
//                 onClick={toggleChat}
//                 className="p-2 rounded-full hover:bg-white/20 transition-colors"
//                 title="Close chat"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {!isMinimized && (
//             <>
//               {/* Enhanced Messages Area */}
//               <div className={`
//                 flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
//                 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'}
//               `}>
//                 {messages.map((message) => (
//                   <div 
//                     key={message.id} 
//                     className={`mb-4 flex items-end space-x-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                   >
//                     {message.sender === 'bot' && (
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
//                         <Bot className="w-4 h-4 text-white" />
//                       </div>
//                     )}
                    
//                     <div className="group relative max-w-[80%]">
//                       <div 
//                         className={`
//                           p-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md
//                           ${message.sender === 'user' 
//                             ? (darkMode 
//                                 ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
//                                 : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
//                               )
//                             : (darkMode 
//                                 ? 'bg-gray-800 text-gray-100 border border-gray-700' 
//                                 : 'bg-white text-gray-800 border border-gray-200'
//                               )
//                           }
//                           ${message.sender === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}
//                         `}
//                       >
//                         <p className="text-sm leading-relaxed">{message.text}</p>
//                         <div className="flex items-center justify-between mt-2">
//                           <span className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
//                             {message.timestamp}
//                           </span>
//                           <button
//                             onClick={() => copyMessage(message.text)}
//                             className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10 ${message.sender === 'user' ? 'text-blue-100' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
//                             title="Copy message"
//                           >
//                             <Copy className="w-3 h-3" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {message.sender === 'user' && (
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                         <UserIcon className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Enhanced Typing Indicator */}
//                 {isTyping && (
//                   <div className="flex items-end space-x-2 mb-4">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
//                       <Bot className="w-4 h-4 text-white" />
//                     </div>
//                     <div className={`p-3 rounded-2xl rounded-bl-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
//                       <div className="flex space-x-1">
//                         <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '0ms' }} />
//                         <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '150ms' }} />
//                         <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '300ms' }} />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Quick Replies */}
//               {messages.length === 1 && !isLoading && !isTyping && (
//                 <div className={`px-4 pb-2 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
//                   <div className="text-xs text-gray-500 mb-2 pt-2">Quick suggestions:</div>
//                   <div className="flex flex-wrap gap-2">
//                     {quickReplies.map((reply, index) => (
//                       <button
//                         key={index}
//                         onClick={() => handleQuickReply(reply)}
//                         className={`
//                           px-3 py-1.5 text-xs rounded-full transition-all
//                           ${darkMode 
//                             ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
//                           }
//                         `}
//                       >
//                         {reply}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Enhanced Input Area */}
//               <form 
//                 onSubmit={handleSendMessage}
//                 className={`p-4 border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
//               >
//                 <div className="flex items-end space-x-2">
//                   <div className="flex-1 relative">
//                     <input
//                       ref={inputRef}
//                       type="text"
//                       value={inputValue}
//                       onChange={(e) => setInputValue(e.target.value)}
//                       placeholder="Type your message..."
//                       className={`
//                         w-full py-3 px-4 text-sm rounded-2xl border-2 transition-all duration-200
//                         focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
//                         ${darkMode 
//                           ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
//                           : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
//                         }
//                         ${isLoading && 'cursor-not-allowed opacity-75'}
//                       `}
//                       disabled={isLoading}
//                       maxLength={500}
//                     />
//                     <div className={`absolute bottom-1 right-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
//                       {inputValue.length}/500
//                     </div>
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={!inputValue.trim() || isLoading}
//                     className={`
//                       p-3 rounded-2xl transition-all duration-200 transform
//                       ${!inputValue.trim() || isLoading
//                         ? 'opacity-50 cursor-not-allowed scale-100'
//                         : 'hover:scale-105 active:scale-95 shadow-lg'
//                       }
//                       ${darkMode 
//                         ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
//                         : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
//                       } 
//                       text-white
//                     `}
//                   >
//                     <Send className="w-5 h-5" />
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       ) : (
//         <button
//           onClick={toggleChat}
//           className={`
//             relative p-4 rounded-2xl shadow-xl transition-all duration-300 transform 
//             hover:scale-110 active:scale-95 group
//             ${darkMode 
//               ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
//               : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
//             } 
//             text-white
//           `}
//         >
//           <MessageCircle className="w-6 h-6" />
          
//           {/* Unread badge */}
//           {unreadCount > 0 && (
//             <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
//               {unreadCount > 9 ? '9+' : unreadCount}
//             </div>
//           )}
          
//           {/* Pulse animation */}
//           <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-500 opacity-75 group-hover:animate-ping"></div>
//         </button>
//       )}
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, User as UserIcon, Minimize2, MessageCircle, Copy, RotateCcw } from 'lucide-react';
import API from '../apis/config';

const Chatbot = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Enhanced initial greeting with typing animation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            text: "Hi there! 👋 I'm Parkly Sais GPT, your intelligent parking assistant. I'm here to help you with parking information, availability, pricing, and any questions you might have!",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  }, [isOpen]);

  // Auto-scroll with smooth animation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Update unread count
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await API.post('/rag/ask/', { question: inputValue.trim() });
      
      // Simulate realistic typing delay
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.answer || "I apologize, but I couldn't process your request at the moment. Please try rephrasing your question.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, Math.random() * 1000 + 800);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      setTimeout(() => {
        let errorMessage = "I'm experiencing some technical difficulties. Please try again in a moment.";
        
        if (error.response?.status === 401) {
          errorMessage = "🔐 Please log in to continue our conversation.";
        } else if (error.response?.status === 500) {
          errorMessage = "⚠️ Server is temporarily unavailable. Please try again later.";
        } else if (error.response?.status === 429) {
          errorMessage = "⏳ Too many requests. Please wait a moment before trying again.";
        }
        
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  const clearChat = () => {
    setMessages([]);
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          text: "Chat cleared! How can I assist you today? 🚗",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 300);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Quick reply suggestions
  const quickReplies = [
    "Find parking near me",
    "Check parking rates",
    "Available spots",
    "How does Parkly work?"
  ];

  const handleQuickReply = (reply) => {
    setInputValue(reply);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
      {isOpen ? (
        <div className={`
          w-[95vw] h-[85vh] max-w-[26rem] max-h-[34rem] 
          flex flex-col rounded-2xl shadow-2xl overflow-hidden 
          transition-all duration-300 transform
          ${isMinimized ? 'h-16' : ''}
          ${darkMode 
            ? 'bg-gray-900 border border-gray-700 shadow-gray-800/50' 
            : 'bg-white border border-gray-200 shadow-black/20'
          }
        `}>
          
          {/* Enhanced Header */}
          <div className={`
            flex items-center justify-between p-4 backdrop-blur-sm
            ${darkMode 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
            }
          `}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <span className="font-bold text-base">Parkly Sais GPT</span>
                <div className="text-xs opacity-80">
                  {isTyping ? 'Typing...' : 'Online'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={clearChat}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={toggleMinimize}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button 
                onClick={toggleChat}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Enhanced Messages Area */}
              <div className={`
                flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
                ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'}
              `}>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`mb-4 flex items-end space-x-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className="group relative max-w-[80%]">
                      <div 
                        className={`
                          p-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md
                          ${message.sender === 'user' 
                            ? (darkMode 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              )
                            : (darkMode 
                                ? 'bg-gray-800 text-gray-100 border border-gray-700' 
                                : 'bg-white text-gray-800 border border-gray-200'
                              )
                          }
                          ${message.sender === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}
                        `}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                            {message.timestamp}
                          </span>
                          <button
                            onClick={() => copyMessage(message.text)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10 ${message.sender === 'user' ? 'text-blue-100' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                            title="Copy message"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {message.sender === 'user' && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <UserIcon className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                    )}
                  </div>
                ))}

                {/* Enhanced Typing Indicator */}
                {isTyping && (
                  <div className="flex items-end space-x-2 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className={`p-3 rounded-2xl rounded-bl-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '0ms' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '150ms' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length === 1 && !isLoading && !isTyping && (
                <div className={`px-4 pb-2 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                  <div className="text-xs text-gray-500 mb-2 pt-2">Quick suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className={`
                          px-3 py-1.5 text-xs rounded-full transition-all
                          ${darkMode 
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                          }
                        `}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Input Area */}
              <form 
                onSubmit={handleSendMessage}
                className={`p-4 border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className={`
                        w-full py-3 px-4 text-sm rounded-2xl border-2 transition-all duration-200
                        focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                        ${darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
                        }
                        ${isLoading && 'cursor-not-allowed opacity-75'}
                      `}
                      disabled={isLoading}
                      maxLength={500}
                    />
                    <div className={`absolute bottom-1 right-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {inputValue.length}/500
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className={`
                      p-3 rounded-2xl transition-all duration-200 transform
                      ${!inputValue.trim() || isLoading
                        ? 'opacity-50 cursor-not-allowed scale-100'
                        : 'hover:scale-105 active:scale-95 shadow-lg'
                      }
                      ${darkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                      } 
                      text-white
                    `}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className={`
            relative p-4 rounded-full shadow-lg 
            ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} 
            text-white transition-all
          `}
        >
          <Bot className="w-6 h-6 sm:w-8 sm:h-8" />
          
          {/* Unread badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default Chatbot;