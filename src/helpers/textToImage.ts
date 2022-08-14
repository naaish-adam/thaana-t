import path from "path";
import { generate } from "text-to-image";

export type AlignValues = "left" | "center" | "right";

interface GenerateOptions {
  bgColor?: string;
  customHeight?: number;
  bubbleTail?: {
    width: number;
    height: number;
  };
  debug?: boolean;
  debugFilename?: string;
  fontFamily?: string;
  fontPath?: string;
  fontSize?: number;
  fontWeight?: string | number;
  lineHeight?: number;
  margin?: number;
  maxWidth?: number;
  textAlign?: AlignValues;
  textColor?: string;
  verticalAlign?: string;
}

export const alignOpts = ["center", "right", "left"];
export const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "black",
  "white",
];

export const textToImage = async (text: string, options?: GenerateOptions) => {
  // const maxWidth = Math.min(text.length * 10, 400);
  const opts = {
    bgColor: "black",
    textColor: "white",
    fontWeight: "bold",
    maxWidth: 400,
    fontPath: path.join(__dirname, "../fonts", "mv-typewriter-bold.ttf"),
    textAlign: "center",
    ...options,
  };
  return await generate(text, opts);
};
