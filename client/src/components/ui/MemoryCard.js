import React from "react";
import editIcon from "../../icons/edit.svg";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";

class MemoryCard extends React.Component {
  storeEditableCard(memoryCard) {
    console.log("STORING EDITABLE CARD");
    this.props.dispatch({
      type: actions.STORE_EDITABLE_CARD,
      payload: {
        card: memoryCard,
        prevRoute: "/all-cards",
      },
    });
    this.props.history.push("/edit");
  }

  render() {
    const memoryCard = this.props.queue.cards[this.props.queue.index];
    return (
      <>
        {/* Card */}
        <div className="row">
          <div className="col-10">
            <div className="mb-5">
              <div className="card bg-primary">
                {/*call props and target imagery key */}
                <div className="card-body">{this.props.card.imagery}</div>
              </div>

              <div className="card bg-secondary">
                <div className="card-body">{this.props.card.answer}</div>
              </div>
            </div>
          </div>

          {/* Edit button */}
          <div className="col-2">
            <button
              className="btn btn-link d-inline"
              onClick={() => {
                this.storeEditableCard(memoryCard);
              }}
            >
              <img src={editIcon} alt="Edit Button" width="20px;" />
              Edit
            </button>
          </div>
        </div>
      </>
    );
  }
  //pass props as arg
}

function mapStateToProps(state) {
  // map state to props in local component
  return {
    queue: state.queue,
  };
}

export default withRouter(connect(mapStateToProps)(MemoryCard));
