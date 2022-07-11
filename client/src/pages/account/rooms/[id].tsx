import {
 Checkbox,
 Container,
 createStyles,
 Group,
 NumberInput,
 Text,
 Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { GetServerSidePropsContext, NextPage } from "next";
import Image from "next/image";
import React, { useEffect } from "react";
import { Room } from "../../../lib/types";
import prisma from "../../../prisma/server";
import {
 Button,
 Modal,
 MultiSelect,
 RangeSlider,
 Select,
 TextInput,
} from "@mantine/core";

import data from "../../../../data/data.json";

import Map, { Marker, NavigationControl } from "react-map-gl";
import Pin from "../../../components/Pin";
import type { MarkerDragEvent } from "react-map-gl";
import {
 EquipmentsType,
 FeaturesType,
 HostLanguages,
 HousingType,
 PropertyType,
 SecuritiesType,
} from "../../../lib/types";
import { useRouter } from "next/router";
import axios from "axios";
import { toString } from "../../../lib/functions";
import config from "../../../../config";

interface Props {
 room: string;
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
 value: string;
 label: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
 ({ value, label, ...others }: ItemProps) => {
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

const EditRoom: NextPage<Props> = ({ room }: Props) => {
 const _room = JSON.parse(room || "{}") as Room;
 const { classes, cx } = useStyles();
 const router = useRouter();

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

 useEffect(() => {
  if (!localStorage.getItem("user")) {
   router.push("/login");
  }
 }, []);

 const updateData = () => {
  axios
   .get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${marker.latitude}&lon=${marker.longitude}`
   )
   .then((res) => {
    const { city, county, village, country_code } = res.data.address;

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

 const [modal, setModal] = React.useState(false);

 const form = useForm({
  initialValues: {
   city: _room.city,
   address: _room.address,
   country: _room.country,
   accept: _room.accept,
   allowEmail: _room.allowEmail,
   allowLocation: _room.allowLocation,
   allowMessaging: _room.allowMessaging,
   allowPhone: _room.allowPhone,
   capacity: _room.capacity,
   occupied: _room.occupied,
   description: _room.description,
   hostLanguages: _room.hostLanguages,
   rentFrequency: _room.rentFrequency,
   propertyType: _room.propertyType,
   housingType: _room.housingType,
   price: _room.price,
   features: _room.features,
   equipments: _room.equipments,
   securities: _room.securities,
  },
 });

 const handleSubmit = (values: typeof form.values) => {
  const data = {};
  console.group();

  for (let i = 0; i < Object.keys(form.values).length; i++) {
   const formKey = Object.keys(values)[i];
   const formValue = (values as any)[formKey];

   const roomKey = formKey;
   const roomValue = (_room as any)[roomKey];

   if (toString(formValue) !== toString(roomValue)) {
    Object.assign(data, { [formKey]: formValue });
   }
  }

  axios
   .patch(`${config.api}/api/rooms/${router.query.id}`, data, {
    headers: {
     "Content-Type": "application/json",
    },
   })
   .then((res) => console.log(res));

  console.groupEnd();
 };

 return (
  <>
   <Container size={1120}>
    <h1>Edit my flatshare</h1>
    <form
     style={{ marginTop: 15 }}
     onSubmit={form.onSubmit((values) => handleSubmit(values))}
    >
     <Group position="apart">
      <div className={cx(classes.item, classes.item33)}>
       <span className={classes.span}>Select a country</span>
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
       <span className={classes.span}>Select a city</span>
       <TextInput placeholder="Enter a city" {...form.getInputProps("city")} />
      </div>
      <div className={cx(classes.item, classes.item33, classes.chooseWithMap)}>
       <Button onClick={() => setModal((prev) => !prev)}>
        Or select with the map
       </Button>
      </div>
     </Group>

     <div className={classes.item}>
      <span className={classes.span}>Describe your flatshare a bit!</span>
      <Textarea
       placeholder="Add a description"
       autosize
       minRows={3}
       maxRows={6}
       {...form.getInputProps("description")}
      />
     </div>

     <Group position="apart">
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}>
        Set the number of people living there
       </span>
       <NumberInput
        placeholder="How many people live in your flatshare?"
        {...form.getInputProps("occupied")}
        min={0}
       />
      </div>
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}>Set the reception capacity</span>
       <NumberInput
        placeholder="How many people can you host?"
        {...form.getInputProps("capacity")}
        min={1}
       />
      </div>
     </Group>

     <Group position="apart">
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}>Set the rent frequency (optional)</span>
       <Select
        placeholder="Enter the rent frquency"
        data={["Monthly", "Yearly", "Weekly", "Daily"]}
        {...form.getInputProps("rentFrequency")}
       />
      </div>
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}>Set the rent price</span>
       <NumberInput
        placeholder="Rent price"
        defaultValue={0}
        {...form.getInputProps("price")}
        parser={(value) => value && value.replace(/\$\s?|(,*)/g, "")}
        formatter={(value) =>
         !Number.isNaN(parseFloat(value ? value : "0"))
          ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : "$ "
        }
       />
      </div>
     </Group>

     <Group position="apart">
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}>Set the flatshare type</span>
       <Select
        placeholder="Flatshare type"
        data={propertyTypeData}
        {...form.getInputProps("propertyType")}
       />
      </div>
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}>Set the housing type</span>
       <Select
        placeholder="Housing type"
        data={housingTypeData}
        {...form.getInputProps("housingType")}
       />
      </div>
     </Group>

     <Group position="apart">
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}>
        <span>Do you have any security systems? (optional)</span>
       </span>
       <MultiSelect
        placeholder="Security systems"
        data={securitiesData}
        {...form.getInputProps("securities")}
        searchable
       />
      </div>
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}>Which languages do you speak? </span>
       <MultiSelect
        placeholder="Languages"
        data={languagesData}
        {...form.getInputProps("hostLanguages")}
        searchable
       />
      </div>
     </Group>
     <div className={cx(classes.item, classes.itemMB)}>
      <span className={classes.span}>
       Do you accept a certain range of age?
      </span>
      <RangeSlider
       defaultValue={[18, 100]}
       marks={[
        { value: 40, label: "40 years old" },
        { value: 80, label: "80 years old" },
       ]}
       min={18}
       {...form.getInputProps("accept")}
      />
     </div>
     <div className={classes.item}>
      <span className={classes.span}>
       What are the key features of your flatshare?
      </span>
      <MultiSelect
       placeholder="Select one or more"
       data={featuresData}
       {...form.getInputProps("features")}
       searchable
      />
     </div>
     <div className={classes.item}>
      <span className={classes.span}>Do you have any extra equipment?</span>
      <MultiSelect
       placeholder="Select one or more"
       data={equipmentsData}
       {...form.getInputProps("equipments")}
       searchable
      />
     </div>
     <Group position="apart">
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}></span>
       <Checkbox
        size="md"
        label="Allow others users to see your phone number?"
        {...form.getInputProps("allowPhone")}
        checked={form.values.allowPhone}
       />
      </div>
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}></span>
       <Checkbox
        size="md"
        label="Allow others users to see your email address?"
        checked={form.values.allowEmail}
        {...form.getInputProps("allowEmail")}
       />
      </div>
     </Group>
     <Group position="apart">
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}></span>
       <Checkbox
        size="md"
        label="Allow others users to contact you via the messaging?"
        checked={form.values.allowMessaging}
        {...form.getInputProps("allowMessaging")}
       />
      </div>
      <div className={cx(classes.item, classes.item50)}>
       <span className={classes.span}></span>
       <Checkbox
        size="md"
        label="Allow others users to see the exact address?"
        checked={form.values.allowLocation}
        {...form.getInputProps("allowLocation")}
       />
      </div>
     </Group>
     <Group position="right">
      <Button color="green" type="submit">
       Update flatshare
      </Button>
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
};

export default EditRoom;

export async function getServerSideProps(context: GetServerSidePropsContext) {
 const { id } = context.query;

 const room = await prisma.room.findFirst({
  where: {
   roomId: id as string,
  },
 });

 return {
  props: {
   room: JSON.stringify(room),
  },
 };
}
