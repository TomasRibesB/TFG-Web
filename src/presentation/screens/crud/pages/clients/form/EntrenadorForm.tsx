import { Typography, Divider, Box, Avatar } from "@mui/material";
import { User } from "../../../../../../infrastructure/interfaces/user";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";

interface Props {
  selectedClient: Partial<User> | null;
}

export const EntrenadorForm: React.FC<Props> = ({ selectedClient }) => {
  const calculateAge = (birthdayInput: Date | string) => {
    const birthday =
      birthdayInput instanceof Date ? birthdayInput : new Date(birthdayInput);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return selectedClient ? (
    <>
      <Typography variant="h5" gutterBottom>
        Acciones
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            width: 100,
            height: 100,
          }}
        >
          {selectedClient.sex ? (
            selectedClient.sex === "M" ? (
              <PersonOutlineOutlinedIcon sx={{ fontSize: 70 }} />
            ) : (
              <Person3OutlinedIcon sx={{ fontSize: 70 }} />
            )
          ) : (
            <PersonOutlineOutlinedIcon sx={{ fontSize: 70 }} />
          )}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h3" sx={{ ml: 2, mr: 2 }}>
            {selectedClient.firstName} {selectedClient.lastName}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {selectedClient.sex && (
              <Typography variant="h6">
                Genero{" "}
                <span style={{ fontSize: "1.5rem" }}>{selectedClient.sex}</span>
              </Typography>
            )}
            {selectedClient.birthdate && (
              <Typography variant="h6">
                Edad{" "}
                <span style={{ fontSize: "1.5rem" }}>
                  {calculateAge(selectedClient.birthdate)}
                </span>
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {selectedClient.routines && (
          <Typography variant="overline">
            {JSON.stringify(selectedClient.routines)}
          </Typography>
        )}
      </Box>
    </>
  ) : (
    <Typography variant="h6">
      Seleccione un cliente para ver los detalles.
    </Typography>
  );
};
