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
                  <TableCell>Social Type</TableCell>
                  <TableCell>Signed Up</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((user) => {
                  const createdAt = user.createdAt ? format(user.createdAt, "dd/MM/yyyy") : "N/A";

                  return (
                    <TableRow hover key={user.id} onClick={() => handleUserSelected(user.id)}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{user.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.wallet_address
                          ? user.wallet_address.slice(0, 6) + "..." + user.wallet_address.slice(-4)
                          : "N/A"}
                      </TableCell>
                      <TableCell>{user.social_type}</TableCell>
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
