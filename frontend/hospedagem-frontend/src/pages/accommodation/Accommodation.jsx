import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateAccommodationModal from "./modals/CreateAccommodationModal";
import EditAccommodationModal from "./modals/EditAccommodationModal";
import PhotoModal from "../../components/photo-modal/PhotoModal";
import { fetchAccommodations } from "../../redux/actions/accommodationActions";
import semFoto from "./../../assets/semFoto.png";
import "./Accommodation.css";
import Bread from "../../components/bread/Bread";
import AmenidadesList from "../../components/amenityList/AmenityList";
import ReactPaginate from "react-paginate";

//Componente da page accommodation, nela é listada as acomodações(com suas informações e imagem) e permite "CADASTRAR"(botão) e "EDITAR"(esse por meio de icon), onde abre modais para preenchimento/edição. Também cada card de acomodação possui um botão de agenda em redirecionado o usuário para a pagina de reservas daquela acomodação especifica.
const Accommodation = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [accommodationToEdit, setAccommodationToEdit] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 4;

  const { accommodations, loading, error } = useSelector(
    (state) => state.accommodations
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAccommodations());
  }, [dispatch]);

  const handleEdit = (accommodation) => {
    setAccommodationToEdit(accommodation);
    setEditModalVisible(true);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19);
  };

  const handleNavigateToReservations = (
    accommodationId,
    dateStart,
    nameAccommodation,
    accommodation
  ) => {
    const startDate = dateStart ? dateStart : getCurrentDateTime();
    navigate("/painel/reservas", {
      state: { accommodationId, startDate, nameAccommodation, accommodation },
    });
  };

  const handleOpenPhotoModal = (accommodation) => {
    if (accommodation.contentType && accommodation.base64Image) {
      const imageUrl = `data:${accommodation.contentType};base64,${accommodation.base64Image}`;
      setPhoto(imageUrl);
      setPhotoModalVisible(true);
    }
  };

  const handleCloseCreateModal = () => setModalVisible(false);
  const handleCloseEditModal = () => setEditModalVisible(false);
  const handleClosePhotoModal = () => setPhotoModalVisible(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((a) =>
      a.nome?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [accommodations, searchQuery]);

  const offset = currentPage * itemsPerPage;
  const currentAccommodations = filteredAccommodations.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredAccommodations.length / itemsPerPage);

  return (
    <div className="container d-flex justify-content-center min-vh-100 user-select-none">
      <div className="w-100">
        <PhotoModal
          isVisible={photoModalVisible}
          onClose={handleClosePhotoModal}
          photo={photo}
        />

        {!error && !loading && accommodations.length >= 0 && (
          <>
            <Bread current={"ACOMODAÇÕES"} />

            <div className="d-flex justify-content-between align-items-center my-3">
              <button
                type="button"
                className="btn btn-info fw-bold bg-gradient rounded shadow"
                onClick={() => setModalVisible(true)}
              >
                CADASTRAR
              </button>

              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Filtrar por nome..."
                className="form-control shadow"
                style={{ width: "22ch" }}
              />
            </div>

            <CreateAccommodationModal
              isVisible={modalVisible}
              onClose={handleCloseCreateModal}
              fetchAccommodations={() => dispatch(fetchAccommodations())}
            />
            <EditAccommodationModal
              isVisible={editModalVisible}
              onClose={handleCloseEditModal}
              accommodationToEdit={accommodationToEdit}
              fetchAccommodations={() => dispatch(fetchAccommodations())}
            />
          </>
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

        {!loading && currentAccommodations.length > 0 && (
          <>
            <div className="row g-4 justify-content-center mb-4">
              {currentAccommodations.map((accommodation) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
                  key={accommodation.id}
                >
                  <div className="card shadow" style={{ width: "296px" }}>
                    <img
                      className={`card-img-top ${
                        accommodation.base64Image === null
                          ? "cursor-none"
                          : "cursor-pointer"
                      } `}
                      style={{
                        width: "100%",
                        height: "230px",
                        objectFit: accommodation.base64Image
                          ? "cover"
                          : "contain",
                      }}
                      alt="Imagem"
                      src={
                        accommodation.base64Image
                          ? `data:${accommodation.contentType};base64,${accommodation.base64Image}`
                          : semFoto
                      }
                      onClick={() => handleOpenPhotoModal(accommodation)}
                    />
                    <div className="card-body pt-2">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title fw-bold text-uppercase">
                          {accommodation.nome}
                        </h5>
                        <div className="d-flex align-items-center">
                          {accommodation.habilitado && (
                            <span
                              className="badge bg-secondary bg-gradient ms-3 badge-button shadow"
                              onClick={() =>
                                handleNavigateToReservations(
                                  accommodation.id,
                                  accommodation.dataInicio,
                                  accommodation.nome,
                                  accommodation
                                )
                              }
                            >
                              <i className="fas fa-calendar"></i>
                            </span>
                          )}
                          <span
                            className="badge bg-secondary bg-gradient ms-3 badge-button shadow"
                            onClick={() => handleEdit(accommodation)}
                          >
                            <i className="fas fa-edit"></i>
                          </span>
                        </div>
                      </div>
                      <div className="mb-1">
                        <label>
                          <strong>Descrição</strong>
                        </label>
                        <p>{accommodation.descricao}</p>
                      </div>

                      <div className="d-flex justify-content-between">
                        <div className="capacidade-preco">
                          <label>
                            <strong>Capacidade</strong>
                          </label>
                          <p className="mb-1">
                            {accommodation.capacidade} pessoas
                          </p>
                        </div>
                        <div className="capacidade-preco">
                          <label>
                            <strong>Preço</strong>
                          </label>
                          <p className="mb-1">
                            {accommodation.preco?.toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            }) || "Preço não disponível"}
                          </p>
                        </div>
                      </div>

                      <AmenidadesList amenidades={accommodation.amenidades} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

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

        {!loading && filteredAccommodations.length === 0 && !error && (
          <div className="alert alert-warning mt-3" role="alert">
            Não há acomodações cadastradas.
          </div>
        )}
      </div>
    </div>
  );
};

export default Accommodation;
