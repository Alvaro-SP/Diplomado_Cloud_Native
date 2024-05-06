import { BiSolidRename } from "react-icons/bi";
import { MdPassword, MdOutlinePassword } from "react-icons/md";
import { BsMailbox } from "react-icons/bs";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaUserAstronaut, FaBirthdayCake } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import jwtDecode from "jwt-decode";
import { AES } from "crypto-js";

export default function Perfil(props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [edad, setEdad] = useState("");
  const [fechaN, setFechaN] = useState("");
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordc, setPasswordc] = useState("");
  const [passwordcc, setPasswordcc] = useState("");
  const [user, setUser] = useState(props.user);

  const url = `${import.meta.env.VITE_REACT_APP_API_URL}api=usuario&id=`;
  useEffect(() => {
    console.log("Desde perfil");
    console.log(props, user);
    M.AutoInit();
    getData();
  }, []);

  const getData = async () => {
    var data = {
      id: 1 /*Se debe cambiar por el de sesion empresa */,
    };
    try {
      const result = (await axios.get(url + "getUsuario&evt=" + user)).data;
      console.log(result.body);

      if (result.body) {
        setNombre(result.body.nombre);
        setApellido(result.body.apellido);
        setCorreo("");
        setEdad(result.body.edad);
        setFechaN(result.body.fecha_nac.split("T")[0]);
        setNickName(result.body.user);
      } else {
        /*M.toast({
                    html: result.message,
                    classes: "white-text rounded red darken-4",
                });*/
        console.log("error");
      }
    } catch (error) {
      /*M.toast({
                html: error.message,
                classes: "white-text rounded red darken-4",
            });*/
      console.log(error);
    }
  };

  const agregar = async () => {
    const encryptedPassword = AES.encrypt(
      passwordcc,
      import.meta.env.VITE_REACT_APP_CRYPTO_KEY_FRONTEND
    ).toString();

    let encryptedPassword2 = AES.encrypt(
      password,
      import.meta.env.VITE_REACT_APP_CRYPTO_KEY_FRONTEND
    ).toString();

    if (password == "") {
      encryptedPassword2 = "";
    }
    if (password == passwordc) {
      const data = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        edad: edad,
        fechaN: fechaN,
        pass: encryptedPassword,
        passn: encryptedPassword2,
        user: user,
      };

      console.log(data);

      try {
        const result = (await axios.post(url + "editarPerfil", data)).data;
        console.log("RESULT", result);
        if (result.body) {
          window.location.reload();
          /*M.toast({
                        html: "Se agrego con exito",
                        classes: "white-text rounded green darken-4",
                    });*/
        } else {
          /*M.toast({
                        html: result.message,
                        classes: "white-text rounded red darken-4",
                    });*/
        }
      } catch (error) {
        console.log(error);
        M.toast({
          html: error.response.data.body,
          classes: "white-text rounded red darken-4",
        });
      }
    }
  };

  const darsebaja = async () => {
    const data = {
      correo: correo,
    };

    console.log(data);

    try {
      const result = (await axios.post(url + "bloquearCuenta", data)).data;
      console.log("RESULT", result);
      if (result.body) {
        sessionStorage.clear();
        window.location.href = "/";
        /*M.toast({
                      html: "Se agrego con exito",
                      classes: "white-text rounded green darken-4",
                  });*/
      } else {
        /*M.toast({
                      html: result.message,
                      classes: "white-text rounded red darken-4",
                  });*/
      }
    } catch (error) {
      console.log(error);
      M.toast({
        html: error.response.data.body,
        classes: "white-text rounded red darken-4",
      });
    }
  };
  return (
    <>
      <div className="container">
        <h1 className="white-text" style={{ textAlign: "center" }}>
          Perfil
        </h1>
        <div className="row">
          <div className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <BiSolidRename color="white"></BiSolidRename>
                </i>
                <input
                  id="nombre"
                  value={nombre}
                  type="text"
                  className="validate white-text"
                  onChange={(e) => setNombre(e.target.value)}
                />
                <label className="active" htmlFor="nombre">
                  Nombre
                </label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <BiSolidRename color="white"></BiSolidRename>
                </i>
                <input
                  id="apellido"
                  value={apellido}
                  type="text"
                  className="validate white-text"
                  onChange={(e) => setApellido(e.target.value)}
                />
                <label className="active" htmlFor="apellido">
                  Apellido
                </label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <BsMailbox color="white"></BsMailbox>
                </i>
                <input
                  id="correo"
                  value={correo}
                  type="email"
                  className="validate white-text"
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <label className="active" htmlFor="correo">
                  Correo
                </label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <AiOutlineFieldNumber color="white"></AiOutlineFieldNumber>
                </i>
                <input
                  id="edad"
                  value={edad}
                  type="number"
                  className="validate white-text"
                  onChange={(e) => setEdad(e.target.value)}
                />
                <label className="active" htmlFor="edad">
                  Edad
                </label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <FaBirthdayCake color="white"></FaBirthdayCake>
                </i>
                <input
                  id="fechaNacimiento"
                  value={fechaN}
                  type="date"
                  className="validate white-text"
                  onChange={(e) => setFechaN(e.target.value)}
                />
                <label className="active" htmlFor="fechaNacimiento">
                  Fecha Nacimiento
                </label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <FaUserAstronaut color="white"></FaUserAstronaut>
                </i>
                <input
                  id="nickname"
                  value={user}
                  disabled
                  type="text"
                  className="validate white-text"
                  onChange={(e) => setNickName(e.target.value)}
                />
                <label className="active" htmlFor="nickname">
                  Nickname
                </label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <MdOutlinePassword color="white"></MdOutlinePassword>
                </i>
                <input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="active" htmlFor="password">
                  Password
                </label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <MdPassword color="white"></MdPassword>
                </i>
                <input
                  id="passwordc"
                  type="password"
                  className="white-text"
                  onChange={(e) => setPasswordc(e.target.value)}
                />
                <label className="active" htmlFor="passwordc">
                  Confirme password
                </label>
              </div>
            </div>
            <a
              className="waves-effect waves-light btn modal-trigger"
              href="#modalConfirmarCambios"
            >
              Guardar
            </a>
            <a
              className="waves-effect waves-light red btn modal-trigger"
              href="#modaleliminar"
            >
              Eliminar
            </a>
          </div>
          <div className="row">
            <QRCode value={user} />
          </div>
        </div>

        <div id="modalConfirmarCambios" className="modal">
          <div className="modal-content">
            <h4>Confirmar</h4>
            <h6 className="red-text text-darken-2">
              Digite su password actual
            </h6>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <MdPassword></MdPassword>
                </i>
                <input
                  id="passwordcc"
                  type="password"
                  className="validate"
                  onChange={(e) => setPasswordcc(e.target.value)}
                />
                <label htmlFor="passwordcc">Password actual</label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <a
              href="#!"
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => agregar()}
            >
              Agree
            </a>
          </div>
        </div>

        <div id="modaleliminar" className="modal">
          <div className="modal-content">
            <h4>Confirmar</h4>
            <h6 className="red-text text-darken-2">
              Digite su correo para darse de baja.
            </h6>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">
                  <BsMailbox></BsMailbox>
                </i>
                <input
                  id="correoe"
                  type="email"
                  className="validate"
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <label htmlFor="correoe">Digite su correo.</label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <a
              href="#!"
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => darsebaja()}
            >
              Agree
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
