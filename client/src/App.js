import React from "react";
import "./style/master.scss"; // global styles
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./components/pages/Landing";
import CreateAnswer from "./components/pages/CreateAnswer";
import CreateImagery from "./components/pages/CreateImagery";
import ReviewImagery from "./components/pages/ReviewImagery";
import ReviewAnswer from "./components/pages/ReviewAnswer";
import ReviewEmpty from "./components/pages/ReviewEmpty";
import AllCards from "./components/pages/AllCards";
import Edit from "./components/pages/Edit";
import NotFound from "./components/pages/NotFound";
import jwtDecode from "jwt-decode";
import store from "./store/store";
import actions from "./store/actions";
import axios from "axios";

const authToken = localStorage.authToken;
if (authToken) {
  // if the auth token is not expired
  const currentTimeInSec = Date.now() / 1000;
  const user = jwtDecode(authToken);
  if (currentTimeInSec > user.exp) {
    console.log("Expired token");
    // remove currentUser from global state / redux store
    store.dispatch({
      type: actions.UPDATE_CURRENT_USER,
      payload: {},
    });
    delete axios.defaults.headers.common["x-auth-token"];
  } else {
    console.log("Valid token");
    // store user in global state / redux store(currentUser)
    store.dispatch({
      type: actions.UPDATE_CURRENT_USER,
      payload: user,
    });
    // set authorization headers for every req
    axios.defaults.headers.common["x-auth-token"] = authToken;
    // redirect to create-answer
    const currentUrl = window.location.pathname;
    if (currentUrl === "/") {
      window.location.href = "/create-answer";
    }
  }
} else {
  console.log("No token");
  delete axios.defaults.headers.common["x-auth-token"];
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/create-answer" component={CreateAnswer} />
        <Route exact path="/create-imagery" component={CreateImagery} />
        <Route exact path="/review-imagery" component={ReviewImagery} />
        <Route exact path="/review-answer" component={ReviewAnswer} />
        <Route exact path="/review-empty" component={ReviewEmpty} />
        <Route exact path="/all-cards" component={AllCards} />
        <Route exact path="/edit" component={Edit} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
