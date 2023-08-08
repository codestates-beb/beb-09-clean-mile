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
import axios from "axios";
import Swal from "sweetalert2";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";

const types = [
  {
    value: 0,
    label: "Bronze",
  },
  {
    value: 1,
    label: "Silver",
  },
  {
    value: 2,
    label: "Gold",
  },
];

const EXTENSIONS = [{ type: "gif" }, { type: "jpg" }, { type: "jpeg" }, { type: "png" }];

export const EventBadgeMintForm = ({ eventId }) => {
  const router = useRouter();
  const imageInputRef = useRef(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  /**
   * 파일 업로드 이벤트를 처리
   * @param {Event} e - 파일 업로드 이벤트
   * @returns {void}
   */
  const fileUpload = (e) => {
    if (e.target.files) {
      const FILE = e.target.files[0];
      const SIZE = 10;
      const TYPE = FILE.type.split("/")[1];
      const FSIZE = FILE.size / Math.pow(10, 6);

      if (FSIZE < SIZE) {
        EXTENSIONS.forEach((e) => {
          if (e.type === TYPE) {
            const objectURL = URL.createObjectURL(FILE);
            setFileUrl(objectURL);
            setUploadFile(FILE);
          }
        });
      }
    }
  };

  const mintBadge = useCallback(async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", desc);
      formData.append("type", type);
      formData.append("image", uploadFile);
      formData.append("event_id", eventId);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/createBadge`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res && res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6BCB77",
        }).then(() => {
          Swal.close();
          router.push(`/events/${eventId}`);
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
      console.log(error);
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
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    try {
      mintBadge();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleClear = useCallback(() => {
    setName("");
    setDesc("");
    setType("");
    setUploadFile("");
  });

  return (
    <form autoComplete="off" noValidate>
      <Card sx={{ p: 3 }}>
        <CardHeader title="Mint" />
        <CardContent sx={{ pt: 1 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Badge Name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  value={name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Badge Description"
                  name="description"
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  value={desc}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Badge Type"
                  name="type"
                  onChange={(e) => setType(e.target.value)}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={type}
                >
                  {types.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Badge Image"
                  name="image"
                  onChange={fileUpload}
                  required
                  type="file"
                  inputProps={{
                    accept: "image/*",
                  }}
                />
              </Grid>
              {fileUrl && (
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
                      flexDirection: "column",
                      pb: 3,
                    }}
                  >
                    <Image src={fileUrl} alt="preview" width={200} height={200} />
                  </Box>
                </Grid>
              )}
            </Grid>
            <Stack direction={"row"} spacing={1} sx={{ mt: 3 }}>
              <Button variant="contained" color="success" onClick={handleSubmit}>
                Mint
              </Button>
              <Button variant="contained" color="warning" onClick={handleClear}>
                Clear
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};
