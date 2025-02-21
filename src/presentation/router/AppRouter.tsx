import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthRoutes } from "../screens/auth/routes/AuthRoutes";
import { CrudRoutes } from "../screens/crud/routes/CrudRoutes";
import { SessionLoader } from "../screens/auth/pages/SessionLoaderPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<SessionLoader />}>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/main/*" element={<CrudRoutes />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
};