import React, {useState} from "react";
import {Switch, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Restaurant from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";
import AddReview from "./components/add-review";
import Login from "./components/login";


function App() {

  const [user, setUser] = useState(null);       //React HOOKS, making state variable for user to determine if he is logged in or not
  ///setUser is a setter function, which is used to change the value of user
  
  async function login(user = null) {         //login function
    setUser(user);
  }

  async function logout() {                   //logout function
    setUser(null)
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item" >
            { user ? (              //ternary operation checking if user is true or false, if true 1st part is executed, if false 2nd part is executed
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}

          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/restaurants"]} component={RestaurantsList} />  
          {/* Here we are using component={ResturantList} */}
          <Route 
            path="/restaurants/:id/review"
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
            />
           {/* Here we are using render, because it helps us to pass in the props to the components we are loading */}
           {/* We are passing in user as props to AddReview, Also, we will be able to access out :id variable from the AddReview component */}
          
          <Route 
            path="/restaurants/:id"
            render={(props) => (
              <Restaurant {...props} user={user} />
            )}
          />
          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;