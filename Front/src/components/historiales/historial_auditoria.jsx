import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
//import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const MySwal = withReactContent(Swal);
const url = `${
  import.meta.env.VITE_REACT_APP_API_URL
}api=historial&id=historial-admin`;
function HistorialAuditoria() {
  const [datos, setDatos] = useState([]);

  const mostrarQR = async (evento, imagen) => {
    await MySwal.fire({
      title: evento,
      imageUrl: imagen,
      imageHeight: 300,
      width: 800,
    });
  };

  const fetchData = async () => {
    const response = await axios.get(url);
    return response.data;
  };

  const formatearfechaData = (fecha) => {
    const horaPartes = fecha.split("T")[1].split(":");
    const fechaPartes = fecha.split("T")[0].split("-");
    console.log(horaPartes);
    return (
      `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}` +
      " a las " +
      `${horaPartes[0]}:${horaPartes[1]}`
    );
  };
  useEffect(() => {
    fetchData()
      .then((response) => {
        console.log(response);
        setDatos(response.history);
      })
      .catch((error) => {
        toast.error("Ocurrio un error!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        console.log(error);
      });
  }, []);

  return (
    <div className="compg">
      <div className="component">
        <div className="cont-components">
          <h2 className="tit" style={{ textAlign: "left", fontWeight: "bold" }}>
            Historial de Auditoria (Administrador)
          </h2>
          <hr />

          <div>
            <table className="striped dark-table">
              <thead>
                <tr
                  style={{
                    color: "#98D846",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  <th scope="col">Usuario</th>
                  <th scope="col">Tipo de Usuario</th>
                  <th scope="col">Fecha y Hora</th>
                  <th scope="col">Accion Realizada</th>
                </tr>
              </thead>
              <tbody
                style={{
                  color: "#ffff",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {datos.map((item) => (
                  <tr key={item.id_event}>
                    <td>{item.usuario}</td>
                    <td>
                      {item.tipoUsuario == 0
                        ? "Usuario Cliente"
                        : "Usuario Organizador"}
                    </td>
                    <td>{formatearfechaData(item.fechaHora)}</td>
                    <td>{item.accion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistorialAuditoria;
