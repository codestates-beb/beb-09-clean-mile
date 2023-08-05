import Head from "next/head";
import { Box, Container, Stack, Select, MenuItem, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "src/components/search-bar";
import { PostsTable } from "src/components/posts/posts-table";
import axios from "axios";

const categories = ["all", "general", "review"];
const filters = ["all", "title", "content", "writer"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(categories[0]);
  const [filter, setFilter] = useState(filters[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchPosts = useCallback(async (params) => {
    try {
      const res = await axios.get("http://localhost:7000/admin/posts/list", {
        withCredentials: true,
        params,
      });

      if (!res || res.status !== 200) {
        throw new Error("Invalid response");
      }

      const data = res.data;

      if (data && data.data) {
        const postData = data.data.data;
        const pagination = data.data.pagination;

        if (!postData) {
          setPosts([]);
          setPageCount(1);
          setPage(1);
          return;
        }

        if (!pagination) {
          setPosts(postData);
          setPageCount(1);
          setPage(1);
          return;
        }

        setPosts(postData);
        setPageCount(pagination.totalPages);
        setPage(pagination.currentPage);
      } else {
        throw new Error(data.message ? data.message : "Invalid response");
      }
    } catch (err) {
      console.log(err);
      setPosts([]);
      setPageCount(1);
      setPage(1);
    }
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleCategoryChange = useCallback((event) => {
    setCategory(event.target.value);
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

      if (category !== "all") {
        params.category = category;
      }

      if (filter !== "all") {
        switch (filter) {
          case "title":
            params.title = searchTerm;
            break;
          case "content":
            params.content = searchTerm;
            break;
          case "writer":
            params.writer = searchTerm;
            break;
          default:
            throw new Error("Invalid filter");
        }
      }

      await searchPosts(params);
    },
    [filter, searchTerm]
  );

  useEffect(() => {
    const params = {};

    if (category !== "all") {
      params.category = category;
    }

    params.page = page;

    searchPosts(params);
  }, [category, page]);

  return (
    <>
      <Head>
        <title>Community</title>
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
                <Typography variant="h4">Community</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Select value={category} onChange={handleCategoryChange}>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
            <PostsTable
              items={posts}
              page={page}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
              path={"/community"}
            />
            <SearchBar
              filters={filters}
              filter={filter}
              handleFilterChange={handleFilterChange}
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTermChange}
              handleSearchTermSubmit={handleSearchTermSubmit}
              placeholder={"Search Post"}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
