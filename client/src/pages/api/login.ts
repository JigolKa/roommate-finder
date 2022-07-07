import { NextApiRequest, NextApiResponse } from "next";
import config from "../../../config";
import Encryption from "../../lib/encryption";
import prisma from "../../prisma/server";
import bcrypt from "bcrypt";

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 if (req.method !== "POST")
  return res.status(405).json({ error: "method not allowed" });

 const { password, email } = req.body;

 if (!email) return res.status(400).json({ error: "no email provided" });
 if (!password) return res.status(400).json({ error: "no password provided" });

 const encryption = new Encryption();
 const nonceValue = config.nonceValue;

 const eml = encryption.decrypt(email, nonceValue);
 const pwd = encryption.decrypt(password, nonceValue);

 const user = await prisma.user.findFirst({
  where: {
   email: eml as string,
  },
 });

 if (!user) return res.status(404).json({ error: "no user found" });

 const verif = await bcrypt.compare(pwd, user.password);
 console.log(verif);
 if (!verif)
  return res.status(403).json({ error: "no user found with this password" });

 res.status(200).json(user);
}
