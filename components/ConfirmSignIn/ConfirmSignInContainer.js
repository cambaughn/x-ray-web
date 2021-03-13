import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import ConfirmSignIn from './ConfirmSignIn';

// Utility Functions
import { setUser } from '../../redux/actionCreators';


class ConfirmSignInContainer extends Component {

  render() {
    return (
      <ConfirmSignIn user={this.props.user} setUser={this.props.setUser} />
    );
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
)(ConfirmSignInContainer);
