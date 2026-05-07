import React from 'react'
import { User } from '../../../types/Usuario.type'

interface Props {
  dataUser: User | undefined
}


const InformacionUsuario = ({ dataUser }: Props) => {
  return (
    <div className="p-4 rounded-xl ">
        <p className="text-xl font-bold">Datos del usuario</p>
        <p className="text-lg">Nombre: {dataUser?.nombre}</p>
        <p className="text-lg">Email: {dataUser?.email}</p>
        <p className="text-lg">Telefono: {dataUser?.telefono}</p>
        <p className="text-lg">Direccion: {dataUser?.direccion}</p>
    </div>
  )
}

export default InformacionUsuario