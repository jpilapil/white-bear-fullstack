import React from "react";
import AppTemplate from "../ui/AppTemplate";
import memoryCards from "../../mock-data/memory-cards";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS } from "../../utils/helpers";
import { Link } from "react-router-dom";
const memoryCard = memoryCards[2];

export default class CreateAnswer extends React.Component {
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
      this.state.answerText.length === 0
    ) {
      return true;
    } else return false;
  }

  setAnswerText(e) {
    this.setState({ answerText: e.target.value });
  }
  render() {
    return (
      <AppTemplate>
        <div>
          <h4 className="my-4 text-center text-muted">Add an answer</h4>

          {/* Card */}
          <div className="mb-2">
            <div className="card bg-secondary">
              <div className="card-body">
                {/* <textarea rows="11" className="d-sm-none" autoFocus></textarea> */}
                <textarea
                  rows="8"
                  defaultValue={memoryCard.answer}
                  autoFocus
                  onChange={(e) => this.setAnswerText(e)}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Character counter */}
          <p className="float-right mt-2 mb-5 text-muted">
            <span
              className={classnames({
                "text-danger": checkIsOver(
                  this.state.answerText,
                  MAX_CARD_CHARS
                ),
              })}
            >
              {this.state.answerText.length}/{MAX_CARD_CHARS}
            </span>
          </p>

          {/* Clears float */}
          <div className="clearfix"></div>

          <Link
            to="/create-imagery"
            className={classnames(
              "btn btn-lg btn-outline-primary float-right",
              { disabled: this.checkTextLimit() }
            )}
            id="nextAnswer"
          >
            Next
          </Link>
        </div>
      </AppTemplate>
    );
  }
}
