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
import { Enum_EstadoProyecto, Enum_TipoObjetivo } from 'utils/enum';
import ButtonLoading from 'components/ButtonLoading';
import { EDITAR_PROYECTO, ELIMINAR_OBJETIVO, EDITAR_OBJETIVO} from '../../graphql/proyectos/mutations';
import useFormData from 'hooks/useFormData';
import { toast } from 'react-toastify';
import PrivateComponent from 'components/PrivateComponent';
import { Link } from "react-router-dom";
import ReactLoading from 'react-loading'
import { CREAR_INSCRIPCION } from 'graphql/inscripciones/mutaciones';
import { useUser } from 'context/userContext';


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

    if (loading) return (
        <div className='w-full items-center justify-center h-full p-10 flex flex-col bg-gray-200"'>
            <h1 className='text-2xl font-bold text-gray-700 uppercase'>Cargando...</h1>
        </div>);

    if (queryData.Proyectos) {
        return(
            <div className="h-full p-10 flex flex-col bg-green-200">
                <div className='flex w-full items-center justify-center'>
                    <h1 className='text-2xl font-bold text-gray-700 uppercase'>Lista de Proyectos</h1>
                </div>
                 <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
                <div className='my-2 self-end'>
                    <button data-testid="boton-crear-proyecto" className='bg-indigo-900 text-red-50 p-2 rounded-lg shadow-lg hover:bg-indigo-300'>
                        <Link to="/proyectos/nuevo"> Crear Nuevo proyecto </Link>
                    </button>
                </div>
                </PrivateComponent> 

                {queryData.Proyectos.map((proyecto) => {
                    return <AccordionProyecto proyecto={proyecto} />;

                })}
                </div>
        );
    }
    return <></>;
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
                    <div className="relative h-1">
                        <PrivateComponent roleList={["ADMINISTRADOR"]}>
                        <button
                            type='button'
                            onClick={() => {
                                setShowDialog(true);
                            }}
                        >
                            <i className=" mx-4 fas fa-pen text-yellow-700 hover:text-yellow-500 absolute top-0 right-14" onClick={() => { setShowDialog(true) }} />
                        </button>
                        <i
                            //onClick={() => eliminarProyecto()}
                            className="fas fa-trash text-red-700 hover:text-red-500 pl-3 cursos-pointer absolute top-0 right-10" />
                         </PrivateComponent>
                        
                        <PrivateComponent  roleList={['ESTUDIANTE']}>
                             <InscripcionProyecto
                                idProyecto={proyecto._id}
                                estado={proyecto.estado}
                                inscripciones={proyecto.inscripciones}
                            />
                        </PrivateComponent>
                            
                         


                    </div>
                    <div className="text-black font-bold">
                        Presupuesto : ${proyecto.presupuesto}
                        <br />
                        Liderado por : {proyecto.lider.nombre}  {proyecto.lider.apellido}
                    </div>

                    <div className="flex">

                        {proyecto.objetivos.map((objetivo, index) => {
                            return <Objetivo
                                index={index}
                                _id={objetivo._id}
                                idProyecto={proyecto._id}
                                tipo={objetivo.tipo}
                                descripcion={objetivo.descripcion}
                            />;
                        })}
                    </div>
                </AccordionDetailsStyled>
            </AccordionStyled>
            <Dialog
                open={showDialog}
                onClose={() => {
                    setShowDialog(false)
                }}
            >
                <FormEditProyecto _id={proyecto._id} />
            </Dialog>
        </>
    )
};

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
        });
    };

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
                <DropDown
                    label="Estado del proyecto"
                    name="estado"
                    options={Enum_EstadoProyecto}

                />
                <ButtonLoading disabled={false} loading={loading} text="Confirmar" />
            </form>
        </div>


    )
}

const Objetivo = ({ index, _id, idProyecto, tipo, descripcion }) => {

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [
        eliminarObjetivo,
        { data: dataMutationEliminar, loading: eliminarLoading },
    ] = useMutation(ELIMINAR_OBJETIVO, {
        refetchQueries: [{ query: PROYECTOS }],
    });

    useEffect(() => {
        if (dataMutationEliminar) {
            toast.success('objetivo eliminado satisfactoriamente');
        }
    }, [dataMutationEliminar]);

    const ejecutarEliminacion = () => {
        eliminarObjetivo({ variables: { idProyecto, idObjetivo: _id } });
    };

    if (eliminarLoading)
        return (
            <ReactLoading
                data-testid='loading-in-button'
                type='spin'
                height={100}
                width={100}
            />
        );
    return (
        <div className="y-scroll mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col item-center justify-center shadow-xl">
            <div className="text-lg font-bold">{tipo}</div>
            <div>{descripcion}</div>

            <PrivateComponent roleList={['ADMINISTRADOR','LIDER']}> 
            <div className='flex my-2'>
                <button type='button' onClick={() => setShowEditDialog(true)}>
                    <i className='fas fa-pen mx-2 text-yellow-500 hover:text-yellow-200 cursor-pointer' />
                </button>
                <button type='button' onClick={ejecutarEliminacion}>
                    <i className='fas fa-trash mx-2 text-red-500 hover:text-red-200 cursor-pointer' />
                </button>
            </div>
            <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
                <EditarObjetivo
                    descripcion={descripcion}
                    tipo={tipo}
                    index={index}
                    idProyecto={idProyecto}
                    setShowEditDialog={setShowEditDialog}
                />
            </Dialog>
            </PrivateComponent>

        </div>
    );
};

const EditarObjetivo = ({
    descripcion,
    tipo,
    index,
    idProyecto,
    setShowEditDialog,
}) => {
    const { form, formData, updateFormData } = useFormData();

    const [editarObjetivo, { data: dataMutation, loading }] = useMutation(
        EDITAR_OBJETIVO,
        {
            refetchQueries: [{ query: PROYECTOS }],
        }
    );

    useEffect(() => {
        if (dataMutation) {
            toast.success('Objetivo editado con exito');
            setShowEditDialog(false);
        }
    }, [dataMutation, setShowEditDialog]);

    const submitForm = (e) => {
        e.preventDefault();
        editarObjetivo({
            variables: {
                idProyecto,
                indexObjetivo: index,
                campos: formData,
            },
        }).catch((error) => {
            toast.error('Error editando el objetivo', error);
        });
    };
    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold text-gray-900'>Editar Objetivo</h1>
            <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
                <DropDown
                    label='Tipo de Objetivo'
                    name='tipo'
                    required
                    options={Enum_TipoObjetivo}
                    defaultValue={tipo}
                />
                <Input
                    label='Descripcion del objetivo'
                    name='descripcion'
                    required
                    defaultValue={descripcion}
                />
                <ButtonLoading
                    text='Confirmar'
                    disabled={Object.keys(formData).length === 0}
                    loading={loading}
                />
            </form>
        </div>
    );
};


const InscripcionProyecto = ({ idProyecto, estado, inscripciones }) => {
    const [estadoInscripcion, setEstadoInscripcion] = useState('');

    // falta captura del error de la mutacion
    const [crearInscripcion, { data, loading }] = useMutation(CREAR_INSCRIPCION);
    const { userData } = useUser();

    useEffect(() => {
        if (userData && inscripciones) {
            const flt = inscripciones.filter(
                (el) => el.estudiante._id === userData._id
            );
            if (flt.length > 0) {
                setEstadoInscripcion(flt[0].estado);
            }
        }
    }, [userData, inscripciones]);

    useEffect(() => {
        if (data) {
            toast.success('inscripcion creada con exito');
        }
    }, [data]);

    const confirmarInscripcion = () => {
        crearInscripcion({
            variables: { proyecto: idProyecto, estudiante: userData._id },
        });
    };

    return (
        <>
            {estadoInscripcion !== '' ? (
                <span>
                    Ya estas inscrito en este proyecto y el estado es {estadoInscripcion}
                </span>
            ) : (
                <ButtonLoading
                    onClick={() => confirmarInscripcion()}
                    disabled={estado === 'INACTIVO'}
                    loading={loading}
                    text='Inscribirme en este proyecto'
                />
            )}
        </>
    );
};


export default IndexProyectos;