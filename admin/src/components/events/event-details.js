import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { MediaSlider } from "../media-slider";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import Image from "next/image";

export const EventDetails = ({ event }) => {
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Detail" />
      <CardContent sx={{ pt: 1 }}>
        {event && (
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID"
                  name="id"
                  value={event._id ? event._id : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Event Type"
                  name="event_type"
                  value={event.event_type ? event.event_type : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  value={event.status ? event.status : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={event.location ? event.location : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={event.title ? event.title : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="View"
                  name="view"
                  value={event.view ? event.view.count : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Recruitment Start At"
                  name="recruitment_start_at"
                  value={
                    event.recruitment_start_at
                      ? format(utcToZonedTime(event.recruitment_start_at), "yyyy-MM-dd HH:mm:ss")
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Recruitment End At"
                  name="recruitment_end_at"
                  value={
                    event.recruitment_end_at
                      ? format(utcToZonedTime(event.recruitment_end_at), "yyyy-MM-dd HH:mm:ss")
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Event Start At"
                  name="event_start_at"
                  value={
                    event.event_start_at
                      ? format(utcToZonedTime(event.event_start_at), "yyyy-MM-dd HH:mm:ss")
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Event End At"
                  name="event_end_at"
                  value={
                    event.event_end_at
                      ? format(utcToZonedTime(event.event_end_at), "yyyy-MM-dd HH:mm:ss")
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={12}>
                <TextField
                  fullWidth
                  multiline
                  label="Content"
                  name="content"
                  value={event.content ? event.content : "N/A"}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Created At"
                  name="created_at"
                  value={
                    event.created_at
                      ? format(utcToZonedTime(event.created_at), "yyyy-MM-dd HH:mm:ss")
                      : "N/A"
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                ></TextField>
              </Grid>
              {event.poster_url?.length &&
                (event.poster_url.length > 1 ? (
                  <Grid
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    xs={12}
                  >
                    <Grid xs={12} sm={12} md={6} spacing={3}>
                      <MediaSlider
                        media={[
                          ...event.poster_url.map((item) => {
                            return { type: "image", src: item };
                          }),
                        ]}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                    xs={12}
                  >
                    <Grid xs={12} sm={12} md={6} spacing={3}>
                      <Image
                        src={event.poster_url[0]}
                        width={500}
                        height={500}
                        alt="poster image"
                      />
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
