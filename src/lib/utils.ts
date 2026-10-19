export const capitalize = (value: string): string => {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatPokemonId = (id: number): string =>
  `#${String(id).padStart(3, "0")}`;

export const formatWeight = (weight: number): string =>
  `${(weight / 10).toFixed(1)} kg`;

export const formatHeight = (height: number): string =>
  `${(height / 10).toFixed(1)} m`;
