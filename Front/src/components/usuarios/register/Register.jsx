import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import "materialize-css/dist/css/materialize.min.css";
import "../../../styles/register/Register.css";
import M from "materialize-css";
import { AES } from "crypto-js";

export default function Register() {
  //const url = "http://localhost:3001";
  const url2 = `${import.meta.env.VITE_REACT_APP_API_URL}api=usuario&id=`;
  const urlx = `${
    import.meta.env.VITE_REACT_APP_API_URL
  }api=sondeo&id=registro`;
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    fnacimiento: "",
    nom_usuario: "",
    tip_usuario: { value: "Usuario", label: "Usuario" },
    contrasena: "",
    contrasena2: "",
  });
  const fetchData = async () => {
    try {
      const response = await fetch(urlx, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      const data = await response.json();

      console.log(data);

      if (data.body.res) {
        M.toast({
          html: "Usuario registrado exitosamente",
          classes: "rounded green",
        });
        window.location.href = "/";
      } else {
        M.toast({ html: data.body.message, classes: "rounded red" });
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
      // Aquí puedes mostrar un mensaje de error al usuario si es necesario
    }
  };
  useEffect(() => {
    M.AutoInit(); // Initialize Materialize components
    // Llama a fetchData al cargar el componente
    fetchData();

    // Configura un intervalo para llamar a fetchData cada 3 segundos
    const intervalId = setInterval(fetchData, 3000);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Validar el campo de correo electrónico
    if (name === "correo") {
      const emailInput = document.getElementById("correo");
      setIsEmailValid(emailInput.validity.valid);
    }

    if (name === "contrasena") {
      //resetear isPasswordValid si es true pasar a false y viceversa
      const passwordInput = document.getElementById("contrasena");
      setIsPasswordValid(formData.contrasena2 === passwordInput.value);
    }

    if (name === "contrasena2") {
      //resetear isPasswordValid si es true pasar a false y viceversa
      const password2Input = document.getElementById("contrasena2");
      setIsPasswordValid(formData.contrasena === password2Input.value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegistration = () => {
    // Validar que los campos no estén vacíos
    for (const property in formData) {
      if (formData[property] === "") {
        // Mostrar mensaje de error en el campo vacío
        M.toast({
          html: "Por favor, llene todos los campos",
          classes: "rounded red",
        });
        return;
      }
    }

    if (!isEmailValid) {
      // Mostrar mensaje de error en el correo electrónico
      M.toast({ html: "Correo inválido", classes: "rounded red" });
      return;
    }
    if (!isPasswordValid) {
      // Mostrar mensaje de error en el correo electrónico
      M.toast({ html: "Contraseña no coincide", classes: "rounded red" });
      return;
    }

    console.log(formData);

    fetchApi();
  };

  // Función para calcular la edad a través de la fecha de nacimiento que se ingrese
  const calcularEdad = (fecha) => {
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();

    // Restar un año si aún no ha pasado el cumpleaños en este año
    if (
      hoy.getMonth() < cumpleanos.getMonth() ||
      (hoy.getMonth() === cumpleanos.getMonth() &&
        hoy.getDate() < cumpleanos.getDate())
    ) {
      edad--;
    }

    return edad;
  };

  const fetchApi = async () => {
    try {
      //encriptado password
      const encryptedPassword = AES.encrypt(
        formData.contrasena,
        import.meta.env.VITE_REACT_APP_CRYPTO_KEY_FRONTEND
      ).toString();

      const requestBody = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        edad: calcularEdad(formData.fnacimiento),
        fnacimiento: formData.fnacimiento,
        nom_usuario: formData.nom_usuario,
        tip_usuario: formData.tip_usuario.value === "Usuario" ? 0 : 1,
        contrasena: encryptedPassword,
      };
      console.log("requestbody: ", requestBody);
      const response = await fetch(`${url2}registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      //const data = await response.json();
      //console.log(data);
      //if (data.body.res) {
      //  M.toast({
      //    html: "Usuario registrado exitosamente",
      //    classes: "rounded green",
      //  });
      //  window.location.href = "/";
      //} else {
      //  M.toast({ html: data.body.message, classes: "rounded red" });
      //}
    } catch (error) {
      console.log(error);
    }
  };

  // Opciones para el selector react-select
  const userOptions = [
    { value: "Usuario", label: "Usuario" },
    { value: "Organizador", label: "Organizador" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#1D5B79",
      color: "white",
      borderColor: state.isFocused ? "#EF6262" : provided.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #EF6262" : provided.boxShadow,
      "&:hover": {
        borderColor: "#EF6262",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#EF6262"
        : state.isFocused
        ? "#1D5B79"
        : "white",
      color: state.isSelected ? "white" : state.isFocused ? "white" : "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col s12 m8 offset-m2">
          <div
            className="card white-text"
            style={{ backgroundColor: "#1D5B79", border: "3px solid #EF6262" }}
          >
            <div className="row center">
              <i
                className="material-icons centered-icon"
                style={{ fontSize: "48px", margin: "0px" }}
              >
                addperson
              </i>
              <h5 className="centered-h3-registro">REGISTRO</h5>
            </div>

            <div className="card-content ">
              <div className="input-field">
                <label
                  htmlFor="nombre"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombres"
                  id="nombres"
                  className="validate"
                  style={{ color: "white" }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label
                  htmlFor="apellido"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellidos"
                  id="apellidos"
                  className="validate"
                  style={{ color: "white" }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label
                  htmlFor="email"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Email
                </label>
                <input
                  className={`validate ${isEmailValid ? "" : "invalid"}`}
                  type="email"
                  name="correo"
                  id="correo"
                  style={{ color: "white" }}
                  onChange={handleInputChange}
                />
                <span
                  className="helper-text"
                  data-error="Correo inválido"
                ></span>
              </div>
              <div className="form-field">
                <label
                  htmlFor="fechaNacimiento"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fnacimiento"
                  id="fnacimiento"
                  className="validate"
                  style={{ color: "white" }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label
                  htmlFor="username"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  name="nom_usuario"
                  id="nom_usuario"
                  className="validate"
                  style={{ color: "white" }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field">
                <label
                  htmlFor="tipoUsuario"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Tipo de Usuario
                </label>
                <Select
                  value={formData.tip_usuario}
                  onChange={(selectedOption) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      tip_usuario: selectedOption,
                    }))
                  }
                  options={userOptions}
                  styles={customStyles}
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
              <div className="input-field">
                <label
                  htmlFor="password2"
                  style={{ color: "#F3AA60", fontWeight: "bold" }}
                >
                  Confirmar Contraseña
                </label>
                <input
                  className={`validate ${isPasswordValid ? "" : "invalid"}`}
                  type="password"
                  name="contrasena2"
                  id="contrasena2"
                  style={{ color: "white" }}
                  onChange={handleInputChange}
                />
                <span
                  className="helper-text"
                  data-error="Contraseña no coincide"
                ></span>
              </div>
              <div className="form-field center">
                {/*<button className="btn-large waves-effect waves-light red lighten-1 pulse" */}
                <button
                  className="btn-large waves-effect waves-light red lighten-1"
                  style={{
                    fontWeight: "bold",
                    margin: "0px",
                    borderRadius: "20px",
                  }}
                  onClick={handleRegistration}
                >
                  Registrarse
                </button>
              </div>
            </div>
            {/*añadir una tarjeta con color #468B97 en donde diga ya tienes cuenta? y una palabra Login  */}
            <div
              className="card-action center"
              style={{ backgroundColor: "#468B97" }}
            >
              <p style={{ color: "white", margin: "0px" }}>
                ¿Ya tienes cuenta?
              </p>
              <a
                href="/"
                style={{ color: "#F3AA60", fontWeight: "bold", margin: "0px" }}
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
