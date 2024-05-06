import React, { useState, useEffect } from 'react';
import M from "materialize-css";
import jwt_decode from "jwt-decode";

export default function LockAdmin() {
    const [users, setUsers] = useState([
        { id: 'loading', name: 'loading', email: 'loading', locked: false },
        // Agrega más usuarios aquí
    ]);

    const url = `${import.meta.env.VITE_REACT_APP_API_URL}api=usuario&id=`;


    useEffect(() => {
        M.AutoInit(); // Initialize Materialize components
        verificarRol();
        fetchusers();
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

    const handleLock = async (userId) => {
        try {
          const response = await fetch(`${url}lockuseradmin`, {
            method: "post",
            body: JSON.stringify({ correo: userId }),
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          const data = await response.json();
      
          if (data.body.res === true) {
            M.toast({ html: data.body.message, classes: "rounded green" });
            fetchusers(); 
          } else {
            M.toast({ html: data.body.message, classes: "rounded red" });
          }
        } catch (error) {
          console.log(error);
        }
      };
      
      const handleUnlock = async (userId) => {
        try {
          const response = await fetch(`${url}unlockuseradmin`, {
            method: "post",
            body: JSON.stringify({ correo: userId }),
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          const data = await response.json();
      
          if (data.body.res === true) {
            M.toast({ html: data.body.message, classes: "rounded green" });
            fetchusers(); // Actualizar la lista de usuarios después del desbloqueo exitoso
          } else {
            M.toast({ html: data.body.message, classes: "rounded red" });
          }
        } catch (error) {
          console.log(error);
        }
      };
      

    const fetchusers = async () => {
        try {
            //const response = await fetch(`${url2}login`, {
            const response = await fetch(`${url}getusuarios`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },

            });

            const data = await response.json();
            console.log(data);

            if (data.body.res === true) {
                M.toast({ html: data.body.message, classes: "rounded green" });

                const filteredUsers = data.body.usuarios.filter(
                    (userData) => userData.tipo_user !== 2
                );
                const mappedUsers = filteredUsers.map((userData, index) => (
                    {
                        id: index, // Podrías utilizar el índice como ID temporal
                        name: `${userData.nombre} ${userData.apellido}`,
                        user: userData.user,
                        email: userData.correo,
                        locked: userData.estado === 1 ? false : true, // Asumiendo que el estado 1 significa desbloqueado
                    }));
                setUsers(mappedUsers);
            } else {
                M.toast({ html: data.body.message, classes: "rounded red" });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1 className='center-align' style={{ color: 'white' }}>Lista de Usuarios</h1>
            <table className="striped centered" style={{ color: 'white' }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.user}</td>
                            <td>
                                {user.locked ? (
                                    <button
                                        className="waves-effect waves-light btn red"
                                        onClick={() => handleUnlock(user.email)}
                                    >
                                        Desbloquear
                                    </button>
                                ) : (
                                    <button
                                        className="waves-effect waves-light btn green"
                                        onClick={() => handleLock(user.email)}
                                    >
                                        Bloquear
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

