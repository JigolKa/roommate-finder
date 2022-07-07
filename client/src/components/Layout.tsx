import { AiOutlinePlus } from "react-icons/ai";
import { Footer } from "./Footer";
import { HeaderSearch } from "./Header";

interface Props {
 children: React.ReactNode;
}

export function Layout({ children }: Props) {
 return (
  <>
   <HeaderSearch
    links={[
     {
      link: "/create",
      label: "Add flatshare",
      icon: <AiOutlinePlus />,
     },
    ]}
   />
   {children}
   <Footer
    data={[
     {
      title: "About",
      links: [
       {
        label: "Company",
        link: "#",
       },
       {
        label: "Support",
        link: "#",
       },
       {
        label: "Forums",
        link: "#",
       },
       {
        label: "Terms of Service",
        link: "#",
       },
      ],
     },
     {
      title: "Help and support",
      links: [
       {
        label: "Help center",
        link: "#",
       },
       {
        label: "Covid-19",
        link: "#",
       },
       {
        label: "Report something",
        link: "#",
       },
       {
        label: "Cancel options",
        link: "#",
       },
      ],
     },
     {
      title: "Community",
      links: [
       {
        label: "Join Discord",
        link: "#",
       },
       {
        label: "Follow on Twitter",
        link: "#",
       },
       {
        label: "Follow on Instagram",
        link: "#",
       },
       {
        label: "Email newsletter",
        link: "#",
       },
      ],
     },
    ]}
   />
  </>
 );
}
