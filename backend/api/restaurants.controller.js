import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {

  static async apiGetRestaurants(req, res, next) {          //when this api is called via. a URL there can be a query string (?page=1)
    const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20   //TERNARY OPERATOR -> this checks if the req.query.restaurantsPerPage exists, if it does then convert it to int else, 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0  //this checks if the req.query.page exists, if it does then convert it to a int or else 0

    let filters = {}
    if (req.query.cuisine) {                    //if we see a cuisine query string then filters.cuisine is set to the query string    
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {             //if we see a zipcode query string then filters.zipcode is set to the query string
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {                    //if we see a name query string then filters.name is set to the query string
      filters.name = req.query.name
    }

    const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
      filters,
      page,
      restaurantsPerPage,                       //we pass in filters, page, restaurantsPerPage and it returns us restaurantsList and totalNumRestaurants
    })

    let response = {                    //creating the response to be sent
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    }
    res.json(response)
  }



  static async apiGetRestaurantById(req, res, next) {
    try {
      let id = req.params.id || {}          //we will look for the id parameter using req.params.id. A query is after the ? in the URL. and parameter is after the / in the URL
      let restaurant = await RestaurantsDAO.getRestaurantByID(id)
      if (!restaurant) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(restaurant)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }



  static async apiGetRestaurantCuisines(req, res, next) {
    try {
      let cuisines = await RestaurantsDAO.getCuisines()
      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }


}