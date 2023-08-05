import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography, Select, MenuItem } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersTable } from "src/components/users/users-table";
import { SearchBar } from "src/components/search-bar";
import axios from "axios";

const filters = ["all", "name", "email", "wallet address"];
const socialProviders = ["all", "none", "google", "kakao"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [users, setUsers] = useState([]);
  const [socialProvider, setSocialProvider] = useState(socialProviders[0]);
  const [filter, setFilter] = useState(filters[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchUsers = useCallback(async (params) => {
    try {
      const res = await axios.get("http://localhost:7000/admin/users/list", {
        withCredentials: true,
        params,
      });

      if (!res || res.status !== 200) {
        throw new Error("Invalid response");
      }

      const data = res.data;

      if (data && data.data) {
        console.log(data);

        const userData = data.data.users;
        const pagination = data.data.pagination;

        if (!userData) {
          setUsers([]);
          setPageCount(1);
          setPage(1);
          return;
        }

        if (!pagination) {
          setUsers(userData);
          setPageCount(1);
          setPage(1);
          return;
        }

        setUsers(userData);
        setPageCount(pagination.totalPages);
        setPage(pagination.currentPage);
      } else {
        throw new Error(data.message ? data.message : "Invalid response");
      }
    } catch (err) {
      console.log(err);
      setUsers([]);
      setPageCount(1);
      setPage(1);
    }
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleSocialProviderChange = useCallback((event) => {
    setSocialProvider(event.target.value);
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

      if (socialProvider !== "all") {
        params.social_provider = socialProvider;
      }

      if (filter !== "all") {
        switch (filter) {
          case "name":
            params.name = searchTerm;
            break;
          case "email":
            params.email = searchTerm;
            break;
          case "wallet address":
            params.wallet_address = searchTerm;
            break;
          default:
            throw new Error("Invalid filter");
        }
      }

      await searchUsers(params);
    },
    [filter, searchTerm]
  );

  useEffect(() => {
    const params = {};

    if (socialProvider !== "all") {
      params.social_provider = socialProvider;
    }

    params.page = page;

    searchUsers(params);
  }, [socialProvider, page]);

  return (
    <>
      <Head>
        <title>Users</title>
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
                <Typography variant="h4">Users</Typography>
              </Stack>
              <Select value={socialProvider} onChange={handleSocialProviderChange}>
                {socialProviders.map((socialProvider) => (
                  <MenuItem key={socialProvider} value={socialProvider}>
                    {socialProvider}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <UsersTable
              items={users}
              pageCount={pageCount}
              page={page}
              handlePageChange={handlePageChange}
            />
            <SearchBar
              filters={filters}
              filter={filter}
              handleFilterChange={handleFilterChange}
              searchTerm={searchTerm}
              handleSearchTermChange={handleSearchTermChange}
              handleSearchTermSubmit={handleSearchTermSubmit}
              placeholder="Search user"
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
