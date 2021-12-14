import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Input from 'components/Input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USUARIOS } from "graphql/usuarios/queries";
import DropDown from 'components/Dropdown';
import ButtonLoading from 'components/ButtonLoading';
import useFormData from 'hooks/useFormData';
import { CREAR_PROYECTO } from 'graphql/proyectos/mutations';


const NuevoProyecto = () => {
    const { form, formData, updateFormData } = useFormData();
    const [listaUsuarios, setListaUsuarios] = useState({});
    const { data, loading, error } = useQuery(GET_USUARIOS, {
        variables: {
            filtro: { rol: "LIDER", estado: "AUTORIZADO" },
        },
    });

    const [crearProyecto, { data: mutationData, loading: mutationLoading, error: mutationError }] =
        useMutation(CREAR_PROYECTO);

    useEffect(() => {
        console.log(data);
        if (data) {
            const lu = {};
            data.Usuarios.forEach((elemento) => {
                lu[elemento._id] = elemento.correo;
            });
            setListaUsuarios(lu);
        }
    }, [data]);

    useEffect(() => {
        console.log('data mutation', mutationData);
    });

    const submitForm = (e) => {
        e.preventDefault();
        console.log(formData)
        /*formData.objetivos = Object.values(formData.objetivos);*/
        formData.presupuesto = parseFloat(formData.presupuesto);

        crearProyecto({
            variables: formData,
        });
    };

    if (loading) return <div>...Loading</div>

    return (
        <div className='p-10 flex flex-col items-center'>
            <div className='self-start'>
                <Link to="/proyectos">
                    <i className="fas fa-arrow-left" />
                </Link>
            </div>

            <h1 className="text-2xl font-bold text-gray-700">Crear Nuevo Proyecto</h1>
            <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
                <Input name="nombre" label="Nombre del Proyecto" required={true} type="text" />
                <Input name="presupuesto" label="Presupuesto del Proyecto" required={true} type="number" />
                <Input name="fechaInicio" label="Fecha de Inicio" required={true} type="date" />
                <Input name="fechaFin" label="Fecha de Fin" required={true} type="date" />
                <DropDown label="Lider" options={listaUsuarios} name="lider" required={true} />
                <ButtonLoading text="Crear Proyecto" loading={false} disabled={false} />
            </form>

        </div>
    )
}

export default NuevoProyecto;
