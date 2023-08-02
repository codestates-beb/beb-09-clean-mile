import Head from "next/head";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { NoticeCreateForm } from "src/components/notice/notice-create-form";

const initialValues = {
  title: "",
  content: "",
  image: null,
  video: null,
};

const Page = () => {
  const [values, setValues] = useState(initialValues);

  const imageInputRef = useRef(null);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name === "image") {
      const file = event.target.files[0];
      console.log(file);
      console.log(imageInputRef);
      setValues((prev) => ({
        ...prev,
        image: file,
      }));
      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const router = useRouter();
  return (
    <>
      <Head>
        <title>Create Notice</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Create Notice</Typography>
              <Stack direction={"row"} spacing={1}>
                <Button variant="contained" color="success">
                  Create
                </Button>
                <Button variant="contained" onClick={() => router.back()}>
                  Back
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <NoticeCreateForm
              values={values}
              handleChange={handleChange}
              imageInputRef={imageInputRef}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
