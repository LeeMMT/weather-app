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
    const location = city
    const result = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=0b29ad316ae11908404dc3cdb8577d9d`, {
      mode: 'cors',
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        return response
      })
    return result
  }

  const storeCurrentWeather = async () => {
    currentData[0] = await getCurrentWeather()
  }

  const getCurrentTemp = () => {
    return currentData[0].main.temp
  }

  const storeHourlyTemp = async () => {
    if (currentData[0].cod == '404') {
      document.querySelector('#hourly-forecast').innerHTML = ''
      const msg = document.createElement('p')
      msg.classList.add('centered-msg')
      msg.textContent = `It looks like we couldn't find "${city}", please check your spelling and try again.`
      document.querySelector('#hourly-forecast').appendChild(msg)
      return
    }
    const lat = currentData[0].coord.lat
    const lon = currentData[0].coord.lon
    const rawData = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,daily,alerts&appid=0b29ad316ae11908404dc3cdb8577d9d`,
    )

    hourlyData[0] = await rawData.json()
  }

  const getHourlyTemp = (index) => {
    return hourlyData[0].hourly[index]
  }

  return {
    getCurrentHour,
    setCity,
    getCurrentWeather,
    getCityName,
    storeHourlyTemp,
    getCurrentTemp,
    getHourlyTemp,
    storeCurrentWeather,
    currentData,
    hourlyData,
  }
})()

const displayModule = (function () {
  const geo = navigator.geolocation
  const city = document.querySelector('#city')
  const description = document.querySelector('#description')
  const temp = document.querySelector('#temp')
  const mainWeatherContainer = document.querySelector('.main-info-two')
  const inputEl = document.querySelector('#location-input input')
  const submitBtn = document.querySelector('#location-input button')

  const checkUserInput = () => {
    console.log(dataModule.currentData)
    console.log('fired')
  }

  const roundTemp = (temp) => {
    return Math.floor(temp)
  }

  const displayCity = () => {
    city.textContent = dataModule.getCityName()
  }

  const getCurrentIconUrl = () => {
    return dataModule.currentData[0].weather[0].icon + '.png'
  }

  const getHourlyIconUrl = (index) => {
    return dataModule.hourlyData[0].hourly[index].weather[0].icon + '.png'
  }

  const displayCurrentWeatherIcon = () => {
    mainWeatherContainer.innerHTML = ''
    const icon = document.createElement('img')
    icon.src = '../src/assets/icons/' + getCurrentIconUrl()
    mainWeatherContainer.appendChild(icon)
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
    hourlyForecast.innerHTML = '' // Wipes old hourly forecast data from DOM

    const d = new Date()
    const currentHour = d.getHours()

    const hourlyNowDiv = document.createElement('div')
    hourlyNowDiv.classList.add('hour')

    const time = document.createElement('p')
    time.textContent = 'Now'

    const icon = document.createElement('img')
    icon.classList.add('icon')
    let iconPath = '../src/assets/icons/' + getCurrentIconUrl()
    icon.src = iconPath

    const temp = document.createElement('p')
    temp.textContent = displayCurrentTemp()

    hourlyNowDiv.appendChild(time)
    hourlyNowDiv.appendChild(icon)
    hourlyNowDiv.appendChild(temp)
    hourlyContainer.appendChild(hourlyNowDiv)

    let isAm = false
    let hour = currentHour + 1

    for (let i = 1; i < 26; i++) {
      const hourlyDiv = document.createElement('div')
      hourlyDiv.classList.add('hour')

      const time = document.createElement('p')
      if (hour < 10) {
        time.textContent = '0' + hour
      } else if (hour > 24) {
        hour = 0
        time.textContent = '0' + hour
      } else {
        time.textContent = hour
      }

      const icon = document.createElement('img')
      icon.classList.add('icon')
      let iconPath = '../src/assets/icons/' + getHourlyIconUrl(i)
      icon.src = iconPath

      const temp = document.createElement('p')
      temp.textContent = displayHourlyTemp(i)

      hourlyDiv.appendChild(time)
      hourlyDiv.appendChild(icon)
      hourlyDiv.appendChild(temp)
      hourlyContainer.appendChild(hourlyDiv)

      hour++
    }
    hourlyForecast.appendChild(hourlyContainer)
  }

  const displayAllData = async () => {
    displayCity()
    temp.textContent = await displayCurrentTemp()
    description.textContent = dataModule.currentData[0].weather[0].description
    displayCurrentWeatherIcon()
    populateHourlyForecast()
    checkUserInput()
  }

  submitBtn.addEventListener('click', async () => {
    dataModule.setCity(inputEl.value)
    await dataModule.storeCurrentWeather()
    await dataModule.storeHourlyTemp()
    displayAllData()
  })

  window.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && inputEl.value) {
      dataModule.setCity(inputEl.value)
      await dataModule.storeCurrentWeather()
      await dataModule.storeHourlyTemp()
      displayAllData()
    }
  })
})()
