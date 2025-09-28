export interface Coords {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  p3: { x: number; y: number };
  p4: { x: number; y: number };
}

export interface Colors {
  baseColor: string;
  contrasts: {
    dark: string;
    light: string;
  };
}

export const DEFAULT_COLORS: Colors = {
  baseColor: '#dfdfdf',
  contrasts: {
    dark: '#979797',
    light: '#cbcbcb',
  },
};
