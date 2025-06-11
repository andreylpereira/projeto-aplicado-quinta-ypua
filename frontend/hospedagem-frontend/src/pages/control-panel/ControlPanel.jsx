import React from "react";
import { Outlet } from "react-router-dom";
import "./ControlPanel.css";
import Navbar from "../../components/navbar/Navbar";

//O componente renderiza o navbar da aplicação e utiliza o react router por meio do componente Outlet, onde nesse é renderizado as paginas filhas(cliente, reservation, users, real-time, accommodation, dashboard, amenity etc)
const ControlPanel = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ControlPanel;
