import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";

const wallet = {
  address: "0xd1fb56c9bde306e59ce78d7bdfec017eb31ccd11",
  token_amount: 1,
};

export const AccountWallet = () => (
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
              value={wallet.address}
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
              value={wallet.token_amount}
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
