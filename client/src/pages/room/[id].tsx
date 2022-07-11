import { Container, createStyles } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { ImageComponent } from "../../components/ImageComponent";
import { Room, User } from "../../lib/types";
import prisma from "../../prisma/server";
import data from "../../../data/isoToName.json";
import { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "../../components/Grid";
import { Result } from "../../components/Result";
import Head from "next/head";
import { Description } from "../../components/Description";
import { isEmpty } from "../../lib/functions";
import Link from "next/link";
import { AiFillEdit } from "react-icons/ai";

interface Props {
 room: string;
}

const useStyles = createStyles(() => ({
 wrapper: {
  width: "100%",
  paddingBlockEnd: 15,
  display: "flex",
 },

 price: {
  marginTop: 25,
 },

 description: {
  width: "90%",
  display: "-webkit-box",
  WebkitLineClamp: 10,
  WebkitBoxOrient: "vertical",
  position: "relative",
 },

 column: {
  display: "flex",
  flexDirection: "column",
  marginLeft: 15,
  width: "50%",
  position: "relative",
 },

 about: {},

 edit: {
  fontSize: 18,

  span: {
   color: "blue",
   textDecoration: "underline",
  },
 },

 title: {
  marginTop: -5,
  marginBottom: 15,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
 },
}));

export default function RoomPage({ room }: Props) {
 const _room = JSON.parse(room) as Room;
 const { classes } = useStyles();
 const [rooms, setRooms] = useState<Room[]>();
 const [user, setUser] = useState<User>();
 const [_user, _setUser] = useState<User>();

 useEffect(() => {
  axios
   .get(
    `http://localhost:3000/api/rooms/country?c=${_room.country}&id=${_room.roomId}`
   )
   .then((res) => setRooms(res.data));

  axios
   .get(`http://localhost:3000/api/user?id=${_room.userId}`)
   .then((res) => setUser(res.data));

  _setUser(JSON.parse(localStorage.getItem("user") || "{}"));
 }, []);

 const country = (data as any)[_room.country];

 return (
  <>
   <Head>
    <title>
     {_room.city}, {country} - Roommate Finder
    </title>
   </Head>
   <Container size={1120}>
    <div className={classes.wrapper}>
     <div
      style={{ position: "relative", width: "100%", justifyContent: "center" }}
     >
      <div className={classes.title}>
       <h1>
        {_room.city}, {country}
       </h1>

       {_user && _room.userId === _user.userId && (
        <Link href={`/account/room/${_room.roomId}`}>
         <a>
          <AiFillEdit size={28} />
         </a>
        </Link>
       )}
      </div>
      <ImageComponent
       room={_room}
       variant={
        _room.attachments && _room.attachments.length > 1 ? "description" : null
       }
      />
     </div>
    </div>

    <Description room={_room} user={user} />

    <div style={{ marginTop: 25 }}>
     <h2>Related flatshares</h2>
     {!isEmpty(rooms as any) ? (
      <Grid>
       {rooms && rooms.map((room, i) => <Result key={i} room={room} />)}
      </Grid>
     ) : (
      <h4 style={{ marginTop: 5 }}>No related flatshares in your area</h4>
     )}
    </div>
   </Container>
  </>
 );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const room = await prisma.room.findFirst({
  where: {
   roomId: context.query.id as string,
  },
 });

 return {
  props: {
   room: JSON.stringify(room),
  },
 };
}
