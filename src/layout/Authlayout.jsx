import Footer from '@/pages/Shared/footer/Footer'
import Header from '@/pages/Shared/header/Header'
import React from 'react'
import { Outlet } from 'react-router'

export default function Authlayout() {
  return (
   <div>
     <Header></Header>
    <Outlet></Outlet>
    <Footer></Footer>
   </div>
  )
}
