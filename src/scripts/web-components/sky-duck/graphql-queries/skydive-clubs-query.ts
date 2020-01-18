export const skydiveClubsQuery = `query SkydiveClubs($country: String) {
    clubs(country: $country) {
        latitude,
        longitude,
        name,
        place,
        country,
        countryAliases,
        site,
    }
}`;
