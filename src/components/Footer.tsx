import { ArrowUpRight, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.07] bg-white/[0.015]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <a href="#" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-300/[0.08] text-violet-200 transition group-hover:bg-violet-300/[0.14]">
              <Sparkles size={19} />
            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-white">
                PokéVerse<span className="text-violet-400">.</span>
              </p>
              <p className="mt-1 text-[10px] text-white/35">
                Discover your next favorite.
              </p>
            </div>
          </a>

          <div className="flex flex-col gap-2 text-xs text-white/40 md:items-end">
            <p className="flex items-center gap-1.5">
              Designed and developed by
              <span className="font-semibold text-white/80">
                Larissa Braga
              </span>
              <Heart size={12} className="fill-pink-400 text-pink-400" />
            </p>

            <p>
              Powered by{" "}
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noreferrer"
                className="text-white/65 underline decoration-white/20 underline-offset-4 transition hover:text-violet-300"
              >
                PokéAPI
              </a>
              <span className="mx-2 text-white/15">·</span>
              <span>Fan-made project</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-violet-300/15 bg-gradient-to-br from-violet-400/[0.09] via-white/[0.025] to-fuchsia-400/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300">
              More from my portfolio
            </p>

            <h2 className="mt-2 text-lg font-black tracking-tight text-white sm:text-xl">
              Liked this project?
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/45">
              Come explore more projects and see what else I’ve been building.
            </p>
          </div>

          <motion.a
            href="https://larissabraga.dev/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-violet-100"
          >
            Visit my portfolio
            <ArrowUpRight size={16} />
          </motion.a>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-[10px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Larissa Braga. Built with care.</p>

          <motion.a
            href="#"
            whileHover={{ y: -2 }}
            className="inline-flex items-center gap-2 transition hover:text-violet-200"
          >
            Back to top
            <span aria-hidden="true">↑</span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
