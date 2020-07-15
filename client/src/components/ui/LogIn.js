import React from "react";
import classnames from "classnames";
import hash from "object-hash";
import { v4 as getUuid } from "uuid";
import { withRouter } from "react-router-dom";
import { EMAIL_REGEX } from "../../utils/helpers";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailError: "",
      passwordError: "",
      hasEmailError: false,
      hasPasswordError: false,
    };
  }

  // email error messages
  async setEmailState(emailInput) {
    const lowerCasedEmailInput = emailInput.toLowerCase();

    if (emailInput === "")
      this.setState({
        emailError: "Please enter your email address.",
        hasEmailError: true,
      });
    else if (EMAIL_REGEX.test(lowerCasedEmailInput) === false) {
      this.setState({
        emailError: "Please enter a valid email address.",
        hasEmailError: true,
      });
    } else {
      this.setState({ emailError: "", hasEmailError: false });
    }
  }

  checkHasLocalPart(passwordInput, emailInput) {
    const localPart = emailInput.split("@")[0];
    if (localPart === "") return false;
    else if (localPart.length < 4) return false;
    else return passwordInput.includes(localPart);
  }

  // password error messages
  async setPasswordState(passwordInput, emailInput) {
    if (passwordInput === "") {
      this.setState({
        passwordError: "Please enter a password.",
        hasPasswordError: true,
      });
    } else {
      this.setState({ passwordError: "", hasPasswordError: false });
    }
  }

  async validateAndCreateUser() {
    // email cant be blank
    // must have valid email regex
    const emailInput = document.getElementById("login-email-input").value;
    const passwordInput = document.getElementById("login-password-input").value;
    await this.setEmailState(emailInput);
    await this.setPasswordState(passwordInput, emailInput);
    if (
      this.state.hasEmailError === false &&
      this.state.hasPasswordError === false
    ) {
      const user = {
        id: getUuid(),
        email: emailInput,
        password: hash(passwordInput),
        createdAt: Date.now(),
      };
      console.log("created user object for POST: ", user);
      // mimis api response
      axios
        .get(
          "https://raw.githubusercontent.com/jpilapil/white-bear-mpa/master/src/mock-data/user.json"
        )
        .then((res) => {
          const currentUser = res.data;
          console.log(currentUser);
          this.props.dispatch({
            type: actions.UPDATE_CURRENT_USER,
            payload: res.data,
          });
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
      this.props.history.push("/create-answer");
    }
  }

  render() {
    return (
      <div className="col-lg-5 offset-lg-1  col-md-8 offset-md-2 col-10 offset-1 col-xl-4">
        <div id="inside-card" className="card mt-6">
          <div className="card-body">
            <h2 className="card-title ">Welcome back</h2>
            <p className="card-text-landing">
              Log in with your email address and password.
            </p>

            <div className="form-group">
              <label className="text-muted" htmlFor="login-email-input">
                Email address
              </label>
              <input
                type="email"
                className={classnames({
                  "form-control": true,
                  "mb-2": true,
                  "is-invalid": this.state.emailError,
                })}
                id="login-email-input"
              />
            </div>
            {this.state.hasEmailError && (
              <p className="text-danger">{this.state.emailError}</p>
            )}
            <div className="form-group">
              <label className="text-muted" htmlFor="login-password-input">
                Password
              </label>
              <input
                type="password"
                className={classnames({
                  "form-control": true,
                  "mb-2": true,
                  "is-invalid": this.state.hasPasswordError,
                })}
                id="login-password-input"
              />
              {this.state.hasPasswordError && (
                <p className="text-danger">{this.state.passwordError}</p>
              )}

              <button
                to="/create-answer"
                id="logIn"
                className="btn btn-success btn-lg btn-block btn-lg landing-Link mt-5"
                onClick={() => {
                  this.validateAndCreateUser();
                }}
              >
                Log in
              </button>
            </div>
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
export default withRouter(connect(mapStateToProps)(LogIn));
