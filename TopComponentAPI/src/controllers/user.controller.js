const { Op } = require('sequelize');
const User = require('../models/user.model');
const { generateJwt } = require('../utils/jwtHandler.utils');
const { encryptPassword, comparePassword } = require('../utils/passwordHandler.utils');

exports.SignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Requette invalide.'
            });
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: true,
                message: "Le format de l'adresse mail est incorrecte."
            });
        }

        const isUserExist = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        });

        if (isUserExist) {
            let errorMessage = '';
            if (isUserExist.username.toLowerCase === username.toLowerCase && isUserExist.email.toLowerCase === email.toLowerCase) {
                errorMessage = "Le nom d'utilisateur et l'adresse mail sont déjà utilisés."
            } else if (isUserExist.username.toLowerCase === username.toLowerCase) {
                errorMessage = "Le nom d'utilisateur est déjà utilisé."
            } else if (isUserExist.email.toLowerCase === email.toLowerCase) {
                errorMessage = "L'adresse email est déjà utilisée."
            }
            return res.status(400).json({
                error: true,
                message: errorMessage
            });

        }

        const encryptedPassword = await encryptPassword(password);

        const userData = {
            username: username,
            email: email,
            password: encryptedPassword,
            isActive: true,
            // emailVerificationCode: Math.floor(Math.random() * 1000000),
            // emailVerificationCodeExpiration: new Date(Date.now() + 15 * 60 * 1000)
        }
        // await sendMail("accountVerification", { code: code }, email);
        await new User(userData).save();

        return res.status(200).json({
            error: false,
            message: "Votre compte à bien été crée."
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}

exports.VerifyAccount = async (req, res) => {
    try {
        const { identifier, code } = req.body;

        if (!identifier || !code) {
            return res.status(400).json({
                error: true,
                message: "Requête invalide."
            });
        }

        let user;

        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm;

        if (emailRegex.test(identifier)) {
            user = await User.findOne({ where: { email: identifier } });
        } else {
            user = await User.findOne({ where: { username: identifier } });
        }

        if (!user) {
            return res.status(401).json({
                error: true,
                message: "L'utilisateur n'existe pas et/ou le code est incorrect."
            });
        }

        if (code !== user.emailVerificationCode) {
            return res.status(401).json({
                error: true,
                message: "L'utilisateur n'existe pas et/ou le code est incorrect."
            });
        }

        const expirationDate = user.emailVerificationCodeExpiration;

        if (expirationDate < new Date()) {
            return res.status(401).json({
                error: true,
                message: "Le code a expiré."
            });
        }

        const userData = {
            emailVerificationCode: null,
            emailVerificationCodeExpiration: null,
            isActive: true
        }

        await user.update(userData);
        return res.status(200).json({
            error: false,
            message: "Le compte a été vérifié avec succès."
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Une erreur interne est survenue, veuillez réessayer plus tard."
        });
    }
}

exports.ResendVerification = async (req, res) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({
                error: true,
                message: "Requête invalide."
            });
        }

        let user;

        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm;

        if (emailRegex.test(identifier)) {
            user = await User.findOne({ where: { email: identifier } });
        } else {
            user = await User.findOne({ where: { username: identifier } });
        }

        if (!user) {
            return res.status(401).json({
                error: true,
                message: "L'utilisateur n'existe pas et/ou le code est incorrect."
            });
        }
        // Vérifier si ça fait moins de 5 minutes
        const expirationDate = user.emailVerificationCodeExpiration.setTime(user.emailVerificationCodeExpiration - ((5 * 60) * 1000));

        if (expirationDate < new Date()) {
            return res.status(401).json({
                error: true,
                message: "Veuillez attendre 5 minutes avant d'envoyer un nouveau code."
            });
        }
        

        // Générer un code à 6 chiffres
        // const code = Math.floor(100000 + Math.random() * 900000);

        const userData = {
            emailVerificationCode: code,
            // Rajouter 15 minutes à la date actuelle
            emailVerificationCodeExpiration: new Date(Date.now() + 15 * 60 * 1000)
        }

        // Envoi de l'email de vérification
        await sendMail("accountVerification", { code: code }, email);

        await user.update(userData);
        return res.status(201).json({
            error: false,
            message: "Un nouveau code de vérification vient de vous être envoyé."
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Une erreur interne est survenue, veuillez réessayer plus tard."
        });
    }   
}

exports.SignIn = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                error: true,
                message: "Requête invalide."
            })
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

        let user;

        if (emailRegex.test(identifier)) {
            user = await User.findOne({ where: { email: identifier } });
        } else {
            user = await User.findOne({ where: { username: identifier } });
        }

        if (!user) {
            return res.status(401).json({
                error: true,
                message: "Le nom d'utilisateur et/ou le mot de passe est incorrect."
            })
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: true,
                message: "Le nom d'utilisateur et/ou le mot de passe est incorrect."
            })
        }

        if (!user.isActive) {
            return res.status(400).json ({
                error: true,
                message: "Le compte n'est pas activé"
            })
        }

        const accessToken = await generateJwt({
            username: user.username,
            email: user.email
        });

        await user.update({ accessToken: accessToken });
        return res.status(200).json({
            error: false,
            message: "Vous êtes connecté.",
            accessToken: accessToken
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: error
        });
    }
}