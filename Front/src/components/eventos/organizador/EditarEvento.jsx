import { useEffect, useRef, useState } from "react";
import { AiFillCalendar, AiFillGolden } from "react-icons/ai";
import {
  BsFillCalendarDateFill,
  BsCloudUpload,
  BsKeyFill,
} from "react-icons/bs";
import { BiSolidCategoryAlt, BiTimeFive } from "react-icons/bi";
import { MdOutlinePlace, MdOutlineDescription } from "react-icons/md";
import "./CrearEventoStyle.css";
import { editarEvento } from "../../../api/Api";
import { AES } from "crypto-js";
import jwt_decode from "jwt-decode";

/*
 * @props => Objeto Evento
 */
export function EditarEvento({ evento, getDataEventos }) {
  const [preview, setPreview] = useState(null);
  const inputFile = useRef(null);

  const [image, setImage] = useState(null);
  const [nombreEvento, setNombreEvento] = useState();
  const [categoria, setCategoria] = useState();
  const [fecha, setFecha] = useState();
  const [tipoEvento, setTipoEvento] = useState();
  const [inicio, setInicio] = useState();
  const [fin, setFin] = useState();
  const [lugar, setLugar] = useState();
  const [descripcion, setDescripcion] = useState();
  const [pass, setPass] = useState("");
  const [hideBTN, setHide] = useState("disabled");

  useEffect(() => {
    var elems = document.querySelectorAll(".modal");
    M.Modal.init(elems, {
      opacity: 0.7,
    });

    var elems2 = document.querySelectorAll("select");
    M.FormSelect.init(elems2, {
      classes: "selectPersonalizado",
    });

    var elems3 = document.querySelectorAll(".timepicker");
    M.Timepicker.init(elems3, {
      showClearBtn: true,
    });

    var elems4 = document.querySelectorAll(".datepicker");
    M.Datepicker.init(elems4, {
      showDaysInNextAndPreviousMonths: true,
      showClearBtn: true,
      format: "dd/mm/yyyy",
    });

    var elems5 = document.querySelectorAll(".chips");
    M.Chips.init(elems5, {
      placeholder: "+ Localidad",
    });

    var elems6 = document.querySelectorAll(".materialboxed");
    M.Materialbox.init(elems6, {});
  }, []);

  useEffect(() => {
    if (pass != "") {
      setHide("");
    } else {
      setHide("disabled");
    }
  }, [pass]);

  const openFileExp = () => {
    inputFile.current.click();
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPreview("");
      return;
    }

    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        let base = reader.result;
        let content = reader.result.split(",");
        setPreview(base);
        setImage(content[1]);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleEditarEvento = async () => {
    const token = sessionStorage.getItem("token");
    const Tipo = jwt_decode(token);

    const encryptedPassword = AES.encrypt(
      pass,
      import.meta.env.VITE_REACT_APP_CRYPTO_KEY_FRONTEND
    ).toString();

    const flag = await editarEvento({
      id_evento: evento.idEvento,
      nombre_evento: nombreEvento,
      fecha: fecha,
      hora_inicio: inicio,
      hora_fin: fin,
      lugar: lugar,
      descripcion: descripcion,
      clasificacion: categoria,
      imagen: image,
      tipo_evento: tipoEvento,
      id_usr: Tipo.usuario,
      pass: encryptedPassword,
    });

    clearInputs();

    if (flag) {
      setTimeout(() => {
        getDataEventos();
      }, 500);
    }
  };

  const clearInputs = () => {
    setNombreEvento("");
    setFecha("");
    setInicio("");
    setFin("");
    setLugar("");
    setDescripcion("");
    setCategoria("0");
    setTipoEvento("");
    setImage(null);
    setPreview("");
    setPass("");
  };

  useEffect(() => {
    if (evento !== null) {
      console.log(evento);
      setNombreEvento(evento.nombre);
      setFecha(
        evento.fecha !== undefined ? evento.fecha.split("T")[0] : evento.fecha
      );
      setInicio(evento.hora_inicio);
      setFin(evento.hora_fin);
      setLugar(evento.lugar);
      setDescripcion(evento.descripcion);
      setCategoria(evento.categoria);
      setTipoEvento(evento.tipo);
      setPreview(evento.imagen_promo);
    }
  }, [evento]);

  return (
    <>
      <div id="TarjetaEditarEvento" className="modal">
        <div
          className="modal-content"
          style={{ padding: "0px", margin: "0px" }}
        >
          <div
            className="card horizontal transparent"
            style={{ padding: "0px", margin: "0px", border: "0px" }}
          >
            <div className="card-image" style={{ paddingTop: "15%" }}>
              <div className="row" style={{ maxWidth: "225px" }}>
                <img src={preview} height={300} className="materialboxed" />
              </div>
              <div className="row centerElements">
                <a
                  className="waves-effect waves-light btn-large centerElements"
                  style={{ paddingLeft: "22px", paddingRight: "22px" }}
                  onClick={openFileExp}
                >
                  <BsCloudUpload
                    className="prefix"
                    color="white"
                    size={23}
                    style={{ paddingTop: "5px" }}
                  />
                  &nbsp; Cargar Imagen
                </a>
                <input
                  type="file"
                  id="file"
                  ref={inputFile}
                  className="hide"
                  accept="image/*"
                  onChange={onSelectFile}
                />
              </div>
            </div>
            <div className="card-stacked">
              <div className="card-content">
                <div className="row">
                  <h4 className="white-text center-align">Editar Evento</h4>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <AiFillCalendar className="prefix" color="white" />
                    <input
                      id="nameEventEdit"
                      type="text"
                      className="validate white-text"
                      onChange={(e) => setNombreEvento(e.target.value)}
                      value={nombreEvento}
                    />
                    <label htmlFor="nameEventEdit" className="active">
                      Nombre Del Evento
                    </label>
                  </div>
                  <div className="input-field col s6">
                    <BiSolidCategoryAlt className="prefix" color="white" />
                    <select
                      defaultValue={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      <option value="0" disabled>
                        Clasificacion
                      </option>
                      <option value="1">{"Todo Publico (+A)"}</option>
                      <option value="2">{"Mayores De 13 Años (+13)"}</option>
                      <option value="3">{"Mayores De 18 Años (+18)"}</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <BsFillCalendarDateFill
                      className="prefix"
                      color="white"
                      size={27}
                    />
                    <input
                      id="dateEventEdit"
                      type="text"
                      className="datepicker white-text"
                      onChange={(e) => setFecha(e.target.value)}
                      value={fecha}
                    />
                    <label htmlFor="dateEventEdit" className="active">
                      Fecha Del Evento
                    </label>
                  </div>
                  <div className="input-field col s6">
                    <AiFillGolden className="prefix" color="white" />
                    <input
                      id="typeEventEdit"
                      type="text"
                      className="validate white-text"
                      onChange={(e) => setTipoEvento(e.target.value)}
                      value={tipoEvento}
                    />
                    <label htmlFor="typeEventEdit" className="active">
                      Tipo De Evento
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <BiTimeFive className="prefix" color="white" size={27} />
                    <input
                      id="timeInitEventEdit"
                      type="text"
                      className="timepicker white-text"
                      onChange={(e) => setInicio(e.target.value)}
                      value={inicio}
                    />
                    <label htmlFor="timeInitEventEdit" className="active">
                      Hora De Inicio Del Evento
                    </label>
                  </div>
                  <div className="input-field col s6">
                    <BiTimeFive className="prefix" color="white" />
                    <input
                      id="timeEndEventEdit"
                      type="text"
                      className="timepicker white-text"
                      onChange={(e) => setFin(e.target.value)}
                      value={fin}
                    />
                    <label htmlFor="timeEndEventEdit" className="active">
                      Hora De Fin Del Evento
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <MdOutlinePlace className="prefix" color="white" />
                    <input
                      id="placeEventEdit"
                      type="text"
                      className="validate white-text"
                      onChange={(e) => setLugar(e.target.value)}
                      value={lugar}
                    />
                    <label htmlFor="placeEventEdit" className="active">
                      Lugar Del Evento
                    </label>
                  </div>
                  <div className="input-field col s6">
                    <MdOutlineDescription className="prefix" color="white" />
                    <input
                      id="descriptionEventEdit"
                      type="text"
                      className="validate white-text"
                      onChange={(e) => setDescripcion(e.target.value)}
                      value={descripcion}
                    />
                    <label htmlFor="descriptionEventEdit" className="active">
                      Descripcion Del Evento
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s7 offset-s2">
                    <BsKeyFill className="prefix" color="white" />
                    <input
                      id="passwordOrgConf"
                      type="password"
                      className="validate white-text"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                    />
                    <label htmlFor="passwordOrgConf">Ingrese Su Password</label>
                  </div>
                </div>
                <div className="row">
                  <div className="col s4 offset-s2">
                    <a
                      href="#!"
                      className={
                        "modal-close waves-effect waves-light btn green white-text " +
                        hideBTN
                      }
                      onClick={() => handleEditarEvento()}
                    >
                      <i className="material-icons left white-text">update</i>
                      ACTUALIZAR
                    </a>
                  </div>
                  <div className="col s4 offset-s1">
                    <a
                      href="#!"
                      className="modal-close waves-effect waves-light btn red white-text"
                      onClick={() => clearInputs()}
                    >
                      <i className="material-icons right white-text">cancel</i>
                      CANCELAR
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
