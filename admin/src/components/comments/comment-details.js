import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export const CommentDetails = () => {
  const [values, setValues] = useState({
    id: "1tACdzxeYHM5kNWLfLmKQjeTM",
    post_id: "1tACdzxeYHM5kNWLfLmKQjeTM",
    category: "한식",
    title: "엄마가 준비한 식사",
    likes: 50000000000000,
    content: "엄마가 준비한 식사입니다. 맛있게 드세요.",
    created_at: "2021-10-01 00:00:00",
  });

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
                value={values.id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Post ID"
                name="post_id"
                value={values.post_id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Post Title"
                name="post title"
                value={values.title}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Post Category"
                name="post category"
                value={values.category}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Likes"
                name="likes"
                value={values.likes}
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
                minRows={4}
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
