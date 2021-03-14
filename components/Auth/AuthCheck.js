import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components


// Utility Functions
import { setUser } from '../../redux/actionCreators';
import { localStorageKeys } from '../../util/localStorage';
import userAPI from '../../util/api/user';
import firebase from 'firebase';


class AuthCheck extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // Default loading state to true
      loading: true
    }
  }

  componentDidMount = () => {
    if (!this.props.user.email) {
      this.checkUserLogin();
    } else { // user already exists in redux, go ahead and stop loading
      this.setState({ loading: false });
    }
  }

  checkUserLogin = () => {
    // Check auth state from firebase
    firebase.auth().onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // User is signed in.
        let user = await userAPI.get(userAuth.email);
        console.log('found user!~!! ', user.email);
        this.props.setUser(user)
      } else {
        console.log('no user');
      }

      this.setState({ loading: false });
    });
  }

  render() {
    if (!this.state.loading) {
      return (
        <>
          {this.props.children}
        </>
      )
    } else {
      return (
        <div>

        </div>
      )
    }
  }
}




const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthCheck);
