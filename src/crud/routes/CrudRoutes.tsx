import { Routes, Route, Navigate } from "react-router-dom"
import { Dashboard } from "../pages/Dashboard"

export const CrudRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  )
}
