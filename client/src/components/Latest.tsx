import { Container, createStyles } from "@mantine/core";
import React from "react";
import { StringClass } from "../lib/classes";

const useStyles = createStyles((theme) => ({
 header: {
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
 },

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
 whereInput: {
  borderLeft: "none !important",
 },
 modalInput: {
  marginBottom: 20,
  span: {
   fontSize: theme.fontSizes.sm,
   fontWeight: 500,
   marginBottom: 4,
   display: "block",
  },
 },
 wrapper: {
  display: "flex",
  flexWrap: "nowrap",
  overflowY: "hidden",
  whiteSpace: "nowrap",
  height: 340,
  width: "100vw",
  gap: 20,
 },
}));

interface Props {
 country: string;
 rooms?: any;
}

export function Latest({ country, rooms }: Props) {
 const { classes } = useStyles();
 return (
  <Container size={1120}>
   <h1>Latest in {new StringClass(country).capitalize()}</h1>
  </Container>
 );
}
