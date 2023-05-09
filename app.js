require("dotenv").config();
// require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("./config/mysql");

const app = express();

app.use(express.json());


module.exports = app;

const User = require("./model/user");

app.post("/register", async (req, res) => {

    try {
        const {first_name, last_name, email, password} = req.body;

        if (!(email && password && first_name && last_name)) {
            return res.status(400).send("All input is required");
        } else {
            mysql.query(
                `SELECT *
                 FROM users
                 WHERE email = ${mysql.escape(email)}`,
                async (err, result) => {
                    if (err) {
                        return res.status(400).send({msg: err});
                        throw err;
                    } else if (result?.length) {
                        return res.status(409).send({msg: "User Already Exist. Please Login"});
                    } else {
                        const encryptedPassword = await bcrypt.hash(password, 10);
                        mysql.query(
                            `INSERT INTO users (email, password, first_name, last_name)
                             VALUES (${mysql.escape(email)}, ${mysql.escape(encryptedPassword)},
                                     ${mysql.escape(first_name)}, ${mysql.escape(last_name)})`,
                            (err, result) => {
                                if (err) {
                                    return res.status(400).send({msg: err});
                                } else {
                                    return res.status(200).send({msg: "Registration successful."});
                                }
                            }
                        )
                    }
                }
            )

            // const oldUser = await User.findOne({ email });
            //
            // if (oldUser) {
            //   return res.status(409).send("User Already Exist. Please Login");
            // }
            //
            // const encryptedPassword = await bcrypt.hash(password, 10);
            //
            // const user = await User.create({
            //   first_name,
            //   last_name,
            //   email: email.toLowerCase(),
            //   password: encryptedPassword,
            // });
            //
            // const token = jwt.sign(
            //   { user_id: user._id, email },
            //   process.env.JWT_KEY,
            //   {
            //     expiresIn: "2h",
            //   }
            // );
            // user.token = token;

            // res.status(201).send({msg: "Registration successful"});
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
        mysql.query(
            `SELECT *
             FROM users
             WHERE email = ${mysql.escape(email)}`,
            async (err, result) => {
                if (err) {
                    return res.status(400).send({msg: err});
                    throw err;
                } else if (result?.length && (await bcrypt.compare(password, result[0]["password"]))) {
                    console.log(result);

                    const user = result[0];

                    const token = jwt.sign(
                        {user_id: result[0].id, email},
                        process.env.JWT_KEY,
                        {
                            expiresIn: "2h",
                        }
                    );

                    user.token = token;
                    console.log(user);

                    return res.status(200).json(user);
                } else {
                    return res.status(401).send({msg: "Invalid credentials"});
                }
            }
        )
    }

    // const user = await User.findOne({ email });
    //
    // if (user && (await bcrypt.compare(password, user.password))) {
    //   const token = jwt.sign(
    //     { user_id: user._id, email },
    //     process.env.JWT_KEY,
    //     {
    //       expiresIn: "2h",
    //     }
    //   );
    //   user.token = token;
    //
    //   return res.status(200).json(user);
    // }
    // return res.status(400).send("Invalid Credentials");
});

const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});
