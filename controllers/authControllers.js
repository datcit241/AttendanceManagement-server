const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Router} = require("express");
const app = Router();

const dataContext = require("../models");
const User = dataContext["User"];

const getUserDTO = (user) => {
    return {email: user.email, firstName: user.firstName, lastName: user.lastName}
}

app.post("/register", async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        console.log(req.body);

        if (!(email && password && first_name && last_name)) {
            return res.status(400).send({msg: "All input is required"});
        } else {
            const oldUser = await User.findOne({where: {email}});

            if (oldUser) {
                return res.status(409).send({msg: "User Already Exist. Please Login"});
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                firstName: first_name,
                lastName: last_name,
                email: email.toLowerCase(),
                password: encryptedPassword,
            });

            const token = await jwt.sign(
                {user_id: user.id, email},
                process.env.JWT_KEY,
                {
                    expiresIn: "2h",
                }
            );

            res.status(201).send({
                msg: "Registration successful",
                user: {...getUserDTO(user), token}
            });
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!(email && password)) {
        return res.status(400).send({msg: "All input is required"});
    } else {
        const user = await User.findOne({where: {email}});

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {user_id: user.id, email},
                process.env.JWT_KEY,
                {
                    expiresIn: "2h",
                }
            );

            return res.status(200).send({user: {...getUserDTO(user), token}});
        }
        return res.status(400).send({msg: "Invalid Credentials"});
    }
});

const auth = require("../middleware/auth");

app.post("/welcome", auth, async (req, res) => {
    res.status(200).send({msg: "Welcome 🙌"});
});

app.get("/current-user", auth, async (req, res) => {
    const user = await User.findOne({where: {email: req.user.email}});
    res.send({user});
})

module.exports = app;