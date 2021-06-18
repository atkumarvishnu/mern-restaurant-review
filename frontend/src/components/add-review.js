import React, { useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const AddReview = props => {
  let initialReviewState = ""

  let editing = false;              //->with this we are keeping track if this is a new review or we are editing the review(because we are using the same page to add review and edit review)
  //false means we are not editing the review(that's the default value)

  if (props.location.state && props.location.state.currentReview) {     //first we check if state(currentReview from restaurants.js) even exists && if it exists then we check if currentReview is passed in as a state//->the way to check if we are editing the review is to check if we are passing the current review. When the edit button in restaurants.js is clicked currentReview object is passed as a state
    editing = true;                                                     //->if both the statements are satisfied, then we set editing to true
    initialReviewState = props.location.state.currentReview.text        //->and we set initialReviewState to the text in currentReview object
  }

  const [review, setReview] = useState(initialReviewState);             //creating review variable state with initialReviewState(which will be a empty string "" OR currentReview.text)
  const [submitted, setSubmitted] = useState(false);                    //this state keeps track if we have submitted the review or not

  const handleInputChange = event => {
    setReview(event.target.value);                                      //whenever someone types in something, we will setReview(event.target.value), setReview is the setter_function of review variable state
  };

  const saveReview = () => {                                            
    var data = {                                                        //saveReview function will create this data variable with text of the review, name of the user(props.user.name), id of the user(props.user.id) and the restaurant id(props.match.params.id)
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: props.match.params.id                              //we are getting the restaurant id from the URL(params)
    };

    if (editing) {                                                      
      data.review_id = props.location.state.currentReview._id           //if we are editing the review, then we will take the props.location.state.currentReview._id and add it to review_id      //review_if is only created when there is a review or the review is being edited
      RestaurantDataService.updateReview(data)                          //then updateReview is called from the RestaurantDataService
        .then(response => {
          setSubmitted(true);                                           //it's going to setSubmitted to true
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {                                                            //if we are creating a new review
      RestaurantDataService.createReview(data)                          //->then createReview is called with data as input
        .then(response => {
          setSubmitted(true);                                           //and here also setSubmitted is set as true
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div> 
      {props.user ? (                                                   //first we check if there is a user (by props.user), user has to be logged in to add reviews -> : else we show please log in
      <div className="submit-form">
        {submitted ? (                                                  //if user is logged in, then first we check if the review is submitted yet ({submitted ? ), if it's submitted successfully, then we say You submitted successfullt and link to the restaurants/ + props.id 
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/restaurants/" + props.match.params.id} className="btn btn-success">
              Back to Restaurant
            </Link>
          </div>
        ) : (                                                           // if it's not submitted yet then we are going to give a form, form will have 2 options Edit or Create review based on editing variable // input form will have review as value and handleInputChange as onChange // if we click submit, then it's going to call the saveReview function
          <div>                                                         
            <div className="form-group">
              <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddReview;