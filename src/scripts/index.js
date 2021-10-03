import '../css/cssreset.css'
import '../css/style.css'

const dataModule = (function () {
  let city = 'Torquay'

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

  const getCurrentTemp = async () => {
    const data = await getCurrentWeather()
    return data.main.temp
  }

  return { setCity, getCityName, getCurrentTemp }
})()

const displayModule = (function () {
  const city = document.querySelector('#city')
  const description = document.querySelector('#description')
  const temp = document.querySelector('#temp')
  const inputEl = document.querySelector('#location-input input')
  const submitBtn = document.querySelector('#location-input button')

  const roundTemp = (temp) => {
    let roundedTemp = temp.toString()
    const stringifiedTemp = temp.toString()
    if (roundedTemp.includes('.')) {
      const decPIndex = stringifiedTemp.indexOf('.')
      const stopPoint = decPIndex + 2
      const tempToOneDecP = stringifiedTemp.slice(0, stopPoint)
      roundedTemp = tempToOneDecP.slice(0, decPIndex)
      if (tempToOneDecP[tempToOneDecP.length - 1] >= 5) {
        roundedTemp++
      }
    }
    return roundedTemp
  }

  const displayCity = async () => {
    city.textContent = await dataModule.getCityName()
  }

  const displayCurrentTemp = async () => {
    let tempData = await dataModule.getCurrentTemp()
    tempData = roundTemp(tempData)
    temp.textContent = tempData + '°'
  }

  const displayAllData = function () {
    displayCity(dataModule.readCurrentCity())
  }

  submitBtn.addEventListener('click', () => {
    dataModule.setCity(inputEl.value)
    displayCity()
    displayCurrentTemp()
  })
})()
