const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const jwt =  require('jsonwebtoken')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
app.use(bodyparser.json())
app.use(cors())
app.get('/', (req,res)=>{ res.send('Welcome to Web Req')})
function midleware(req,res,next){
 // ini midlewre
 if(req.headers?.webreq==='secret key') return next()
 return res.json('stuck di midleware')
}

app.get('/getData',midleware,(req,res)=>{
    res.json('ok ini data')
})

app.post('/login',async(req,res)=>{
    const {email,password} = req.body
    console.log(req.body)
    const check = await prisma.user.findUnique({where:{email:email}}) 
    const token = jwt.sign({email},process.env.PRIVATE_KEY,{expiresIn:'20s'})
    if(check){
        if(check.password===password){
            // update token ke database
            // await prisma.user.update({where:{email:email},data:{token:token}})
            return res.json({token:token})
        }
    }
    await prisma.user.create({data:{...req.body,token:token}})
    // await prisma.user.update({where:{email:email},data:{token:token}})
    return res.json({token:token})
})
app.get('/authService', (req,res)=>{
    const {token} = req.query
    jwt.verify(token,process.env.PRIVATE_KEY,(err)=>{
        if (err) {
            if(err.name==='TokenExpiredError'){
                return res.status(401).json({message: 'Token Expired'})
            }
            return res.status(500).json({message:'Failed'})
        }
        return res.json({token})
    })
 })

app.listen(5000,()=>{
    console.log('listening port 5000')
})
