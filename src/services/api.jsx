import { cachedFetch } from "./cache";

// Listas
export async function getPeople() {
    const data = await cachedFetch("https://www.swapi.tech/api/people?page=1&limit=35");
    return data.results;
}
export async function getPlanets() {
    const data = await cachedFetch("https://www.swapi.tech/api/planets?page=1&limit=20");
    return data.results;
}
export async function getVehicles() {
    const data = await cachedFetch("https://www.swapi.tech/api/vehicles?page=1&limit=20");
    return data.results;
}

// Detalle
export async function getPersonById(id) {
    const data = await cachedFetch(`https://www.swapi.tech/api/people/${id}`);
    return data.result?.properties || {};
}
export async function getPlanetById(id) {
    const data = await cachedFetch(`https://www.swapi.tech/api/planets/${id}`);
    return data.result?.properties || {};
}
export async function getVehicleById(id) {
    const data = await cachedFetch(`https://www.swapi.tech/api/vehicles/${id}`);
    return data.result?.properties || {};
}