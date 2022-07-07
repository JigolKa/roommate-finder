import "../styles/globals.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import Head from "next/head";
import { NotificationsProvider } from "@mantine/notifications";

export default function App({ Component, pageProps }: AppProps) {
 useEffect(() => {
  if (!localStorage.getItem("ip")) {
   fetch("https://freeipapi.com/api/json")
    .then((res) => res.json())
    .then((data) => {
     console.log(data);
     localStorage.setItem("ip", JSON.stringify(data));
    });
  } else return;
 }, []);

 //  console.clear();

 return (
  <Provider store={store}>
   <NotificationsProvider>
    <Layout>
     <Head>
      <meta name="theme-color" />
      <meta
       name="description"
       content="Discover the best flatshares around you!"
      />
     </Head>
     <Component {...pageProps} />
    </Layout>
   </NotificationsProvider>
  </Provider>
 );
}
