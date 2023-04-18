import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 00;

const inputElement = document.querySelector('#search-box');
const countryListElement = document.querySelector('.country-list');
const countryInfoElement = document.querySelector('.country-info');

inputElement.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const searchValue = event.target.value.trim();

  if (searchValue === '') {
    clearCountryList();
    clearCountryInfo();
    return;
  }

  fetchCountries(searchValue)
    .then(countries => showCountryData(countries))
    .catch(error => errorCountryData());
}

function clearCountryList() {
  countryListElement.innerHTML = '';
}

function clearCountryInfo() {
  countryInfoElement.innerHTML = '';
}

function showCountryData(countries) {
  if (countries.length >= 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length === 1) {
    inputElement.style.backgroundColor = '#a2f19b';
    makeMarkupCountriesList(countries, 'titleForOneCountry');
    makeMarkupCountryInfo(countries);
  } else {
    inputElement.style.backgroundColor = '#dceb5c';
    makeMarkupCountriesList(countries);
    clearCountryInfo();
  }
}

function errorCountryData() {
  clearCountryInfo();
  clearCountryList();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function makeMarkupCountriesList(countries, className) {
  let markupCountriesList = '';
  markupCountriesList = countries.reduce(
    (acc, { flags: { svg }, name: { common } }) => {
      acc += `
        <li>
          <img src="${svg}" width="40" height="25">
          <p class="${
            className ? className : 'titleForAllCountries'
          }">${common}</p>
        </li>
        `;
      return acc;
    },
    ''
  );

  countryListElement.innerHTML = markupCountriesList;
}

function makeMarkupCountryInfo(countries) {
  const { capital, population, languages } = countries[0];
  const markupCountryInfo = `
    <p><span class="title">Capital:</span> ${capital}</p>
    <p><span class="title">Population:</span> ${population}</p>
    <p><span class="title">Languages:</span> ${Object.values(languages).join(
      ', '
    )}</p>
  `;
  countryInfoElement.innerHTML = markupCountryInfo;
}
