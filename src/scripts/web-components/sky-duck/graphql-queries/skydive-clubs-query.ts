export const skydiveClubsQuery = `query SkydiveClubs($country: String) {
    clubs(country: $country) {
        latitude,
        longitude,
        id,
        name,
        place,
        country,
        countryAliases,
        site,
    }
}`;
