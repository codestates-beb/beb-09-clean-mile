import PropTypes from "prop-types";
import { format } from "date-fns";
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
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Wallet Address</TableCell>
                  <TableCell>User Type</TableCell>
                  <TableCell>Social Provider</TableCell>
                  <TableCell>Signed Up</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((user) => {
                  const createdAt = user.created_at
                    ? format(new Date(user.created_at), "MM/dd/yyyy")
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
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{user.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.wallet
                          ? user.wallet.address
                            ? user.wallet.address.slice(0, 6) +
                              "..." +
                              user.wallet.address.slice(-4)
                            : "N/A"
                          : "N/A"}
                      </TableCell>
                      <TableCell>{user.user_type ? user.user_type : "N/A"}</TableCell>
                      <TableCell>{user.social_provider ? user.social_provider : "N/A"}</TableCell>
                      <TableCell>{createdAt}</TableCell>
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
