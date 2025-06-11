import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccommodations } from "../../redux/actions/accommodationActions";
import { useNavigate } from "react-router-dom";
import { realTimeService } from "../../services/RealTimeService";
import PhotoModal from "../../components/photo-modal/PhotoModal";
import "./RealTime.css";
import semFoto from "./../../assets/semFoto.png";
import Bread from "../../components/bread/Bread";
import AmenidadesList from "../../components/amenityList/AmenityList";
import ReactPaginate from "react-paginate";


//O component da page real-time lista todas as acomodações(e informações delas) por meio de cards, neles são permitido verificar por meio de badges(Ocupado ou Disponível), a disponibilidade da acomodação naquele dia, caso estiver ocupada o botão RESERVAR vai estar desabilitado. Caso acomodação estiver disponível, o botão RESERVAR estará habilitado, permitindo o usuário acessar a pagina de reservas daquela acomodação especifica para poder efetuar reserva da acomodação.
const RealTime = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [reservedAccommodations, setReservedAccommodations] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 4;

  const { accommodations, loading, error } = useSelector(
    (state) => state.accommodations
  );

  const handleOpenPhotoModal = (accommodation) => {
    if (accommodation.contentType && accommodation.base64Image) {
      const imageUrl = `data:${accommodation.contentType};base64,${accommodation.base64Image}`;
      setPhoto(imageUrl);
      setPhotoModalVisible(true);
    }
  };

  const handleClosePhotoModal = () => setPhotoModalVisible(false);

  const handleNavigateToReservations = (
    accommodationId,
    dataInicio,
    accommodation
  ) => {
    const startDate = dataInicio || new Date().toISOString().slice(0, 19);
    navigate("/painel/reservas", {
      state: { accommodationId, startDate, accommodation },
    });
  };

  useEffect(() => {
    const updateData = async () => {
      await dispatch(fetchAccommodations());

      const reserved = await realTimeService(
        new Date().toISOString().slice(0, 19)
      );
      const reservasFiltradas = reserved.filter(
        (reserva) =>
          reserva.reservaStatus !== "CANCELADO" &&
          reserva.reservaStatus !== "CONCLUIDO"
      );
      const reservedIds = reservasFiltradas.map((r) => r.acomodacaoId);
      setReservedAccommodations(reservedIds);
    };

    updateData();

    const intervalId = setInterval(() => {
      setTimestamp(Date.now());
    }, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch, timestamp]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredAccommodations = useMemo(() => {
    return accommodations.filter(
      (a) =>
        a.habilitado &&
        a.nome?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [accommodations, searchQuery]);

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredAccommodations.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredAccommodations.length / itemsPerPage);

  return (
    <div className="container user-select-none">
      <Bread current={"TEMPO REAL"} />

      <PhotoModal
        isVisible={photoModalVisible}
        onClose={handleClosePhotoModal}
        photo={photo}
      />

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

      {!loading && currentItems.length === 0 && !error && (
        <div className="alert alert-warning mt-3" role="alert">
          Nenhuma acomodação encontrada.
        </div>
      )}

      {!error && !loading && currentItems.length > 0 && (
        <>
          <div className="d-flex justify-content-end my-3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Filtrar por nome..."
              className="form-control shadow"
              style={{ width: "22ch" }}
            />
          </div>

          <div className="row g-4 justify-content-center mb-4">
            {currentItems.map((accommodation) => {
              const isReserved = reservedAccommodations.includes(
                accommodation.id
              );

              return (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
                  key={accommodation.id}
                >
                  <div
                    className="card shadow d-flex flex-column"
                    style={{ width: "296px" }}
                  >
                    <img
                      className={`card-img-top ${
                        accommodation.contentType === null
                          ? "cursor-none"
                          : "cursor-pointer"
                      }`}
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
                    <div className="card-header bg-white d-flex justify-content-between border-0">
                      <h5 className="mb-0 fw-bold text-uppercase">
                        {accommodation.nome}
                      </h5>
                      <div className="d-flex align-items-center">
                        <span
                          className={`badge ${
                            isReserved ? "bg-danger" : "bg-success"
                          } ms-3 cursor-none`}
                        >
                          {isReserved ? "Ocupado" : "Disponível"}
                        </span>
                      </div>
                    </div>

                    <div className="card-body pt-0 flex-grow-1">
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

                    <div className="card-footer bg-white d-flex justify-content-between border-0">
                      <button
                        className="btn btn-info w-100 shadow"
                        onClick={() =>
                          isReserved
                            ? null
                            : handleNavigateToReservations(
                                accommodation.id,
                                accommodation.dataInicio,
                                accommodation
                              )
                        }
                        disabled={isReserved}
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
};

export default RealTime;
