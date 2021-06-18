import React, {useEffect, useState} from "react";
import RestaurantDataService from "../services/restaurant";
import {Link} from "react-router-dom";

const RestaurantsList = props => {

    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]);
    //we need all these variables because when users will search for something, we need to store that data in our state variable

    useEffect(() => {
        retrieveRestaurants();
        retrieveCuisines();
    }, []);                 //useEffect is used to tell the react component to do something after it is rendered. So, after rendering it will retrieveRestaurants() and retrieveCuisines()
    
    
    const onChangeSearchName = e => {
        const searchName = e.target.value;
        setSearchName(searchName);
      };
    
      const onChangeSearchZip = e => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
      };
    
      const onChangeSearchCuisine = e => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
        
      };
    
      const retrieveRestaurants = () => {
        RestaurantDataService.getAll()
          .then(response => {
            console.log(response.data);
            setRestaurants(response.data.restaurants);      //setter-function of restaurants state -> sets the data to response.data.restaurants
          })
          .catch(e => {
            console.log(e);
          });
      };
    
      const retrieveCuisines = () => {
        RestaurantDataService.getCuisines()
          .then(response => {
            console.log(response.data);
            setCuisines(["All Cuisines"].concat(response.data));
          })
          .catch(e => {
            console.log(e);
          });
      };
    
      const refreshList = () => {
        retrieveRestaurants();
      };
    
      const find = (query, by) => {
        RestaurantDataService.find(query, by)
          .then(response => {
            console.log(response.data);
            setRestaurants(response.data.restaurants);
          })
          .catch(e => {
            console.log(e);
          });
      };
    
      const findByName = () => {
        find(searchName, "name")
      };
    
      const findByZip = () => {
        find(searchZip, "zipcode")
      };
    
      const findByCuisine = () => {
        if (searchCuisine == "All Cuisines") {
          refreshList();
        } else {
          find(searchCuisine, "cuisine")
        }
      };
    
      return (
        <div>
          <div className="row pb-1">
            <div className="input-group col-lg-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchName}
                onChange={onChangeSearchName}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByName}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="input-group col-lg-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by zip"
                value={searchZip}
                onChange={onChangeSearchZip}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByZip}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="input-group col-lg-4">
    
              <select onChange={onChangeSearchCuisine}>
                 {cuisines.map(cuisine => {
                   return (
                     <option value={cuisine}> {cuisine.substr(0, 20)} </option>
                   )
                 })}
              </select>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByCuisine}
                >
                  Search
                </button>
              </div>
    
            </div>
          </div>
          <div className="row">
            {restaurants.map((restaurant) => {      //for each restaurant
              const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`; //we are going to get the restaurant address(address in the DB has 3 different fields - building, street, zipcode) and we will return 3 cards - name,cuisine, address and a link to view reviews which points to ""/restaurants/"+restaurant._id" and address shown on a map
              return (
                <div className="col-lg-4 pb-1">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{restaurant.name}</h5>
                      <p className="card-text">
                        <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                        <strong>Address: </strong>{address}
                      </p>
                      <div className="row">
                      <Link to={"/restaurants/"+restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                        View Reviews
                      </Link>
                      <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
    
    
          </div>
        </div>
      );
    };
    
    export default RestaurantsList;