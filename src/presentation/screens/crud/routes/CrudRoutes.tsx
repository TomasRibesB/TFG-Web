import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ClientsPage, ProfilePage, TicketsPage } from "../pages";
import { DrawerNavigator } from "../layout/DrawerNavigator";
import { useEffect, useState } from "react";
import { StorageAdapter } from "../../../../config/adapters/storage-adapter";
import { User } from "../../../../infrastructure/interfaces/user";
import { Role } from "../../../../infrastructure/enums/roles";
import { ProfessionalsPage } from "../pages/ProfessionalsPage";

export const CrudRoutes = () => {
  const [user, setUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const user: Partial<User> | null = await StorageAdapter.getItem("user");
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  };

  return (
    <DrawerNavigator>
      {user?.userTipoProfesionales?.some((tipo) => tipo.isCertified) ? (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="profile" element={<ProfilePage />} />

          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      ) : 
      user?.role === Role.Administrador ? (
        <Routes>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="professionals" element={<ProfessionalsPage />} />

          <Route path="/*" element={<Navigate to="/profile" />} />
        </Routes>
      ) :
      (
        <Routes>
          <Route path="profile" element={<ProfilePage />} />

          <Route path="/*" element={<Navigate to="/profile" />} />
        </Routes>
      )}
    </DrawerNavigator>
  );
};
