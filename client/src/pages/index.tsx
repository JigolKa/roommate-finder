import type { NextPage } from "next";
import Head from "next/head";
import { InYourArea } from "../components/InYourArea";
import { useEffect, useState } from "react";
import { IpResponse, Room, TrendingCountries } from "../lib/types";
import { TrendingLocations } from "../components/TrendingLocations";
import { getTrendingCountries } from "../lib/db.functions";
import { Container, createStyles } from "@mantine/core";
import prisma from "../prisma/server";
import { Result } from "../components/Result";
import Link from "next/link";

interface Props {
 countries: TrendingCountries[];
 rooms: string;
}

const useStyles = createStyles(() => ({
 grid: {
  display: "grid",
  gridTemplateColumns: "auto auto",
  flexDirection: "column",
  gap: 15,
  marginTop: 10,
 },
}));

const Home: NextPage<Props> = ({ countries, rooms }: Props) => {
 const [ip, setIp] = useState<IpResponse>();
 const { classes } = useStyles();
 const _rooms = JSON.parse(rooms) as Room[];

 useEffect(() => {
  setIp(JSON.parse(localStorage.getItem("ip") || "{}"));
 }, []);

 return (
  <>
   <Head>
    <title>Find your perfect flatshare around the globe!</title>
   </Head>
   <TrendingLocations countries={countries} />
   <InYourArea ip={ip || null} />
   <Container size={1120} mt={20}>
    <h1>Flatshares</h1>
    {_rooms && _rooms.length > 0 ? (
     <div className={classes.grid}>
      {_rooms.map((room, i) => (
       <Result key={i} room={room} />
      ))}
     </div>
    ) : (
     <>
      <h3 style={{ marginTop: 10 }}>No flatshares for the moment!</h3>
      <span style={{ marginTop: 5, display: "block", fontWeight: 600 }}>
       You can start by{" "}
       <Link href="/create">
        <a style={{ color: "rgb(24, 100, 171)", textDecoration: "underline" }}>
         create one
        </a>
       </Link>
      </span>
     </>
    )}
   </Container>
  </>
 );
};

export default Home;

export async function getServerSideProps() {
 const countries = await getTrendingCountries();
 const rooms = await prisma.room.findMany({
  take: 15,
  orderBy: {
   createdAt: "desc",
  },
 });

 return {
  props: {
   countries,
   rooms: JSON.stringify(rooms),
  },
 };
}
