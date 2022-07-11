import axios from "axios";
import config from "../../config";

export async function imageSearch(term: string, limit = 1) {
 const response = await axios.get(
  `${config.server}/images/${term}?limit=${limit}`
 );

 return response;
}
