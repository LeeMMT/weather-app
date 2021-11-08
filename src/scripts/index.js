import '../css/cssreset.css'
import '../css/style.css'

const dataModule = (function () {
  let city = 'Torquay'

  let hourlyData = []
  let currentData = []

  const getCurrentHour = () => {
    const date = new Date()
    return date.getHours()
  }

  const setCity = (cityName) => {
    city = cityName
  }

  const getCityName = () => {
    return currentData[0].name
  }

  const getCurrentWeather = () => {
    return new Promise(function (resolve, reject) {
      const location = city
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=0b29ad316ae11908404dc3cdb8577d9d`, { mode: 'cors' })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((error) => console.log(error))
    })
  }

  const storeCurrentWeather = async () => {
    currentData[0] = await getCurrentWeather()
    console.log(currentData)
  }

  const getCurrentTemp = () => {
    return currentData[0].main.temp
  }

  const storeHourlyTemp = async () => {
    const lat = currentData[0].coord.lat
    const lon = currentData[0].coord.lon
    const rawData = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,daily,alerts&appid=0b29ad316ae11908404dc3cdb8577d9d`,
    )
    hourlyData = await rawData.json()
    await console.log(hourlyData)
  }

  const getHourlyTemp = (index) => {
    return hourlyData.hourly[index]
  }

  return { getCurrentHour, setCity, getCurrentWeather, getCityName, storeHourlyTemp, getCurrentTemp, getHourlyTemp, storeCurrentWeather, currentData }
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

  const displayCity = () => {
    city.textContent = dataModule.getCityName()
  }

  const displayHourlyTemp = (index) => {
    let tempData = dataModule.getHourlyTemp(index).temp
    tempData = roundTemp(tempData)
    return tempData + '°'
  }

  const displayCurrentTemp = () => {
    let tempData = dataModule.getCurrentTemp()
    tempData = roundTemp(tempData)
    return tempData + '°'
  }

  const populateHourlyForecast = () => {
    const hourlyForecast = document.querySelector('#hourly-forecast')
    const hourlyContainer = document.createElement('div')
    hourlyContainer.classList.add('hourly-container')
    if (hourlyForecast.childElement) hourlyForecast.childElement.innerHTML = '' // Wipes old hourly forecast data from DOM

    const d = new Date()
    const currentHour = d.getHours()

    const hourlyNowDiv = document.createElement('div')
    hourlyNowDiv.classList.add('hour')

    const time = document.createElement('p')
    time.textContent = 'Now'

    const icon = document.createElement('i')

    const temp = document.createElement('p')
    temp.textContent = displayCurrentTemp()

    hourlyNowDiv.appendChild(time)
    hourlyNowDiv.appendChild(temp)
    hourlyContainer.appendChild(hourlyNowDiv)

    let hour = currentHour + 1

    for (let i = 1; i < 26; i++) {
      const hourlyDiv = document.createElement('div')
      hourlyDiv.classList.add('hour')

      const time = document.createElement('p')
      time.textContent = hour

      const icon = document.createElement('i')

      const temp = document.createElement('p')
      temp.textContent = displayHourlyTemp(i)

      hourlyDiv.appendChild(time)
      hourlyDiv.appendChild(temp)

      hourlyContainer.appendChild(hourlyDiv)

      hour++
    }
    hourlyForecast.appendChild(hourlyContainer)
  }

  const displayAllData = async () => {
    displayCity()
    temp.textContent = await displayCurrentTemp()
    populateHourlyForecast()
    //dataModule.getHourlyTemp()
  }

  submitBtn.addEventListener('click', async () => {
    dataModule.setCity(inputEl.value)
    await dataModule.storeCurrentWeather()
    await dataModule.storeHourlyTemp()
    displayAllData()
  })
})()
