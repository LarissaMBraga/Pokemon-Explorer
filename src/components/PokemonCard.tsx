import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import type { Pokemon } from "../lib/api";
import { formatPokemonId, capitalize } from "../lib/utils";
import { TYPE_COLORS } from "../lib/constants";
import TypeBadge from "./ui/TypeBadge";

interface PokemonCardProps {
  pokemon: Pokemon;
  index: number;
  isFavorite: boolean;
  onSelect: (pokemon: Pokemon) => void;
  onToggleFavorite: (id: number) => void;
}

export default function PokemonCard({
  pokemon,
  index,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: PokemonCardProps) {
  const primaryType = pokemon.types[0] ?? "normal";
  const accent = TYPE_COLORS[primaryType] ?? "#A78BFA";
  const totalStats = pokemon.stats.reduce(
    (total, stat) => total + stat.value,
    0
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.025, 0.25),
      }}
      whileHover={{ y: -6 }}
      className="group relative isolate overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#101014] transition-colors duration-300 hover:border-white/20"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 -z-10 h-36 w-36 rounded-full opacity-[0.13] blur-[45px] transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-center justify-between px-5 pt-5">
        <span className="font-mono text-xs font-semibold tracking-wider text-white/35">
          {formatPokemonId(pokemon.id)}
        </span>

        <button
          type="button"
          onClick={() => onToggleFavorite(pokemon.id)}
          aria-label={
            isFavorite
              ? `Remove ${pokemon.name} from favorites`
              : `Add ${pokemon.name} to favorites`
          }
          aria-pressed={isFavorite}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
            isFavorite
              ? "border-pink-300/25 bg-pink-300/10 text-pink-300"
              : "border-white/[0.07] bg-white/[0.03] text-white/35 hover:border-pink-300/20 hover:text-pink-300"
          }`}
        >
          <Heart size={16} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSelect(pokemon)}
        aria-label={`View ${pokemon.name} details`}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-300"
      >
        <div className="relative mx-4 mt-1 flex h-44 items-center justify-center overflow-hidden rounded-2xl">
          <div
            className="absolute h-28 w-28 rounded-full opacity-20 blur-2xl transition duration-500 group-hover:scale-125 group-hover:opacity-35"
            style={{ backgroundColor: accent }}
          />

          {pokemon.image ? (
            <motion.img
              src={pokemon.image}
              alt={capitalize(pokemon.name)}
              loading="lazy"
              whileHover={{ scale: 1.12, rotate: 3 }}
              transition={{ type: "spring", stiffness: 220, damping: 15 }}
              className="relative z-10 h-40 w-40 object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
            />
          ) : (
            <span className="text-xs text-white/30">Image unavailable</span>
          )}
        </div>

        <div className="px-5 pb-5 pt-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate text-lg font-extrabold capitalize tracking-tight text-white">
              {pokemon.name}
            </h3>
            <ArrowUpRight
              size={17}
              className="shrink-0 text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
              Base stats
            </span>
            <span className="font-mono text-sm font-bold" style={{ color: accent }}>
              {totalStats}
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
