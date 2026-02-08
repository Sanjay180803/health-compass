import { useState, useEffect, useCallback } from "react";
import { Newspaper, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface NewsItem {
  date: string;
  type: string;
  title: string;
  url: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    date: "5 February 2026",
    type: "Departmental update",
    title: "Update on the 20th International Conference of Drug Regulatory Authorities (ICDRA)",
    url: "https://www.who.int/news/item/05-02-2026-update-on-the-20th-international-conference-of-drug-regulatory-authorities-(icdra)",
  },
  {
    date: "5 February 2026",
    type: "Statement",
    title: "Over four million girls still at risk of female genital mutilation: UN leaders call for sustained commitment and investment to end FGM",
    url: "https://www.who.int/news/item/05-02-2026-over-four-million-girls-still-at-risk-of-female-genital-mutilation--un-leaders-call-for-sustained-commitment-and-investment-to-end-fgm",
  },
  {
    date: "4 February 2026",
    type: "News release",
    title: "Preventive cholera vaccination resumes as global supply reaches critical milestone",
    url: "https://www.who.int/news/item/04-02-2026-preventive-cholera-vaccination-resumes-as-global-supply-reaches-critical-milestone",
  },
  {
    date: "4 February 2026",
    type: "Departmental update",
    title: "WHO calls for mental health to be central to neglected tropical disease care",
    url: "https://www.who.int/news/item/04-02-2026-who-calls-for-mental-health-to-be-central-to-neglected-tropical-disease-care",
  },
  {
    date: "3 February 2026",
    type: "Joint News Release",
    title: "Four in ten cancer cases could be prevented globally",
    url: "https://www.who.int/news/item/03-02-2026-four-in-ten-cancer-cases-could-be-prevented-globally",
  },
];

const INTERVAL_MS = 10_000;

const WHONewsTicker = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + NEWS_ITEMS.length) % NEWS_ITEMS.length);
    setProgress(0);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;

    const tick = 50; // update progress every 50ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (tick / INTERVAL_MS) * 100;
        if (next >= 100) {
          goNext();
          return 0;
        }
        return next;
      });
    }, tick);

    return () => clearInterval(interval);
  }, [isPaused, goNext]);

  const current = NEWS_ITEMS[activeIndex];

  return (
    <div
      className="w-full max-w-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="text-sm font-semibold tracking-wide">WHO Latest News</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={goPrev}
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
              aria-label="Previous news"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono opacity-80 min-w-[3ch] text-center">
              {activeIndex + 1}/{NEWS_ITEMS.length}
            </span>
            <button
              onClick={goNext}
              className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
              aria-label="Next news"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-muted w-full">
          <div
            className="h-full bg-accent transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* News content */}
        <div className="p-5 h-[140px] flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground">{current.date}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium uppercase tracking-wider">
                {current.type}
              </span>
            </div>
            <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-3">
              {current.title}
            </h3>
          </div>

          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline mt-3"
          >
            Read on WHO
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 pb-3">
          {NEWS_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                setProgress(0);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to news ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WHONewsTicker;
