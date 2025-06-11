import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginService } from "../../services/loginService";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import "./Login.css";
import { toast } from "sonner";


//Componente de page de login, ela é acessada automaticamente quando um usuário não está autenticado na aplicação. Com credências como cpf e senha, o usuário pode efetuar login por meio do ENTRAR e caso estiver com credências validas, será redirecionado para a page painel.
const Login = () => {
  const [form, setForm] = useState({
    cpf: "",
    senha: "",
  });

  const { login, auth } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/painel");
    }
  }, [auth.isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const acessToken = await loginService(form);
      login(acessToken);
      toast.success("Login efetuado com sucesso.");
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="background d-flex justify-content-center align-items-center page-height  user-select-none">
      <div className="d-flex">
        <div className="row justify-content-center card-width">
          <div>
            <div className="card shadow">
              <div className="card-header">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="text-center mb-3">
                      <svg
                        id="user-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        width="150"
                        height="150"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 14a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-2.67 0-8 1.337-8 4v2h16v-2c0-2.663-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="form-group mb-1">
                      <label htmlFor="cpf">CPF</label>
                      <InputMask
                        mask="999.999.999-99"
                        type="text"
                        className="form-control"
                        name="cpf"
                        id="cpf"
                        placeholder="Digite seu CPF"
                        value={form.cpf}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="senha">Senha</label>
                      <input
                        type="password"
                        className="form-control"
                        name="senha"
                        id="senha"
                        placeholder="Digite sua senha"
                        value={form.senha}
                        onChange={handleChange}
                      />
                    </div>
                    {isLoading ? (
                      <div className="d-flex justify-content-center align-items-center mt-3">
                        <div
                          className="spinner-border text-info"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-info w-100 mt-2 bg-gradient rounded fw-bold shadow"
                      >
                        <div>ENTRAR</div>
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
