import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Unstable_Grid2 as Grid,
  Button,
} from "@mui/material";
import Image from "next/image";
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

const initialValues = {
  name: "",
  description: "",
  type: 0,
  image: null,
  preview: "",
};

export const EventBadgeMintForm = ({ handleMintBadge }) => {
  const [values, setValues] = useState(initialValues);

  const imageInputRef = useRef();

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name === "image") {
      const reader = new FileReader();
      const file = event.target.files[0];
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
        handleMintBadge(values);
        setValues(initialValues);
        imageInputRef.current.value = "";
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
                />
              </Grid>
              {values.preview && (
                <Grid item xs={12} md={6}>
                  <Image src={values.preview} alt="preview" width={200} height={200} />
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
