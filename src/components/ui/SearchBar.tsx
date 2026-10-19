import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search Pokémon by name or number...",
}: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative w-full"
    >
      <Search
        size={19}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-violet-300"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search Pokémon by name or number"
        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-14 pr-12 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-white/[0.07] focus:ring-4 focus:ring-violet-500/[0.08]"
      />

      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <X size={17} />
        </button>
      )}
    </motion.div>
  );
}
