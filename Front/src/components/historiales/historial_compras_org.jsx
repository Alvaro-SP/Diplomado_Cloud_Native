import React, { useState, useEffect } from "react";
import "materialize-css/dist/css/materialize.min.css";
import { toast } from "react-toastify";
import "../../styles/historial_compras.css";
import axios from "axios";
import jwt_decode from "jwt-decode";

function HistorialOrganizador() {
  const [datos, setDatos] = useState([]);

  const URL = `${import.meta.env.VITE_REACT_APP_API_URL}api=evento&id=`;

  const fetchData = async () => {
    const zelda = `${URL}historial-org&id_org=${await verificarRol()}`;
    const response = await axios.get(zelda);
    console.log(response.data);
    return response.data;
  };

  const verificarRol = async () => {
    const token = sessionStorage.getItem("token");
    const Tipo = jwt_decode(token);
    const expiracion = Tipo.exp;
    if (expiracion < Date.now() / 1000) {
      sessionStorage.clear();
      M.toast({ html: "Su sesión ha expirado", classes: "rounded red" });
      await sleep(3000);
      window.location.href = "/";
    }

    console.log(Tipo.usuario);
    return Tipo.usuario;
  };

  useEffect(() => {
    fetchData()
      .then((response) => {
        console.log(response);
        setDatos(response);
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
          <h2 className="tit" style={{ textAlign: "left" }}>
            Historial de compras usuario
          </h2>
          <hr />

          <div style={{ margin: "10px" }}>
            <table className="striped dark-table">
              <thead>
                <tr>
                  <th scope="col">ID Compra</th>
                  <th scope="col">Evento</th>
                  <th scope="col">Localidad</th>
                  <th scope="col">Cantidad de asientos</th>
                  <th scope="col">Fecha de compra</th>
                  <th scope="col">Fecha del evento</th>
                  <th scope="col">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((item) => (
                  <tr key={item.idCompra}>
                    <td>{item.idCompra}</td>
                    <td>{item.event}</td>
                    <td>{item.localidad}</td>
                    <td>{item.cant_asientos}</td>
                    <td>{item.fecha_compra}</td>
                    <td>{item.fecha_event}</td>
                    <td>{item.usuario}</td>
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

export default HistorialOrganizador;
