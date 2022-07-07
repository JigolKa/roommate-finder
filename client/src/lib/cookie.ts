import { serialize, parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { isEmpty } from "./functions";

export const MAX_AGE = 60 * 60 * 8; // 8 hours

export function setCookie(res: NextApiResponse, value: string, name: string) {
 const cookie = serialize(name, value, {
  maxAge: MAX_AGE,
  expires: new Date(Date.now() + MAX_AGE * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
 });

 res.setHeader("Set-Cookie", cookie);
}

export function removeCookie(res: NextApiResponse, name: string) {
 const cookie = serialize(name, "", {
  maxAge: -1,
  path: "/",
 });

 res.setHeader("Set-Cookie", cookie);
}

export function parseCookies(req: NextApiRequest) {
 // For API Routes we don't need to parse the cookies.
 if (req.cookies) return req.cookies;

 // For pages we do need to parse the cookies.
 const cookie = req.headers?.cookie;
 return parse(cookie || "");
}

export function getCookie(req: any, name: string, parse: number) {
 const cookies = parseCookies(req);

 console.log(cookies, 1);

 if (isEmpty(cookies)) return;

 console.log(cookies, 2);

 if (parse === 1) return JSON.parse(cookies[name]);
 return cookies[name];
}
