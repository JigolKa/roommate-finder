import React from "react";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/server";
import { useRouter } from "next/router";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 const { id } = req.query;

 if (!id) {
  return res.status(400).json({
   error: "Missing id",
  });
 }

 switch (req.method) {
  case "GET": {
   const user = await prisma.user.findFirst({
    where: {
     userId: id as string,
    },
   });
   res.status(200).json(user);
   res.end();
   return;
  }

  case "DELETE": {
   if ((id as string) === "*") {
    const rooms = await prisma.user.deleteMany();

    res.status(200).json(rooms);
    return;
   }
   const user = await prisma.user.delete({
    where: {
     userId: id as string,
    },
   });
   res.status(200).json(user);
   res.end();
   return;
  }

  case "PATCH": {
   const array: any = {};
   console.log(req.body);

   for (let i = 0; i < Object.keys(req.body).length; i++) {
    const key = Object.keys(req.body)[i];
    const value = req.body[key];

    if (key === "confirmPassword") continue;
    if (!value) continue;
    Object.assign(array, { [key]: value });
   }

   const user = await prisma.user.update({
    where: {
     userId: id as string,
    },
    data: array,
   });

   return res.json(user);
  }
 }
}
