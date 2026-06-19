"use client"
import { selectUserLogin } from '@/redux/features/userSlice';
import React from 'react'
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link';
import { Button } from '../ui/button';
import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs'
import { BookOpen } from 'lucide-react'

const DocenteHome = () => {

    const userLogin = useSelector(selectUserLogin);
    const userLoginAny = userLogin as Record<string, unknown>
    const nombre = userLoginAny?.nombre as string || "usuario"
    const clases = userLoginAny?.clases as { id: number; materia: { nombre: string; codigo: string; ciclo: string } }[] | undefined;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Panel de Control"
                description={`Bienvenido, ${nombre}`}
            />

            <DashboardKPIs role={userLogin?.role || "ROLE_DOCENTE"} />

            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <BookOpen size={18} className="text-primary" />
                        Mis Clases
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Ciclo</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(clases?.length ?? 0) > 0 ? (
                                clases?.map((clase) => (
                                    <TableRow key={clase.id}>
                                        <TableCell className="font-medium">{clase.materia?.nombre}</TableCell>
                                        <TableCell>{clase.materia?.codigo}</TableCell>
                                        <TableCell>{clase.materia?.ciclo}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/clases/${clase.id}/informacion`}>
                                                <Button size="sm">Ver Clase</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                        No hay clases asignadas
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default DocenteHome