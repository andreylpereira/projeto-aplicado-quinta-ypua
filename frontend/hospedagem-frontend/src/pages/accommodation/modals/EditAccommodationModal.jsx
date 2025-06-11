import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAccommodationAction } from "../../../redux/actions/accommodationActions";
import { fetchAmenities } from "../../../redux/actions/amenityActions";
import { toast } from "sonner";


//Modal de edição de acomodação, ele é acessado através da interação do icon "EDITAR" na page accommodation. Ele é um formulário onde permite o usuário edite as informações da acomodação especifica e salvar. Caso haver informações incorretas será informado por meio de Toast e mensagem de erro sobre o mesmo.
const EditAccommodationModal = ({
  isVisible,
  onClose,
  accommodationToEdit,
  fetchAccommodations,
}) => {
  const [form, setForm] = useState(null);
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [imageData, setImageData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { amenities } = useSelector((state) => state.amenity);

  useEffect(() => {
    if (isVisible) {
      dispatch(fetchAmenities());
    }
  }, [isVisible, dispatch]);

  useEffect(() => {
    if (amenities) {
      setAvailableAmenities(amenities);
    }
  }, [amenities]);

  useEffect(() => {
    if (accommodationToEdit) {
      setForm(accommodationToEdit);
      setImageData({
        contentType: accommodationToEdit.contentType || "",
        base64Image: accommodationToEdit.base64Image || "",
      });
    }
  }, [accommodationToEdit]);

  if (!isVisible || !form) return null;

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      const updatedAmenities = checked
        ? [...form.amenidades, { id }]
        : form.amenidades.filter((amenity) => amenity.id !== id);
      setForm((prevForm) => ({ ...prevForm, amenidades: updatedAmenities }));
    } else if (type === "file" && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setImageData({ contentType: file.type, base64Image: base64String });
        setForm((prevForm) => ({
          ...prevForm,
          contentType: file.type,
          base64Image: base64String,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prevForm) => ({ ...prevForm, [id]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = { ...form, ...imageData };

    dispatch(updateAccommodationAction(formData.id, formData))
      .then(() => {
        fetchAccommodations();
        toast.success("Acomodação atualizada com sucesso.");
        setIsLoading(false);
        onClose();
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response?.data || "Erro desconhecido.");
        toast.error(error.response?.data || "Erro desconhecido.");
      });
  };

  return (
    <div
      className={`modal fade ${isVisible ? "show" : ""}`}
      style={{ display: isVisible ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">EDITAR</h5>
            <button
              type="button"
              className="btn-close"
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
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Nome"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  className="form-control"
                  id="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Descrição"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="capacidade">Capacidade</label>
                <input
                  type="number"
                  className="form-control"
                  id="capacidade"
                  value={form.capacidade}
                  onChange={handleChange}
                  placeholder="Capacidade"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="preco">Preço</label>
                <input
                  type="number"
                  className="form-control"
                  id="preco"
                  value={form.preco}
                  onChange={handleChange}
                  placeholder="Preço"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="habilitado">Habilitado</label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="habilitado"
                    checked={form.habilitado}
                    onChange={() =>
                      setForm({ ...form, habilitado: !form.habilitado })
                    }
                  />
                  <label className="form-check-label" htmlFor="habilitado">
                    Marque para habilitar a acomodação
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <h6>Amenidades:</h6>
                <div className="d-flex flex-wrap">
                  {availableAmenities.length > 0 ? (
                    availableAmenities.map((amenity) => (
                      <div key={amenity.id} className="form-check me-3 mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`amenity-${amenity.id}`}
                          checked={form.amenidades.some(
                            (selectedAmenity) =>
                              selectedAmenity.id === amenity.id
                          )}
                          onChange={() =>
                            handleChange({
                              target: {
                                id: amenity.id,
                                type: "checkbox",
                                checked: !form.amenidades.some(
                                  (selectedAmenity) =>
                                    selectedAmenity.id === amenity.id
                                ),
                              },
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`amenity-${amenity.id}`}
                        >
                          {amenity.nome}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>Carregando amenidades...</p>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="imagem">Imagem</label>
                <input
                  type="file"
                  className="form-control"
                  id="imagem"
                  onChange={handleChange}
                />
                {imageData.base64Image && (
                  <div className="mt-2">
                    <img
                      src={`data:${imageData.contentType};base64,${imageData.base64Image}`}
                      alt="Imagem pré-visualização"
                      className="img-fluid"
                      style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                  </div>
                )}
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
  );
};

export default EditAccommodationModal;
