import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/homes/HomePage";
import { ClientsPage, ProfilePage, TicketsPage } from "../pages";
import { DrawerNavigator } from "../layout/DrawerNavigator";

export const CrudRoutes = () => {
  return (
    <DrawerNavigator>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="profile" element={<ProfilePage />} />

        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </DrawerNavigator>
  );
};
