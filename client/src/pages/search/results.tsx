import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
 GetServerSidePropsContext,
 GetServerSidePropsResult,
 NextPage,
} from "next";

import Map, { Marker, NavigationControl } from "react-map-gl";
import Pin from "../../components/Pin";
import type { MarkerDragEvent } from "react-map-gl";

import prisma from "../../prisma/server";
import {
 EquipmentsType,
 FeaturesType,
 HostLanguages,
 HousingType,
 PropertyType,
 Room,
 SecuritiesType,
} from "../../lib/types";
import {
 Button,
 Container,
 createStyles,
 Group,
 Modal,
 MultiSelect,
 RangeSlider,
 Select,
 Text,
 TextInput,
} from "@mantine/core";
import { Result } from "../../components/Result";
import Head from "next/head";
import nameToIso from "../../../data/nameToIso.json";
import isoToName from "../../../data/isoToName.json";
import { Grid } from "../../components/Grid";
import Image from "next/image";
import { GoSettings } from "react-icons/go";
import data from "../../../data/data.json";
import axios from "axios";
import { useForm } from "@mantine/form";
import { isEmpty } from "../../lib/functions";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

const TOKEN =
 "pk.eyJ1Ijoiamlnb2xrYSIsImEiOiJjbDRvMXJsdWcwM2UwM2tuNXJteTZteWxiIn0.RrTZPBeUmMvYxLBe5L6wvg";

const useStyles = createStyles((theme) => ({
 wrapper: {
  display: "grid",
  gridTemplateColumns: "50% 50%",
  flexDirection: "column",
  gap: 15,
  marginTop: 10,
 },
 item: {
  marginBottom: 20,
 },
 item50: {
  maxWidth: "50%",
  minWidth: "45%",
 },
 item33: {
  maxWidth: "33%",
  minWidth: "30%",
 },
 item25: {
  maxWidth: "25%",
  minWidth: "23%",
 },
 span: {
  fontWeight: 600,
  fontSize: theme.fontSizes.md,
  marginBottom: 4,
  display: "flex",
  justifyContent: "space-between",
 },
 required: {
  color: "#ff0000",
 },

 chooseWithMap: {
  marginBottom: 0,
  display: "flex",
  justifyContent: "center",
 },

 settings: {
  padding: "6px 18px",
  border: "none",
  backgroundColor: theme.colors.blue[6],
  borderRadius: theme.radius.sm,
  width: "100%",
  cursor: "pointer",

  "> svg": {
   color: "#fff",
   height: 22,
   width: 22,
  },
 },
}));

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
 value: string;
 label: string;
}

interface form {
 country: string;
 city: string;
 housingType: string;
 propertyType: string;
 languages: never[];
 price: number[];
 features: never[];
 equipments: never[];
 securities: never[];
 rentFrequency: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
 ({ value, label, ...others }: ItemProps, ref) => {
  return (
   <div {...others}>
    <Group noWrap>
     <Image
      src={(data.flags as any)[value]}
      width={24}
      height={24}
      alt={label}
     />

     <div>
      <Text size="sm">{label}</Text>
     </div>
    </Group>
   </div>
  );
 }
);

SelectItem.displayName = "Item";

interface Props {
 rooms: string;
 stuff?: any;
}

interface IinitialViewState {
 latitude: number;
 longitude: number;
 zoom: number;
}

const Search: NextPage<Props> = (props: Props) => {
 const { query } = useRouter();
 const { classes, cx } = useStyles();
 const [modal, setModal] = React.useState(false);
 const [modal1, setModal1] = React.useState(false);
 const router = useRouter();

 const [featuresData] = React.useState<FeaturesType[]>([
  "Pool",
  "Parking lot",
  "Jacuzzi",
  "Baby bed",
  "Barbecue",
  "Charging station for electric vehicles",
  "Smoking accommodation",
  "Garden",
 ]);

 const [securitiesData] = React.useState<SecuritiesType[]>([
  "Smoke detector",
  "Carbon monoxide detector",
 ]);

 const [equipmentsData] = React.useState<EquipmentsType[]>([
  "Wi-Fi",
  "Washing machine",
  "Air conditioner",
  "Dryer",
  "Kitchen",
  "Ironing board",
  "Television",
  "Hair dryer",
  "Heating",
  "Dedicated work space",
 ]);

 const [housingTypeData] = React.useState<HousingType[]>([
  "Shared room",
  "Private room",
 ]);

 const [propertyTypeData] = React.useState<PropertyType[]>([
  "House",
  "Apartement",
 ]);

 const [languagesData] = React.useState<HostLanguages[]>([
  "English",
  "French",
  "German",
  "Italian",
  "Spanish",
  "Arabic",
  "Portuguese",
  "Indoniesian",
  "Thai",
  "Polish",
  "Tagalog",
  "Swedish",
  "Finnish",
  "Hungarian",
  "Japanese",
  "Chinese (simplified)",
  "Hindi",
  "Turkish",
  "Dutch",
  "Greek",
  "Malay",
  "Danish",
  "Norwegian",
  "Czech",
  "Russian",
 ]);

 const handleSubmit = (values: form) => {
  const l = encodeURIComponent(JSON.stringify(values.languages));
  const p = encodeURIComponent(JSON.stringify(values.price));

  const e = encodeURIComponent(JSON.stringify(values.equipments ?? "[]"));
  const f = encodeURIComponent(JSON.stringify(values.features ?? "[]"));
  const s = encodeURIComponent(JSON.stringify(values.securities ?? "[]"));

  const path = `/search/results?country=${values.country}&city=${values.city}&price=${p}&h=${values.housingType}&p=${values.propertyType}&languages=${l}&e=${e}&f=${f}&s=${s}`;

  router.push(path);
 };

 const [initialViewState, setInitialViewState] =
  React.useState<IinitialViewState>({
   latitude: 40,
   longitude: -100,
   zoom: 3.5,
  });
 const [marker, setMarker] = React.useState({
  latitude: 40,
  longitude: -100,
 });

 const onMarkerDrag = React.useCallback((event: MarkerDragEvent) => {
  setMarker({
   longitude: event.lngLat.lng,
   latitude: event.lngLat.lat,
  });
 }, []);

 const onMarkerDragEnd = React.useCallback((event: MarkerDragEvent) => {
  console.log({ onDragEnd: event.lngLat });
 }, []);

 const form = useForm({
  initialValues: {
   country:
    query.country && query.country.length <= 2
     ? query.country
     : query.country &&
       query.country.length > 2 &&
       ((nameToIso as any[]).find(
        (el: any) => el.name === (query.country as string)
       ).code as string),
   city: query.city ? query.city : "",
   housingType: "",
   propertyType: "",
   languages: [],
   price: [0, 10000],
   features: [],
   equipments: [],
   securities: [],
   rentFrequency: "Monthly",
  },

  validate: {
   country: (value) => (value === "" ? "Invalid country" : null),
   city: (value) => (value === "" ? "Invalid city" : null),
   housingType: (value) => (value === "" ? "Invalid housing type" : null),
   propertyType: (value) => (value === "" ? "Invalid property type" : null),
   languages: (value) => (isEmpty(value) ? "Invalid languages" : null),
  },
 });

 const rooms = JSON.parse(props.rooms) as Room[];

 useEffect(() => {
  console.log(form.values);
 }, [form.values]);

 const updateData = () => {
  axios
   .get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${marker.latitude}&lon=${marker.longitude}`
   )
   .then((res) => {
    console.log(res);
    const { city, county, village, country_code, road, suburb, state } =
     res.data.address;

    form.setFieldValue("city", city || county || village);
    form.setFieldValue(
     "country",
     country_code && String(country_code).toUpperCase()
    );
    setInitialViewState({
     latitude: marker.latitude,
     longitude: marker.longitude,
     zoom: 3.5,
    });
   });
 };

 useEffect(() => {
  props.stuff && console.log(props.stuff);
 }, []);

 useEffect(() => {
  console.log(rooms);
 }, [rooms]);

 return (
  <>
   <Head>
    <title>
     Search results for flatshares in {query.city as string} - Roommate finder
    </title>
   </Head>
   <Container size={1120}>
    <Link href={"/search"}>
     <Button mb={15}>
      <BiArrowBack size={20} />{" "}
      <span style={{ marginLeft: 10 }}>Go back to search page</span>
     </Button>
    </Link>
    {query.city && !query.country && <h1>{query.city} flatshares</h1>}
    {query.country && (
     <h1>
      {(isoToName as any)[query.country as string]
       ? (isoToName as any)[query.country as string]
       : (query.country as string).length > 2 && query.country}{" "}
      flatshares
     </h1>
    )}
    <Group position="apart" mt={15} sx={{ gap: 12 }}>
     <div className={cx(classes.item, classes.item25)}>
      <span className={classes.span}>
       <span>
        Select a country <span className={classes.required}>*</span>
       </span>
      </span>
      <Select
       placeholder="Pick one"
       itemComponent={SelectItem}
       data={data.multiselect}
       searchable
       maxDropdownHeight={400}
       nothingFound="Nobody here"
       limit={20}
       {...form.getInputProps("country")}
      />
     </div>
     <div className={cx(classes.item, classes.item25)}>
      <span className={classes.span}>
       <span>
        Select a city <span className={classes.required}>*</span>
       </span>
      </span>
      <TextInput placeholder="Enter a city" {...form.getInputProps("city")} />
     </div>
     <div className={cx(classes.item, classes.item25, classes.chooseWithMap)}>
      <Button onClick={() => setModal((prev) => !prev)}>
       Or select with the map
      </Button>
     </div>
     <div className={cx(classes.item, classes.item25, classes.chooseWithMap)}>
      <button
       className={classes.settings}
       onClick={() => setModal1((prev) => !prev)}
      >
       <GoSettings />
      </button>
     </div>
    </Group>
    {!isEmpty<Room>(rooms) ? (
     <Grid>
      {!isEmpty<Room>(rooms) &&
       rooms.map((room, i) => <Result room={room} key={i} />)}
     </Grid>
    ) : (
     <>
      <h2>
       No rooms in{" "}
       {query.country
        ? (isoToName as any)[query.country as string]
          ? (isoToName as any)[query.country as string]
          : (query.country as string).length > 2 && query.country
        : query.city}
       , maybe search with others settings, <br /> or{" "}
       <Link href="/create">
        <a
         style={{
          color: "#1864AB",
          textDecoration: "underline",
         }}
        >
         click here to create one
        </a>
       </Link>
      </h2>
     </>
    )}
   </Container>
   <Modal
    title="Choose on the map!"
    opened={modal}
    size="92%"
    onClose={() => setModal(false)}
    overflow="inside"
   >
    <div>
     <Map
      initialViewState={initialViewState}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      mapboxAccessToken={TOKEN}
      style={{ height: "60vh" }}
     >
      <Marker
       longitude={marker.longitude}
       latitude={marker.latitude}
       anchor="bottom"
       draggable
       onDrag={onMarkerDrag}
       onDragEnd={onMarkerDragEnd}
      >
       <Pin size={20} />
      </Marker>

      <NavigationControl />
     </Map>
     <Group position="apart" mt={15}>
      <Button color="red" onClick={() => setModal(false)}>
       Cancel
      </Button>
      <Button
       color="green"
       type="submit"
       onClick={() => {
        updateData();
        setModal(false);
       }}
      >
       Confirm
      </Button>
     </Group>
    </div>
   </Modal>
   <Modal
    opened={modal1}
    onClose={() => setModal1(false)}
    size="92%"
    overflow="outside"
    title="Add filters"
   >
    <span className={classes.span}>
     <span>Select a range price</span>
    </span>
    <RangeSlider
     defaultValue={form.values.price as [number, number]}
     value={form.values.price as [number, number]}
     max={10000}
     min={0}
     step={50}
     label={(e) => `${e}$`}
     onChange={(event) => form.setFieldValue("price", event)}
    />

    <Group position="apart" mt={35}>
     <div className={cx(classes.item, classes.item50)}>
      <span className={classes.span}>
       <span>
        Set the flatshare type <span className={classes.required}>*</span>
       </span>
      </span>
      <Select
       placeholder="Flatshare type"
       data={propertyTypeData}
       {...form.getInputProps("propertyType")}
      />
     </div>
     <div className={cx(classes.item, classes.item50)}>
      <span className={classes.span}>
       <span>
        Set the housing type <span className={classes.required}>*</span>
       </span>
      </span>
      <Select
       placeholder="Housing type"
       data={housingTypeData}
       {...form.getInputProps("housingType")}
       required
      />
     </div>
    </Group>

    <Group position="apart">
     <div className={cx(classes.item, classes.item50)}>
      <span className={classes.span}>
       <span>Do you search any security systems?</span>
      </span>
      <MultiSelect
       placeholder="Security systems"
       data={securitiesData}
       {...form.getInputProps("securities")}
       searchable
      />
     </div>
     <div className={cx(classes.item, classes.item50)}>
      <span className={classes.span}>
       <span>
        Which languages do you speak?{" "}
        <span className={classes.required}>*</span>
       </span>
      </span>
      <MultiSelect
       placeholder="Languages"
       data={languagesData}
       {...form.getInputProps("languages")}
       searchable
       required
      />
     </div>
    </Group>
    <Group position="apart">
     <div className={cx(classes.item, classes.item50)}>
      <span className={classes.span}>
       What are the features you are searching for?
      </span>
      <MultiSelect
       placeholder="Select one or more"
       data={featuresData}
       value={form.values.features as string[]}
       onChange={(event) => form.setFieldValue("features", event as never[])}
       searchable
      />
     </div>
     <div className={cx(classes.item, classes.item50)}>
      <span className={classes.span}>Do you need extra equipment?</span>
      <MultiSelect
       placeholder="Select one or more"
       data={equipmentsData}
       value={form.values.equipments as string[]}
       onChange={(event) => form.setFieldValue("equipments", event as never[])}
       searchable
      />
     </div>
    </Group>
    <Group position="right">
     <Button type="submit" onClick={() => handleSubmit(form.values as form)}>
      Search
     </Button>
    </Group>
   </Modal>
  </>
 );
};

export default Search;

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
 if ((query.city || query.country) && !query.languages) {
  const rooms = await prisma.room.findMany({
   where: {
    OR: [
     { city: query.city as string },
     {
      country: nameToIso.find((el) => el.name === (query.country as string))
       ?.code,
     },
    ],
   },
   include: {
    user: true,
   },
  });

  return {
   props: {
    rooms: JSON.stringify(rooms),
   },
  };
 }

 if (
  query.country &&
  query.city &&
  query.price &&
  query.h &&
  query.p &&
  query.languages
 ) {
  const price = JSON.parse(query.price as string);
  const housingType = query.h as string;
  const propertyType = query.p as string;
  // const city = query.city as string;
  const country = query.country as string;
  const languages = JSON.parse(query.languages as string);
  const equipments = JSON.parse((query.e as string) ?? "{}");
  const features = JSON.parse((query.f as string) ?? "{}");
  const securities = JSON.parse((query.s as string) ?? "{}");

  const rooms = await prisma.room.findMany({
   where: {
    AND: {
     country: country,
     price: {
      lte: price[1],
      gte: price[0],
     },
     propertyType: propertyType,
     housingType: housingType,
     OR: [
      {
       features: {
        hasSome: features,
       },
      },
      {
       hostLanguages: {
        hasSome: languages,
       },
      },
      {
       securities: {
        hasSome: securities,
       },
      },
      {
       equipments: {
        hasSome: equipments,
       },
      },
     ],
    },
   },
  });

  return {
   props: {
    rooms: JSON.stringify(rooms),
   },
  };
 }

 return {
  props: {
   rooms: "[]",
  },
 };
}
