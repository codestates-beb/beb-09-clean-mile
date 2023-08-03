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
import Image from "next/image";

import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";

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
  event_type: types[0],
  recruitment_start_at: new Date(),
  recruitment_end_at: new Date(),
  event_start_at: new Date(),
  event_end_at: new Date(),
  poster_image: [],
  preview: [],
};

export const EventCreateForm = ({ handleCreateEvent }) => {
  const [values, setValues] = useState(initialValues);
  const router = useRouter();
  const imageInputRef = useRef();

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name === "poster_image") {
      const reader = new FileReader();

      for (const file of event.target.files) {
        reader.onloadend = () => {
          setValues((prev) => ({
            ...prev,
            poster_image: [...prev.poster_image, file],
            preview: [...prev.preview, reader.result],
          }));
        };

        reader.readAsDataURL(file);
      }

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
        handleCreateEvent(values);
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
    <form autoComplete="off" noValidate>
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
                  type="number"
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
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Recruitment End At"
                    value={values.recruitment_end_at}
                    onChange={(newValue) => {
                      setValues((prev) => ({
                        ...prev,
                        recruitment_end_at: newValue,
                      }));
                    }}
                    name="recruitment_end_at"
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
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Create
        </Button>
        <Button variant="contained" color="warning" onClick={handleCancel}>
          Back
        </Button>
      </Stack>
    </form>
  );
};
