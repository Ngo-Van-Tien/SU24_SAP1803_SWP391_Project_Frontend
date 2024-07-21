import "./App.css";
import Login from "./Components/Login/Login";
import Profile from "./Components/Management_Account/Profile";

import Group from "./Components/Management_Swp/Management_Group/Group";

import Schools from "./Components/Management_Swp/Management_Productitems/ProductItems";
import Brand from "./Components/Management_Swp/Management_Brand/Brand";
import Product from "./Components/Management_Swp/Management_Products/Product";
import Account from "./Components/Management_Swp/Management_Account/Account";
import MilkFuncion from "./Components/Management_Swp/Management_MilkFuncion/MilkFuncion";
import Nutrient from "./Components/Management_Swp/Management_Nutrient/Nutrient";
import Order from "./Components/Management_Swp/Management_Order/Order";
import OrderDetail from "./Components/Management_Swp/Management_Order/OrderDetail";
import ProductNutrient from "./Components/Management_Swp/Management_Products/ProductNutrient";
import General from "./Components/Management_Swp/Management_General/General";
import MilkBrandFuncion from "./Components/Management_Swp/Management_Brand/MilkBrandFuncion";

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
        
        
        <Route path="/group" component={Group} />
        <Route path="/brand" component={Brand} />
        <Route path="/product" component={Product} />
        <Route path="/account" component={Account} />
        <Route path="/milkfuncion" component={MilkFuncion} />
        <Route path="/nutrient" component={Nutrient} />
        <Route path="/order" component={Order} />
        <Route path="/orderDetail" component={OrderDetail} />
        <Route path="/productNutrient" component={ProductNutrient} />
        <Route path="/general" component={General} />
        <Route path="/milkebrandfuncion" component={MilkBrandFuncion} />
        
      
        
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
