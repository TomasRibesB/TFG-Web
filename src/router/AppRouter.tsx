import { Route, Routes } from "react-router-dom"
import { AuthRoutes } from "../auth/routes/AuthRoutes"
import { CrudRoutes } from "../crud/routes/CrudRoutes"

export const AppRouter = () => {
  return (
    <Routes>
        {/* Login y Registro*/}
        <Route path="/auth/*" element={<AuthRoutes />} />
        {/*Crud, home, etc*/}
        <Route path="/*" element={<CrudRoutes />} />
    </Routes>
  )
}
