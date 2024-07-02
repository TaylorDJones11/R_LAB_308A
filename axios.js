import * as Carousel from './Carousel.js';
import axios from 'axios';

const API_KEY =
  'live_GQbeJp23hPbmUCJKMKaJGWX8GMp537SBEKmT3129c9I20cAE6SVQ63cbccBJ3N19';

axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] = API_KEY;

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.getElementById('breedSelect');
  const infoDump = document.getElementById('infoDump');
  const progressBar = document.getElementById('progressBar');
  const getFavouritesBtn = document.getElementById('getFavouritesBtn');

  const initialLoad = async () => {
    try {
      const { data: cats } = await axios.get('/breeds');
      createOption(cats);
    } catch (error) {
      console.error('Error loading breeds', error);
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
      const { data: breeds } = await axios.get(`/images/search`, {
        params: {
          limit: 10,
          breed_ids: id,
        },
        onDownloadProgress: updateProgress,
      });

      updateCarousel(breeds);
      updateInfoDump(breeds[0].breeds[0]);
    } catch (error) {
      console.error('Error fetching breed info', error);
    }
  };

  const updateCarousel = (breeds) => {
    Carousel.clear();
    breeds.forEach((item) => {
      const carouselItem = Carousel.createCarouselItem(
        item.url,
        item.breeds.name,
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

  const updateProgress = (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    progressBar.style.width = `${percentCompleted}%`;
    console.log('Progress Event', progressEvent);
  };

  // Add Axios interceptors
  axios.interceptors.request.use(
    (config) => {
      config.metadata = { startTime: new Date() };
      document.body.style.cursor = 'progress';
      if (progressBar) {
        progressBar.style.width = '0%'; // Reset progress bar
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;

      document.body.style.cursor = 'default';
      return response;
    },
    (error) => {
      document.body.style.cursor = 'default';
      return Promise.reject(error);
    }
  );

  // Function to get and display favourite images
  const getFavourites = async () => {
    try {
      const { data: favourites } = await axios.get('/favourites');
      const favouriteImages = favourites.map((fav) => ({
        url: fav.image.url,
        breeds: fav.image.breeds,
      }));
      updateCarousel(favouriteImages);
    } catch (error) {
      console.error('Error fetching favourites', error);
    }
  };

  getFavouritesBtn.addEventListener('click', getFavourites);
});

// Favourite function
export async function favourite(imgId) {
  try {
    // Check if the image is already a favourite
    const { data: favourites } = await axios.get('/favourites');
    const favourite = favourites.find((fav) => fav.image_id === imgId);

    if (favourite) {
      // If the image is already a favourite, delete it
      await axios.delete(`/favourites/${favourite.id}`);
      console.log(`Image ${imgId} removed from favourites`);
    } else {
      // If the image is not a favourite, add it
      await axios.post('/favourites', {
        image_id: imgId,
      });
      console.log(`Image ${imgId} added to favourites`);
    }
  } catch (error) {
    console.error('Error toggling favourite', error);
  }
}
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
