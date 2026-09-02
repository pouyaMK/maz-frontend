import { motion } from "framer-motion";

// جایگزینِ vector-3.svg؛ یه شکل باریک و عمودی fill-based (بدون stroke)
// هست. برخلاف خط‌های stroke که با pathLength کشیده می‌شن، این شکل چون
// fill هست بهتره با scaleY از بالا به پایین "رشد" کنه — transformOrigin
// رو top گذاشتیم تا انگار از بالا شروع به کشیده‌شدن به سمت پایین می‌کنه.

interface MazeThinStemVectorProps {
  className?: string;
}

export const MazeThinStemVector = ({ className }: MazeThinStemVectorProps) => {
  return (
    <motion.svg
      width="25"
      height="126"
      viewBox="0 0 25 126"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transformOrigin: "top center" }}
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <path
        d="M-3.90604e-06 2.08971C-3.85561e-06 0.936058 0.939926 -1.04769e-06 2.09835 -9.9705e-07L14.3051 -4.63476e-07C20.1508 -2.07952e-07 24.9082 4.73777 24.9082 10.5594L24.5206 123.284C24.5206 124.438 23.5806 125.374 22.4222 125.374C21.2638 125.374 20.3239 124.438 20.3239 123.284L20.7115 10.5594C20.7115 7.04097 17.8381 4.18353 14.3092 4.18353L2.10248 4.18353C0.94405 4.18353 0.00411782 3.24747 0.00411787 2.09382L-3.90604e-06 2.08971Z"
        fill="#4262AE"
      />
    </motion.svg>
  );
};

export default MazeThinStemVector;