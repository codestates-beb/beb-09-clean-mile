import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import cookie from "cookie";
import axios from "axios";
import Swal from "sweetalert2";
import { Box, Container, Stack, Typography, Button, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PostDetails } from "src/components/posts/post-details";
import { PostComments } from "src/components/posts/post-comments";

const Page = ({ post, comments }) => {
  const router = useRouter();

  const [tabNum, setTabNum] = useState("1");

  const handleTabChange = (event, value) => {
    setTabNum(value);
  };

  const deletePost = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/notice/delete/${post._id}`,
        {
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
          router.push(`/community`);
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
        text: error.response.data.message,
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
      <Head>
        <title>Notice</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Notice</Typography>
              <Stack direction={"row"} spacing={1}>
                <Button variant="contained" color="warning" onClick={deletePost}>
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push(`/notice/edit/${post._id}`)}
                >
                  Edit
                </Button>
                <Button variant="contained" onClick={() => router.back()}>
                  Back
                </Button>
              </Stack>
            </Stack>
            <TabContext value={tabNum}>
              <TabList onChange={handleTabChange}>
                <Tab label="Detail" value="1" />
                <Tab label="Comments" value="2" />
              </TabList>
              <TabPanel value={"1"}>
                <PostDetails post={post} />
              </TabPanel>
              <TabPanel value={"2"}>
                <PostComments comments={comments} />
              </TabPanel>
            </TabContext>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  const cookiesObj = cookie.parse(context.req.headers.cookie || "");

  let cookiesStr = "";
  if (context.req && cookiesObj) {
    cookiesStr = Object.entries(cookiesObj)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
    axios.defaults.headers.Cookie = cookiesStr;
  }
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/posts/detail/${id}`, {
      withCredentials: true,
    });

    const post = res.data.data.post;
    const comments = res.data.data.comments;

    return {
      props: {
        post,
        comments,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        post: null,
        comments: null,
      },
    };
  }
};
