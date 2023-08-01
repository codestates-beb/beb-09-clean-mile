import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export const EventHost = ({ host }) => {
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Host" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="ID"
                name="id"
                value={host.id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={values.category}
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
                value={values.title}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Writer"
                name="writer"
                value={values.writer}
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
                value={values.view}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {values.event_id && (
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Event ID"
                  name="event_id"
                  value={event_id}
                  InputProps={{
                    readOnly: true,
                  }}
                ></TextField>
              </Grid>
            )}
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Created At"
                name="created_at"
                value={values.created_at}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
            <Grid xs={12} md={12}>
              <TextField
                fullWidth
                multiline
                label="Content"
                name="content"
                value={values.content}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
