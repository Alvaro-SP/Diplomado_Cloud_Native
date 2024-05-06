import { useEffect, useRef, useState } from "react";
import {
  AiFillCalendar,
  AiFillGolden,
  AiOutlineAppstoreAdd,
} from "react-icons/ai";
import { BsFillCalendarDateFill, BsCloudUpload } from "react-icons/bs";
import {
  BiSolidCategoryAlt,
  BiTimeFive,
  BiLocationPlus,
  BiSolidBadgeDollar,
} from "react-icons/bi";
import {
  MdOutlinePlace,
  MdOutlineDescription,
  MdTableRows,
  MdViewColumn,
  MdDelete,
} from "react-icons/md";
import "./CrearEventoStyle.css";
import { crearEvento } from "../../../api/Api";
import jwt_decode from "jwt-decode";

export default function CrearEventos() {
  const [preview, setPreview] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [nombreEvent, setNombreEvent] = useState();
  const [categoria, setCategoria] = useState("0");
  const [fecha, setFecha] = useState();
  const [tipoEvento, setTipoEvento] = useState();
  const [inicio, setInicio] = useState();
  const [fin, setFin] = useState();
  const [lugar, setLugar] = useState();
  const [descripcion, setDescripcion] = useState();

  const [localidades, setLocalidades] = useState([]);
  const [localidad, setLocalidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [filas, setFilas] = useState("");
  const [col, setCol] = useState("");

  const [isAnimation, setAnimation] = useState(false);

  const inputFile = useRef(null);

  useEffect(() => {
    var elems = document.querySelectorAll(".modal");
    M.Modal.init(elems, {
      opacity: 0.7,
    });

    var elems2 = document.querySelectorAll("select");
    M.FormSelect.init(elems2, {
      classes: "selectPersonalizado",
    });

    var elems3 = document.querySelectorAll("#timeInitEvent");
    M.Timepicker.init(elems3, {
      showClearBtn: true,
      twelveHour: false,
      onSelect: function (hour, minutes) {
        setInicio(hour + ":" + minutes);
      },
    });

    var elems7 = document.querySelectorAll("#timeEndEvent");
    M.Timepicker.init(elems7, {
      showClearBtn: true,
      twelveHour: false,
      onSelect: function (hour, minutes) {
        setFin(hour + ":" + minutes);
      },
    });

    var elems4 = document.querySelectorAll(".datepicker");
    M.Datepicker.init(elems4, {
      showDaysInNextAndPreviousMonths: true,
      showClearBtn: true,
      format: "yyyy-mm-dd",
      onSelect: function (date) {
        var fechaOriginal = new Date(date);

        var dia = fechaOriginal.getUTCDate();
        var mes = fechaOriginal.getUTCMonth() + 1;
        var anio = fechaOriginal.getUTCFullYear();

        var fechaFormateada =
          anio +
          "-" +
          (mes < 10 ? "0" : "") +
          mes +
          "-" +
          (dia < 10 ? "0" : "") +
          dia;
        setFecha(fechaFormateada);
      },
    });

    var elems6 = document.querySelectorAll(".materialboxed");
    M.Materialbox.init(elems6, {});
  }, []);

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
        setImagen(content[1]);
      };

      reader.readAsDataURL(file);
    }
  };

  const addLocality = () => {
    if (localidad === "" || precio === "" || filas === "" || col === "") {
      setAnimation(true);

      setTimeout(() => {
        setAnimation(false);
      }, 1000);
    } else {
      setLocalidades([
        ...localidades,
        {
          nombre: localidad,
          precio: precio,
          no_filas: filas,
          no_col: col,
        },
      ]);

      setLocalidad("");
      setPrecio("");
      setFilas("");
      setCol("");
    }
  };

  const removeLocality = (index) => {
    const newLocalidades = [...localidades];
    newLocalidades.splice(index, 1);
    setLocalidades(newLocalidades);
  };

  const handleCrearEvento = () => {
    const token = sessionStorage.getItem("token");
    const Tipo = jwt_decode(token);

    const data = {
      id_usr: Tipo.usuario,
      nombre_evento: nombreEvent,
      fecha: fecha,
      hora_inicio: inicio,
      hora_fin: fin,
      lugar: lugar,
      descripcion: descripcion,
      clasificacion: categoria,
      imagen: imagen,
      tipo_evento: tipoEvento,
      localidades: localidades,
    };

    crearEvento(data);

    clearInputs();
    window.location.href = "/misEventos";
  };

  const clearInputs = () => {
    setNombreEvent("");
    setFecha("");
    setInicio("");
    setFin("");
    setLugar("");
    setDescripcion("");
    setCategoria("0");
    setTipoEvento("");
    setLocalidades([]);
    setImagen(null);
    setPreview("");
  };

  return (
    <>
      <div id="TarjetaCrearEvento" className="modal">
        <div
          className="modal-content"
          style={{ padding: "0px", margin: "0px" }}
        >
          <div
            className="card horizontal transparent"
            style={{ padding: "0px", margin: "0px", border: "0px" }}
          >
            <div className="card-image" style={{ paddingTop: "15%" }}>
              <div className="row">
                <img
                  src={preview}
                  height={300}
                  width={225}
                  className="materialboxed"
                />
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
                  <h4 className="white-text center-align">Crear Evento</h4>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <AiFillCalendar className="prefix" color="white" />
                    <input
                      id="nameEvent"
                      type="text"
                      className="validate white-text"
                      onChange={(e) => setNombreEvent(e.target.value)}
                      value={nombreEvent}
                    />
                    <label htmlFor="nameEvent">Nombre Del Evento</label>
                  </div>
                  <div className="input-field col s6">
                    <BiSolidCategoryAlt className="prefix" color="white" />
                    <select
                      defaultValue={"0"}
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
                      id="dateEventCrearEvento"
                      type="text"
                      className="datepicker validate white-text"
                      value={fecha}
                    />
                    <label htmlFor="dateEventCrearEvento">
                      Fecha Del Evento
                    </label>
                  </div>
                  <div className="input-field col s6">
                    <AiFillGolden className="prefix" color="white" />
                    <input
                      id="typeEvent"
                      type="text"
                      className="validate white-text"
                      onChange={(e) => setTipoEvento(e.target.value)}
                      value={tipoEvento}
                    />
                    <label htmlFor="typeEvent">Tipo De Evento</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <BiTimeFive className="prefix" color="white" size={27} />
                    <input
                      id="timeInitEvent"
                      type="text"
                      className="timepicker white-text"
                      value={inicio}
                    />
                    <label htmlFor="timeInitEvent">
                      Hora De Inicio Del Evento
                    </label>
                  </div>
                  <div className="input-field col s6">
                    <BiTimeFive className="prefix" color="white" />
                    <input
                      id="timeEndEvent"
                      type="text"
                      className="timepicker white-text"
                      value={fin}
                    />
                    <label htmlFor="timeEndEvent">Hora De Fin Del Evento</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <MdOutlinePlace className="prefix" color="white" />
                    <input
                      id="placeEvent"
                      type="text"
                      className="validate white-text"
                      onChange={(e) => setLugar(e.target.value)}
                      value={lugar}
                    />
                    <label htmlFor="placeEvent">Lugar Del Evento</label>
                  </div>
                  <div className="input-field col s6">
                    <MdOutlineDescription className="prefix" color="white" />
                    <input
                      id="descriptionEvent"
                      type="text"
                      className="validate white-text"
                      onChange={(e) => setDescripcion(e.target.value)}
                      value={descripcion}
                    />
                    <label htmlFor="descriptionEvent">
                      Descripcion Del Evento
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col s6">
                    <div className="row">
                      <div className="input-field col s12">
                        <BiLocationPlus
                          className={
                            "prefix " +
                            (isAnimation && localidad === ""
                              ? "shake-vertical"
                              : "")
                          }
                          color="white"
                        />
                        <input
                          id="localidadEvent"
                          type="text"
                          className={
                            "validate white-text " +
                            (isAnimation && localidad === ""
                              ? "shake-left-right"
                              : "")
                          }
                          onChange={(e) => setLocalidad(e.target.value)}
                          value={localidad}
                        />
                        <label htmlFor="localidadEvent">Localidad</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <BiSolidBadgeDollar
                          className={
                            "prefix " +
                            (isAnimation && precio === ""
                              ? "shake-vertical"
                              : "")
                          }
                          color="white"
                        />
                        <input
                          id="priceLocalidad"
                          type="text"
                          className={
                            "validate white-text " +
                            (isAnimation && precio === ""
                              ? "shake-left-right"
                              : "")
                          }
                          onChange={(e) => setPrecio(e.target.value)}
                          value={precio}
                        />
                        <label htmlFor="priceLocalidad">
                          Precio Del Asiento
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <MdTableRows
                          className={
                            "prefix " +
                            (isAnimation && filas === ""
                              ? "shake-vertical"
                              : "")
                          }
                          color="white"
                        />
                        <input
                          id="rowsLocalidad"
                          type="text"
                          className={
                            "validate white-text " +
                            (isAnimation && filas === ""
                              ? "shake-left-right"
                              : "")
                          }
                          onChange={(e) => setFilas(e.target.value)}
                          value={filas}
                        />
                        <label htmlFor="rowsLocalidad">Filas Localidad</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <MdViewColumn
                          className={
                            "prefix " +
                            (isAnimation && col === "" ? "shake-vertical" : "")
                          }
                          color="white"
                        />
                        <input
                          id="columnsLocalidad"
                          type="text"
                          className={
                            "validate white-text " +
                            (isAnimation && col === ""
                              ? "shake-left-right"
                              : "")
                          }
                          onChange={(e) => setCol(e.target.value)}
                          value={col}
                        />
                        <label htmlFor="columnsLocalidad">
                          Columnas Localidad
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col s8 offset-s4">
                        <a
                          href="#!"
                          className="waves-effect waves-light btn green white-text"
                          onClick={() => addLocality()}
                        >
                          <AiOutlineAppstoreAdd
                            className="material-icons left"
                            color="white"
                            size={30}
                            style={{ paddingTop: "7px" }}
                          />
                          AGREGAR
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col s6">
                    <table className="highlight white-text centered">
                      <thead>
                        <tr>
                          <th>NOMBRE</th>
                          <th>PRECIO</th>
                          <th>FILAS</th>
                          <th>COLUMNAS</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {localidades.map((localidad, index) => {
                          return (
                            <tr>
                              <td>{localidad.nombre}</td>
                              <td>{localidad.precio}</td>
                              <td>{localidad.no_filas}</td>
                              <td>{localidad.no_col}</td>
                              <td>
                                <a
                                  className="btn-floating btn-small waves-effect waves-light red"
                                  onClick={() => removeLocality(index)}
                                >
                                  <MdDelete
                                    color="white"
                                    className="material-icons"
                                    style={{ paddingTop: "5px" }}
                                    size={27}
                                  />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col s4 offset-s2">
                    <a
                      href="#!"
                      className="modal-close waves-effect waves-light btn green white-text"
                      onClick={() => handleCrearEvento()}
                    >
                      <i className="material-icons left white-text">verified</i>
                      CREAR EVENTO
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
