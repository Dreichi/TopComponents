import React from "react";
import { NavLink } from 'react-router-dom';

export default function HeaderComponent() {
    return (
        <header>
            <div className="container">
                <div className="header">
                    <NavLink to="/signup" className="header__signup">INSCRIPTION</NavLink>
                    <NavLink to="/contact" className="header__contact">CONTACT</NavLink>
                </div>
            </div>
        </header>
    )
}