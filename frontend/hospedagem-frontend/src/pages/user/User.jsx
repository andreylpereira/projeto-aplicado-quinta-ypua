import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserAuthorizationAction,
} from "../../redux/actions/userActions";
import CreateUserModal from "./modals/CreateUserModal";
import { toast } from "sonner";
import Bread from "../../components/bread/Bread";
import ReactPaginate from "react-paginate";
import "./User.css";
import "bootstrap/dist/css/bootstrap.min.css";


//Component da page User, só ADMINISTRADOR pode acessar, nesta page é listado todos os usuários e algumas informações como nome, tipo de perfil, email etc. Na page possuí botão de CADASTRAR que abre um modal que possibilita o cadastro de um novo usuário, também há um botão ao lado de cada um dos usuários listados, que permite habilitar e desabilitar ao clicar.
const User = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user?.nome?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const offset = currentPage * itemsPerPage;
  const currentUsers = filteredUsers.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const updateAuthorization = (id, currentAuthorization, nome) => {
    const newAuthorization = !currentAuthorization;

    dispatch(updateUserAuthorizationAction(id, newAuthorization))
      .then(() => {
        dispatch(fetchUsers());
        toast.success(
          `Autorização de acesso do usuário ${nome} atualizada com sucesso.`
        );
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleCloseCreateModal = () => setModalVisible(false);

  return (
    <div className="container d-flex justify-content-center min-vh-100 user-select-none">
      <div className="w-100">
        {loading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "calc(70vh - 50px)" }}
          >
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {error && !loading && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
        {!error && !loading && users.length > 0 && (
          <div>
            <Bread current={"USUÁRIOS"} />

            <div className="d-flex justify-content-between align-items-center my-3">
              <button
                type="button"
                className="btn btn-info fw-bold bg-gradient rounded shadow"
                onClick={() => setModalVisible(true)}
              >
                CADASTRAR
              </button>
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Filtrar por nome..."
                  className="form-control shadow"
                  style={{ width: "18ch" }}
                />
              </div>
            </div>

            <CreateUserModal
              isVisible={modalVisible}
              onClose={handleCloseCreateModal}
              fetchUsers={() => dispatch(fetchUsers())}
            />

            <table className="table table-striped table-bordered shadow mt-3">
              <thead>
                <tr>
                  <th className="text-center table-info text-light">Nome</th>
                  <th className="text-center table-info text-light">Perfil</th>
                  <th className="text-center table-info text-light">Email</th>
                  <th className="text-center table-info text-light">
                    Habilitado
                  </th>
                  <th className="text-center table-info text-light">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nome}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.perfil == "ADMINISTRADOR" ? "bg-danger" : "bg-success"
                        } ms-3 cursor-none`}
                      >
                        {user.perfil == "ADMINISTRADOR"
                          ? "ADMINISTRADOR"
                          : "FUNCIONÁRIO"}
                      </span>
                    </td>
                    <td>{user.email || "Não informado"}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.habilitado === true ? "bg-success" : "bg-danger"
                        } ms-3 cursor-none`}
                      >
                        {user.habilitado === true ? "Sim" : "Não"}
                      </span>
                    </td>
                    <td>
                      {user.id !== 1 ? (
                        <button
                          className="btn btn-info btn-sm fw-bold bg-gradient rounded shadow"
                          onClick={() =>
                            updateAuthorization(
                              user.id,
                              user.habilitado,
                              user.nome
                            )
                          }
                        >
                          <i className="fas fa-user-shield"></i>
                        </button>
                      ) : (
                        <button className="btn btn-info btn-sm fw-bold bg-gradient rounded shadow disabled">
                          <i className="fas fa-user-shield shadow"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3">
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                forcePage={currentPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link text-info border-info"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link text-info border-info"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link text-info border-info"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link text-info border-info"}
                activeClassName={"active"}
                activeLinkClassName={"bg-info text-white border-info"}
              />
            </div>
          </div>
        )}
        {!loading && users.length === 0 && !error && (
          <div className="alert alert-warning mt-3" role="alert">
            Não há usuários cadastrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
