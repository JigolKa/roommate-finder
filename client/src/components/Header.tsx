import React, { useState } from "react";
import {
 createStyles,
 Header,
 Group,
 Input,
 Container,
 useMantineTheme,
} from "@mantine/core";
import { BsSearch } from "react-icons/bs";
import config from "../../data/config.json";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { User } from "../lib/types";

const useStyles = createStyles((theme) => ({
 inner: {
  height: 56,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "> a": {
   fontSize: 24,
   fontWeight: "bold",
  },
 },

 links: {
  [theme.fn.smallerThan("sm")]: {
   display: "none",
  },
 },

 search: {
  [theme.fn.smallerThan("xs")]: {
   display: "none",
  },
 },

 link: {
  lineHeight: 1,
  padding: "10px 12px",
  display: "flex",
  alignItems: "center",
  gap: 7,
  borderRadius: theme.radius.xl,
  textDecoration: "none",
  color:
   theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
  fontSize: theme.fontSizes.sm,
  fontWeight: 500,
  transition: "background-color 0.2s ease-in-out",

  "&:hover": {
   backgroundColor:
    theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
  },
 },
 avatar: {
  display: "block",
  height: 32,
  width: 32,
  fill: theme.colors.gray[5],
  cursor: "pointer",
  transition: "fill 0.2s ease-in-out",
  position: "relative",

  "&:hover": {
   fill: theme.colors.gray[7],
  },
 },

 input: {
  width: "auto",
  transition: "box-shadow 0.2s ease-in-out",
  background: "#00000000",

  "&:hover, &:focus-within, &:focus": {
   boxShadow: theme.shadows.sm,
  },
 },

 img: {
  height: 32,
  width: 32,
  borderRadius: 99999,
  objectFit: "cover",
 },
}));

interface HeaderSearchProps {
 links: { link: string; label: string; icon: JSX.Element | null }[];
}

export function HeaderSearch({ links }: HeaderSearchProps) {
 const { classes } = useStyles();
 const theme = useMantineTheme();
 const router = useRouter();
 const [img, setImg] = useState(
  <svg
   viewBox="0 0 32 32"
   xmlns="http://www.w3.org/2000/svg"
   aria-hidden="true"
   role="presentation"
   focusable="false"
  >
   <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
  </svg>
 );

 const items = links.map((link) => (
  <a
   key={link.label}
   href={link.link}
   className={classes.link}
   onClick={() => {
    if (localStorage.getItem("user")) {
     router.push(link.link);
     return;
    }

    router.push("/login");
   }}
  >
   {link.icon && link.icon}
   {link.label}
  </a>
 ));

 useEffect(() => {
  if (localStorage.getItem("user")) {
   const user = JSON.parse(localStorage.getItem("user") || "{}") as User;
   setImg(
    <img
     src={
      user.avatar ||
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
     }
     alt="Profile picture"
     className={classes.img}
    />
   );
   return;
  }
 }, []);

 return (
  <>
   <Header
    height={56}
    mb={30}
    style={{
     backgroundColor: theme.colors.gray[0],
    }}
   >
    <Container size={1400}>
     <div className={classes.inner}>
      <Link href="/">{config.appName}</Link>

      <Input
       icon={<BsSearch />}
       placeholder={"Search for a room"}
       className={classes.input}
       onClick={() => router.push("/search")}
       onKeyUp={() => router.push("/search")}
       readOnly
      />

      <Group>
       {items}

       <div
        className={classes.avatar}
        onClick={() =>
         localStorage.getItem("user")
          ? router.push("/account")
          : router.push("/login")
        }
       >
        {img}
       </div>
      </Group>
     </div>
    </Container>
   </Header>
  </>
 );
}
