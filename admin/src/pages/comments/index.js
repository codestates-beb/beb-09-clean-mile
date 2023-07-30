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
import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "src/components/search-bar";
import { CommentsTable } from "src/components/comments/comments-table";

const data = [
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "hic-modi-officia",
    content: "Doloribus voluptatem voluptatem.",
    writer: "Beatty",
    likes: 12,
    createdAt: "27/03/2019",
    category: "notice",
  },
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "hic-modi-officia",
    content: "Doloribus voluptatem voluptatem.",
    writer: "Beatty",
    likes: 12,
    createdAt: "27/03/2019",
    category: "review",
  },
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "hic-modi-officia",
    content: "Doloribus voluptatem voluptatem.",
    writer: "Beatty",
    likes: 12,
    createdAt: "27/03/2019",
    category: "general",
  },
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "hic-modi-officia",
    content: "Doloribus voluptatem voluptatem.",
    writer: "Beatty",
    likes: 12,
    createdAt: "27/03/2019",
    category: "notice",
  },
];
const categories = ["all", "notice", "general", "review"];
const filters = ["all", "title", "content", "writer"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(5);
  const [comments, setComments] = useState(data);
  const [category, setCategory] = useState(categories[0]);
  const [filter, setFilter] = useState(filters[0]);
  const [searchTerm, setSearchTerm] = useState("");

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
    (event) => {
      event.preventDefault();

      if (!searchTerm) return;

      console.log(filter, searchTerm);
    },
    [filter, searchTerm]
  );

  useEffect(() => {
    const filteredComments =
      category === "all" ? data : data.filter((e) => e.category === category);
    setComments(filteredComments);
  }, [category]);

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
