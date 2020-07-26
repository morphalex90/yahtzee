import React from 'react';

import Header from './../Layout/Header';
import Footer from './../Layout/Footer';

import axios from 'axios';

// import { NavLink } from 'react-router-dom';

import Pusher from 'pusher-js';


import API_URL from './../API_URL';

class Session extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playersCount: null,
        players: [],
        playername: '',
        isLoading: true,
        message_status: '',
        message_text: '',
      };
    }
  
    componentDidMount() {
      this.getPlayers();

      ////// Pusher
      var pusher = new Pusher('1717a821a4ce3aea5ba0', { cluster: 'eu' });
      var channel = pusher.subscribe('session');
      channel.bind('player-join-session', function(data) {
        console.log(data);
      });
    }
  
    async getPlayers() {
    axios
      .get(API_URL+'/api/v1/yahtzee/session/'+this.props.match.params.session+'/players')
      .then((response) => {
        this.setState({ playersCount: response.data.count, players: response.data.players, isLoading: false });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false });
      });
    }
  
    onChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    }
  
    playerSubmit = (e) => {
      this.setState({ isLoading: true });
      e.preventDefault();
      let data = new FormData(e.target);
      axios
      .post(API_URL+'/api/v1/yahtzee/session/player', data)
      .then((response) => {
        if( response.status === 200 ) {
          this.setState({ message_status: 'success', message_text: 'New player added to the game', playername: '' }, () => this.getPlayers());
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) { 
          this.setState({ message_status: 'warning', message_text: error.response.data.playername[0] });
        } else {
          console.log(error);
          this.setState({ message_status: 'error', message_text: 'Something went bananas, contact the administrator' });
        }
        this.setState({ isLoading: false });
      });
    }
  
    render() {
      return (
        <React.Fragment>
            <Header />
            <main>
                <div className="container">
                    <h1 className="page-heaading"><span>Game #{this.props.match.params.session}</span></h1>
                    {this.state.playersCount !== null &&
                        <div>
                            <div>{this.state.playersCount} players</div>
                            <br />
                            <div className="players">
                              {this.state.players.map(player =>
                                  <div key={player.id} className="player">
                                      <div>Name: {player.playername}</div>
                                      <div>Points: {player.points}</div>
                                  </div>
                              )}
                            </div>
                        </div>
                    }

                    <h2>Join session</h2>
                    <form className="new-player" onSubmit={this.playerSubmit}>
                        <div><label><input type="text" onChange={this.onChange} maxLength="40" name="playername" value={this.state.playername} required />Player name</label></div>
                        <input type="hidden" name="session_id" value={this.props.match.params.session} />
                        <button type="submit">Join game</button>
                    </form>
                </div>
            </main>
            <Footer />
            {this.state.isLoading === true && <div className="loading"></div> }
            {this.state.message_status !== '' &&
                <div className={'message message__' + this.state.message_status}>
                    <div>{this.state.message_text}</div>
                </div>
            }
        </React.Fragment>
      );
  
    }
  }

export default Session;