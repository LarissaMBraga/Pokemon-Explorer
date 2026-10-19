import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { POKEMON_TYPES } from "../lib/constants";
import { capitalize } from "../lib/utils";

interface FilterBarProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function FilterBar({
  selectedType,
  onTypeChange,
}: FilterBarProps) {
  return (
    <section aria-label="Filter Pokémon by type" className="mt-6">
      <div className="mb-3 flex items-center gap-2 text-white/40">
        <SlidersHorizontal size={15} />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Filter by type
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => {
          const selected = selectedType === type;

          return (
            <motion.button
              key={type}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onTypeChange(type)}
              aria-pressed={selected}
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold capitalize transition ${
                selected
                  ? "border-violet-300/40 bg-violet-300/15 text-violet-100 shadow-[0_0_24px_rgba(167,139,250,0.08)]"
                  : "border-white/[0.08] bg-white/[0.025] text-white/45 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/80"
              }`}
            >
              {type === "all" ? "All types" : capitalize(type)}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
