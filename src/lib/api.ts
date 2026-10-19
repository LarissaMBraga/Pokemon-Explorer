const API_URL = "https://pokeapi.co/api/v2";

export const PAGE_SIZE = 24;

export interface PokemonStat {
  name: string;
  value: number;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  stats: PokemonStat[];
}

interface ApiPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

interface PokemonEntry {
  name: string;
  url: string;
}

interface ApiList<T> {
  count: number;
  results: T[];
}

interface ApiPokemonType {
  pokemon: {
    pokemon: PokemonEntry;
  }[];
}

let catalogPromise: Promise<ApiList<PokemonEntry>> | null = null;
const typePromises = new Map<string, Promise<Set<string>>>();

const fetchJson = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const getCatalog = (): Promise<ApiList<PokemonEntry>> => {
  if (!catalogPromise) {
    catalogPromise = fetchJson<ApiList<PokemonEntry>>(
      `${API_URL}/pokemon?limit=100000&offset=0`
    ).catch((error: unknown) => {
      catalogPromise = null;
      throw error;
    });
  }

  return catalogPromise;
};

const getPokemonTypeNames = (type: string): Promise<Set<string>> => {
  const existing = typePromises.get(type);

  if (existing) {
    return existing;
  }

  const request = fetchJson<ApiPokemonType>(
    `${API_URL}/type/${encodeURIComponent(type)}`
  )
    .then((data) => new Set(data.pokemon.map((entry) => entry.pokemon.name)))
    .catch((error: unknown) => {
      typePromises.delete(type);
      throw error;
    });

  typePromises.set(type, request);
  return request;
};

const normalizePokemon = (data: ApiPokemon): Pokemon => ({
  id: data.id,
  name: data.name,
  image:
    data.sprites.other["official-artwork"]?.front_default ??
    data.sprites.front_default ??
    "",
  types: data.types.map(({ type }) => type.name),
  height: data.height,
  weight: data.weight,
  stats: data.stats.map(({ base_stat, stat }) => ({
    name: stat.name,
    value: base_stat,
  })),
});

export const fetchPokemonById = async (id: number): Promise<Pokemon> => {
  const data = await fetchJson<ApiPokemon>(`${API_URL}/pokemon/${id}`);
  return normalizePokemon(data);
};

export const fetchPokemonByName = async (
  name: string
): Promise<Pokemon> => {
  const normalizedName = name.trim().toLowerCase();

  const data = await fetchJson<ApiPokemon>(
    `${API_URL}/pokemon/${encodeURIComponent(normalizedName)}`
  );

  return normalizePokemon(data);
};

interface FetchPokemonCatalogOptions {
  page: number;
  pageSize?: number;
  query?: string;
  type?: string;
  favoritesOnly?: boolean;
  favoriteIds?: number[];
}

export const fetchPokemonCatalog = async ({
  page,
  pageSize = PAGE_SIZE,
  query = "",
  type = "all",
  favoritesOnly = false,
  favoriteIds = [],
}: FetchPokemonCatalogOptions): Promise<{
  pokemon: Pokemon[];
  total: number;
}> => {
  const catalog = await getCatalog();
  const normalizedQuery = query.trim().toLowerCase();

  let entries = catalog.results;

  if (favoritesOnly) {
    const favoriteSet = new Set(favoriteIds);
    entries = entries.filter((entry) => {
      const id = Number(entry.url.match(/\/pokemon\/(\d+)\/?$/)?.[1]);
      return favoriteSet.has(id);
    });
  }

  if (normalizedQuery) {
    entries = entries.filter((entry) => {
      const id = Number(entry.url.match(/\/pokemon\/(\d+)\/?$/)?.[1]);

      return (
        entry.name.includes(normalizedQuery) ||
        String(id).includes(normalizedQuery)
      );
    });
  }

  if (type !== "all") {
    const namesForType = await getPokemonTypeNames(type);
    entries = entries.filter((entry) => namesForType.has(entry.name));
  }

  const total = entries.length;
  const start = (page - 1) * pageSize;
  const pageEntries = entries.slice(start, start + pageSize);

  const pokemon = await Promise.all(
    pageEntries.map(async (entry) => {
      const data = await fetchJson<ApiPokemon>(entry.url);
      return normalizePokemon(data);
    })
  );

  return { pokemon, total };
};
