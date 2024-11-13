import { Grid2 } from "@mui/material";

export const DashboardPage = () => {
  return (
    <Grid2
      container
      spacing={7}
      direction="column"
      sx={{ minHeight: "100vh", backgroundColor: "primary.paper", pb: 4 }}
    >
      <Grid2 container size={12} direction="row" sx={{ height: "20vh" }}>
        <Grid2
          className="card-shadow"
          size={4}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
        <Grid2
          className="card-shadow"
          size={4}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
        <Grid2
          className="card-shadow"
          size={4}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
      </Grid2>
      <Grid2 container size={12} direction="row" sx={{ height: "60vh" }}>
        <Grid2
          className="card-shadow"
          size={6}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
        <Grid2
          className="card-shadow"
          size={6}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
      </Grid2>
    </Grid2>
  );
};
