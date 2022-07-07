import { Container, createStyles } from "@mantine/core";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Comment, Room, User } from "../lib/types";
import data from "../../data/isoToName.json";
import Link from "next/link";
import { toSlug } from "../lib/functions";
import { AiFillHeart, AiFillStar, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { BiRightArrowAlt, BiLeftArrowAlt } from "react-icons/bi";
import axios from "axios";
import { ImageComponent } from "./ImageComponent";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
 room: Room | null;
 h?: boolean;
 city?: string;
 dead?: any;
}

const useStyles = createStyles((theme) => ({
 container: {
  display: "flex",
  gap: 2.5,
  flexDirection: "column",
  minWidth: "100%",
  maxWidth: "100%",
  // border: "1px solid rgba(0,0,0,.3)",
  borderRadius: theme.radius.sm,
 },
 heading: {
  letterSpacing: 1,
  width: "min-content",
 },
 location: {
  display: "block",
  fontSize: 15,
  fontWeight: 600,
 },
 column: {
  minWidth: "min-content",
  maxWidth: "max-content",
  display: "flex",
  flexDirection: "column",
 },
 title: {
  marginTop: 2.5,
 },
 item: {
  maxWidth: "max-content",
 },
 rating: {
  display: "flex",
  alignItems: "center",
  width: "max-content",
  alignSelf: "end",
 },
}));

export function Result({ room, h, city, dead }: Props) {
 const { classes, cx } = useStyles();

 const [_room, _setRoom] = useState<Room>();

 useEffect(() => {
  if (!h) return;
  axios
   .get("http://localhost:3000/api/rooms/near?city=" + city)
   .then((res) => _setRoom(res.data));
 }, []);

 const style = {};

 if (room) {
  return (
   <Link href={`/room/${room.roomId}`}>
    <a>
     <div className={classes.container}>
      <div style={{ position: "relative", width: "100%" }}>
       <ImageComponent room={room} />
      </div>
      <div
       style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 2,
       }}
      >
       <div className={classes.column}>
        <span className={cx(classes.location, classes.item)}>
         {room.city}, {(data as any)[room.country]}
        </span>
        <span>
         <span className={classes.item} style={{ fontWeight: 600 }}>
          {room.price}$
         </span>{" "}
         {room.rentFrequency.toLowerCase()}
        </span>
       </div>
       <div className={classes.column}>
        <span className={classes.rating}>
         {room.rating === -1 ? (
          <span>No reviews</span>
         ) : (
          <span>
           {room.rating} <AiFillStar />
          </span>
         )}
        </span>
       </div>
      </div>
     </div>
    </a>
   </Link>
  );
 }

 // dead();
 return null;
}
