// import React, { useState, useRef, useEffect } from 'react';
// import { PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
// import { useStore } from '../../context/StoreContext';

// const ChatBot = () => {
//   const { store } = useStore();
//   const [messages, setMessages] = useState([
//     { role: 'assistant', content: 'مرحباً! أنا مساعد متجرك الذكي. كيف يمكنني مساعدتك اليوم؟' }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // التمرير التلقائي للأسفل عند إضافة رسائل جديدة
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleMessageSubmit = async (e) => {
//     e.preventDefault();
    
//     if (input.trim() === '') return;
    
//     // إضافة رسالة المستخدم إلى المحادثة
//     const userMessage = { role: 'user', content: input };
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       // تحضير الرسائل للإرسال مع إضافة سياق حول المتجر
//       const contextMessages = [
//         { 
//           role: 'system', 
//           content: `أنت مساعد متخصص في مجال التجارة الإلكترونية والمساعدة في استخدام منصة Storeup. 
//           أنت تعمل الآن في متجر "${store?.name || 'المتجر'}" وتساعد العملاء في التسوق والاستفسارات.
//           يجب أن تكون إجاباتك مرتبطة بالتجارة الإلكترونية والمبيعات عبر الإنترنت.
//           لا ترد على الأسئلة التي لا علاقة لها بالتجارة الإلكترونية.
//           كن محترفًا ومفيدًا ومختصرًا في إجاباتك.` 
//         },
//         ...messages.slice(-5), // نأخذ آخر 5 رسائل فقط للحفاظ على الذاكرة
//         userMessage
//       ];

//       // طلب إلى API
//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer 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'
//         },
//         body: JSON.stringify({
//           model: 'gpt-3.5-turbo',
//           messages: contextMessages,
//           temperature: 0.7,
//           max_tokens: 500
//         })
//       });

//       if (!response.ok) {
//         throw new Error('فشل الاتصال بـ API');
//       }

//       const data = await response.json();
//       const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
      
//       // إضافة رد المساعد إلى المحادثة
//       setMessages(prevMessages => [...prevMessages, assistantMessage]);
//     } catch (error) {
//       console.error('خطأ في الاتصال:', error);
//       // إضافة رسالة خطأ
//       setMessages(prevMessages => [...prevMessages, { 
//         role: 'assistant', 
//         content: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.' 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       { role: 'assistant', content: 'مرحباً! أنا مساعد متجرك الذكي. كيف يمكنني مساعدتك اليوم؟' }
//     ]);
//   };

//   return (
//     <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden shadow-lg border border-gray-200">
//       {/* رأس التشات */}
//       <div 
//         className="text-white p-4 flex justify-between items-center"
//         style={{ 
//           background: `linear-gradient(135deg, ${store?.theme?.primaryColor || '#3b82f6'}, ${store?.theme?.secondaryColor || '#8b5cf6'})`
//         }}
//       >
//         <h2 className="font-bold text-lg">مساعد {store?.name || 'Storeup'} الذكي</h2>
//         <div className="flex space-x-2 space-x-reverse">
//           <button 
//             onClick={clearChat}
//             className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
//             title="محادثة جديدة"
//           >
//             <ArrowPathIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* منطقة عرض الرسائل */}
//       <div className="flex-1 p-4 overflow-y-auto">
//         <div className="space-y-4">
//           {messages.map((message, index) => (
//             <div 
//               key={index} 
//               className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div 
//                 className={`max-w-[80%] p-3 rounded-lg ${
//                   message.role === 'user' 
//                     ? 'text-white rounded-bl-none' 
//                     : 'bg-white border border-gray-200 shadow-sm rounded-br-none'
//                 }`}
//                 style={
//                   message.role === 'user' 
//                     ? { background: `linear-gradient(135deg, ${store?.theme?.primaryColor || '#3b82f6'}, ${store?.theme?.secondaryColor || '#8b5cf6'})` }
//                     : {}
//                 }
//               >
//                 <p className="whitespace-pre-wrap">{message.content}</p>
//               </div>
//             </div>
//           ))}
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 shadow-sm rounded-br-none">
//                 <div className="flex space-x-2 space-x-reverse">
//                   <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
//                   <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                   <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* حقل إدخال الرسائل */}
//       <form onSubmit={handleMessageSubmit} className="p-4 border-t border-gray-200 bg-white">
//         <div className="flex space-x-2 space-x-reverse">
//           <input
//             type="text"
//             value={input}
//             onChange={handleInputChange}
//             placeholder="اكتب سؤالك هنا..."
//             className="flex-1 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             disabled={isLoading}
//             id="ai-chat-message-input"
//             name="chat-message-input"
//             autoComplete="off"
//           />
//           <button
//             type="submit"
//             disabled={isLoading || input.trim() === ''}
//             className={`px-4 py-2 rounded-lg text-white flex items-center justify-center transition-colors ${
//               isLoading || input.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
//             }`}
//             style={{ 
//               background: `linear-gradient(135deg, ${store?.theme?.primaryColor || '#3b82f6'}, ${store?.theme?.secondaryColor || '#8b5cf6'})`
//             }}
//           >
//             <PaperAirplaneIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatBot; 