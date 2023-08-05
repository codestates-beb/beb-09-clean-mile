import PropTypes from "prop-types";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "next/router";

export const UsersTable = ({ items = [], pageCount, page, handlePageChange }) => {
  const router = useRouter();

  const handleUserSelected = (userId) => {
    router.push(`/users/${userId}`);
  };

  return (
    <Stack spacing={3}>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Id</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Wallet Address</TableCell>
                  <TableCell align="center">User Type</TableCell>
                  <TableCell align="center">Social Provider</TableCell>
                  <TableCell align="center">Signed Up</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((user) => {
                  const createdAt = user.created_at
                    ? format(utcToZonedTime(new Date(user.created_at)), "MM/dd/yyyy")
                    : "N/A";

                  return (
                    <TableRow
                      hover
                      key={user._id}
                      onClick={() => handleUserSelected(user._id)}
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          {user._id.slice(0, 6) + "..." + user._id.slice(-4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">{user.name}</Typography>
                      </TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">
                        {user.wallet.address.slice(0, 6) + "..." + user.wallet.address.slice(-4)}
                      </TableCell>
                      <TableCell align="center">
                        {user.user_type ? user.user_type : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {user.social_provider ? user.social_provider : "N/A"}
                      </TableCell>
                      <TableCell align="center">{createdAt}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          color="primary"
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          size={"medium"}
        />
      </Box>
    </Stack>
  );
};

UsersTable.propTypes = {
  items: PropTypes.array,
};
