import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAmenityAction } from "../../../redux/actions/amenityActions";
import { toast } from "sonner";


//Modal que é acionado na page aminty, permite editar uma amenidade que já foi cadastrada por meio de um input, possui um botão para salvar e outro para fechar o modal.
const EditAmenityModal = ({
  isVisible,
  onClose,
  amenityToEdit,
  fetchAmenities,
}) => {
  const [form, setForm] = useState({
    id: "",
    nome: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setError("");
    if (amenityToEdit) {
      setForm(amenityToEdit);
    }
  }, [amenityToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    dispatch(updateAmenityAction(form.id, form))
      .then(() => {
        fetchAmenities();
        toast.success("Amenidade atualizada com sucesso.");
        setIsLoading(false);
        onClose();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
        setError(error.response.data);
      });
  };

  return (
    isVisible && (
      <div
        className={`modal fade ${isVisible ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="editAmenityModalLabel"
        aria-hidden={!isVisible}
        style={{ display: isVisible ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editAmenityModalLabel">
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
                <div className="row">
                  <div className="mb-3 col-12 col-md-6 w-100">
                    <label htmlFor="formNome" className="form-label">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="formNome"
                      placeholder="Nome"
                      value={form.nome}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          nome: e.target.value,
                        })
                      }
                    />
                  </div>
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

export default EditAmenityModal;
