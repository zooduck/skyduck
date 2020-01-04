export const style = `
@import url('https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&display=swap');
@import url('https://fonts.googleapis.com/css?family=Luckiest+Guy&display=swap');

:host {
    position: relative;
    display: block;
    width: 100%;
    height: 100vh;
    max-width: 768px;
    min-height: 100vh;
    margin: 0 auto;
    background-color: var(--white);
    user-select: none;
    overflow: hidden;
    font-family: Roboto, sans-serif;
    font-size: var(--font-size-base);
    color: var(--black);

    --font-size-base: 16px;
    --slide-selectors-height: 60px;

    --red: rgb(255, 99, 71, .8);
    --amber: rgba(255, 165, 0, .8);
    --green: rgba(34, 139, 34, .8);

    --white: #fff;
    --black: #222;
    --charcoal: #333;
    --pink: hotpink;
    --lightskyblue: lightskyblue;
    --paleskyblue: rgba(135, 206, 250, .4);
    --gray: #999;
    --lightgray: lightgray;
}
:host(.--ready) {
    height: auto;
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
        font-size: 22px;
    }
}

* {
    box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5 {
    margin: 0;
    color: var(--charcoal);
}

ul {
    list-style-type: none;
    margin-block-start: 0;
    padding-inline-start: 0;
}

a {
    color: cornflowerblue;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}

.loader {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    grid-gap: 50px;
    justify-content: center;
    justify-items: center;
    width: 100%;
    height: 100vh;
    background-color: var(--lightskyblue);
    color: var(--white);
    padding: 10px;
    font-size: 1.2em;
}
:host(.--ready) .loader {
    display: none;
}
.loader__error {
    display: none;
    grid-row: 2;
    align-self: start;
    text-align: center;
    border: solid 3px var(--white);
    padding: 10px;
    max-width: 450px;
    color: var(--white);
}
:host(.--error) .loader__error {
    display: block;
}
.loader-info {
    grid-row: 1;
    align-self: end;
    width: 200px;
    text-align: center;
}
:host(.--error) .loader-info {
    display: none;
}
.loader-info__place {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.loader__icon {
    grid-row: 2;
}
@keyframes loadingBar {
    0% {
        width: 0;
    }
    50% {
        width: 10%;
    }
    60% {
        width: 50%;
    }
    69% {
        width: 55%;
    }
    70% {
        width: 65%;
    }
    79% {
        width: 70%;
    }
    80% {
        width: 80%;
    }
    100% {
        width: 100%;
    }
}
.loader-bar {
    display: flex;
    grid-row: 3;
    display: flex;
    align-items: center;
    width: 100%;
    height: 10px;
    background-color: rgba(255, 255, 255, .5);
}
.loader-bar__inner {
    background-color: var(--white);
    width: 0;
    height: 100%;
    animation: loadingBar linear;
}
:host(:not(.--init)) .loader-bar {
    visibility: hidden;
}
:host(.--error) .loader__icon,
:host(.--error) .loader-bar {
    display: none;
}

.geolocation-error {
    background-color: lightgoldenrodyellow;
    color: rgba(0, 0, 0, .52);
    font-size: 14px;
    padding: 10px;
    transition: all .25s;
    box-shadow: 2px 2px 10px #ccc;
}
@media (min-width: 768px) {
    .geolocation-error {
        margin-left: 10px;
        margin-right: 10px;
    }
}

.header {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    color: var(--lightskyblue);
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
    cursor: pointer;
}

.search {
    padding: 10px;
}

.club-info-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 10px;
    padding: 0 10px;
}
:host(.--hide-map) .club-info-grid {
    display: none;
}
.club-info-grid__map {
    grid-column: 1 / span 2;
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

.local-time-and-units-info-grid {
    color: var(--gray);
    white-space: nowrap;
    text-align: right;
}

.controls {
    display: grid;
    grid-template-columns: repeat(2, 1fr) auto;
    grid-gap: 10px;
    align-items: center;
    margin: 10px;
    color: var(--white);
}
.controls__view-club-list {
    justify-self: left;
    cursor: pointer;
    background-color: var(--lightskyblue);
    color: #fff;
    width: 100px;
    height: 60px;
    font-size: var(--font-size-base);
    display: flex;
    justify-content: center;
    padding-top: 10px;
    clip-path: polygon(100% 0%, 50% 100%, 0% 0%);
}
.controls__view-club-list:hover {
    text-decoration: underline;
}
.controls__toggles {
    display: grid;
    justify-content: right;
    grid-gap: 10px;
}
.controls__forecast-display-mode-toggle {
    justify-self: right;
}

.forecast-slide-selectors {
    display: grid;
    grid-template-columns: repeat(8, auto);
    grid-gap: 5px;
    height: var(--slide-selectors-height);
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
    grid-template-rows: repeat(2, 0fr) repeat(3, auto);
    grid-template-columns: 100%;
    grid-row-gap: 10px;
    min-height: calc(100vh - var(--slide-selectors-height));
    padding: 10px;
}
#forecastCarousel.--forecast-display-mode-24h .forecast-grid {
    grid-template-rows: 0fr auto;
}
:host(:not(.--ready)) .forecast-grid {
    display: none;
}
.forecast-grid__title {
    padding: 10px;
}
.forecast-grid__title.--red {
    background-color: var(--red);
    color: var(--white);
}
.forecast-grid__title.--amber {
    background-color: var(--amber);
    color: var(--black);
}
.forecast-grid__title.--green {
    background-color: var(--green);
    color: var(--white);
}
.forecast-grid-header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: repeat(2, auto);
    grid-gap: 10px;
    align-items: center;
    border-left: solid 10px var(--lightgray);
    padding: 0 0 10px 10px;
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
    display: grid;
}
.forecast-grid-header-date__date {
    display: flex;
    align-items: center;
    justify-content: left;
}
.forecast-grid-header-date__date-string {
    margin-left: 5px;
}
.forecast-grid-header__summary {
    grid-row: 2;
    grid-column: 1;
}
.forecast-grid-header__temperature-summary {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    justify-items: right;
    grid-gap: 5px;
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
.forecast-grid-header-sun-info__item.--sunset.--red {
    background-color: var(--red);
    color: var(--white);
}
.forecast-grid-header-sun-info__item.--sunset.--amber {
    background-color: var(--amber);
    color: var(--black);
}
.forecast-grid-header-sun-info__item.--sunset.--green {
    background-color: var(--green);
    color: var(--white);
}
.forecast-grid-forecast,
.forecast-grid-forecast.--24h {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    grid-gap: 10px;
}
#forecastCarousel.--forecast-display-mode-24h .forecast-grid-forecast,
#forecastCarousel.--forecast-display-mode-24h .forecast-grid-forecast.--24h {
    grid-template-columns: repeat(2, 1fr);
}
.forecast-grid-forecast.--24h {
    height: 0px;
    overflow: hidden;
    grid-column: 1;
    grid-row: 2;
}
@keyframes slideOnHourlyForecast {
    0% {
        transform: translateX(-100vw);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}
#forecastCarousel.--forecast-display-mode-24h .forecast-grid-forecast,
#forecastCarousel.--forecast-display-mode-24h .forecast-grid-forecast.--24h {
    animation: slideOnHourlyForecast .25s both;
}
#forecastCarousel.--forecast-display-mode-24h .forecast-grid-forecast.--24h {
    height: auto;
    grid-column: auto;
    grid-row: auto;
}
.forecast-grid-forecast__weather-photo {
    grid-column: 1 / span 2;
    grid-row: 1;
    background-position: 75% center;
    background-size: cover;
    background-repeat: no-repeat;
}
@media (min-width: 768px) {
    #forecastCarousel:not(.--forecast-display-mode-24h) .forecast-grid-forecast__weather-photo {
        background-position: 25% center;
    }
}
#forecastCarousel.--forecast-display-mode-24h .forecast-grid-forecast__weather-photo {
    grid-column: 1;
    grid-row: 1 / span 2;
    background-position: 50% center;
}

@media (min-aspect-ratio: 1/1) {
    #forecastCarousel:not(.--forecast-display-mode-24h) .forecast-grid-forecast__weather-photo {
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
#forecastCarousel.--forecast-display-mode-24h .forecast-grid-forecast__time {
    grid-row: 1 / span 2;
}
.forecast-grid-forecast__time span {
    border-bottom: solid 5px var(--lightgray);
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
}
#forecastCarousel.--forecast-display-mode-24h .forecast-grid-forecast-weather {
    grid-row: 1;
    grid-column: 2;
    align-self: end;
}
.forecast-grid-forecast-weather__type {
    flex-grow: 1;
    margin-right: 10px;
    word-break: break-word;
}
@media (min-width: 768px) {
    .forecast-grid-forecast-weather__type {
        font-size: 22px;
    }
}

.forecast-data-grid {
    grid-column: 2;
    grid-row: 1 / span 2;
    display: grid;
    grid-template-columns: repeat(3, minmax(55px, auto));
    grid-template-rows: repeat(2, auto);
    grid-column-gap: 5px;
    align-self: end;
}
#forecastCarousel.--forecast-display-mode-24h .forecast-data-grid {
    grid-row: 2;
    grid-template-rows: auto;
    align-self: auto;
    padding-right: 6px;
}
.forecast-data-grid-type {
    display: grid;
    grid-gap: 5px;
    justify-items: center;
    align-items: center;
    background: rgba(255, 255, 255, .8);
    padding: 10px;
}
#forecastCarousel.--forecast-display-mode-24h .forecast-data-grid-type {
    box-shadow: 2px 2px 6px var(--lightgray);
}
.forecast-data-grid-type.--landscape-only {
    display: none;
}
zooduck-icon-circle .icon-circle {
    border-color: pink;
}
.forecast-data-grid-type__icon.--red {
    --zooduck-icon-color: var(--red);
}
.forecast-data-grid-type__icon.--amber {
    --zooduck-icon-color: var(--amber);
}
.forecast-data-grid-type__icon.--green {
    --zooduck-icon-color: var(--green);
}
.forecast-data-grid__data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
}
.forecast-data-grid__data.--landscape-only {
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
        grid-template-columns: repeat(5, minmax(55px, auto));
    }
    .forecast-data-grid-type.--landscape-only {
        display: grid;
    }
    .forecast-data-grid__data.--landscape-only {
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
    cursor: default;
    min-height: 100vh;
    user-select: none;
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
    margin: 10px auto;
}
.club-list-item {
    display: grid;
    grid-gap: 5px;
}
.club-list-item__name {
    cursor: pointer;
    justify-self: left;
    user-select: text;
}
.club-list-item__name:hover {
    text-decoration: underline;
}
.club-list-item__place {
    user-select: text;
}
.club-list-item__site-link {
    justify-self: left;
}
.club-list-item-distance {
    display: grid;
    grid-template-columns: minmax(auto, 0%) auto;
    grid-gap: 5px;
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
