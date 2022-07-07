import { createStyles, Select } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RentFrequency, Room, User } from "../lib/types";
import {
 FaBabyCarriage,
 FaParking,
 FaSmoking,
 FaSwimmingPool,
} from "react-icons/fa";
import {
 GiBarbecue,
 GiBubbles,
 GiGrass,
 GiWashingMachine,
 GiHeatHaze,
} from "react-icons/gi";
import { MdElectricCar, MdWorkspaces } from "react-icons/md";
import { AiOutlineWifi } from "react-icons/ai";
import { GrFanOption } from "react-icons/gr";
import { TbToolsKitchen2 } from "react-icons/tb";
import { DryerIcon } from "./images/Dryer";
import { IroningBoardIcon } from "./images/IroningBoard";
import { TelevisionIcon } from "./images/Television";
import { HairDryerIcon } from "./images/HairDryer";

import rent from "../../data/rentFrequency.json";

interface Props {
 room: Room;
 user: User | undefined;
}

const useStyles = createStyles((theme) => ({
 container: {
  width: "100%",
  height: "auto",
  display: "flex",
  gap: "5%",
  justifyContent: "space-around",
 },

 columnLarge: {
  width: "55%",
 },

 column: {
  width: "30%",
  position: "relative",
  display: "block",
 },

 section: {
  paddingBlock: 24,
  borderBottom: "1px solid rgba(0,0,0,.5)",
  display: "flex",

  ":first-of-type": {
   paddingBlock: "16px 32px",
   justifyContent: "space-between",
  },

  h2: {
   fontSize: 22,
  },
 },

 avatar: {
  borderRadius: 9999,
 },

 description: {
  fontSize: 16,
  color: "rgb(34,34,34)",
  lineBreak: "strict",
  WebkitFontSmoothing: "antialiased",
 },

 feature: {
  fontSize: 20,
  marginTop: 10,
  display: "flex",
  alignItems: "center",
  gap: 10,
 },

 pay: {
  position: "sticky",
  display: "flex",
  flexDirection: "column",
  top: "4rem",
  width: "100%",
  height: "auto",
  border: "1px solid #ced4da",
  padding: 16,
  borderRadius: 16,

  "> .book-options": {
   borderRadius: 4,
   width: "100%",
   textAlign: "center",
   marginTop: 12,

   "> div": {
    height: "50%",
    width: "100%",
    paddingBlock: 8,
    fontWeight: 600,

    ".total": {
     marginTop: 6,
    },

    ":first-of-type": {
     border: "1px solid #ced4da",
     borderRadius: 4,
    },
   },
  },

  "> button": {
   padding: "12px 24px",
   borderRadius: 4,
   backgroundColor: theme.colors.blue[5],
   color: "#fff",
   border: "none",
   fontSize: 16,
   fontWeight: 600,
   cursor: "pointer",
  },
 },
}));

export function Description({ room, user }: Props) {
 const { classes } = useStyles();

 const handleChange = (n: number, r: RentFrequency): number => {
  const roomPrice = room.price;
  switch (r) {
   case "Yearly": {
    const price = (roomPrice / 12) * n;
    return price;
   }

   case "Monthly": {
    return roomPrice * n;
   }

   case "Daily": {
    const price = roomPrice * n * 30;
    return price;
   }

   case "Weekly": {
    const price = roomPrice * n * 4;
    return price;
   }
  }
 };

 const bookForArray = new Array(12)
  .fill(null)
  .map((_, i) => `${i + 1} ${i + 1 === 1 ? "month" : "months"}`);

 const [bookFor, setBookFor] = useState("1 month");
 const [bookForP, setBookForP] = useState(
  handleChange(parseInt(bookFor.split("m")[0]), room.rentFrequency)
 );

 const features = {
  Pool: <FaSwimmingPool size={28} />,
  "Parking lot": <FaParking size={28} />,
  Jacuzzi: <GiBubbles size={28} />,
  "Baby bed": <FaBabyCarriage size={28} />,
  Barbecue: <GiBarbecue size={28} />,
  "Charging station for electric vehicles": <MdElectricCar size={28} />,
  "Smoking accommodation": <FaSmoking size={28} />,
  Garden: <GiGrass size={28} />,
 };

 const equipments = {
  "Wi-Fi": <AiOutlineWifi size={28} />,
  "Washing machine": <GiWashingMachine size={28} />,
  "Air conditioner": <GrFanOption size={28} />,
  Dryer: <DryerIcon size={28} />,
  "Hair dryer": <HairDryerIcon size={28} />,
  "Ironing board": <IroningBoardIcon size={28} />,
  Television: <TelevisionIcon size={28} />,
  Kitchen: <TbToolsKitchen2 size={28} />,
  Heating: <GiHeatHaze size={28} />,
  "Dedicated work space": <MdWorkspaces size={28} />,
 };

 useEffect(() => {
  setBookForP(
   handleChange(parseInt(bookFor.split("m")[0]), room.rentFrequency)
  );
 }, [bookFor]);

 return (
  <div className={classes.container}>
   <div className={classes.columnLarge}>
    <div className={classes.section}>
     <h2>
      {room.housingType} : {room.propertyType} ⸱ At {user ? user.firstName : ""}
     </h2>
     <Image
      height={40}
      width={40}
      alt={`${user ? user.firstName : ""} profile picture`}
      src={
       user
        ? user.avatar
          ? user.avatar
          : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
      }
      className={classes.avatar}
     />
    </div>
    <div className={classes.section} style={{ flexDirection: "column" }}>
     <h4>Description:</h4>
     <p className={classes.description}>{room.description}</p>
    </div>
    {room.features || room.equipments ? (
     <div className={classes.section} style={{ flexDirection: "column" }}>
      <h2>What this place offers</h2>
      {room.features && room.features instanceof Array ? (
       room.features.map((feature, index) => (
        <div key={index} className={classes.feature}>
         {features[feature]}
         <span>{feature}</span>
        </div>
       ))
      ) : (
       <div className={classes.feature}>
        {(features as any)[room.features!]}
        <span>{room.features}</span>
       </div>
      )}
      {room.equipments && room.equipments instanceof Array ? (
       room.equipments.map((equipment, index) => (
        <div key={index} className={classes.feature}>
         {(equipments as any)[equipment]}
         <span>{equipment}</span>
        </div>
       ))
      ) : (
       <div className={classes.feature}>
        {(features as any)[room.equipments!]}
        <span>{room.equipments}</span>
       </div>
      )}
     </div>
    ) : (
     <h1>dede</h1>
    )}
   </div>
   <div className={classes.column}>
    <div className={classes.pay}>
     <span style={{ display: "flex", alignItems: "baseline" }}>
      <h2>{room.price} $</h2>
      <span style={{ marginLeft: 5 }}> / {rent[room.rentFrequency]}</span>
     </span>
     <div className="book-options">
      <div>
       <span>Book for</span>
      </div>
      <div>
       <Select
        data={bookForArray}
        value={bookFor}
        onChange={(v) => setBookFor(v as string)}
       />
       <div className="total">
        <span>Total: {bookForP}$</span>
       </div>
      </div>
     </div>
     <button>Confirm</button>
    </div>
   </div>
  </div>
 );
}
