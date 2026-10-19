import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-lg flex-col items-center py-20 text-center"
      role="alert"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
        <AlertTriangle size={28} />
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-rose-300">
        Connection interrupted
      </p>

      <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
        Looks like Team Rocket
        <span className="text-violet-300"> interfered.</span>
      </h2>

      <p className="mt-4 max-w-sm text-sm leading-6 text-white/50">
        {message}
      </p>

      <Button onClick={onRetry} className="mt-7">
        <span className="inline-flex items-center gap-2">
          <RefreshCw size={16} />
          Try again
        </span>
      </Button>
    </motion.section>
  );
}
