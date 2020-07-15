import React from "react";
import AppTemplate from "../ui/AppTemplate";
import MemoryCard from "../ui/MemoryCard";

import orderBy from "lodash/orderBy";
import axios from "axios";

// const memoryCard = memoryCards[2];

export default class AllCards extends React.Component {
  constructor(props) {
    super(props);

    // initial LOCAL state
    this.state = {
      order: '[["createdAt"], ["desc"]]',
      displayedMemoryCards: [],
      allMemoryCards: [],
    };
  }

  // componentDidMount is a lifecycle method, does not need to be called somewhere else, will always run
  componentDidMount() {
    axios
      .get(
        "https://raw.githubusercontent.com/jpilapil/white-bear-mpa/master/src/mock-data/memory-cards.json"
      )
      .then((res) => {
        // use ES6 arrow function to grant access to 'this' https://stackoverflow.com/questions/38238512/react-this-is-undefined
        // handle success
        console.log(res.data);
        const memoryCards = res.data;
        this.setState({
          displayedMemoryCards: orderBy(memoryCards, '["createdAt"], ["desc"]'),
          allMemoryCards: orderBy(memoryCards, '["createdAt"], ["desc"]'),
        });
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  filterByInput() {
    const input = document.getElementById("search-input").value;
    const lowerCasedInput = input.toLowerCase();
    console.log(lowerCasedInput);
    const copyOfAllMemoryCards = [...this.state.allMemoryCards];
    const filteredMemoryCards = copyOfAllMemoryCards.filter((memoryCard) => {
      const lowerCasedImagery = memoryCard.imagery.toLowerCase();
      const lowerCasedAnswer = memoryCard.answer.toLowerCase();
      if (
        lowerCasedImagery.includes(lowerCasedInput) ||
        lowerCasedAnswer.includes(lowerCasedInput)
      ) {
        return true;
      }
      return false;
    });
    this.setState({ displayedMemoryCards: filteredMemoryCards }, () => {
      this.setMemoryCards();
    });
  }

  setOrder(e) {
    const newOrder = e.target.value;
    console.log(newOrder); //returns string
    this.setState({ order: newOrder }, () => {
      this.setMemoryCards();
    }); //updates state of the select to show which filter you clicked on (most recent, oldest, hardest, etc)
  }

  setMemoryCards() {
    console.log("setting memcard");
    const copyOfDisplayedMemoryCards = [...this.state.displayedMemoryCards]; // array of all our memory cards, shallow copy
    const toJson = JSON.parse(this.state.order);
    const orderedMemoryCards = orderBy(copyOfDisplayedMemoryCards, ...toJson);
    this.setState({ displayedMemoryCards: orderedMemoryCards }); //updates state of the select to show which filter you clicked on (most recent, oldest, hardest, etc)
  }

  // setMemoryCardsOrder(e) {
  //   const newOrder = e.target.value;
  //   console.log(newOrder); //returns string
  //   const copyOfMemoryCards = [...this.state.memoryCards]; // array of all our memory cards, shallow copy
  //   const toJson = JSON.parse(newOrder);
  //   const orderedMemoryCards = orderBy(copyOfMemoryCards, ...toJson);
  //   this.setState({ order: newOrder, memoryCards: orderedMemoryCards }); //updates state of the select to show which filter you clicked on (most recent, oldest, hardest, etc)
  // }

  render() {
    return (
      <AppTemplate>
        <div>
          {/* Search */}
          <div className="row mt-3">
            <div className="col-8 col-sm-8 mb-4">
              <input
                type="search"
                className="form-control border"
                placeholder="Search for a word"
                id="search-input"
              />
            </div>
            <div className="col-4 col-sm-4 mb-4">
              <button
                className="btn btn-sm btn-primary float-right"
                onClick={() => this.filterByInput()}
              >
                Search
              </button>
            </div>
          </div>

          {/* Sort  */}

          <div className="row">
            <div className="col-6 mb-4">
              <p className="text-muted">Sort cards by</p>
            </div>
            <div className="col-6 mb-4">
              <select
                value={this.state.order}
                className="form-control form-control-sm"
                onChange={(e) => this.setOrder(e)}
              >
                <option value='[["createdAt"], ["desc"]]'>Most recent</option>
                <option value='[["createdAt"], ["asc"]]'>Oldest</option>
                <option value='[["totalSuccessfulAttempts", "createdAt"], ["asc", "asc"]]'>
                  Hardest
                </option>
                <option value='[["totalSuccessfulAttempts", "createdAt"], ["desc", "desc"]]'>
                  Easiest
                </option>
              </select>
            </div>
          </div>
          {this.state.displayedMemoryCards.map((memoryCard) => {
            // map through memory cards array, get each memory card
            // find each card by id, return answer and imagery values
            return <MemoryCard card={memoryCard} key={memoryCard.id} />;
          })}
        </div>
      </AppTemplate>
    );
  }
}
