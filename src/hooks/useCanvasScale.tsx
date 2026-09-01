import { useEffect, useState } from "react";

/**
 * Scales a fixed-size design canvas (e.g. exported from Figma) to fit
 * the current viewport width, on every screen size - small or large -
 * without changing anything about the internal absolute-positioned layout.
 */
export function useCanvasScale(designWidth: number) {
  const [scale, setScale] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth / designWidth : 1,
  );

  useEffect(() => {
    const updateScale = () => setScale(window.innerWidth / designWidth);

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [designWidth]);

  return scale;
}