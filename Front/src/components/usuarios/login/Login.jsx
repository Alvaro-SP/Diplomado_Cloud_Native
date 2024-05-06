import React, { useState, useEffect } from "react";
import "materialize-css/dist/css/materialize.min.css";
import "../../../styles/login/Login.css";
import M from "materialize-css";
import { AES } from "crypto-js";
import jwt_decode from "jwt-decode";

export default function Login() {
  const url = `${import.meta.env.VITE_REACT_APP_API_URL}api=usuario&id=`;
  //const url2 = `${process.env.REACT_APP_API_URL}api=usuario&id=`;
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const [isTokenModalOpen, setTokenModalOpen] = useState(false);
  const [token, setToken] = useState("");
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    M.AutoInit(); // Initialize Materialize components
    const token = sessionStorage.getItem("token");
    if (token !== null) {
      verificarRol(token);
    }
  }, []);

  const verificarRol = async (token) => {
    const Tipo = jwt_decode(token);
    const expiracion = Tipo.exp;
    if (expiracion < Date.now() / 1000) {
      sessionStorage.clear();
      M.toast({ html: "Su sesión ha expirado", classes: "rounded red" });
      await sleep(3000);
      window.location.href = "/";
    }
    if (Tipo.tipo === 0) {
      console.log(
        "Usuario normal",
        " usuario: ",
        Tipo.usuario,
        " tipo: ",
        Tipo.tipo
      );
      window.location.href = "/evento";
      // window.location.reload();
      //redireccionar a la pagina de usuario
    } else if (Tipo.tipo === 1) {
      console.log("Usuario organizador");
      //redireccionar a la pagina de organizador hola sistémico
      window.location.href = "/misEventos";
    } else if (Tipo.tipo === 2) {
      console.log("Usuario administrador");
      //redireccionar a la pagina de administrador
      window.location.href = "/perfil";
    } else {
      console.log("Error");
      //redireccionar a la pagina de error
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    // Validar que los campos no estén vacíos
    if (formData.correo === "" || formData.contrasena === "") {
      // Mostrar mensaje de error en el campo vacío
      M.toast({
        html: "Por favor, llene todos los campos",
        classes: "rounded red",
      });
      return;
    }

    fetchApi();
  };

  const fetchApi = async () => {
    try {
      //encriptado password
      const encryptedPassword = AES.encrypt(
        formData.contrasena,
        import.meta.env.VITE_REACT_APP_CRYPTO_KEY_FRONTEND
      ).toString();

      const requestBody = {
        correo: formData.correo,
        contrasena: encryptedPassword,
      };
      //const response = await fetch(`${url2}login`, {
      const response = await fetch(`${url}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);

      if (data.body.res === true) {
        M.toast({ html: data.body.message, classes: "rounded green" });

        sessionStorage.setItem("token", data.body.auth);
        verificarRol(data.body.auth);
      } else if (data.body.res === -1) {
        M.toast({ html: data.body.message, classes: "rounded blue" });
        //se procede a mostrar el modal para ingresar el token
        toggleTokenModal();
      } else {
        M.toast({
          html: data.body.message,
          classes: "rounded red",
        });
        setIntentos(intentos + 1);
        if (intentos == 4) {
          fetchblock();
          setIntentos(0);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetcthApiToken = async () => {
    try {
      //encriptado password
      const encryptedPassword = AES.encrypt(
        formData.contrasena,
        import.meta.env.VITE_REACT_APP_CRYPTO_KEY_FRONTEND
      ).toString();
      const requestBody = {
        correo: formData.correo,
        contrasena: encryptedPassword,
        token: token,
      };
      //const response = await fetch(`${url2}loginvalidate`, {
      const response = await fetch(`${url}loginvalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);

      if (data.body.res === true) {
        M.toast({ html: data.body.message, classes: "rounded green" });
        sessionStorage.setItem("token", data.body.auth);
        verificarRol(data.body.auth);
      } else {
        M.toast({ html: data.body.message, classes: "rounded red" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApiNewToken = async () => {
    try {
      //encriptado password
      const encryptedPassword = AES.encrypt(
        formData.contrasena,
        import.meta.env.VITE_REACT_APP_CRYPTO_KEY_FRONTEND
      ).toString();
      const requestBody = {
        correo: formData.correo,
        contrasena: encryptedPassword,
      };
      //const response = await fetch(`${url2}newtoken`, {
      const response = await fetch(`${url}newtoken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(data);

      if (data.body.res === true) {
        M.toast({ html: data.body.message, classes: "rounded green" });
      } else {
        M.toast({ html: data.body.message, classes: "rounded red" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTokenModal = () => {
    setTokenModalOpen(!isTokenModalOpen);
    setToken("");
  };

  const handleTokenSubmit = async () => {
    try {
      fetcthApiToken();
      // Cerrar el modal después de validar el token
      toggleTokenModal();
    } catch (error) {
      console.error(error);
      M.toast({ html: "Error al validar el token", classes: "rounded red" });
    }
  };

  const handleGenerateNewToken = () => {
    try {
      M.toast({ html: "Generando nuevo token...", classes: "rounded pink" });
      fetchApiNewToken();
      toggleTokenModal();
    } catch (error) {
      console.error(error);
      M.toast({ html: "Error al generar el token", classes: "rounded red" });
    }
  };

  //bloquear cuenta
  const fetchblock = async () => {
    try {
      const requestBody = {
        correo: formData.correo,
      };
      //const response = await fetch(`${url2}bloquearCuenta, {
      const response = await fetch(`${url}bloquearCuenta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      M.toast({ html: data.body.message, classes: "rounded red" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div className="row">
        <div className="col s12">
          <div
            className="card white-text"
            style={{
              backgroundColor: "#1D5B79",
              border: "3px solid #EF6262",
              width: "34em",
            }}
          >
            <div className="row center">
              <i
                className="material-icons centered-icon"
                style={{ fontSize: "48px", margin: "0px" }}
              >
                person
              </i>
              <h5
                className="centered-h3-login"
                style={{ color: "#F3AA60", fontWeight: "bold" }}
              >
                DIPLOMADO CLOUD NATIVE GRUPO 1
              </h5>
            </div>

            <div className="card-content">
              <div className="input-field">
                <label
                  htmlFor="email"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Email
                </label>
                <input
                  className="validate"
                  type="email"
                  name="correo"
                  id="correo"
                  style={{ color: "white" }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label
                  htmlFor="password"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="contrasena"
                  id="contrasena"
                  className="validate"
                  style={{ color: "white" }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field center">
                <button
                  className="btn-large waves-effect waves-light red lighten-1 pulse"
                  style={{
                    fontWeight: "bold",
                    margin: "0px",
                    borderRadius: "20px",
                  }}
                  id="btn-login"
                  onClick={handleLogin}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
            <div
              className="card-action center"
              style={{ backgroundColor: "#468B97" }}
            >
              <p style={{ color: "white", margin: "0px" }}>
                ¿No tienes cuenta?
              </p>
              {/*<a href="/register" style={{ color: "#F3AA60", fontWeight: "bold", margin: "0px" }} onClick={toggleTokenModal}> */}
              <a
                href="/register"
                style={{ color: "#F3AA60", fontWeight: "bold", margin: "0px" }}
              >
                Registrarse
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={`custom-modal-login ${isTokenModalOpen ? "open" : ""}`}>
        <div className="modal-content-login">
          <h4>Proporcione el token para verificar su cuenta</h4>
          <input
            type="text"
            placeholder="Escribe aqui el token..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#F3AA60",
            }}
            onClick={handleGenerateNewToken}
          >
            Generar Nuevo Token
          </p>
        </div>
        <div className="modal-footer-login">
          <button
            className="waves-effect waves-green  "
            onClick={handleTokenSubmit}
          >
            Enviar
          </button>
          <button
            className="waves-effect waves-red "
            onClick={toggleTokenModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
