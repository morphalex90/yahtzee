import React from 'react';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';

const Rules = () => (
  <React.Fragment>
    <Header />
    <main>
      <div className="container">
        <h1 className="page-heaading"><span>Rules</span></h1>
        <p>The object of Yahtzee is to obtain the highest score from throwing 5 dice.</p>
        <p>The game consists of 13 rounds. In each round, you roll the dice and then score the roll in one of 13 categories. You must score once in each category. The score is determined by a different rule for each category.</p>
        <p>The game ends once all 13 categories have been scored.</p>
      </div>
    </main>
    <Footer />
  </React.Fragment>
);

export default Rules;