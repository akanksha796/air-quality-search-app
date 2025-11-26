# AQI Search — Akan (Java Spring Boot + Simple Frontend)

This repository contains a ready-to-run Spring Boot application that provides:

- A backend REST API at `/api/search?city={cityName}` which fetches AQI data from WAQI (aqicn) API.
- Simple frontend (HTML/CSS/JS) served at `/` where you can search by city.

## Features

- Uses WAQI (https://api.waqi.info/). You **must** obtain a token and set it for the backend.
- Caching with Caffeine: responses cached for 5 minutes, max 100 entries.
- Handles errors and returns provider errors to client.

## How to run (Java 17 + Maven)

1. Install Java 17+ and Maven.
2. Obtain an API token from https://aqicn.org/data-platform/token/
3. Build:

```bash
cd backend
mvn clean package -DskipTests
```

4. Run (two options):

- Pass token as a JVM property:
```bash
java -Daqi.token=YOUR_TOKEN -jar target/aqi-search-0.0.1-SNAPSHOT.jar
```

- Or set `AQI_TOKEN` environment variable and use:
```bash
export AQI_TOKEN=YOUR_TOKEN
java -Daqi.token=${AQI_TOKEN} -jar target/aqi-search-0.0.1-SNAPSHOT.jar
```

5. Open http://localhost:8080 in your browser and search a city name (e.g. `Delhi`, `Los Angeles`, `Beijing`).

## API

`GET /api/search?city=CityName`

Response: JSON (provider response). Example fields:
- `status` — provider status ("ok" or "error")
- `data.aqi` — integer AQI
- `data.city.name` — city identification
- `data.iaqi` — pollutants (pm25, pm10, o3, no2, so2, co)
- `data.dominentpol` — dominant pollutant
- `data.time` — timestamp info

## Notes / Limitations

- The WAQI API requires a token. This project includes a placeholder and will throw an error if token is missing.
- For production use, you should hide tokens and implement stronger error handling & rate-limiting.
- The frontend is intentionally simple and focuses on clarity and useful info for interview evaluation.

## Author

Created for coding challenge submission. Name used: Akan (as requested).
