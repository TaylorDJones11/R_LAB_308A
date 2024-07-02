import * as Carousel from './Carousel.js';
import axios from 'axios';

const API_KEY =
  'live_GQbeJp23hPbmUCJKMKaJGWX8GMp537SBEKmT3129c9I20cAE6SVQ63cbccBJ3N19';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.getElementById('breedSelect');
  const infoDump = document.getElementById('infoDump');
  const progressBar = document.getElementById('progressBar');
  const getFavouritesBtn = document.getElementById('getFavouritesBtn');

  const initialLoad = async () => {
    try {
      const url = `https://api.thecatapi.com/v1/breeds`;
      const res = await fetch(url);
      const cats = await res.json();
      createOption(cats);
    } catch (error) {
      console.log(error);
    }
  };

  const createOption = (cats) => {
    cats.forEach((cat) => {
      const option = document.createElement('option');
      option.setAttribute('value', cat.id);
      option.textContent = cat.name;
      breedSelect.appendChild(option);
    });
  };

  initialLoad();

  breedSelect.addEventListener('change', async (e) => {
    const breedID = e.target.value;
    await fetchBreedInfo(breedID);
  });

  const fetchBreedInfo = async (id) => {
    try {
      const url = `https://api.thecatapi.com/v1/images/search?limit=20&breed_ids=${id}&api_key=${API_KEY}`;
      const res = await fetch(url);
      const breeds = await res.json();
      console.log('Breed Info:', breeds);
      updateCarousel(breeds);
      updateInfoDump(breeds[0].breeds[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCarousel = (breeds) => {
    Carousel.clear();
    breeds.forEach((item) => {
      const carouselItem = Carousel.createCarouselItem(
        item.url,
        item.breeds[0].name,
        item.id
      );
      Carousel.appendCarousel(carouselItem);
    });
    Carousel.start();
  };

  const updateInfoDump = (breed) => {
    infoDump.innerHTML = '';
    const breedInfo = `
      <h2>${breed.name}</h2>
      <p>${breed.description}</p>
      <p><strong>Temperament:</strong> ${breed.temperament}</p>
      <p><strong>Origin:</strong> ${breed.origin}</p>
      <p><strong>Life span:</strong> ${breed.life_span} years</p>
    `;
    infoDump.innerHTML = breedInfo;
  };
});

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
// export async function favourite(imgId) {
//   // your code here
// }

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
