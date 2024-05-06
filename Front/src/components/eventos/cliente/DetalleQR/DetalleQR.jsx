import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
export default function DetalleQR() {
  const { id } = useParams();
  const [evento, setEvento] = useState({});
  const [compra, setCompra] = useState({});
  const [detalle, setDetalle] = useState([]);

  useEffect(() => {
    M.AutoInit();
    getData();
  }, []);
  const url = `${import.meta.env.VITE_REACT_APP_API_URL}api=compra&id=`;
  // const url = 'http://localhost:3003/get-compra/'
  const getData = async () => {
    try {
      const result = (await axios.get(url + "get-compra&id_compra=" + id)).data;
      console.log(result);

      if (result) {
        setEvento(result.Evento);
        setCompra(result.Compra);
        setDetalle(result.Detalle);
      } else {
        M.toast({
          html: result,
          classes: "white-text rounded red darken-4",
        });
        console.log("error");
      }
    } catch (error) {
      M.toast({
        html: error.message,
        classes: "white-text rounded red darken-4",
      });
      console.log("erprrsd".error);
    }
  };
  return (
    <>
      <div
        className="container center"
        style={{ opacity: "100%", color: "white" }}
      >
        <h1 className="text-white">Evento information</h1>
        <img src={evento.imagen_promo} width="25%" />
        <h6>Nombre: {compra.usuario}</h6>
        <h6>Monto: {compra.total}</h6>
        <h6>Nombre del evento: {evento.nombre}</h6>
        <h6>Direccion evento {evento.lugar}</h6>
        <h6>Hora inicio: {evento.hora_inicio}</h6>
        <h6>Hora fin: {evento.hora_fin}</h6>
        <h6>Descripcion: {evento.descripcion}</h6>
        <h4>Detalles asientos</h4>
        <table>
          <thead className="blue darken-1">
            <tr>
              <th>#</th>
              <th>Fila</th>
              <th>Columna</th>
              <th>Localidad</th>
            </tr>
          </thead>

          <tbody>
            {detalle.map((detail, index) => {
              return (
                <tr key={index}>
                  <td>{detail.idDetalle}</td>
                  <td>{detail.fila}</td>
                  <td>{detail.columna}</td>
                  <td>{detail.localidad}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
