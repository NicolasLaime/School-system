"use client"
import DocenteHome from '@/components/home/home'
import HomeAdmin from '@/components/home/homeAdmin';
import { selectUserLogin } from '@/redux/features/userSlice';
import React from 'react'
import { useSelector } from 'react-redux';

const Page = () => {


  const userLogin = useSelector(selectUserLogin);


  console.log("userLogin", userLogin)
  return (
    <div>
         { userLogin?.role === "ROLE_DOCENTE" ? <DocenteHome /> : <HomeAdmin /> }
    </div>
  )
}

export default Page