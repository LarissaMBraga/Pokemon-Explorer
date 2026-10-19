import { motion } from "framer-motion";
import {
  Ruler,
  Scale,
  Shield,
  Swords,
  Zap,
} from "lucide-react";
import type { Pokemon } from "../lib/api";
import { TYPE_COLORS } from "../lib/constants";
import { capitalize, formatHeight, formatWeight } from "../lib/utils";
import TypeBadge from "./ui/TypeBadge";

interface PokemonDetailsProps {
  pokemon: Pokemon;
}

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

const STAT_ICONS: Record<string, typeof Zap> = {
  hp: Zap,
  attack: Swords,
  defense: Shield,
  "special-attack": Zap,
  "special-defense": Shield,
  speed: Zap,
};

export default function PokemonDetails({ pokemon }: PokemonDetailsProps) {
  const accent = TYPE_COLORS[pokemon.types[0] ?? "normal"] ?? "#A78BFA";

  const totalStats = pokemon.stats.reduce(
    (total, stat) => total + stat.value,
    0,
  );

  return (
    <motion.div
      key={pokemon.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
      className="min-w-0 space-y-7"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2 text-white/40">
            <Ruler size={15} />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
              Height
            </span>
          </div>
          <p className="text-xl font-black text-white">
            {formatHeight(pokemon.height)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2 text-white/40">
            <Scale size={15} />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
              Weight
            </span>
          </div>
          <p className="text-xl font-black text-white">
            {formatWeight(pokemon.weight)}
          </p>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white">Base stats</h3>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              color: accent,
              backgroundColor: `${accent}18`,
            }}
          >
            Total {totalStats}
          </span>
        </div>

        <div className="space-y-4">
          {pokemon.stats.map((stat, index) => {
            const Icon = STAT_ICONS[stat.name] ?? Zap;

            return (
              <div key={stat.name}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-xs font-medium text-white/60">
                    <Icon size={13} style={{ color: accent }} />
                    {STAT_LABELS[stat.name] ?? capitalize(stat.name)}
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    {stat.value}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((stat.value / 255) * 100, 100)}%`,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.04,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${accent}88, ${accent})`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-bold text-white">Pokémon type</h3>
        <div className="flex flex-wrap gap-2">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
