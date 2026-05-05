"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormEditUsuario from '@/components/usuarios/formEditUsuario'
import InformacionUsuario from '@/components/usuarios/informacionUsuario'
import { selectUserLogin } from '@/redux/features/userSlice'
import { useGetUserByIdQuery } from '@/redux/services/authApi'
import { Loader2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

const Page = () => {
  const params = useParams()
  const id = params.id as string
  const [editarUsuario, setEditarUsuario] = React.useState(false)
  const userLogin = useSelector(selectUserLogin)


 if(!id){
    notFound()
 } 

 const {data , isLoading, isError} = useGetUserByIdQuery(id)

 if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  
  if (isError) return <div>Usuario no encontrado</div>;


  const dataUser = data?.data

  console.log("dataUser", dataUser) 

  if (!dataUser || !dataUser.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }

  const handleEditarUsuario = () => {
    setEditarUsuario(!editarUsuario)
  }

  console.log("userLogin", userLogin)

  const userPerfil = userLogin?.rol

  
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/usuarios"
        label="usuarios"
        page="Editar usuarios"
      />
      <section className="container mx-auto py-10 px-5">
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>Datos usuario</CardTitle>
        </CardHeader>
        <CardContent>
      { editarUsuario ? 
        <FormEditUsuario
          dataUser={dataUser}
          userPerfil={userPerfil}
        />
        :
        <InformacionUsuario dataUser={dataUser} />
      }
        </CardContent>
        </Card>
        <Button onClick={handleEditarUsuario} className="mt-5 cursor-pointer justify-content-end">
          { editarUsuario ? "Cancelar" : "Editar "}
        </Button>
      </section>
    </section>
  );
}

export default Page