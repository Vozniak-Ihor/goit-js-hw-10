import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputElement = document.querySelector('#search-box');
const countryListElement = document.querySelector('.country-list');
const allCountryListElement = document.querySelector('.all-country-list');
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
    inputElement.style.borderColor = '#26c0d3';
    inputElement.style.borderWidth = '5px';
    makeMarkupCountriesAllList(countries);
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length === 1) {
    inputElement.style.borderColor = '#a2f19b';
    inputElement.style.borderWidth = '5px';
    makeMarkupCountriesList(countries);
    makeMarkupCountryInfo(countries);
  } else {
    makeMarkupCountriesList(countries);
    allCountryListElement.innerHTML = '';
    clearCountryInfo();
  }
}

function errorCountryData() {
  inputElement.style.borderColor = 'red';
  inputElement.style.borderWidth = '5px';
  inputElement.style.color = 'red';
  clearCountryInfo();
  clearCountryList();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function makeMarkupCountriesList(countries) {
  const markupCountriesList = countries
    .map(({ flags: { svg }, name: { common } }) => {
      return `
      <li>
        <img src="${svg}" width="40" height="25">
        <p>${common}</p>
      </li>
    `;
    })
    .join('');

  countryListElement.innerHTML = markupCountriesList;
}
function makeMarkupCountriesAllList(countries) {
  const markupCountriesList = countries
    .map(({ flags: { svg } }) => {
      return `
      <li>
        <img src="${svg}" width="40" height="25">
      </li>
    `;
    })
    .join('');

  allCountryListElement.innerHTML = markupCountriesList;
}

function makeMarkupCountryInfo(countries) {
  const { capital, population, languages } = countries[0];
  const markupCountryInfo = `
    <p><span class="title">Capital:</span> ${capital}</p>
    <p><span class="title">Population:</span> ${population}</p>
    <p><span class="title">Languages:</span> ${Object.values(languages).join(
      ', '
    )}</p>`;
  countryInfoElement.innerHTML = markupCountryInfo;
  console.log(Object.values);
}
