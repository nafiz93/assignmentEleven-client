import Footer from '@/pages/Shared/footer/Footer'
import Header from '@/pages/Shared/header/Header'
import Hrheader from '@/pages/Shared/HrHeader/Hrheader'
import React from 'react'
import { Outlet } from 'react-router'

export default function DashboardHr() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hrheader></Hrheader>
     <main className='flex-1'>
       <Outlet></Outlet>
     </main>
      <Footer></Footer>
    </div>
  )
}
