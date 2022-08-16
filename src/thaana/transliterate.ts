import { AL, L, V } from "./alphabet";

const latinToDivChar: Record<string, string> = {
  h: L.Ha,
  sh: L.Sh,
  n: L.Nn,
  r: L.Ra,
  b: L.Ba,
  lh: L.Lh,
  k: L.Kf,
  // a: L.Al,
  c: L.Kf,
  v: L.Vv,
  w: L.Vv,
  m: L.Mm,
  f: L.Ff,
  dh: L.Dh,
  th: L.Th,
  l: L.Lm,
  g: L.Gf,
  gn: L.Gn,
  s: L.Sn,
  d: L.Da,
  z: L.Za,
  t: L.Ta,
  y: L.Ya,
  p: L.Pa,
  j: L.Ja,
  ch: L.Ch,

  q: AL.Qf,
  kh: AL.Kh,

  x: `${L.Kf}${V.Sk}${L.Sn}`,
  wh: L.Vv,

  a: V.A,
  i: V.I,
  u: V.U,
  e: V.E,
  o: V.O,

  aa: V.Aa,
  ee: V.Ii,
  oo: V.Uu,
  ey: V.Ey,
  oa: V.Oa,

  ii: V.Ii,
  uu: V.Uu,
};

const isVowel: Record<string, boolean> = {
  a: true,
  i: true,
  u: true,
  e: true,
  o: true,
  // dhamaa
  aa: true,
  ee: true,
  oo: true,
  ey: true,
  oa: true,
  // extra dhamaa
  ii: true,
  uu: true,
};

const isVowelFunc = (text: string, index: number, dir: 1 | -1 = -1) => {
  return isVowel[text[index]] || isVowel[`${text[index + dir]}${text[index]}`];
};

const RTL_Q_MARK = "\u2E2E";
const RTL_MARK = "\u200F";

export const transliterate = (text: string): string => {
  let newText = "";

  for (let i = 0; i < text.length; i++) {
    // is double vowel
    if (isVowel[`${text[i - 1]}${text[i]}`]) {
      // TODO: consecutive vowels (generalizable to cover other vowels?)
      // eyey / eey - extremely specific but covering as commonly used
      if (
        `${text[i - 1]}${text[i]}` === "ey" &&
        (text[i - 2] === "e" || `${text[i - 3]}${text[i - 2]}` === "ey")
      ) {
        newText =
          newText.slice(0, text[i - 2] === "e" ? -1 : -3) +
          V.E +
          (text[i - 2] === "e" ? L.Al : L.Ya) +
          latinToDivChar[`${text[i - 1]}${text[i]}`];
      } else if (isVowel[`${text[i - 3]}${text[i - 2]}`]) {
        newText =
          newText.slice(0, -2) +
          L.Al +
          latinToDivChar[`${text[i - 1]}${text[i]}`];
      } else if (isVowel[text[i - 2]] || !latinToDivChar[text[i - 2]]) {
        if (["aii", "oii"].includes(`${text[i - 2]}${text[i - 1]}${text[i]}`)) {
          newText = newText.slice(0, -2) + L.Th + V.Sk;
        } else {
          newText =
            newText.slice(0, -2) +
            L.Al +
            latinToDivChar[`${text[i - 1]}${text[i]}`];
        }
      } else {
        newText =
          newText.slice(0, -1) + latinToDivChar[`${text[i - 1]}${text[i]}`];
      }
    }
    // is single vowel
    else if (isVowel[text[i]]) {
      if (isVowel[`${text[i - 2]}${text[i - 1]}`]) {
        newText += L.Al + latinToDivChar[text[i]];
      } else if (isVowel[text[i - 1]] || !latinToDivChar[text[i - 1]]) {
        newText += L.Al + latinToDivChar[text[i]];
      } else {
        newText += latinToDivChar[text[i]];
      }
    }
    // is double consonant
    else if (latinToDivChar[`${text[i - 1]}${text[i]}`]) {
      let char = latinToDivChar[`${text[i - 1]}${text[i]}`];

      // words don't start or end with a shaviyani
      // TODO: except shaviyani sukun, the word "shaviyani"
      if (
        `${text[i - 1]}${text[i]}` === "sh" &&
        (!latinToDivChar[text[i - 2]] || !latinToDivChar[text[i + 1]])
      ) {
        char = AL.Sh;
      }

      // sukun when ending with a consonant
      if (!isVowel[text[i + 1]] && isVowel[text[i - 2]]) {
        newText = newText.slice(0, -2) + char + V.Sk;
      } else {
        newText = newText.slice(0, isVowel[text[i - 2]] ? -2 : -1) + char;
      }
    }
    // is single consonant
    else if (latinToDivChar[text[i]]) {
      // noonu sukun
      if (
        text[i] === "n" &&
        isVowelFunc(text, i - 1) &&
        !isVowel[text[i + 1]]
      ) {
        newText += L.Nn + V.Sk;
      }
      // alifu sukun (h)
      else if (
        text[i] === "h" &&
        isVowel[text[i - 1]] &&
        !isVowel[text[i + 1]]
      ) {
        newText += L.Al + V.Sk;
      }
      // alifu sukun (double consonant)
      else if (
        text[i] !== "n" &&
        text[i] === text[i - 1] &&
        isVowel[text[i - 2]]
      ) {
        newText = newText.slice(0, -2) + L.Al + V.Sk + latinToDivChar[text[i]];
      }
      // y to ee if last char in word
      else if (
        text[i] === "y" &&
        !isVowel[text[i - 1]] &&
        latinToDivChar[text[i - 1]] &&
        !latinToDivChar[text[i + 1]]
      ) {
        newText = newText.slice(0, -1) + V.Ii;
      }
      // sukun when ending with a consonant
      else if (!isVowel[text[i + 1]] && isVowel[text[i - 1]]) {
        newText += latinToDivChar[text[i]] + V.Sk;
      }
      // the consonant
      else {
        newText += latinToDivChar[text[i]];
      }
    } else {
      newText += (text[i] === "?" ? RTL_Q_MARK : text[i]) + RTL_MARK;
    }
  }

  return newText;
};
