import { motion, type Variants } from "framer-motion";

// جایگزینِ vector-2-1.svg؛ فقط یه path با stroke داره (یه خط منحنی
// ساده)، پس با pathLength کشیده میشه — بدون نیاز به stagger چون یه
// خط بیشتر نیست.

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};

interface MazeCornerVectorProps {
  className?: string;
}

export const MazeCornerVector = ({ className }: MazeCornerVectorProps) => {
  return (
    <motion.svg
      width="218"
      height="376"
      viewBox="0 0 218 376"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.path
        variants={drawVariants}
        d="M214.83 3.00024L75.9445 3.00003C63.4402 3.00001 51.8857 9.67098 45.6336 20.5L7.68911 86.2218C4.61722 91.5424 3 97.578 3 103.722V372.366"
        stroke="#4DB757"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </motion.svg>
  );
};

export default MazeCornerVector;