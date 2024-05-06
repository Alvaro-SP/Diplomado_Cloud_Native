import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { BsFillCalendarDateFill } from "react-icons/bs";
import "./VerEventoClient.css"; // Asegúrate de tener el archivo CSS correspondiente
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";
import SeatingMatrix from "./SeatingMatrix";
import PdfGenerator from "./PdfGenerator";
import jwt_decode from "jwt-decode";
import {
  getAsientos,
  reservarasientos,
  desapartar10mins,
  apartar10mins,
} from "../../../../api/Api";
const URL3 = `${import.meta.env.VITE_REACT_APP_API_URL}api=compra&id=`;
export default function VerEventoClient({ showModal, setShowModal, evento }) {
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    verificarRol(token);
    M.AutoInit();
  }, []);
  const modalRef = useRef(null);
  const [selectedlocalidadtext, setSelectedLocalidadText] = useState(null);
  const [dataTabla, setDataTabla] = useState([]); // Aquí se guardan los datos de la tabla
  const [statclose, setStatclose] = useState(null);
  const [activeTab, setActiveTab] = useState("test1"); // Por defecto, muestra el tab de "Evento"
  const [showGif, setShowGif] = useState(false);
  const tabsRef = useRef(null);
  const [numRows, setNumRows] = useState(0);
  const [numColumns, setNumColumns] = useState(0);
  const [seatOcupados, setSeatOcupados] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [idLocalidadactual, setIdLocalidadactual] = useState(null);
  const [totaldetotales, setTotaldetotales] = useState(0);
  const [idCurrentUser, setIdCurrentUser] = useState(null);
  const [localidadGLOBAL, setlocalidadGLOBAL] = useState(null);
  const [fechaFormateada, setFechaFormateada] = useState(null);
  const [localidades, setLocalidades] = useState([
    "Zona 0",
    "Zona 1",
    "Zona 4",
  ]);
  let random = Math.floor(Math.random() * 2 + 1);
  let random2 = Math.floor(Math.random() * 5) + 1;

  const purchaseInfo = {
    selectedSeats: ["A1", "A2", "B3"],
    customerName: "John Doe",
    eventInfo: "Concierto de Rock",
    ticketPrice: 50,
    cardInfo: "**** **** **** 1234",
    totalAmount: 150,
  };
  // hacer una peticion con axios get
  useEffect(() => {
    M.AutoInit();
    if (evento) {
      const fechaPartes = evento.fecha.split("T")[0].split("-");
      setFechaFormateada(
        `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`
      );
      axios
        .get(URL3 + "get-localidad&evt=" + evento.idEvento)
        .then((response) => {
          setLocalidades(response.data);
          console.log(response.data);
        });
    }

    // const token = sessionStorage.getItem("token");
    // if (token !== null) {
    //   verificarRol(token);
    // }
  }, [evento]);

  const verificarRol = async (token) => {
    const Tipo = jwt_decode(token);
    const expiracion = Tipo.exp;
    if (expiracion < Date.now() / 1000) {
      sessionStorage.clear();
      M.toast({ html: "Su sesión ha expirado", classes: "rounded red" });
      await sleep(3000);
      window.location.href = "/";
    }
    setIdCurrentUser(Tipo.usuario);
  };
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };
  useEffect(() => {
    M.AutoInit();

    if (showModal) {
      // Inicializa los componentes de pestañas aquí
      const tabElems = document.querySelectorAll(".tabs");
      M.Tabs.init(tabElems);
      var elems4 = document.querySelectorAll(".datepicker");
      const instance = M.Tabs.getInstance(tabsRef.current);
      instance.select("test1");
      M.Datepicker.init(elems4, {
        showDaysInNextAndPreviousMonths: true,
        showClearBtn: true,
        format: "yyyy-mm-dd",
      });
    }
  }, [showModal]);
  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        console.log("I pressed");
      }
    },
    [setShowModal, showModal]
  );
  const nextTab = (tabname) => {
    random = Math.floor(Math.random() * 2 + 1);
    random2 = Math.floor(Math.random() * 5) + 1;

    const instance = M.Tabs.getInstance(tabsRef.current);
    instance.select(tabname);
    if (tabname === "test3") {
      setShowGif(true);
      //  agregar un timer de 15 segundos
      setTimeout(() => {
        setShowGif(false);
      }, 10000);
    }
  };
  useEffect(() => {
    () => {
      document.addEventListener("keydown", keyPress);
      return () => document.removeEventListener("keydown", keyPress);
    },
      [keyPress];
  }, []);

  const showtoast = (message) => {
    const toastHTML = `<span>${message}</span><button class="btn-flat toast-action">Undo</button>`;
    M.toast({ html: toastHTML }); // Muestra el toast
  };

  const updateModal = () => {
    if (showModal) {
      // Initialize dropdown
      const options = {
        alignment: "right", // Set the alignment
      };
      M.Tabs.init(document.querySelectorAll(".tabs"));
      const dropdown = document.querySelectorAll(".dropdown-trigger");
      M.Dropdown.init(dropdown, options);
    }
  };
  const setDataTable = (newSeat) => {
    setTotaldetotales(totaldetotales + localidadGLOBAL.precio);
    let newtempseat = {
      row: newSeat.split("-")[0],
      seat: newSeat.split("-")[1],
    };
    setDataTabla([...dataTabla, newtempseat]);
  };
  const quitDataTable = (row, seat) => {
    setTotaldetotales(totaldetotales - localidadGLOBAL.precio);
    let seatId = row + "-" + seat;
    setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));

    const updatedData = dataTabla.filter(
      (seatData) => seatData.row !== row || seatData.seat !== seat
    );
    setStatclose(row + "-" + seat);
    setDataTabla(updatedData);
  };
  const pasarvalidacionTab = () => {
    // saber si un input esta vacio
    // si esta vacio no pasa a la siguiente tab
    // si no esta vacio pasa a la siguiente tab
    let isvacio = document.getElementById("nombreinput").value;
    if (
      document.getElementById("nombreinput").value == "" ||
      document.getElementById("cardinput").value == "" ||
      document.getElementById("fechainput").value == "" ||
      document.getElementById("cvvinput").value == ""
    ) {
      showtoast("Por favor llene todos los campos");
    } else if (document.getElementById("cardinput").value.length != 16) {
      showtoast("El número de tarjeta debe tener 16 dígitos");
    } else {
      nextTab("test3");
    }
  };
  const actualizarLocalidad = (localidad) => {
    setlocalidadGLOBAL(localidad);
    setIdLocalidadactual(localidad.idLocalidad);
    axios
      .get(
        URL3 +
          "get-asientos&evt=" +
          evento.idEvento +
          "&loc=" +
          localidad.idLocalidad
      )
      .then((response) => {
        console.log(response);
        setNumRows(response.data[0].resultado.filas);
        setNumColumns(response.data[0].resultado.columnas);
        setSeatOcupados(response.data[0].resultado.ocupados);
      });
    getgetAsientos(evento.idEvento, localidad.idLocalidad);
    setSelectedLocalidadText(localidad.nombre);
  };
  const desreservartemporal = () => {
    const idLocalidad = idLocalidadactual;
    const seatOccupiedJSON = selectedSeats.map((seatString) => {
      const [fila, columna] = seatString.split("-").map(Number);
      return {
        fila,
        columna,
        idLocalidad,
      };
    });
    showtoast("Se han liberado los asientos");
    axios
      .post(URL3 + "desapartar10mins", {
        asientos: seatOccupiedJSON,
      })
      .then((response) => {
        console.log(response);
        actualizarLocalidad(localidadGLOBAL);
      });
  };
  const reservartemporal = () => {
    const idLocalidad = idLocalidadactual;
    setTimeout(() => {
      showtoast("Se han liberado los asientos");
      axios
        .post(URL3 + "desapartar10mins", {
          asientos: seatOccupiedJSON,
        })
        .then((response) => {
          actualizarLocalidad(localidadGLOBAL);
          console.log(response);
        });
    }, 600000); //corresponde a 10 minutos como se solicita
    const seatOccupiedJSON = selectedSeats.map((seatString) => {
      const [fila, columna] = seatString.split("-").map(Number);
      return {
        fila,
        columna,
        idLocalidad,
      };
    });
    axios
      .post(URL3 + "apartar10mins", {
        asientos: seatOccupiedJSON,
      })
      .then((response) => {
        actualizarLocalidad(localidadGLOBAL);
        console.log(response);
      });
  };
  const FinalizarCompra = () => {
    // Procesar la lista de asientos
    const asientosConvertidos = selectedSeats.map((asiento) => {
      const [fila, columna] = asiento.split("-");
      return {
        fila: parseInt(fila),
        columna: parseInt(columna),
      };
    });
    axios
      .post(URL3 + "reservar-asientos", {
        id_usr: idCurrentUser,
        id_evnt: evento.idEvento,
        asientos: asientosConvertidos,
        num_tarjeta: document.getElementById("cardinput").value,
        exp_tarjeta: document.getElementById("fechainput").value,
        seg_tarjeta: document.getElementById("cvvinput").value,
        total: totaldetotales,
        id_loc: idLocalidadactual,
      })
      .then((response) => {
        console.log(response);
      });

    showtoast("COMPRA FINALIZADA!");
    Window.location.href = "/misEventos";
  };
  //! GETS POSTS DE Api

  const getreservarasientos = async (asientos) => {
    const response = await reservarasientos(asientos);
    console.log(response);
  };
  const getapartar10mins = async (asientos) => {
    const response = await apartar10mins(asientos);
    console.log(response);
  };
  const getdesapartar10minss = async (asientos) => {
    const response = await desapartar10mins(asientos);
    console.log(response);
  };
  const getgetAsientos = async (id_event, idLocalidad) => {
    const response = await getAsientos(id_event, idLocalidad);
    console.log(response);
  };
  return (
    <>
      <div className="event-modalVistaEvento-container">
        {showModal && (
          <div
            id="modalVerEventoClient"
            className="modalVistaEvento"
            onAnimationStart={updateModal}
            showModal={showModal}
            ref={modalRef}
          >
            <div className="modalVistaEvento-blur-background"></div>
            {/* Start modalVistaEvento content */}
            <div className="modalVistaEvento-content">
              <div className="row">
                {/* IMAGEN COVER */}
                <div className="col s6 m3">
                  <div className="event-cover">
                    <img
                      src={evento.imagen_promo}
                      alt="Imagen de Evento"
                      className="responsive-img"
                    />
                  </div>
                  <h5
                    style={{
                      color: "#98D8AA",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Tipo: {evento.tipo}
                  </h5>
                  <h6
                    style={{
                      color: "#F7D060",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {evento.organizador}
                  </h6>
                  <p>{evento.descripcion}</p>
                </div>

                {/* Información del Evento */}
                <div className="col s12 m9">
                  {/* INICIA TABS  */}
                  <div className="row">
                    <div className="col s11">
                      <ul className="tabs light-blue darken-4" ref={tabsRef}>
                        <li className="tab col s3 active">
                          <a href="#test1">Evento</a>
                        </li>
                        <li className="tab col s3">
                          <a href="#test2">Datos Tarjeta</a>
                        </li>
                        <li className="tab col s3">
                          <a href="#test3">Validacion</a>
                        </li>
                        <li className="tab col s3">
                          <a href="#test4">Confirmacion</a>
                        </li>
                      </ul>
                    </div>
                    <div id="test1" className="col s12">
                      <h4 className="tituloverevento">{evento.nombre}</h4>
                      <div className="col s12 m6">
                        <h5 style={{ color: "red", textAlign: "left" }}>
                          {evento.categoria}
                        </h5>
                        <div className="col s5 m5">
                          <h6
                            style={{
                              color: "#F3E99F",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            Hora Inicio:
                          </h6>
                          <h6
                            style={{
                              color: "#F3E99F",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            Hora Fin:
                          </h6>
                        </div>
                        <div className="col s6 m6">
                          <h6> {evento.hora_inicio} </h6>
                          <h6> {evento.hora_fin} </h6>
                        </div>
                      </div>
                      <div className="col s12 m6">
                        <div className="col s5 m5">
                          <h6
                            style={{
                              color: "#F3E99F",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            Fecha:
                          </h6>
                          <h6
                            style={{
                              color: "#F3E99F",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            Lugar:
                          </h6>
                        </div>
                        <div className="col s6 m6">
                          <h6> {fechaFormateada}</h6>
                          <h6> {evento.lugar}</h6>
                        </div>
                        <div className="col s12 m12">
                          {/* Dropdown de  */}
                          <ul id="dropdown2" className="dropdown-content">
                            {localidades.map((localidad, index) => (
                              <li key={index}>
                                <a
                                  onClick={() => actualizarLocalidad(localidad)}
                                >
                                  {localidad.nombre}
                                </a>
                              </li>
                            ))}
                          </ul>
                          <a
                            className="btn dropdown-trigger"
                            href="#!"
                            data-target="dropdown2"
                          >
                            {selectedlocalidadtext === null
                              ? "Localidad"
                              : selectedlocalidadtext}
                            <i className="material-icons right">
                              arrow_drop_down
                            </i>
                          </a>
                        </div>
                        <p>{selectedlocalidadtext} </p>
                      </div>

                      {selectedlocalidadtext ? (
                        <div>
                          <SeatingMatrix
                            setDataTable={setDataTable}
                            quitDataTable={quitDataTable}
                            numRows={numRows}
                            numColumns={numColumns}
                            seatOcupados={seatOcupados}
                            selectedSeats={selectedSeats}
                            setSelectedSeats={setSelectedSeats}
                          />
                          <div className="col s6 m6">
                            <button
                              className="btn waves-effect cyan darken-2"
                              onClick={() => {
                                if (selectedSeats.length > 0) {
                                  desreservartemporal();
                                  showtoast(
                                    `Has quitado los siguientes asientos: ${selectedSeats.join(
                                      ", "
                                    )}`
                                  );
                                  // Aquí puedes implementar la lógica de compra o reserva
                                } else {
                                  showtoast(
                                    "No puedes quitar asientas si no los has seleccionado :v"
                                  );
                                }
                              }}
                              style={{
                                color: "black",
                              }}
                            >
                              Desapartar Temporalmente
                            </button>
                          </div>
                          <div className="col s6 m6">
                            <button
                              className="btn waves-effect yellow darken-2"
                              onClick={() => {
                                if (selectedSeats.length > 0) {
                                  reservartemporal();
                                  showtoast(
                                    `Has reservado los siguientes asientos: ${selectedSeats.join(
                                      ", "
                                    )}`
                                  );
                                  // Aquí puedes implementar la lógica de compra o reserva
                                } else {
                                  showtoast(
                                    "Por favor selecciona al menos un asiento."
                                  );
                                }
                              }}
                              style={{
                                color: "black",
                              }}
                            >
                              Apartar Temporalmente
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {/* LA TABLA */}
                      <table className="seating-table">
                        <thead>
                          <tr>
                            <th>Seccion</th>
                            <th>Fila</th>
                            <th>Asiento</th>
                            <th>Opciones</th>
                            <th>Precio por boleto</th>
                            <th>Tarifas de servicios</th>
                            <th>Retirar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataTabla.map((row, index) => (
                            <tr key={index}>
                              <td>Ultra-Premium</td>
                              <td>{row.row}</td>
                              <td>{row.seat}</td>
                              <td></td>
                              <td>{localidadGLOBAL.precio}</td>
                              <td>0</td>
                              <td>
                                <button
                                  className="remove-button"
                                  onClick={() =>
                                    quitDataTable(row.row, row.seat)
                                  }
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="5">Total</td>
                            <td colSpan="2">${totaldetotales}</td>
                          </tr>
                        </tfoot>
                      </table>
                      <button
                        className="btn waves-effect waves-light"
                        type="submit"
                        name="action"
                        onClick={() => nextTab("test2")}
                      >
                        Continuar
                        <i className="material-icons right">send</i>
                      </button>
                    </div>
                    {/********************* DATOS DE LA TARJETA******************** */}
                    <div
                      id="test2"
                      className="col s12"
                      style={{
                        backgroundImage:
                          "url('https://images.ctfassets.net/fzn2n1nzq965/6LzQLvO5KdLfCTp9VzlRR8/19751220f644dfa4f8cc05e5d6d2df8e/Issuing_Credit_Cards.png?q=80&w=1960')",
                        backgroundSize: "30%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top right",
                      }}
                    >
                      <h4 className="tituloverevento">
                        Ingresa los datos de tu tarjeta
                      </h4>
                      <div className="col s12 m12">
                        <div className="col s3 m3">
                          <h5>Nombre: </h5>
                        </div>

                        <div className="col s7 m7">
                          <div className="input-field col s12">
                            <i className="material-icons prefix">
                              account_circle
                            </i>
                            <input
                              id="nombreinput"
                              type="text"
                              className="validate"
                              style={{ color: "white" }}
                            />
                            <label for="nombreinput">Nombre Propietario</label>
                          </div>
                        </div>
                      </div>
                      <div className="col s12 m12">
                        <div className="col s3 m3">
                          <h5>Numero: </h5>
                        </div>

                        <div className="col s7 m7">
                          <div className="input-field col s12">
                            <i className="material-icons prefix">credit_card</i>
                            <input
                              id="cardinput"
                              type="number"
                              className="validate"
                              style={{ color: "white" }}
                            />
                            <label for="cardinput">XXXX XXXX XXXX</label>
                          </div>
                        </div>
                      </div>

                      <div className="col s12 m12">
                        <div className="col s3 m3">
                          <h5>Vencimiento: </h5>
                        </div>

                        <div className="col s7 m7">
                          <div
                            className="input-field col s6"
                            style={{ color: "black" }}
                          >
                            <BsFillCalendarDateFill
                              className="prefix"
                              color="white"
                              size={27}
                            />
                            <input
                              id="fechainput"
                              type="text"
                              className="datepicker white-text"
                              style={{ color: "white" }}
                            />
                            <label htmlFor="fechainput">Fecha Del Evento</label>
                                      
                          </div>
                        </div>
                      </div>

                      <div className="col s12 m12">
                        <div className="col s3 m3">
                          <h5>CVV: </h5>
                        </div>

                        <div className="col s7 m7">
                          <div className="input-field col s12">
                            <i className="material-icons prefix">credit_card</i>
                            <input
                              id="cvvinput"
                              type="number"
                              className="validate"
                              style={{ color: "white" }}
                            />
                            <label for="cvvinput">XXXX XXXX XXXX</label>
                          </div>
                        </div>
                      </div>
                      <div className="col s12 m12">
                        <div className="col s7 m7">
                          <img
                            src="https://img.freepik.com/iconos-gratis/tarjeta-credito_318-580823.jpg?w=2000"
                            alt="Imagen de Evento"
                            className="responsive-img"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div className="col s7 m4">
                          <button
                            className="btn waves-effect waves-light"
                            type="submit"
                            name="action"
                            onClick={() => pasarvalidacionTab()}
                          >
                            Continuar
                            <i className="material-icons right">send</i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div id="test3" className="col s12">
                      {showGif ? (
                        <div>
                          <img
                            src="https://thumbs.gfycat.com/NarrowWhimsicalCoral-max-1mb.gif"
                            alt="Imagen de Evento"
                            className="responsive-img"
                            style={{ width: "50%", height: "50%" }}
                          />
                          <br />
                          <img
                            src="https://media0.giphy.com/media/ftdF2GXeMJIgwYDqaF/giphy.gif?cid=6c09b9522vxy3wda02tsi1vbmsv9jb4sydvbtiyso7a7gybl&ep=v1_stickers_related&rid=giphy.gif&ct=s"
                            alt="Imagen de Evento"
                            className="responsive-img"
                            style={{ width: "50%", height: "50%" }}
                          />
                          <br />
                          {/* <img
                            src="https://www.klippa.com/wp-content/uploads/2021/06/3-age-check-v2-s.gif"
                            alt="Imagen de Evento"
                            className="responsive-img"
                            style={{ width: "50%", height: "50%" }}
                          /> */}
                        </div>
                      ) : random == 2 ? (
                        <div>
                          {/* TARJETA RECHAZADA */}
                          <h3 style={{ color: "red", textAlign: "center" }}>
                            TARJETA RECHAZADA
                          </h3>
                          <br />
                          <div className="col s12">
                            <div className="col s4 red">
                              <p>
                                <label style={{ color: "white" }}>
                                  <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked="checked"
                                  />
                                  <span>Nombre INCORRECTO</span>
                                </label>
                              </p>
                            </div>
                            <div className="col s4 red">
                              <p>
                                <label style={{ color: "white" }}>
                                  <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked="checked"
                                  />
                                  <span>Numero INCORRECTO</span>
                                </label>
                              </p>
                            </div>
                            <div className="col s4">
                              <p>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked="checked"
                                  />
                                  <span>CCV correcto</span>
                                </label>
                              </p>
                            </div>
                          </div>
                          <img
                            src="https://media.giphy.com/media/EopV0wKH3USE9F7fhe/giphy.gif"
                            style={{ width: "35%", height: "35%" }}
                          />
                          <button
                            className="btn waves-effect waves-light"
                            type="submit"
                            name="action"
                            onClick={() => nextTab("test2")}
                          >
                            Continuar
                            <i className="material-icons right">send</i>
                          </button>
                        </div>
                      ) : (
                        <div>
                          {/* TARJETA ACEPTADA */}
                          <h3
                            style={{
                              color: "lightgreen",
                              textAlign: "center",
                            }}
                          >
                            TARJETA ACEPTADA
                          </h3>
                          <div className="col s12">
                            <div className="col s4">
                              <p>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked="checked"
                                  />
                                  <span>Nombre Correcto</span>
                                </label>
                              </p>
                            </div>
                            <div className="col s4">
                              <p>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked="checked"
                                  />
                                  <span>Numero Correcto</span>
                                </label>
                              </p>
                            </div>
                            <div className="col s4">
                              <p>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="filled-in"
                                    checked="checked"
                                  />
                                  <span>CCV correcto</span>
                                </label>
                              </p>
                            </div>
                          </div>
                          <img
                            src="https://media.giphy.com/media/EopV0wKH3USE9F7fhe/giphy.gif"
                            style={{ width: "35%", height: "35%" }}
                          />
                          <br />
                          <button
                            className="btn waves-effect waves-light"
                            type="submit"
                            name="action"
                            onClick={() => nextTab("test4")}
                          >
                            Continuar
                            <i className="material-icons right">send</i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div id="test4" className="col s12">
                      <h4 className="tituloverevento">
                        Confirmacion Y Finalizacion
                      </h4>
                      <table className="seating-table">
                        <thead>
                          <tr>
                            <th>Seccion</th>
                            <th>Fila</th>
                            <th>Asiento</th>
                            <th>Opciones</th>
                            <th>Precio por boleto</th>
                            <th>Tarifas de servicios</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataTabla.map((row, index) => (
                            <tr key={index}>
                              <td>Ultra-Premium</td>
                              <td>{row.row}</td>
                              <td>{row.seat}</td>
                              <td></td>
                              <td>{localidadGLOBAL.precio}</td>
                              <td>0</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="5">Total</td>
                            <td colSpan="2">${totaldetotales}</td>
                          </tr>
                        </tfoot>
                      </table>
                      <table className="purchase-summary-table highlight responsive-table">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>Detalle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Listado de Asientos Seleccionados</td>
                            <td>{purchaseInfo.selectedSeats.join(", ")}</td>
                          </tr>
                          <tr>
                            <td>Nombre del Cliente</td>
                            <td>{purchaseInfo.customerName}</td>
                          </tr>
                          <tr>
                            <td>Información del Evento</td>
                            <td>{purchaseInfo.eventInfo}</td>
                          </tr>
                          <tr>
                            <td>Precio de la Localidad</td>
                            <td>${purchaseInfo.ticketPrice}</td>
                          </tr>
                          <tr>
                            <td>Datos de la Tarjeta</td>
                            <td>{purchaseInfo.cardInfo}</td>
                          </tr>
                          <tr>
                            <td>Total a Pagar</td>
                            <td>${purchaseInfo.totalAmount}</td>
                          </tr>
                        </tbody>
                      </table>
                      <button
                        className="btn waves-effect waves-light"
                        type="submit"
                        name="action"
                        onClick={() => FinalizarCompra()}
                      >
                        Finalizar Compra
                        <i className="material-icons right">send</i>
                      </button>
                    </div>
                  </div>
                  {/* FIN TABS  */}
                </div>
              </div>

              {/* BOTON CERRAR */}
              <button
                className="close-modalVistaEvento-button"
                onClick={() => setShowModal((prev) => !prev)}
                ref={modalRef}
              >
                X
              </button>
            </div>

            {/* End modalVistaEvento content */}
          </div>
        )}
      </div>
    </>
  );
}
