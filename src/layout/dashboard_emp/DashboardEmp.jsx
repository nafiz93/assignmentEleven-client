import React from 'react'
import Footer from '@/pages/Shared/footer/Footer'
import { Outlet } from 'react-router'
import EmpHeader from '@/pages/Shared/header/EmployeeHeader/EmpHeader'


export default function DashboardEmp() {
  return (
  <div>
      <EmpHeader></EmpHeader>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>  )
}
