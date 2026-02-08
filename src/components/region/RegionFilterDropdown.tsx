import { useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type FilterType = "hospitals" | "doctors" | "climate" | "alerts" | "healthcareIndex";

export const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "healthcareIndex", label: "Healthcare Index" },
  { value: "hospitals", label: "Hospitals" },
  { value: "doctors", label: "Doctors" },
  { value: "climate", label: "Climate" },
  { value: "alerts", label: "Health Alerts" },
];

interface RegionFilterDropdownProps {
  selected: FilterType[];
  onChange: (filters: FilterType[]) => void;
}

const RegionFilterDropdown = ({ selected, onChange }: RegionFilterDropdownProps) => {
  const [open, setOpen] = useState(false);

  const toggle = (value: FilterType) => {
    if (selected.includes(value)) {
      // Don't allow deselecting last item
      if (selected.length === 1) return;
      onChange(selected.filter((f) => f !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const label =
    selected.length === 1
      ? FILTER_OPTIONS.find((o) => o.value === selected[0])?.label
      : `${selected.length} filters selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-56 justify-between bg-card/90 backdrop-blur-md border-border shadow-lg"
        >
          <span className="truncate text-sm">{label}</span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        {FILTER_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <Checkbox
              checked={selected.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default RegionFilterDropdown;
