import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom'
import './App.css'
import Login from './Login';
import Home from './Home';
import { useEffect } from 'react';
import axios from 'axios';

const currentToken = localStorage.getItem('token') || ''

export function PrivateRoute(){
  return currentToken?<Outlet/>:<Login/>
}

function App() {
  useEffect(()=>{
    async function authService() {
      try {
        const result = currentToken?await axios.get('http://localhost:5000/authService',{
          params:{token:currentToken}
        }):{data:''}
        console.log(result.data)
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    authService()
  },[currentToken])
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute/>}>
          <Route path='/' element={<Home/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
