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
import { EventsTable } from "src/components/events/events-table";
import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "src/components/search-bar";
import { useRouter } from "next/router";
import axios from "axios";

const filters = ["all", "title", "content", "organization"];
const statuses = ["all", "created", "recruiting", "progressing", "finished", "canceled"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState(statuses[0]);
  const [filter, setFilter] = useState(filters[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const searchEvents = useCallback(async (params) => {
    try {
      const res = await axios.get("http://localhost:7000/admin/events/list", {
        withCredentials: true,
        params,
      });

      if (!res || res.status !== 200) {
        throw new Error("Invalid response");
      }

      const data = res.data;

      let eventData = [];
      let pagination = {};

      if (data && data.data) {
        eventData = data.data.data ? data.data.data : [];
        pagination = data.data.pagination ? data.data.pagination : {};
      }

      return {
        events: eventData,
        pagination: pagination,
      };
    } catch (err) {
      throw err;
    }
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value);
  }, []);

  const handleStatusChange = useCallback((event) => {
    setStatus(event.target.value);
  }, []);

  const handleSearchTermChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchTermSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const params = {};

      if (status !== "all") {
        params.status = status;
      }

      switch (filter) {
        case "title":
          params.title = searchTerm;
          break;
        case "content":
          params.content = searchTerm;
          break;
        case "organization":
          params.organization = searchTerm;
          break;
        default:
          break;
      }

      try {
        const res = await searchEvents(params);
        setEvents(res.events);
        setPageCount(res.pagination.totalPages);
        setPage(res.pagination.currentPage);
      } catch (err) {
        console.log(err);
        setEvents([]);
        setPageCount(1);
        setPage(1);
      }
    },
    [filter, searchTerm]
  );

  useEffect(() => {
    const params = {};

    if (status !== "all") {
      params.status = status;
    }

    params.page = page;

    searchEvents(params)
      .then((res) => {
        setEvents(res.events);
        setPageCount(res.pagination.totalPages);
        setPage(res.pagination.currentPage);
      })
      .catch((err) => {
        console.log(err);
        setEvents([]);
        setPageCount(1);
        setPage(1);
      });
  }, [status, page]);

  return (
    <>
      <Head>
        <title>Events</title>
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
                <Typography variant="h4">Events</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => {
                    router.push("/events/create");
                  }}
                >
                  Add
                </Button>
                <Select value={status} onChange={handleStatusChange}>
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
            <EventsTable
              items={events}
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
              placeholder={"Search Event"}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
