import React from "react";
import thumbsUpIcon from "../../icons/thumbs-up.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";

class ReviewAnswer extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.queue.cards.length === 0) {
      this.props.history.push("/review-empty");
    }
  }

  updateCardWithNeedsWork(memoryCard) {
    const newMemoryCard = { ...memoryCard };
    // update properties
    newMemoryCard.totalSuccessfulAttempts = 0;
    newMemoryCard.lastAttemptAt = Date.now();
    // db PUT card in axios req
    axios
      // post creatableCard obj in redux store
      .put(`/api/v1/memory-cards/${newMemoryCard.id}`, newMemoryCard)
      .then(() => {
        console.log("Memory Card updated!");
        this.goToNextCard();
      })
      .catch((err) => {
        const { data } = err.response;
        console.log(data);
        // display error overlay & hide error overlay after 5 sec
      });
  }

  updateCardWithGotIt(memoryCard) {
    const newMemoryCard = { ...memoryCard };
    // update properties
    newMemoryCard.totalSuccessfulAttempts += 1;
    newMemoryCard.lastAttemptAt = Date.now();
    // db PUT card in axios req
    axios
      // post creatableCard obj in redux store
      .put(`/api/v1/memory-cards/${newMemoryCard.id}`, newMemoryCard)
      .then(() => {
        console.log("Memory Card updated!");
        this.goToNextCard();
      })
      .catch((err) => {
        const { data } = err.response;
        console.log(data);
        // display error overlay & hide error overlay after 5 sec
      });
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
    const memoryCard = this.props.queue.cards[this.props.queue.index]; // get all the cards from the queue and use bracket notation to find the index of the current card
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
