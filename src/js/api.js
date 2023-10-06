import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "39805507-98a380d83b6dbf250f682b86d";
const IMAGE_TYPE = "photo";
const ORIENTATION = "horizontal";
const SAFESEARCH = "true";
const PER_PAGE = "40";


async function getPictures(userSearch, PAGE) {
    try {
        const URL = `${BASE_URL}?key=${API_KEY}&q=${userSearch}&image_type=${IMAGE_TYPE}
    &orientation&=${ORIENTATION}&safesearch=${SAFESEARCH}&per_page=${PER_PAGE}&page=${PAGE}`;
        const response = await axios.get(URL);
    return response.data;
    } catch (error) {
        console.log(error.message)
    }
    
}
export { getPictures };

