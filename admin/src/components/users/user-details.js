import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { format } from "date-fns";

export const UserDetails = ({ user = {} }) => {
  const createdAt = user.created_at ? format(new Date(user.created_at), "MM/dd/yyyy") : "N/A";
  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Profile" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={user.name}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Nickname"
                name="nickname"
                value={user.nickname}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={user.email}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={user.phone_number}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Social Provider"
                name="social_provider"
                value={user.social_provider}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="User Type"
                name="user_type"
                value={user.user_type ? user.user_type : "N/A"}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Sign Up"
                name="sign_up"
                value={createdAt}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram"
                name="instagram"
                value={user.instagram_url ? user.instagram_url : "없음"}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
