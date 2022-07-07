import axios from "axios";
import countries from "world-countries";
import { NearCity, NearestCitiesResult } from "./types";
import prisma from "../prisma/server";

export function getCountry(iso2: string) {
 if (!iso2) {
  return undefined;
 }

 iso2 = iso2.trim().toUpperCase();

 return countries.find(function (country) {
  return country.cca2 === iso2;
 });
}

export async function getNearestCities(
 lat: number,
 lng: number,
 dist: number = 50000,
 max: number = 50
): Promise<NearestCitiesResult> {
 const response = await axios.get(
  `http://localhost:5002/api/city?lat=${lat}&lng=${lng}&dist=${dist}&max=${max}`
 );

 return response.data;
}

export function sortCities(
 { cities }: NearestCitiesResult,
 limit: number = 75000
): NearestCitiesResult {
 let sortedArray: NearCity[] = [];
 let _array: any[] = [];

 for (let i = 0; i < cities.length; i++) {
  const city = cities[i];

  if (city.population > limit) sortedArray.push(city);
 }

 return {
  cities: sortedArray,
 };
}
