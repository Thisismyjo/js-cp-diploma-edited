const select = JSON.parse(localStorage.selectedFilm)

function dataFilm () {
    let nameFilm = document.querySelector(".ticket__title")
    let chairs = document.querySelector(".ticket__chairs")
    let numberHall = document.querySelector(".ticket__hall")
    let timeStart = document.querySelector(".ticket__start")
    
    nameFilm.textContent = select.film
    
    let text = select.place.map(place => `${place.row}/${place.place}`).join(`, `)
    chairs.textContent = text
    
    numberHall.textContent = select.hallName.slice(-1)
    
    let timeDate = new Date(select.timestamp * 1000) 
    let minute = timeDate.getMinutes()
    if (timeDate.getMinutes() < 10) {
        minute = '0' + timeDate.getMinutes()
    }
    
    timeStart.textContent = `${timeDate.getHours()}:${minute}`
}

export { dataFilm }