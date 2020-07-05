import React from 'react';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';

const Home = () => (
    <React.Fragment>
        <Header />
        <main>
            <div className="container">
                <h1 className="page-heaading"><span>List of sessions</span></h1>
            </div>
        </main>
        <Footer />
  </React.Fragment>
);

export default Home;