// OpenF1 API Service with Retry Logic and High-Fidelity Mock Fallbacks
import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

export interface F1Driver {
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string;
  headshot_url: string;
  points?: number;
  price?: number;
  rating?: number;
  pace?: number;
  qualifying?: number;
  defense?: number;
  experience?: number;
}

export interface F1Session {
  session_key: number;
  session_name: string;
  circuit_short_name: string;
  country_name: string;
  date_start: string;
  date_end: string;
  session_type: string;
}

export interface F1Weather {
  air_temperature: number;
  track_temperature: number;
  wind_speed: number;
  humidity: number;
  rainfall: number; // 0 or 1
  date: string;
}

export interface F1Position {
  driver_number: number;
  position: number;
  date: string;
}

// Stiff fallback arrays in case OpenF1 is unresponsive
export const MOCK_DRIVERS: F1Driver[] = [
  { driver_number: 1, full_name: "Max Verstappen", name_acronym: "VER", team_name: "Red Bull Racing", team_colour: "061D3B", country_code: "NED", headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png", points: 258, price: 34.0, rating: 95, pace: 97, qualifying: 96, defense: 93, experience: 92 },
  { driver_number: 44, full_name: "Lewis Hamilton", name_acronym: "HAM", team_name: "Mercedes", team_colour: "00A19B", country_code: "GBR", headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png", points: 190, price: 32.0, rating: 94, pace: 94, qualifying: 95, defense: 92, experience: 99 },
  { driver_number: 16, full_name: "Charles Leclerc", name_acronym: "LEC", team_name: "Ferrari", team_colour: "E10600", country_code: "MON", headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png", points: 175, price: 28.0, rating: 92, pace: 93, qualifying: 97, defense: 88, experience: 90 },
  { driver_number: 4, full_name: "Lando Norris", name_acronym: "NOR", team_name: "McLaren", team_colour: "FF8700", country_code: "GBR", headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png", points: 162, price: 26.0, rating: 91, pace: 92, qualifying: 94, defense: 89, experience: 92 },
  { driver_number: 14, full_name: "Fernando Alonso", name_acronym: "ALO", team_name: "Aston Martin", team_colour: "00875A", country_code: "ESP", headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png", points: 110, price: 22.0, rating: 90, pace: 89, qualifying: 91, defense: 95, experience: 98 },
  { driver_number: 81, full_name: "Oscar Piastri", name_acronym: "PIA", team_name: "McLaren", team_colour: "FF8700", country_code: "AUS", headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png", points: 125, price: 20.0, rating: 88, pace: 90, qualifying: 89, defense: 87, experience: 82 },
  { driver_number: 63, full_name: "George Russell", name_acronym: "RUS", team_name: "Mercedes", team_colour: "00A19B", country_code: "GBR", headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png", points: 118, price: 21.0, rating: 89, pace: 91, qualifying: 92, defense: 86, experience: 85 },
  { driver_number: 55, full_name: "Carlos Sainz", name_acronym: "SAI", team_name: "Ferrari", team_colour: "E10600", country_code: "ESP", headshot_url: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png", points: 130, price: 23.0, rating: 90, pace: 89, qualifying: 90, defense: 91, experience: 91 }
];

export const MOCK_SESSIONS: F1Session[] = [
  {
    session_key: 9839,
    session_name: "Grand Prix",
    circuit_short_name: "Monte Carlo",
    country_name: "Monaco",
    date_start: "2025-05-25T13:00:00+00:00",
    date_end: "2025-05-25T15:00:00+00:00",
    session_type: "Race"
  },
  {
    session_key: 9840,
    session_name: "Qualifying",
    circuit_short_name: "Silverstone",
    country_name: "Great Britain",
    date_start: "2025-07-05T14:00:00+00:00",
    date_end: "2025-07-05T15:00:00+00:00",
    session_type: "Qualifying"
  },
  {
    session_key: 9841,
    session_name: "Practice 1",
    circuit_short_name: "Monza",
    country_name: "Italy",
    date_start: "2025-09-05T11:30:00+00:00",
    date_end: "2025-09-05T12:30:00+00:00",
    session_type: "Practice"
  }
];

export const MOCK_WEATHER: F1Weather = {
  air_temperature: 24.5,
  track_temperature: 38.2,
  wind_speed: 14.8,
  humidity: 45,
  rainfall: 0,
  date: new Date().toISOString()
};

export const MOCK_POSITIONS: F1Position[] = [
  { driver_number: 1, position: 1, date: new Date().toISOString() },
  { driver_number: 4, position: 2, date: new Date().toISOString() },
  { driver_number: 16, position: 3, date: new Date().toISOString() },
  { driver_number: 81, position: 4, date: new Date().toISOString() },
  { driver_number: 55, position: 5, date: new Date().toISOString() },
  { driver_number: 44, position: 6, date: new Date().toISOString() },
  { driver_number: 63, position: 7, date: new Date().toISOString() },
  { driver_number: 14, position: 8, date: new Date().toISOString() }
];

// Helper to make a call with retries
async function fetchWithRetry<T>(url: string, retries = 2, delay = 1000): Promise<T> {
  try {
    const response = await axios.get<T>(url, { timeout: 4000 });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry<T>(url, retries - 1, delay * 1.5);
    }
    throw error;
  }
}

export const OpenF1Service = {
  async getSessions(): Promise<F1Session[]> {
    try {
      // Fetching 2025 sessions
      const data = await fetchWithRetry<F1Session[]>(`${BASE_URL}/sessions?year=2025`);
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 10);
      }
      return MOCK_SESSIONS;
    } catch (e) {
      console.warn("OpenF1 API sessions fetch failed. Falling back to mocks.");
      return MOCK_SESSIONS;
    }
  },

  async getDrivers(sessionKey: number = 9839): Promise<F1Driver[]> {
    try {
      const data = await fetchWithRetry<any[]>(`${BASE_URL}/drivers?session_key=${sessionKey}`);
      if (Array.isArray(data) && data.length > 0) {
        return data.map(d => {
          // Find if there is extra mock info (rating, points, stats)
          const baseMock = MOCK_DRIVERS.find(md => md.driver_number === d.driver_number);
          return {
            driver_number: d.driver_number,
            full_name: d.full_name || d.broadcast_name || "Unknown Driver",
            name_acronym: d.name_acronym || "F1",
            team_name: d.team_name || "Constructor",
            team_colour: d.team_colour || "FF1801",
            country_code: d.country_code || "GP",
            headshot_url: d.headshot_url || "https://media.formula1.com/d_driver_fallback_image.png",
            points: baseMock?.points || Math.floor(Math.random() * 80),
            price: baseMock?.price || 15.0,
            rating: baseMock?.rating || 82,
            pace: baseMock?.pace || 84,
            qualifying: baseMock?.qualifying || 83,
            defense: baseMock?.defense || 81,
            experience: baseMock?.experience || 78
          };
        });
      }
      return MOCK_DRIVERS;
    } catch (e) {
      console.warn("OpenF1 API drivers fetch failed. Falling back to mocks.");
      return MOCK_DRIVERS;
    }
  },

  async getWeather(sessionKey: number = 9839): Promise<F1Weather> {
    try {
      const data = await fetchWithRetry<any[]>(`${BASE_URL}/weather?session_key=${sessionKey}`);
      if (Array.isArray(data) && data.length > 0) {
        const latest = data[data.length - 1]; // get latest measurement
        return {
          air_temperature: parseFloat(latest.air_temperature) || 20.0,
          track_temperature: parseFloat(latest.track_temperature) || 30.0,
          wind_speed: parseFloat(latest.wind_speed) || 10.0,
          humidity: parseInt(latest.humidity) || 50,
          rainfall: parseInt(latest.rainfall) || 0,
          date: latest.date || new Date().toISOString()
        };
      }
      return MOCK_WEATHER;
    } catch (e) {
      console.warn("OpenF1 API weather fetch failed. Falling back to mock.");
      return MOCK_WEATHER;
    }
  },

  async getPositions(sessionKey: number = 9839): Promise<F1Position[]> {
    try {
      const data = await fetchWithRetry<any[]>(`${BASE_URL}/position?session_key=${sessionKey}`);
      if (Array.isArray(data) && data.length > 0) {
        // Find latest position for each driver in session
        const latestMap = new Map<number, F1Position>();
        data.forEach(p => {
          latestMap.set(p.driver_number, {
            driver_number: p.driver_number,
            position: parseInt(p.position) || 20,
            date: p.date
          });
        });
        return Array.from(latestMap.values()).sort((a, b) => a.position - b.position);
      }
      return MOCK_POSITIONS;
    } catch (e) {
      console.warn("OpenF1 API positions fetch failed. Falling back to mocks.");
      return MOCK_POSITIONS;
    }
  }
};
