import axios from "axios";

/* const URL = "http://localhost:3002/"; */

const URL3 = `${import.meta.env.VITE_REACT_APP_API_URL}api=compra&id=`;
const URL = `${import.meta.env.VITE_REACT_APP_API_URL}api=evento&id=`;
import jwt_decode from "jwt-decode";

// ! ENDPOINTS PARA EL MANEJO DE EVENTOS

/*
 * @description -> Metodo Para Obtener El Token De Sesion JWT
 */
const auth = {
  get headers() {
    return {
      authorization: "Bearer " + sessionStorage.getItem("session"),
    };
  },
};

/*
 * @description -> Metodo Para Mostrar Los Toast En Pantalla
 */
const displayToast = (color, text) => {
  M.toast({
    html: text,
    classes: color + " white-text",
  });
};

/*
 * @description -> Metodo Para Crear Un Evento Nuevo
 */
export const crearEvento = async (evento) => {
  try {
    const result = (await axios.post(URL + "crear-evento", evento)).data;
    console.log(result);
    displayToast("green darken-2", result.message);
  } catch (error) {
    console.log(error.response.data.message, error.response.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " =>" + error.response.status
    );
  }
};

/*
 * @description -> Metodo Para Editar Evento
 */
export const editarEvento = async (evento) => {
  try {
    const result = (await axios.put(URL + "editar-evento", evento)).data;
    console.log(result);
    displayToast("green darken-2", result.message);
    return true;
  } catch (error) {
    console.log(error.response.data.message, error.respose.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " => " + error.response.status
    );
    return false;
  }
};

/*
 * @description -> Metodo Para Obtener Los Eventos Para La Vista Del Organizador
 */
export const getEventosOrganizador = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const Tipo = jwt_decode(token);

    /*  */
    const result = (
      await axios.get(URL + `get-eventos-org&id_org=${Tipo.usuario}`)
    ).data;
    displayToast("green darken-2", result.message);
    return result.res;
  } catch (error) {
    console.log(error.response.data.message, error.respose.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " => " + error.response.status
    );
    return [];
  }
};

/*
 * @description -> Metodo Para Obtener Los Eventos Para La Vista Del Cliente
 */
export const getEventosClient = async () => {
  try {
    const result = (await axios.get(URL + "get-eventos")).data;
    displayToast("green darken-2", result.message);
    return result.res;
  } catch (error) {
    console.log(error.response.data.message, error.respose.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " => " + error.response.status
    );
    return [];
  }
};

/*
 * @description -> Metodo Para Cancelar Un Evento
 */
export const cancelarEvento = async (data) => {
  try {
    const result = (await axios.put(URL + "cancelar-evento", data)).data;
    displayToast("green darken-2", result.message);
    return result.res;
  } catch (error) {
    console.log(error.response.data.message, error.respose.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " => " + error.response.status
    );
  }
};

// ! ENDPOINTS DEL MODAL DE COMPRAR TICKETS
/*
 * @description -> Obtener Los Eventos Para La Vista Del Organizador
 */
export const getLocalidadesClient = async (id_event) => {
  try {
    const result = (await axios.get(URL3 + "get-localidad/" + id_event)).data;
    return result;
  } catch (error) {
    console.log(error.response.data.message, error.respose.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " => " + error.response.status
    );
    return [];
  }
};
/*
 * @description -> Obtener Los Asientos
 */
export const getAsientos = async (id_event, idLocalidad) => {
  try {
    const result = (
      await axios.get(URL3 + "get-asientos/" + id_event + "/" + idLocalidad)
    ).data;
    return result;
  } catch (error) {
    console.log(error.response.data.message, error.respose.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " => " + error.response.status
    );
    return [];
  }
};
/*
 * @description -> Metodo Para desapartar Asientos
 */
export const desapartar10mins = async (asientos) => {
  try {
    const result = (await axios.post(URL + "desapartar10mins", asientos)).data;
    console.log(result);
    displayToast("green darken-2", result.message);
  } catch (error) {
    console.log(error.response.data.message, error.response.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " =>" + error.response.status
    );
  }
};
/*
 * @description -> Metodo Para apartar Asientos
 */
export const apartar10mins = async (asientos) => {
  try {
    const result = (await axios.post(URL + "apartar10mins", asientos)).data;
    console.log(result);
    displayToast("green darken-2", result.message);
  } catch (error) {
    console.log(error.response.data.message, error.response.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " =>" + error.response.status
    );
  }
};
/*
 * @description -> Metodo para comprar asientos
 */
export const reservarasientos = async (asientos) => {
  try {
    const result = (await axios.post(URL + "reservar-asientos", asientos)).data;
    console.log(result);
    displayToast("green darken-2", result.message);
  } catch (error) {
    console.log(error.response.data.message, error.response.status);
    displayToast(
      "red darken-1",
      error.response.data.message + " =>" + error.response.status
    );
  }
};
