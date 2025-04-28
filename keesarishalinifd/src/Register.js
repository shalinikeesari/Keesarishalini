import React,{useState} from 'react'
import axios from 'axios'

function Register(){
    const[f,setF]=useState({full_name:'',email:'',phone_number:'',college_name:'',college_id:''})
    const[pic,setPic]=useState(null)
    const[idcard,setIdcard]=useState(null)

    const h=e=>{
        setF({...f,[e.target.name]:e.target.value})
    }

    const handleSubmit=async e=>{
        e.preventDefault()
        const data=new FormData()
        Object.keys(f).forEach(k=>data.append(k,f[k]))
        data.append('profile_picture',pic)
        data.append('college_id_card',idcard)
        await axios.post('http://localhost:5000/register',data)
        alert('Registered Successfully')
    }

    return(
        <form onSubmit={handleSubmit}>
            <input type="text" name="full_name" placeholder="Full Name" onChange={h}/><br/>
            <input type="email" name="email" placeholder="Email" onChange={h}/><br/>
            <input type="text" name="phone_number" placeholder="Phone Number" onChange={h}/><br/>
            <input type="text" name="college_name" placeholder="College Name" onChange={h}/><br/>
            <input type="text" name="college_id" placeholder="College ID" onChange={h}/><br/>
            <input type="file" onChange={e=>setPic(e.target.files[0])}/><br/>
            <input type="file" onChange={e=>setIdcard(e.target.files[0])}/><br/>
            <button type="submit">Register</button>
        </form>
    )
}

export default Register