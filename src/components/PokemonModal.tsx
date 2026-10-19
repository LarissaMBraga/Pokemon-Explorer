import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, LoaderCircle, X } from "lucide-react";
import {
  fetchPokemonById,
  fetchPokemonEvolutionChain,
  type Pokemon,
  type PokemonEvolution,
} from "../lib/api";
import { formatPokemonId, capitalize } from "../lib/utils";
import { TYPE_COLORS } from "../lib/constants";
import PokemonDetails from "./PokemonDetails";

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
}

interface EvolutionSlide extends Pokemon {
  evolvesFrom?: string | null;
  evolutionDetails?: string | null;
}

export default function PokemonModal({
  pokemon,
  isFavorite,
  onClose,
  onToggleFavorite,
}: PokemonModalProps) {
  const [evolutions, setEvolutions] = useState<EvolutionSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evolutionError, setEvolutionError] = useState("");
  const touchStartX = useRef<number | null>(null);

  const activePokemon: EvolutionSlide | null =
  evolutions[activeIndex] ?? pokemon;
  const accent = TYPE_COLORS[activePokemon?.types[0] ?? "normal"] ?? "#A78BFA";

  useEffect(() => {
    if (!pokemon) {
      setEvolutions([]);
      setActiveIndex(0);
      return;
    }

    let cancelled = false;

    async function loadEvolutions() {
      setLoading(true);
      setEvolutionError("");
      setEvolutions([pokemon!]);
      setActiveIndex(0);

      try {
        const chain: PokemonEvolution[] =
          await fetchPokemonEvolutionChain(pokemon!.id);

        const details = await Promise.all(
          chain.map(async (evolution) => {
            const details = await fetchPokemonById(evolution.id);

            return {
              ...details,
              evolvesFrom: evolution.evolvesFrom,
              evolutionDetails: evolution.evolutionDetails,
            } satisfies EvolutionSlide;
          }),
        );

        if (cancelled) return;

        setEvolutions(details);

        const currentIndex = details.findIndex(
          (evolution) => evolution.id === pokemon!.id,
        );

        setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
      } catch {
        if (!cancelled) {
          setEvolutions([pokemon!]);
          setActiveIndex(0);
          setEvolutionError("Evolution data is currently unavailable.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadEvolutions();

    return () => {
      cancelled = true;
    };
  }, [pokemon?.id]);

  useEffect(() => {
    if (!pokemon) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverflowX = html.style.overflowX;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyLeft = body.style.left;
    const previousBodyRight = body.style.right;
    const previousBodyWidth = body.style.width;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverflowX = body.style.overflowX;
    const previousBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    html.style.overflowX = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.overflowX = "hidden";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.overflowX = previousHtmlOverflowX;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.left = previousBodyLeft;
      body.style.right = previousBodyRight;
      body.style.width = previousBodyWidth;
      body.style.overflow = previousBodyOverflow;
      body.style.overflowX = previousBodyOverflowX;
      body.style.paddingRight = previousBodyPaddingRight;

      window.scrollTo(0, scrollY);
    };
  }, [pokemon?.id]);

  function showPrevious() {
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  function showNext() {
    setActiveIndex((current) =>
      Math.min(current + 1, evolutions.length - 1),
    );
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX;
    const distance = touchStartX.current - (endX ?? touchStartX.current);

    touchStartX.current = null;

    if (Math.abs(distance) < 50) return;

    if (distance > 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  return (
    <AnimatePresence>
      {pokemon && activePokemon && (
        <motion.div
          key={pokemon.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto overscroll-none bg-black/75 p-4 backdrop-blur-md sm:p-6"
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
            className="relative my-auto max-h-[90vh] max-h-[90dvh] w-full min-w-0 max-w-3xl overflow-x-hidden overflow-y-auto overscroll-contain rounded-[28px] border border-white/10 bg-[#101014] shadow-2xl shadow-black/50"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-[90px]"
              style={{ backgroundColor: accent }}
            />

            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.07] bg-[#101014]/90 px-5 py-4 backdrop-blur-xl sm:px-7">
              <span className="font-mono text-xs font-semibold tracking-widest text-white/40">
                {formatPokemonId(activePokemon.id)}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(activePokemon.id)}
                  aria-label={
                    isFavorite && activePokemon.id === pokemon.id
                      ? "Remove from favorites"
                      : "Toggle favorite"
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    isFavorite && activePokemon.id === pokemon.id
                      ? "border-pink-300/25 bg-pink-300/10 text-pink-300"
                      : "border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-pink-300"
                  }`}
                >
                  <Heart
                    size={17}
                    className={
                      isFavorite && activePokemon.id === pokemon.id
                        ? "fill-current"
                        : ""
                    }
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

            <div
              className="relative grid min-w-0 items-start gap-7 p-5 sm:p-7 md:grid-cols-[0.85fr_1.15fr] md:gap-9"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "pan-y" }}
            >
              <div className="flex min-w-0 flex-col items-center justify-start">
                <div className="relative flex aspect-square w-full max-w-[300px] items-center justify-center overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.025]">
                  <div
                    className="absolute h-40 w-40 rounded-full opacity-25 blur-[55px]"
                    style={{ backgroundColor: accent }}
                  />

                  {activePokemon.image ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activePokemon.id}
                        initial={{ opacity: 0, scale: 0.8, x: 18 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -18 }}
                        transition={{ duration: 0.22 }}
                        src={activePokemon.image}
                        alt={capitalize(activePokemon.name)}
                        draggable={false}
                        className="relative z-10 h-[85%] w-[85%] select-none object-contain drop-shadow-2xl"
                      />
                    </AnimatePresence>
                  ) : (
                    <p className="text-sm text-white/35">Image unavailable</p>
                  )}

                  <button
                    type="button"
                    onClick={showPrevious}
                    disabled={activeIndex === 0 || loading}
                    aria-label="Previous evolution"
                    className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 backdrop-blur-md transition hover:bg-black/70 disabled:opacity-20"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  <button
                    type="button"
                    onClick={showNext}
                    disabled={activeIndex >= evolutions.length - 1 || loading}
                    aria-label="Next evolution"
                    className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 backdrop-blur-md transition hover:bg-black/70 disabled:opacity-20"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>

                <div className="mt-6 w-full text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300">
                    {evolutions.length > 1
                      ? `Evolution ${activeIndex + 1} of ${evolutions.length}`
                      : "Pokémon profile"}
                  </p>

                  <h2
                    id="pokemon-modal-title"
                    className="mt-2 text-3xl font-black capitalize tracking-tight text-white sm:text-4xl"
                  >
                    {activePokemon.name.replace(/-/g, " ")}
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    {activeIndex > 0 && activePokemon.evolvesFrom
                      ? `Evolves from ${activePokemon.evolvesFrom.replace(/-/g, " ")}`
                      : "Discover every detail of this Pokémon."}
                  </p>

                  {evolutions.length > 1 && (
                    <div className="mt-5 flex items-center justify-center gap-2">
                      {evolutions.map((evolution, index) => (
                        <button
                          key={evolution.id}
                          type="button"
                          aria-label={`View ${evolution.name}`}
                          aria-current={
                            index === activeIndex ? "step" : undefined
                          }
                          onClick={() => setActiveIndex(index)}
                          className={`h-2 rounded-full transition-all duration-200 ${
                            index === activeIndex
                              ? "w-6 bg-violet-300"
                              : "w-2 bg-white/25 hover:bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {loading && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
                      <LoaderCircle size={14} className="animate-spin" />
                      Loading evolutions...
                    </div>
                  )}

                  {evolutionError && (
                    <p className="mt-3 text-xs text-white/35">
                      {evolutionError}
                    </p>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <PokemonDetails pokemon={activePokemon} />
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
