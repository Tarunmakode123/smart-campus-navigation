import { useState, useRef, useEffect } from "react";
import { Search, X, MapPin, User, CheckCircle2 } from "lucide-react";
import { searchDestinations, searchPeople } from "@/services/searchService";
import type { AutocompleteItem } from "@/lib/wayfindr-types";

export function AutocompleteSearch({
  type,
  label,
  placeholder,
  selectedItem,
  onSelect,
  onClear,
}: {
  type: "destination" | "person";
  label: string;
  placeholder: string;
  selectedItem: AutocompleteItem | null;
  onSelect: (item: AutocompleteItem) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync query when item selected externally
  useEffect(() => {
    if (selectedItem) {
      setQuery(selectedItem.title);
      setIsOpen(false);
      setErrorMsg("");
    }
  }, [selectedItem]);

  // Update suggestions on query input
  const handleInputChange = (text: string) => {
    setQuery(text);
    setErrorMsg("");
    setHighlightedIndex(-1);

    if (selectedItem && text !== selectedItem.title) {
      onClear();
    }

    if (text.trim() === "") {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const matches = type === "destination" ? searchDestinations(text) : searchPeople(text);
    setSuggestions(matches);
    setIsOpen(true);
  };

  // Handle keyboard events (Up, Down, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelectItem(suggestions[highlightedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectItem(suggestions[0]);
      } else {
        setErrorMsg(
          type === "destination"
            ? "Destination not found. Please select from the suggestions."
            : "Person not found. Please select from the suggestions."
        );
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelectItem = (item: AutocompleteItem) => {
    onSelect(item);
    setQuery(item.title);
    setIsOpen(false);
    setErrorMsg("");
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full space-y-1 text-left">
      <label className="flex items-center justify-between font-display text-xs font-extrabold uppercase tracking-wider text-[#111827]">
        <span>{label}</span>
        {selectedItem && (
          <span className="flex items-center gap-1 text-[10px] text-[#10B981] font-mono">
            <CheckCircle2 className="h-3 w-3" /> VERIFIED
          </span>
        )}
      </label>

      <div
        className={`relative flex items-center rounded-xl border-2 bg-white p-2.5 shadow-xs transition-all ${
          selectedItem
            ? "border-[#10B981] bg-[#10B981]/5"
            : errorMsg
            ? "border-red-500 bg-red-50/50"
            : "border-[#111827]/15 focus-within:border-[#F97316]"
        }`}
      >
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#111827] text-[#F97316] mr-2">
          {type === "destination" ? <MapPin className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent font-sans text-sm font-semibold text-[#111827] placeholder:text-[#6B7280] focus:outline-none"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              onClear();
              setSuggestions([]);
              setIsOpen(false);
              setErrorMsg("");
            }}
            className="rounded-full p-1 text-[#6B7280] hover:bg-[#111827]/10"
            aria-label="Clear field"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {errorMsg && (
        <p className="font-sans text-[11px] font-semibold text-red-600 pl-1">{errorMsg}</p>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-64 overflow-y-auto rounded-xl border-2 border-[#111827]/15 bg-white p-1.5 shadow-2xl space-y-0.5">
          <div className="px-2 py-1 font-mono text-[9px] font-bold uppercase text-[#6B7280] border-b mb-1">
            {suggestions.length} MATCHING {type.toUpperCase()}S
          </div>

          {suggestions.map((item, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`flex w-full items-center justify-between rounded-lg p-2.5 text-left transition-colors ${
                  isHighlighted ? "bg-[#111827] text-white" : "hover:bg-[#F8FAFC] text-[#111827]"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className={`font-display text-xs font-extrabold ${isHighlighted ? "text-white" : "text-[#111827]"}`}>
                    {item.title}
                  </div>
                  <div className={`font-sans text-[11px] truncate ${isHighlighted ? "text-[#9CA3AF]" : "text-[#6B7280]"}`}>
                    {item.subtitle}
                  </div>
                </div>
                <span className={`font-mono text-[10px] font-bold uppercase ${isHighlighted ? "text-[#F97316]" : "text-[#F97316]"}`}>
                  Select →
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
