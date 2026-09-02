import { motion } from "framer-motion";
import { bluePaths, greenPaths } from "./mazePaths";
import type { MazePath } from "./mazeTypes";

const COLORS = {
  blue: "#455BB2",
  lightBlue: "#687BC3",
  green: "#4CBC38",
};

interface AnimatedMazeProps {
  className?: string;
  onComplete?: () => void;
}

function AnimatedPath({
  path,
  onComplete,
}: {
  path: MazePath;
  onComplete?: () => void;
}) {
  return (
    <motion.path
      d={path.d}
      fill="none"
      stroke={COLORS[path.color]}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      initial={{
        pathLength: 0,
        opacity: 0,
      }}
      animate={{
        pathLength: 1,
        opacity: 1,
      }}
      transition={{
        pathLength: {
          duration: path.duration,
          delay: path.delay,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.18,
          delay: path.delay,
        },
      }}
      onAnimationComplete={onComplete}
    />
  );
}

export default function AnimatedMaze({
  className = "",
  onComplete,
}: AnimatedMazeProps) {
  return (
    <svg
      viewBox="0 0 1247 829"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute
        inset-0
        h-full
        w-full
        ${className}
      `}
    >
      <g>
        {bluePaths.map((path) => (
          <AnimatedPath
            key={path.id}
            path={path}
          />
        ))}
      </g>

      <g>
        {greenPaths.map((path, index) => (
          <AnimatedPath
            key={path.id}
            path={path}
            onComplete={
              index === greenPaths.length - 1
                ? onComplete
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  );
}


