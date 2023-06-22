const apiKey = "caefd044204e11b3527362295135047e";
const ville = document.getElementById("ville");
const heure = document.getElementById("heure");
const tempActu = document.getElementById("temperatureActuel");
const humidActu = document.getElementById("humiditeActuel");
const condiActu = document.getElementById("conditionActuelle");
const ventJour = document.getElementById("forceDuVent");
const indiceUV = document.getElementById("indiceUV");
const pressionAtmo = document.getElementById("pressionAtmospherique");
const condiJ1 = document.getElementById("conditionMeteoJ1");
const condiJ2 = document.getElementById("conditionMeteoJ2");
const condiJ3 = document.getElementById("conditionMeteoJ3");
const airQuality = document.getElementById("qualiteAir");

//Heure
function afficherHeure() {
    var maintenant = new Date();
    var heures = maintenant.getHours();
    var minutes = maintenant.getMinutes();
    var secondes = maintenant.getSeconds();
    heures = heures < 10 ? '0' + heures : heures;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    secondes = secondes < 10 ? '0' + secondes : secondes;
    var heureString = heures + ':' + minutes + ':' + secondes;
    heure.textContent = heureString;
}
setInterval(afficherHeure, 1000);
afficherHeure();

// Fonction permettant d'avoir le nom de la ville en fonction de la latitude et longitude
function fetchCityName(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            ville.innerHTML = data.address.village;
        })
        .catch(error => console.error('Error:', error));
}

// Géolocalisation
navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchCityName(lat, lon);
    // Appel initial pour remplir les données
    fetchWeatherData(lat, lon);
    // Rafraîchir les données toutes les 30 minutes
    setInterval(() => fetchWeatherData(lat, lon), 1800000);
}, (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("L'utilisateur n'a pas autorisé l'accès à sa position");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("L'information sur la position n'est pas disponible");
            break;
        case error.TIMEOUT:
            alert("La requête pour obtenir la position de l'utilisateur a expiré");
            break;
        case error.UNKNOWN_ERROR:
            alert("Une erreur inconnue est survenue");
            break;
    }
});

// Fonction pour récupérer les données météo
function fetchWeatherData(lat, lon) {
    const urlMeteo = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
    const urlAirQuality = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;

    //Info météo actuel
    fetch(urlMeteo)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau lors de la requête fetch');
            }
            return response.json();
        })
        .then(data => {
            tempActu.innerHTML = `<div>${data.current.temp}°C</div><div style="font-size:16px;"><i class="fa-solid fa-arrow-up"></i>${data.daily[0].temp.min}°C<i class="fa-solid fa-arrow-down"></i>${data.daily[0].temp.max}°C</div>`;
            humidActu.innerHTML = data.current.humidity + "%" ;
            condiActu.innerHTML = `<img class="imgMeteo" src= "https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png"/><div>${data.current.weather[0].description}</div>`;
            pressionAtmo.innerHTML = data.current.pressure + "hPa" ;
            indiceUV.innerHTML = data.current.uvi ;
            ventJour.innerHTML = data.current.wind_speed + 'km/h';
            condiJ1.innerHTML = `<img class="imgMeteo" src= "https://openweathermap.org/img/wn/${data.daily[1].weather[0].icon}.png"/><div>${data.daily[1].weather[0].description}</div><div style="font-size:16px;"><i class="fa-solid fa-arrow-up"></i>${data.daily[1].temp.min}°C<i class="fa-solid fa-arrow-down"></i>${data.daily[1].temp.max}°C</div>`;
            condiJ2.innerHTML = `<img class="imgMeteo" src= "https://openweathermap.org/img/wn/${data.daily[2].weather[0].icon}.png"/><div>${data.daily[2].weather[0].description}</div><div style="font-size:16px;"><i class="fa-solid fa-arrow-up"></i>${data.daily[2].temp.min}°C<i class="fa-solid fa-arrow-down"></i>${data.daily[2].temp.max}°C</div>`;
            condiJ3.innerHTML = `<img class="imgMeteo" src= "https://openweathermap.org/img/wn/${data.daily[3].weather[0].icon}.png"/><div>${data.daily[3].weather[0].description}</div><div style="font-size:16px;"><i class="fa-solid fa-arrow-up"></i>${data.daily[3].temp.min}°C<i class="fa-solid fa-arrow-down"></i>${data.daily[3].temp.max}°C</div>`;
        });

    // Info sur la qualité de l'air
    fetch(urlAirQuality)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau lors de la requête fetch');
            }
            return response.json();
        })
        .then(data => {
            airQuality.innerHTML = `
            <table class="airQuality">
                <tr>
                    <td>AQI : ${data.list[0].main.aqi}</td>
                    <td>CO : ${data.list[0].components.co} µg/m3</td>
                    <td>NO : ${data.list[0].components.no} µg/m3</td>
                    <td>NO² : ${data.list[0].components.no2} µg/m3</td>
                    <td>O3 : ${data.list[0].components.o3} µg/m3</td>
                </tr>
                <tr>
                    <td>SO² : ${data.list[0].components.so2} µg/m3</td>
                    <td>pm2.5 : ${data.list[0].components.pm2_5} µg/m3</td>
                    <td>PMP10 : ${data.list[0].components.pm10} µg/m3</td>
                    <td>NH3 : ${data.list[0].components.nh3} µg/m3</td>
                </tr>
            </table>`;
        });
}
