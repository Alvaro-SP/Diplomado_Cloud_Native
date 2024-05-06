import { useEffect, useState } from "react";
import {
  MdOutlineFreeCancellation,
  MdPassword,
  MdCancel,
} from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { cancelarEvento } from "../../../api/Api";
import "./CancelarEvento.css";
import { AES } from "crypto-js";
import jwt_decode from "jwt-decode";

export function CancelarEvento({ idEvento, nombre, getDataEventos }) {
  const [motivo, setMotivo] = useState("");
  const [passCancel, setPassCancel] = useState("");
  const [disable, setDisable] = useState("disabled");

  useEffect(() => {
    var elems = document.querySelectorAll(".modal");
    M.Modal.init(elems, {
      opacity: 0.7,
    });
  }, []);

  useEffect(() => {
    if (motivo !== "" && passCancel !== "") {
      setDisable("");
    } else {
      setDisable("disabled");
    }
  }, [motivo, passCancel]);

  const handleCancelarEvento = () => {
    const token = sessionStorage.getItem("token");
    const Tipo = jwt_decode(token);

    const encryptedPassword = AES.encrypt(
      passCancel,
      import.meta.env.VITE_REACT_APP_CRYPTO_KEY_FRONTEND
    ).toString();

    const data = {
      id_evento: idEvento,
      motivo: motivo,
      pass: encryptedPassword,
      id_usr: Tipo.usuario,
    };

    console.log("DATA", data);

    let flag = cancelarEvento(data);
    clearInputs();

    if (flag) {
      setTimeout(() => {
        getDataEventos();
      }, 500);
    }
  };

  const clearInputs = () => {
    setPassCancel("");
    setMotivo("");
  };

  return (
    <>
      <div id="tarjetaCancelarEvento" class="modal">
        <div class="modal-content">
          <h4 className="white-text fontPersonalizada">Cancelar Evento</h4>
          <div className="divider"></div>
          <br />
          <div className="row center-align">
            <h6 className="white-text fontPersonalizada">
              Seguro Que Desea Cancelar El Evento{" "}
              <span className="orange-text fontPersonalizada">{nombre}</span>.
              Esta Opcion No Se Puede Deshacer.
            </h6>
          </div>
          <div className="row center-align">
            <h6 className="red-text  fontPersonalizada">
              <strong>
                NOTA: SI EL EVENTO CUENTA CON ASIENTOS RESERVADOS, NO SE PODRA
                CANCELAR
              </strong>
            </h6>
          </div>
          <div className="row">
            <div className="col s8 offset-s2 input-field">
              <MdOutlineFreeCancellation className="prefix" color="white" />
              <input
                id="motivo"
                type="text"
                className="validate white-text fontPersonalizada"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
              <label htmlFor="motivo" className="fontPersonalizada">
                Motivo Para Cancelar El Evento
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col s8 offset-s2 input-field">
              <MdPassword className="prefix" color="white" />
              <input
                id="passCancelOrg"
                type="password"
                className="validate white-text"
                value={passCancel}
                onChange={(e) => setPassCancel(e.target.value)}
              />
              <label htmlFor="passCancelOrg" className="fontPersonalizada">
                Ingrese Su Password
              </label>
            </div>
          </div>
        </div>
        <div className="container gridElements">
          <a
            class={
              "waves-effect waves-light btn green white-text centerContentBtn modal-close fontPersonalizada " +
              disable
            }
            onClick={() => handleCancelarEvento()}
          >
            <BsPatchCheckFill
              className="prefix"
              color="white"
              size={18}
              style={{ marginRight: "10px" }}
            />
            Aceptar
          </a>
          <a
            class="waves-effect waves-light btn red white-text centerContentBtn modal-close fontPersonalizada"
            onClick={clearInputs}
          >
            <MdCancel
              className="prefix"
              color="white"
              size={18}
              style={{ marginRight: "10px" }}
            />
            Cancelar
          </a>
        </div>
      </div>
    </>
  );
}
