/**
 * Common database helper functions.
 */
class DBHelper {
    /**
     * Database URL.
     */
    static get DATABASE_URL() {
        const PORT = 8080; // Change this to your server port
        return `http://localhost:${PORT}/data/restaurants.json`;
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", DBHelper.DATABASE_URL);
        xhr.onload = () => {
            if (xhr.status === 200) { // Got a success response!
                const DATA = JSON.parse(xhr.responseText);
                const RESTAURANTS = DATA.restaurants;
                callback(null, RESTAURANTS);
            } else { // Got an error!
                const ERROR = (`Request failed. Returned status of ${xhr.status}`);
                callback(ERROR, null);
            }
        };
        xhr.send();
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        // fetch all restaurants with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                const RESTAURANT = restaurants.find(r => r.id == id);
                if (RESTAURANT) { // Got the restaurant
                    callback(null, RESTAURANT);
                } else { // Restaurant does not exist in the database
                    callback('Restaurant does not exist', null);
                }
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const RESULTS = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, RESULTS);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) { // Got an error!
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const RESULTS = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, RESULTS);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) { // Got an error!
                callback(error, null);
            } else {
                let results = restaurants;
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) { // Got an error!
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const NEIGHBORHOODS = restaurants.map((v, i) => restaurants[i].neighborhood);
                // Remove duplicates from neighborhoods
                const UNIQUENEIGHBORHOODS = NEIGHBORHOODS.filter((v, i) => NEIGHBORHOODS.indexOf(v) == i);
                callback(null, UNIQUENEIGHBORHOODS);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) { // Got an error!
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const CUISINES = restaurants.map((v, i) => restaurants[i].cuisine_type);
                // Remove duplicates from cuisines
                const UNIQUECUISINES = CUISINES.filter((v, i) => CUISINES.indexOf(v) == i);
                callback(null, UNIQUECUISINES);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`/restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        return (`/img/${restaurant.photograph}`);
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const MARKER = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP
        });
        return MARKER;
    }
}