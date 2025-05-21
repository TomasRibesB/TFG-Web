import { Routes, Route, Navigate } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  TermsProfPage,
  UploadDocumentScreen,
  ValidateAccountPage,
  ResetPasswordPage,
  DenyResetPasswordPage,
} from "../pages";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="terms/profesional" element={<TermsProfPage />} />
      <Route path="upload" element={<UploadDocumentScreen />} />
      <Route path="upload/:code" element={<UploadDocumentScreen />} />
      <Route path="validate/:token" element={<ValidateAccountPage />} />
      <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="deny-reset-password/:token" element={<DenyResetPasswordPage />} />

      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
