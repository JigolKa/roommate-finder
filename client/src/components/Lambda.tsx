import React from "react";

interface Props {
 children: React.ReactNode;
}

export default function Lol(props: Props) {
 const childs = React.Children.map(props.children, (child) => {
  let el = React.cloneElement(child as any, {
   style: {
    color: "red",
   },
  });
  return el;
 });
 return <div>{childs}</div>;
}
