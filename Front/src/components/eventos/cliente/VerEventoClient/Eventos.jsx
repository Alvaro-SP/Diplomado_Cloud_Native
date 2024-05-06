import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./VerEventoClient.css"; // Asegúrate de tener el archivo CSS correspondiente
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";
//import { VerEventoClient } from "./VerEventoClient";

export default function EventosView() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal((prev) => !prev);
  };
  useEffect(() => {
    M.AutoInit(); // Initialize Materialize components

    // Initialize dropdown
    const options = {
      alignment: "right", // Set the alignment
    };
    M.Tabs.init(document.querySelectorAll(".tabs"), {});
    const dropdown = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(dropdown, options);
  }, []);

  return (
    <>
      <div className="event-modalVistaEvento-container">
        <button className="open-modalVistaEvento-button" onClick={openModal}>
          Ver Evento
        </button>

        {/* <VerEventoClient showModal={showModal} setShowModal={setShowModal} /> */}
      </div>
    </>
  );
}
