import { User } from "./types";

export class StringClass extends String {
 str;
 constructor(str: string) {
  super(str);
  this.str = str;
 }

 capitalize(s: string = this.str): string {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
 }
}

export class ArrayClass extends Array {
 arr: Array<any>;
 constructor(arr: Array<any>) {
  super();
  this.arr = arr;
 }

 shuffle(array: Array<any> = this.arr): Array<any> | undefined {
  if (!array) return;
  let j, x, i;
  for (i = array.length - 1; i > 0; i--) {
   j = Math.floor(Math.random() * (i + 1));
   x = array[i];
   array[i] = array[j];
   array[j] = x;
  }
  return array;
 }

 takeByLimit(
  array: Array<any> = this.arr,
  limit: number
 ): Array<any> | undefined {
  if (!array) return;
  return array.slice(0, limit);
 }
}

export const takeByLimit = (
 array: Array<any>,
 limit: number
): Array<any> | undefined => {
 if (!array) return;
 return array.slice(0, limit);
};
