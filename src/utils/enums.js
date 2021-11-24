const Enum_Rol = {
  ADMINISTRADOR: 'Administrador',
  ESTUDIANTE: 'Estudiante',
  LIDER: 'Líder',
};

const Enum_EstadoUsuario = {
  PENDIENTE: 'Pendiente',
  AUTORIZADO: 'Autorizado',
  NO_AUTORIZADO: 'No autorizado',
};

const Enum_EstadoProyecto = {
  ACTIVO: 'ACTIVO',
  INACTIVO : 'INACTIVO',
};


const Enum_FaseProyecto = {
 INICIADO: 'INICIADO',
 DESARROLLO: 'DESARROLLO',
 TERMINADO: 'TERMINADO',
 NULO: '',
};

export { Enum_Rol, Enum_EstadoUsuario, Enum_EstadoProyecto,Enum_FaseProyecto };
