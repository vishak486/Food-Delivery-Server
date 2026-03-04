const roleMiddleware=(allowedRoles)=>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.role))
        {
            return res.status(403).json("Access Denied")
        }
        next()
    }
}

module.exports = roleMiddleware