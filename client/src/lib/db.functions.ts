import prisma from "../prisma/server";
import { getCountry } from "./geo.functions";
import { TrendingCountries } from "./types";
import bcrypt from "bcrypt";

export async function getTrendingCountries() {
 const rooms = await prisma.room.findMany();

 const count: TrendingCountries[] = [];

 rooms.map((room) => {
  const country_ = getCountry(room.country);
  const name = country_ ? country_.name.common : "Rest";

  let element = count.find(function (e) {
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

 return count;
}

export async function hash(str: string) {
 let hash = "";

 bcrypt.genSalt(10, function (err, salt) {
  if (err) return err;
  bcrypt.hash(str, salt, function (err, _hash) {
   if (err) return err;

   return (hash = _hash);
  });
 });

 return hash;
}
