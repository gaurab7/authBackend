import validator from 'validator'
//could have used JOI or YUP but would have been overkill and Regex is just tedious


export function reqValidator(req, res, next) {
    const { email, password, username } = req.body
    if(!validator.isEmail(email))//validator built-in function complies with RMC smth email format
    {
        return res.status(400).json({ error: "Invalid email format" })
    }
    else if(validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(username)) {
        return res.status(400).json({error : "You must input all fields"})

    }
    else{
        console.log('Request Verified')
        next()
    }
}




