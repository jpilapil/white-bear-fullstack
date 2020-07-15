import actions from "../actions";

export default function editableCard(editableCard = {}, action) {
  // initial state, action
  let newEditableCard = { ...editableCard };
  switch (action.type) {
    case actions.STORE_EDITABLE_CARD:
      newEditableCard.card = action.payload.card;
      newEditableCard.prevRoute = action.payload.prevRoute;
      return newEditableCard; // new state
    default:
      // else, return initial state
      return editableCard;
  }
}
