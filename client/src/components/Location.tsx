import React, { useEffect } from "react";
import {
 createStyles,
 Paper,
 Text,
 Title,
 Group,
 Center,
 keyframes,
} from "@mantine/core";
import { User } from "../lib/types";
import Image from "next/image";
import Link from "next/link";
import { imageSearch } from "../lib/image_search";

const loading = keyframes({
 from: {
  left: -200,
 },
 to: {
  left: 200,
 },
});

const useStyles = createStyles((theme) => ({
 card: {
  height: 320,
  minWidth: 232,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  backgroundSize: "cover",
  backgroundPosition: "center",
  transition: "all 0.2s ease-in-out",
  position: "relative",
  overflow: "hidden",

  "&:hover": {
   boxShadow: theme.shadows.xl,

   "> h3": {
    textDecoration: "underline",
   },
  },
  "> h3": {
   maxWidth: 184,
   textShadow: "2px 2px 1px rgb(0 0 0)",
   paddingBottom: 5,
   whiteSpace: "nowrap",
   overflow: "hidden",
   textOverflow: "ellipsis",
  },
 },

 title: {
  fontFamily: `Greycliff CF ${theme.fontFamily}`,
  fontWeight: 900,
  color: theme.white,
  lineHeight: 1.2,
  fontSize: 32,
  marginTop: theme.spacing.xs,
  marginInline: "auto",
 },

 footer: {
  marginTop: theme.spacing.md,
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "100%",
  backgroundColor: "#fff",
  justifyContent: "center",
  paddingBlock: 15,
 },

 loader: {
  position: "relative",
  left: 0,
  top: 0,
  height: 256,
  width: 184,
  backgroundColor: "#fff",

  "::before": {
   content: "''",
   position: "absolute",
   left: -170,
   top: 0,
   height: 256,
   width: 184,
   backgroundColor: theme.colors.gray[1],
   animation: `${loading} 3s ease-in-out infinite`,
   filter: "blur(30px)",
  },
 },
}));

interface ArticleCardImageProps {
 image?: string;
 location: string;
 author?: User;
 no?: boolean;
 c?: boolean;
}

export function Location({
 image,
 location,
 author,
 no,
 c,
}: ArticleCardImageProps) {
 const { classes } = useStyles();
 const [imageUrl, setImageUrl] = React.useState<string | null>(
  image ? image : null
 );

 useEffect(() => {
  if (image) return;
  if (!localStorage.getItem("image for " + location)) {
   imageSearch(location).then((result) => {
    const data = result.data;

    const keys = Object.keys(data);
    setImageUrl(data[keys[0]][0]);
    localStorage.setItem(`image for ${location}`, data[keys[0]][0]);
   });
  } else {
   setImageUrl(localStorage.getItem("image for " + location));
  }
 }, []);

 return (
  <Link
   href={
    c
     ? `/search/results?country=${location}`
     : `/search/results?city=${location}`
   }
  >
   <a>
    <Paper
     shadow="md"
     p="xl"
     radius="md"
     sx={{
      backgroundImage: `url(${imageUrl})`,
      position: "relative",
     }}
     className={classes.card}
    >
     {!imageUrl && (
      <div className={classes.loader} title={"Image loading..."}></div>
     )}
     <Title title={location} order={3} className={classes.title}>
      {location}
     </Title>
     {!no && (
      <Group position="left" className={classes.footer}>
       <Center>
        <Image
         src={
          (author && author.avatar) ||
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
         }
         height={34}
         width={34}
         alt={`${
          (author && (author.nickname || author.username)) || "Anonymous"
         } profile picture`}
         style={{ borderRadius: "9999px" }}
        />
        <Text size="md" inline ml={10} sx={{ fontWeight: 500 }}>
         {(author && (author.nickname || author.username)) || "Anonymous"}
        </Text>
       </Center>
      </Group>
     )}
    </Paper>
   </a>
  </Link>
 );
}
