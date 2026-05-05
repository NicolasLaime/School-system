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

const DocenteHome = () => {

    const userLogin = useSelector(selectUserLogin);

    console.log("userLogin", userLogin);

    const clases = userLogin?.clases;

    console.log("clases", clases);

    return (
        <section className='container mx-auto px-5 py-10 w-screen flex flex-col gap-10'>
            <div>
                <h1>Bienvenido {userLogin?.nombre}</h1>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Clases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            {userLogin?.clases?.length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Notas</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Notas</CardTitle>
                    </CardHeader>
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
                                {clases?.length > 0 ? (
                                    clases.map((clase: Clase) => (
                                        <TableRow key={clase.id}>
                                            <TableCell>{clase.materia?.nombre}</TableCell>
                                            <TableCell>{clase.materia?.codigo}</TableCell>
                                            <TableCell>{clase.materia?.ciclo}</TableCell>
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
                                            No hay clases
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

export default DocenteHome