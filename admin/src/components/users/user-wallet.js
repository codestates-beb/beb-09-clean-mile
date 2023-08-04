import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

export const UserWallet = ({ wallet = {} }) => (
  <Card sx={{ p: 3 }}>
    <CardHeader title="Wallet" />
    <CardContent sx={{ pt: 0 }}>
      <Box sx={{ m: -1.5 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={wallet.address ? wallet.address : "N/A"}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid xs={12} md={12}>
            <TextField
              fullWidth
              label="Token Amount"
              name="tokenAmount"
              value={wallet.token_amount ? wallet.token_amount : 0}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </CardContent>
  </Card>
);
