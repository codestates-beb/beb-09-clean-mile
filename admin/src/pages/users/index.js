import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Stack, Pagination, Typography, Select, MenuItem } from "@mui/material";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersTable } from "src/components/users/users-table";
import { UsersSearch } from "src/components/users/users-search";

const now = new Date();

const data = [
  {
    id: "5e887ac47eed253091be10cb",
    wallet_address: "0xa3d89804437da5dd45cbde7e0ffef6fbda2cfe4c",
    createdAt: subDays(subHours(now, 7), 1).getTime(),
    email: "carson.darrin@devias.io",
    name: "Carson Darrin",
    social_type: "none",
  },
  {
    id: "5e887b209c28ac3dd97f6db5",
    wallet_address: "0x8d8aa512e76dd4efbb12ea1e0c9ab193d495bccc",
    createdAt: subDays(subHours(now, 1), 2).getTime(),
    email: "fran.perez@devias.io",
    name: "Fran Perez",
    social_type: "google",
  },
  {
    id: "5e887b7602bdbc4dbb234b27",
    wallet_address: "0xa6d1dbaffdebdf04e8582551eecd84e293babda6",
    createdAt: subDays(subHours(now, 4), 2).getTime(),
    email: "jie.yan.song@devias.io",
    name: "Jie Yan Song",
    social_type: "none",
  },
  {
    id: "5e86809283e28b96d2d38537",
    wallet_address: "0xc1ed6851abc4690b39edfbdbccfc19cfe992ab9c",
    createdAt: subDays(subHours(now, 11), 2).getTime(),
    email: "anika.visser@devias.io",
    name: "Anika Visser",
    social_type: "kakao",
  },
  {
    id: "5e86805e2bafd54f66cc95c3",
    wallet_address: "0xb0cceb4bf54a9a7ccbcce03c64510087cca0dd1a",
    createdAt: subDays(subHours(now, 7), 3).getTime(),
    email: "miron.vitold@devias.io",
    name: "Miron Vitold",
    social_type: "none",
  },
  {
    id: "5e887a1fbefd7938eea9c981",
    wallet_address: "0xde375ac314c607987ccca6cd4ca9549c11effd50",
    createdAt: subDays(subHours(now, 5), 4).getTime(),
    email: "penjani.inyene@devias.io",
    name: "Penjani Inyene",
    social_type: "none",
  },
  {
    id: "5e887d0b3d090c1b8f162003",
    wallet_address: "0x0f4c2f9bebeeaa855868feadb488f43797d79a8c",
    createdAt: subDays(subHours(now, 15), 4).getTime(),
    email: "omar.darobe@devias.io",
    name: "Omar Darobe",
    social_type: "google",
  },
  {
    id: "5e88792be2d4cfb4bf0971d9",
    wallet_address: "0xeda5a8782eafffeb1f48d932ddd5d52d3bfecda8",
    createdAt: subDays(subHours(now, 2), 5).getTime(),
    email: "siegbert.gottfried@devias.io",
    name: "Siegbert Gottfried",
    social_type: "none",
  },
  {
    id: "5e8877da9a65442b11551975",
    wallet_address: "0x3f96bcfb4c6ddbefda7f0871b08cc2b66f731dec",
    createdAt: subDays(subHours(now, 8), 6).getTime(),
    email: "iulia.albu@devias.io",
    name: "Iulia Albu",
    social_type: "kakao",
  },
  {
    id: "5e8680e60cba5019c5ca6fda",
    wallet_address: "0xd65efdae93ec5efb9c45dacc9308dd208aea1fed",
    createdAt: subDays(subHours(now, 1), 9).getTime(),
    email: "nasimiyu.danai@devias.io",
    name: "Nasimiyu Danai",
    social_type: "kakao",
  },
];

const socialTypes = ["all", "none", "google", "kakao"];

const Page = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState(data);
  const [socialType, setSocialType] = useState(socialTypes[0]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleSocialTypeChange = useCallback((event) => {
    setSocialType(event.target.value);
  }, []);

  const handleSearchUsers = useCallback((filter, searchTerm) => {
    console.log(filter, searchTerm);
  }, []);

  useEffect(() => {
    const filteredUsers =
      socialType === "all" ? data : data.filter((u) => u.social_type === socialType);
    setUsers(filteredUsers);
  }, [socialType]);

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
              <Select value={socialType} onChange={handleSocialTypeChange}>
                {socialTypes.map((socialType) => (
                  <MenuItem key={socialType} value={socialType}>
                    {socialType}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <UsersTable items={users} />
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
            <UsersSearch handleSearchUsers={handleSearchUsers} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
