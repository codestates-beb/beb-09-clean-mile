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

const data = [
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "hic-modi-officia",
    content: "Doloribus voluptatem voluptatem.",
    writer: "Beatty",
    view: 12,
    createdAt: "27/03/2019",
    category: "notice",
  },
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "hic-modi-officia",
    content: "Doloribus voluptatem voluptatem.",
    writer: "Beatty",
    view: 12,
    createdAt: "27/03/2019",
    category: "notice",
  },
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "hic-modi-officia",
    content: "Doloribus voluptatem voluptatem.",
    writer: "Beatty",
    view: 12,
    createdAt: "27/03/2019",
    category: "notice",
  },
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "hic-modi-officia",
    content: "Doloribus voluptatem voluptatem.",
    writer: "Beatty",
    view: 12,
    createdAt: "27/03/2019",
    category: "notice",
  },
];

const filters = ["all", "title", "content"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [posts, setPosts] = useState(data);
  const [filter, setFilter] = useState(filters[0]);
  const [searchTerm, setSearchTerm] = useState("");

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
    (event) => {
      event.preventDefault();

      if (!searchTerm) return;
      console.log(filter, searchTerm);
    },
    [filter, searchTerm]
  );

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
