import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  query?: string;
  onClear?: () => void;
}

export default function EmptyState({
  query = "",
  onClear,
}: EmptyStateProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center px-4 py-20 text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300">
        <Search size={27} />
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
        No discoveries yet
      </p>

      <h2 className="text-2xl font-black tracking-tight text-white">
        Wild Pokémon not found!
      </h2>

      <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
        {query
          ? `We couldn't find any Pokémon matching "${query}". Try another name or number.`
          : "There are no Pokémon to display with these filters. Try changing your selection."}
      </p>

      {onClear && (
        <Button
          variant="secondary"
          onClick={onClear}
          className="mt-7"
        >
          <span className="inline-flex items-center gap-2">
            <X size={16} />
            Clear search and filters
          </span>
        </Button>
      )}
    </motion.section>
  );
}
