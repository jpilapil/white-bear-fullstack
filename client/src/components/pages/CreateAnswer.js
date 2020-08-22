import React from "react";
import AppTemplate from "../ui/AppTemplate";
import classnames from "classnames";
import { checkIsOver, MAX_CARD_CHARS, defaultLevel } from "../../utils/helpers";
import { connect } from "react-redux";
import actions from "../../store/actions";
import { v4 as getUuid } from "uuid";
import getNextAttemptAt from "../../utils/getNextAttamptAt";

class CreateAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // if there is an answer, use answer. if undefined, use blank string
      answerText: this.props.creatableCard.answer || "",
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

  setCreatableCard() {
    const currentTime = Date.now();
    this.props.dispatch({
      type: actions.UPDATE_CREATABLE_CARD,
      payload: {
        // the card
        id: getUuid(),
        answer: this.state.answerText,
        imagery: "",
        userId: this.props.currentUser.id,
        createdAt: currentTime,
        nextAttemptAt: getNextAttemptAt(defaultLevel, currentTime),
        lastAttemptAt: currentTime,
        totalSuccessfulAttempts: 0,
        level: 1,
      },
    });
    this.props.history.push("/create-imagery");
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
                  defaultValue={this.state.answerText}
                  autoFocus={true}
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

          <button
            className={classnames(
              "btn btn-lg btn-outline-primary float-right",
              { disabled: this.checkTextLimit() }
            )}
            onClick={() => {
              this.setCreatableCard();
            }}
          >
            Next
          </button>
        </div>
      </AppTemplate>
    );
  }
}

function mapStateToProps(state) {
  // map state to props in local component
  return {
    currentUser: state.currentUser,
    creatableCard: state.creatableCard,
  };
}
export default connect(mapStateToProps)(CreateAnswer);
