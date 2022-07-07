import { Container, createStyles } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Location } from "./Location";
import { IpResponse, NearCity, NearestCitiesResult } from "../lib/types";
import { getNearestCities, sortCities } from "../lib/geo.functions";

const useStyles = createStyles((theme) => ({
 wrapper: {
  display: "flex",
  flexWrap: "nowrap",
  overflowY: "hidden",
  whiteSpace: "nowrap",
  marginTop: 15,
  height: 340,
  gap: 20,

  "::-webkit-scrollbar-track": {
   boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
   borderRadius: 10,
   backgroundColor: "#F5F5F5",
  },

  "::-webkit-scrollbar": {
   width: 12,
   height: 10,
   backgroundColor: "#F5F5F5",
  },

  "::-webkit-scrollbar-thumb": {
   borderRadius: 10,
   backgroundColor: "#55555571",
  },
 },
}));

interface Props {
 ip: IpResponse | null;
}

export function InYourArea({ ip }: Props) {
 const { classes } = useStyles();

 const [ipObject, setIpObject] = useState<IpResponse | null>(ip);
 const [cities, setCities] = useState<NearestCitiesResult>();

 useEffect(() => {
  setIpObject(JSON.parse(localStorage.getItem("ip") ?? "{}"));

  const longitude = ipObject ? ipObject.longitude : 2.311322;
  const latitude = ipObject ? ipObject.latitude : 48.889931;

  getNearestCities(latitude, longitude, 150000).then((res) => {
   setCities(res), console.log(res);
  });
 }, []);

 useEffect(() => {
  console.log(cities);
 }, [cities]);

 return (
  <Container size={1120} mt={10}>
   {cities?.cities && (
    <>
     <h1>In your area</h1>
     <div className={classes.wrapper}>
      {sortCities(cities, 75000).cities.map((city: NearCity, index: number) => (
       <Location key={index} location={city.name} />
      ))}
     </div>
    </>
   )}
  </Container>
 );
}
