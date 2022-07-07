import { Container, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
 wrapper: {
  display: "grid",
  gridTemplateColumns: "50% 50%",
  flexDirection: "column",
  gap: 15,
  marginTop: 10,
 },
}));

export function Grid({ children }: { children: React.ReactNode }) {
 const { classes } = useStyles();
 return <div className={classes.wrapper}>{children}</div>;
}
