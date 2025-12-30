import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next)=>{
    const token = req.cookies.token;

    if(!token) {
        console.log("No token found");
        console.log("CN NO TOKEN FOUND");
        
        return res.status(401).json({message:"Not Authenticated!"});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, payload)=>{
        if(err){
            return res.status(403).json({message: "Token is not Valid!"});
        }
        req.userId = payload.id;
        next();
    })
}