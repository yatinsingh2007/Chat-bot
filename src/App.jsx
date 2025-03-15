import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { Send, Bot, User } from 'lucide-react';
function App() {
  const [messages, setMessages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);
  const apiKey = import.meta.env.VITE_GEMINI_API
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const input = form.elements[0];
    const message = input.value.trim();
    if (!message) {
      setShowAlert(true);
      form.reset();
      return;
    }
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setIsLoading(true);
    form.reset();
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: message
              }]
            }]
          })
        }
      );
      const data = await response.json();
      const botResponse = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            AI Chat Assistant
          </h1>
          <p className="text-purple-200">Powered by Gemini 1.5</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-[600px] overflow-auto p-6 bg-gray-50">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                  <p>Start a conversation by sending a message below!</p>
                </div>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 mb-4 ${
                  msg.isUser ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.isUser ? 'bg-purple-600' : 'bg-gray-700'
                }`}>
                  {msg.isUser ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                    msg.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-white shadow-md'
                  }`}
                >
                  {msg.isUser ? (
                    <p>{msg.text}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                    <Markdown>
                      {msg.text}
                    </Markdown></div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 rounded-xl px-4 py-2 border focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 text-white rounded-xl px-4 py-2 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
      {showAlert && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg">
          Please enter a message before sending
        </div>
      )}
    </div>
  );
}
export default App;