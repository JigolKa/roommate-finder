import { createStyles, Grid } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { GridDots } from "tabler-icons-react";
import { Room } from "../lib/types";
import { Gallery } from "./Gallery";

interface Props {
 room: Room;
 variant?: "description" | null;
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
  minWidth: "45%",
  maxWidth: "50%",
  display: "flex",
  flexDirection: "column",
 },
 image: {
  borderRadius: theme.radius.sm,
  objectFit: "cover",
 },
 title: {
  marginTop: 2.5,
 },
 item: {
  maxWidth: "max-content",
 },
 heart: {
  position: "absolute",
  left: 10,
  top: 10,
 },
 rating: {
  display: "flex",
  alignItems: "center",
  width: "max-content",
  alignSelf: "end",
 },
 save: {
  position: "absolute",
  right: 10,
  top: 10,
 },
 arrowRight: {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 40,
  cursor: "context-menu",
 },
 arrowLeft: {
  position: "absolute",
  left: 10,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 40,
  cursor: "context-menu",
 },
 imageContainer: {
  width: "100%",
  position: "relative",
  justifyContent: "space-between",
 },
 showMore: {
  position: "absolute",
  top: 15,
  right: 20,
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: "4px 8px",
  backgroundColor: theme.colors.dark[7],
  color: "#fff",
  fontSize: 14,
  borderRadius: 4,
  lineHeight: 0.6,
  cursor: "pointer",
 },

 gallery: {
  width: "100vw",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 99999999,
  overflow: "hidden",
  backgroundColor: theme.colors.dark[4],
 },
}));

export function ImageE({ room }: { room: Room }) {
 const [fav, setFav] = useState(false);
 const [save, setSave] = useState(false);
 const { classes } = useStyles();

 const [currentAttachment, setCurrentAttachment] = useState(
  room && room.attachments && 0
 );

 const setToFav = (e: React.MouseEvent<SVGElement>) => {
  e.preventDefault();
  fav ? setFav(false) : setFav(true);
 };
 const setToSaved = (e: React.MouseEvent<SVGElement>) => {
  e.preventDefault();
  save ? setSave(false) : setSave(true);
 };
 return (
  <>
   <Image
    className={classes.image}
    src={room.attachments[currentAttachment]}
    layout="responsive"
    width={"100%"}
    height={"80%"}
    quality={20}
    style={{ userSelect: "none" }}
    priority
    alt={""}
   />
   {fav ? (
    <AiFillHeart size={24} className={classes.heart} onClick={setToFav} />
   ) : (
    <AiOutlineHeart size={24} className={classes.heart} onClick={setToFav} />
   )}
   {save ? (
    <BsBookmarkFill size={24} className={classes.save} onClick={setToSaved} />
   ) : (
    <BsBookmark size={24} className={classes.save} onClick={setToSaved} />
   )}
   {room.attachments.length > 1 && currentAttachment === 0 && (
    <BiRightArrowAlt
     className={classes.arrowRight}
     onClick={(e) => {
      e.preventDefault();
      setCurrentAttachment((prev) => (prev += 1));
     }}
    />
   )}
   {currentAttachment === room.attachments.length - 1 &&
    room.attachments.length !== 1 && (
     <BiLeftArrowAlt
      className={classes.arrowLeft}
      onClick={(e) => {
       e.preventDefault();
       setCurrentAttachment((prev) => (prev -= 1));
      }}
     />
    )}
   {room.attachments.length > 1 &&
    currentAttachment >= 1 &&
    currentAttachment !== room.attachments.length - 1 && (
     <>
      <BiRightArrowAlt
       className={classes.arrowRight}
       onClick={(e) => {
        e.preventDefault();
        setCurrentAttachment((prev) => (prev += 1));
       }}
      />
      <BiLeftArrowAlt
       className={classes.arrowLeft}
       onClick={(e) => {
        e.preventDefault();
        setCurrentAttachment((prev) => (prev -= 1));
       }}
      />
     </>
    )}
  </>
 );
}

export function ImageComponent({ room, variant }: Props) {
 const { classes } = useStyles();
 const [gallery, setGallery] = useState(false);

 const images =
  room.attachments &&
  room.attachments.map((s) => {
   return {
    image: s,
   };
  });

 if (variant === "description") {
  return room.attachments.length > 3 ? (
   <>
    <Grid grow gutter="xs" className={classes.imageContainer}>
     {room.attachments.slice(0, 3).map((v, i) => (
      <Grid.Col key={i} span={4}>
       <Image
        className={classes.image}
        src={room.attachments[i]}
        layout="responsive"
        width={"100%"}
        height={"100%"}
        quality={50}
        style={{ userSelect: "none" }}
        priority
        alt={""}
       />
      </Grid.Col>
     ))}
    </Grid>
    <span
     className={classes.showMore}
     onClick={() => setGallery((prev) => !prev)}
    >
     <GridDots size={22} />
     <span>Show more</span>
    </span>
    <Gallery opened={gallery} images={images} setGallery={setGallery} />
   </>
  ) : (
   <Grid grow gutter="xs" className={classes.imageContainer}>
    {room.attachments.slice(0, 3).map((v, i) => (
     <Grid.Col key={i} span={4}>
      <Image
       className={classes.image}
       src={room.attachments[i]}
       layout="responsive"
       width={"100%"}
       height={"100%"}
       quality={50}
       style={{ userSelect: "none" }}
       priority
       alt={""}
      />
     </Grid.Col>
    ))}
   </Grid>
  );
 }

 return <ImageE room={room} />;
}

/**
 * {room.attachments.length > 3 ?  (
      <>
      <Grid grow gutter="xs" className={classes.imageContainer}>
      {room.attachments.slice(0, 3).map((v,i) => (""))}
   </Grid>
      </>
    )
    : 
      (
        <Grid grow gutter="xs" className={classes.imageContainer}>
    </Grid>
      )}
 */
