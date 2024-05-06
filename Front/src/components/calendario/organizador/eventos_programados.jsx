import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../../styles/eventos_comprados.css";
import CalendarComponent from "../calendario";
import M from "materialize-css";
import jwt_decode from "jwt-decode";

export default function Eventos_programados() {
  const [ev, initEventos] = useState([]);

  const URL = `${import.meta.env.VITE_REACT_APP_API_URL}api=evento&id=`;

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

  const fetchData = async () => {
    const zelda = `${URL}get-eventos-org-calendar&id_org=${await verificarRol()}`;
    const response = await axios.get(zelda);
    console.log(response.data);
    response.data.forEach((element) => {
      const originalDate = new Date(element.fecha);
      element.fecha = originalDate.toISOString().split("T")[0];
    });
    return response.data;
  };

  useEffect(() => {
    fetchData()
      .then((response) => {
        initEventos(response);
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
            Eventos Programados
          </h2>
          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CalendarComponent ev={ev}></CalendarComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
