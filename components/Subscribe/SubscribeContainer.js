import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import Subscribe from './Subscribe';

// Utility Functions
import { setCard } from '../../redux/actionCreators';


class SubscribeTemplate extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <Subscribe />
    );
  }
}




const mapStateToProps = state => {
  return {
    user: state.user,
    card: state.card
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCard: card => dispatch(setCard(card))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribeTemplate);
