import React from 'react'
import Footer from '@/pages/Shared/footer/Footer'
import Header from '@/pages/Shared/header/Header'
import { Outlet } from 'react-router'


export default function DashboardEmp() {
  return (
  <div>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>  )
}
