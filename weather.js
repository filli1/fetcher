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
    console.log(data);
}).catch(error => {
    console.log('Error:', error);
});