import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import Login from "../pages/login/Login.jsx";
import ControlPanel from "../pages/control-panel/ControlPanel.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Accommodation from "../pages/accommodation/Accommodation.jsx";
import Reservation from "../pages/reservation/Reservation.jsx";
import User from "../pages/user/User.jsx";
import Client from "../pages/client/Client.jsx";
import Amenity from "../pages/amenity/Amenity.jsx";
import { Toaster } from "sonner";
import RealTime from "../pages/real-time/RealTime.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";

//Listagem e definições de rotas
const Routers = () => {
  return (
    <>
      <Router>
        <Toaster richColors />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/painel"
              element={<Navigate to="/painel/tempo-real" />}
            />

            <Route
              path="/painel"
              element={
                <PrivateRoute>
                  <ControlPanel />
                </PrivateRoute>
              }
            >
              <Route path="tempo-real" element={<RealTime />} />
              <Route path="acomodacoes" element={<Accommodation />} />
              <Route path="clientes" element={<Client />} />
              <Route
                path="usuarios"
                element={
                  <PrivateRoute requiredRole="ADMINISTRADOR">
                    <User />
                  </PrivateRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <PrivateRoute requiredRole="ADMINISTRADOR">
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route path="amenidades" element={<Amenity />} />
              <Route path="reservas" element={<Reservation />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
};

export default Routers;
