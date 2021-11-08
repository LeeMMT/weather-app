import '../css/cssreset.css'
import '../css/style.css'

const dataModule = (function () {
  let city = 'Torquay'

  const getCurrentHour = () => {
    const date = new Date()
    return date.getHours()
  }

  const setCity = (cityName) => {
    city = cityName
  }

  function getCurrentWeather() {
    return new Promise(function (resolve, reject) {
      const location = city
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=0b29ad316ae11908404dc3cdb8577d9d`, { mode: 'cors' })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((error) => console.log(error))
    })
  }

  const getCityName = async () => {
    const data = await getCurrentWeather()
    return data.name
  }

  const getHourlyTemp = async () => {}

  const getCurrentTemp = async () => {
    const data = await getCurrentWeather()
    return data.main.temp
  }

  return { getCurrentHour, setCity, getCityName, getHourlyTemp, getCurrentTemp }
})()

const displayModule = (function () {
  const city = document.querySelector('#city')
  const description = document.querySelector('#description')
  const temp = document.querySelector('#temp')
  const inputEl = document.querySelector('#location-input input')
  const submitBtn = document.querySelector('#location-input button')

  const roundTemp = (temp) => {
    return Math.floor(temp)
  }

  const displayCity = async () => {
    city.textContent = await dataModule.getCityName()
  }

  const displayCurrentTemp = async () => {
    let tempData = await dataModule.getCurrentTemp()
    tempData = roundTemp(tempData)
    return tempData + '°'
  }

  const populateHourlyForecast = async () => {
    const d = new Date()
    const currentHour = d.getHours()
    document.querySelector('#hourly').innerHTML = ''

    const hourlyDiv = document.createElement('div')
    hourlyDiv.classList.add('hour')

    const time = document.createElement('p')
    time.textContent = 'Now'

    const icon = document.createElement('i')
    const temp = document.createElement('p')
    temp.textContent = await displayCurrentTemp()

    hourlyDiv.appendChild(time)
    hourlyDiv.appendChild(temp)

    document.querySelector('#hourly').appendChild(hourlyDiv)

    for (let i = currentHour + 1; i < currentHour + 25; i++) {
      const hourlyDiv = document.createElement('div')
      hourlyDiv.classList.add('hourly')

      const time = document.createElement('p')
      time.textContent = i

      const icon = document.createElement('i')

      const temp = document.createElement('p')
      temp.textContent = await displayCurrentTemp()

      hourlyDiv.appendChild(time)
      hourlyDiv.appendChild(temp)

      document.querySelector('#hourly').appendChild(hourlyDiv)
    }
  }

  const displayAllData = async function () {
    displayCity()
    temp.textContent = await displayCurrentTemp()
    populateHourlyForecast()
    dataModule.getHourlyTemp()
  }

  submitBtn.addEventListener('click', () => {
    dataModule.setCity(inputEl.value)
    displayAllData()
    console.log(dataModule.getCurrentTemp())
  })
})()
