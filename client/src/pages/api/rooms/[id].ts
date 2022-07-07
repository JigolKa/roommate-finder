import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/server";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 const { id } = req.query;

 switch (req.method) {
  case "GET": {
   if (!id) {
    res.status(400).json({
     error: "Missing id",
    });
    return;
   }
   const room = await prisma.room.findFirst({
    where: {
     roomId: id as string,
    },
   });
   res.status(200).json(room);
   res.end();
   return;
  }

  case "DELETE": {
   if (!id) {
    res.status(400).json({
     error: "Missing id",
    });
    return;
   }

   if ((id as string) === "*") {
    const rooms = await prisma.room.deleteMany();

    res.status(200).json(rooms);
    return;
   }
   const room = await prisma.room.delete({
    where: {
     roomId: id as string,
    },
   });
   res.status(200).json(room);
   res.end();
   return;
  }
 }
}
