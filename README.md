# Skyduck
Weather forecasting tool for skydivers.

Built as a pure html web component without any third-party frontend dependencies except <a href="https://moment.github.io/luxon/" target="_blank">Luxon</a>.

![alt text](https://github.com/zooduck/screenshots/blob/master/skyduck/v0.0.7-alpha/skyduck-v0.0.7-alpha.png)

### Sandbox
https://skyduck.herokuapp.com

### Usage
Club forecasts are available by clicking on any club name in the club list (currently limited to UK clubs only). Alternatively, you can use the "Location Search" to get a forecast for any location in the world. You can also get a forecast for your current location by clicking the location icon (assuming you have Geolocation enabled in your browser).

### APIs
|Name|Description|
|----|-----------|
|Dark Sky|Weather data|
|Bing Maps (Geocode)|Resolve latitude/longitude for location search|
|Google Maps (Embed)|Display google map of club or location|

### Dependencies
|Name|Client|Server|
|----|------|------|
|luxon|yes|yes|
|dotenv|-|yes|
|full-icu|-|yes|
|express|-|yes|
|express-graphql|-|yes|
|axios|-|yes|
|mongodb|-|yes|
