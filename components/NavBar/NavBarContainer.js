import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import NavBar from './NavBar';

// Utility Functions
import { setUser } from '../../redux/actionCreators';


class NavBarContainer extends Component {
  render() {
    return (
      <NavBar user={this.props.user} />
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
)(NavBarContainer);
