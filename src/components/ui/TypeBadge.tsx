import { TYPE_COLORS } from "../../lib/constants";
import { capitalize } from "../../lib/utils";

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] ?? "#A78BFA";

  return (
    <span
      className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
      style={{
        borderColor: `${color}66`,
        backgroundColor: `${color}1A`,
        color,
      }}
    >
      {capitalize(type)}
    </span>
  );
}
