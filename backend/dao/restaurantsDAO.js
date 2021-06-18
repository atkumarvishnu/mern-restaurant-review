import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID

let restaurants     //we will use this variable to store a reference to our DB

export default class RestaurantsDAO {
    static async injectDB(conn) {       //injectDB is the method using which we connect to our DB, we call this method as soon as our server starts
        if (restaurants) {      //if restaurants is already filled we will simply return
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")    //if restaurants is not filled we will fill it with a reference to that specific DB 
        } catch(e) {    //if we don't successfully get the restaurants we will catch an error
            console.error(
                `Unable to establish a collection handle in resturantsDAO: ${e}`,
            )
        }
    }


static async getRestaurants({  // we will call this when we need to get all the restaurants in the DB
    filters = null,     // when we call thsi method we can specify which filters we want - i.e - sort things based on the name of the restaurants, the zip code, or the cuisine
    page = 0,   // what page number we want
    restaurantsPerPage = 20,    //default to 20 restaurants per page
    } = {}) {
    let query
    if (filters) {
        if ("name" in filters) {                                    //name filter - we can search by the name of the restaurants
            query = { $text: { $search: filters["name"] } }         //this is a text search -> we will need to set this up in atlas i.e if someone searches a name then which field in the DB needs to be searched
        } else if ("cuisine" in filters) {                          //cuisine filter - we can search by the cuisines of the restaurants
            query = { "cuisine": { $eq: filters["cuisine"] } }      //$eq means equals 
        } else if ("zipcode" in filters) {                          //zipcode filter - we can search by the zipcodes of the restaurants
            query = { "address.zipcode": { $eq: filters["zipcode"] } }
        }
    }


    let cursor

    try {
        cursor = await restaurants
            .find(query)                      //this will find all the restaurants from the DB that go along with the query that we passed in
    } catch(e) {
        console.error(`Unable to issue the find command, ${e}`)
        return { restaurantsList: [], totalNumRestaurants: 0}       //else we catch an error and return an empty list and the totalnumberofrestaurants as 0
    }

    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)    //if there is no error then we are going to limit the results to restaurantsPerPage, and to get the actual page number we do a skip (we are going to skip from the beginning to whatever page we are at) 

    try {
        const restaurantsList = await displayCursor.toArray()                   //then we set displayCursor to an array
        const totalNumRestaurants = await restaurants.countDocuments(query)      //to get the totalNumRestaurants we just have to count the total numbers of documents in the query

        return { restaurantsList, totalNumRestaurants }
    } catch (e) {
        console.error(
            `Unable to convert to array or problem counting documents, ${e}`    
        )   
        return { restaurantsList: [], totalNumRestaurants: 0 }                    //if there is an error we just return this <-
    }
}

    static async getRestaurantByID(id) {    //here we are trying to get reviews from one collection and putting it in restaurants
        try {
        const pipeline = [
            {
                $match: {               //to get access to object id we have to add code, import mongodb from "mongodb", constObjectId = mongodb.ObjectID
                    _id: new ObjectId(id),      //we are matching a specific restaurant
                },
            },
                {                           //This is part of MongoDB aggregation pipeline, $lookup is only one part of it, 
                    $lookup: {              //aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines //documents enter a multi-staged pipeline that transforms the documents into aggregated results. It's very Powerful! MongoDB atlas data explorer and Compass can assist in creating pipelines
                        from: "reviews",            //from the reviews collection we are going to create this pipeline
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],    //we are going to match all the reviews to the restaurant_id
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",                  //and we are going to set it to reviews
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",            //we are going to add a field of reviews in our DB
                    },
                },
            ]
        return await restaurants.aggregate(pipeline).next()     //we're going to aggregate the pipeline and return that next item which is the restaurant with all the reviews connected
        } catch (e) {
        console.error(`Something went wrong in getRestaurantByID: ${e}`)
        throw e
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
        cuisines = await restaurants.distinct("cuisine")    //we will get each cuisine one time(distinct)
        return cuisines     
        } catch (e) {
        console.error(`Unable to get cuisines, ${e}`)
        return cuisines
        }
    }
    }