import { useState, useEffect } from 'react'
import countryService from './services/countries'

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

// exact country information
const CountryInfo = (props) => {
  const country = props.country
  // get languages as an array of strings
  const languages = country.languages ? Object.values(country.languages) : []

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital ? country.capital[0] : ''}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {languages.map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
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
  console.log('countriesToShow', countriesToShow)

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
