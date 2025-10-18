import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterChipsProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string | null) => void;
}

export const FilterChips = ({ options, selected, onSelect }: FilterChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selected === null ? "default" : "outline"}
        className={cn(
          "cursor-pointer",
          selected === null ? "" : "hover:bg-accent"
        )}
        onClick={() => onSelect(null)}
      >
        All
      </Badge>
      {options.map((option) => (
        <Badge
          key={option}
          variant={selected === option ? "default" : "outline"}
          className={cn(
            "cursor-pointer",
            selected === option ? "" : "hover:bg-accent"
          )}
          onClick={() => onSelect(option)}
        >
          {option}
        </Badge>
      ))}
    </div>
  );
};
