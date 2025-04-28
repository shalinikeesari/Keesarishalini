const express=require('express')
const app=express()
const cors=require('cors')
const mysql=require('mysql2')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const multer=require('multer')
const nodemailer=require('nodemailer')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'your_mysql_password',
    database:'online_test_portal'
})

// Random password generator
function generatePassword(length){
    const chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let password=''
    for(let i=0;i<length;i++)password+=chars[Math.floor(Math.random()*chars.length)]
    return password
}

// Multer setup for file upload
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'-'+file.originalname)
    }
})
const upload=multer({storage:storage})

// Nodemailer setup
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

// Registration route
app.post('/register',upload.fields([{name:'profile_picture'},{name:'college_id_card'}]),async(req,res)=>{
    const{full_name,email,phone_number,college_name,college_id}=req.body
    const password=generatePassword(8)
    const hashedPassword=await bcrypt.hash(password,10)

    const profilePic=req.files['profile_picture'][0].filename
    const collegeIdCard=req.files['college_id_card'][0].filename

    db.query('INSERT INTO users (full_name,email,password,phone_number,college_name,college_id,profile_picture,college_id_card) VALUES (?,?,?,?,?,?,?,?)',
    [full_name,email,hashedPassword,phone_number,college_name,college_id,profilePic,collegeIdCard],(err,result)=>{
        if(err)return res.status(500).send(err)
        
        transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:'Registration Successful',
            text:Hello ${full_name},\nYour account has been created.\nYour Password: ${password}\n\nThank you.
        })
        res.send('User Registered Successfully!')
    })
})

// Login route
app.post('/login',(req,res)=>{
    const{email,password}=req.body
    db.query('SELECT * FROM users WHERE email=?',[email],async(err,results)=>{
        if(err)return res.status(500).send(err)
        if(results.length==0)return res.status(400).send('User not found')

        const user=results[0]
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch)return res.status(400).send('Incorrect password')

        const token=jwt.sign({id:user.user_id},'secret_key',{expiresIn:'1h'})
        res.json({token,user})
    })
})

app.listen(5000,()=>console.log('Server running on port 5000'))