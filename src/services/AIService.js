import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: "YOUR_OPENAI_API_KEY",
});

export async function getAIResponse(userText) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: userText }],
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Sorry, I couldn't process that.";
    }
}
