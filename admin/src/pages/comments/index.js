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
import axios from "axios";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "src/components/search-bar";
import { CommentsTable } from "src/components/comments/comments-table";

const categories = ["all", "notice", "general", "review"];
const filters = ["all", "title", "content", "writer"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [comments, setComments] = useState([]);
  const [category, setCategory] = useState(categories[0]);
  const [filter, setFilter] = useState(filters[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchComments = useCallback(async (params) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/comments/list`, {
        withCredentials: true,
        params,
      });

      if (!res || res.status !== 200) {
        throw new Error("Invalid response");
      }

      const data = res.data;

      let commentData = [];
      let pagination = {};

      if (data && data.data) {
        commentData = data.data.data ? data.data.data : [];
        pagination = data.data.pagination ? data.data.pagination : {};
      }

      return {
        comments: commentData,
        pagination: pagination,
      };
    } catch (err) {
      throw err;
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

      await searchComments(params);
    },
    [filter, searchTerm]
  );

  useEffect(() => {
    const params = {};

    if (category !== "all") {
      params.category = category;
    }

    params.page = page;

    searchComments(params);
  }, [category, page]);

  useEffect(() => {
    const params = {};

    if (category !== "all") {
      params.category = category;
    }

    params.page = page;

    searchComments(params)
      .then((res) => {
        setComments(res.comments);
        setPageCount(res.pagination.totalPages);
        setPage(res.pagination.currentPage);
      })
      .catch((err) => {
        console.log(err);
        setComments([]);
        setPageCount(1);
        setPage(1);
      });
  }, [category, page]);

  return (
    <>
      <Head>
        <title>Comments</title>
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
                <Typography variant="h4">Comments</Typography>
              </Stack>
              <Select value={category} onChange={handleCategoryChange}>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <CommentsTable
              items={comments}
              page={page}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
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
