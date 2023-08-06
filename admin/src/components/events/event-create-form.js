import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Unstable_Grid2 as Grid,
  Button,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { object, string, number, date, array } from "yup";
import Swal from "sweetalert2";

const types = [
  {
    value: "fcfs",
    label: "First Come First Serve",
  },
  {
    value: "random",
    label: "Random",
  },
];

const initialValues = {
  name: "",
  email: "",
  phone_number: "",
  wallet_address: "",
  organization: "",
  title: "",
  content: "",
  location: "",
  capacity: 0,
  event_type: types[0].value,
  recruitment_start_at: new Date(),
  recruitment_end_at: new Date(),
  event_start_at: new Date(),
  event_end_at: new Date(),
  poster_image: [],
  preview: [],
};

const createEventSchema = object({
  name: string().required(),
  email: string().email().required(),
  phone_number: string().required(),
  wallet_address: string().required(),
  organization: string().required(),
  title: string().required(),
  content: string().required(),
  location: string().required(),
  capacity: number().positive().integer().required(),
  event_type: string()
    .oneOf(types.map((type) => type.value))
    .required(),
  recruitment_start_at: date().required(),
  recruitment_end_at: date().required(),
  event_start_at: date().required(),
  event_end_at: date().required(),
  poster_image: array().min(1).required(),
});

export const EventCreateForm = () => {
  const [values, setValues] = useState(initialValues);
  const router = useRouter();
  const imageInputRef = useRef();

  const today = dayjs();

  const createEvent = async () => {
    try {
      const validated = await createEventSchema.validate(values);

      const formData = new FormData();
      for (const key in validated) {
        if (key === "poster_image") {
          for (const image of validated[key]) {
            formData.append(key, image);
          }
          continue;
        }
        formData.append(key, validated[key]);
      }

      const res = await axios.post("http://localhost:7000/admin/events/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res && res.status === 200) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showCancelButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: "success",
          title: res.data.message,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        router.push("/events");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name === "poster_image") {
      const poster_image = [];
      const preview = [];
      const files = [];

      for (const file of event.target.files) {
        if (!file.type.startsWith("image/")) {
          imageInputRef.current.value = "";
          throw new Error("File type must be image");
        }

        const reader = new FileReader();

        reader.onloadend = () => {
          poster_image.push(file);
          preview.push(reader.result);
        };

        reader.readAsDataURL(file);

        files.push(file);
      }

      setValues((prev) => ({
        ...prev,
        poster_image,
        preview,
      }));

      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      try {
        createEvent();
        setValues(initialValues);
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
      } catch (error) {
        console.log(error);
      }
    },
    [values]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card sx={{ p: 3 }}>
        <CardHeader title="Host" />
        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host Email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host Phone Number"
                  name="phone_number"
                  onChange={handleChange}
                  required
                  value={values.phone_number}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host Wallet Address"
                  name="wallet_address"
                  onChange={handleChange}
                  required
                  value={values.wallet_address}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Organization"
                  name="organization"
                  onChange={handleChange}
                  required
                  value={values.organization}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ p: 3, mt: 3 }}>
        <CardHeader title="Event" />
        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  onChange={handleChange}
                  required
                  value={values.title}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Event Type"
                  name="event_type"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.event_type}
                >
                  {types.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  onChange={handleChange}
                  required
                  value={values.location}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Capacity"
                  name="capacity"
                  onChange={handleChange}
                  required
                  value={values.capacity}
                  type="number"
                />
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns} sx={{}}>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Recruitment Start At"
                    value={values.recruitment_start_at}
                    onChange={(newValue) => {
                      setValues((prev) => ({
                        ...prev,
                        recruitment_start_at: newValue,
                      }));
                    }}
                    name="recruitment_start_at"
                    disablePast
                    views={["year", "month", "day", "hours", "minutes"]}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Recruitment End At"
                    defaultValue={today}
                    value={values.recruitment_end_at}
                    onChange={(newValue) => {
                      setValues((prev) => ({
                        ...prev,
                        recruitment_end_at: newValue,
                      }));
                    }}
                    name="recruitment_end_at"
                    disablePast
                    views={["year", "month", "day", "hours", "minutes"]}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Event Start At"
                    value={values.event_start_at}
                    onChange={(newValue) => {
                      setValues((prev) => ({
                        ...prev,
                        event_start_at: newValue,
                      }));
                    }}
                    name="event_start_at"
                    disablePast
                    views={["year", "month", "day", "hours", "minutes"]}
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Event End At"
                    value={values.event_end_at}
                    onChange={(newValue) => {
                      setValues((prev) => ({
                        ...prev,
                        event_end_at: newValue,
                      }));
                    }}
                    name="event_end_at"
                    disablePast
                    views={["year", "month", "day", "hours", "minutes"]}
                  />
                </Grid>
              </LocalizationProvider>
              <Grid xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Content"
                  name="content"
                  onChange={handleChange}
                  required
                  value={values.content}
                  multiline
                  rows={8}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Poster Image"
                  name="poster_image"
                  onChange={handleChange}
                  required
                  multiple
                  type="file"
                  inputRef={imageInputRef}
                  inputProps={{
                    multiple: true,
                    accept: "image/*",
                  }}
                />
              </Grid>
              {values.preview.length > 0 && (
                <Grid
                  item
                  xs={12}
                  spacing={3}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    m: 1.6,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ pb: 1 }}>
                    Preview
                  </Typography>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "row",
                      pb: 3,
                    }}
                  >
                    {values.preview.map((image, index) => (
                      <Image key={index} src={image} width={200} height={200} />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Stack direction={"row"} spacing={1} sx={{ mt: 3, justifyContent: "right" }}>
        <Button variant="contained" color="success" type="submit">
          Create
        </Button>
        <Button variant="contained" color="warning" onClick={handleCancel}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};
