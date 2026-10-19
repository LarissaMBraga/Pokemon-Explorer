import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import type { Pokemon } from "../lib/api";
import { formatPokemonId, capitalize } from "../lib/utils";
import { TYPE_COLORS } from "../lib/constants";
import PokemonDetails from "./PokemonDetails";

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
}

export default function PokemonModal({
  pokemon,
  isFavorite,
  onClose,
  onToggleFavorite,
}: PokemonModalProps) {
  return (
    <AnimatePresence>
      {pokemon && (
        <motion.div
          key={pokemon.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6"
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pokemon-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#101014] shadow-2xl shadow-black/50"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-[90px]"
              style={{
                backgroundColor:
                  TYPE_COLORS[pokemon.types[0] ?? "normal"] ?? "#A78BFA",
              }}
            />

            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.07] bg-[#101014]/90 px-5 py-4 backdrop-blur-xl sm:px-7">
              <span className="font-mono text-xs font-semibold tracking-widest text-white/40">
                {formatPokemonId(pokemon.id)}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(pokemon.id)}
                  aria-label={
                    isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  aria-pressed={isFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    isFavorite
                      ? "border-pink-300/25 bg-pink-300/10 text-pink-300"
                      : "border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-pink-300"
                  }`}
                >
                  <Heart
                    size={17}
                    className={isFavorite ? "fill-current" : ""}
                  />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Pokémon details"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="relative grid gap-7 p-5 sm:p-7 md:grid-cols-[0.85fr_1.15fr] md:gap-9">
              <div className="flex flex-col items-center justify-center">
                <div className="relative flex aspect-square w-full max-w-[300px] items-center justify-center rounded-[28px] border border-white/[0.07] bg-white/[0.025]">
                  <div
                    className="absolute h-40 w-40 rounded-full opacity-25 blur-[55px]"
                    style={{
                      backgroundColor:
                        TYPE_COLORS[pokemon.types[0] ?? "normal"] ?? "#A78BFA",
                    }}
                  />

                  {pokemon.image ? (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      src={pokemon.image}
                      alt={capitalize(pokemon.name)}
                      className="relative z-10 h-[85%] w-[85%] object-contain drop-shadow-2xl"
                    />
                  ) : (
                    <p className="text-sm text-white/35">
                      Image unavailable
                    </p>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300">
                    Pokémon profile
                  </p>
                  <h2
                    id="pokemon-modal-title"
                    className="mt-2 text-3xl font-black capitalize tracking-tight text-white sm:text-4xl"
                  >
                    {pokemon.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/40">
                    Discover every detail of this Pokémon.
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <PokemonDetails pokemon={pokemon} />
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
