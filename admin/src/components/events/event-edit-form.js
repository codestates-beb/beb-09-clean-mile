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
import Swal from "sweetalert2";
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

export const EventEditForm = ({ event, host }) => {
  const router = useRouter();
  
  const [name, setName] = useState(host.name);
  const [email, setEmail] = useState(host.email);
  const [phoneNumber, setPhoneNumber] = useState(host.phone_number);
  const [address, setAddress] = useState(host.wallet_address);
  const [organization, setOrganization] = useState(host.organization);
  const [title, setTitle] = useState(event.title);
  const [content, setContent] = useState(event.content);
  const [location, setLocation] = useState(event.location);
  const [eventType, setEventType] = useState(event.event_type);
  const [capacity, setCapacity] = useState(event.capacity);
  const [recruitmentStart, setRecruitmentStart] = useState(event.recruitment_start_at);
  const [recruitmentEnd, setRecruitmentEnd] = useState(event.recruitment_end_at);
  const [eventStart, setEventStart] = useState(event.event_start_at);
  const [eventEnd, setEventEnd] = useState(event.event_end_at);


  const editEvent = async () => {
    try {
      const formData = new FormData();

      formData.append("event_id", event._id);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone_number", phoneNumber);
      formData.append("wallet_address", address);
      formData.append("organization", organization);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("location", location);
      formData.append("capacity", capacity);
      formData.append("event_type", eventType);
      formData.append("recruitment_start_at", recruitmentStart);
      formData.append("recruitment_end_at", recruitmentEnd);
      formData.append("event_start_at", eventStart);
      formData.append("event_end_at", eventEnd);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res && res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
          router.push(`/events/${event._id}`);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: res.data.message,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#6BCB77",
      }).then(() => {
        Swal.close();
      });
    }
  };

  return (
    <>
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
                  onChange={(e) => setName(e.target.value)}
                  required
                  value={name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host Email"
                  name="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  value={email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host Phone Number"
                  name="phone_number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  value={phoneNumber}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Host Wallet Address"
                  name="wallet_address"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  value={address}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Organization"
                  name="organization"
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  value={organization}
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
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  value={title}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Event Type"
                  name="event_type"
                  onChange={(e) => setEventType(e.target.value)}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={eventType}
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
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  value={location}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Capacity"
                  name="capacity"
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                  value={capacity}
                  type="number"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns} sx={{}}>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Recruitment Start At"
                    value={recruitmentStart}
                    onChange={(date) => setRecruitmentStart(date)}
                    name="recruitment_start_at"
                    disablePast
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Recruitment End At"
                    value={recruitmentEnd}
                    onChange={(date) => setRecruitmentEnd(date)}
                    name="recruitment_end_at"
                    disablePast
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Event Start At"
                    value={eventStart}
                    onChange={(date) => setEventStart(date)}
                    name="event_start_at"
                    disablePast
                  />
                </Grid>
                <Grid xs={12} md={6}>
                  <DateTimePicker
                    renderInput={(props) => <TextField fullWidth required {...props} />}
                    label="Event End At"
                    value={eventEnd}
                    onChange={(date) => setEventEnd(date)}
                    name="event_end_at"
                    disablePast
                  />
                </Grid>
              </LocalizationProvider>
              <Grid xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Content"
                  name="content"
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  required
                  value={content}
                  multiline
                  rows={8}
                />
              </Grid>
              {event.poster_url.length > 0 && (
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
                    {event.poster_url.map((image, index) => (
                      <Image key={index} src={image} width={200} height={200} alt="post image" />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Stack direction={"row"} spacing={1} sx={{ mt: 3, justifyContent: "right" }}>
        <Button variant="contained" color="success" onClick={editEvent}>
          Edit
        </Button>
        <Button variant="contained" color="warning" onClick={() => router.back()}>
          Cancel
        </Button>
      </Stack>
    </>
  );
};
