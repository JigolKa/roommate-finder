import { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "../../../lib/api.middleware";
import { Form } from "../../../lib/types";
import prisma from "../../../prisma/server";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 await runMiddleware(req, res);
 switch (req.method) {
  case "GET": {
   const { param, value } = req.query;
   if (param && value) {
    const rooms = await prisma.room.findMany({
     where: {
      [param as string]: value,
     },
    });

    res.json(rooms);
    return;
   }
   const rooms = await prisma.room.findMany();

   res.json(rooms);
   return;
  }

  case "POST": {
   const {
    country,
    address,
    city,
    occupied,
    capacity,
    housingType,
    languages,
    propertyType,
    features,
    securities,
    rentFrequency,
    price,
    accept,
    description,
    equipments,
    allowPhone,
    allowEmail,
    allowMessaging,
    allowLocation,
    attachments,
    userId,
   } = req.body;

   const requiredFields = [
    description,
    capacity,
    occupied,
    price,
    country,
    housingType,
    propertyType,
    languages,
   ];

   if (
    !description ||
    !capacity ||
    !occupied ||
    !price ||
    !country ||
    !housingType ||
    !propertyType ||
    !languages
   ) {
    res.status(400).json({
     error: "Missing required fields",
    });
    console.log(req.body, "error");

    return;
   }

   const room = await prisma.room.create({
    data: {
     city,
     country,
     address, //!
     description,
     capacity: typeof capacity === "number" ? capacity : parseInt(capacity),
     occupied: typeof occupied === "number" ? occupied : parseInt(occupied),
     price: typeof price === "number" ? price : parseInt(price),
     accept, //!
     equipments: equipments || [],
     attachments: attachments || [],

     housingType,
     hostLanguages: languages,
     propertyType,
     features: features || [],
     securities: securities || [],
     rentFrequency,

     allowPhone:
      typeof allowPhone === "boolean" ? allowPhone : JSON.parse(allowPhone),
     allowEmail:
      typeof allowEmail === "boolean" ? allowEmail : JSON.parse(allowEmail),

     allowMessaging:
      typeof allowMessaging === "boolean"
       ? allowMessaging
       : JSON.parse(allowMessaging),

     allowLocation:
      typeof allowLocation === "boolean"
       ? allowLocation
       : JSON.parse(allowLocation),

     rating: -1,
     user: {
      connect: {
       userId: userId,
      },
     },
    },
   });

   console.log(req.body);

   res.json(room);
   return;
  }
 }
}
