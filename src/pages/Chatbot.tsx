import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

const API_BASE = "http://localhost:8000/api/v1";

interface Message {
  question: string;
  answer: string;
}

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastResultCountRef = useRef(0);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // Get the current result count before submitting
      const beforeRes = await fetch(`${API_BASE}/results?limit=100`);
      const beforeData = await beforeRes.json();
      lastResultCountRef.current = Array.isArray(beforeData) ? beforeData.length : 0;

      // Submit the query
      await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });

      // Poll GET until we get a new result
      let answer = "";
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max wait
      
      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const res = await fetch(`${API_BASE}/results?limit=100`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > lastResultCountRef.current) {
          // New result arrived - get the latest one
          const latestResult = data[data.length - 1];
          answer = typeof latestResult === "string" 
            ? latestResult 
            : latestResult.answer || latestResult.result || latestResult.response || JSON.stringify(latestResult);
          break;
        }
        attempts++;
      }

      if (!answer) {
        answer = "Request timed out. Please try again.";
      }

      setMessages((prev) => [{ question, answer }, ...prev]);
    } catch (error) {
      console.error("Error querying LLM:", error);
      setMessages((prev) => [
        { question, answer: "Failed to connect to the API. Make sure your local server is running on localhost:8000." },
        ...prev,
      ]);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        />
        <Button onClick={handleSend} size="icon" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Waiting for response...</span>
        </div>
      )}

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
              <div className="glass-panel px-4 py-3 rounded-xl rounded-tl-sm max-w-[80%] text-sm text-foreground prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{msg.answer}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && !isLoading && (
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
