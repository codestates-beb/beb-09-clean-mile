import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, IconButton, MenuItem, OutlinedInput, Select, SvgIcon } from "@mui/material";
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
    <Card sx={{ p: 2 }} component="form" onSubmit={onSearchUsers}>
      <Select sx={{ m: 1 }} value={filter} label="Filter by" onChange={handleFilterChange}>
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
      <IconButton type="submit" sx={{ p: "16px" }}>
        <SvgIcon color="action" fontSize="medium">
          <MagnifyingGlassIcon />
        </SvgIcon>
      </IconButton>
    </Card>
  );
};
