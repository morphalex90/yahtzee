import React from 'react';

import Header from './../Layout/Header';
import Footer from './../Layout/Footer';

import axios from 'axios';

import Pusher from 'pusher-js';

import API_URL from './../API_URL';

class Session extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        playersCount: null,
        players: [],
        playername: '',
        player_id: (document.cookie.indexOf('player_id=') !== -1 ? document.cookie.split('; ').find(row => row.startsWith('player_id')).split('=')[1]: ''),
        isLoading: true,
        message_status: '',
        message_text: '',
        hide_join_form: (document.cookie.indexOf('hide_join_form=') !== -1 ? document.cookie.split('; ').find(row => row.startsWith('hide_join_form')).split('=')[1]: false),
      };
    }
  
    componentDidMount() {
      this.getPlayers();

      ////// Pusher
      try {
        var pusher = new Pusher('1717a821a4ce3aea5ba0', { cluster: 'eu' });
        var channel = pusher.subscribe('session-'+this.props.match.params.session);

        channel.bind('player-join-session', data => { // player join session
          this.setState({ players: [...this.state.players, data.player], playersCount: this.state.playersCount+1 }); // add new player to the list and update the players counter
        });
 
        channel.bind('player-leave-session', data => { // player leave session
          let tempPlayers = this.state.players;
          for(var i=0; i<tempPlayers.length; i++) { // search player inside array of players
            if (parseInt(tempPlayers[i].id) === parseInt(data.player_id)) {
              tempPlayers.splice(i, 1);
            }
          }
          this.setState({ players: tempPlayers, playersCount: this.state.playersCount-1 }); // leave player from list and update the players counter
        });

      } catch (error) {
        console.error(error);
      }
    }
  
    async getPlayers() { // get list of players on page load
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
  
    playerSubmit = (e) => { // a new player wants to join this session
      this.setState({ isLoading: true });
      e.preventDefault();
      let data = new FormData(e.target);
      axios
      .post(API_URL+'/api/v1/yahtzee/session/player', data)
      .then((response) => {
        if( response.status === 200 ) {
          this.setState({ message_status: 'success', message_text: 'You are now added to the game', player_id: response.data.id, playername: '' ,hide_join_form: true }); //, () => this.getPlayers()
          document.cookie = 'player_id='+response.data.id+';max-age=604800';
          document.cookie = 'hide_join_form=true;max-age=604800';
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

    playerLeave = (e) => { // a player wants to leave this session
      this.setState({ isLoading: true });
      e.preventDefault();
      let player_id = e.target.player_id.value;
      let session_id = e.target.session_id.value;

      axios
      .post(API_URL+'/api/v1/yahtzee/session/'+session_id+'/player/'+player_id+'/leave')
      .then((response) => {
        if( response.status === 200 ) {
          this.setState({ message_status: 'success', message_text: 'You now left the session', hide_join_form: false });
          document.cookie = 'player_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          document.cookie = 'hide_join_form=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
                  <div className="session_players">
                    {this.state.players.map(player =>
                      <div key={player.id} className="session-players__player" data-status={player.status}>
                        <div className="session-players__player__name">{player.playername}</div>
                        <div className="session-players__player__points"> ,points: {player.points}</div>

                        {parseInt(this.state.player_id) === parseInt(player.id) &&
                          <React.Fragment>
                            <form className="session-players__leave" onSubmit={this.playerLeave}>
                              <input type="hidden" name="player_id" value={player.id} />
                              <input type="hidden" name="session_id" value={this.props.match.params.session} />
                              <button type="submit">Leave session</button>
                            </form>

                            <form className="session-players__ready" onSubmit={this.playerReady}>
                              <input type="hidden" name="player_id" value={player.id} />
                              <input type="hidden" name="session_id" value={this.props.match.params.session} />
                              <button type="submit">Ready to play!</button>
                            </form>
                          </React.Fragment>
                        }

                      </div>
                    )}
                  </div>
                </div>
              }

              {this.state.hide_join_form === false &&
                <div>
                  <h2>Join session</h2>
                  <form className="new-player" onSubmit={this.playerSubmit}>
                    <div><label><input type="text" onChange={this.onChange} maxLength="40" name="playername" value={this.state.playername} required />Player name</label></div>
                    <input type="hidden" name="session_id" value={this.props.match.params.session} />
                    <button type="submit">Join game</button>
                  </form>
                </div>
              }
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