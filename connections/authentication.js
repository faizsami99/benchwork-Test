const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";



const User = require('../connections/Users');

exports.registerHandle = (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        res.send("please enter all the field");
    }

    if (password != password2) {
        res.send("password doest match");
    }


    if (password.length < 8) {
        res.send("password must be greater then 8");
    }

    if (errors.length > 0) {
        res.render('signup');
    } else {

        User.findOne({ email: email }).then(user => {
            if (user) {
                res.send("Email Id already register");;
            } else {

                
                
                const CLIENT_URL = 'http://' + req.headers.host;
                const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '30m' });

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/auth/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `


                

                // let testAccount = nodemailer.createTestAccount();

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        // user: testAccount.user,
                        // pass: testAccount.pass,
                        user:  process.env.EMAIL_ID,
                        pass: process.env.PASSWORD

                    }, 
                });

                
                const mailOptions = {
                    from: '"Faiz Sami" <faizsami59@gmail.com>', 
                    to: email, 
                    subject: "Account Verification: NodeJS Auth ✔", 
                    generateTextFromHTML: true,
                    html: output, 
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.send("Something went wrong on our end. Please register again.");
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        res.send("Activation link sent to email ID. Please activate to log in");
                    }
                })

            }
        });
    }
}


exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                res.send("Incorrect or expired link! Please register again.");
            }
            else {
                const { name, email, password } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        res.send('email Already register');
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        res.redirect('/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    }
    else {
        console.log("Account activation error!")
    }
}


exports.loginHandle = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/'
    })(req, res, next);
}