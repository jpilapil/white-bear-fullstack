import React from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import axios from "axios";
import actions from "../../store/actions";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";

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

  checkHasLocalPart(passwordInput, emailInput) {
    const localPart = emailInput.split("@")[0];
    if (localPart === "") return false;
    else if (localPart.length < 4) return false;
    else return passwordInput.includes(localPart);
  }

  async validateAndCreateUser() {
    // email cant be blank
    // must have valid email regex
    const emailInput = document.getElementById("login-email-input").value;
    const passwordInput = document.getElementById("login-password-input").value;

    const user = {
      email: emailInput,
      password: passwordInput,
    };

    axios
      .post("/api/v1/users/auth", user)
      .then((res) => {
        // set token in local storage
        const authToken = res.data;
        localStorage.setItem("authToken", authToken);
        const user = jwtDecode(authToken);
        this.props.dispatch({
          // update currentUser in global state in redux with API response
          type: actions.UPDATE_CURRENT_USER,
          payload: user,
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
              <label className="text-secondary" htmlFor="login-email-input">
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
              <label className="text-secondary" htmlFor="login-password-input">
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
