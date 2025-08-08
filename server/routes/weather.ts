import { RequestHandler } from "express";

export const handleWeather: RequestHandler = async (req, res) => {
  try {
    const location = req.query.location || 'New York';
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`
    );

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const weatherData = await response.json();
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
