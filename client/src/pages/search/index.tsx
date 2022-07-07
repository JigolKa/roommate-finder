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
import Image from "next/image";
import React, { FormEvent } from "react";
import { useForm } from "@mantine/form";

import data from "../../../data/data.json";

import Map, { Marker, NavigationControl } from "react-map-gl";
import Pin from "../../components/Pin";
import type { MarkerDragEvent } from "react-map-gl";
import axios from "axios";
import {
 EquipmentsType,
 FeaturesType,
 HostLanguages,
 HousingType,
 PropertyType,
 SecuritiesType,
} from "../../lib/types";
import { useRouter } from "next/router";

const TOKEN =
 "pk.eyJ1Ijoiamlnb2xrYSIsImEiOiJjbDRvMXJsdWcwM2UwM2tuNXJteTZteWxiIn0.RrTZPBeUmMvYxLBe5L6wvg";

const useStyles = createStyles((theme) => ({
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
 itemMB: {
  marginBottom: 30,
 },
 tlWrapper: {
  display: "flex",
  marginBottom: 30,
  marginTop: 20,
  width: "100%",
  justifyContent: "space-between",

  "@media (max-width: 768px)": {
   display: "none",
  },
 },
 chooseWithMap: {
  marginBottom: 0,
  display: "flex",
  justifyContent: "center",
 },

 form: {
  marginTop: 25,
 },
}));

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
 value: string;
 label: string;
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

interface IinitialViewState {
 latitude: number;
 longitude: number;
 zoom: number;
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

export default function Search() {
 const [modal, setModal] = React.useState(false);
 const { classes, cx } = useStyles();
 const router = useRouter();
 const form = useForm({
  initialValues: {
   country: "",
   city: "",
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
   languages: (value) => (value === [] ? "Invalid languages" : null),
  },
 });

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

 const handleSubmit = (values: form) => {
  const l = encodeURIComponent(JSON.stringify(values.languages));
  const p = encodeURIComponent(JSON.stringify(values.price));

  const e = encodeURIComponent(JSON.stringify(values.equipments ?? "[]"));
  const f = encodeURIComponent(JSON.stringify(values.features ?? "[]"));
  const s = encodeURIComponent(JSON.stringify(values.securities ?? "[]"));

  const path = `/search/results?country=${values.country}&city=${values.city}&price=${p}&h=${values.housingType}&p=${values.propertyType}&languages=${l}&e=${e}&f=${f}&s=${s}`;

  router.push(path);
 };

 return (
  <>
   <Container size={1120}>
    <h1>Search for a flatshare</h1>

    <form
     onSubmit={form.onSubmit((values) => handleSubmit(values))}
     className={classes.form}
    >
     <Group position="apart">
      <div className={cx(classes.item, classes.item33)}>
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
        limit={10}
        {...form.getInputProps("country")}
       />
      </div>
      <div className={cx(classes.item, classes.item33)}>
       <span className={classes.span}>
        <span>
         Select a city <span className={classes.required}>*</span>
        </span>
       </span>
       <TextInput placeholder="Enter a city" {...form.getInputProps("city")} />
      </div>
      <div className={cx(classes.item, classes.item33, classes.chooseWithMap)}>
       <Button onClick={() => setModal((prev) => !prev)}>
        Or select with the map
       </Button>
      </div>
     </Group>

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
      <Button type="submit">Search</Button>
     </Group>
    </form>

    <Modal
     title="Choose on the map!"
     opened={modal}
     size="92%"
     onClose={() => setModal(false)}
     overflow="inside"
    >
     <div style={{ marginRight: 10 }}>
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
   </Container>
  </>
 );
}
