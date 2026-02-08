import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import WHONewsTicker from "@/components/WHONewsTicker";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-12 flex flex-col items-center">
      {/* WHO News Ticker */}
      <div className="mb-10">
        <WHONewsTicker />
      </div>

      {/* Description */}
      <div className="max-w-2xl text-center mb-10 space-y-3">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Holey Health
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Your intelligent healthcare intelligence layer — explore real-time medical capacity,
          uncover infrastructure gaps, and get AI-powered insights from complex healthcare data.
          See where care exists, where it's missing, and where action can save lives.
        </p>
        <p className="text-muted-foreground text-sm">
          Powered by agentic AI to turn medical documents into decisions.
        </p>
      </div>

      {/* CTA Button - centered */}
      <div className="w-full max-w-2xl flex justify-center">
        <Button
          onClick={() => navigate("/chatbot")}
          size="lg"
          className="gap-2 shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
          Ask the Health Assistant
        </Button>
      </div>
    </div>
  );
};

export default Index;
