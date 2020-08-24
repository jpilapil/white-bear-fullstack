import React from "react";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import saveIcon from "../../icons/save.svg";
import toDisplayDate from "date-fns/format";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import without from "lodash/without";
import actions from "../../store/actions";
import axios from "axios";

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answerText: this.props.editableCard.card.answer,
      imageryText: this.props.editableCard.card.imagery,
      isDeleteChecked: false,
    };
  }

  checkHasInvalidCharCount() {
    if (
      this.state.answerText.length > MAX_CARD_CHARS ||
      this.state.answerText.length === 0 ||
      this.state.imageryText.length > MAX_CARD_CHARS ||
      this.state.imageryText.length === 0
    ) {
      return true;
    } else return false;
  }

  setImageryText(e) {
    this.setState({ imageryText: e.target.value });
  }

  setAnswerText(e) {
    this.setState({ answerText: e.target.value });
  }

  showDeleteButton() {
    this.setState({ isDeleteChecked: !this.state.isDeleteChecked });
  }

  saveCard() {
    if (!this.checkHasInvalidCharCount()) {
      // get answerText from state
      // get imageryText from state
      // put into db
      const memoryCard = { ...this.props.editableCard.card };
      memoryCard.answer = this.state.answerText;
      memoryCard.imagery = this.state.imageryText;
      // db PUT card in axios req
      axios
        // post creatableCard obj in redux store
        .put(`/api/v1/memory-cards/${memoryCard.id}`, memoryCard)
        .then(() => {
          console.log("Memory Card saved!");
          // update redux queue
          const cards = [...this.props.queue.cards];
          cards[this.props.queue.index] = memoryCard;
          this.props.dispatch({
            type: actions.UPDATE_QUEUED_CARDS,
            payload: cards,
          });
          // on success:
          this.props.history.push(this.props.editableCard.prevRoute);
        })
        .catch((err) => {
          const { data } = err.response;
          console.log(data);
          // display error overlay & hide error overlay after 5 sec
        });
    }
  }

  deleteCard() {
    const memoryCard = { ...this.props.editableCard.card };
    // query db to delete card
    axios
      .delete(`/api/v1/memory-cards/${memoryCard.id}`)
      .then((res) => {
        console.log(res.data);
        const deletableCard = this.props.editableCard.card;
        console.log("deletableCard: ", deletableCard);
        const cards = this.props.queue.cards;
        console.log("cards: ", cards);
        const filteredCards = without(cards, deletableCard);
        console.log("filteredCards: ", filteredCards);
        this.props.dispatch({
          type: actions.UPDATE_QUEUED_CARDS,
          payload: filteredCards,
        });
        // TODO: Display success overlay
        if (this.props.editableCard.prevRoute === "/review-answer") {
          if (filteredCards[this.props.queue.index] === undefined) {
            this.props.history.push("/review-empty");
          } else {
            this.props.history.push("/review-imagery");
          }
        }
        if (this.props.editableCard.prevRoute === "/all-cards") {
          this.props.history.push("/all-cards");
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        // TODO: Display error overlay
      });
  }

  render() {
    return (
      <AppTemplate>
        <h4 className="my-4 text-center text-muted">Edit card</h4>
        {isEmpty(this.props.editableCard) === false && (
          <>
            <div className="mb-2">
              <div className="card bg-primary">
                <div className="card-body">
                  <textarea
                    rows="8"
                    defaultValue={this.props.editableCard.card.imagery}
                    onChange={(e) => this.setImageryText(e)}
                  ></textarea>
                </div>
              </div>

              <div className="card bg-secondary">
                <div className="card-body">
                  <textarea
                    rows="8"
                    defaultValue={this.props.editableCard.card.answer}
                    onChange={(e) => this.setAnswerText(e)}
                  ></textarea>
                </div>
              </div>
            </div>
            {/* Character count */}

            <p className="float-right mt-2 mb-5 text-muted">
              <span
                className={classnames({
                  "text-danger": checkIsOver(
                    this.state.answerText,
                    MAX_CARD_CHARS
                  ),
                })}
              >
                Bottom: {this.state.answerText.length}/{MAX_CARD_CHARS}
              </span>
            </p>
            <p className="float-left mt-2 mb-5 text-muted">
              <span
                className={classnames({
                  "text-danger": checkIsOver(
                    this.state.imageryText,
                    MAX_CARD_CHARS
                  ),
                })}
              >
                Top: {this.state.imageryText.length}/{MAX_CARD_CHARS}
              </span>
            </p>

            {/* Clear float */}
            <div className="clearfix"></div>
            <Link
              to={this.props.editableCard.prevRoute}
              id="discard-changes"
              className="btn btn-link"
            >
              Discard changes
            </Link>
            <button
              className={classnames("btn btn-lg btn-primary float-right", {
                disabled: this.checkHasInvalidCharCount(),
              })}
              id="save-imagery"
              onClick={() => {
                this.saveCard();
              }}
            >
              <img
                src={saveIcon}
                width="20px"
                style={{ marginBottom: "3px" }}
                className="mr-2"
                alt="save button"
              />
              Save
            </button>
            {/* Card props and delete card */}
            <h4 className="text-center mt-5 text-muted">Card properties</h4>
            <div className="row mt-5">
              <p className="text-muted col-4 mb-5">
                Created:
                <br />
                Last attempt:
                <br />
                Next Attempt:
                <br />
                Consecutives:
                <br />
              </p>
              <p className="col-5">
                {toDisplayDate(
                  this.props.editableCard.card.createdAt,
                  "MMM. d, y"
                )}{" "}
                <br />
                {toDisplayDate(
                  this.props.editableCard.card.lastAttemptAt,
                  "MMM. d, y"
                )}
                <br />
                {toDisplayDate(
                  this.props.editableCard.card.nextAttemptAt,
                  "MMM. d, y"
                )}
                <br />
                {this.props.editableCard.card.totalSuccessfulAttempts}
                <br />
              </p>

              <div className="custom-control custom-checkbox mb-4 col-12 ml-3 ">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="show-delete"
                  onClick={() => {
                    // on click, runs showDeleteButton func
                    this.showDeleteButton();
                  }}
                />
                <label
                  className="custom-control-label text-muted"
                  htmlFor="show-delete"
                >
                  Show Delete Button
                </label>
              </div>
              {this.state.isDeleteChecked && ( // if isDeleteChecked = true, show delete button
                <button
                  className="btn btn-lg btn-outline-danger ml-3"
                  id="delete-card"
                  onClick={() => {
                    this.deleteCard();
                  }}
                >
                  Delete this card
                </button>
              )}
            </div>
          </>
        )}
      </AppTemplate>
    );
  }
}

// map the gloabal state from redux to the local properties of this component
function mapStateToProps(state) {
  return {
    editableCard: state.editableCard,
    queue: state.queue,
  };
}
export default connect(mapStateToProps)(Edit);
