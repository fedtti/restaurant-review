/**
 * Define global variables.
 */
let restaurant;
let map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.map = new google.maps.Map(document.getElementsByClassName('body__main__section__div')[0], {
                zoom: 16,
                center: restaurant.latlng,
                scrollwheel: false
            });
            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
        }
    });
}

/**
 * Get current restaurant from page URL.
 */
let fetchRestaurantFromURL = callback => {
    if (self.restaurant) { // Restaurant already fetched!
        callback(null, self.restaurant)
        return;
    }
    const ID = getParameterByName('id');
    if (!ID) { // No ID found in URL
        error = 'No restaurant id in URL';
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(ID, (error, restaurant) => {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.error(error);
                return;
            }
            fillRestaurantHTML();
            callback(null, restaurant)
        });
    }
};

/**
 * Create restaurant HTML and add it to the webpage.
 */
let fillRestaurantHTML = (restaurant = self.restaurant) => {
    const NAME = document.getElementsByClassName("body__main__section__h2")[0];
    NAME.innerHTML = restaurant.name;

    const IMAGE = document.getElementsByClassName("body__main__section__img")[0];
    IMAGE.setAttribute("alt", `Image of ${restaurant.name} in ${restaurant.neighborhood}`);
    IMAGE.src = DBHelper.imageUrlForRestaurant(restaurant);

    const CUISINE = document.getElementsByClassName("body__main__section__p")[0];
    CUISINE.innerHTML = restaurant.cuisine_type;

    const ADDRESS = document.getElementsByClassName("body__main__section__p")[1];
    ADDRESS.innerHTML = restaurant.address;

    // Fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }

    // Fill reviews
    fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
let fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const HOURS = document.getElementsByClassName("body__main__section__table")[0];
    for (let key in operatingHours) {
        const ROW = document.createElement("tr");
        const DAY = document.createElement("td");
        DAY.innerHTML = key;
        ROW.appendChild(DAY);
        const TIME = document.createElement("td");
        TIME.innerHTML = operatingHours[key];
        ROW.appendChild(TIME);
        HOURS.appendChild(ROW);
    }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
let fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const CONTAINER = document.getElementsByClassName("body__main__section")[2];
    const TITLE = document.createElement("h3");
    TITLE.className = "body__main__section__h3";
    TITLE.innerHTML = "Reviews";
    CONTAINER.appendChild(TITLE);

    if (!reviews) {
        const NOREVIEWS = document.createElement("p");
        NOREVIEWS.innerHTML = "No reviews yet!";
        CONTAINER.appendChild(NOREVIEWS);
        return;
    }

    const UL = document.getElementsByClassName("body__main__section__ul")[0];
    reviews.forEach(review => {
        UL.appendChild(createReviewHTML(review));
    });
    CONTAINER.appendChild(UL);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
    const LI = document.createElement("li");
    LI.className = "body__main__section__ul__li";
    const NAME = document.createElement("p");
    NAME.className = "body__main__section__ul__li__p";
    NAME.innerHTML = review.name;
    LI.appendChild(NAME);

    const DATE = document.createElement("p");
    DATE.className = "body__main__section__ul__li__p";
    DATE.innerHTML = review.date;
    LI.appendChild(DATE);

    const RATING = document.createElement("p");
    RATING.className = "body__main__section__ul__li__p";
    RATING.innerHTML = `Rating: ${review.rating}`;
    LI.appendChild(RATING);

    const COMMENTS = document.createElement("p");
    COMMENTS.className = "body__main__section__ul__li__p";
    COMMENTS.innerHTML = review.comments;
    LI.appendChild(COMMENTS);

    return LI;
}

/**
 * Add restaurant name to the breadcrumb navigation menu.
 */
let fillBreadcrumb = (restaurant = self.restaurant) => {
    const BREADCRUMB = document.getElementsByClassName("body__main__nav__ul")[0];
    const LI = document.createElement("li");
    LI.className = "body__main__nav__ul__li -small";
    LI.innerHTML = restaurant.name;
    BREADCRUMB.appendChild(LI);
};

/**
 * Get a parameter by name from page URL.
 */
let getParameterByName = (name, url) => {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const REGEX = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    let results = REGEX.exec(url);
    if (!results) {
        return null;
    } else if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};