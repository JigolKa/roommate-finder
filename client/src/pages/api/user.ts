import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/server";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 switch (req.method) {
  case "GET": {
   const { id } = req.query;

   if (!id) return res.status(400).json({ error: "no id provided" });

   const user = await prisma.user.findFirst({
    where: {
     userId: id as string,
    },
    select: {
     firstName: true,
     lastName: true,
     avatar: true,
     userId: true,
     username: true,
     banner: true,
    },
   });

   res.status(200).json(user);
   return;
  }

  case "DELETE": {
   const { id } = req.query;

   if (!id) return res.status(400).json({ error: "no id provided" });

   const rooms = await prisma.room.deleteMany({
    where: {
     userId: id as string,
    },
   });

   const user = await prisma.user.delete({
    where: {
     userId: id as string,
    },
   });

   res.status(200).json({ user, rooms });
   return;
  }
 }
}
