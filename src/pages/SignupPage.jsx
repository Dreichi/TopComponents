import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignupPage(props) {
    const { notify } = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [username, setUsername] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [adress, setAdress] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            notify("Les mots de passe ne correspondent pas", "warning");
            return;
        }

        const userData = {
            email: email,
            password: password,
            username: username,
            phonenumber: phonenumber,
            adress : adress,
        }

        if (Object.values(userData).includes("")) {
            notify("Veuillez remplir tous les champs", "warning");
            return;
        }

        notify("Inscription en cours...", "info");

        // Envoi des données au serveur
        axios("http://localhost:3030/user/signup", {
            method: "POST",
            data: userData,
        }).then((res) => {
            console.log(res);
            notify("Inscription réussie", "success");
            
            setUsername("");
            setPassword("");
            setPasswordConfirm("");
            setEmail("");
            setPhonenumber("");
            setAdress("");
            navigate("/signin");
        }).catch((err) => {
            notify(`Une erreur est survenue ${err?.response?.data?.message || ""}`, "error");
        });
    }

    return (
        <div className="form">
            <div className="signup">
                <h1 className="signup__title">Inscription</h1>
                <form onSubmit={handleSubmit} className="signup__form">
                    <div className="signup__form__group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="signup__form__group">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="signup__form__group">
                        <label htmlFor="passwordConfirm">Confirmer le mot de passe</label>
                        <input type="password" id="passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                    </div>
                    <div className="signup__form__group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="signup__form__group">
                        <label htmlFor="phonenumber">Numéro de téléphone</label>
                        <input type="text" id="phonenumber" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />
                    </div>
                    <div className="signup__form__group">
                        <label htmlFor="adress">Adresse</label>
                        <input type="text" id="adress" value={adress} onChange={(e) => setAdress(e.target.value)} />
                    </div>
                    <button type="submit" className="signup__form__submit">S'inscrire</button>
                </form>
            </div>
        </div>
    
    )
}