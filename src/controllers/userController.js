import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userController = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body

            const user = await userModel.findOne({ email })
            if (user) return res.status(400).json({ msg: "The email already exists." })

            if (password.length > 6) return res.status(400).json({ msg: "Password too long." })

            //Password encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new userModel({
                firstName, lastName, email, password: passwordHash
            })

            //Save to MongoDB
            await newUser.save()

            //JWT creation for authentication
            const accestoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accestoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await userModel.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." })

            //If login success, create access and refresh token

            const accestoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accestoken })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out!"})
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {

        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ msg: "Please login or register." })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login or register." })

                const accestoken = createAccessToken({ id: user.id })

                res.json({ accestoken })
            })

            res.json({ rf_token })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }


    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

export default userController