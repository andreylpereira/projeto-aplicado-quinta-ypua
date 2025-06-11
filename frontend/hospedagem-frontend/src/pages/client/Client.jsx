import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../../redux/actions/clientActions";
import CreateClientModal from "./modals/CreateClientModal";
import EditClientModal from "./modals/EditClientModal";
import "./Client.css";
import Bread from "../../components/bread/Bread";
import ReactPaginate from "react-paginate";


//O componente de page client, lista os clientes onde os seu cfps têm seus ultimos digitos privados (*), por meio da mascara, sendo oss dados vindo do backend privados("123456*****""). Na page permite acessar modals de cadastro e editar(de cada cliente) por seus respectivos botões.
const Client = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

const cpfMask = (value) => {
  if (value) {
    const cpfStr = String(value).replace(/\*/g, "");

    if (cpfStr.length === 6) { 
      return cpfStr.replace(/(\d{3})(\d{3})/, "$1.$2.***-**");
    }
  }
  return "";
};

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client?.nome?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  const offset = currentPage * itemsPerPage;
  const currentClients = filteredClients.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredClients.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleEdit = (client) => {
    setClientToEdit(client);
    setEditModalVisible(true);
  };

  const handleCloseCreateModal = () => setModalVisible(false);
  const handleCloseEditModal = () => setEditModalVisible(false);

  return (
    <div className="container d-flex justify-content-center min-vh-100 user-select-none">
      <div className="w-100">
        {!error && !loading && clients.length >= 0 && (
          <div>
            <Bread current={"CLIENTES"} />
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
            <CreateClientModal
              isVisible={modalVisible}
              onClose={handleCloseCreateModal}
              fetchClients={() => dispatch(fetchClients())}
            />

            <EditClientModal
              cpfMask={cpfMask}
              isVisible={editModalVisible}
              onClose={handleCloseEditModal}
              clientToEdit={clientToEdit}
              fetchClients={() => dispatch(fetchClients())}
            />
          </div>
        )}

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

        {!loading && filteredClients.length > 0 && (
          <>
            <table className="table table-striped table-bordered shadow mt-3">
              <thead>
                <tr>
                  <th className="text-center table-info text-light">CPF</th>
                  <th className="text-center table-info text-light">Nome</th>
                  <th className="text-center table-info text-light">
                    Email
                  </th>
                  <th className="text-center table-info text-light">
                    Telefone
                  </th>
                  <th className="text-center table-info text-light">
                    Endereço
                  </th>
                  <th className="text-center table-info text-light">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client) => (
                  <tr key={client.id}>
                    <td>{cpfMask(client.cpf)}</td>
                    <td>{client.nome}</td>
                    <td>{client.email || "Não informado"}</td>
                    <td>{client.telefone || "Não informado"}</td>
                    <td>{client.endereco || "Não informado"}</td>
                    <td>
                      <button
                        className="btn btn-info fw-bold shadow bg-gradient rounded btn-sm me-2"
                        onClick={() => handleEdit(client)}
                      >
                        <i className="fas fa-edit shadow"></i>
                      </button>
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
          </>
        )}

        {!loading && filteredClients.length === 0 && !error && (
          <div className="alert alert-warning mt-3" role="alert">
            Não há clientes cadastrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default Client;