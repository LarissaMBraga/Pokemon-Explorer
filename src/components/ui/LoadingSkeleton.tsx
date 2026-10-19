import { motion } from "framer-motion";

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.3) }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5"
    >
      <div className="mb-5 flex justify-between">
        <div className="h-3 w-10 animate-pulse rounded-full bg-white/10" />
        <div className="h-3 w-14 animate-pulse rounded-full bg-white/10" />
      </div>

      <div className="mb-5 flex justify-center">
        <div className="h-32 w-32 animate-pulse rounded-full bg-white/[0.07]" />
      </div>

      <div className="mx-auto mb-4 h-5 w-28 animate-pulse rounded-full bg-white/10" />

      <div className="flex justify-center gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.08]" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.08]" />
      </div>
    </motion.div>
  );
}

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({
  count = 24,
}: LoadingSkeletonProps) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      aria-label="Loading Pokémon"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} index={index} />
      ))}
    </div>
  );
}
