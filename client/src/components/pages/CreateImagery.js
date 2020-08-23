import React from "react";
import saveIcon from "../../icons/save.svg";
import AppTemplate from "../ui/AppTemplate";
import memoryCards from "../../mock-data/memory-cards";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";

const memoryCard = memoryCards[2];

class CreateImagery extends React.Component {
  constructor(props) {
    super(props);
    console.log("in here");
    this.state = {
      answerText: memoryCard.answer,
      imageryText: memoryCard.imagery,
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

  async updateCreatableCard() {
    console.log("updating creatable card");
    const {
      id,
      answer,
      userId,
      createdAt,
      nextAttemptAt,
      lastAttemptAt,
      totalSuccessfulAttempts,
      level,
    } = this.props.creatableCard;
    await this.props.dispatch({
      type: actions.UPDATE_CREATABLE_CARD,
      payload: {
        // the card
        id: id,
        answer: answer,
        imagery: this.state.imageryText,
        userId: userId,
        createdAt: createdAt,
        nextAttemptAt: nextAttemptAt,
        lastAttemptAt: lastAttemptAt,
        totalSuccessfulAttempts: totalSuccessfulAttempts,
        level: level,
      },
    });
    // save to db
    axios
      // post creatableCard obj in redux store
      .post("/api/v1/memory-cards", this.props.creatableCard)
      .then(() => {
        console.log("Memory Card created!");
        // display success overlay
        // route to "/create-answer"
        // clear creatableCard from redux
        this.props.dispatch({
          type: actions.UPDATE_CREATABLE_CARD,
          payload: {},
        });
      })
      .catch((err) => {
        const { data } = err.response;
        console.log(data);
        // display error overlay & hide error overlay after 5 sec
      });
  }

  render() {
    return (
      <AppTemplate>
        <h4 className="my-4 text-center text-muted">Add memorable imagery</h4>

        {/* Card */}
        <div className="mb-2">
          <div className="card bg-primary">
            <div className="card-body">
              {/* <textarea
                rows="11"
                className="d-sm-none"
                autoFocus={true}
              ></textarea> */}
              <textarea
                rows="8"
                defaultValue={memoryCard.imagery}
                autoFocus
                onChange={(e) => this.setImageryText(e)}
              ></textarea>
            </div>
          </div>

          <div className="card bg-secondary">
            <div className="card-body">{this.props.creatableCard.answer}</div>
          </div>
        </div>

        {/* Character counter */}
        <p className="float-right mt-2 mb-5 text-muted">
          <span
            className={classnames({
              "text-danger": checkIsOver(this.state.answerText, MAX_CARD_CHARS),
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

        {/* Clears float */}
        <div className="clearfix"></div>

        <Link to="/create-answer" id="delete-imagery" className="btn btn-link">
          Back to answer
        </Link>

        <button
          className={classnames("btn btn-lg btn-primary float-right", {
            disabled: this.checkTextLimit(),
          })}
          onClick={() => {
            this.updateCreatableCard();
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
      </AppTemplate>
    );
  }
}

function mapStateToProps(state) {
  // map state to props in local component
  return {
    creatableCard: state.creatableCard,
  };
}
export default connect(mapStateToProps)(CreateImagery);
