import {  FormEvent } from 'react'
import './App.css'
import axios from 'axios';
function Login() {
  async function handleSubmit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const values: { [key: string]: string } = {};

    data.forEach((value, key) => {
      values[key] = value.toString();
    });
    const result = await axios.post('http://localhost:5000/login',values)
    if(result.data?.token){
      // store ke localstorage
      localStorage.setItem('token',result.data.token)
      // redirect / reload page
      window.location.href='/'
    }
  }
  return (
    <div>
      <p>Login/Signup</p>
      <form style={{display:'flex', flexDirection:'column', gap:'12px'}} onSubmit={handleSubmit}>
        <input placeholder="email" name="email" />
        <input placeholder="password" name="password" />
        <input type="submit"/>
      </form>
    </div>
  )
}

export default Login
