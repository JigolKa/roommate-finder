import React from "react";

export interface User {
 userId: string;
 firstName: string;
 lastName?: string;
 email: string;
 phone?: string;
 username: string;
 nickname?: string;
 password: string;
 birthDate?: DateTime;
 website?: string;
 createdAt: DateTime;
 avatar?: string;
 banner?: string;
 bio?: string;
 isAdmin: boolean;
 isActive: boolean;
 isDeleted: boolean;
 localisation?: string;
 rooms: Room[];
}

export type RentFrequency = "Daily" | "Weekly" | "Monthly" | "Yearly";

export type PropertyType = "House" | "Apartement";

export type HousingType = "Shared room" | "Private room";
export type FeaturesType =
 | "Pool"
 | "Parking lot"
 | "Jacuzzi"
 | "Baby bed"
 | "Barbecue"
 | "Charging station for electric vehicles"
 | "Smoking accommodation"
 | "Garden";

export type SecuritiesType = "Smoke detector" | "Carbon monoxide detector";

export type EquipmentsType =
 | "Wi-Fi"
 | "Washing machine"
 | "Air conditioner"
 | "Dryer"
 | "Kitchen"
 | "Ironing board"
 | "Television"
 | "Hair dryer"
 | "Heating"
 | "Dedicated work space";

export type HostLanguages =
 | "English"
 | "French"
 | "German"
 | "Italian"
 | "Spanish"
 | "Arabic"
 | "Portuguese"
 | "Indoniesian"
 | "Thai"
 | "Polish"
 | "Tagalog"
 | "Swedish"
 | "Finnish"
 | "Hungarian"
 | "Japanese"
 | "Chinese (simplified)"
 | "Hindi"
 | "Turkish"
 | "Dutch"
 | "Greek"
 | "Malay"
 | "Danish"
 | "Norwegian"
 | "Czech"
 | "Russian";

export type Nullable<T> = T | T[] | null;

export class Form {
 city: string;
 address: string;
 country: string;
 capacity: number;
 occupied: number;
 price: number;
 propertyType: PropertyType;
 housingType: HousingType | HousingTypeForm;
 rentFrequency: RentFrequency;
 securities: Nullable<SecuritiesType>;
 features: Nullable<FeaturesType>;
 equipments: Nullable<EquipmentsType>;
 hostLanguages: Nullable<HostLanguages>;
 allowPhone: boolean;
 allowEmail: boolean;
 allowMessaging: boolean;
 allowLocation: boolean;
 accept: number[];
 attachments: string[];
 description: string;
 userId: string;
}

export interface Room {
 roomId: string;
 city: string;
 address: string;
 country: string;
 capacity: number;
 occupied: number;
 price: number;
 propertyType: PropertyType;
 housingType: HousingType;
 rentFrequency: RentFrequency;
 securities: Nullable<SecuritiesType>;
 features: Nullable<FeaturesType>;
 equipments: Nullable<EquipmentsType>;
 hostLanguages: Nullable<HostLanguages>;
 accept: number[];
 comments: Comment[];
 attachments: string[];
 description: string;
 allowPhone: boolean;
 allowEmail: boolean;
 allowMessaging: boolean;
 allowLocation: boolean;
 rating: number;
 createdAt: time;
 isDeleted: boolean;
 user: User;
 userId: string;
}

export interface Comment {
 commentId: string;
 userId: string;
 roomId?: string;
 content: string;
 rating: number;
 createdAt: string;
 room?: Room;
}

export interface IpResponse {
 ipVersion: number;
 ipAddress: number;
 latitude: number;
 longitude: number;
 countryName: string;
 countryCode: string;
 timeZone: string;
 zipCode: string;
 cityName: string;
 regionName: string;
}

export type Coordinates = [number, number];

export interface TrendingCountries {
 country: string;
 popularity: number;
}

export interface NearestCitiesResult {
 cities: {
  id: string;
  name: string;
  asciiname: string;
  alternativeNames?: string[];
  lat: number;
  lon: number;
  featureClass: string;
  featureCode: string;
  country: string;
  altCountry: string;
  adminCode: string;
  countrySubdivision: string;
  municipality: string;
  municipalitySubdivision: string;
  population: number;
  dem: string;
  tz: string;
  lastModified: string;
  distance: number;
 }[];
}

export interface NearCity {
 id: string;
 name: string;
 asciiname: string;
 alternativeNames?: string[];
 lat: number;
 lon: number;
 featureClass: string;
 featureCode: string;
 country: string;
 altCountry: string;
 adminCode: string;
 countrySubdivision: string;
 municipality: string;
 municipalitySubdivision: string;
 population: number;
 dem: string;
 tz: string;
 lastModified: string;
 distance: number;
}

export interface Icon extends React.ComponentPropsWithoutRef<"img"> {
 size: number;
}
