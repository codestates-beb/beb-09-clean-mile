import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Box, IconButton, MenuItem, OutlinedInput, Select, SvgIcon } from "@mui/material";

export const SearchBar = ({
  filters,
  filter,
  handleFilterChange,
  searchTerm,
  handleSearchTermChange,
  handleSearchTermSubmit,
  placeholder,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
      component="form"
      onSubmit={handleSearchTermSubmit}
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
        value={searchTerm}
        onChange={handleSearchTermChange}
        fullWidth
        placeholder={placeholder}
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
