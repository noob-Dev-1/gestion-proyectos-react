import {gql}  from '@apollo/client';

const EDITAR_PROYECTO =gql`
    mutation EditarProyecto(
        $_id:String!
        $nombre: String!
        $estado: Enum_EstadoProyecto!
        $fase: Enum_FaseProyecto!
        $fechaInicio: Date!
        $fechaFin: Date!
        $presupuesto: Number!
        $lider: Schema.Types.ObjectId!
        $objetivos: String!
    ) {
        editarProyecto(
            _id: $_id
            nombre: $nombre
            presupuesto: $presupuesto
            estado: $estado
            fase: $fase
            objetivos:   $objetivos
        ) {
            _id
            nombre
            presupuesto
            estado
            fase
            objetivos
        }
    }
`;
export {EDITAR_PROYECTO}