import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WeatherBox from './component/WeatherBox';
import WeatherButton from './component/WeatherButton'
import ClipLoader from "react-spinners/ClipLoader";


// 1. 앱이 실행 되자마자 현재위치 기반의 날씨가 보인다
const APIKey = process.env.REACT_APP_WEATHER_API_KEY;


function App() {
  //1.B. 
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const cities = ["Seattle", "New York", "Australia", "Seoul"];
  const [apiError, setAPIError] = useState("")


  const getCurrentLocation = () => {
    //https://www.w3schools.com/html/html5_geolocation.asp 현재 위치 가져오기 소스 참조
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      getWeatherByCurrentLocation(lat, lon);

      console.log("current Location", lat, lon);
    });
    console.log("getCurrentLocation")
  };



  // 1-A. 현재 위치 API 가져오기 함수 만들기

  const getWeatherByCurrentLocation = async (lat, lon) => {

    const APIKey = process.env.REACT_APP_WEATHER_API_KEY;

    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      };
      let data = await response.json();
      console.log("response", data)
      setWeather(data);
      setLoading(false);
    } catch (error) {
      setAPIError(error.message)
      setLoading(false)
    }

  };

  const getWeatherByCity = async () => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`
      let response = await fetch(url);
      let data = await response.json();
      console.log("cityName", data)
      setWeather(data);
      setLoading(false);
    } catch (error) {
      setAPIError(error.message)
      setLoading(false)
    }


  }

  useEffect(() => {
    if (city == null) {
      setLoading(true)
      getCurrentLocation();
    } else {
      setLoading(true)
      getWeatherByCity();
    }
  }, [city]);


  const handleCityChange = (city) => {
    if (city === "current") {
      setCity(null)
    } else {
      setCity(city)
    }
  };

  return (
    <div className="container">

      {loading ? (
        <div className="weather-container">
          <ClipLoader
            color="#f88c6b"
            loading={loading}

            size={150}
             />
        </div>
      ) : !apiError ? (
        <div className="weather-container">
          <WeatherBox weather={weather} />
          <WeatherButton cities={cities} handleCityChange={handleCityChange} selectedCity={city} />
        </div>
      ) : (
        apiError
      )}

    </div>
  );
}

export default App;

//1-B. 기본 UI 작업 해주기 어디에 state에 다 담아주기
//a. 배경화면 깔아주기
//b.

//2. 날씨정보에는 도시, 섭시 화씨 날씨상태
//3. 5개의 버튼이 있다 (1개는 현재 위치 버튼, 4개는 다른 도시 버튼)
//4. 도시버튼을 클릭할 때 마다 도시별 날씨가 나온다
//5. 현재 위치 버튼을 누르면 다시 현재위치 기반의 날씨가 나온다
//6. 데이터를 들고오는 동안 로딩 스피너가 돌가 간다.