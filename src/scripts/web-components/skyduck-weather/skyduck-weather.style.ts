import {
    LocationIcon,
    SkyduckIcon,
    Spinner,
    CircleIcon
} from './css-icons/index';

const spinner = new Spinner(30, 'var(--skyblue)');
const skyduckIcon = new SkyduckIcon(50, 'var(--skyblue)');
const locationIcon = new LocationIcon(30, 'var(--skyblue)');
const circleIcon = new CircleIcon(30, 'var(--gray)');

export const style = `
@import url('https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&display=swap');
@import url('https://fonts.googleapis.com/css?family=Luckiest+Guy&display=swap');

${circleIcon.style}
.icon-circle.--red {
    border-color: var(--red);
}
.icon-circle.--amber {
    border-color: var(--amber);
}
.icon-circle.--green {
    border-color: var(--green);
}

${locationIcon.style}

${skyduckIcon.style}

${spinner.style}

* {
    box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5 {
    margin: 0;
}

a {
    color: cornflowerblue;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}

:host {
    position: relative;
    display: block;
    width: 100%;
    min-height: 100vh;
    background-color: var(--white);
    user-select: none;
    overflow: hidden;
    font-family: Roboto, sans-serif;
    font-size: 16px;
    color: var(--black);

    --red: rgb(255, 99, 71, .8);
    --amber: rgba(255, 165, 0, .8);
    --green: rgba(34, 139, 34, .8);

    --white: #fff;
    --black: #222;
    --pink: hotpink;
    --skyblue: lightskyblue;
    --gray: #999;
    --lightgray: lightgray;
}
@media (max-width: 320px) {
    :host {
        font-size: 14px;
    }
}
@media (min-width: 768px) {
    :host {
        font-size: 20px;
    }
}
@media (min-width: 1024px) {
    :host {
        font-size: 24px;
    }
}

.loader {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-color: var(--white);
    color: var(--gray);
    padding: 10px;
    font-size: 1.2em;
}
:host(.--ready) .loader {
    display: none;
}
.loader__error {
    display: none;
    text-align: center;
    border: solid 3px var(--red);
    padding: 10px;
    max-width: 450px;
    color: var(--red);
}
:host(.--error) .loader__error {
    display: block;
}
.loader-info {
    position: absolute;
    top: 10px;
    left: 10px;
}
.loader-info__place {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: calc(100vw - 20px);
}
:host(.--error) .loader__spinner {
    display: none;
}

.header {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    color: var(--skyblue);
    padding: 10px 10px 0 10px;
}
.header-title-container {
    position: relative;
    display: flex;
    align-items: center;
}
.header-title-container__title {
    font-family: 'Luckiest Guy', cursive;
    justify-self: left;
    padding: 10px;
}
.header-title-container__title-stripe {
    position: absolute;
    top: 0;
    left: 60px;
    width: 5px;
    height: 100%;
    background: var(--white);
    transform: rotate(45deg);
}
.header__skyduck-logo {
    width: 220px;
}
.header__location-icon {
    align-self: start;
    cursor: pointer;
}

.search {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 10px;
}
.search__radios {
    display: grid;
    grid-row-gap: 5px;
}
.search__club-list-link {
    cursor: pointer;
    justify-self: left;
}

.club-info-grid {
    display: grid;
    grid-row-gap: 10px;
    padding: 0 10px;
}
.club-info-grid__map {
    width: 100%;
    background-color: #eee;
}
.club-info-grid-location-info {
    display: grid;
}
.club-info-grid-location-info__site-link {
    justify-self: start;
    margin-top: 10px;
}
.club-info-grid-location-info-header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: 10px;
}
.club-info-grid-location-info-header__local-time {
    color: var(--gray);
    white-space: nowrap;
}

#forecastCarousel {
    max-width: 768px;
    margin: 0 auto;
}

.forecast-slide-selectors {
    display: grid;
    grid-template-columns: repeat(8, auto);
    gap: 5px;
    height: 40px;
    max-width: 450px;
    margin: 0 auto;
    padding: 20px 10px 0 10px;
}
.forecast-slide-selectors__item {
    cursor: pointer;
    transform-origin: right;
    transform: skewY(10deg);
    opacity: .5;
}
.forecast-slide-selectors__item.--active {
    opacity: 1;
}
.forecast-slide-selectors__item.--red {
    background-color: var(--red);
}
.forecast-slide-selectors__item.--amber {
    background-color: var(--amber);
}
.forecast-slide-selectors__item.--green {
    background-color: var(--green);
}

.forecast-grid {
    display: grid;
    grid-template-rows: auto repeat(3, 1fr);
    grid-template-columns: 100%;
    grid-row-gap: 10px;
    padding: 10px;
}
:host(:not(.--ready)) .forecast-grid {
    display: none;
}
.forecast-grid-header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: repeat(2, auto);
    gap: 10px;
    align-items: center;
    border-left: solid 10px var(--lightgray);
    padding-left: 10px;
}
.forecast-grid-header.--red {
    border-color: var(--red);
}
.forecast-grid-header.--amber {
    border-color: orange;
}
.forecast-grid-header.--green {
    border-color: var(--green);
}
.forecast-grid-header-date {
    display: flex;
    align-items: center;
    justify-content: left;
}
.forecast-grid-header-date__date-string {
    margin-left: 5px;
}
.forecast-grid-header__summary {
    grid-row: 2;
    grid-column: 1 / span 2;
}
.forecast-grid-header-sun-info__item {
    text-align: right;
    white-space: nowrap;
    padding: 5px;
    font-weight: normal;
}
.forecast-grid-header-sun-info__item.--sunset {
    background-color: #eee;
    color: var(--gray);
    font-size: 24px;
}
.forecast-grid-forecast {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    grid-column-gap: 10px;
}
.forecast-grid-forecast__weather-photo {
    grid-column: 1 / span 2;
    grid-row: 1;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

@media (min-aspect-ratio: 1/1) {
    .forecast-grid-forecast__weather-photo {
        min-height: calc(768px / 4);
    }
}

.forecast-grid-forecast__time {
    margin: 0 0 10px 10px;
    background-color: rgba(255, 255, 255, .8);
    color: #222;
    grid-column: 1;
    grid-row: 1;
    padding: 10px;
    justify-self: left;
}
.forecast-grid-forecast__time span {
    border-bottom: solid 5px #222;
}
.forecast-grid-forecast__time.--red span {
    border-color: var(--red);
}
.forecast-grid-forecast__time.--amber span {
    border-color: var(--amber);
}
.forecast-grid-forecast__time.--green span {
    border-color: var(--green);
}
.forecast-grid-forecast-weather {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    align-items: center;
    padding: 5px 0;
    overflow: hidden;
}
.forecast-grid-forecast-weather__type {
    flex-grow: 1;
    margin-right: 10px;
    word-break: break-word;
    height: 100%;
}
@media (min-width: 768px) {
    .forecast-grid-forecast-weather__type {
        font-size: 22px;
    }
}
.forecast-grid-forecast-weather__temperature {
    align-self: start;
}
.forecast-data-grid {
    grid-column: 2;
    grid-row: 1 / span 2;
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: 80px auto;
    grid-column-gap: 5px;
    align-self: end;
}
.forecast-data-grid__type {
    display: grid;
    justify-items: center;
    align-items: center;
    background: rgba(255, 255, 255, .8);
    padding: 10px;
}
.forecast-data-grid__type.--wind-speed {
    display: none;
}
.forecast-data-grid__data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
}
.forecast-data-grid__data.--wind-speed {
    display: none;
}
.forecast-data-grid__data.--red {
    background-color: var(--red);
    color: var(--white);
}
.forecast-data-grid__data.--amber {
   background-color: var(--amber);
}
.forecast-data-grid__data.--green {
    background-color: var(--green);
    color: var(--white);
}
@media (min-width: 640px) {
    .forecast-data-grid {
        grid-template-columns: repeat(4, auto);
    }
    .forecast-data-grid__type.--wind-speed {
        display: grid;
    }
    .forecast-data-grid__data.--wind-speed {
        display: flex;
    }
}

.footer {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 10px;
}
:host(:not(.--ready)) .footer {
    display: none;
}

.club-list-container {
    padding: 10px;
    user-select: text;
}
.club-list-container__country {
    background-color: #eee;
    padding: 5px;
    text-align: center;
}
.club-list-container__club-list {
    display: grid;
    grid-row-gap: 10px;
    list-style-type: none;
    padding-inline-start: 0;
    margin-left: auto;
    margin-right: auto;
}
.club-list-item {
    display: grid;
    gap: 5px;
}
.club-list-item__site-link {
    justify-self: left;
}
.club-list-item-distance {
    display: grid;
    grid-template-columns: minmax(auto, 0%) auto;
    gap: 5px;
}
.club-list-item-distance__marker {
    height: 25px;
}
.club-list-item-distance__marker.--red {
    background-color: var(--red);
}
.club-list-item-distance__marker.--amber {
    background-color: var(--amber);
}
.club-list-item-distance__marker.--green {
    background-color: var(--green);
}
.club-list-item-distance__miles {
    white-space: nowrap;
    font-size: 22px;
}
`;
