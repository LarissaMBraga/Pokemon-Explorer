
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pokémon pagination"
      className="mt-12 flex items-center justify-center gap-5"
    >
      <motion.button
        type="button"
        whileHover={{ scale: disabled || page === 1 ? 1 : 1.06 }}
        whileTap={{ scale: disabled || page === 1 ? 1 : 0.94 }}
        disabled={disabled || page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft size={17} />
        Previous
      </motion.button>

      <div className="min-w-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
          Page
        </p>
        <p className="mt-1 text-sm font-bold text-white">
          {page} <span className="text-white/30">/ {totalPages}</span>
        </p>
      </div>

      <motion.button
        type="button"
        whileHover={{
          scale: disabled || page === totalPages ? 1 : 1.06,
        }}
        whileTap={{
          scale: disabled || page === totalPages ? 1 : 0.94,
        }}
        disabled={disabled || page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next
        <ChevronRight size={17} />
      </motion.button>
    </nav>
  );
}
