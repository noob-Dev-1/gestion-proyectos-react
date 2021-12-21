import { gql } from '@apollo/client';

const GET_INSCRIPCIONES = gql`
  query InscripcionesProyecto($idProyecto: String!) {
    InscripcionesProyecto(idProyecto: $idProyecto) {
      _id
      estado
      estudiante {
      nombre
      }
      fechaIngreso
      fechaEgreso
      proyecto {
        _id
        nombre
      }
    }
  }
`;

export { GET_INSCRIPCIONES };