"use client"
import { selectUserLogin } from '@/redux/features/userSlice';
import React from 'react'
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Clase } from '../../../types/Usuario.type';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useGetClasesQuery } from '@/redux/services/clasesApi';
import { Loader2 } from 'lucide-react';
import { useGetAlumnosQuery } from '@/redux/services/alumnosApi';
import { useGetUsersQuery } from '@/redux/services/authApi';
import { useGetAsignaturasQuery } from '@/redux/services/asignatura.Api';

const HomeAdmin = () => {

    //usuario logueado
    const userLogin = useSelector(selectUserLogin);
    const clasesUser = userLogin?.clases;

    //todas las asignaturas
    const { data : dataAsignaturas, isLoading: isLoadingAsignaturas, isError: isErrorasignaturas } = useGetAsignaturasQuery();
    const asignaturasData = dataAsignaturas?.data;


    //todos los alumnos
    const { data : alumnos, isLoading: isLoadingAlumnos, isError: isErrorAlumnos } = useGetAlumnosQuery();
    const alumnosData = alumnos?.data;

    //todos los usuarios
    const { data : usuarios, isLoading: isLoadingUsuarios, isError: isErrorUsuarios } = useGetUsersQuery();
    const usuariosData = usuarios?.data;

    return (
        <section className='container mx-auto px-5 py-10 w-screen flex flex-col gap-10'>
            <div>
                <h1>Bienvenido {userLogin?.nombre}</h1>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Asignaturas</CardTitle>
                    </CardHeader>
                    <CardContent>
                       { isLoadingAsignaturas ? <Loader2 className='animate-spin text-primary' /> : <p>
                            {asignaturasData?.length}
                        </p> } 

                        { isErrorasignaturas && <p className='text-red-500'>Error al cargar las asignaturas</p> }
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Alumnos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        { isLoadingAlumnos ? <Loader2 className='animate-spin text-primary' /> : <p>
                            {alumnosData?.length}
                        </p> } 
                        { isErrorAlumnos && <p className='text-red-500'>Error al cargar los alumnos</p> }
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        { isLoadingUsuarios ? <Loader2 className='animate-spin text-primary' /> : <p>
                            {usuariosData?.length}
                        </p> } 
                        { isErrorUsuarios && <p className='text-red-500'>Error al cargar los usuarios</p> }
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Tabla de Clases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>Tabla de Clases</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Codigo</TableHead>
                                    <TableHead>Ciclo</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clasesUser && clasesUser?.length > 0 ? (
                                    clasesUser?.map((clase: Clase) => (
                                        <TableRow key={clase.id}>
                                            <TableCell>{clase.materia?.nombre}</TableCell>
                                            <TableCell>{clase.materia?.codigo}</TableCell>
                                            <TableCell>{clase.materia?.cicloLectivo}</TableCell>
                                            <TableCell>
                                                <Link href={`/dashboard/clases/${clase.id}/informacion`}>
                                                    <Button>Ver Clase</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className='text-center'>
                                          No tienes clases asignadas
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default HomeAdmin