async function weatherFile() {
//Import the connection object from dbConnection.js
const { insertWeather } = require('./database/db_connect.js');

//Defines the weather endpoint
const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=55.68&longitude=12.57&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=Europe%2FBerlin';

//Fetches the weather data
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

//Runs the weather function and pushes the data into the database
weather().then(async data => {
    let weather = []

    //Loops through the data and pushes it into the weather array - these are the rows that will be inserted into the database
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

    //Pushes collected data into the database
    await insertWeather(weather);
}).catch(error => {
    console.log('Error:', error);
});

}

//Makes the function available to other files
module.exports = {
    weatherFile: weatherFile
};