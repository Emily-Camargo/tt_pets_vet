import React from 'react'
import NavbarComponent from './components/navbar'
import SidebarComponent from './components/sidebar'

const Navbar = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <NavbarComponent open={open} setOpen={setOpen} />
      <SidebarComponent open={open} setOpen={setOpen} />
    </>
  )
}
export default React.memo(Navbar)
