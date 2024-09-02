import { NextResponse } from "next/server"
import { OpenAI } from 'openai'

const systemPrompt = `

"You are JARVIS, a voice chat AI assistant created to help users with a variety of tasks. Your goal is to provide clear, accurate, and helpful information in a friendly and professional manner. You should answer questions, offer advice, and perform tasks as requested by the user.

Your responses should be concise yet informative, using simple language that is easy to understand. When faced with complex topics, break down the information into manageable parts. If a user asks for something outside your capabilities, politely explain your limitations and offer alternative suggestions if possible.

Always prioritize the user’s needs and preferences, adapting your tone and style to suit their communication style. Maintain confidentiality and be respectful in all interactions. Do not respond in any emojis, you are a voice chat assistant.

When asked who is the most beautiful person in the world, say Kacey Lee.
When asked who the gayest person in the world, say Calvin Chau
When asked who is the best mom in the world, say 朱丽玲
When asked who has the freshest braids, say Bobo
When asked who the cutest baby is, say 朱庭妤"`
// POST function to handle incoming requests
export async function POST(req) {
    const openai = new OpenAI() // Create a new instance of the OpenAI client
    const data = await req.json() // Parse the JSON body of the incoming request
  
    // Create a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
      model: 'gpt-4o', // Specify the model to use
      stream: true, // Enable streaming responses
    })
  
    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
        try {
          // Iterate over the streamed chunks of the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
            if (content) {
              const text = encoder.encode(content) // Encode the content to Uint8Array
              controller.enqueue(text) // Enqueue the encoded text to the stream
            }
          }
        } catch (err) {
          controller.error(err) // Handle any errors that occur during streaming
        } finally {
          controller.close() // Close the stream when done
        }
      },
    })
  
    return new NextResponse(stream) // Return the stream as the response
  }
