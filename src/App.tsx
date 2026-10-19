import { useEffect, useState } from "react";
import type { Pokemon } from "./lib/api";
import { usePokemon } from "./hooks/usePokemon";
import { useDebounce } from "./hooks/useDebounce";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import PokemonGrid from "./components/PokemonGrid";
import PokemonModal from "./components/PokemonModal";
import Pagination from "./components/Pagination";
import Footer from "./components/Footer";
import SearchBar from "./components/ui/SearchBar";
import LoadingSkeleton from "./components/ui/LoadingSkeleton";
import ErrorState from "./components/ui/ErrorState";
import EmptyState from "./components/ui/EmptyState";

function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [selectedType, setSelectedType] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = window.localStorage.getItem("pokeverse-favorites");
      const parsed: unknown = stored ? JSON.parse(stored) : [];

      return Array.isArray(parsed)
        ? parsed.filter((id): id is number => typeof id === "number")
        : [];
    } catch {
      return [];
    }
  });

  const {
    pokemon,
    loading,
    error,
    page,
    total,
    totalPages,
    setPage,
    retry,
  } = usePokemon({
    query: debouncedQuery,
    selectedType,
    favoritesOnly,
    favorites,
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "pokeverse-favorites",
        JSON.stringify(favorites)
      );
    } catch {
      return;
    }
  }, [favorites]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedType, favoritesOnly, favorites, setPage]);

  useEffect(() => {
    if (!selectedPokemon) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPokemon(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPokemon]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedType("all");
    setFavoritesOnly(false);
    setPage(1);
  };

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedType !== "all" ||
    favoritesOnly;

  return (
    <div className="min-h-screen overflow-hidden bg-[#08080a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[500px] h-80 w-80 rounded-full bg-violet-600/[0.045] blur-[120px]" />
        <div className="absolute right-[-180px] top-[1100px] h-96 w-96 rounded-full bg-fuchsia-600/[0.035] blur-[130px]" />
      </div>

      <div className="relative z-10">
        <Header
          favoritesCount={favorites.length}
          favoritesOnly={favoritesOnly}
          onFavoritesClick={() => {
            setFavoritesOnly((current) => !current);
            setPage(1);
          }}
        />

        <Hero
  total={total}
  visibleCount={pokemon.length}
  favoritesCount={favorites.length}
  onDiscover={(pokemon) => setSelectedPokemon(pokemon)}
/>

        <main
          id="explore"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-16 sm:px-8 lg:px-12"
        >
          <section className="border-t border-white/[0.07] pt-10">
            <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300">
                  The collection
                </p>

                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Explore Pokémon
                  <span className="text-violet-400"></span>
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                  Search the Pokédex, filter by type, and find your next
                  favorite companion.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 md:self-auto">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                <span className="text-xs text-white/55">
                  <span className="font-bold text-white">
                    {total.toLocaleString()}
                  </span>{" "}
                  {favoritesOnly ? "matching favorites" : "matching Pokémon"}
                </span>
              </div>
            </div>

            <SearchBar
              value={query}
              onChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
            />

            <FilterBar
              selectedType={selectedType}
              onTypeChange={(type) => {
                setSelectedType(type);
                setPage(1);
              }}
            />

            {favoritesOnly && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pink-300/15 bg-pink-300/[0.04] px-4 py-3">
                <p className="text-sm text-pink-100/80">
                  Showing your favorite Pokémon
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setFavoritesOnly(false);
                    setPage(1);
                  }}
                  className="text-xs font-semibold text-pink-200 transition hover:text-white"
                >
                  Show all Pokémon
                </button>
              </div>
            )}

            <div className="mb-5 mt-10 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {loading
                    ? "Discovering Pokémon..."
                    : favoritesOnly
                      ? "Your favorites"
                      : "Pokédex"}
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  {loading
                    ? "Gathering your discoveries"
                    : total === 0
                      ? "No matching discoveries"
                      : `Showing ${pokemon.length} of ${total.toLocaleString()} results`}
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="shrink-0 text-xs font-semibold text-violet-300 transition hover:text-white"
                >
                  Clear filters
                </button>
              )}
            </div>

            {loading ? (
              <LoadingSkeleton count={12} />
            ) : error ? (
              <ErrorState message={error} onRetry={retry} />
            ) : pokemon.length === 0 ? (
              <EmptyState
                query={query}
                onClear={hasActiveFilters ? clearFilters : undefined}
              />
            ) : (
              <>
                <PokemonGrid
                  pokemon={pokemon}
                  favorites={favorites}
                  onSelect={setSelectedPokemon}
                  onToggleFavorite={toggleFavorite}
                />

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  disabled={loading}
                />
              </>
            )}
          </section>
        </main>

        <Footer />
      </div>

      <PokemonModal
        pokemon={selectedPokemon}
        isFavorite={
          selectedPokemon
            ? favorites.includes(selectedPokemon.id)
            : false
        }
        onClose={() => setSelectedPokemon(null)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default App;
