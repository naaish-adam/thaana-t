import { AL, L, V } from "./alphabet";

const isVowel: { [key: string]: boolean } = {
  a: true,
  [V.A]: true,
  i: true,
  [V.I]: true,
  u: true,
  [V.U]: true,
  e: true,
  [V.E]: true,
  ey: true,
  [V.Ey]: true,
  o: true,
  [V.O]: true,
};

const latinToDivChar: { [key: string]: string } = {
  h: L.Ha,
  [`${AL.Sh}h`]: AL.Sh,
  sh: AL.Sh,
  n: L.Nn,
  r: L.Ra,
  b: L.Ba,
  [`${L.Lm}h`]: L.Lh,
  lh: L.Lh,
  k: L.Kf,
  v: L.Vv,
  w: L.Vv,
  m: L.Mm,
  f: L.Ff,
  dh: L.Dh,
  [`${L.Da}h`]: L.Dh,
  th: L.Th,
  [`${L.Ta}h`]: L.Th,
  l: L.Lm,
  g: L.Gf,
  [`${L.Gf}n`]: L.Gn,
  s: L.Sn,
  c: L.Kf,
  d: L.Da,
  z: L.Za,
  t: L.Ta,
  y: L.Ya,
  p: L.Pa,
  j: L.Ja,
  ch: L.Ch,

  kh: AL.Kh,
  hh: AL.Hh,
  q: AL.Qf,

  x: `${L.Kf}${V.Sk}${L.Sn}`,
  wh: L.Vv,

  [" a"]: ` ${L.Al}${V.A}`,
  [" aa"]: ` ${L.Al}${V.Aa}`,
  [" i"]: ` ${L.Al}${V.I}`,
  [" ii"]: ` ${L.Al}${V.Ii}`,
  [" ee"]: ` ${L.Al}${V.Ii}`,
  [" e"]: ` ${L.Al}${V.E}`,
  [" ey"]: ` ${L.Al}${V.Ey}`,
  [" u"]: ` ${L.Al}${V.U}`,
  [" oo"]: ` ${L.Al}${V.Uu}`,
  [" uu"]: ` ${L.Al}${V.Uu}`,
  [" o"]: ` ${L.Al}${V.O}`,
  [" oa"]: ` ${L.Al}${V.Oa}`,

  a: V.A,
  [`${V.A}a`]: V.Aa,
  aa: V.Aa,

  o: V.O,
  [`${V.O}a`]: V.Oa,
  oa: V.Oa,

  u: V.U,
  [`${V.U}o`]: V.Uu,
  oo: V.Uu,
  uu: V.Uu,

  e: V.E,
  [`${V.E}y`]: V.Ey,
  ey: V.Ey,

  i: V.I,
  [`${V.I}e`]: V.Ii,
  ee: V.Ii,
  [`${V.I}i`]: V.Ii,
  ii: V.Ii,
};

const RTL_Q_MARK = "\u2E2E";
const RTL_MARK = "\u200F";

export const transliterate = (word: string): string => {
  let newWord = "";
  let i = 0;

  // TODO: move into the exceptions below
  // include alifu if starting with vowels
  if (latinToDivChar[` ${word[0]}${word[1]}`]) {
    newWord += latinToDivChar[` ${word[0]}${word[1]}`];
    i += 2;
  } else if (latinToDivChar[` ${word[0]}`]) {
    newWord = latinToDivChar[` ${word[0]}`];
    i++;
  }

  for (; i < word.length; i++) {
    const thisNext = word[i] + word[i + 1] ?? "";

    const isVowelAfterEy = thisNext === "ey" && isVowel[word[i + 2]];
    if (latinToDivChar[thisNext] && !isVowelAfterEy) {
      if (thisNext === "ii" && word[i - 1] === "a" && latinToDivChar[i - 2])
        continue;

      // && latinToDivChar[i - 2]
      if (thisNext === "ey" && word[i - 1] === "o") continue;

      newWord += latinToDivChar[thisNext];

      i += thisNext.length - 1;
    } else {
      newWord +=
        latinToDivChar[word[i]] ??
        (word[i] === "?" ? RTL_Q_MARK : word[i]) + RTL_MARK;
    }

    // determine if its a sukun (with h, like rasheh, mageh etc)
    if (
      word[i] === "h" &&
      isVowel[word[i - 1]] &&
      !latinToDivChar[word[i + 1]]
    ) {
      // sh sukun
      if (word[i] === "h" && word[i - 1] === "a" && word[i - 2] === "r") {
        newWord = newWord.slice(0, -1) + L.Sh + V.Sk;
      }
      // al sukun
      else {
        newWord = newWord.slice(0, -1) + L.Al + V.Sk;
      }
    }
    // more sukun - support for th sukun (baii, kaiidha etc), sukun when double consonants (sappu, kakkaa)
    else if (
      (!isVowel[word[i]] ||
        (word[i - 1] === "i" &&
          word[i] === "i" &&
          isVowel[word[i - 2]] &&
          latinToDivChar[word[i - 3]])) &&
      !isVowel[word[i + 1]] &&
      latinToDivChar[word[i]] &&
      word[i] !== "y"
    ) {
      const hExceptions = ["s", "l", "d", "t", "k"];
      // sukun for double consonants
      if (
        (word[i + 1] === word[i] && word[i + 1] !== "n") ||
        word[i + 1] === "h" ||
        (word[i] === "h" && !hExceptions.includes(word[i - 1]))
      ) {
        newWord = newWord.slice(0, -1) + (word[i] === "m" ? L.Nn + V.Sk : L.Al);
      }
      // th sukun
      if (word[i] === "i") {
        newWord = newWord.slice(0, -1) + L.Th + V.Sk;
      } else if (word[i] === "h" && word[i - 1] === "h") {
        newWord = newWord.slice(0, -1) + AL.Hh + V.Sk;
      } else {
        newWord += V.Sk;
      }
    }
    // for situations like mai, kai, etc. vowel with alifu. a i u ba bi bu
    else if (
      (isVowel[word[i]] || (word[i] === "y" && !latinToDivChar[word[i - 2]])) &&
      (isVowel[word[i - 1]] || isVowel[`${word[i - 2]}${word[i - 1]}`]) &&
      word[i] !== word[i - 1] &&
      !(word[i - 1] === "o" && word[i] === "a")
      // &&
      // word[i - 1] !== "y" // this is for that "y" case
    ) {
      const extra = word[i] === "y" && isVowel[word[i - 1]] ? word[i - 1] : "";
      newWord =
        newWord.slice(0, extra ? -3 : -1) +
        (latinToDivChar[` ${extra}${word[i]}`] ?? "").trimStart();
    }
    // "y" at the end as "ee"
    else if (
      word[i] === "y" &&
      !isVowel[word[i - 1]] &&
      latinToDivChar[word[i - 1]]
    ) {
      newWord = newWord.slice(0, -2) + V.Ii;
    }
  }

  return RTL_MARK + newWord;
};
