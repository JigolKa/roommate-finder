import { NextApiRequest, NextApiResponse } from "next";
import { randomToken } from "../../../lib/functions";
import prisma from "../../../prisma/server";
import bcrypt from "bcrypt";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 switch (req.method) {
  case "GET": {
   const users = await prisma.user.findMany();

   res.json(users);
   return;
  }

  case "DELETE": {
   const users = await prisma.user.deleteMany();
   res.status(200).json(users);
   return;
  }

  case "POST": {
   res.setHeader("Access-Control-Allow-Origin", "*");

   const {
    firstName,
    lastName,
    email,
    password,
    phone,
    username,
    avatar,
    bio,
    banner,
    birthDate,
   } = req.body;

   if (!firstName || !email || !password || !username) {
    res.status(400).json({
     error: "Missing required fields",
    });

    return;
   }

   const verif = await prisma.user.findFirst({
    where: {
     email: email,
    },
   });

   if (verif !== null || verif)
    return res.status(400).json({ error: "user already exists" });

   const pwd = await bcrypt.hash(password, 10);

   const user = await prisma.user.create({
    data: {
     firstName,
     lastName: lastName || null,
     email,
     password: pwd,
     phone: phone || null,
     username,
     avatar: avatar || null,
     bio: bio || null,
     banner: banner || null,
     birthDate: birthDate || null,
     token: randomToken(64),
    },
   });

   res.status(200).json(user);
   //TODO: don't send full user
   return;
  }
 }
}
