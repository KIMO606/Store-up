import { useState, useRef } from "react";
import axios from "axios";
import { ChatBubbleLeftRightIcon, KeyIcon, PaperAirplaneIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";

const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3-8b-instruct";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "مرحباً بك! أنا مساعد الذكاء الاصطناعي. اسألني عن أي شيء متعلق بالتجارة الإلكترونية أو متجرك وسأجيبك بالعربية أو الإنجليزية."
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Send message to OpenRouter
  const sendMessage = async (message) => {
    if (!message.trim()) return;
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: OPENROUTER_MODEL,
          messages: [
            {
              role: "system",
              content:
                "أنت مساعد ثنائي اللغة (العربية والإنجليزية) للتجارة الإلكترونية. أجب باللغة التي يستخدمها المستخدم."
            },
            ...messages.slice(-9), // last 9 messages for context
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://storeup.com",
            "X-Title": "Storeup Assistant"
          }
        }
      );
      const reply = response.data.choices?.[0]?.message?.content || "...";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "حدث خطأ أثناء الاتصال بالنموذج. حاول مرة أخرى لاحقاً." }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage("");
  };

  const toggleChat = () => setIsChatOpen((open) => !open);
  const handleClearChat = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في مسح سجل الدردشة؟")) {
      setMessages([
        {
          role: "assistant",
          content:
            "مرحباً بك! أنا مساعد الذكاء الاصطناعي. اسألني عن أي شيء متعلق بالتجارة الإلكترونية أو متجرك وسأجيبك بالعربية أو الإنجليزية."
        }
      ]);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed left-6 bottom-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 z-50"
        aria-label="Chat with AI assistant"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
      </button>

      {/* Chat container */}
      <div
        ref={chatContainerRef}
        className={`fixed left-6 bottom-20 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 transform ${
          isChatOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        {/* Chat header */}
        <div className="bg-primary-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            <h3 className="font-medium">مساعد المتجر الذكي | Storeup Assistant</h3>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleClearChat}
              className="text-white p-1 rounded hover:bg-primary-700 transition-colors"
              aria-label="Clear chat history"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={toggleChat}
              className="text-white p-1 rounded hover:bg-primary-700 transition-colors"
              aria-label="Close chat"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="px-4 py-3 h-80 overflow-y-auto bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="bg-white border border-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 rounded-b-lg p-2">
          <div className="flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="أرسل رسالة... | Send a message..."
              className="flex-1 bg-gray-100 border-0 rounded-full py-2 px-4 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              disabled={isLoading}
              id="main-chat-message-input"
              name="messageInput"
              autoComplete="off"
            />
            <button
              type="submit"
              className="ml-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 transition-colors"
              disabled={!inputMessage.trim() || isLoading}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;