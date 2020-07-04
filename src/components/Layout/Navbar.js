import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => (
    <nav class="header__menu">
        <ul>
            <li><Link to='/' key={1}>Sessions</Link></li>
            <li><Link to='/about' key={9999}>About</Link></li>
        </ul>
    </nav>
);

export default Navbar;
