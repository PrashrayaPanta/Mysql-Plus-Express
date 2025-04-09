import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();
export const isLogin = (req, res, next) =>{

    //get token from cookies


    //get token from the headers
    const token = req.cookies.authToken;

    console.log(token);
    
    
    if (!token) return res.status(401).json({ message: "Not Login or Token Expired" });
    //verify token

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if(err){
            return false;
        }else{
            return decoded;

        }
      
    })

    if(verifyToken){

        req.user_id = verifyToken.id;

        next();

    }else{

        return res.status(401).json({ message: 'Token  is tempered' });
    }


}