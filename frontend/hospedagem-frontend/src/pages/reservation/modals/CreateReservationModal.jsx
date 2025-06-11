import React, { useState, useEffect } from "react";
import Calendar from "../../../components/calendar/Calendar";
import { getClients } from "../../../services/clientService";
import { getUserIdFromToken } from "../../../services/api";
import {
  createReservationAction,
  fetchReservations,
} from "../../../redux/actions/reservationActions";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

//O Modal de create reservation é acessado por meio do page reservation, ele recebe informações como por exemplo o id da acomodação, nele é possivel efetuar reservas, seus input de calendário(component CALENDAR) permite ver os dias disponíveis para reserva, também possibilita selecionar o cliente e definir o status.
const CreateReservationModal = ({
  accommodationId,
  startDate,
  isVisible,
  onClose,
}) => {
  const [form, setForm] = useState({
    funcionarioId: null,
    clienteId: null,
    accommodationId: accommodationId,
    status: "Em andamento",
    dataInicio: "",
    dataFim: "",
  });

  const dispatch = useDispatch();

  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError("");
    if (isVisible) {
      const fetchClients = async () => {
        try {
          const response = await getClients();
          setClientes(response);
        } catch (error) {
          toast.error(error.response.data);
        }
      };

      fetchClients();
    }
  }, [isVisible]);

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

    const funcionarioId = getUserIdFromToken();

    if (!funcionarioId) {
      setError("Funcionario não encontrado. Por favor, faça login novamente.");
      toast.error(
        "Funcionario não encontrado. Por favor, faça login novamente."
      );
      return;
    }

    const { clienteId, status, dataInicio, dataFim } = form;

    const formattedDataInicio = formatDateToISO(dataInicio);
    const formattedDataFim = formatDateToISO(dataFim);

    dispatch(
      createReservationAction({
        funcionarioId,
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

        toast.success("Reserva efetuada com sucesso.");
        setIsLoading(false);
        onClose();
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
        toast.error(error.response.data);
        setError(error.response.data);
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
      aria-labelledby="createReservationModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createReservationModalLabel">
              CADASTRAR
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
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Data Fim</label>
                <Calendar
                  onDateSelect={handleDateFimSelect}
                  accommodationId={accommodationId}
                  selectedDate={form.dataFim}
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
                  className="btn btn-outline-danger fw-bold bg-gradient rounded shadow"
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

export default CreateReservationModal;
