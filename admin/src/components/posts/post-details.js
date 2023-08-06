import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { MediaSlider } from "../media-slider";

export const PostDetails = ({ post }) => {
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Detail" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="ID"
                name="id"
                value={post._id}
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
                value={post.category}
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
                value={post.title}
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
                value={post.user_id === null ? "Unknwon" : post.user_id.nickname}
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
                value={post.view.count}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {post.event_id && (
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
                value={post.created_at}
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
                value={post.content}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
            {post.media && (
              <Grid
                sx={{
                  width: '100%',
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Grid xs={12} sm={12} md={6} spacing={3} sx={{ width: '100%' }}>
                  <MediaSlider
                    media={[
                      ...post.media.img?.map((item) => ({ src: item, type: "image" })),
                      ...post.media.video?.map((item) => ({ src: item, type: "video" })),
                    ]}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
