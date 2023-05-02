async function weatherFile() {
//Import the connection object from dbConnection.js
const { insertWeather } = require('./database/db_connect.js');

const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=55.68&longitude=12.57&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=Europe%2FBerlin';

const weather = async () => {
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error('Request not successful, expected 200, got: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Failed making the request. ' + error);
    }
};

weather().then(data => {
    let weather = []
    // let currentDate = new Date().toISOString().slice(0, 11);

    // weather.hourly = [];
    // let i = 0;
    // data.hourly.time.forEach(element => {
    //     //Makes sure that hourly weather is only for today
    //     if(element.slice(0, 11) == currentDate){
    //         //Pushes the weather data into the hourly array in the weather object
    //         weather.hourly.push({
    //             time: element,
    //             temperature: data.hourly.temperature_2m[i],
    //             weathercode: data.hourly.weathercode[i]
    //         })
    //     }
    //     i += 1;
    // });

    let i = 0;
    data.daily.time.forEach(element => {
        //Pushes the weather data into the forecast array in the weather object
        weather.push({
            datekey: element,
            temperature: Math.round((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2),
            sunrise: data.daily.sunrise[i],
            sunset: data.daily.sunset[i],
            weathercode: data.daily.weathercode[i]
        })
        i += 1;
    });

    insertWeather(weather);
}).catch(error => {
    console.log('Error:', error);
});

}
module.exports = {
    weatherFile: weatherFile
};