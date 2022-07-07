import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/server";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 switch (req.method) {
  case "GET": {
   const { c, id } = req.query;

   if (!c) return res.status(400).json({ error: "no country provided" });

   const rooms = await prisma.room.findMany({
    where: {
     country: (c as string).toUpperCase(),
     NOT: {
      roomId: id as string,
     },
    },
   });

   res.status(200).json(rooms);
   return;
  }
 }
}
