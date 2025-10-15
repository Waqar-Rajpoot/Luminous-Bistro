// "use client"

// import React, { useState, useRef, useEffect, useCallback } from 'react';

// // --- Constants and Configuration ---
// const GEMINI_MODEL = "gemini-2.5-flash-preview-05-20";
// const apiKey = process.env.NEXT_PUBLIC_AI_MODEL_API_KEY; // Canvas environment automatically provides the API key if this is empty
// const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

// // The instruction that guides the AI's behavior and tone.
// // This defines what your "User Support Section" will feel like.
// const SYSTEM_INSTRUCTION = {
//     parts: [{ 
//         text: `The AI Support Assistant for Luminous Bistro is programmed with a loving and respectful persona, dedicated to helping customers navigate the site's key features, which include placing orders, making reservations, viewing the menu, and submitting reviews for the establishment founded by Muhammad Waqar. The most critical instruction for this model is to be brief: every single response to a customer must be strictly limited to a maximum of 4 to 5 lines of text to ensure quick, concise, and immediate support in alignment with the caring brand tone. Keep your answers concise, helpful, and encouraging. Never invent features or share internal code. 
//         If a request requires personal data or a complex fix, advise the user to contact a human support agent immediately via email (support@example.com).`
//     }]
// };

// // --- Utility for API Calls with Exponential Backoff ---
// const withRetry = async (fn, retries = 3) => {
//     for (let i = 0; i < retries; i++) {
//         try {
//             return await fn();
//         } catch (error) {
//             if (i < retries - 1) {
//                 const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
//                 await new Promise(resolve => setTimeout(resolve, delay));
//             } else {
//                 throw error;
//             }
//         }
//     }
// };

// // --- Message Component ---
// const ChatMessage = ({ message }) => {
//     const isUser = message.role === 'user';
    
//     // Convert Markdown to JSX for rich text display (simple implementation)
//     const renderContent = (text) => {
//         // Basic bold markdown **text**
//         let content = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//         // Basic line breaks
//         content = content.replace(/\n/g, '<br />');
//         return <div dangerouslySetInnerHTML={{ __html: content }} />;
//     };

//     return (
//         <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
//             <div 
//                 className={`max-w-xs sm:max-w-md px-4 py-3 rounded-xl shadow-md transition-all duration-300 ${
//                     isUser 
//                         ? 'bg-indigo-600 text-white rounded-br-none' 
//                         : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
//                 }`}
//             >
//                 <span className="text-xs font-semibold block mb-1 opacity-70">
//                     {isUser ? 'You' : 'Gemini Support'}
//                 </span>
//                 <p className="text-sm">
//                     {renderContent(message.text)}
//                 </p>
//             </div>
//         </div>
//     );
// };


// // --- Main Application Component ---
// const App = () => {
//     // Stores the conversation history for the chat interface and the API payload
//     const [chatHistory, setChatHistory] = useState([
//         { role: 'model', text: "Hello! I'm your AI Support Assistant. How can I help you with your user dashboard or roles today?" }
//     ]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
    
//     // Ref for auto-scrolling to the latest message
//     const messagesEndRef = useRef(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(scrollToBottom, [chatHistory]);

//     // Converts our simple chatHistory state into the API's required structure
//     const formatHistoryForAPI = useCallback(() => {
//         return chatHistory.map(msg => ({
//             role: msg.role === 'user' ? 'user' : 'model',
//             parts: [{ text: msg.text }]
//         }));
//     }, [chatHistory]);

//     // Function to call the Gemini API
//     const getAiResponse = async (history) => {
//         const payload = {
//             contents: history,
//             systemInstruction: SYSTEM_INSTRUCTION,
//         };

//         const fetchFn = () => fetch(apiUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });

//         try {
//             const response = await withRetry(fetchFn);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//             const result = await response.json();
            
//             const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
//             if (text) {
//                 // Update history with the AI response
//                 setChatHistory(prev => [...prev, { role: 'model', text }]);
//             } else {
//                 setChatHistory(prev => [...prev, { role: 'model', text: "I apologize, I received an empty response. Could you please try rephrasing your question?" }]);
//             }
//         } catch (e) {
//             console.error("Gemini API Error:", e);
//             setChatHistory(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please check your network or try again later." }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSend = (e) => {
//         e.preventDefault();
//         const trimmedInput = input.trim();
//         if (!trimmedInput || isLoading) return;

//         setIsLoading(true);
//         setInput('');

//         // 1. Add user message to local history
//         const newUserMessage = { role: 'user', text: trimmedInput };
//         const newHistory = [...chatHistory, newUserMessage];
//         setChatHistory(newHistory);
        
//         // 2. Format history and call API
//         const apiHistory = formatHistoryForAPI(newHistory);
//         getAiResponse(apiHistory);
//     };

//     // --- Render ---
//     return (
//         <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-['Inter'] flex justify-center items-start">
            
//             {/* User Support Chatbot Container */}
//             <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col h-[85vh] transition-all duration-300">
                
//                 {/* Header */}
//                 <header className="p-4 sm:p-5 bg-indigo-700 text-white rounded-t-2xl shadow-lg flex items-center justify-between">
//                     <h1 className="text-xl font-bold flex items-center">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-300" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
//                         AI Support Assistant
//                     </h1>
//                 </header>
                
//                 {/* Chat History Area */}
//                 <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/70">
//                     {chatHistory.map((message, index) => (
//                         <ChatMessage key={index} message={message} />
//                     ))}
                    
//                     {/* Loading Indicator (Typing bubble) */}
//                     {isLoading && (
//                         <div className="flex justify-start">
//                             <div className="bg-white text-gray-800 rounded-xl rounded-tl-none px-4 py-3 shadow-md border border-gray-100">
//                                 <div className="flex space-x-1">
//                                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
//                                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
//                                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-450"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     <div ref={messagesEndRef} />
//                 </main>
                
//                 {/* Input Area */}
//                 <footer className="p-4 sm:p-5 border-t border-gray-200 bg-white rounded-b-2xl">
//                     <form onSubmit={handleSend} className="flex items-center space-x-3">
//                         <input
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             disabled={isLoading}
//                             placeholder="Ask a question about roles, access, or features..."
//                             className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm disabled:bg-gray-50"
//                         />
//                         <button
//                             type="submit"
//                             disabled={!input.trim() || isLoading}
//                             className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 11v2h8l-3 3 1 1 5-5-5-5-1 1 3 3H7zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
//                         </button>
//                     </form>
//                 </footer>
//             </div>
//         </div>
//     );
// };

// export default App;




"use client"

import React, { useState, useRef, useEffect } from 'react';

// Utility component for the send icon
const SendIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="22" x2="11" y1="2" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

// --- Core API Logic (Adapted for React/Single File) ---

// Constants for the OpenRouter API configuration
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "deepseek/deepseek-chat-v3.1:free";
const SITE_URL = "http://luminous-bistro.com"; // Your site URL
const SITE_NAME = "Luminous Bistro"; // Your site name

// Strict system prompt enforcing persona and the critical line constraint
const SYSTEM_PROMPT = `You are the loving, respectful, genuinely caring, and helpful AI Support Assistant for Luminous Bistro (a restaurant founded by Muhammad Waqar, blending Pakistani cuisine with an American dining style). Your core mission is to inform the customer about placing orders, reserving tables, browsing the menu, and submitting reviews. CRITICAL CONSTRAINT: Your response to any customer question MUST be strictly limited to a maximum of 4 to 5 lines of text. Do not exceed five lines. Use simple and friendly language.`;

// Utility function to handle API fetching with exponential backoff
async function fetchWithBackoff(url, options, maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 429 && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API call failed with status ${response.status}: ${errorData.error?.message || response.statusText}`);
            }
            return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.warn(`Attempt ${i + 1} failed. Retrying...`, error);
        }
    }
    throw new Error("Maximum retries reached for API call.");
}

// --- Main React Component ---

const App = () => {
    // !!! IMPORTANT: Replace this placeholder with your actual OpenRouter API Key !!!
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY; 

    const initialGreeting = {
        role: 'assistant',
        content: "Hello and a warm welcome! I'm here to help you navigate our services, including placing orders, making reservations, or viewing our menu. How can I assist you with the flavors of Luminous Bistro today?"
    };

    const [chatHistory, setChatHistory] = useState([initialGreeting]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatWindowRef = useRef(null);
    const isKeyMissing = apiKey === "<YOUR_OPENROUTER_API_KEY>";

    // Scroll to the bottom whenever chatHistory updates
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const sendMessage = async (e) => {
        e.preventDefault(); // Prevent form submission if triggered by Enter key
        const userMessage = inputMessage.trim();

        if (userMessage === '' || isLoading || isKeyMissing) return;

        // 1. Add user message to history
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
        setInputMessage('');
        setIsLoading(true);

        // Limit chat history to last 10 parts (5 exchanges + current)
        const conversationHistory = chatHistory.slice(-9);

        // Build messages array: System Prompt + History + Current User Query
        const messages = [
            { "role": "system", "content": SYSTEM_PROMPT },
            ...conversationHistory.filter(msg => msg.role !== 'system'), // Filter out system prompt if it somehow got into history
            { "role": "user", "content": userMessage }
        ];

        const payload = {
            "model": MODEL_NAME,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 150 // Encourages brevity for the 4-5 line constraint
        };

        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        };

        try {
            const response = await fetchWithBackoff(API_URL, options);
            const result = await response.json();
            
            let aiResponseText = "Sorry, I couldn't get a clear response from the AI model.";

            if (result.choices && result.choices.length > 0 && result.choices[0].message) {
                aiResponseText = result.choices[0].message.content.trim();
            } else {
                aiResponseText = `Error: ${result.error?.message || 'Received an unexpected response format. Please try again.'}`;
            }

            // 2. Add AI response to history
            setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponseText }]);

        } catch (error) {
            console.error("Fetch error:", error);
            setChatHistory(prev => [...prev, { 
                role: 'assistant', 
                content: `I apologize, but there was an error connecting to the chat service. Please check your API key and try again. (${error.message})`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- JSX Rendering ---

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col h-[85vh]">
                
                {/* Header */}
                <header className="bg-indigo-700 p-4 text-white shadow-lg rounded-t-xl">
                    <h1 className="text-2xl font-extrabold tracking-wide">Luminous Bistro Chat</h1>
                    <p className="text-sm opacity-90 font-medium">AI powered by DeepSeek via OpenRouter</p>
                </header>

                {/* Key Missing Warning */}
                {isKeyMissing && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-center font-medium">
                        ⚠️ **API Key Missing:** Please replace the placeholder in `App.jsx` with your OpenRouter API Key.
                    </div>
                )}

                {/* Chat Window */}
                <div ref={chatWindowRef} className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50">
                    {chatHistory.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-xl max-w-[85%] shadow-md transition-all duration-300 ${
                                message.role === 'user' 
                                    ? 'bg-blue-500 text-white rounded-br-none' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                            }`}>
                                {message.role === 'assistant' && (
                                    <p className="font-semibold text-indigo-700 mb-1">Luminous Bistro AI:</p>
                                )}
                                {/* Display content, handling newlines for formatting */}
                                {message.content.split('\n').map((line, lineIndex) => (
                                    <p key={lineIndex} className="text-sm">{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="text-center py-2 text-sm text-indigo-600 animate-pulse bg-gray-100">
                        <p>AI is thinking (applying 4-5 line constraint)...</p>
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white flex space-x-3">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={isKeyMissing ? "Enter your API key first..." : "Ask about the menu, reservations, or orders..."}
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 text-gray-700"
                        disabled={isLoading || isKeyMissing}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-lg flex items-center justify-center disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        disabled={isLoading || isKeyMissing || inputMessage.trim() === ''}
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>

            </div>
        </div>
    );
};

export default App;
