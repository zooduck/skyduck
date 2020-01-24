import { backgroundImageForMesh } from '../utils/background-image-for-mesh';

interface StyleOptions {
    transitionSpeedInMillis: number;
}

export class SkyduckStyle {
    private _backgroundImageForMesh: string;
    private _style: string;
    private _styleOptions: StyleOptions;

    constructor(styleOptions: StyleOptions) {
        this._backgroundImageForMesh = backgroundImageForMesh();
        this._styleOptions = styleOptions;
        this._buildStyle();
    }

    private _buildStyle(): void {
        const { transitionSpeedInMillis } = this._styleOptions;

        this._style = `
            @import url('https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&display=swap');

            @keyframes hide-carousel {
                0% {
                    height: auto;
                }
                100% {
                    height: 0;
                }
            }

            @keyframes loading-bar {
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

            :host {
                position: relative;
                display: block;
                width: 100%;
                height: 100vh;
                max-width: var(--max-width);
                min-height: 100vh;
                margin: 0 auto;
                background-color: var(--white);
                user-select: none;
                overflow: hidden;
                font-family: Roboto, sans-serif;
                font-size: var(--font-size-base);
                color: var(--black);

                --max-width: 823px;

                --font-size-base: 16px;
                --slide-selectors-height: 40px;
                --header-height: 70px;
                --footer-height: 40px;

                --red: rgb(255, 99, 71, .8);
                --amber: rgba(255, 165, 0, .8);
                --green: rgba(34, 139, 34, .8);

                --white: #fff;
                --black: #222;
                --charcoal: #333;
                --paleyellow: #fbfbaa;
                --lightskyblue: lightskyblue;
                --paleskyblue: rgba(135, 206, 250, .4);
                --gray: #999;
                --icongray: #ccc;
                --lightgray: lightgray;
                --palegray: #eee;
                --whitesmoke: whitesmoke;
                --translucentwhite: rgba(255, 255, 255, .8);

                --box-shadow: -2px 2px 15px rgba(0, 0, 0, .2);
            }
            :host(.--ready) {
                height: auto;
            }
            :host(.--settings-active) {
                height: 100vh;
            }
            @media (max-width: 320px) {
                :host {
                    font-size: 14px;
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
                margin-block-end: 0;
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
                display: none;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 99;
                grid-template-rows: 1fr auto 1fr;
                grid-gap: 50px;
                justify-content: center;
                justify-items: center;
                width: 100%;
                max-width: var(--max-width);
                height: 100vh;
                background-color: var(--lightskyblue);
                color: var(--white);
                padding: 10px;
                font-size: 1.2em;
            }
            :host(.--loading) .loader {
                display: grid;
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
                animation: loading-bar linear;
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
            }

            .header {
                position: fixed;
                z-index: 9;
                left: 0;
                top: 0;
                max-width: var(--max-width);
                display: grid;
                grid-template-columns: repeat(2, auto) 1fr auto;
                grid-gap: 10px;
                align-items: center;
                width: 100%;
                height: var(--header-height);
                padding: 10px;
                color: var(--white);
                background-color: var(--lightskyblue);
            }
            @media (min-width: 824px) {
                .header {
                    left: calc((100% - var(--max-width)) / 2);
                }
                .loader {
                    left: calc((100% - var(--max-width)) / 2);
                }
            }
            .header__settings-control {
               grid-column: 1;
               align-self: start;
            }
            .header__logo {
                grid-column: 2;
                padding: 5px;
                background-color: var(--white);
            }
            .header__title {
                grid-column: 3;
                font-size: 1.5em;
                font-weight: bold;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .header__version {
                grid-column: 4;
                align-self: start;
            }

            .header-placeholder {
                display: block;
                width: 100%;
                height: var(--header-height);
            }

            #settingsToggle {
                cursor: pointer;
            }

            .glass {
                display: none;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .2);
                background-image: url(${this._backgroundImageForMesh});
                background-repeat: repeat;
            }
            :host(.--settings-active) .glass.--settings {
                display: block;
                z-index: 97;
            }
            :host(.--sub-settings-active) .glass.--sub-settings {
                display: block;
                z-index: 98;
            }

            .settings,
            .sub-settings {
                position: absolute;
                z-index: 98;
                left: 0;
                top: 0;
                width: calc(100vw - 50px);
                max-width: 500px;
                height: 100%;
                min-height: 100vh;
                overflow: auto;
                background-color: var(--white);
                transform: translateX(-100%);
                transition: all ${transitionSpeedInMillis}ms;
            }
            :host(.--settings-active) .settings {
                transform: translateX(0);
                box-shadow: var(--box-shadow);
            }
            .settings-grid {
                display: grid;
                grid-gap: 10px;
                padding: 10px;
            }
            .settings__control {
                display: grid;
                grid-template-columns: 1fr auto;
                grid-gap: 10px;
                align-items: center;
                height: 55px;
                padding: 10px;
                background-color: var(--whitesmoke);
            }
            .settings-control-name {
                display: grid;
                grid-template-rows: repeat(2, auto);
            }
            .settings__control.--sub-settings .settings-control-name {
                justify-self: end;
            }
            .settings-control-name__title {
                color: var(--gray);
            }
            .settings-control-name__subtitle {
                color: var(--gray);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .sub-settings {
                left: auto;
                right: 0;
                transform: translateX(100%);
                box-shadow: none;
            }
            :host(.--sub-settings-active) .sub-settings {
                transform: translateX(0);
                box-shadow: var(--box-shadow);
            }

            .map iframe {
                width: 100%;
                background-color: var(--palegray);
            }

            .location-info {
                display: flex;
                flex-direction: column;
            }
            .location-info.--user-location {
                padding: 10px;
                border: dashed 6px var(--lightgray);
                color: var(--gray);
            }
            .location-info-link {
                margin-top: 10px;
            }

            .forecast-carousel-standard,
            .forecast-carousel-extended {
                animation: hide-carousel 50ms linear both;
            }
            :host(.--active-carousel-forecast.--forecast-display-mode-standard) .forecast-carousel-standard {
               animation: none;
            }
            :host(.--active-carousel-forecast.--forecast-display-mode-extended) .forecast-carousel-extended {
                animation: none;
            }

           .forecast-grid {
                display: grid;
                grid-template-rows: repeat(2, 0fr) auto;
                grid-row-gap: 10px;
                min-height: calc(100vh - var(--header-height) - var(--footer-height));
                padding: 10px;
            }

            .forecast-grid-header {
                display: grid;
                grid-template-columns: 1fr auto;
                grid-template-rows: repeat(2, auto);
                grid-gap: 10px;
                align-items: center;
                border-left: solid 10px var(--lightgray);
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
                margin-left: 10px;
            }
            .forecast-grid-header-date__date-string {
                margin-left: 5px;
            }
            .forecast-grid-header__temp {
                display: block;
            }
            .forecast-grid-header__temp h3 {
                font-weight: normal;
            }
            .forecast-grid-header__summary {
                grid-row: 2;
                grid-column: 1 / span 2;
                margin-left: 10px;
            }

            .daylight-hours-indicator {
                display: grid;
                grid-template-columns: auto 1fr auto;
                background-color: var(--white);
            }
            .daylight-hours-indicator__section {
                display: flex;
                align-items: center;
                padding: 5px;
                font-weight: normal;
            }
            .daylight-hours-indicator__section.--sunrise {
                justify-content: flex-end;
            }
            .daylight-hours-indicator__daylight {
                align-self: center;
                height: 15px;
                background-color: var(--lightgray);
            }

            .forecast-grid-hours {
                display: grid;
                grid-row-gap: 5px;
            }

            .forecast-grid-hour {
                position: relative;
                display: grid;
                grid-template-columns: 1fr auto;
                grid-template-rows: 1fr auto;
                grid-gap: 10px;
            }
            .forecast-grid.--extended .forecast-grid-hour {
                grid-template-rows: auto;
            }
            .forecast-grid-hour.--not-daylight {
                filter: grayscale(1);
            }
            .forecast-grid-hour.--not-daylight .forecast-grid-hour__not-daylight-mesh {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-image: url(${this._backgroundImageForMesh});
                background-repeat: repeat;
            }
            .forecast-grid-hour__photo {
                grid-column: 1 / span 2;
                grid-row: 1;
                background-position: 75% center;
                background-size: cover;
                background-repeat: no-repeat;
            }
            .forecast-grid.--extended .forecast-grid-hour__photo {
                grid-column: 1;
                background-position: 40% center;
            }

            .forecast-grid-hour-time-container {
                margin: 0 0 10px 10px;
                background-color: var(--translucentwhite);
                color: var(--charcoal);
                grid-column: 1;
                grid-row: 1;
                padding: 10px;
                justify-self: left;
            }
            .forecast-grid-hour-time-container__time {
                border-bottom: solid 5px var(--lightgray);
            }
            .forecast-grid-hour-time-container__time.--red {
                border-color: var(--red);
            }
            .forecast-grid-hour-time-container__time.--amber {
                border-color: var(--amber);
            }
            .forecast-grid-hour-time-container__time.--green {
                border-color: var(--green);
            }
            .forecast-grid-hour__summary {
                display: block;
                grid-row: 2;
            }
            .forecast-grid.--extended .forecast-grid-hour__summary {
                display: none;
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
            .forecast-grid.--extended .forecast-data-grid {
                background-color: var(--palegray);
                grid-row: 1;
            }

            .forecast-data-grid-type {
                display: grid;
                grid-gap: 5px;
                justify-items: center;
                align-items: center;
                background: var(--translucentwhite);
                padding: 10px;
            }
            .forecast-data-grid-type.--landscape-only {
                display: none;
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

            .footer {
                display: none;
                grid-template-columns: 1fr auto;
                padding: 10px;
                height: var(--footer-height);
            }
            :host(.--active-carousel-forecast) .footer {
                display: grid;
            }

            .club-list-carousel {
                animation: hide-carousel 50ms linear both;
            }

            :host(.--active-carousel-club-list) .club-list-carousel {
                animation: none;
            }

            .club-list-container {
                padding: 10px;
                cursor: default;
                min-height: calc(100vh - var(--header-height) - var(--footer-height));
                user-select: none;
            }
            .club-list-container__club-list {
                display: grid;
                grid-row-gap: 10px;
                list-style-type: none;
                padding-inline-start: 0;
            }
            .club-list-item {
                display: grid;
                grid-gap: 5px;
            }
            .club-list-item__name {
                cursor: pointer;
                justify-self: left;
            }
            .club-list-item__name:hover {
                text-decoration: underline;
            }
            .club-list-item__site-link {
                justify-self: left;
            }
            .club-list-item-distance {
                display: grid;
                grid-template-columns: minmax(auto, 25%) auto;
                grid-gap: 5px;
            }
            .club-list-item-distance__marker {
                height: 25px;
                background-color: var(--paleskyblue);
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

            @media (min-aspect-ratio: 1/1) {
                .forecast-data-grid {
                    grid-template-columns: repeat(5, minmax(55px, auto));
                }
                .forecast-data-grid-type.--landscape-only {
                    display: grid;
                }
                .forecast-data-grid__data.--landscape-only {
                    display: flex;
                }
                .forecast-grid-hour__photo {
                    min-height: 200px;
                }
                .forecast-grid.--extended .forecast-grid-hour__photo {
                    grid-column: 1 / span 2;
                    grid-row: 1;
                    background-position: 75% center;
                }
                .forecast-grid.--extended .forecast-grid-hour__summary {
                    display: block;
                }
                .forecast-grid.--extended .forecast-data-grid {
                    background-color: transparent;
                }
            }
        `;
    }

    public get style() {
        return this._style;
    }
}
