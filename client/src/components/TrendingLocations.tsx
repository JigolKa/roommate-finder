import { Container, createStyles } from "@mantine/core";
import React, { useEffect } from "react";
import { runCallback } from "../lib/callback";
import { TrendingCountries } from "../lib/types";
import { Location } from "./Location";

const useStyles = createStyles((theme) => ({
 root: {},
 wrapper: {
  display: "flex",
  flexWrap: "nowrap",
  overflowY: "hidden",
  whiteSpace: "nowrap",
  marginTop: 15,
  maxHeight: 340,
  paddingBottom: 20,
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
 countries: TrendingCountries[];
}

export function TrendingLocations({ countries }: Props) {
 const { classes } = useStyles();

 useEffect(() => console.log(countries), [countries]);

 if (countries && countries.length > 0) {
  return (
   <Container size={1120} className={classes.root}>
    <h1>Trending locations</h1>
    {countries && (
     <div className={classes.wrapper}>
      {countries.map((c, i) => (
       <Location no c key={i} location={c.country} />
      ))}
     </div>
    )}
   </Container>
  );
 }

 return null;
}
