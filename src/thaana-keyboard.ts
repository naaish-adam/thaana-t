import { AL, L, V } from "./thaana";

// Thaana keyboard map

export const engToDivChar: { [key: string]: string } = {
  h: L.Ha,
  S: L.Sh,
  n: L.Nn,
  r: L.Ra,
  b: L.Ba,
  L: L.Lh,
  k: L.Kf,
  w: L.Al,
  v: L.Vv,
  m: L.Mm,
  f: L.Ff,
  d: L.Dh,
  t: L.Th,
  l: L.Lm,
  g: L.Gf,
  N: L.Gn,
  s: L.Sn,
  D: L.Da,
  z: L.Za,
  T: L.Ta,
  y: L.Ya,
  p: L.Pa,
  j: L.Ja,
  c: L.Ch,

  X: AL.Hh,
  H: AL.Kh,
  K: AL.Zh,
  J: AL.An,
  R: AL.Gh,
  C: AL.Vv,
  B: AL.Za,
  M: AL.Th,
  Y: AL.Dz,
  Z: AL.Sa,
  W: AL.Qf,
  G: AL.Sd,
  Q: AL.Dl,

  a: V.A,
  A: V.Aa,
  i: V.I,
  I: V.Ii,
  u: V.U,
  U: V.Uu,
  e: V.E,
  E: V.Ey,
  o: V.O,
  O: V.Oa,
  q: V.Sk,
};

export const engToDiv = (str: string): string => {
  return str
    .split("")
    .map((c) => engToDivChar[c] ?? c)
    .join("");
};
