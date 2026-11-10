# Bundled real NASA data

Run `npm run fetch-data` on a computer with internet. It downloads NASA POWER (daily, 2001→),
MODIS NDVI and SoilGrids for Sariakandi, Kahaloo and Rajshahi into this folder.
Commit the generated `*.json` files: the app uses them when the backend and NASA are unreachable,
so the demo fields always show real data — even offline.
