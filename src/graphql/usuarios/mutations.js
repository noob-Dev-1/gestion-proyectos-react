import { gql } from '@apollo/client';

const EDITAR_USUARIO = gql`
  mutation EditarUsuario(
    $_id: String!
    $campos: camposUsuarios!
  ) {
    editarUsuario(
      _id: $_id
      campos: $campos
    ) {
      _id
      nombre
      apellido
      correo
      estado
      identificacion
    }
  }
`;

const EDITAR_PERFIL = gql`
  mutation EditarPerfil($_id: String!, $campos: CamposEditarPerfil!) {
    editarPerfil(_id: $_id, campos: $campos) {
      _id
      nombre
      apellido
      identificacion
      foto
    }
  }
`;

export { EDITAR_USUARIO, EDITAR_PERFIL };