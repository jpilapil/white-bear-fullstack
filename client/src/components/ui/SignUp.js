import React from "react";
import classnames from "classnames";
import { v4 as getUuid } from "uuid";
import { withRouter } from "react-router-dom";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisplayingInputs: false,
      emailError: "",
      passwordError: "",
      hasEmailError: false,
      hasPasswordError: false,
    };
  }

  showInputs() {
    this.setState({
      isDisplayingInputs: true,
    });
  }

  async validateAndCreateUser() {
    // email cant be blank
    // must have valid email regex
    const emailInput = document.getElementById("signup-email-input").value;
    const passwordInput = document.getElementById("signup-password-input")
      .value;

    // create user obj
    const user = {
      id: getUuid(),
      email: emailInput,
      password: passwordInput,
      createdAt: Date.now(),
    };
    // post to api
    axios
      .post("/api/v1/users", user)
      .then((res) => {
        console.log(res.data);
        this.props.dispatch({
          // update currentUser in global state in redux with API response
          type: actions.UPDATE_CURRENT_USER,
          payload: res.data,
        });
        this.props.history.push("/create-answer");
      })
      .catch((err) => {
        // use error responses to trigger state
        const { data } = err.response;
        console.log(data);
        const { emailError, passwordError } = data;
        if (emailError !== "") {
          this.setState({ hasEmailError: true, emailError });
        } else {
          this.setState({ hasEmailError: false, emailError });
        }
        if (passwordError !== "") {
          this.setState({ hasPasswordError: true, passwordError });
        } else {
          this.setState({ hasPasswordError: false, passwordError });
        }
      });
    console.log("created user object for POST: ", user);
  }

  render() {
    return (
      <div className="col-lg-5 offset-lg-1 col-md-8 offset-md-2 col-10 offset-1 col-xl-4">
        {/* first login card */}
        <div id="inside-card" className="card mt-6">
          <div id="sign-up-card" className="card-body">
            <h2 className="card-title ">Nice to meet you</h2>
            <p className="card-text-landing ">
              Sign up for White Bear. Free forever.
            </p>
            {this.state.isDisplayingInputs && (
              <div>
                <p className="card-text-landing sign-up-text">
                  Let's get you signed up.
                </p>
                <div className="form-group">
                  <label
                    className="text-secondary"
                    htmlFor="signup-email-input"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    className={classnames({
                      "form-control": true,
                      "mb-2": true,
                      "is-invalid": this.state.emailError,
                    })}
                    id="signup-email-input"
                  />
                </div>
                {/* email error message */}
                {this.state.hasEmailError && (
                  <p className="text-danger">{this.state.emailError}</p>
                )}
                <div className="form-group">
                  <label
                    className="text-secondary"
                    htmlFor="signup-password-input"
                  >
                    Create a Password
                    <br />
                    <span className="text-muted">
                      Must be at least 9 characters.
                    </span>
                  </label>
                  <input
                    type="password"
                    className={classnames({
                      "form-control": true,
                      "mb-2": true,
                      "is-invalid": this.state.hasPasswordError,
                    })}
                    id="signup-password-input"
                  />
                </div>
                {/* password error messages */}
                {this.state.hasPasswordError && (
                  <p className="text-danger">{this.state.passwordError}</p>
                )}
                <button
                  to="/create-answer"
                  id="letsGo"
                  className="btn btn-success btn-lg btn-block btn-lg landing-Link mt-5"
                  onClick={() => {
                    this.validateAndCreateUser();
                  }}
                >
                  Let's go!
                </button>
              </div>
            )}
            ;
            {!this.state.isDisplayingInputs && (
              <button
                id="sign-up-button"
                className="btn btn-success btn-lg btn-block btn-lg landing-button"
                onClick={() => {
                  this.showInputs();
                }}
              >
                Sign up
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  // map state to props in local component
  return {};
}
export default withRouter(connect(mapStateToProps)(SignUp));
