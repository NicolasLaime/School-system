import FormnuevaMateria from '@/components/materias/formnuevaMateria'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <div>
        <BreadcrumbWithCustomSeparator href="/dashboard/materias" label="materias" page="Nueva materia" />
        <div className="container mx-auto px-5 py-10 w-[60vw]">

        <FormnuevaMateria />
        </div>
    </div>
  )
}

export default page