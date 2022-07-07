import { NextApiRequest, NextApiResponse } from "next";

export function runMiddleware(req: NextApiRequest, res: NextApiResponse) {
 res.setHeader("Access-Control-Allow-Origin", "*");
}
