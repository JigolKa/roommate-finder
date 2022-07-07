import { MantineTheme } from "@mantine/core";

export function toSlug(str: string): string {
 str = str.replace(/^\s+|\s+$/g, ""); // trim
 str = str.toLowerCase();

 // remove accents, swap ñ for n, etc
 const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
 const to = "aaaaeeeeiiiioooouuuunc------";
 for (let i = 0, l = from.length; i < l; i++) {
  str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
 }

 str = str
  .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
  .replace(/\s+/g, "-") // collapse whitespace and replace by -
  .replace(/-+/g, "-"); // collapse dashes

 return str;
}

export const isFloat = (n: number) => Number(n) === n && n % 1 !== 0;

export function isEmpty<T>(arr: Array<T> | Record<string, unknown>) {
 if (arr instanceof Array) {
  return arr.length === 0;
 }

 if (arr instanceof Object) {
  return Object.entries(arr).length === 0;
 }
}

export function capitalize(s: string): string {
 if (typeof s !== "string") return "";
 return s.charAt(0).toUpperCase() + s.slice(1);
}

export function randomToken(l: number): string {
 const chars = [
  "a",
  "z",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "m",
  "l",
  "k",
  "j",
  "h",
  "g",
  "f",
  "d",
  "s",
  "q",
  "w",
  "x",
  "c",
  "v",
  "b",
  "n",
  "A",
  "Z",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "M",
  "L",
  "K",
  "J",
  "H",
  "G",
  "F",
  "D",
  "S",
  "Q",
  "W",
  "X",
  "C",
  "V",
  "B",
  "N",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "&",
  "_",
  "@",
 ];

 let token = "";

 new Array(l).fill(null).map(() => {
  const char = chars[Math.floor(Math.random() * chars.length)];
  token += char;
 });

 return token;
}

export const notificationTheme = (status: number) => {
 switch (status) {
  case 200: {
   return (theme: MantineTheme) => ({
    root: {
     background: theme.fn.linearGradient(
      45,
      theme.colors.blue[8],
      theme.colors.blue[6]
     ),
     borderColor: theme.colors.blue[6],

     "&::before": { backgroundColor: theme.white },
    },

    title: { color: theme.white },
    description: { color: theme.white },
    closeButton: {
     color: theme.white,
     "&:hover": { backgroundColor: theme.colors.blue[7] },
    },
   });
  }

  default: {
   return (theme: MantineTheme) => ({
    root: {
     background: "#AF0606",
     borderColor: theme.colors.red[9],
     borderStyle: "dashed",

     "&::before": { backgroundColor: theme.white },
    },

    title: { color: theme.white },
    description: { color: theme.white },
    closeButton: {
     color: theme.white,
     "&:hover": { backgroundColor: theme.colors.blue[7] },
    },
   });
  }
 }
};
