import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUserAction } from "../../../redux/actions/userActions";
import InputMask from "react-input-mask";
import { toast } from "sonner";



//Modal para criar usuário, ele é acionado por meio do botão CADASTRAR na page user, possuí um form para preenchimento com informações como cpf, senha, email, definição de perfil e habilitado, somente alguem com perfil ADMINISTRADOR possuí acesso, após preenchimento com dados validos o modal é fechado e o usuário ficara listado na page user.
const CreateUserModal = ({ isVisible, onClose, fetchUsers }) => {
  const [form, setForm] = useState({
    cpf: "",
    senha: "",
    nome: "",
    email: "",
    perfil: "",
    habilitado: false,
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    dispatch(createUserAction(form))
      .then(() => {
        fetchUsers();
        toast.success("Usuário cadastrado com sucesso.");
        setIsLoading(false);
        onClose();
        setForm({
          cpf: "",
          senha: "",
          nome: "",
          email: "",
          perfil: "",
          habilitado: false,
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
              <h5 className="modal-title bold" id="createUserModalLabel">
                CADASTRAR
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
                  <label htmlFor="formNome" className="form-label">
                    Nome
                  </label>
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
                  <label htmlFor="formCpf" className="form-label">
                    CPF
                  </label>
                  <InputMask
                    mask="999.999.999-99"
                    type="text"
                    className="form-control"
                    name="cpf"
                    id="cpf"
                    placeholder="Digite seu CPF"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formSenha" className="form-label">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="formSenha"
                    placeholder="Senha"
                    value={form.senha}
                    onChange={(e) =>
                      setForm({ ...form, senha: e.target.value })
                    }
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
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formPerfil" className="form-label">
                    Perfil
                  </label>
                  <select
                    className="form-control"
                    id="formPerfil"
                    value={form.perfil}
                    onChange={(e) =>
                      setForm({ ...form, perfil: e.target.value })
                    }
                  >
                    <option value="">Selecione o Perfil</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="FUNCIONARIO">Funcionário</option>
                  </select>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="formHabilitado"
                    checked={form.habilitado}
                    onChange={(e) =>
                      setForm({ ...form, habilitado: e.target.checked })
                    }
                  />
                  <label className="form-check-label" htmlFor="formHabilitado">
                    Habilitado
                  </label>
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

export default CreateUserModal;
