import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from 'axios';
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
import { object, string, number, date, array } from "yup";

const initialValues = {
  title: "",
  content: "",
  image: [],
  video: [],
  preview: [],
};

const createPostSchema = object({
  title: string().required(),
  content: string().required(),
  image: array(),
  video: array(),
});

export const NoticeCreateForm = () => {
  const [values, setValues] = useState(initialValues);
  const imageInputRef = useRef(null);

  const router = useRouter();

  const createNotice = async () => {
    try {
      const validated = await createPostSchema.validate(values);

      const formData = new FormData();
      for (const key in validated) {
        if (key === "image") {
          for (const image of validated[key]) {
            formData.append(key, image);
          }
          continue;
        }
        formData.append(key, validated[key]);
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/notice/create`,
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
          router.push(`/notice`);
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

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name === "image") {
      const reader = new FileReader();

      for (const file of event.target.files) {
        reader.onloadend = () => {
          setValues((prev) => ({
            ...prev,
            image: [...prev.image, file],
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
        createNotice();
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
        <CardHeader title="Notice" />
        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  onChange={handleChange}
                  required
                  value={values.title}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={12}
                  label="Content"
                  name="content"
                  onChange={handleChange}
                  required
                  value={values.content}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Image"
                  name="image"
                  onChange={handleChange}
                  required
                  type="file"
                  inputRef={imageInputRef}
                  inputProps={{
                    multiple: true,
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
