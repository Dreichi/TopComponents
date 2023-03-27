import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function NavbarComponent(props) {
    const { isLogged, setIsLogged } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        setIsLogged(false);
        sessionStorage.clear();
    };

    return (
        <nav className='nav'>
            <div className="container">
                <div className="nav__options--desktop">
                    <NavLink to="#" className="nav__option"><i className="fas fa-cart-shopping"></i> : 0</NavLink>
                    {isLogged ? (
                        <NavLink to="#" className="nav__option"><i className="fas fa-wallet"></i> : 0.00€</NavLink>
                        ) : null}
                </div>
                <div className="nav__container">
                    <div className="nav__brands">
                        <NavLink to="/" className="nav__brand">TopComponents</NavLink>
                        <button onClick={() => setIsOpen(!isOpen)} className="nav__collapse-button"><i className={`fas ${isOpen ? "fa-xmark" : "fa-bars"}`}></i></button>
                    </div>
                    <div className={`nav__links ${isOpen ? "nav__links--active" : ""}`}>
                        <div className="nav__links__wrapper">
                            <NavLink to="/" className="nav__link">Home</NavLink>
                            <NavLink to="/products" className="nav__link">Produits</NavLink>
                            <NavLink to="/contact" className="nav__link">Contact</NavLink>
                            {isLogged ? (
                                <NavLink to="/profil" className="nav__profile">👤</NavLink>
                            ) : null}
                        </div>
                        <div className="nav__options--mobile">
                            <NavLink to="#" className="nav__option"><i className="fas fa-cart-shopping"></i> : 0</NavLink>
                            <NavLink to="#" className="nav__option"><i className="fas fa-wallet"></i> : 0.00€</NavLink>
                        </div>
                        {isLogged ? (
                            <button onClick={handleLogout} className="nav__logout">Déconnexion</button>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    )
}
