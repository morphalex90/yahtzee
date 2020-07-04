import React from 'react';
// import logo from './../../img/logo.svg';

import Navbar from './../Layout/Navbar';

import { Link } from 'react-router-dom';

export const Header = () => (
    <header className="header">
        <div className="container header__inner">
            <div className="header__logo">
                <Link to='/'>Yahtzee</Link>
            </div>
            <Navbar />
        </div>
    </header>
);

export default Header;
