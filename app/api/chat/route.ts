const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

interface GeoResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
}

// WMO Weather interpretation codes → descriptions
function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    48: "Depositing rime fog 🌫️",
    51: "Light drizzle 🌦️",
    53: "Moderate drizzle 🌦️",
    55: "Dense drizzle 🌧️",
    56: "Light freezing drizzle 🌨️",
    57: "Dense freezing drizzle 🌨️",
    61: "Slight rain 🌧️",
    63: "Moderate rain 🌧️",
    65: "Heavy rain 🌧️",
    66: "Light freezing rain 🌨️",
    67: "Heavy freezing rain 🌨️",
    71: "Slight snowfall 🌨️",
    73: "Moderate snowfall ❄️",
    75: "Heavy snowfall ❄️",
    77: "Snow grains ❄️",
    80: "Slight rain showers 🌦️",
    81: "Moderate rain showers 🌧️",
    82: "Violent rain showers ⛈️",
    85: "Slight snow showers 🌨️",
    86: "Heavy snow showers ❄️",
    95: "Thunderstorm ⛈️",
    96: "Thunderstorm with slight hail ⛈️",
    99: "Thunderstorm with heavy hail ⛈️",
  };
  return descriptions[code] || "Unknown";
}

function getWindDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}

// Extract city/location name from user message
function extractLocation(message: string): string | null {
  const patterns = [
    /weather\s+(?:in|at|for|of)\s+(.+?)(?:\?|$|\.|\!)/i,
    /(?:how(?:'s| is)(?: the)? weather\s+(?:in|at)\s+)(.+?)(?:\?|$|\.|\!)/i,
    /(?:temperature|forecast|climate)\s+(?:in|at|for|of)\s+(.+?)(?:\?|$|\.|\!)/i,
    /(?:what(?:'s| is) it like in\s+)(.+?)(?:\?|$|\.|\!)/i,
    /(?:in|at|for)\s+(.+?)(?:\s+(?:weather|temperature|forecast))/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[1].trim();
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const userMessage = body.messages[body.messages.length - 1]?.content || "";
    const location = extractLocation(userMessage);

    if (!location) {
      return Response.json({
        reply:
          "I'm a weather agent! 🌤️ Please ask me about the weather in a specific city.\n\nFor example:\n• \"What is the weather in London?\"\n• \"How's the weather in Tokyo?\"\n• \"Temperature in New York\"",
      });
    }

    // Step 1: Geocode the location
    const geoResponse = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );

    if (!geoResponse.ok) {
      return Response.json(
        { reply: `Sorry, I couldn't look up the location "${location}". Please try again.` },
        { status: 200 }
      );
    }

    const geoData = await geoResponse.json();
    const results: GeoResult[] = geoData.results;

    if (!results || results.length === 0) {
      return Response.json({
        reply: `I couldn't find a location called "${location}". Please check the spelling and try again.`,
      });
    }

    const place = results[0];

    // Step 2: Fetch current weather
    const weatherResponse = await fetch(
      `${WEATHER_URL}?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code,is_day&timezone=auto`
    );

    if (!weatherResponse.ok) {
      return Response.json(
        { reply: "Sorry, I couldn't fetch the weather data right now. Please try again later." },
        { status: 200 }
      );
    }

    const weather: WeatherData = await weatherResponse.json();
    const current = weather.current;

    const locationName = place.admin1
      ? `${place.name}, ${place.admin1}, ${place.country}`
      : `${place.name}, ${place.country}`;

    const weatherDesc = getWeatherDescription(current.weather_code);
    const windDir = getWindDirection(current.wind_direction_10m);

    const reply = [
      `**Weather in ${locationName}** ${current.is_day ? "☀️" : "🌙"}`,
      "",
      `🌡️ **Temperature:** ${current.temperature_2m}°C`,
      `🤔 **Feels Like:** ${current.apparent_temperature}°C`,
      `🌤️ **Condition:** ${weatherDesc}`,
      `💧 **Humidity:** ${current.relative_humidity_2m}%`,
      `💨 **Wind:** ${current.wind_speed_10m} km/h ${windDir}`,
    ].join("\n");

    return Response.json({ reply });
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
