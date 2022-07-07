import { createStyles, Text } from "@mantine/core";
import React from "react";

interface TLProps {
 children: React.ReactNode;
}

interface ItemProps {
 active: boolean;
 title: string;
 description: string;
 dashed?: boolean;
 lineWidth?: number;
 bulletSize?: number;
 color?: string;
 before?: boolean;
 onClick?: () => void;
 childrenLength: number;
}

const useStyles = createStyles((theme) => ({
 itemContainer: {
  display: "flex",
  flexDirection: "column",
  minWidth: "250px",
  maxWidth: "250px",
  position: "relative",
  cursor: "context-menu",
  userSelect: "none",

  h3: {
   marginTop: 10,
   width: "100%",
  },
 },

 node: {
  borderRadius: theme.radius.xl,
 },

 description: {
  marginTop: 7,
  width: "75%",
 },

 before: {
  position: "absolute",
 },

 wrapper: {
  display: "flex",
  width: "100%",
 },
}));

export function Item(props: ItemProps) {
 const {
  active,
  title,
  description,
  lineWidth = 4,
  bulletSize = 18,
  color,
  dashed,
  before = false,
  onClick,
  childrenLength,
 } = props;
 const { classes, cx } = useStyles();

 return (
  <div
   className={classes.itemContainer}
   onClick={onClick}
   style={{
    minWidth: `calc(100% / ${childrenLength})`,
    maxWidth: `calc(100% / ${childrenLength})`,
   }}
  >
   {before && (
    <div
     className={cx(classes.before, "before")}
     style={{
      borderTop: lineWidth,
      borderTopColor: active ? color : "#ADB5BD",
      borderTopStyle: dashed ? "dashed" : "solid",
      top: bulletSize / 2 - lineWidth / 2,

      width: `calc(100% - ${bulletSize}px)`,
      left: `calc(-100% + ${bulletSize}px)`,
     }}
    ></div>
   )}
   <div
    className={classes.node}
    style={{
     backgroundColor: active ? color : "#ADB5BD",
     height: bulletSize || 18,
     width: bulletSize || 18,
    }}
   ></div>
   <h3>{title}</h3>
   {description && (
    <Text size="sm" color="dimmed" className={classes.description}>
     {description}
    </Text>
   )}
  </div>
 );
}

export function Progress(props: TLProps) {
 const { children } = props;
 const { classes } = useStyles();

 return <div className={classes.wrapper}>{children}</div>;
}
