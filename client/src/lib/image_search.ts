import axios from "axios";

export async function imageSearch(term: string, limit = 1) {
 const response = await axios.get(
  `http://localhost:5000/images/${term}?limit=${limit}`
 );

 return response;
}
