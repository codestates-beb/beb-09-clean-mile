import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";

const dnft = {
  image_url: "/assets/avatars/avatar-anika-visser.png",
  token_id: 1,
  name: "Lee",
  dnft_level: 0,
  description: "test account",
};

export const UserDNFT = () => (
  <Card sx={{ p: 3 }}>
    <CardContent>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Avatar
          src={dnft.image_url}
          sx={{
            height: 80,
            mb: 2,
            width: 80,
          }}
        />
        <Typography gutterBottom variant="h5">
          {dnft.name}
        </Typography>
        <Typography color="text.secondary" variant="body3">
          {dnft.description}
        </Typography>
        <Typography color="text.secondary" variant="body3">
          {`# ${dnft.token_id} | level ${dnft.dnft_level + 1}`}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
