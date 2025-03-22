import { Routes, Route, Navigate } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  TermsPrivPage,
  TermsProfPage,
  UploadDocumentScreen,
} from "../pages";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="terms/profesional" element={<TermsProfPage />} />
      <Route path="terms/privacy" element={<TermsPrivPage />} />
      <Route path="upload" element={<UploadDocumentScreen />} />
      <Route path="upload/:code" element={<UploadDocumentScreen />} />

      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
