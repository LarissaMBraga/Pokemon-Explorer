import { AnimatePresence, motion } from "framer-motion";
import type { Pokemon } from "../lib/api";
import PokemonCard from "./PokemonCard";

interface PokemonGridProps {
  pokemon: Pokemon[];
  favorites: number[];
  onSelect: (pokemon: Pokemon) => void;
  onToggleFavorite: (id: number) => void;
}

export default function PokemonGrid({
  pokemon,
  favorites,
  onSelect,
  onToggleFavorite,
}: PokemonGridProps) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {pokemon.map((item, index) => (
          <PokemonCard
            key={item.id}
            pokemon={item}
            index={index}
            isFavorite={favorites.includes(item.id)}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
