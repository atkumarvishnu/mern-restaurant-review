//This is a dummy login
//We are not doing an authentication system
//It will just have 2 text fields for the user and the user_id, and then it will log us in(using those user and user_id)

import React, { useState } from "react";

const Login = props => {                    //Login Component

  const initialUserState = {                //initialUserState is an object with blank name and blank id
    name: "",
    id: "",
  };

  const [user, setUser] = useState(initialUserState);       //initialUserState is used to store the user state

  const handleInputChange = event => {                  //We are handling Input change because we have forms in this page, both the forms text field is handled by handleInputChange
    const { name, value } = event.target;               //event.target will get the name and value from the target-> (name,user.name) and (id,user.id) 
    setUser({ ...user, [name]: value });                //then we use the setter_function (setUser) to load these name and calue to our initialUserState    ... is spread operator
  };

  const login = () => {
    props.login(user)                                   //When the login button is clicked, props.login is called with user as an input 
    props.history.push('/');                            //-> This line updates the URl so it goes to this other route ('/') i.e the home page
  }
//props.login means we are calling login function from app.js file, it's declared there
//async function login(user = null) {         //login function
//        setUser(user);
//}
//check setUser -> It's a setter function
  

  return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="user">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={user.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input
            type="text"
            className="form-control"
            id="id"
            required
            value={user.id}
            onChange={handleInputChange}
            name="id"
          />
        </div>

        <button onClick={login} className="btn btn-success">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;