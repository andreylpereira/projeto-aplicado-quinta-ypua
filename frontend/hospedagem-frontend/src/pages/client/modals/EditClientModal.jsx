import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateClientAction } from "../../../redux/actions/clientActions";
import IMask from "react-input-mask";
import { toast } from "sonner";

//O componente modal de editar cliente, é acionado na page client. Permite editar dados do cliente selecionado, mediante a alteração do form com seus dados válidos e a submissão pelo botão Salvar. O modal informar por meio de toastr e mensagem se foi salvo/alterado com sucesso ou algum erro especifico.
const EditClientModal = ({
  isVisible,
  onClose,
  clientToEdit,
  fetchClients,
  cpfMask,
}) => {
  const [form, setForm] = useState({
    id: "",
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setError("");
    if (clientToEdit) {
      setForm(clientToEdit);
    }
  }, [clientToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    
    dispatch(updateClientAction(form.id, form))
      .then(() => {
        fetchClients();
        toast.success("Cliente atualizado com sucesso.");
        setIsLoading(false);
        onClose();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data);
        setError(error.response.data);
      });
  };

  return (
    isVisible && (
      <div
        className={`modal fade ${isVisible ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="editClientModalLabel"
        aria-hidden={!isVisible}
        style={{ display: isVisible ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editClientModalLabel">
                EDITAR
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Fechar"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="formCpf" className="form-label">
                    CPF
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={cpfMask(form.cpf)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formNome" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="formNome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="formEmail"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formTelefone" className="form-label">
                    Telefone
                  </label>
                  <IMask
                    mask="(99) 99999-9999"
                    className="form-control"
                    id="formTelefone"
                    value={form.telefone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        telefone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formEndereco" className="form-label">
                    Endereço
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="formEndereco"
                    value={form.endereco}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endereco: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-danger fw-bold bg-gradient rounded shadow"
                    onClick={onClose}
                  >
                    Fechar
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
    )
  );
};

export default EditClientModal;
