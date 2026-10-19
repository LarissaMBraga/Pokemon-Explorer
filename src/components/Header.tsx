import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

interface HeaderProps {
    favoritesCount?: number;
    onFavoritesClick?: () => void;
    favoritesOnly?: boolean;
}

export default function Header({
    favoritesCount = 0,
    onFavoritesClick,
    favoritesOnly = false,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#08080a]/80 backdrop-blur-2xl">
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
                <a href="#" className="group flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 12, scale: 1.08 }}
                        className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-200"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-transparent" />
                        <Sparkles size={20} className="relative" />
                    </motion.div>

                    <div>
                        <p className="text-[15px] font-black tracking-tight text-white">
                            PokéVerse<span className="text-violet-400">.</span>
                        </p>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                            Your Pokémon universe
                        </p>
                    </div>
                </a>

                <nav className="flex items-center gap-2 sm:gap-4">
                    <a
                        href="#explore"
                        className="hidden rounded-full px-4 py-2 text-sm text-white/55 transition hover:text-white sm:block"
                    >
                        Explore
                    </a>

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onFavoritesClick}
                        aria-pressed={favoritesOnly}
                        className={`relative flex h-10 items-center gap-2 rounded-full border px-3 text-sm transition sm:px-4 ${favoritesOnly
                                ? "border-pink-300/30 bg-pink-300/10 text-pink-200"
                                : "border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.08] hover:text-white"
                            }`}
                    >
                        <Heart
                            size={16}
                            className={favoritesOnly ? "fill-current" : ""}
                        />
                        <span className="hidden sm:inline">Favorites</span>
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1 text-[10px] font-bold">
                            {favoritesCount}
                        </span>
                    </motion.button>

                    <a
                        href="https://github.com/LarissaMBraga/Pokemon-Explorer"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    >
                        <span className="text-xs font-black">GH</span>
                    </a>
                </nav>
            </div>
        </header>
    );
}
