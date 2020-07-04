import React from 'react';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';

const Home = () => (
    <React.Fragment>
        <Header />
        <main>
            <div className="container">
                <div>List of sessions</div>
            </div>
        </main>
        <Footer />
  </React.Fragment>
);

export default Home;