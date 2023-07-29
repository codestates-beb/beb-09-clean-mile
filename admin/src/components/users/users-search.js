import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Box, IconButton, MenuItem, OutlinedInput, Select, SvgIcon } from "@mui/material";
import { useState } from "react";

const filters = ["all", "name", "email", "wallet_address"];

export const UsersSearch = ({ handleSearchUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const onSearchUsers = (e) => {
    e.preventDefault();

    if (!searchTerm) return;

    handleSearchUsers(filter, searchTerm);
    setSearchTerm("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
      component="form"
      onSubmit={onSearchUsers}
      color={"primary"}
    >
      <Select
        sx={{ marginRight: 0.8 }}
        value={filter}
        label="Filter by"
        onChange={handleFilterChange}
      >
        {filters.map((filter) => (
          <MenuItem key={filter} value={filter}>
            {filter}
          </MenuItem>
        ))}
      </Select>
      <OutlinedInput
        defaultValue=""
        value={searchTerm}
        onChange={handleSearchTermChange}
        fullWidth
        placeholder="Search user"
        sx={{ maxWidth: 500 }}
      />
      <IconButton type="submit" sx={{ p: "12px", marginLeft: "12px" }}>
        <SvgIcon color="action" fontSize="medium">
          <MagnifyingGlassIcon />
        </SvgIcon>
      </IconButton>
    </Box>
  );
};
