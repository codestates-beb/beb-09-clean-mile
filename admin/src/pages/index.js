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
  Pagination,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EventsTable } from "src/components/events/events-table";
import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "src/components/search-bar";

const data = [
  {
    id: "2569ce0d517a7f06d3ea1f24",
    title: "세기말 플로깅",
    type: "FirstComeFirstServe",
    location: "경기도 부천시",
    organization: "부천시청",
    status: "Progressing",
    createdAt: "27/03/2019",
  },
  {
    id: "ed2b900870ceba72d203ec15",
    createdAt: "31/03/2019",
    title: "비치 코밍 페스티벌",
    type: "RandomDraw",
    location: "강원도 속초시",
    organization: "속초시청",
    status: "Finished",
  },
  {
    id: "a033e38768c82fca90df3db7",
    createdAt: "03/04/2019",
    title: "서울 시민 플로깅 대회",
    type: "FirstComeFirstServe",
    location: "서울특별시",
    organization: "서울시청",
    status: "Created",
  },
  {
    id: "1efecb2bf6a51def9869ab0f",
    createdAt: "04/04/2019",
    title: "코드스테이츠 플로깅 해커톤",
    type: "RandomDraw",
    location: "서울특별시",
    organization: "코드스테이츠",
    status: "Recruiting",
  },
  {
    id: "1ed68149f65fbc6089b5fd07",
    createdAt: "04/04/2019",
    title: "깃허브 개발자 밋업 with 플로깅",
    type: "FirstComeFirstServe",
    location: "샌프란시스코",
    organization: "깃허브",
    status: "Progressing",
  },
];
const filters = ["all", "title", "content", "organization"];
const statuses = ["all", "created", "recruiting", "progressing", "finished"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState(data);
  const [status, setStatus] = useState(statuses[0]);
  const [filter, setFilter] = useState(filters[0]);
  const [searchTerm, setSearchTerm] = useState("");

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
    (event) => {
      event.preventDefault();

      if (!searchTerm) return;

      console.log(filter, searchTerm);
    },
    [filter, searchTerm]
  );

  useEffect(() => {
    const filteredEvents =
      status === "all" ? data : data.filter((e) => e.status.toLowerCase() === status);
    setEvents(filteredEvents);
  }, [status]);

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
            <EventsTable items={events} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                color="primary"
                count={5}
                page={page}
                onChange={handlePageChange}
                size={"medium"}
              />
            </Box>
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
