import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  Select,
  MenuItem,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PostsTable } from "src/components/posts/posts-table";
import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "src/components/search-bar";
import { useRouter } from "next/router";
import axios from "axios";

const filters = ["all", "title", "content"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(filters[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const searchNotice = useCallback(async (params) => {
    try {
      const res = await axios.get("http://localhost:8080/admin/notice/list", {
        withCredentials: true,
        params,
      });

      if (!res || res.status !== 200) {
        throw new Error("Invalid response");
      }

      const data = res.data;

      if (data && data.data) {
        const noticeData = data.data.data;
        const pagination = data.data.pagination;

        if (!noticeData) {
          setPosts([]);
          setPageCount(1);
          setPage(1);
          return;
        }

        if (!pagination) {
          setPosts(noticeData);
          setPageCount(1);
          setPage(1);
          return;
        }

        setPosts(noticeData);
        setPageCount(pagination.totalPages);
        setPage(pagination.currentPage);
      } else {
        throw new Error(data.message ? data.message : "Invalid response");
      }
    } catch (error) {
      console.log(error);
      setPosts([]);
      setPageCount(1);
      setPage(1);
    }
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value);
  }, []);

  const handleSearchTermChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchTermSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!searchTerm) return;

      const params = {};

      if (filter !== "all") {
        switch (filter) {
          case "title":
            params.title = searchTerm;
            break;
          case "content":
            params.content = searchTerm;
            break;
          default:
            throw new Error("Invalid filter");
        }
      }

      await searchNotice(params);
    },
    [filter, searchTerm]
  );

  useEffect(() => {
    const params = {};
    params.page = page;

    searchNotice(params);
  }, [page]);

  return (
    <>
      <Head>
        <title>Notice</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Notice</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => router.push("/notice/create")}
                >
                  Add
                </Button>
              </Stack>
            </Stack>
            <PostsTable
              items={posts}
              page={page}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
              path="/notice"
            />
            <SearchBar
              filters={filters}
              filter={filter}
              handleFilterChange={handleFilterChange}
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTermChange}
              handleSearchTermSubmit={handleSearchTermSubmit}
              placeholder={"Search Notice"}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
