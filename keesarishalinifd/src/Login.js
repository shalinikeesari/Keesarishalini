import React,{useState} from 'react'
import axios from 'axios'

function Login(){
    const[f,setF]=useState({email:'',password:''})

    const h=e=>{
        setF({...f,[e.target.name]:e.target.value})
    }

    const handleSubmit=async e=>{
        e.preventDefault()
        const res=await axios.post('http://localhost:5000/login',f)
        alert('Logged In Successfully')
        console.log(res.data)
    }

    return(
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={h}/><br/>
            <input type="password" name="password" placeholder="Password" onChange={h}/><br/>
            <button type="submit">Login</button>
        </form>
    )
}

export default Login