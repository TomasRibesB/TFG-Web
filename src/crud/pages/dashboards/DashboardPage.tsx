import { Grid2 } from "@mui/material";

export const DashboardPage = () => {
  return (
    <Grid2
      container
      spacing={2}
      direction="column"
      sx={{ minHeight: "90vh", backgroundColor: "primary.paper" }}
    >
      <Grid2 container spacing={2} sx={{ height: "20vh" }}>
        <Grid2
          className="card-shadow"
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
        <Grid2
          className="card-shadow"
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
        <Grid2
          className="card-shadow"
          size={{ xs: 12, sm: 6, md: 4 }}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
      </Grid2>
      <Grid2 container spacing={2} sx={{ height: "60vh" }}>
        <Grid2
          className="card-shadow"
          size={{ xs: 12, md: 6 }}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
        <Grid2
          className="card-shadow"
          size={{ xs: 12, md: 6 }}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
          }}
        ></Grid2>
      </Grid2>
    </Grid2>
  );
};