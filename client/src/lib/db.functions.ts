import prisma from "../prisma/server";
import { getCountry } from "./geo.functions";
import { TrendingCountries } from "./types";
import bcrypt from "bcrypt";

export async function getTrendingCountries() {
 const rooms = await prisma.room.findMany();

 let count: TrendingCountries[] = [];

 rooms.map((room) => {
  const name = getCountry(room.country)!.name.common;

  var element = count.find(function (e) {
   return e.country === name;
  });

  if (!element) {
   count.push({ country: name, popularity: 0 });
   element = { country: name, popularity: 0 };
  }

  if (element.popularity == null || element.popularity == undefined) {
   element.popularity = 1;
  } else {
   element.popularity += 1;
  }
 });

 console.log(count);

 return count;
}

export async function hash(str: string) {
 var hash: string = "";

 bcrypt.genSalt(10, function (err, salt) {
  if (err) return err;
  bcrypt.hash(str, salt, function (err, _hash) {
   if (err) return err;

   return (hash = _hash);
  });
 });

 return hash;
}
