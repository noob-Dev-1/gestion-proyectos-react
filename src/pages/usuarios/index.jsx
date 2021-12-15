import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USUARIOS } from 'graphql/usuarios/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enum';

const IndexUsuarios = () => {
  const { data, error, loading } = useQuery(GET_USUARIOS);

  useEffect(() => {
    console.log('data servidor', data);
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Error consultando los usuarios');
    }
  }, [error]);

  if (loading) return <div>Cargando....</div>;

  return (
    <div className="h-full p-10 flex flex-col bg-green-200">
      <div className='flex w-full items-center justify-center'>
        <h1 className='text-2xl font-bold text-gray-700 uppercase'>Usuarios:</h1>
      </div>
      <table className='tabla'>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Identificación</th>
            <th>Rol</th>
            <th>Estado</th>
            {/* <PrivateComponent roleList={["ADMINISTRADOR"]}> :::Se activa cuando se tengan los roles definidos para el login*/}
            <th>Editar</th>
            {/* <PrivateComponent/>*/}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.Usuarios.map((u) => {
              return (
                <tr key={u._id}>
                  <td>{u.nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.correo}</td>
                  <td>{u.identificacion}</td>
                  <td>{Enum_Rol[u.rol]}</td>
                  <td>{Enum_EstadoUsuario[u.estado]}</td>
                  {/* <PrivateComponent roleList={["ADMINISTRADOR"]}> :::Se activa cuando se tengan los roles definidos para el login*/}
                  <td>
                    <Link to={`/usuarios/editar/${u._id}`}>
                      <i className='fas fa-pen text-yellow-600 hover:text-yellow-400 cursor-pointer' />
                    </Link>
                    <i
                      //onClick={() => eliminarProducto()}
                      className="fas fa-trash text-red-700 hover:text-red-500 pl-3 cursos-pointer" />
                  </td>
                  {/* <PrivateComponent/>*/}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default IndexUsuarios;
