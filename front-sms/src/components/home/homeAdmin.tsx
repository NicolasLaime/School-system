"use client"
import { selectUserLogin } from '@/redux/features/userSlice';
import React from 'react'
import { useSelector } from 'react-redux';
import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs'

const HomeAdmin = () => {
  const userLogin = useSelector(selectUserLogin);

  return (
    <div>
      <PageHeader
        title="Panel de Control"
        description={`Bienvenido, ${(userLogin as Record<string, unknown>)?.nombre as string || "usuario"}`}
      />
      <DashboardKPIs role={userLogin?.role || "ROLE_ADMIN"} />
    </div>
  )
}

export default HomeAdmin
