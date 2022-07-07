import { createStyles } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import Carousel from "nuka-carousel";

interface Props {
 images: {
  image: string;
 }[];
 opened: boolean;
 setGallery: any;
}

const useStyles = createStyles((theme) => ({
 container: {
  width: "100vw",
  height: "100vh",
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 9999999999999,
  backgroundColor: theme.colors.dark[8],

  ".close": {
   position: "absolute",
   top: 10,
   right: 15,
   zIndex: 99999,

   svg: {
    fill: "#fff",
    cursor: "pointer",
   },
  },

  "button[type='button']": {
   color: "black",
  },
 },
 image: {
  height: "100vh",
  width: "100vw",
  objectFit: "contain",
 },
 btn: {
  border: 0,
  background: "rgba(0, 0, 0, 0.4)",
  color: "white",
  padding: 10,
  textTransform: "uppercase",
  opacity: 1,
  cursor: "pointer",
 },
}));

export function Gallery({ images, opened, setGallery }: Props) {
 const { classes, cx } = useStyles();

 return (
  <div
   className={classes.container}
   style={{ display: opened ? "flex" : "none" }}
  >
   <div className="close">
    <IoMdClose size={45} onClick={() => setGallery((prev: boolean) => !prev)} />
   </div>
   <Carousel
    wrapAround={true}
    slidesToShow={1}
    renderCenterRightControls={({ nextSlide }) => (
     <button className={classes.btn} onClick={nextSlide}>
      Next
     </button>
    )}
   >
    {images.map((v, i) => (
     <img
      className={classes.image}
      src={v.image}
      alt={`image n°${i}`}
      key={i}
     />
    ))}
   </Carousel>
  </div>
 );
}
