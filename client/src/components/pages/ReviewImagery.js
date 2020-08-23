import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";

class ReviewImagery extends React.Component {
  constructor(props) {
    super(props);

    // if length of cards array is 0 (empty), get more cards
    if (props.queue.cards.length === 0) {
      console.log("empty array queue cards");
      // Make a request for a user with a given ID
      axios
        .get(`/api/v1/queue`)
        .then((res) => {
          // handle success
          console.log(res);
          props.dispatch({
            type: actions.STORE_QUEUED_CARDS,
            payload: res.data,
          }); // payload = all of our data(array of objects)
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    }

    if (props.queue.index > props.queue.cards.length) {
      this.props.history.push("/review-empty");
    }
  }

  goToPrevCard() {
    this.props.dispatch({ type: actions.DECREMENT_QUEUE_INDEX });
    this.props.history.push("/review-answer");
  }

  render() {
    const memoryCard = this.props.queue.cards[this.props.queue.index]; // get all the cards from the queue and use bracket notation to find the index of the current card
    return (
      <AppTemplate>
        <div>
          <div className="mb-5 mt-3">
            <div className="card bg-primary">
              <div className="card-body">
                {memoryCard && memoryCard.imagery}
              </div>
            </div>
          </div>
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

          <div className="float-right mt-2 ml-5">
            <Link
              to="/review-answer"
              className="btn btn-lg btn-outline-primary mr-0"
            >
              Show answer
            </Link>
          </div>
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
export default connect(mapStateToProps)(ReviewImagery);
