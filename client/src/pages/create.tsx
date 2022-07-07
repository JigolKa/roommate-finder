import { NextPage } from "next";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
 Button,
 Checkbox,
 Container,
 createStyles,
 Group,
 Modal,
 MultiSelect,
 NumberInput,
 RangeSlider,
 Select,
 Text,
 Textarea,
 TextInput,
} from "@mantine/core";
import Image from "next/image";
import data from "../../data/data.json";
import { Item, Progress } from "../components/Progress";
import axios from "axios";

const TOKEN =
 "pk.eyJ1Ijoiamlnb2xrYSIsImEiOiJjbDRvMXJsdWcwM2UwM2tuNXJteTZteWxiIn0.RrTZPBeUmMvYxLBe5L6wvg";

import Map, { Marker, NavigationControl } from "react-map-gl";
import Pin from "../components/Pin";
import type { MarkerDragEvent } from "react-map-gl";
import { AiFillDelete } from "react-icons/ai";
import {
 EquipmentsType,
 FeaturesType,
 Form,
 HostLanguages,
 HousingType,
 PropertyType,
 RentFrequency,
 SecuritiesType,
} from "../lib/types";

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
 addMyOwn: {
  color: theme.colors.indigo[8],
  textDecoration: "underline",
  cursor: "pointer",
 },
 chooseWithMap: {
  marginBottom: 0,
  display: "flex",
  justifyContent: "center",
 },
 wrapper: {
  position: "relative",
  marginBottom: 30,
 },

 dropzone: {
  borderWidth: 1,
  paddingBottom: 50,
 },

 icon: {
  color:
   theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
 },

 control: {
  position: "absolute",
  width: 250,
  left: "calc(50% - 125px)",
  bottom: -20,
 },

 uploadLabel: {
  backgroundColor: "#228be6",
  color: "#fff",
  fontWeight: 600,
  display: "inline-block",
  padding: "7px 18px",
  fontSize: 14,
  cursor: "pointer",
  borderRadius: 5,

  input: {
   display: "none",
  },
 },
 imgPreview: {
  width: 150,
  height: 100,
  objectFit: "cover",
  borderRadius: theme.radius.sm,
  transition: "all 250ms ease",
  objectPosition: "50% 50%",
 },
 imgContainer: {
  display: "flex",
  flexWrap: "wrap",
  position: "relative",
  marginTop: 15,
  gap: 10,
  justifyContent: "left",

  "> div": {
   padding: "8px 12px 6px 12px",
   border: "1px solid rgba(0,0,0,.25)",
   borderRadius: theme.radius.sm,
   width: 400,
   whiteSpace: "nowrap",
   overflow: "hidden",
   textOverflow: "ellipsis",
   display: "flex",
   alignItems: "center",
   gap: 10,
   position: "relative",

   span: {
    width: 250,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 16,
   },

   "> div": {
    position: "absolute",
    right: 0,
    top: 0,
    padding: "5px 6px 4px",
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.red[7],
    cursor: "pointer",
   },
  },
 },
}));

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

const Create: NextPage = () => {
 const { classes, cx } = useStyles();
 const router = useRouter();
 const [country, setCountry] = React.useState("");
 const [address, setAddress] = React.useState("");
 const [city, setCity] = React.useState("");
 const [living, setLiving] = React.useState(0);
 const [hostingCapacity, setHostingCapacity] = React.useState(0);

 const [price, setPrice] = React.useState(0);
 const [rentFrequency, setRentFrequency] =
  React.useState<RentFrequency>("Monthly");
 const [description, setDescription] = React.useState("");
 const [range, setRange] = React.useState<[number, number]>([18, 100]);

 const [features, setRequirements] = React.useState<FeaturesType[]>([]);
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

 const [securities, setSecurities] = React.useState<SecuritiesType[]>([]);
 const [securitiesData] = React.useState<SecuritiesType[]>([
  "Smoke detector",
  "Carbon monoxide detector",
 ]);

 const [equipments, setEquipments] = React.useState<EquipmentsType[]>([]);
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

 const [housingType, setHousingType] = React.useState<HousingType>();
 const [housingTypeData] = React.useState<HousingType[]>([
  "Shared room",
  "Private room",
 ]);

 const [propertyType, setPropertyType] = React.useState<PropertyType>();
 const [propertyTypeData] = React.useState<PropertyType[]>([
  "House",
  "Apartement",
 ]);

 const [languages, setLanguages] = React.useState<HostLanguages[]>([]);
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

 const [priceError, setPriceError] = React.useState(false);
 const [capacityError, setCapacityError] = React.useState(false);
 const [livingError, setLivingError] = React.useState(false);
 const [descriptionError, setDescriptionError] = React.useState(false);
 const [countryError, setCountryError] = React.useState(false);
 const [cityError, setCityError] = React.useState(false);

 const [allowEmail, setAllowEmail] = React.useState(false);
 const [allowPhone, setAllowPhone] = React.useState(false);
 const [allowMessaging, setAllowMessaging] = React.useState(true);
 const [allowLocation, setAllowLocation] = React.useState(false);

 const [tab, setTab] = React.useState(0);
 const [modal, setModal] = React.useState(false);

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

 const [files, setFiles] = React.useState<any>([]);

 const onMarkerDrag = React.useCallback((event: MarkerDragEvent) => {
  setMarker({
   longitude: event.lngLat.lng,
   latitude: event.lngLat.lat,
  });
 }, []);

 const onMarkerDragEnd = React.useCallback((event: MarkerDragEvent) => {
  console.log({ onDragEnd: event.lngLat });
 }, []);

 useEffect(() => {
  console.log(files);
 }, [files]);

 const updateData = () => {
  axios
   .get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${marker.latitude}&lon=${marker.longitude}`
   )
   .then((res) => {
    console.log(res);
    const { city, county, village, country_code, road, suburb, state } =
     res.data.address;

    setCity(city || county || village);
    setCountry(country_code && String(country_code).toUpperCase());
    setAddress(
     (road && suburb && `${road}, ${suburb}`) ||
      (road && state && `${road}, ${state}`) ||
      ""
    );
    setInitialViewState({
     latitude: marker.latitude,
     longitude: marker.longitude,
     zoom: 3.5,
    });
   });
 };

 useEffect(() => {
  if (localStorage.getItem("user") && localStorage.getItem("ip")) {
   setCountry(JSON.parse(localStorage.getItem("ip") || "{}").countryCode);
   setInitialViewState({
    latitude: JSON.parse(localStorage.getItem("ip") || "{}").latitude,
    longitude: JSON.parse(localStorage.getItem("ip") || "{}").longitude,
    zoom: 3.5,
   });
   setMarker({
    longitude: JSON.parse(localStorage.getItem("ip") || "{}").longitude,
    latitude: JSON.parse(localStorage.getItem("ip") || "{}").latitude,
   });
   return;
  }

  router.push("/login");
 }, [router]);

 const handleSubmit = async (form: Form) => {
  if (form.attachments) {
   const formData = new FormData();

   for (let i = 0; i < form.attachments.length; i++) {
    formData.append("file", form.attachments[i]);
   }

   const res = await axios.post("http://localhost:5001/api/upload", formData, {
    headers: {
     "Content-Type": "multipart/form-data",
    },
   });

   axios
    .post(
     "/api/rooms",
     {
      country: form.country,
      city: form.city,
      address: form.address,
      occupied: form.occupied,
      capacity: form.capacity,
      price: form.price,
      rentFrequency: form.rentFrequency,
      description: form.description,
      accept: form.accept,
      equipments: form.equipments,
      features: form.features,
      allowPhone: form.allowPhone,
      allowEmail: form.allowEmail,
      allowMessaging: form.allowMessaging,
      allowLocation: form.allowLocation,
      attachments: res.data,
      languages: form.hostLanguages,
      propertyType: form.propertyType,
      housingType: form.housingType,
      securities: form.securities,
      userId: JSON.parse(localStorage.getItem("user") || "{}").userId as string,
     },
     {
      headers: {
       "content-type": "application/json",
       Accept: "application/json",
      },
     }
    )
    .then((res) => router.push(`/room/${res.data.roomId}`))
    .catch((err) => console.log(err));
   return;
  }

  axios
   .post("/api/rooms", {
    country: form.country,
    city: form.city,
    address: form.address,
    occupied: form.occupied,
    capacity: form.capacity,
    price: form.price,
    rentFrequency: form.rentFrequency,
    description: form.description,
    accept: form.accept,
    equipments: form.equipments,
    features: form.features,
    allowPhone: form.allowPhone,
    allowEmail: form.allowEmail,
    allowMessaging: form.allowMessaging,
    allowLocation: form.allowLocation,
    attachments: [],
    languages: form.hostLanguages,
    propertyType: form.propertyType,
    housingType: form.housingType,
    securities: form.securities,
    userId: JSON.parse(localStorage.getItem("user") || "{}").userId,
   })
   .then((res) => router.push(`/room/${res.data.roomId}`))
   .catch((err) => console.log(err));
 };

 const mockdata = [
  <>
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
      value={country}
      limit={10}
      onChange={(value) => setCountry(value!)}
      error={countryError && "Please select a valid country"}
      required
     />
    </div>
    <div className={cx(classes.item, classes.item33)}>
     <span className={classes.span}>
      <span>
       Select a city <span className={classes.required}>*</span>
      </span>
     </span>
     <TextInput
      placeholder="Enter a city"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      error={cityError && "Please enter a valid city"}
      required
     />
    </div>
    <div className={cx(classes.item, classes.item33, classes.chooseWithMap)}>
     <Button onClick={() => setModal((prev) => !prev)}>
      Or select with the map
     </Button>
    </div>
   </Group>
   <div className={classes.item}>
    <span className={classes.span}>Add a address (optional)</span>
    <TextInput
     placeholder="Enter a address"
     value={address}
     onChange={(e) => setAddress(e.target.value)}
    />
   </div>
   <Group position="apart">
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}>
      <span>
       Set the number of people living there{" "}
       <span className={classes.required}>*</span>
      </span>
     </span>
     <NumberInput
      placeholder="How many people live in your flatshare?"
      value={living}
      onChange={(value) => setLiving(value!)}
      min={0}
      error={livingError && "Please enter a valid number"}
      required
     />
    </div>
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}>
      <span>
       Set the reception capacity <span className={classes.required}>*</span>
      </span>
     </span>
     <NumberInput
      value={hostingCapacity}
      placeholder="How many people can you host?"
      onChange={(value) => setHostingCapacity(value!)}
      min={1}
      error={capacityError && "Please enter a valid number"}
      required
     />
    </div>
   </Group>

   <Group position="apart">
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}>Set the rent frequency (optional)</span>
     <Select
      placeholder="Enter the rent frquency"
      data={["Monthly", "Yearly", "Weekly", "Daily"]}
      value={rentFrequency}
      onChange={(value) => setRentFrequency(value as RentFrequency)}
     />
    </div>
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}>
      <span>
       Set the rent price <span className={classes.required}>*</span>
      </span>
     </span>
     <NumberInput
      placeholder="Rent price"
      defaultValue={0}
      value={price}
      onChange={(value) => setPrice(value!)}
      parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
      formatter={(value) =>
       !Number.isNaN(parseFloat(value!))
        ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "$ "
      }
      error={priceError && "Please enter a valid number"}
      required
     />
    </div>
   </Group>

   <Group position="apart">
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}>
      <span>
       Set the flatshare type <span className={classes.required}>*</span>
      </span>
     </span>
     <Select
      placeholder="Flatshare type"
      data={propertyTypeData}
      value={propertyType}
      onChange={(value) => setPropertyType(value as PropertyType)}
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
      value={housingType}
      onChange={(value) => setHousingType(value as HousingType)}
      required
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
      value={securities as string[]}
      onChange={(value) => setSecurities(value as SecuritiesType[])}
      searchable
     />
    </div>
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}>
      <span>
       Which languages do you speak? <span className={classes.required}>*</span>
      </span>
     </span>
     <MultiSelect
      placeholder="Languages"
      data={languagesData}
      value={languages as string[]}
      onChange={(value) => setLanguages(value as HostLanguages[])}
      searchable
      required
     />
    </div>
   </Group>
   <Group position="right" mb={15}>
    <Button onClick={() => setTab((prev) => (prev += 1))}>Next</Button>
   </Group>
  </>,
  <>
   <div className={classes.item}>
    <span className={classes.span}>
     <span>
      Describe your flatshare a bit! <span className={classes.required}>*</span>
     </span>
    </span>
    <Textarea
     placeholder="Add a description"
     autosize
     minRows={3}
     maxRows={6}
     value={description}
     onChange={(e) => setDescription(e.target.value)}
     error={descriptionError && "Please enter a valid description"}
     required
    />
   </div>
   <div className={cx(classes.item, classes.itemMB)}>
    <span className={classes.span}>Do you accept a certain range of age?</span>
    <RangeSlider
     defaultValue={[18, 100]}
     marks={[
      { value: 40, label: "40 years old" },
      { value: 80, label: "80 years old" },
     ]}
     min={18}
     value={range}
     onChange={(value) => setRange(value)}
    />
   </div>
   <div className={classes.item}>
    <span className={classes.span}>
     What are the key features of your flatshare?
    </span>
    <MultiSelect
     placeholder="Select one or more"
     data={featuresData}
     value={features as string[]}
     onChange={(value) => setRequirements(value as FeaturesType[])}
     searchable
    />
   </div>
   <div className={classes.item}>
    <span className={classes.span}>Do you have any extra equipment?</span>
    <MultiSelect
     placeholder="Select one or more"
     data={equipmentsData}
     value={equipments as string[]}
     onChange={(value) => setEquipments(value as EquipmentsType[])}
     searchable
    />
   </div>
   <Group position="apart" mb={15}>
    <Button color="red" onClick={() => setTab((prev) => (prev -= 1))}>
     Previous
    </Button>
    <Button onClick={() => setTab((prev) => (prev += 1))}>Next</Button>
   </Group>
  </>,
  <>
   <div className={classes.wrapper}>
    <h2>Here you can upload some pictures about your flatshare</h2>
    <div style={{ display: "flex", marginTop: 15 }}>
     <label className={classes.uploadLabel}>
      Upload
      <input
       type="file"
       name="file"
       id="file"
       onChange={(e) => setFiles(e.currentTarget.files)}
       accept="image/png, image/jpg, image/gif, image/jpeg"
       multiple
      />
     </label>
    </div>
    {files && (
     <div className={classes.imgContainer}>
      {Array.from(files as FileList).map((file, i) => {
       return (
        <div key={i}>
         <img
          src={URL.createObjectURL(file)}
          className={classes.imgPreview}
          alt={`Attachment n°${i + 1}`}
         />
         <span title={file.name}>{file.name}</span>
         <div
          onClick={() => {
           const array = Array.from(files as FileList);
           delete array[i];

           const dt = new DataTransfer();

           array.map((file) => dt.items.add(file));

           setFiles(dt.files);
          }}
         >
          <AiFillDelete />
         </div>
        </div>
       );
      })}
     </div>
    )}
   </div>
   <Group position="apart" mb={15}>
    <Button color="red" onClick={() => setTab((prev) => (prev -= 1))}>
     Previous
    </Button>
    <Button onClick={() => setTab((prev) => (prev += 1))}>Next</Button>
   </Group>
  </>,
  <>
   <Group position="apart">
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}></span>
     <Checkbox
      size="md"
      label="Allow others users to see your phone number?"
      checked={allowPhone}
      onChange={() => setAllowPhone((prev) => !prev)}
     />
    </div>
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}></span>
     <Checkbox
      size="md"
      label="Allow others users to see your email address?"
      checked={allowEmail}
      onChange={() => setAllowEmail((prev) => !prev)}
     />
    </div>
   </Group>
   <Group position="apart">
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}></span>
     <Checkbox
      size="md"
      label="Allow others users to contact you via the messaging?"
      checked={allowMessaging}
      onChange={() => setAllowMessaging((prev) => !prev)}
     />
    </div>
    <div className={cx(classes.item, classes.item50)}>
     <span className={classes.span}></span>
     <Checkbox
      size="md"
      label="Allow others users to see the exact address?"
      checked={allowLocation}
      onChange={() => setAllowLocation((prev) => !prev)}
     />
    </div>
   </Group>
   <Group position="apart" mb={15}>
    <Button color="red" onClick={() => setTab((prev) => (prev -= 1))}>
     Previous
    </Button>
    <Button color="green" type="submit">
     Finish
    </Button>
   </Group>
  </>,
 ];

 return (
  <Container size={1120}>
   <h1>Create a flatshare</h1>
   <div className={classes.tlWrapper}>
    <Progress>
     <Item
      active={true}
      color={"#228be6"}
      title="Basic informations"
      description="In this part you give us the basic informations about you and your flatshare"
      onClick={() => setTab(0)}
      childrenLength={4}
     />
     <Item
      active={tab >= 1}
      color={"#228be6"}
      title="Description, requirements"
      description="In this part you can describe your flatshare and add settings"
      dashed={tab < 1}
      onClick={() => setTab(1)}
      childrenLength={4}
      before
     />
     <Item
      active={tab >= 2}
      color={"#228be6"}
      title="Attachments"
      description="In this part you can upload some pictures"
      dashed={tab < 2}
      onClick={() => setTab(2)}
      childrenLength={4}
      before
     />
     <Item
      active={tab >= 3}
      color={"#228be6"}
      title="Privacy concerns"
      description="In this part you allow others user to see or not your contact information"
      dashed={tab < 3}
      onClick={() => setTab(3)}
      childrenLength={4}
      before
     />
    </Progress>
   </div>
   <form
    onSubmit={(e) => {
     e.preventDefault();
     if (!country || !city || !price || !living || !hostingCapacity) {
      setTab(0);
      if (!country) setCountryError(true);
      if (!city) setCityError(true);
      if (!price) setPriceError(true);
      if (!living) setLivingError(true);
      if (!hostingCapacity) setCapacityError(true);

      if (!description) setDescriptionError(true);
      return;
     }
     if (!description) {
      setDescriptionError(true);
      setTab(1);
      return;
     }

     setLivingError(false);
     setCapacityError(false);
     setPriceError(false);
     setCityError(false);
     setCountryError(false);
     setDescriptionError(false);

     console.log({
      country,
      address,
      city,
      occupied: living,
      capacity: hostingCapacity,
      housingType: housingType as HousingType,
      hostLanguages: languages,
      propertyType: propertyType as PropertyType,
      features,
      securities,
      rentFrequency,
      price,
      accept: range,
      description,
      equipments,
      allowPhone,
      allowEmail,
      allowMessaging,
      allowLocation,
      attachments: files,
      userId: "",
     } as Form);

     handleSubmit({
      country,
      address,
      city,
      occupied: living,
      capacity: hostingCapacity,
      housingType: housingType as HousingType,
      hostLanguages: languages,
      propertyType: propertyType as PropertyType,
      features,
      securities,
      rentFrequency,
      price,
      accept: range,
      description,
      equipments,
      allowPhone,
      allowEmail,
      allowMessaging,
      allowLocation,
      attachments: files,
      userId: "",
     });
    }}
   >
    {mockdata[tab]}
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
 );
};

export default Create;
