/* eslint-disable react/prop-types */
import React from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/calendario.css"

const localizer = momentLocalizer(moment);
const MySwal = withReactContent(Swal);


function Event(event) {
  const handleAlert = async () => {
    await MySwal.fire({
      title: event.title,
      imageUrl: event.event.imagen,
      imageHeight: 300,
      width: 800,
      html:
        '<div style="text-align: left;">'+
        '<p style="color:white"><b>Descripción: </b>'+event.event.descripcion+'</p>'+
        '<p style="color:white"><b>Fecha de inicio: </b>'+event.event.start+'</p>'+
        '<p style="color:white"><b>Fecha de fin: </b>'+event.event.end+'</p>'+
        '<p style="color:white"><b>Tipo de evento: </b>'+event.event.tipo_evento+'</p>'+
        '<p style="color:white"><b>Clasificación: </b>'+event.event.clasificacion+'</p>'+
        '</div>',
    });

  };

  return (
    <div>
      <button className="btn-event" onClick={handleAlert}>{event.title}</button>
    </div>
  );
}



const CalendarComponent = ({ev}) => {
  let events = []
  ev.forEach(element => {
    let act = {
      title: element.nombre_evento,
      start: new Date(element.fecha.split("-")[0],element.fecha.split("-")[1]-1,element.fecha.split("-")[2], element.hora_fin.split(":")[0], element.hora_fin.split(":")[1]),
      end: new Date(element.fecha.split("-")[0],element.fecha.split("-")[1]-1,element.fecha.split("-")[2], element.hora_inicio.split(":")[0], element.hora_inicio.split(":")[1]),
      clasificacion: element.categoria,
      descripcion: element.descripcion,
      id_evento: element.id_evento,
      id_usr: element.id_usr,
      imagen: element.imagen,
      nombre_evento: element.nombre_evento,
      tipo_evento: element.tipo
    }
    events.push(act)
  });
  
  return(
    <div style={{ minHeight: '300px', height:'550px', maxHeight:'100%', minWidth:'250px', maxWidth:'800px'}}>
      <Calendar 
        tooltipAccessor={null}
        components={{ event: Event }}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultDate={moment().toDate()}
        localizer={localizer}
      />
    </div>
  );
};

export default CalendarComponent;