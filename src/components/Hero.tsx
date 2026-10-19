import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Orbit,
  Sparkles,
  Zap,
} from "lucide-react";
import { fetchPokemonById, type Pokemon } from "../lib/api";
import { capitalize, formatPokemonId } from "../lib/utils";
import TypeBadge from "./ui/TypeBadge";

interface HeroProps {
  total: number;
  visibleCount: number;
  favoritesCount: number;
  onDiscover: (pokemon: Pokemon) => void;
}

export default function Hero({
  total,
  visibleCount,
  favoritesCount,
  onDiscover,
}: HeroProps) {
  const today = new Date();
  const dayOfYear = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(today.getFullYear(), 0, 0)) /
      86400000
  );
  const featuredId = ((dayOfYear - 1) % 1025) + 1;

  const [featuredPokemon, setFeaturedPokemon] = useState<Pokemon | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setFeaturedLoading(true);
    setFeaturedPokemon(null);

    fetchPokemonById(featuredId)
      .then((pokemon) => {
        if (active) {
          setFeaturedPokemon(pokemon);
        }
      })
      .catch(() => {
        if (active) {
          setFeaturedPokemon(null);
        }
      })
      .finally(() => {
        if (active) {
          setFeaturedLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [featuredId]);

  return (
   <section className="relative isolate overflow-hidden px-5 pb-8 pt-0 sm:px-8 sm:pb-10 sm:pt-1 lg:px-12 lg:pt-2">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-24 -z-10 h-48 w-48 rounded-full bg-fuchsia-500/[0.08] blur-[90px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3.5 py-2"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">
              The Pokédex, reimagined
            </span>
            <Sparkles size={13} className="text-violet-300" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[88px]"
          >
            Your next
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
              discovery
            </span>
            <br />
            awaits
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-7 max-w-lg text-sm leading-7 text-white/50 sm:text-base"
          >
            Explore the world of Pokémon, discover their abilities, uncover
            hidden details, and build your own collection of favorites.
          </motion.p>

          <motion.a
            href="#explore"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-black shadow-xl shadow-violet-500/10 transition hover:shadow-violet-400/20"
          >
            Start exploring
            <ArrowDown size={16} />
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute inset-8 rounded-full bg-violet-500/20 blur-[70px]" />

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.025] to-violet-400/[0.08] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/[0.06]" />
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-white/[0.06]" />

            <div className="relative flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300">
                  Daily discovery
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  Meet your Pokémon
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-violet-200">
                <Orbit size={20} />
              </div>
            </div>

            <div className="relative my-5 flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-black/10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute h-44 w-44 rounded-full border border-dashed border-violet-300/20"
              />

              <div className="absolute h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

              {featuredLoading ? (
                <div className="h-32 w-32 animate-pulse rounded-full bg-white/[0.08]" />
              ) : featuredPokemon?.image ? (
                <motion.img
                  key={featuredPokemon.id}
                  src={featuredPokemon.image}
                  alt={capitalize(featuredPokemon.name)}
                  initial={{ opacity: 0, scale: 0.7, y: 12 }}
                  animate={{
                    opacity: 1,
                    scale: [1, 1.04, 1],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.4 },
                    scale: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="relative z-10 h-48 w-48 object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.35)]"
                />
              ) : (
                <div className="relative flex flex-col items-center gap-3 text-violet-200">
                  <Sparkles size={42} strokeWidth={1.2} />
                  <span className="text-xs text-white/40">
                    Discovery temporarily unavailable
                  </span>
                </div>
              )}

              <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
                <Zap size={17} />
              </div>
            </div>

            <div className="relative min-h-[100px]">
              {featuredPokemon ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-semibold tracking-wider text-white/35">
                      {formatPokemonId(featuredPokemon.id)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                      Pokémon of the day
                    </span>
                  </div>

                  <h2 className="mt-2 truncate text-2xl font-black capitalize tracking-tight text-white">
                    {featuredPokemon.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {featuredPokemon.types.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.975 }}
                    onClick={() => onDiscover(featuredPokemon)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-violet-100"
                  >
                    Discover Pokémon
                    <ArrowUpRight size={16} />
                  </motion.button>
                </>
              ) : (
                <p className="py-5 text-center text-sm text-white/45">
                  Your next discovery is waiting.
                </p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 divide-x divide-white/[0.08] rounded-2xl border border-white/[0.07] bg-black/20 py-4">
              <div className="px-2 text-center">
                <p className="text-xl font-black text-white">
                  {total.toLocaleString()}
                </p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-white/35">
                  Matching
                </p>
              </div>

              <div className="px-2 text-center">
                <p className="text-xl font-black text-violet-200">
                  {visibleCount.toLocaleString()}
                </p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-white/35">
                  On screen
                </p>
              </div>

              <div className="px-2 text-center">
                <p className="text-xl font-black text-pink-200">
                  {favoritesCount.toLocaleString()}
                </p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-white/35">
                  Favorites
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-5 -left-4 -z-10 h-24 w-24 rounded-full border border-violet-300/10" />
        </motion.div>
      </div>
    </section>
  );
}
