import React, { useState, useEffect } from 'react';
import M from "materialize-css";
import { getEventosClient } from "../../api/Api";
import jwt_decode from "jwt-decode";
import { MdDelete } from "react-icons/md";
import { CancelarEvento } from '../eventos/organizador/CancelarEvento';
export default function CancelarEventoAdmin() {
    const [eventos, setEventos] = useState([
        { id: 'loading', nombre: 'loading' },
        // Agrega más usuarios aquí
    ]);
    const [evento, setEvento] = useState(null)

    useEffect(() => {
        M.AutoInit(); // Initialize Materialize components
        verificarRol();
        fetchEvents();
    }, []);

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

    const fetchEvents = async () => {
        try {
            //const response = await fetch(`${url2}login`, {
            let eventosGeneral = await getEventosClient();
            setEventos(eventosGeneral);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1 className='center-align' style={{ color: 'white' }}>Lista de Eventos</h1>
            <table className="highlight centered" style={{ color: 'white' }}>
                <thead>
                    <tr>
                        <th>idEvento</th>
                        <th>Nombre evento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {eventos.map((event) => (
                        <tr key={event.idEvento}>
                            <td>{event.idEvento}</td>
                            <td>{event.nombre}</td>
                            <td>
                                <a
                                    className="btn-floating btn waves-effect waves-light modal-trigger red darken-1 tooltipped"
                                    data-position="top"
                                    data-tooltip="Eliminar Evento"
                                    style={{ paddingTop: "7px" }}
                                    href="#tarjetaCancelarEvento"
                                    onClick={() => setEvento(event)}
                                >
                                    <MdDelete className="material-icons" color="white" />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <CancelarEvento
                idEvento={evento !== null ? evento.idEvento : ""}
                nombre={evento !== null ? evento.nombre : ""}
                getDataEventos={fetchEvents}
            />
        </div>
    );
}

