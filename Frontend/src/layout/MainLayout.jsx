import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/headers/Navbar"
import Footer from "../pages/Home/Footer/Footer"

const MainLayout = () => {
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <main className='overflow-hidden dark:bg-black'>
      {!isAuthPage && <Navbar />}
      <Outlet />
      {!isAuthPage && <footer><Footer /></footer>}
    </main>
  )
}

export default MainLayout
