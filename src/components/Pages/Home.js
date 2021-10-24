import React from 'react';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';

import axios from 'axios';

import { NavLink } from 'react-router-dom';

import Pusher from 'pusher-js';

import API_URL from './../API_URL';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionCount: null,
      sessions: [],
      partecipants_max_number: 0,
      name: '',
      isLoading: true,
      message_status: '',
      message_text: '',
    };
  }

  componentDidMount() {
    this.getSessions();

    //// Pusher
    // Pusher.logToConsole = true;
    var pusher = new Pusher('1717a821a4ce3aea5ba0', { cluster: 'eu' });
    var channel = pusher.subscribe('sessions');
    channel.bind('create-session', data => {
      this.setState({ sessions: [...this.state.sessions, data.message], sessionCount: this.state.sessionCount + 1 }); // add new player to the list and update the players counter
    });
  }

  async getSessions() {
    try {
      let response = await fetch(API_URL + '/api/v1/yahtzee/sessions');
      let responseJson = await response.json();
      this.setState({ sessionCount: responseJson.count, sessions: responseJson.sessions, isLoading: false });
    } catch (error) {
      console.error(error);
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  // onOpenOptions = (e) => {
  //   const options_open = this.state.options_open;
  //   this.setState({ options_open: !options_open });
  // }

  sessionSubmit = (e) => {
    this.setState({ isLoading: true });
    e.preventDefault();
    let data = new FormData(e.target);
    axios
      .post(API_URL + '/api/v1/yahtzee/session', data)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ message_status: 'success', message_text: 'New session created', partecipants_max_number: 0, name: '' }, () => this.getSessions());
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          let message = (error.response.data.partecipants_max_number ? error.response.data.partecipants_max_number[0] : error.response.data.name[0]);
          this.setState({ message_status: 'warning', message_text: message });
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
            <h1 className="page-heaading"><span>List of sessions</span></h1>
            {this.state.sessionCount !== null &&
              <div>
                <div>{this.state.sessionCount} sessions</div>
                <br />
                <div className="sessions">
                  {this.state.sessions.map(session =>
                    <div key={session.id} className="session" data-status={session.status}>
                      <NavLink to={'/session/' + session.id}>Enter session {session.name ? session.name : session.id}</NavLink>
                      <div className="session__partecipants_max_number">users: XX / {session.partecipants_max_number !== 0 ? session.partecipants_max_number : '∞'}</div>
                    </div>
                  )}
                </div>
              </div>
            }

            <form className="new-session" onSubmit={this.sessionSubmit}>
              <div><label><input type="number" onChange={this.onChange} min="0" max="50" name="partecipants_max_number" value={this.state.partecipants_max_number} />Max number - leave 0 to not set a limit</label></div>
              <div><label><input type="text" onChange={this.onChange} maxLength="40" name="name" value={this.state.name} />Session name</label></div>
              <button type="submit">Create new session</button>
            </form>
          </div>
        </main>
        <Footer />
        {this.state.isLoading === true && <div className="loading"></div>}
        {this.state.message_status !== '' &&
          <div className={'message message__' + this.state.message_status}>
            <div>{this.state.message_text}</div>
          </div>
        }
      </React.Fragment>
    );

  }
}

export default Home;