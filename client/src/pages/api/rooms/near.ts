import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/server";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 switch (req.method) {
  case "GET": {
   const { city } = req.query;

   const rooms = await prisma.room.findMany({
    where: {
     city: city as string,
    },
   });

   rooms && res.status(200).json(rooms);
   return;
  }

  default: {
   res.json({ error: "goodbye" });
   return;
  }
 }
}
