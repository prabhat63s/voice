from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def get_response_from_openai(conversation_history: list) -> str:
    """
    Get AI response using full conversation history
    """
    try:
        # print(f"🔍 Conversation history: {len(conversation_history)} messages")
        
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=conversation_history,
            temperature=0.7,
            max_tokens=200
        )
        
        result = response.choices[0].message.content.strip()
        print(f"OpenAI response: {result}")
        return result
        
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return f"I'm having trouble responding right now. Please try again."