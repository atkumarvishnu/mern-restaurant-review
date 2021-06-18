import express from "express"   //importing express
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"


const router = express.Router()     //using express router

router.route("/").get(RestaurantsCtrl.apiGetRestaurants) //this gets a list of all the resturants//things to be returned are going to come from RestaurantsCtrl using the apiGetRestaurants method
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById) //this will return a specific restaurant with an specific id, we will also get the reviews associated with that restaurant
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines)    //return a list of cuisines, because in the front end we want a drop down which displays all the cuisines to the user, we populate the dropdown using this 



router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)


export default router