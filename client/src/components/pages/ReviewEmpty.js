import React from "react";
import AppTemplate from "../ui/AppTemplate";

import { connect } from "react-redux";
import actions from "../../store/actions";

class ReviewEmpty extends React.Component {
  goToPrevCard() {
    this.props.dispatch({ type: actions.DECREMENT_QUEUE_INDEX });
    this.props.history.push("/review-answer");
  }

  getMoreCards() {
    this.props.dispatch({ type: actions.RESET_QUEUE }); // reset cards
    this.props.history.push("/review-imagery"); // go to review imagery page
  }

  render() {
    return (
      <AppTemplate>
        <div>
          <h4 className="my-4 text-center text-muted">Out of cards</h4>
          {this.props.queue.index > 0 && ( // only show button if index of queue array is > 0
            <button
              className="btn btn-link mt-2"
              onClick={() => {
                this.goToPrevCard();
              }}
            >
              Previous card
            </button>
          )}
          <button
            to="/review-imagery"
            className="btn btn-lg btn-outline-primary float-right mt-3"
            onClick={() => {
              this.getMoreCards();
            }}
          >
            Get more cards
          </button>
        </div>
      </AppTemplate>
    );
  }
}
function mapStateToProps(state) {
  // map state to props in local component
  return {
    queue: state.queue,
  };
}
export default connect(mapStateToProps)(ReviewEmpty);
