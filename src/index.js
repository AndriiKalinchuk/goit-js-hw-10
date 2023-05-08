import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector(`.country-info`);

input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(e) {
  e.preventDefault();

  const searchCountries = e.target.value.trim();

  if (!searchCountries) {
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchCountries)
    .then(result => {
      if (result.length > 10) {
        Notify.info(
          'Too many matches found. Please, enter a more specific name.'
        );
        return;
      }
      renderedCountries(result);
    })
    .catch(error => {
      countriesList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderedCountries(result) {
  const inputQuantity = result.length;

  if (inputQuantity === 1) {
    countriesList.innerHTML = '';
    countryCardMarkup(result);
  }

  if (inputQuantity > 1 && inputQuantity <= 10) {
    countryInfo.innerHTML = '';
    countriesListMarkup(result);
  }
}

function countriesListMarkup(result) {
  const listMarkup = result
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${name}" width="60" height="auto">
        <span>${name.official}</span>
      </li>`;
    })
    .join('');
  countriesList.innerHTML = listMarkup;
  return listMarkup;
}

function countryCardMarkup(result) {
  const cardMarkup = result
    .map(({ flags, name, capital, population, languages }) => {
      languages = Object.values(languages).join(', ');
      return `
            <img src="${flags.svg}" alt="${name}" width="240" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`;
    })
    .join('');
  countryInfo.innerHTML = cardMarkup;
  return cardMarkup;
}
