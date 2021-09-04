import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Login/Login";
import Homepage from "./Homepage/Homepage";
import Signup from "./Signup/Signup";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route path="/" exact={true} component={Login} />
          <Route path="/homepage" exact={true} component={Homepage} />
          <Route path="/create-account" exact={true} component={Signup} />
          <Route
            path="/forgot-password"
            exact={true}
            component={ForgotPassword}
          />
          <Route
            path="/reset-password/:token"
            exact={true}
            component={ResetPassword}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
