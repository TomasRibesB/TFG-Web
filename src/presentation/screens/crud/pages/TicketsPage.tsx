import { Grid2 } from "@mui/material";

export const TicketsPage = () => {
  return (
    <Grid2
      container
      spacing={2}
      sx={{ height: "95.4%", backgroundColor: "primary.paper", pb: 4 }}
    >
      <Grid2
        size={{ xs: 12, md: 4, lg: 3 }}
        className="card-shadow"
        sx={{
          backgroundColor: "background.paper",
          p: 2,
        }}
      ></Grid2>
      <Grid2
        size={{
          xs: 12,
          md: 8,
          lg: 9,
        }}
        className="card-shadow"
        sx={{
          backgroundColor: "background.paper",
          p: 2,
        }}
      ></Grid2>
    </Grid2>
  );
};
