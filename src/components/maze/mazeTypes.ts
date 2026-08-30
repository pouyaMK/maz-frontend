export type MazePathColor = "blue" | "lightBlue" | "green";

export interface MazePath {
  id: string;
  d: string;
  color: MazePathColor;
  duration: number;
  delay: number;
  opacity?: number;
}

export interface AnimatedMazeProps {
  className?: string;
}
