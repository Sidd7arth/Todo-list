// import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Users from './Users'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import LoginPage from './pages/loginpage'
import Register from './pages/Register'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/' element={<Users/>}></Route>
          <Route path='/createUser' element={<CreateUser/>}></Route>
          <Route path='/updateUser/:id' element={<UpdateUser/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App