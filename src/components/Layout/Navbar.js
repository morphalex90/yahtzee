import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => (
    <nav className="header__menu">
        <ul>
            <li><NavLink activeClassName="is-active" to='/' exact>Sessions</NavLink></li>
            <li><NavLink activeClassName="is-active" to='/about'>About</NavLink></li>
            <li><NavLink activeClassName="is-active" to='/rules'>Rules</NavLink></li>
        </ul>
    </nav>
);

export default Navbar;
