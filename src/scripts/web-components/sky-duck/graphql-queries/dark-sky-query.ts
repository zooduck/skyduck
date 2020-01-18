export const darkSkyQuery = `query DarkskyData($lat: Float!, $lon: Float!) {
    weather(latitude: $lat, longitude: $lon) {
        latitude,
        longitude,
        timezone,
        daily {
            summary,
            icon,
            data {
                time,
                sunriseTime,
                sunsetTime,
                summary,
                icon,
                precipProbability,
                precipType,
                temperatureMin,
                temperatureMax,
                apparentTemperatureMin,
                apparentTemperatureMax,
                windSpeed,
                windGust,
                cloudCover,
                visibility
            }
        },
        hourly {
            summary,
            icon,
            data {
                time,
                summary,
                icon,
                precipProbability,
                precipType,
                temperature,
                apparentTemperature,
                windSpeed,
                windGust,
                cloudCover,
                visibility
            }
        }
    }
}`;
