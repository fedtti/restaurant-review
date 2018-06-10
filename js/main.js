/**
 * Define global variables.
 */
let restaurants;
let neighborhoods;
let cuisines;
let map;
let markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", event => {
    fetchNeighborhoods();
    fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
let fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
};

/**
 * Set neighborhoods HTML.
 */
let fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const SELECT = document.getElementsByClassName("body__main__section__form__select")[0];
    neighborhoods.forEach(neighborhood => {
        const OPTION = document.createElement("option");
        OPTION.innerHTML = neighborhood;
        OPTION.value = neighborhood;
        SELECT.append(OPTION);
    });
};

/**
 * Fetch all cuisines and set their HTML.
 */
let fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
};

/**
 * Set cuisines HTML.
 */
let fillCuisinesHTML = (cuisines = self.cuisines) => {
    const SELECT = document.getElementsByClassName("body__main__section__form__select")[1];
    cuisines.forEach(cuisine => {
        const OPTION = document.createElement("option");
        OPTION.innerHTML = cuisine;
        OPTION.value = cuisine;
        SELECT.append(OPTION);
    });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    let loc = {
        lat: 40.722216,
        lng: -73.987501
    };
    self.map = new google.maps.Map(document.getElementsByClassName("body__main__section__div")[0], {
        zoom: 12,
        center: loc,
        scrollwheel: false
    });
    updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
const CSELECT = document.getElementsByClassName("body__main__section__form__select")[1];
const NSELECT = document.getElementsByClassName("body__main__section__form__select")[0];
let updateRestaurants = () => {
    const CINDEX = CSELECT.selectedIndex;
    const NINDEX = NSELECT.selectedIndex;
    const CUISINE = CSELECT[CINDEX].value;
    const NEIGHBORHOOD = NSELECT[NINDEX].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(CUISINE, NEIGHBORHOOD, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    });
};
NSELECT.addEventListener("change", updateRestaurants, false);
CSELECT.addEventListener("change", updateRestaurants, false);

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
let resetRestaurants = restaurants => {
    // Remove all restaurants
    self.restaurants = [];
    const UL = document.getElementsByClassName("body__main__section__ul")[0];
    UL.innerHTML = "";

    // Remove all map markers
    self.markers = markers;
    self.markers.forEach(m => m.setMap(null));
    self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
let fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const UL = document.getElementsByClassName("body__main__section__ul")[0];
    if (restaurants.length !== 0) {
        restaurants.forEach(restaurant => {
            UL.append(createRestaurantHTML(restaurant));
        });
    } else {
        const LI = document.createElement("li");
        LI.className = "body__main__section__ul__li -flex-item";
        LI.innerHTML = "Sorry, no available restaurants."
        UL.append(LI);
    }
    addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
let createRestaurantHTML = restaurant => {
    const LI = document.createElement("li");
    LI.className = "body__main__section__ul__li -flex-item";

    const NAME = document.createElement("h3");
    NAME.className = "body__main__section__ul__li__h3";
    NAME.innerHTML = restaurant.name;
    LI.append(NAME);

    const IMAGE = document.createElement("img");
    IMAGE.className = "body__main__section__ul__li__img";
    IMAGE.setAttribute('alt', `Image of ${restaurant.name} Restaurant in ${restaurant.neighborhood}`);
    IMAGE.src = DBHelper.imageUrlForRestaurant(restaurant);
    LI.append(IMAGE);

    const NEIGHBORHOOD = document.createElement("p");
    NEIGHBORHOOD.className = "body__main__section__ul__li__p";
    NEIGHBORHOOD.innerHTML = restaurant.neighborhood;
    LI.append(NEIGHBORHOOD);

    const ADDRESS = document.createElement("p");
    ADDRESS.className = "body__main__section__ul__li__p";
    ADDRESS.innerHTML = restaurant.address;
    LI.append(ADDRESS);

    const MORE = document.createElement("a");
    MORE.className = "body__main__section__ul__li__a -small";
    MORE.innerHTML = "View Details";
    MORE.href = DBHelper.urlForRestaurant(restaurant);
    LI.append(MORE)

    return LI;
};

/**
 * Add markers for current restaurants to the map.
 */
let addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach(restaurant => {
        // Add marker to the map
        const MARKER = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(MARKER, "click", () => {
            window.location.href = MARKER.url;
        }, false);
        self.markers.push(MARKER);
    });
};