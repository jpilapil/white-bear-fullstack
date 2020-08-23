import actions from "../actions";

export default function queue(queue = {}, action) {
  // initial state, action
  let newQueue = { ...queue }; // create copy of queue, never mutate original state!
  switch (action.type) {
    case actions.STORE_QUEUED_CARDS: // if action is type of STORE_QUEUED_CARDS, run
      newQueue.cards = action.payload;
      return newQueue; // new state
    case actions.INCREMENT_QUEUE_INDEX: // if action is type of INCREMENT_QUEUE_INDEX, increase index
      newQueue.index += 1;
      return newQueue; // new state
    case actions.DECREMENT_QUEUE_INDEX: // if action is type of DECREMENT_QUEUE_INDEX, decrease index
      newQueue.index -= 1;
      return newQueue; // new state
    case actions.RESET_QUEUE:
      newQueue.cards = [];
      newQueue.index = 0;
      return newQueue;
    case actions.UPDATE_QUEUED_CARD:

    default:
      // else, return initial state
      return queue;
  }
}
