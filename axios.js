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
      const { data: breeds } = await axios.get(`/images/search`, {
        params: {
          limit: 20,
          breed_ids: id,
        },
      });
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

// Add Axios interceptors
axios.interceptors.request.use(
  (config) => {
    console.log('Request started at:', new Date().toISOString());
    config.metadata = { startTime: new Date() };
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
    console.log('Request ended at:', endTime.toISOString());
    console.log('Request duration:', duration, 'ms');
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
