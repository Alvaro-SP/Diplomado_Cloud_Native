import {
  PiArrowBendDoubleUpLeftDuotone,
  PiArrowBendDoubleUpRightLight,
} from "react-icons/pi";
import { BiSolidEditAlt, BiSolidFilterAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { EditarEvento } from "./EditarEvento";
import "./VistaEventosStyle.css";
import { useEffect, useRef, useState } from "react";
import { getEventosOrganizador } from "../../../api/Api";
import { CancelarEvento } from "./CancelarEvento";

export default function VistaEventosView() {
  const [listaPrincipal, setListaPrincipal] = useState([])
  const [eventos, setEventos] = useState([]);
  const [evento, setEvento] = useState(null);
  const [pageShow, setPagesShow] = useState([]);
  const [pages, setPages] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("0");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    var elems = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(elems, {
      transitionMovement: 10,
    });

    var elems2 = document.querySelectorAll("select");
    M.FormSelect.init(elems2, {
      classes: "selectPersonalizado",
    });

    getDataEventos();
  }, []);

  const getDataEventos = async () => {
    let eventosGeneral = await getEventosOrganizador();

    setEventos(eventosGeneral);
    setListaPrincipal(eventosGeneral);

    let cards = document.querySelectorAll(".card-reveal");
    for (const card of cards) {
      card.style.transform = "translateY(0px)";
    }
  };

  const metodoPaginacion = async () => {
    let eventosGeneral = eventos;

    let NumPages = [];
    for (let i = 1; i <= eventosGeneral.length / 4; i++) {
      NumPages.push({ id: i, isActive: false });
    }

    if (NumPages.length > 0) {
      NumPages[0].isActive = true;
    }

    if (eventosGeneral.length % 4 !== 0) {
      NumPages.push({ id: NumPages.length + 1, isActive: false });
    }

    setPages(NumPages);
  }

  const paginarTarjetas = (index) => {
    let seccionEvento = [];
    for (let i = (index - 1) * 4; i < index * 4; i++) {
      if (i < eventos.length) {
        seccionEvento.push(eventos[i]);
      }
    }
    setPagesShow(seccionEvento);
  };

  useEffect(() => {
    metodoPaginacion();
  }, [eventos]);

  useEffect(() => {
    paginarTarjetas(1);
  }, [eventos]);

  useEffect(() => {
    if (tipoFiltro === "0" || filtro == "") {
      setEventos(listaPrincipal.filter((evento) => {
        return evento.nombre.toLowerCase().includes(filtro.toLowerCase())
      }));
    } else if (tipoFiltro === "1") {
      // ? Fecha
      if (filtro !== "") {
        setEventos(
          listaPrincipal.filter((evento) => {
            return evento.fecha.includes(filtro);
          })
        );
      }
    } else if (tipoFiltro === "2") {
      // ? categoria
      if (filtro !== "") {
        setEventos(
          listaPrincipal.filter((evento) => {
            return evento.categoria
              .toLowerCase()
              .includes(filtro.toLowerCase());
          })
        );
      }
    } else if (tipoFiltro === "3") {
      // ? precio
      if (filtro !== "") {
        setEventos(
          listaPrincipal.filter((evento) => {
            return evento.precios.includes(parseInt(filtro.toLowerCase()));
          })
        );
      }
    } else if (tipoFiltro === "4") {
      // ? disponibilidad
      if (filtro !== "") {
        setEventos(
          listaPrincipal.filter((evento) => {
            return (
              evento.nombre.toLowerCase().includes(filtro.toLowerCase()) &&
              evento.disponible
            );
          })
        );
      }
    }
  }, [filtro]);

  const handleChange = (id) => {
    setPages(
      pages.map((page) => {
        return page.id === id
          ? { id: page.id, isActive: true }
          : page.isActive
          ? { id: page.id, isActive: false }
          : page;
      })
    );

    paginarTarjetas(id);
  };

  return (
    <main>
      <div className="row">
        <h2 className=" center-align white-text fontPersonalizada">
          Proximos Eventos
        </h2>
      </div>
      <div className="container">
        <div className="row">
          <div className="input-field col s2 offset-s2">
            <BiSolidFilterAlt className="prefix" color="white" />
            <select
              defaultValue={"0"}
              onChange={(e) => setTipoFiltro(e.target.value)}
            >
              <option value="0">Filtro</option>
              <option value="1">{"Fecha"}</option>
              <option value="2">{"Categoria"}</option>
              <option value="3">{"Precio"}</option>
              <option value="4">{"Disponible"}</option>
            </select>
          </div>
          <div className="input-field col s5">
            <i className="material-icons prefix white-text">search</i>
            <input
              id="icon_prefix"
              type="text"
              className="validate white-text"
              onChange={(e) => setFiltro(e.target.value)}
            />
            <label htmlFor="icon_prefix">Buscar</label>
          </div>
        </div>
        <div className="row">
          {pageShow.map((evento, index) => {
            return (
              <div className="col s6" key={index}>
                <div className="card horizontal tarjetaMostrarEvento hoverable">
                  <div className="card-image" style={{ width: "175px" }}>
                    <img
                      src={evento.imagen_promo}
                      height={275}
                      style={{ width: "100%" }}
                      className="activator"
                    />
                  </div>
                  <div className="card-stacked">
                    <div className="card-content activator">
                      <div className="container activator">
                        <div className="row center-align">
                          <h5 className="fontPersonalizada activator">
                            {evento.nombre}
                          </h5>
                        </div>
                        <div className="row center-align">
                          <h6 className="fontPersonalizada activator">
                            Fecha:{" "}
                            {evento.fecha !== null
                              ? evento.fecha.split("T")[0]
                              : ""}
                          </h6>
                        </div>
                        <div className="row center-align">
                          <h6 className="fontPersonalizada activator">
                            Hora: {evento.hora_inicio}
                          </h6>
                        </div>
                        <div className="row center-align">
                          <h6 className="fontPersonalizada activator">
                            Lugar: {evento.lugar}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card-reveal tarjetaDesplegable"
                    style={{ overflow: "hidden" }}
                  >
                    <div className="row left-align">
                      <span className="card-title grey-text text-darken-4">
                        <span className="fontPersonalizada">
                          {evento.nombre}
                        </span>
                        <i className="material-icons right">close</i>
                      </span>
                    </div>
                    <div className="row left-align">
                      <div className="col s6">
                        <h6 className="fontPersonalizada">
                          Fecha: {evento.fecha.split("T")[0] || true}
                        </h6>
                      </div>
                      <div className="col s6">
                        <h6 className="fontPersonalizada">
                          Lugar: {evento.lugar}
                        </h6>
                      </div>
                    </div>
                    <div className="row left-align">
                      <div className="col s6">
                        <h6 className="fontPersonalizada">
                          Hora: {evento.hora_inicio}
                        </h6>
                      </div>
                      <div className="col s6">
                        <h6 className="fontPersonalizada">
                          Clasificacion: {evento.categoria}
                        </h6>
                      </div>
                    </div>
                    <div className="row left-align">
                      <div className="col s7">
                        <h6 className="fontPersonalizada">
                          Tipo De Evento: {evento.tipo}
                        </h6>
                      </div>
                      <div className="col s1">
                        <a
                          className="btn-floating btn waves-effect waves-light  indigo darken-1 tooltipped modal-trigger"
                          data-position="top"
                          data-tooltip="Editar Evento"
                          href="#TarjetaEditarEvento"
                          style={{ paddingTop: "7px" }}
                          onClick={() => setEvento(evento)}
                        >
                          <BiSolidEditAlt
                            className="material-icons"
                            color="white"
                          />
                        </a>
                      </div>
                      <div className="col s1 offset-s1">
                        <a
                          className="btn-floating btn waves-effect waves-light modal-trigger red darken-1 tooltipped"
                          data-position="top"
                          data-tooltip="Eliminar Evento"
                          style={{ paddingTop: "7px" }}
                          href="#tarjetaCancelarEvento"
                          onClick={() => setEvento(evento)}
                        >
                          <MdDelete className="material-icons" color="white" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="row">
          <div className="col s12 center-align">
            <ul className="pagination">
              <li
                className="waves-effect"
                onClick={() => handleChange(pages[0].id)}
              >
                <a href="#!" style={{ paddingTop: "3px" }}>
                  <PiArrowBendDoubleUpLeftDuotone
                    className="material-icons"
                    color="white"
                  />
                </a>
              </li>

              {pages.map((page, index) => {
                return (
                  <li
                    className={
                      page.isActive ? "waves-effect active" : "waves-effect"
                    }
                    key={index}
                    onClick={() => handleChange(page.id)}
                  >
                    <a href="#!" className="white-text">
                      {page.id}
                    </a>
                  </li>
                );
              })}

              <li
                className="waves-effect"
                onClick={() => handleChange(pages[pages.length - 1].id)}
              >
                <a href="#!" style={{ paddingTop: "3px" }}>
                  <PiArrowBendDoubleUpRightLight
                    className="material-icons"
                    color="white"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <EditarEvento
        evento={evento !== null ? evento : {}}
        getDataEventos={getDataEventos}
      />

      <CancelarEvento
        idEvento={evento !== null ? evento.idEvento : ""}
        nombre={evento !== null ? evento.nombre : ""}
        getDataEventos={getDataEventos}
      />
    </main>
  );
}
