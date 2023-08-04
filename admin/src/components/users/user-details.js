import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export const UserDetails = () => {
  const [values, setValues] = useState({
    name: "엄준식",
    email: "um@cleanmile.com",
    nickname: "엄마가 준비한 식사",
    phone_number: "010-xxxx-xxxx",
    social_provider: "kakao",
    user_type: 0,
    created_at: "2021-10-01 00:00:00",
    instagram_url: "",
  });

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
                value={values.name}
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
                value={values.nickname}
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
                value={values.email}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={values.phone_number}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Social Provider"
                name="socialProvider"
                value={values.social_provider}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="User Type"
                name="userType"
                value={values.user_type === 0 ? "일반" : "관리자"}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Sign Up"
                name="signUp"
                value={values.created_at}
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
                value={values.instagram_url ? values.instagram_url : "없음"}
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
