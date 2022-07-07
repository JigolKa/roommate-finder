import {
 Button,
 Container,
 createStyles,
 Group,
 PasswordInput,
 TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import Script from "next/script";
import Encryption from "../lib/encryption";
import config from "../../config";
import { showNotification } from "@mantine/notifications";
import { notificationTheme } from "../lib/functions";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "universal-cookie";

interface form {
 email: string;
 password: string;
}

const useStyles = createStyles(() => ({
 input: {
  minWidth: "50%",
 },

 wrapper: {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 15,
 },

 container: {
  margin: "70px auto",
  width: "45%",
 },
}));

export default function Login() {
 const { classes } = useStyles();
 const encryption = new Encryption();
 const nonceValue = config.nonceValue;
 const router = useRouter();
 const cookies = new Cookies();

 const form = useForm({
  initialValues: {
   email: "",
   password: "",
  },

  validate: {
   password: (v) => (!v ? "Please enter a valid password" : null),
   email: (v) =>
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
     v
    )
     ? null
     : "Please enter a valid email",
  },
 });

 useEffect(() => {
  if (localStorage.getItem("user")) {
   router.push("/account");
  }
 }, []);

 const handleSubmit = async ({ email, password }: form) => {
  const pwd = encryption.encrypt(password, nonceValue);
  const eml = encryption.encrypt(email, nonceValue);

  try {
   const response = await axios.post("http://localhost:3000/api/login", {
    password: pwd,
    email: eml,
   });

   showNotification({
    id: "login-successful",
    title: "Authentication successful",
    message: `Hello ${response.data.firstName}. Redirecting you...`,
    styles: notificationTheme(response.status),
   });

   localStorage.setItem("user", JSON.stringify(response.data));
   cookies.set("user", JSON.stringify(response.data));

   setTimeout(() => {
    router.push("/");
   }, 1500);
  } catch (e) {
   showNotification({
    id: "login-failed",
    title: "Authentication failed",
    message: "Try again or reset your password",
    styles: notificationTheme((e as any).response.status),
   });
  }

  //TODO: user token in headers
 };

 return (
  <>
   <Script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></Script>
   <Container size={1120} style={{ display: "flex" }}>
    <div className={classes.container}>
     <h1>Login</h1>
     <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <div className={classes.wrapper}>
       <TextInput
        placeholder="Email"
        label="Enter your email"
        className={classes.input}
        {...form.getInputProps("email")}
        required
       />
       <PasswordInput
        placeholder="Password"
        label="Enter your password"
        className={classes.input}
        {...form.getInputProps("password")}
        required
       />
      </div>
      <Group position="right" mt={15}>
       <Button type="submit">Login</Button>
      </Group>
     </form>
    </div>
   </Container>
  </>
 );
}
