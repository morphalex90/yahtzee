import React from 'react';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';

const About = () => (
  <React.Fragment>
    <Header />
    <main>
      <div className="container">
        <h1 className="page-heaading"><span>About</span></h1>
        <p>This project as been developed by <a href="https://www.pieronanni.com">Piero Nanni</a></p>
      </div>
    </main>
    <Footer />
  </React.Fragment>
);

export default About;