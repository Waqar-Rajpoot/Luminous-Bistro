// import Groq from "groq-sdk";
// import { NextResponse } from "next/server";


// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// let aiResponse = "";

// export async function POST(req: Request) {
//   try {
//     const { message } = await req.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message content is required" },
//         { status: 400 }
//       );
//     }

//     const messages: any = [
//       {
//         role: "system",
//         content:
//           `You are a helpful assistant. your naem is Jarvis working for Luminous Bistro Restaurant.
//           You have access to a tool:
//           1. webSearch({query: string} - Use this tool to search the web for up-to-date information to answer user queries.)`,
//       },
//       {
//         role: "user",
//         content: message,
//       },
//     ];

//     const chatCompletion = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       temperature: 0.2,
//       messages: messages,
//       max_tokens: 150,
//       tools: [
//         {
//           type: "function",
//           function: {
//             name: "webSearch",
//             description: "Use this tool to search the web for up-to-date information to answer user queries.",
//             parameters: {
//               // JSON Schema object
//               type: "object",
//               properties: {
//                 query: {
//                   type: "string",
//                   description: "The search query provided by the user.",
//                 },
//               },
//               required: ["query"],
//             },
//           },
//         },
//       ],
//       tool_choice: "auto",
//     });

//     const toolCalls = chatCompletion.choices[0].message?.tool_calls;


//     if(!toolCalls || toolCalls.length === 0) {
//       aiResponse = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't get a response.";
//       return NextResponse.json({ response: aiResponse }, { status: 200 });
//     }

//     for (const toolCall of toolCalls) {
      
//       const functionName = toolCall.function.name;
//       const functionArgs = toolCall.function.arguments;

//       if (functionName === "webSearch") {
//         const searchResults = await webSearch(JSON.parse(functionArgs));
//         console.log("Tool Results: ", searchResults)
//         messages.push({
//           role: "tool",
//           // name: functionName,
//           content: searchResults,
//         });
//       }
      
//     }


//     console.log(JSON.stringify(chatCompletion.choices[0].message, null, 2));

//     aiResponse =
//       chatCompletion.choices[0]?.message?.content ||
//       "Sorry, I couldn't get a response.";

//     return NextResponse.json({ response: aiResponse }, { status: 200 });
//   } catch (error) {
//     console.error("Groq API Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }




// async function webSearch({ query } : { query: string }) {
//     // const response = await fetch("https://api.tavily.com/v1/search", {
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type": "application/json",
//     //         "Authorization": `Bearer ${process.env.TAVILY_API_KEY}`,
//     //     },
//     //     body: JSON.stringify({
//     //         query,
//     //         source: "google",
//     //     }),
//     // })
//     //     if (response.ok) {
//     //         return response.json();
//     //     } else {
//     //         throw new Error("Failed to fetch search results.");
//     //     }

//     console.log("Tool is calling...")
//     return "I phone 16 was launched in 20 september 2024";
// }





// import Groq from "groq-sdk";
// import { NextResponse } from "next/server";
// import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// import { tavily } from "@tavily/core";
// import { toast } from "sonner";
// const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });
// // Use a local object to hold tool functions for execution
// const availableTools = {
//     webSearch: webSearch,
// };

// interface RequestBody {
//     message: string;
// }

// async function webSearch({ query }: { query: string }) {
//     toast.success(`Tool called: webSearch with query`);
//     console.log(`✅ Tool successfully called for query: ${query}`);

//     const response = await tvly.search(query);
//     console.log(response);
//     const finalResponse = response.results.map((result) => result.content).join("\n\n");
//     return finalResponse;

//     // return `The latest information for "${query}" suggests that the iPhone 16 was launched on September 20, 2024.`;
// }

// // Helper function to call the Groq API
// async function getGroqCompletion(messages: ChatCompletionMessageParam[]) {
//     return groq.chat.completions.create({
//         model: "llama-3.3-70b-versatile",
//         temperature: 0.2,
//         messages: messages,
//         max_tokens: 300, // Reinstated and increased tokens for final response
//         tools: [
//             {
//                 type: "function",
//                 function: {
//                     name: "webSearch",
//                     description: "Use this tool to search the web for up-to-date information to answer user queries.",
//                     parameters: {
//                         type: "object",
//                         properties: {
//                             query: {
//                                 type: "string",
//                                 description: "The search query provided by the user.",
//                             },
//                         },
//                         required: ["query"],
//                     },
//                 },
//             },
//         ],
//         tool_choice: "auto",
//     });
// }


// export async function POST(req: Request) {
//     try {
//         const { message }: RequestBody = await req.json();

//         if (!message) {
//             return NextResponse.json({ error: "Message content is required" }, { status: 400 });
//         }

//         // Initialize messages array for the conversation history
//         const messages: ChatCompletionMessageParam[] = [
//             {
//                 role: "system",
//                 content:
//                     `You are a helpful assistant. Your name is Jarvis, working for Luminous Bistro Restaurant.
//                     You have access to a tool: webSearch.
//                     1. webSearch({query: string} - Use this tool to search the web for up-to-date information to answer user queries.)
//                     **IMPORTANT: If you use the webSearch tool, you MUST synthesize the tool output into a polite, comprehensive, and user-friendly answer.**`,
//             },
//             {
//                 role: "user",
//                 content: message,
//             },
//         ];

//         // --- Step 1: First API Call (Determine if a tool is needed) ---
//         let response = await getGroqCompletion(messages);
//         const toolCalls = response.choices[0].message?.tool_calls;

//         // --- Step 2: Tool Execution and Second API Call (If tool is called) ---
//         if (toolCalls && toolCalls.length > 0) {
            
//             // 1. Add the model's tool request to the messages array
//             messages.push(response.choices[0].message);

//             // 2. Execute the function calls
//             for (const toolCall of toolCalls) {
//                 const functionName = toolCall.function.name;
//                 const functionToCall = availableTools[functionName as keyof typeof availableTools];
                
//                 if (functionToCall) {
//                     let functionArgs: { query: string };
//                     try {
//                         // 🟢 Robustly parse arguments
//                         functionArgs = JSON.parse(toolCall.function.arguments);
//                     } catch (e) {
//                         console.error("Error parsing function arguments:", e);
//                         continue; // Skip execution if parsing fails
//                     }
                    
//                     const toolOutput = await functionToCall(functionArgs);

//                     // 3. Add the tool's output to the messages array
//                     messages.push({
//                         tool_call_id: toolCall.id,
//                         role: "tool",
//                         content: toolOutput,
//                     });
//                 }
//             }

//             // 4. CRITICAL FIX: Make the SECOND API call with the tool results
//             response = await getGroqCompletion(messages);
//         }

//         // --- Step 3: Final Response Generation ---
//         const aiResponse = response.choices[0]?.message?.content || "Sorry, I couldn't get a final response.";
        
//         return NextResponse.json({ response: aiResponse }, { status: 200 });

//     } catch (error) {
//         console.error("Groq API Error:", error);
//         return NextResponse.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }







// import Groq from "groq-sdk";
// import { NextResponse } from "next/server";
// import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
// import { tavily } from "@tavily/core";

// // Initialize clients
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

// const availableTools = {
//     webSearch: webSearch,
// };

// interface RequestBody {
//     message: string;
// }

// // Tool Function
// async function webSearch({ query }: { query: string }) {
//     console.log(`✅ Tool successfully called for query: ${query}`);
//     try {
//         const response = await tvly.search(query);
//         const finalResponse = response.results.map((result) => result.content).join("\n\n");
//         return finalResponse;
//     } catch (error) {
//         console.error("Tavily Search Error:", error);
//         return "An error occurred while searching the web.";
//     }
// }

// // Helper function to call the Groq API
// async function getGroqCompletion(messages: ChatCompletionMessageParam[]) {
//     return groq.chat.completions.create({
//         model: "llama-3.3-70b-versatile",
//         temperature: 0.1, 
//         messages: messages,
//         max_tokens: 1024,
//         tools: [
//             {
//                 type: "function",
//                 function: {
//                     name: "webSearch",
//                     description: "Search the web for real-time information. Use this for questions about current events, release dates, or specific facts.",
//                     parameters: {
//                         type: "object",
//                         properties: {
//                             query: {
//                                 type: "string",
//                                 description: "The specific keyword or question to search for.",
//                             },
//                         },
//                         required: ["query"],
//                     },
//                 },
//             },
//         ],
//         tool_choice: "auto",
//     });
// }

// export async function POST(req: Request) {
//     try {
//         const { message }: RequestBody = await req.json();

//         // console.log("Message Received: ", message);

//         if (!message) {
//             return NextResponse.json({ error: "Message content is required" }, { status: 400 });
//         }

//         const messages: ChatCompletionMessageParam[] = [
//             {
//                 role: "system",
//                 content: `You are Jarvis, a helpful assistant for Luminous Bistro.
                
//                 TOOL USE RULES:
//                 - If the user asks about facts/news/dates, use the 'webSearch' tool.
//                 - **CRITICAL:** Do NOT generate XML tags like <function=...>. 
//                 - simply output the standard tool call format provided by the system.
//                 - After the tool runs, synthesize the answer politely.`,
//             },
//             {
//                 role: "user",
//                 content: message,
//             },
//         ];

//         // --- Step 1: First API Call with Error Handling ---
//         let response;
//         try {
//             response = await getGroqCompletion(messages);
//             console.log("Response: ", response.choices[0].message)
//         } catch (error: any) {
//             // --- 2. ERROR LOGGING ---
//             console.error("❌ Groq API Call Failed!");
            
//             // Check if it's the specific "failed_generation" error
//             if (error?.error?.failed_generation) {
//                 console.error("⚠️ MODEL HALLUCINATION DETECTED:");
//                 console.error("The model tried to generate this text instead of a tool call:");
//                 console.error(error.error.failed_generation);
//                 console.error("Please check your prompt and try again.");
//             } else {
//                 console.error("Standard Error:", error);
//             }

//             return NextResponse.json(
//                 { error: "AI Service Error", details: error.message },
//                 { status: 500 }
//             );
//         }

//         const toolCalls = response.choices[0].message?.tool_calls;

//         // --- Step 2: Tool Execution ---
//         if (toolCalls && toolCalls.length > 0) {
//             messages.push(response.choices[0].message);

//             for (const toolCall of toolCalls) {
//                 const functionName = toolCall.function.name;
//                 console.log("Function Name: ", functionName)
//                 const functionToCall = availableTools[functionName as keyof typeof availableTools];
                
//                 if (functionToCall) {
//                     let functionArgs;
//                     try {
//                         functionArgs = JSON.parse(toolCall.function.arguments);
//                     } catch (e) {
//                         console.error("❌ JSON Parse Error for tool args:", toolCall.function.arguments);
//                         messages.push({
//                             tool_call_id: toolCall.id,
//                             role: "tool",
//                             content: "Error: Invalid JSON arguments.",
//                         });
//                         continue;
//                     }
                    
//                     const toolOutput = await functionToCall(functionArgs);

//                     messages.push({
//                         tool_call_id: toolCall.id,
//                         role: "tool",
//                         content: toolOutput,
//                     });
//                 }
//             }

//             // --- Step 3: Second API Call (Final Answer) ---
//             try {
//                 response = await getGroqCompletion(messages);
//             } catch (error: any) {
//                 console.error("❌ Groq Second API Call Failed:", error);
//                 return NextResponse.json({ error: "Failed to generate final answer" }, { status: 500 });
//             }
//         }

//         const aiResponse = response.choices[0]?.message?.content || "Sorry, I couldn't get a response.";
//         return NextResponse.json({ response: aiResponse }, { status: 200 });

//     } catch (error) {
//         console.error("Server Error:", error);
//         return NextResponse.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }





import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

// Initialize clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

const myCache = new NodeCache({stdTTL: 2 * 24 * 60 * 60}); 

const availableTools = {
    webSearch: webSearch,
};

interface RequestBody {
    message: string;
}

// Tool Function
async function webSearch({ query }: { query: string }) {
    // 🟢 This is the log line that WILL print if the function is executed.
    console.log(`✅ Tool successfully called for query: ${query}`); 
    try {
        const response = await tvly.search(query);
        const finalResponse = response.results.map((result) => result.content).join("\n\n");
        return finalResponse;
    } catch (error) {
        console.error("Tavily Search Error:", error);
        return "An error occurred while searching the web.";
    }
}

// Helper function to call the Groq API
async function getGroqCompletion(
    messages: ChatCompletionMessageParam[],
    // Defines the allowed parameter types for tool_choice
    toolChoice: 'auto' | 'none' | { type: 'function', function: { name: string } } = "auto"
) {
    return groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1, 
        messages: messages,
        max_tokens: 1024,
        tools: [
            {
                type: "function",
                function: {
                    name: "webSearch",
                    description: "Search the web for real-time information, news, dates, or specific facts not known by the AI.",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "The specific keyword or question to search for.",
                            },
                        },
                        required: ["query"],
                    },
                },
            },
        ],
        // 🟢 Uses the passed toolChoice (either "auto" or explicitly forcing webSearch)
        tool_choice: toolChoice, 
    });
}

export async function POST(req: Request) {
    try {
        const { message }: RequestBody = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message content is required" }, { status: 400 });
        }

        // --- NEW: Heuristic to determine if a tool is absolutely required ---
        const realTimeKeywords = ["current", "latest", "launch date", "who is the president", "price of", "today's"];
        const messageLower = message.toLowerCase();
        
        let toolChoice: any = "auto"; 
        
        if (realTimeKeywords.some(keyword => messageLower.includes(keyword))) {
            // Explicitly force the tool call using the required structured format
            toolChoice = { type: "function", function: { name: "webSearch" } };
            console.log(`🛠️ FORCING webSearch TOOL CALL for query: "${message}"`);
        }

        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `You are Jarvis, a helpful assistant for Luminous Bistro.
                
                TOOL USE RULES:
                - If the user asks about facts/news/dates, use the 'webSearch' tool.
                - CRITICAL: Do NOT generate tool calls as plain text or use XML tags like <function=...>. Use the structured tool call object.`,
            },
            {
                role: "user",
                content: message,
            },
        ];

        // --- Step 1: First API Call (Determine if a tool is needed) ---
        let response;
        try {
            // 🟢 Pass the calculated toolChoice parameter
            response = await getGroqCompletion(messages, toolChoice); 
        } catch (error: any) {
            // ... (Error logging remains the same for debugging 400 errors)
            console.error("❌ Groq API Call Failed!");
            if (error?.error?.failed_generation) {
                console.error("⚠️ MODEL HALLUCINATION DETECTED (Model Text Output):");
                console.error(error.error.failed_generation);
            } else {
                console.error("Standard Error:", error);
            }

            return NextResponse.json(
                { error: "AI Service Error", details: error.message },
                { status: 500 }
            );
        }

        const toolCalls = response.choices[0].message?.tool_calls;

        // --- Step 2: Tool Execution ---
        if (toolCalls && toolCalls.length > 0) {
            
            // 🟢 NEW LOG: Confirmation that the API successfully returned a tool call object
            console.log(`✨ Tool Call Object Received! Executing ${toolCalls.length} tool(s)...`);

            messages.push(response.choices[0].message);

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableTools[functionName as keyof typeof availableTools];
                
                if (functionToCall) {
                    let functionArgs;
                    try {
                        functionArgs = JSON.parse(toolCall.function.arguments);
                    } catch (e) {
                        console.error("❌ JSON Parse Error for tool args:", toolCall.function.arguments);
                        messages.push({
                            tool_call_id: toolCall.id,
                            role: "tool",
                            content: "Error: Invalid JSON arguments.",
                        });
                        continue;
                    }
                    
                    // The log inside webSearch will now print!
                    const toolOutput = await functionToCall(functionArgs);

                    messages.push({
                        tool_call_id: toolCall.id,
                        role: "tool",
                        content: toolOutput,
                    });
                }
            }

            // --- Step 3: Second API Call (Final Answer) ---
            try {
                response = await getGroqCompletion(messages, "auto");
            } catch (error: any) {
                console.error("❌ Groq Second API Call Failed:", error);
                return NextResponse.json({ error: "Failed to generate final answer" }, { status: 500 });
            }
        }

        const aiResponse = response.choices[0]?.message?.content || "Sorry, I couldn't get a response.";
        
        return NextResponse.json({ response: aiResponse }, { status: 200 });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}