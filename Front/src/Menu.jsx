import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import M from "materialize-css";
import "./style/MenuStyle.css";
import logo from "./assets/logo.gif";
import Perfil from "./admin/Perfil";
import { FiMenu } from "react-icons/fi";
import VistaEventosView from "./components/eventos/organizador/VistaEventos";
import VistaEventoCliente from "./components/eventos/cliente/VerEventos/VistaEventos";
import CrearEventos from "./components/eventos/organizador/CrearEvento";
import Login from "./components/usuarios/login/Login";
import Eventos from "./components/eventos/cliente/VerEventoClient/Eventos";
import Register from "./components/usuarios/register/Register";
import jwt_decode from "jwt-decode";
import Eventos_programados from "./components/calendario/organizador/eventos_programados";
import Eventos_comprados from "./components/calendario/cliente/eventos_comprados";
import HistorialCliente from "./components/historiales/historial_compras_usr";
import HistorialOrganizador from "./components/historiales/historial_compras_org";
import HistorialAuditoria from "./components/historiales/historial_auditoria";
import DetalleQR from "./components/eventos/cliente/DetalleQR/DetalleQR";
import LockAdmin from "./components/admin/bloqueo";
import CancelarEventoAdmin from "./components/admin/cancelarEventoAdmin"

export default function Menu() {
  const [usuario, setUsuario] = useState("");
  const [islogin, setIslogin] = useState(false);
  const [mostrar, setMostrar] = useState(0);
  // ! ADMINISTRADOR
  const [direcciones, setDirecciones] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const verificar = async () => {
      await verificarRol(token);
      M.AutoInit();
    };
    verificar();
  }, []);

  const verificarRol = async (token) => {
    if (token) {
      setIslogin(true);
    }

    const Tipo = jwt_decode(token);
    const expiracion = Tipo.exp;
    setUsuario(Tipo.usuario);
    console.log(Tipo);
    setMostrar(Tipo.tipo);
    if (expiracion < Date.now() / 1000) {
      sessionStorage.clear();
      M.toast({ html: "Su sesión ha expirado", classes: "rounded red" });
      await sleep(3000);
    }

    if (Tipo.tipo === 0) {
      //!USUARIO NORMAL
      setDirecciones([
        { url: "./perfil", title: "Perfil" },
        { url: "./evento", title: "Mis Eventos" },
        { url: "./calendariousr", title: "Calendario" },
        { url: "./historialCliente", title: "Historial Boletos" },
      ]);
      console.log(direcciones);
      // window.location.href = "/perfil";
      //redireccionar a la pagina de usuario
    } else if (Tipo.tipo === 1) {
      //! ORGANIZADOR
      setDirecciones([
        { url: "./misEventos", title: "Inicio" },
        { url: "./perfil", title: "Perfil" },
        { url: "./calendario", title: "Calendario" },
        { url: "./misEventos", title: "Mis Eventos" },
        { url: "./historialOrganizador", title: "Historial Eventos" },
      ]);
      //redireccionar a la pagina de organizador
    } else if (Tipo.tipo === 2) {
      //!ADMINISTRADOR
      setDirecciones([
        { url: "./perfil", title: "Perfil" },
        { url: "./bloqueos", title: "Bloquear Users" },
        { url: "./cancelarEvent", title: "Cancelar Eventos" },
        { url: "./HistorialAuditoria", title: "Actividad pagina" },
      ]);
      // window.location.href = "/perfil";
    }
  };

  const cerrarSesion = async () => {
    setIslogin(false);
    sessionStorage.clear();
  };

  return (
    <>
      {islogin ? (
        <>
          <Router>
            <nav>
              <div
                className="nav-wrapper "
                style={{ backgroundColor: "#1D5B99" }}
              >
                <Link className="brand-logo" to={direcciones[0].url}>
                  <img style={{ maxHeight: "64px" }} src={logo} alt="Logo" />
                </Link>
                <a
                  href="#"
                  data-target="mobile-demo"
                  className="sidenav-trigger"
                >
                  <FiMenu></FiMenu>
                </a>
                <div style={{ marginLeft: "10%" }}>
                  <Link className="brand-logo" to={direcciones[0].url}>
                    <h5 style={{ maxHeight: "80px", marginLeft: "0%" }}>
                      Bienvenido, {usuario}
                    </h5>
                  </Link>
                </div>

                <ul className="right hide-on-med-and-down">
                  {direcciones.map((di, index) => {
                    return (
                      <li key={index}>
                        <Link to={di.url}>{di.title}</Link>
                      </li>
                    );
                  })}
                  {mostrar === 1 ? (
                    <>
                      <li>
                        <a href="#TarjetaCrearEvento" className="modal-trigger">
                          Crear Evento
                        </a>
                      </li>
                    </>
                  ) : (
                    <></>
                  )}
                  <li>
                    <a href="/" onClick={cerrarSesion}>
                      Cerrar Sesion
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            <ul className="sidenav navTicket" id="mobile-demo">
              {direcciones.map((di, index) => {
                return (
                  <li key={index}>
                    <Link to={di.url}>{di.title}</Link>
                  </li>
                );
              })}
              {}
              <li>
                <a href="/" onClick={cerrarSesion}>
                  Cerrar Sesion
                </a>
              </li>
            </ul>
            <Routes>
              <Route path="/perfil" element={<Perfil user={usuario} />} />
              <Route path="/misEventos" element={<VistaEventosView />} />
              <Route path="/evento" element={<VistaEventoCliente />} />
              <Route path="/verEventoClient" element={<Eventos />} />
              <Route path="/calendario" element={<Eventos_programados />} />
              <Route path="/calendariousr" element={<Eventos_comprados />} />
              <Route path="/historialCliente" element={<HistorialCliente />} />
              <Route path="/bloqueos" element={<LockAdmin />} />
              <Route path="/cancelarEvent" element={<CancelarEventoAdmin />} />
              <Route
                path="/HistorialAuditoria"
                element={<HistorialAuditoria />}
              />
              <Route
                path="/historialOrganizador"
                element={<HistorialOrganizador />}
              />
            </Routes>
          </Router>
          <CrearEventos />
        </>
      ) : (
        <>
          <Router>
            <nav>
              <div
                className="nav-wrapper "
                style={{ backgroundColor: "#1D5B79" }}
              >
                <Link className="brand-logo" to="/">
                  <img style={{ maxHeight: "64px" }} src={logo} alt="Logo" />
                </Link>
                <a
                  href="#"
                  data-target="mobile-demo"
                  className="sidenav-trigger"
                >
                  <FiMenu></FiMenu>
                </a>

                <ul className="right hide-on-med-and-down">
                  <li>
                    <Link to="/">Iniciar Sesion</Link>
                  </li>
                  <li>
                    <Link to="/register">Registrarse</Link>
                  </li>
                </ul>
              </div>
            </nav>

            <ul className="sidenav navTicket" id="mobile-demo">
              <li>
                <Link to="/">Iniciar Sesion</Link>
              </li>
              <li>
                <Link to="/register">Registrarse</Link>
              </li>
            </ul>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/detalleqr/:id" element={<DetalleQR/>} />
            </Routes>
          </Router>
        </>
      )}
    </>
  );
}
