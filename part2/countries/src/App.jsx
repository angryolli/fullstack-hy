import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = (props) => {
  return (
    <div>
      find countries <input value={props.filter} onChange={props.handleFilterChange} />
    </div>
  )
}

// for list of countries
const Country = (props) => {
  return (
    <div>
      {props.country.name.common}
      <button onClick={props.showCountry}>Show</button>
    </div>
  )
}
// list of countries
const Countries = (props) => {
  return (
    <div>
      {props.countries.map(country =>
        <Country
          key={country.cca3}
          country={country}
          showCountry={() => props.showCountry(country)}
        />
      )}
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  // get weather data when the capital changes
  useEffect(() => {
    if (!capital) { return }

    setWeather(null)
    weatherService
      .getWeather(capital)
      .then(weatherData => {
        setWeather(weatherData)
      })
  }, [capital])

  // if no weather data, return null
  if (!weather) {
    return null
  }
  // console.log('capital', capital)
  // console.log('weather', weather)

  const icon = weather.weather[0].icon

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>Temperature {weather.main.temp} Celsius</div>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`} // icon from older guide
        alt={weather.weather[0].description}
      />
      <div>Wind {weather.wind.speed} m/s</div>
    </div>
  )
}

// exact country information
const CountryInfo = (props) => {
  const country = props.country
  // get languages as an array of strings
  const languages = country.languages ? Object.values(country.languages) : []
  const capital = country.capital ? country.capital[0] : ''

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {capital}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {languages.map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <Weather capital={capital} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  // country to show from the list

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null) // reset the selected country when the filter changes
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  const query = filter.toLowerCase().replaceAll(' ', '')

  // filtered countries by query
  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().replaceAll(' ', '').includes(query)
  )
  //console.log('countriesToShow', countriesToShow)

  let content = null
  if (query !== '') {
    if (countriesToShow.length > 10) {
      content = <div>Too many matches, specify another filter</div>
    } else if (countriesToShow.length === 1) {
      content = <CountryInfo country={countriesToShow[0]} />
    } else if (selectedCountry) {
      content = <CountryInfo country={selectedCountry} />
    } else {
      content = <Countries countries={countriesToShow} showCountry={showCountry} />
    }
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      {content}
    </div>
  )
}

export default App
