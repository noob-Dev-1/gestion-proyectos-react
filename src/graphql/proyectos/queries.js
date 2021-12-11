import { gql } from "@apollo/client";

const PROYECTOS = gql`

query Proyectos {
    Proyectos {
        _id
        nombre
        estado
      objetivos {
            descripcion
            tipo
        }
    }
}
`;
export { PROYECTOS };