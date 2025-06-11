import React, { useState } from "react";
import { updatePassword } from "./../../services/userService";
import { toast } from "sonner";


//Esse componente é um modal que abre ao ser acionado no navbar ("Alterar Senha"), ele têm dois inputs onde o usuário pode digitar a nova senha duas vezes, apos confirmar as senhas e clicar em salvar, a senha é alterada e o modal fechado.
const ChangePasswordModal = ({ isVisible, onClose }) => {
  const [form, setForm] = useState({
    senha: "",
    confirmarSenha: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (form.senha !== form.confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    const newPassword = form.senha;

    updatePassword(newPassword)
      .then(() => {
        toast.success("Senha atualizada com sucesso.");
        setIsLoading(false);
        onClose();
        setForm({
          senha: "",
          confirmarSenha: "",
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
        className="modal fade show"
        tabIndex="-1"
        aria-labelledby="changePasswordModalLabel"
        aria-hidden={!isVisible}
        style={{ display: isVisible ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="changePasswordModalLabel">
                Alterar Senha
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Fechar"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="formSenha" className="form-label">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="formSenha"
                    placeholder="Digite sua nova senha"
                    value={form.senha}
                    onChange={(e) =>
                      setForm({ ...form, senha: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formConfirmarSenha" className="form-label">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="formConfirmarSenha"
                    placeholder="Confirme sua senha"
                    value={form.confirmarSenha}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        confirmarSenha: e.target.value,
                      })
                    }
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
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

export default ChangePasswordModal;
