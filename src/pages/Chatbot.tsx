import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  question: string;
  answer: string;
}

const mockAnswers: Record<string, string> = {
  flu: "The flu (influenza) is a contagious respiratory illness. Symptoms include fever, cough, sore throat, body aches, and fatigue. Get vaccinated annually and wash your hands frequently.",
  covid: "COVID-19 is caused by the SARS-CoV-2 virus. Keep up with vaccinations, maintain hygiene, and consult a doctor if you experience persistent symptoms.",
  hospital: "To find hospitals near you, visit the 'Current Region' tab for location-based hospital information and statistics.",
  doctor: "You can find doctor availability statistics in the Region tab. For immediate medical concerns, please contact your local healthcare provider or dial emergency services.",
};

function getAnswer(question: string): string {
  const q = question.toLowerCase();
  for (const [key, answer] of Object.entries(mockAnswers)) {
    if (q.includes(key)) return answer;
  }
  return "Thank you for your question. Based on current health data, I recommend consulting with a healthcare professional for personalized advice. You can also explore the Region and World tabs for healthcare statistics in your area.";
}

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    const question = input.trim();
    const answer = getAnswer(question);
    setMessages((prev) => [{ question, answer }, ...prev]);
    setInput("");
  };

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Health Assistant</h1>
        <p className="text-muted-foreground text-sm">Ask any health-related question</p>
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <Input
          placeholder="Type your health question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-xl rounded-tr-sm max-w-[80%] text-sm">
                {msg.question}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="glass-panel px-4 py-3 rounded-xl rounded-tl-sm max-w-[80%] text-sm text-foreground">
                {msg.answer}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg mb-1">No questions yet</p>
            <p className="text-sm">Ask about flu, COVID, hospitals, doctors, or any health topic.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
