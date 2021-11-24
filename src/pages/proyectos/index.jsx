import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom';
import { GET_PROYECTOS } from 'graphql/proyectos/queries';
import { Enum_EstadoProyecto, Enum_FaseProyecto } from 'utils/enum';



const IndexProyectos = () => {
    const { data, error, loading } = useQuery(GET_PROYECTOS)

    useEffect(() => {
        console.log('datos de proyectos en el servidor ', data);
    }, [data]);

    useEffect(() => {
        if (error) {
            toast.error('Error consultando los proyectos');
        }
    }, [error]);

    //if (loading) return <div>Cargando la información de los proyectos....</div>;


    return (
        <div className='m-24'>
            <h2 className='text-3xl text-center font-extrabold text-gray-900'>Datos Proyectos:</h2>
            <table className='tabla'>
                <thead>
                    <tr>
                        <th className='rounded-tl-2xl border-none'>Nombre</th>
                        <th>Presupuesto</th>
                        <th>Estado</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Fase</th>
                        <th className='rounded-tr-2xl border-none'>Lider</th>
                    </tr>
                </thead>
                <tbody>
                    {data &&
                        data.Proyectos.map((u) => {
                            return (
                                <tr key={u._id}>
                                    <td>{u.nombre}</td>
                                    <td>{u.presupuesto}</td>
                                    <td>{Enum_EstadoProyecto[u.estado]}</td>
                                    <td>{u.fechaInicio}</td>
                                    <td>{u.fechaFin}</td>
                                    <td>{Enum_FaseProyecto[u.fase]}</td>
                                    <td>{u.Lider}</td>
                                    <td>
                                        <Link to={`/usuarios/editar/${u._id}`}>
                                            <i className='fas fa-pen text-yellow-600 hover:text-yellow-400 cursor-pointer' />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};
export default IndexProyectos;
