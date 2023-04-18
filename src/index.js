import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 600;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(OnInputEl, DEBOUNCE_DELAY));

const classForNameOneCountry = 'titleForOneCountry';

function OnInputEl(e) {
  valueOnInputEl = e.target.value.trim();
  console.log(valueOnInputEl);
  if (valueOnInputEl === '') {
    clierCountryListEl();
    clierCountryInfoEl();
    return;
  }
  return fetchCountries(valueOnInputEl)
    .then(countries => showCountryData(countries))
    .catch(eror => errorCountryData());
}

function clierCountryListEl() {
  countryListEl.innerHTML = '';
}

function clierCountryInfoEl() {
  countryInfoEl.innerHTML = '';
}

function showCountryData(countries) {
  if (countries.length >= 10) {
    // inputEl.style.backgroundColor = 'rgba(10, 208, 238, 0.2)';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (arreyOfCountries.length === 1) {
    inputEl.style.backgroundColor = '#a2f19b';
    makeMarkupCountriesList(arreyOfCountries, className);
    makeMarkupCountryInfo(arreyOfCountries);
  } else if (arreyOfCountries.length >= 2 && arreyOfCountries.length < 10) {
    makeMarkupCountriesList(arreyOfCountries);
    inputEl.style.backgroundColor = '#dceb5c';
    countryInfo.innerHTML = '';
  }
}

function errorCountryData() {
  clierCountryInfoEl();
  clierCountryListEl();
  // inputEl.style.borderColor = 'red';
  // inputEl.style.color = 'red';
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function makeMarkupCountriesList(arreyOfCountries, classForNameOneCountry) {
  let markupCountiesList = '';
  markupCountiesList = arreyOfCountries.reduce(
    (acc, { flags: { svg }, name: { common } }) => {
      acc += `<li>
          <img src="${svg}" width="40" height="25">
          <p class=${
            classForNameOneCountry
              ? classForNameOneCountry
              : 'classForNameAllCountries'
          }>${common}</li>`;
      return acc;
    },
    ''
  );

  countryListEl.innerHTML = markupCountiesList;
}

function makeMarkupCountryInfo(arreyOfCountries) {
  let markupCountryInfo = '';
  markupCountryInfo = arreyOfCountries.reduce(
    (acc, { capital, population, languages }) => {
      acc += `
          <p><span class="title">Capital:</span> ${capital}</p>
          <p><span class="title">Population:</span> ${population}</p>
          <p><span class="title">Languages:</span> ${Object.values(
            languages
          ).join(',')}</p>
          `;
      return acc;
    },
    ''
  );
  countryInfo.innerHTML = markupCountryInfo;
}
