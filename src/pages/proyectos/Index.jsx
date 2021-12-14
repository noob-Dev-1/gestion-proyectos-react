import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import { useMutation, useQuery } from '@apollo/client';
import { PROYECTOS } from 'graphql/proyectos/queries';
import { data } from 'autoprefixer';
import DropDown from 'components/Dropdown';
import { Dialog } from '@mui/material';
import Input from 'components/Input';
import { Enum_EstadoProyecto } from 'utils/enum';
import ButtonLoading from 'components/ButtonLoading';
import { EDITAR_PROYECTO } from '../../graphql/proyectos/mutations';
import useFormData from 'hooks/useFormData';
import { toast } from 'react-toastify';
import PrivateComponent from 'components/PrivateComponent';
import { Link } from "react-router-dom";
//import PrivateComponent from 'components/PrivateComponent';

const AccordionStyled = styled((props) => <Accordion {...props} />)(({ theme }) => ({
    backgroundColor: "#00BFFF",
}));

const AccordionSummaryStyled = styled((props) => <AccordionSummary {...props} />)(({ theme }) => ({
    backgroundColor: "#3F51B5",

}));
const AccordionDetailsStyled = styled((props) => <AccordionDetails {...props} />)(({ theme }) => ({
    backgroundColor: "#D3D3D3",
}));
const IndexProyectos = () => {

    const { data: queryData, loading, error } = useQuery(PROYECTOS);

    useEffect(() => {
        console.log("datos proyecto", queryData);
    }, [queryData]);

    if (loading) return <div>Cargando...</div>;

    if (queryData.Proyectos) {
        return (
            <div className="h-full p-10 flex flex-col bg-gray-200">
                <div className='flex w-full items-center justify-center'>
                    <h1 className='text-2xl font-bold text-gray-700 uppercase'>Lista de Proyectos</h1>
                </div>
                {/* <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}> se habilita solo para administrador y lider*/}
                <div className='my-2 self-end'>
                    <button className='bg-indigo-900 text-red-50 p-2 rounded-lg shadow-lg hover:bg-indigo-300'>
                        <Link to="/proyectos/nuevo"> Crear Nuevo proyecto </Link>
                    </button>
                </div>
                {/* </PrivateComponent> */}

                {queryData.Proyectos.map((proyecto) => {
                    return <AccordionProyecto proyecto={proyecto} />;

                })}
            </div>
        )
    }
};

const AccordionProyecto = ({ proyecto }) => {
    const [showDialog, setShowDialog] = useState(false)
    return (
        <>
            <AccordionStyled>
                <AccordionSummaryStyled expandIcon={<i className="fas fa-chevron-down" />}>
                    <div className="flex w-full justify-between">
                        <div className="uppercase font-bold text-gray-100">
                            {proyecto.nombre} - {proyecto.estado}

                        </div>

                    </div>


                </AccordionSummaryStyled>
                <AccordionDetailsStyled>
                    {/* <PrivateComponent roleList={["ADMINISTRADOR"]}> :::Se activa cuando se tengan los roles definidos para el login*/}
                    <i className=" mx-4 fas fa-pen text-gray-800 hover:text-blue-500" onClick={() => { setShowDialog(true) }} />
                    {/* </PrivateComponent> */}
                    <div className="flex">
                        {proyecto.objetivos.map((objetivo) => {
                            return <Objetivo tipo={objetivo.tipo} descripcion={objetivo.descripcion} />;
                        })}
                    </div>
                </AccordionDetailsStyled>
                <Dialog></Dialog>
            </AccordionStyled>
            <Dialog open={showDialog} onClose={() => { setShowDialog(false) }}>
                <FormEditProyecto _id={proyecto._id} />
            </Dialog>
        </>
    )
}

const FormEditProyecto = ({ _id }) => {

    const { form, formData, updateFormData } = useFormData();
    const [editarProyecto, { data: dataMutation, loading, error }] = useMutation(EDITAR_PROYECTO);

    const submitForm = (e) => {
        e.preventDefault();
        editarProyecto({
            variables: {
                _id,
                campos: formData,
            }
        })
    }

    useEffect(() => {
        console.log("data mutations", dataMutation);
        if (dataMutation) {
            toast.success('Proyecto modificado correctamente');
        }
    }, [dataMutation]);

    return (
        <div className="p-4 ">
            <h1 className="font-bold">Modificar estado del proyecto</h1>

            <form
                ref={form}
                onChange={updateFormData}
                onSubmit={submitForm} className="flex flex-col item-center">
                <DropDown label="Estado del proyecto" name="estado" options={Enum_EstadoProyecto} />
                <ButtonLoading disabled={false} loading={loading} text="Confirmar" />
            </form>
        </div>


    )
}

const Objetivo = ({ tipo, descripcion }) => {
    return (
        <div className="mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col item-center justify-center shadow-xl">
            <div className="text-lg font-bold">{tipo}</div>
            <div>{descripcion}</div>

            {/* <PrivateComponent roleList={["ADMINISTRADOR"]}> se activa cuando se tengan roles definidos para el login*/}
            <div className=" mx-4 fas fa-edit text-gray-800 hover:text-blue-500"></div>
            {/* </PrivateComponent> */}

        </div>
    )
}

export default IndexProyectos;
