import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAccommodations } from "../../redux/actions/accommodationActions.jsx";
import { useAuth } from "./../../context/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import logo from "../../assets/logo.png";
import "./Navbar.css";


//Componente de navbar, ele renderiza conforme perfil dos usuários ("ADMINISTRADOR" ou "FUNCIONÁRIO"), nele têm o para ir para pagina REAL-TIME na esquerda e na direita o de "Alterar Senha", o "MENU" é apresentado para ambos os perfils, enquanto "PAINEL DE CONTROLE" somente para ADMINISTRADOR.
const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { logout, auth } = useAuth();

  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === "/painel/acomodacoes") {
      dispatch(fetchAccommodations());
    }
  }, [dispatch, location.pathname]);

  const handleOpenChangePasswordModal = () => {
    setModalPasswordVisible(true);
  };

  const handleCloseChangePasswordModal = () => {
    setModalPasswordVisible(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-info bg-gradient fixed-top user-select-none shadow">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <div className="hstack gap-3">
              <div>
                {" "}
                <Link className="navbar-brand text-white" to="/">
                  <img src={logo} alt="Logo" width={56} height={36} />
                </Link>
              </div>
              <div className="pl-2">
                {" "}
                <Link className="nav-link text-white" to="/painel/tempo-real">
                  TEMPO REAL
                </Link>
              </div>
              <div className="pl-2">
                {" "}
                <ul className="navbar-nav mr-3">
                  <li className="nav-item dropdown ">
                    <Link
                      className="nav-link dropdown-toggle text-white"
                      to="#"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      MENU
                    </Link>
                    <ul
                      className="dropdown-menu bg-info bg-gradient"
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      <li>
                        <Link
                          className="dropdown-item text-white"
                          to="/painel/acomodacoes"
                        >
                          ACOMODAÇÕES
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-white"
                          to="/painel/clientes"
                        >
                          CLIENTES
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-white"
                          to="/painel/amenidades"
                        >
                          AMENIDADES
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="pl-2">
                {" "}
                {auth.isAdmin && (
                  <ul className="navbar-nav mr-3">
                    <li className="nav-item dropdown ">
                      <Link
                        className="nav-link dropdown-toggle text-white"
                        to="#"
                        id="navbarDropdownMenuLink"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        PAINEL DE CONTROLE
                      </Link>
                      <ul
                        className="dropdown-menu bg-info bg-gradient"
                        aria-labelledby="navbarDropdownMenuLink"
                      >
                        <li>
                          <Link
                            className="dropdown-item text-white"
                            to="/painel/usuarios"
                          >
                            USUÁRIOS
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-white"
                            to="/painel/dashboard"
                          >
                            DASHBOARD
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="ms-auto d-flex align-items-center gap-2">
            <Link
              className="nav-link text-white"
              onClick={handleOpenChangePasswordModal}
            >
              ALTERAR SENHA{" "}
            </Link>
            <button
              className="btn btn-outline-light bg-gradient rounded shadow"
              onClick={logout}
            >
              SAIR
            </button>
          </div>
        </div>
      </nav>
      <ChangePasswordModal
        isVisible={modalPasswordVisible}
        onClose={handleCloseChangePasswordModal}
      />
    </>
  );
};

export default Navbar;
