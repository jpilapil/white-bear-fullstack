import React from "react";
import thumbsUpIcon from "../../icons/thumbs-up.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";

class ReviewAnswer extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.queue.cards.length === 0) {
      this.props.history.push("/review-empty");
    }
  }

  updateCardWithNeedsWork(memoryCard) {
    this.goToNextCard();
  }

  updateCardWithGotIt(memoryCard) {
    // update properties
    memoryCard.totalSuccessfulAttempts += 1;
    memoryCard.lastAttemptAt = Date.now();
    const queue = { ...this.props.queue };
    queue.cards[this.props.queue.index] = memoryCard;
    // update global state
    this.props.dispatch({
      type: actions.UPDATE_QUEUED_CARD,
      payload: queue,
    });
    // db PUT card in axios req
    // TODO: on success, fire overlay
    // TODO: on error, fire overlay
    this.goToNextCard();
  }

  goToNextCard() {
    // if queue is empty, go to out of cards page
    // you're on the last card
    if (this.props.queue.index === this.props.queue.cards.length - 1) {
      this.props.dispatch({ type: actions.INCREMENT_QUEUE_INDEX }); // you still want to increment, because you still need to decrement with the previous card button on the out of cards page
      this.props.history.push("/review-empty");
    } else {
      // if queue is not empty, go to next card
      this.props.dispatch({ type: actions.INCREMENT_QUEUE_INDEX });
      this.props.history.push("/review-imagery");
    }
  }

  storeEditableCard(memoryCard) {
    this.props.dispatch({
      type: actions.STORE_EDITABLE_CARD,
      payload: {
        card: memoryCard,
        prevRoute: "/review-answer",
      },
    });
  }

  render() {
    const memoryCard = { ...this.props.queue.cards[this.props.queue.index] }; // get all the cards from the queue and use bracket notation to find the index of the current card
    return (
      <AppTemplate>
        <div className="mb-5"></div>
        {/* Card  */}
        <div className="mb-5">
          <div className="card bg-primary">
            <div className="card-body">{memoryCard && memoryCard.imagery}</div>
          </div>

          <div className="card bg-secondary">
            <div className="card-body">{memoryCard && memoryCard.answer}</div>
          </div>
        </div>
        {/* buttons */}
        <Link
          to="/edit"
          className="btn btn-link"
          onClick={() => {
            this.storeEditableCard(memoryCard);
          }}
        >
          Edit
        </Link>
        <div className="float-right">
          <button
            className="btn btn-outline-primary mr-4"
            onClick={() => {
              this.updateCardWithNeedsWork(memoryCard); // on click, run this function
            }}
          >
            Needs Work
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.updateCardWithGotIt(memoryCard);
            }}
          >
            <img
              alt=""
              src={thumbsUpIcon}
              width="20px"
              style={{ marginBottom: "5px" }}
              className="mr-2"
            />
            Got it
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
export default connect(mapStateToProps)(ReviewAnswer);
