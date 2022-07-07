import {
 ActionIcon,
 Container,
 createStyles,
 Group,
 Text,
} from "@mantine/core";
import { BrandInstagram, BrandTwitter, BrandYoutube } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
 footer: {
  marginTop: 60,
  paddingTop: theme.spacing.xl * 2,
  paddingBottom: theme.spacing.xl * 2,
  backgroundColor: theme.colors.gray[0],
  borderTop: `1px solid ${
   theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
  }`,
 },

 logo: {
  maxWidth: 200,

  [theme.fn.smallerThan("sm")]: {
   display: "flex",
   flexDirection: "column",
   alignItems: "center",
  },
 },

 description: {
  marginTop: 5,

  [theme.fn.smallerThan("sm")]: {
   marginTop: theme.spacing.xs,
   textAlign: "center",
  },
 },

 inner: {
  display: "flex",
  justifyContent: "space-between",

  [theme.fn.smallerThan("sm")]: {
   flexDirection: "column",
   alignItems: "center",
  },
 },

 groups: {
  display: "flex",
  flexWrap: "wrap",
  gap: 25,

  [theme.fn.smallerThan("sm")]: {
   display: "none",
  },
 },

 wrapper: {
  width: "max-content",
 },

 link: {
  display: "block",
  color:
   theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6],
  fontSize: theme.fontSizes.sm,
  paddingTop: 3,
  paddingBottom: 3,

  "&:hover": {
   textDecoration: "underline",
  },
 },

 title: {
  fontSize: theme.fontSizes.lg,
  fontWeight: 700,
  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  marginBottom: theme.spacing.xs / 2,
  color: theme.colorScheme === "dark" ? theme.white : theme.black,
 },

 afterFooter: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing.xl,
  paddingTop: theme.spacing.xl,
  borderTop: `1px solid ${
   theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
  }`,

  [theme.fn.smallerThan("sm")]: {
   flexDirection: "column",
  },
 },

 social: {
  [theme.fn.smallerThan("sm")]: {
   marginTop: theme.spacing.xs,
  },
 },
}));

interface FooterLinksProps {
 data: {
  title: string;
  links: { label: string; link: string }[];
 }[];
}

export function Footer({ data }: FooterLinksProps) {
 const { classes } = useStyles();
 const groups = data.map((group) => {
  const links = group.links.map((link, index) => (
   <Text<"a">
    key={index}
    className={classes.link}
    component="a"
    href={link.link}
    onClick={(event) => event.preventDefault()}
   >
    {link.label}
   </Text>
  ));

  return (
   <div className={classes.wrapper} key={group.title}>
    <Text className={classes.title}>{group.title}</Text>
    {links}
   </div>
  );
 });
 return (
  <>
   <footer className={classes.footer}>
    <Container className={classes.inner} size={1400}>
     <div className={classes.logo}>
      <h2>Roommate Finder</h2>
      <Text size="xs" color="dimmed" className={classes.description}>
       Search the best flatshares around the globe!
      </Text>
     </div>
     <div className={classes.groups}>{groups}</div>
    </Container>
    <Container className={classes.afterFooter} size={1400}>
     <Text color="dimmed" size="sm">
      © 2022 Roommate Finder. All rights reserved.
     </Text>

     <Group spacing={0} className={classes.social} position="right" noWrap>
      <ActionIcon size="lg">
       <BrandTwitter size={18} />
      </ActionIcon>
      <ActionIcon size="lg">
       <BrandYoutube size={18} />
      </ActionIcon>
      <ActionIcon size="lg">
       <BrandInstagram size={18} />
      </ActionIcon>
     </Group>
    </Container>
   </footer>
  </>
 );
}
