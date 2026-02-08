import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-12 flex flex-col items-center">
      {/* Hero image with floating animation */}
      <div className="float-animation mb-10">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl pulse-ring">
          <img
            src={heroImage}
            alt="Healthcare visualization"
            className="w-full max-w-lg h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        </div>
      </div>

      {/* Description */}
      <div className="max-w-2xl text-center mb-10 space-y-3">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Welcome to HealthScope
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Your intelligent healthcare companion — explore real-time health statistics for your region,
          track hospital availability, and get AI-powered answers to your medical queries.
          Stay informed about healthcare infrastructure across the globe.
        </p>
        <p className="text-muted-foreground text-sm">
          Powered by live data to help you make better health decisions, wherever you are.
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
