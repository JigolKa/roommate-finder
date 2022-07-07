import {
 Button,
 Container,
 createStyles,
 Group,
 PasswordInput,
 Textarea,
 TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { getCookie } from "../../lib/cookie";
import { isEmpty, notificationTheme } from "../../lib/functions";
import { User } from "../../lib/types";
import prisma from "../../prisma/server";

interface Props {
 user: string;
}

interface form {
 email: string;
 bio: string;
 phone: string;
 password: string;
 confirmPassword: string;
 firstName: string;
 lastName: string;
 banner: unknown;
 avatar: unknown;
}

const useStyles = createStyles((theme) => ({
 title: {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
 },

 banner: {
  width: "100%",
  height: 200,
  background: theme.colors.gray[3],
  borderRadius: 4,
  position: "relative",
  backgroundPosition: "50% 50%",

  ".upload": {
   position: "absolute",
   left: "50%",
   top: "50%",
   transform: "translate(-50%, -50%)",
   display: "flex",
   flexDirection: "column",
   alignItems: "center",
   cursor: "pointer",

   input: {
    display: "none",
   },
  },
  ".upload.full": {
   position: "absolute",
   width: "100%",
   height: 200,
   borderRadius: 4,
   cursor: "pointer",
  },
 },

 username: {
  position: "relative",
  top: -15,
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
 },

 avatar: {
  height: 75,
  width: 75,
  borderRadius: 9999,
  objectFit: "cover",
  cursor: "pointer",
 },

 infos: {
  marginBottom: 15,
  marginTop: -5,
  display: "flex",
  flexDirection: "column",
  // gap: 20,

  ".info.a50": {
   display: "flex",
   flexDirection: "column",
   marginTop: 10,
   width: "100%",

   ".input": {
    width: "100%",
   },
  },

  ".info": {
   display: "flex",
   flexDirection: "column",
   marginTop: 10,
   width: "45%",

   ".input": {
    width: "100%",
   },
  },
 },

 manage: {
  marginBottom: 10,
  color: theme.colors.blue[8],
  textDecoration: "underline",
 },
}));

const Account: NextPage<Props> = ({ user }: Props) => {
 const _user = JSON.parse(decodeURIComponent(user)) as User;
 const { classes } = useStyles();
 const router = useRouter();

 const [banner, setBanner] = useState<any>();
 const [avatar, setAvatar] = useState<any>();

 const form = useForm({
  initialValues: {
   email: _user.email,
   bio: _user.bio ? _user.bio : "",
   phone: _user.phone ? _user.phone : "",
   password: "",
   confirmPassword: "",
   firstName: _user.firstName ? _user.firstName : "",
   lastName: _user.lastName ? _user.lastName : "",
   banner: "" as unknown,
   avatar: "" as unknown,
  },
 });

 // eslint-disable-next-line no-console
 const handleSubmit = async (values: form) => {
  console.log(values);

  if (avatar) {
   console.log("hrehre 0");
   const formData = new FormData();
   formData.append("file", avatar as any);

   const res = await axios.post("http://localhost:5001/api/upload", formData, {
    headers: {
     "Content-Type": "multipart/form-data",
    },
   });

   if (banner) {
    console.log("hrehre 1");
    const formData = new FormData();
    formData.append("file", banner as any);

    const res1 = await axios.post(
     "http://localhost:5001/api/upload",
     formData,
     {
      headers: {
       "Content-Type": "multipart/form-data",
      },
     }
    );
    console.log(res);
    axios
     .patch("http://localhost:3000/api/users/" + _user.userId, {
      ...values,
      banner: res1.data[0],
      avatar: res.data[0],
     })
     // eslint-disable-next-line no-console
     .then((res) => {
      showNotification({
       title: "Successfully updated your account",
       message: "Your account has been updated successfully",
       styles: notificationTheme(res.status),
      });
      localStorage.setItem("user", JSON.stringify(res.data));
     });

    return;
   }

   axios
    .patch("http://localhost:3000/api/users/" + _user.userId, {
     ...values,
     avatar: res.data[0],
    })
    // eslint-disable-next-line no-console
    .then((res) => {
     showNotification({
      title: "Successfully updated your account",
      message: "Your account has been updated successfully",
      styles: notificationTheme(res.status),
     });

     localStorage.setItem("user", JSON.stringify(res.data));
    });
   return;
  }

  if (banner) {
   console.log("hrehre 1");
   const formData = new FormData();
   formData.append("file", banner as any);

   const res1 = await axios.post("http://localhost:5001/api/upload", formData, {
    headers: {
     "Content-Type": "multipart/form-data",
    },
   });

   if (avatar) {
    const formData = new FormData();
    formData.append("file", avatar as any);

    const res = await axios.post("http://localhost:5001/api/upload", formData, {
     headers: {
      "Content-Type": "multipart/form-data",
     },
    });

    console.log(res);
    axios
     .patch("http://localhost:3000/api/users/" + _user.userId, {
      ...values,
      banner: res.data[0],
     })
     // eslint-disable-next-line no-console
     .then((res) => {
      showNotification({
       title: "Successfully updated your account",
       message: "Your account has been updated successfully",
       styles: notificationTheme(res.status),
      });

      localStorage.setItem("user", JSON.stringify(res.data));
     });
   }

   return;
  }

  console.log("hrehre -2");

  axios
   .patch("http://localhost:3000/api/users/" + _user.userId, values)
   .then((res) => {
    showNotification({
     title: "Successfully updated your account",
     message: "Your account has been updated successfully",
     styles: notificationTheme(res.status),
    });

    localStorage.setItem("user", JSON.stringify(res.data));
   });
 };

 useEffect(() => {
  if (isEmpty(_user as any)) {
   router.push("/login");
  }
 }, []);

 const replace = (str: string) => {
  if (typeof str !== "string") return;
  const string = str.split("/")[str.split("/").length - 1];

  return encodeURIComponent(string.replace(")", "%29").replace("(", "%28"));
 };

 return (
  <>
   <Head>
    <title>Your account</title>
   </Head>
   <Container size={1120}>
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
     <div
      className={classes.banner}
      style={{
       backgroundImage: banner
        ? `url(${URL.createObjectURL(banner)})`
        : _user.banner
        ? `url(http://localhost:5001/uploads/${replace(_user.banner)})`
        : `url(${form.values.banner})`,
      }}
     >
      {!_user.banner && !banner && (
       <label className="upload">
        <BiUpload size={48} />
        <span style={{ fontWeight: 600 }}>Upload a new banner</span>
        <input
         type="file"
         name="file"
         id="file"
         onChange={(e) => setBanner(e.target.files![0])}
         accept="image/png, image/jpg, image/gif, image/jpeg"
        />
       </label>
      )}
      {(_user.banner || banner) && (
       <label className="upload full">
        <input
         type="file"
         name="file"
         id="file"
         onChange={(e) => {
          form.setFieldValue("banner", e.target.files![0]);

          setBanner((p: any) => (e.target.files ? e.target.files[0] : p));
         }}
         accept="image/png, image/jpg, image/gif, image/jpeg"
        />
       </label>
      )}
     </div>
     <div className={classes.username}>
      <div>
       <label>
        <img
         src={
          avatar
           ? URL.createObjectURL(avatar)
           : _user.avatar
           ? `http://localhost:5001/uploads/${replace(_user.avatar)}`
           : (form.values.avatar as string) ||
             "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
         }
         alt="Profile picture"
         className={classes.avatar}
        />
        {!_user.avatar && !avatar && (
         <input
          type="file"
          name="file1"
          id="file1"
          style={{ display: "none" }}
          onChange={(e) => setAvatar(e.target.files![0])}
          accept="image/png, image/jpg, image/gif, image/jpeg"
         />
        )}
        {(_user.avatar || avatar) && (
         <input
          type="file"
          name="file1"
          id="file1"
          style={{ display: "none" }}
          onChange={(e) => {
           form.setFieldValue("avatar", e.target.files![0]);

           setAvatar((p: any) => (e.target.files ? e.target.files[0] : p));
          }}
          accept="image/png, image/jpg, image/gif, image/jpeg"
         />
        )}
       </label>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
       <span style={{ fontWeight: 600, fontSize: 22 }}>
        {_user.firstName} {_user.lastName}
       </span>
       <span style={{ opacity: 0.85 }}>{_user.username}</span>
      </div>
     </div>
     <div className={classes.infos}>
      <div>
       <h2>Your rooms</h2>
       <Link href="/account/rooms">
        <a>
         <h4 className={classes.manage}>Manage your rooms here</h4>
        </a>
       </Link>
      </div>
      <h2 style={{ marginTop: 5 }}>Your informations</h2>
      <Group position="apart">
       <div className="info a50">
        <Textarea
         placeholder="Your biography"
         label="Enter your biography"
         autosize
         minRows={3}
         {...form.getInputProps("bio")}
         maxRows={5}
        />
       </div>
       <div className="info">
        <TextInput
         label={"Your first name"}
         placeholder="Enter your first name"
         className="input"
         {...form.getInputProps("firstName")}
        />
       </div>
       <div className="info">
        <TextInput
         label={"Your last name"}
         placeholder="Enter your last name"
         className="input"
         {...form.getInputProps("lastName")}
        />
       </div>
       <div className="info">
        <TextInput
         label={"Your email"}
         placeholder="Enter your email"
         className="input"
         {...form.getInputProps("email")}
        />
       </div>
       <div className="info">
        <TextInput
         label={"Your phone number"}
         placeholder="Enter your phone number"
         className="input"
         {...form.getInputProps("phone")}
        />
       </div>
       <div className="info">
        <PasswordInput
         label={"Your password"}
         placeholder="Enter your password"
         className="input"
         {...form.getInputProps("password")}
        />
       </div>
       <div className="info">
        <PasswordInput
         label={"Confirm your password"}
         placeholder="Re-enter your password"
         className="input"
         {...form.getInputProps("confirmPassword")}
        />
       </div>
       {/* <div className="info"></div> */}
      </Group>
     </div>
     <Group position="right">
      <Button type="submit" color="green">
       Update your profile
      </Button>
     </Group>
    </form>
   </Container>
  </>
 );
};

export default Account;

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const _ = getCookie(context.req, "user", 1) as User;

 if (!_)
  return {
   props: {
    user: "{}",
   },
  };

 const user = await prisma.user.findFirst({
  where: {
   userId: _.userId,
  },
 });

 return {
  props: {
   user: JSON.stringify(user),
  },
 };
}
