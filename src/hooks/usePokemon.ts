import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPokemonCatalog, PAGE_SIZE, type Pokemon } from "../lib/api";

interface UsePokemonOptions {
  query: string;
  selectedType: string;
  favoritesOnly: boolean;
  favorites: number[];
}

interface UsePokemonResult {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  retry: () => Promise<void>;
}

export const usePokemon = ({
  query,
  selectedType,
  favoritesOnly,
  favorites,
}: UsePokemonOptions): UsePokemonResult => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(1);
  const [total, setTotal] = useState(0);
  const requestId = useRef(0);

  const loadPokemon = useCallback(async () => {
    const currentRequest = ++requestId.current;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchPokemonCatalog({
        page,
        pageSize: PAGE_SIZE,
        query,
        type: selectedType,
        favoritesOnly,
        favoriteIds: favorites,
      });

      if (currentRequest !== requestId.current) {
        return;
      }

      setPokemon(result.pokemon);
      setTotal(result.total);
    } catch {
      if (currentRequest !== requestId.current) {
        return;
      }

      setPokemon([]);
      setTotal(0);
      setError(
        "We couldn't reach the Pokémon world right now. Please try again."
      );
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, [page, query, selectedType, favoritesOnly, favorites]);

  useEffect(() => {
    void loadPokemon();

    return () => {
      requestId.current += 1;
    };
  }, [loadPokemon]);

  const setPage = useCallback(
    (nextPage: number) => {
      const totalPages = Math.ceil(total / PAGE_SIZE);

      if (
        nextPage < 1 ||
        nextPage > totalPages ||
        nextPage === page
      ) {
        return;
      }

      setPageState(nextPage);
    },
    [page, total]
  );

  return {
    pokemon,
    loading,
    error,
    page,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    setPage,
    retry: loadPokemon,
  };
};
