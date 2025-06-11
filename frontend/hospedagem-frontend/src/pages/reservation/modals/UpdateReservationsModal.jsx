import React, { useState, useEffect } from "react";
import Calendar from "../../../components/calendar/Calendar";
import { getClients } from "../../../services/clientService.jsx";
import { getReservationById } from "../../../services/reservationService.jsx";
import {
  updateReservationAction,
  fetchReservations,
} from "../../../redux/actions/reservationActions.jsx";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { getUserIdFromToken } from "../../../services/api";

//O Modal de edit reservation é acessado por meio da listagem de reservas da page reservation, ele recebe informações da reserva que se deseja editar, possibilitando a edição das mesmas.
const UpdateReservationModal = ({
  accommodationId,
  startDate,
  reservationId,
  isVisible,
  onClose,
}) => {
  const [form, setForm] = useState({
    clienteId: null,
    status: "Em andamento",
    dataInicio: "",
    dataFim: "",
    acomodacaoId: null,
    funcionarioId: null,
  });

  const dispatch = useDispatch();

  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError("");
    if (isVisible && reservationId) {
      const fetchReservation = async () => {
        try {
          const response = await getReservationById(reservationId);
          const {
            clienteId,
            status,
            dataInicio,
            dataFim,
            acomodacaoId,
            funcionarioId,
          } = response;
          setForm({
            clienteId,
            status,
            dataInicio,
            dataFim,
            acomodacaoId,
            funcionarioId,
          });
        } catch (error) {
          setError("Erro ao carregar os dados da reserva.");
        }
      };

      fetchReservation();
    }
  }, [isVisible, reservationId]);

  useEffect(() => {
    setError("");
    const fetchClients = async () => {
      try {
        const response = await getClients();
        setClientes(response);
      } catch (error) {
        setError("Erro ao carregar os clientes.");
      }
    };

    fetchClients();
  }, []);

  const formatDateToISO = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return (
      formattedDate.toISOString().split("T")[0] +
      "T" +
      formattedDate.toTimeString().split(" ")[0]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const { clienteId, status, dataInicio, dataFim, funcionarioId } = form;

    if (dataFim < dataInicio) {
      setError(
        "A data final não pode ser um valor anterior ao da data inicial."
      );
      toast.error(
        "A data final não pode ser um valor anterior ao da data inicial."
      );
      return;
    }

    const formattedDataInicio = formatDateToISO(dataInicio);
    const formattedDataFim = formatDateToISO(dataFim);

    if (!clienteId || !status || !formattedDataInicio || !formattedDataFim) {
      toast.error("Todos os campos são obrigatórios.");
      setError("Todos os campos são obrigatórios.");
      return;
    }

    dispatch(
      updateReservationAction(reservationId, {
        funcionarioId: getUserIdFromToken(),
        clienteId,
        acomodacaoId: accommodationId,
        dataInicio: formattedDataInicio,
        dataFim: formattedDataFim,
        status,
      })
    )
      .then(() => {
        dispatch(
          fetchReservations(accommodationId, formatDateToISO(startDate))
        );
        toast.success("Reserva atualizada com sucesso.");
        setIsLoading(false);
        onClose();
        setError("");
        setForm({
          funcionarioId,
          clienteId: null,
          status: "Em andamento",
          dataInicio: "",
          dataFim: "",
        });
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response?.data);
        setError(error.response?.data);
      });
  };

  const handleDateInicioSelect = (date) => {
    setForm({
      ...form,
      dataInicio: date,
    });
  };

  const handleDateFimSelect = (date) => {
    setForm({
      ...form,
      dataFim: date,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "clienteId") {
      setForm((prev) => ({
        ...prev,
        [name]: value ? Number(value) : null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
      aria-labelledby="updateReservationModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="updateReservationModalLabel">
              EDITAR
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Cliente</label>
                <select
                  className="form-select"
                  name="clienteId"
                  value={form.clienteId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 w-100">
                <label className="form-label">Data Início</label>
                <Calendar
                  onDateSelect={handleDateInicioSelect}
                  accommodationId={accommodationId}
                  selectedDate={form.dataInicio}
                  selectedStartDate={form.dataInicio}
                  selectedEndDate={form.dataFim}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Data Fim</label>
                <Calendar
                  onDateSelect={handleDateFimSelect}
                  accommodationId={accommodationId}
                  selectedDate={form.dataFim}
                  selectedStartDate={form.dataInicio}
                  selectedEndDate={form.dataFim}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Em andamento">Em andamento</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                {isLoading ? (
                  <div>
                    <button class="btn btn-info" disabled>
                      <div
                          className="spinner-border spinner-border-sm text-light"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-info mt-2 bg-gradient rounded fw-bold shadow"
                  >
                    <div>Salvar</div>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateReservationModal;
