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
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { object, string, number, date, array, mixed } from "yup";

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

const initialValues = {
  name: "",
  description: "",
  type: 0,
  image: null,
  preview: "",
};

const badgeMintSchema = object({
  name: string().required(),
  description: string().required(),
  type: number().min(0).max(2).required(),
  image: mixed(),
});

export const EventBadgeMintForm = ({ eventId }) => {
  const [values, setValues] = useState(initialValues);

  const imageInputRef = useRef();

  const router = useRouter();

  const mintBadge = useCallback(async () => {
    try {
      console.log(values);
      const validated = await badgeMintSchema.validate(values);

      const formData = new FormData();

      formData.append("name", validated.name);
      formData.append("description", validated.description);
      formData.append("type", validated.type);
      formData.append("image", validated.image);
      formData.append("event_id", eventId);

      const res = await axios.post("http://localhost:8080/admin/events/createBadge", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res && res.status === 200) {
        router.reload();
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name === "image") {
      const file = event.target.files[0];

      if (!file.type.startsWith("image/")) {
        throw new Error("File is not an image");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setValues((prev) => ({
          ...prev,
          image: file,
          preview: reader.result,
        }));
      };

      reader.readAsDataURL(file);
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
        mintBadge();
      } catch (error) {
        console.log(error);
      }
    },
    [values]
  );

  const handleClear = useCallback(() => {
    setValues(initialValues);
    imageInputRef.current.value = "";
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
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Badge Description"
                  name="description"
                  onChange={handleChange}
                  required
                  value={values.description}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Badge Type"
                  name="type"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.type}
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
                  onChange={handleChange}
                  required
                  type="file"
                  inputRef={imageInputRef}
                  inputProps={{
                    accept: "image/*",
                  }}
                />
              </Grid>
              {values.preview && (
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
                    <Image src={values.preview} alt="preview" width={200} height={200} />
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
