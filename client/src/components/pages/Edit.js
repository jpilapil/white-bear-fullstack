import React from "react";
import saveIcon from "../../icons/save.svg";
import AppTemplate from "../ui/AppTemplate";
import { Link } from "react-router-dom";
import memoryCards from "../../mock-data/memory-cards";
import toDisplayDate from "date-fns/format";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import without from "lodash/without";
import actions from "../../store/actions";

const memoryCard = memoryCards[2];

class Edit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answerText: memoryCard.answer,
      imageryText: memoryCard.imagery,
      isDeleteChecked: false,
    };
  }

  checkTextLimit() {
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

  deleteCard() {
    //TODO: DELETE FROM DATABASSE
    if (this.props.editableCard.prevRoute === "/review-answer") {
      this.deleteCardFromStore();
    }
    if (this.props.editableCard.prevRoute === "/all-cards") {
      this.props.history.push("/all-cards");
    }
  }

  deleteCardFromStore() {
    const deletedCard = this.props.editableCard.card;
    // console.log(deletedCard);
    const cards = this.props.queue.cards;
    // console.log(cards);
    // const filteredCards = cards.filter((card) => {
    //   if (card !== deletedCard) {
    //     return card;
    //   }
    // });
    const filteredCards = without(cards, deletedCard);
    console.log(filteredCards);
    this.props.dispatch({
      type: actions.STORE_QUEUED_CARDS,
      payload: filteredCards,
    });
    if (filteredCards[this.props.queue.index] === undefined) {
      this.props.history.push("/review-empty");
    } else {
      this.props.history.push("/review-imagery");
    }
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
                    autoFocus
                    onChange={(e) => this.setImageryText(e)}
                  ></textarea>
                </div>
              </div>

              <div className="card bg-secondary">
                <div className="card-body">
                  <textarea
                    rows="8"
                    defaultValue={this.props.editableCard.card.answer}
                    autoFocus
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
            <Link
              to={this.props.editableCard.prevRoute}
              className={classnames("btn btn-lg btn-primary float-right", {
                disabled: this.checkTextLimit(),
              })}
              id="save-imagery"
            >
              <img
                src={saveIcon}
                width="20px"
                style={{ marginBottom: "3px" }}
                className="mr-2"
                alt="save button"
              />
              Save
            </Link>
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
