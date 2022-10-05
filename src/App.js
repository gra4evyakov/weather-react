import React, {useState} from "react";
import axios from "axios";
import {BsGeoAlt} from 'react-icons/bs'

function App() {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const [error, setError] = useState('')
    const [geo, setGeo] = useState('')

  const url =`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=ru&appid=b62ccba4d0e8105ec9c49025598e8217`

  function searchLocation(event) {
        if (event.key === 'Enter') {
            axios.get(url).then((response) => {
                setData(response.data)
                console.log(response)
                setError('')

            }).catch(error => {
                if (error.response.status === 404) {
                    setError('Пожалуйста, введите корректный город')
                }
            })
            setLocation('')
        }
  }

  function handleWeatherByGeolocation() {
        const options = {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0
        }
        const success = async (pos) => {
            const crd = pos.coords
            const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&apiKey=25240bec7d1e4ad79eb5838e9405399c`)
            const result = await response.json()
            setLocation(result.features[0].properties.state)
        }
        const error = (err) => {
            console.log(err)
        }

        navigator.geolocation.getCurrentPosition(success, error, options)
  }

  return (
    <div className="App">
        <div className="search">
            <input
                value={location}
                onChange={event => setLocation(event.target.value)}
                onKeyPress={searchLocation}
                placeholder='Введите город'
                type="text"/>
            <button className='geolocation' onClick={() => handleWeatherByGeolocation()}>
                <BsGeoAlt color='rgba(255,255,255,0.8)' className='geolocation_icon'/>
            </button>
        </div>
        {error !== '' ? <p className="error">{error}</p> : null}
      <div className="container">
        <div className="top">
            <div className="location">
                <p>{data.name}</p>
            </div>
            <div className="temp">
                {data.main ? <h1>{data.main.temp.toFixed()} °C</h1> : null}
                {data.weather ? <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt=""/>: null}
            </div>
            <div className="description">
                {data.weather ? <p>{data.weather[0].description}</p> : null}
            </div>

        </div>

          {data.name !== undefined &&
              <div className="bottom">
                  <div className="feels">
                      {data.main ? <p className='bold'>{data.main.feels_like.toFixed()} °C</p> : null}
                      <p>Ощущается как</p>
                  </div>
                  <div className="humidity">
                      {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                      <p>Влажность воздуха</p>
                  </div>
                  <div className="wind">
                      {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} М/С</p> : null}
                      <p>Скорость ветра</p>
                  </div>
              </div>
          }
      </div>
    </div>
  );
}

export default App;
