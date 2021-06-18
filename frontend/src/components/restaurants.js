import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const Restaurant = props => {
  const initialRestaurantState = {          //to add/delete/update a review we needed to put a POST request, with a json having id, name, review
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };        
  const [restaurant, setRestaurant] = useState(initialRestaurantState);     //we are using initialRestaurantState to set up the restaurant state

  const getRestaurant = id => {
    RestaurantDataService.get(id)       //-> it will get the id, 
      .then(response => {
        setRestaurant(response.data);   //->it will set the setRestaurant to be response.data
        console.log(response.data);
      })
      .catch(e => {                     //->else it will catch the error
        console.log(e);
      });
  };

  useEffect(() => {
    getRestaurant(props.match.params.id);   //this is how the restaurants will be loaded using the (getRestaurant) function defined above
  }, [props.match.params.id]);              //useEffect will be called when the page first renders, and this useEffect will be called only when props.match.params.id i.e. id is updated

  const deleteReview = (reviewId, index) => {       //deleting a review will only work if the same user is deleting the review, it will need a reviewId and index
    RestaurantDataService.deleteReview(reviewId, props.user.id) //-> we call deleteReview with reviewId and user.id as input
      .then(response => {                                       //-> with the response
        setRestaurant((prevState) => {                          //->we are going to setRestaurant to be that restaurant array without the restaurant that was deleted
          prevState.reviews.splice(index, 1)                    //->we are going to take the prevState of the restaurant array and we will splice the index of the one that was deleted
          return({
            ...prevState                                        //->then, we return the prevState
          })
        })
      })
      .catch(e => {                                             //->else,we log the error
        console.log(e);
      });
  };

  return (
    <div>
      {restaurant ? (
        <div>
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
            <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
          </p>
          <Link to={"/restaurants/" + props.match.params.id + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {restaurant.reviews.length > 0 ? (                          //<-If there are some reviews then(length of review > 0)
             restaurant.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.text}<br/>
                         <strong>User: </strong>{review.name}<br/>
                         <strong>Date: </strong>{review.date}
                       </p>
                       {props.user && props.user.id === review.user_id &&                   //-> If there is a user logged in && if its the same user(props.user.id === review.user_id) && if both these are true Then it's going to add 2 buttons Delete and Edit
                          <div className="row">
                            <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <Link to={{
                              pathname: "/restaurants/" + props.match.params.id + "/review",
                              state: {
                                currentReview: review                                                   //Link is going to take it to the path and "/restaurants/" + props.match.params.id + "/review" and it's going to pass in the state as the current review
                              }
                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;