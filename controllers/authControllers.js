const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Router} = require("express");
const app = Router();

const User = require("../model/user");

app.post("/register", async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        console.log(req.body);

        if (!(email && password && first_name && last_name)) {
            return res.status(400).send("All input is required");
        } else {
            const oldUser = await User.findOne({where: {email}});

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
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
            user.token = token;

            await user.save();

            res.status(201).send({msg: "Registration successful"});
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!(email && password)) {
        return res.status(400).send("All input is required");
    } else {
        const user = await User.findOne({where: {email}});

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.JWT_KEY,
                {
                    expiresIn: "2h",
                }
            );
            user.token = token;

            return res.status(200).json(user);
        }
        return res.status(400).send("Invalid Credentials");
    }
});

const auth = require("../middleware/auth");

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

module.exports = app;