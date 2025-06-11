import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAccommodationAction } from "../../../redux/actions/accommodationActions";
import { fetchAmenities } from "../../../redux/actions/amenityActions";
import { toast } from "sonner";


//Modal de criação de acomodação, ele é acessado através da interação do botão "CADASTRAR" na page accommodation. Ele é um formulário onde permite o usuário preencher as informações e salvar. Caso haver informações incorretas será informado por meio de Toast e mensagem de erro sobre o mesmo.
const CreateAccommodationModal = ({
  isVisible,
  onClose,
  fetchAccommodations,
}) => {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    capacidade: "",
    preco: "",
    habilitado: true,
    amenidades: [],
    contentType: "",
    base64Image: "",
  });

  const [availableAmenities, setAvailableAmenities] = useState([]);
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

  const handleChange = (id) => {
    const selectedAmenity = availableAmenities.find(
      (amenity) => amenity.id === id
    );
    let updatedAmenities = [...form.amenidades];

    if (updatedAmenities.some((amenity) => amenity.id === id)) {
      updatedAmenities = updatedAmenities.filter(
        (amenity) => amenity.id !== id
      );
    } else {
      updatedAmenities.push(selectedAmenity);
    }

    setForm({
      ...form,
      amenidades: updatedAmenities,
    });
  };

  const handleHabilitadoChange = () => {
    setForm({
      ...form,
      habilitado: !form.habilitado,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const contentType = file.type;
        const base64Image = base64String.split(",")[1];

        setForm({
          ...form,
          contentType,
          base64Image,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (!form.nome || !form.descricao || !form.capacidade || !form.preco) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    dispatch(createAccommodationAction(form))
      .then(() => {
        fetchAccommodations();
        toast.success("Acomodação cadastrada com sucesso.");
        setIsLoading(false);
        onClose();
        setForm({
          nome: "",
          descricao: "",
          capacidade: "",
          preco: "",
          habilitado: true,
          amenidades: [],
          contentType: "",
          base64Image: "",
        });
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
        style={{ display: isVisible ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">CADASTRAR</h5>
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
                  <label htmlFor="formNome">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    id="formNome"
                    placeholder="Nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="formDescricao">Descrição</label>
                  <textarea
                    className="form-control"
                    id="formDescricao"
                    placeholder="Descrição"
                    value={form.descricao}
                    onChange={(e) =>
                      setForm({ ...form, descricao: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="formCapacidade">Capacidade</label>
                  <input
                    type="number"
                    className="form-control"
                    id="formCapacidade"
                    placeholder="Capacidade"
                    value={form.capacidade}
                    onChange={(e) =>
                      setForm({ ...form, capacidade: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="formPreco">Preço</label>
                  <input
                    type="number"
                    className="form-control"
                    id="formPreco"
                    placeholder="Preço"
                    value={form.preco}
                    onChange={(e) =>
                      setForm({ ...form, preco: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="formHabilitado" className="form-label">
                    Habilitado
                  </label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="formHabilitado"
                      checked={form.habilitado}
                      onChange={handleHabilitadoChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="formHabilitado"
                    >
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
                            onChange={() => handleChange(amenity.id)}
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
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="formImagem">Imagem</label>
                  <input
                    type="file"
                    className="form-control"
                    id="formImagem"
                    onChange={handleImageUpload}
                  />
                  {form.base64Image && (
                    <div className="mt-2">
                      <img
                        src={`data:${form.contentType};base64,${form.base64Image}`}
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
    )
  );
};

export default CreateAccommodationModal;
