import "./App.css";
import Login from "./Components/Login/Login";
import Profile from "./Components/Management_Account/Profile";
import Events from "./Components/Management_School/Management_EventInSchool/Events";
import Group from "./Components/Management_School/Management_Group/Group";
import News from "./Components/Management_School/Management_NewsInSchool/News";
import Schools from "./Components/Management_School/School";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
firebase.initializeApp(config);

function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Login} />
        <Route path="/school" component={Schools} />
        <Route path="/profile" component={Profile} />
        <Route path="/events" component={Events} />
        <Route path="/news" component={News} />
        <Route path="/group" component={Group} />
      </div>
    </Router>
    // <Router>
    //   <Routes>
    //     <Route exact path="/news" component={News} />
    //   </Routes>
    // </Router>
    // <Schools />
    // <Events />
    // <News />
    // <Group/>
    // <Login />
  );
}

export default App;
