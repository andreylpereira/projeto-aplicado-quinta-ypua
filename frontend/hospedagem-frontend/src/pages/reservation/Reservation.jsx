import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchReservations } from "../../redux/actions/reservationActions";
import CreateReservationModal from "./modals/CreateReservationModal";
import UpdateReservationModal from "./modals/UpdateReservationsModal";
import PhotoModal from "../../components/photo-modal/PhotoModal";
import Bread from "../../components/bread/Bread";
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./Reservation.css";
import semFoto from "./../../assets/semFoto.png";
import AmenidadesList from "../../components/amenityList/AmenityList";
import ReactPaginate from "react-paginate";


//O component da page reservation, apresenta um card com as informações da acomodação selecionada(nas pages accommodation ou real-time). Também lista todas as reservas em um mês especifico e permite navegar entre os meses por meio de um input de calendário. Ha o botão CADASTRAR para efetuar uma reservar por meio de um modal, como EDITAR uma reservar pelo botão que apresenta ao lado de cada reserva listada. 
const Reservation = () => {
  const dispatch = useDispatch();
  const { reservations, loading, error } = useSelector(
    (state) => state.reservation
  );

  const location = useLocation();
  const { accommodationId, startDate, accommodation } = location.state || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  const [photo, setPhoto] = useState(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handleClosePhotoModal = () => setPhotoModalVisible(false);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const initialDate = startDate ? new Date(`${startDate}-01`) : new Date();
    return isNaN(initialDate.getTime()) ? new Date() : initialDate;
  });

  useEffect(() => {
    if (accommodationId && currentMonth) {
      const formattedDate = `${currentMonth.getFullYear()}-${(
        currentMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-01T00:00:00`;
      dispatch(fetchReservations(accommodationId, formattedDate));
    }
  }, [dispatch, accommodationId, currentMonth]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) =>
      r.clienteNome?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reservations, searchQuery]);

  const offset = currentPage * itemsPerPage;
  const currentReservations = filteredReservations.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredReservations.length / itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const reservaStatusEnum = {
    EM_ANDAMENTO: "Em andamento",
    CONFIRMADO: "Confirmado",
    CANCELADO: "Cancelado",
    PENDENTE: "Pendente",
    CONCLUIDO: "Concluído",
  };

  const handleEditClick = (reservationId) => {
    setSelectedReservationId(reservationId);
    setEditModalVisible(true);
  };

  const handleReservationUpdated = () => {
    const formattedDate = `${currentMonth.getFullYear()}-${(
      currentMonth.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-01T00:00:00`;
    dispatch(fetchReservations(accommodationId, formattedDate));
  };

  const handleCloseCreateModal = () => setModalVisible(false);
  const handleCloseEditModal = () => setEditModalVisible(false);

  const handleMonthChange = (date) => {
    if (date && !isNaN(date.getTime())) {
      setCurrentMonth(date);
    }
  };

  const handleOpenPhotoModal = (accommodation) => {
    if (accommodation.contentType && accommodation.base64Image) {
      const imageUrl = `data:${accommodation.contentType};base64,${accommodation.base64Image}`;
      setPhoto(imageUrl);
      setPhotoModalVisible(true);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container user-select-none">
      <Bread current={"RESERVAS"} />

      <div className="d-flex justify-content-center align-items-center my-4 mt-4 mb-2">
        <div
          className="card shadow d-flex flex-row"
          style={{ maxWidth: "900px", width: "100%" }}
        >
          <img
            className={
              accommodation.contentType === null
                ? "cursor-none"
                : "cursor-pointer"
            }
            style={{
              width: "250px",
              height: "250px",
              objectFit: accommodation.base64Image ? "cover" : "contain",
              borderTopLeftRadius: "0.25rem",
              borderBottomLeftRadius: "0.25rem",
            }}
            alt="Imagem"
            src={
              accommodation.base64Image
                ? `data:${accommodation.contentType};base64,${accommodation.base64Image}`
                : semFoto
            }
            onClick={() => handleOpenPhotoModal(accommodation)}
          />

          <div className="d-flex flex-column flex-grow-1 p-3">
            <h5 className="fw-bold text-uppercase">{accommodation.nome}</h5>
            <p className="mb-2">
              <strong>Descrição:</strong> {accommodation.descricao}
            </p>
            <p>
              <strong>Capacidade:</strong> {accommodation.capacidade} pessoas
            </p>
            <p>
              <strong>Preço:</strong>{" "}
              {accommodation.preco?.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              }) || "Preço não disponível"}
            </p>
            <AmenidadesList amenidades={accommodation.amenidades} />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center my-3">
        <button
          className="btn btn-info fw-bold bg-gradient rounded shadow"
          onClick={() => setModalVisible(true)}
        >
          CADASTRAR
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Filtrar por nome do cliente..."
          className="form-control shadow"
          style={{ width: "22ch" }}
        />
      </div>

      <div className="container-fluid d-flex justify-content-center w-25">
        <DatePicker
          className="form-control bg-light fw-bold text-center text-capitalize mt-2 shadow"
          selected={currentMonth}
          onChange={handleMonthChange}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          locale={ptBR}
          showFullMonthYearPicker
        />
      </div>

      <CreateReservationModal
        accommodationId={accommodationId}
        startDate={currentMonth}
        isVisible={modalVisible}
        onClose={handleCloseCreateModal}
      />
      <UpdateReservationModal
        accommodationId={accommodationId}
        startDate={currentMonth}
        reservationId={selectedReservationId}
        isVisible={editModalVisible}
        onClose={handleCloseEditModal}
        onReservationUpdated={handleReservationUpdated}
      />
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

      {!loading && filteredReservations.length > 0 && (
        <>
          <div className="table-responsive mt-2">
            <table className="table table-striped table-bordered shadow">
              <thead>
                <tr>
                  <th className="text-center table-info text-light">Data Início</th>
                  <th className="text-center table-info text-light">Data Fim</th>
                  <th className="text-center table-info text-light">Cliente</th>
                  <th className="text-center table-info text-light">Telefone</th>
                  <th className="text-center table-info text-light">Email</th>
                  <th className="text-center table-info text-light">Valor Total</th>
                  <th className="text-center table-info text-light">Status</th>
                  <th className="text-center table-info text-light">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentReservations.map((reservation) => (
                  <tr key={reservation.reservaId}>
                    <td>{formatDate(reservation.dataInicio)}</td>
                    <td>{formatDate(reservation.dataFim)}</td>
                    <td>{reservation.clienteNome}</td>
                    <td>{reservation.clienteTelefone}</td>
                    <td>{reservation.clienteEmail}</td>
                    <td>
                      {reservation.valorTotal?.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      }) || "Valor não disponível"}
                    </td>
                    <td>
                      {reservaStatusEnum[reservation.reservaStatus] ||
                        "Desconhecido"}
                    </td>
                    <td>
                      <button
                        className="btn btn-info btn-sm fw-bold bg-gradient rounded shadow"
                        onClick={() => handleEditClick(reservation.reservaId)}
                        disabled={
                          reservation.reservaStatus === "CONCLUIDO" ||
                          reservation.reservaStatus === "CANCELADO"
                        }
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {!loading && filteredReservations.length === 0 && !error && (
        <div className="alert alert-warning mt-3" role="alert">
          Não há reservas para este período.
        </div>
      )}
    </div>
  );
};

export default Reservation;
