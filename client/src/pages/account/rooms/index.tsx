import { Container } from "@mantine/core";
import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Grid } from "../../../components/Grid";
import { Result } from "../../../components/Result";
import { Room, User } from "../../../lib/types";

interface Props {
 rooms: string;
}

const Rooms: NextPage<Props> = ({ rooms }: Props) => {
 const _rooms = JSON.parse(rooms || "{}") as Room[];
 const router = useRouter();

 useEffect(() => {
  if (!localStorage.getItem("user")) {
   router.push("/login");
  }
 }, []);

 return (
  <Container size={1120}>
   {_rooms && _rooms.length > 0 ? (
    <>
     <h1>Your flatshares</h1>
     <Grid>
      {_rooms.map((room, i) => (
       <Result account key={i} room={room} />
      ))}
     </Grid>
    </>
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
 );
};

export default Rooms;

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const _ = JSON.parse(context.req.cookies["user"] || "{}") as User;

 if (!_) {
  return {
   props: {
    rooms: "{}",
   },
  };
 }

 const rooms = await prisma.room.findMany({
  where: {
   userId: _.userId,
  },
 });

 return {
  props: {
   rooms: JSON.stringify(rooms),
  },
 };
}
