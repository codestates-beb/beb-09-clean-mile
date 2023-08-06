import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
  Stack,
  Button,
  Typography,
} from "@mui/material";

export const NoticeEditForm = ({ post }) => {
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const editNotice = async () => {
    try {
      const formData = new FormData();

      formData.append("id", post._id);
      formData.append("title", title);
      formData.append("content", content);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/notice/edit`,
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
          router.push(`/notice/${post._id}`);
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
        <CardHeader title="Notice" />
        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  value={title}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={12}
                  label="Content"
                  name="content"
                  onChange={(e) => setContent(e.target.value)}
                  required
                  value={content}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Stack direction={"row"} spacing={1} sx={{ mt: 3, justifyContent: "right" }}>
        <Button variant="contained" color="success" onClick={editNotice}>
          Edit
        </Button>
        <Button variant="contained" color="warning" onClick={() => router.back()}>
          Cancel
        </Button>
      </Stack>
    </>
  );
};
