import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { Input } from "./input";

export type AutocompleteOption = {
  value: string | number;
  label: string;
  subLabel?: string;
};

type AutocompleteSelectProps = {
  value: string | number | null | undefined;
  onChange: (value: string | number | null) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  ariaInvalid?: boolean;
  className?: string;
  inputId?: string;
};

export function AutocompleteSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  loading,
  ariaInvalid,
  className,
  inputId,
}: AutocompleteSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);

  // Find the currently selected option
  const selected = useMemo(
    () => options.find((o) => String(o.value) === String(value)) ?? null,
    [options, value],
  );

  // Derived filtered options
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => {
      const hay = `${opt.label} ${opt.subLabel ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [options, query]);

  // Keep highlight in range
  useEffect(() => {
    if (highlightIndex >= filtered.length) setHighlightIndex(0);
  }, [filtered.length, highlightIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function handleSelect(opt: AutocompleteOption) {
    onChange(opt.value);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % Math.max(filtered.length, 1));
      listRef.current?.children.item(highlightIndex + 1)?.scrollIntoView({
        block: "nearest",
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(
        (i) =>
          (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1),
      );
      listRef.current?.children
        .item(Math.max(highlightIndex - 1, 0))
        ?.scrollIntoView({
          block: "nearest",
        });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[highlightIndex];
      if (opt) handleSelect(opt);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const displayValue = selected ? selected.label : "";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={open ? `${inputId}-listbox` : undefined}
        aria-invalid={ariaInvalid}
        placeholder={placeholder}
        disabled={disabled}
        value={open || query ? query : displayValue}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {/* Dropdown */}
      {open ? (
        <div
          className={cn(
            "bg-popover text-popover-foreground absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md",
          )}
        >
          {loading ? (
            <div className="p-3 text-sm text-muted-foreground">
              {t("common.loading")}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              {t("common.noResults")}
            </div>
          ) : (
            <ul
              id={inputId ? `${inputId}-listbox` : undefined}
              role="listbox"
              ref={listRef}
              className="max-h-60 overflow-auto p-1"
            >
              {filtered.map((opt, idx) => (
                <li
                  key={String(opt.value)}
                  role="option"
                  aria-selected={String(opt.value) === String(value)}
                >
                  <button
                    type="button"
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left text-sm cursor-pointer",
                      idx === highlightIndex &&
                        "bg-accent text-accent-foreground",
                    )}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onClick={() => handleSelect(opt)}
                  >
                    <span className="truncate">{opt.label}</span>
                    {opt.subLabel ? (
                      <span className="text-muted-foreground ml-auto truncate text-xs">
                        {opt.subLabel}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
