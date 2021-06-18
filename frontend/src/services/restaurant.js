// using axios for POST,GET,DELETE requests
import http from "../http-common";

//Here  we will make functions that do API calls and return the information from the API calls
class RestaurantDataService {

    getAll(page = 0) {
        return http.get(`restaurants?page=${page}`);
    }

    get(id) {
        return http.get(`/restaurant?id=${id}`);
    }

    find(query, by = "name", page = 0) {
        return http.get(`restaurants?${by}=${query}&page=${page}`)
    }

    createReview(data) {
        return http.post("/review-new", data);
    }

    updateReview(data) {
        return http.put("/review-edit", data);
    }

    deleteReview(id, userId) {
        return http.delete(`/review-delete?id=${id}`, {data:{user_id: userId}});       //{data:{user_id: userId}} This part is added because when we delete an review our backend code expects a userId also   //This is not the best practice, i.e to send userId in the body of the request to the server
    }

    getCuisines(id) {
        return http.get(`/cuisines`);
    }

}

export default new RestaurantDataService();