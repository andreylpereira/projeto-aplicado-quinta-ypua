import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateAmenityModal from "./modals/CreateAmenityModal";
import { fetchAmenities } from "../../redux/actions/amenityActions";
import EditAmenityModal from "./modals/EditAmenityModal";
import "./Amenity.css";
import Bread from "../../components/bread/Bread";
import ReactPaginate from "react-paginate";

//A page amenity lista todas as amenidades e possui seus respectivos botões de "EDITAR", também há um botão de "CADASTRAR". Em ambos os botões abrem seus respectivos modals, onde o primeiro pede o nome da amenidade, enquanto o segundo apresenta o nome da amenidade, permitindo a edição.
const Amenity = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [amenityToEdit, setAmenityToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const { amenities, loading, error } = useSelector((state) => state.amenity);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  const filteredAmenities = useMemo(() => {
    return amenities.filter((amenity) =>
      amenity.nome?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [amenities, searchQuery]);

  const offset = currentPage * itemsPerPage;
  const currentAmenities = filteredAmenities.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredAmenities.length / itemsPerPage);

  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleEdit = (amenity) => {
    setAmenityToEdit(amenity);
    setEditModalVisible(true);
  };

  const handleCloseCreateModal = () => setModalVisible(false);
  const handleCloseEditModal = () => setEditModalVisible(false);

  return (
    <div className="container d-flex justify-content-center min-vh-100 user-select-none">
      <div className="w-100">
        {!error && !loading && amenities.length >= 0 && (
          <div>
            <Bread current={"AMENIDADES"} />
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
            <CreateAmenityModal
              isVisible={modalVisible}
              onClose={handleCloseCreateModal}
              fetchAmenities={() => dispatch(fetchAmenities())}
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

        {!loading && filteredAmenities.length > 0 && (
          <>
            <EditAmenityModal
              isVisible={editModalVisible}
              onClose={handleCloseEditModal}
              amenityToEdit={amenityToEdit}
              fetchAmenities={() => dispatch(fetchAmenities())}
            />

            <table className="table table-striped table-bordered shadow mt-3">
              <thead>
                <tr>
                  <th className="text-center table-info text-light">Nome</th>
                  <th className="text-center table-info text-light">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAmenities.map((amenity) => (
                  <tr key={amenity.id}>
                    <td>{amenity.nome}</td>
                    <td>
                      <button
                        className="btn btn-info fw-bold shadow bg-gradient rounded btn-sm me-2 w-100"
                        onClick={() => handleEdit(amenity)}
                      >
                        <i className="fas fa-edit"></i> Editar
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

        {!loading && filteredAmenities.length === 0 && !error && (
          <div className="alert alert-warning mt-3" role="alert">
            Não há amenidades cadastradas.
          </div>
        )}
      </div>
    </div>
  );
};

export default Amenity;
