document.addEventListener("DOMContentLoaded", (e) => {
    createRequest({
        url: "https://jscp-diplom.netoserver.ru/",
        params: "event=update",
        callback: (response) => {
            let films = response.films.result
            let halls = response.halls.result
            let seances = response.seances.result
            const data = {
                films,
                halls,
                seances
            }

            let info = document.querySelector("main")

            data.films.forEach((film) => {
                let filmId = film.film_id;
                
                let movie = document.createElement("section");
                movie.classList.add("movie");
                movie.innerHTML += `<div class="movie__info row justify-content-center g-0" film_id="${film.film_id}">
                    <div class="movie__poster ">
                        <img class="movie__poster-image" alt="${film.film_name} постер" src="${film.film_poster}">
                    </div>
                    <div class="movie__description col-sm-1">
                        <h2 class="movie__title">${film.film_name}</h2>
                        <p class="movie__synopsis">${film.film_description}</p>
                        <p class="movie__data">
                            <span class="movie__data-duration">${film.film_duration} минут</span>
                            <span class="movie__data-origin">${film.film_origin}</span>
                        </p>
                    </div>
                </div>`;
            
                let seancesId = data.seances.filter((seanse) => seanse.seance_filmid === filmId);
                data.halls.forEach((hall) => {
                    if (hall.hall_open === "1") {
                        let seancesInHall = seancesId.filter((seanse) => seanse.seance_hallid === hall.hall_id);
                        if (seancesInHall.length > 0) {
                            let timeNew = seancesInHall.map((seance) => `<li class="movie-seances__time-block">
                                <a class="movie-seances__time" href="hall.html" data-film_name="${film.film_name}" data-film_id="${film.film_id}" data-hall_name="${hall.hall_name}" data-hall_id="${hall.hall_id}" data-seance_time="${seance.seance_time}" data-seance_start="${seance.seance_start}" data-seance_id="${seance.seance_id}">
                                    ${seance.seance_time}
                                </a>
                            </li>`);
    
                            let hallHtml = `<div class="movie-seances__hall">
                                <h3 class="movie-seances__hall-title">${hall.hall_name.slice(0, 3)} ${hall.hall_name.slice(3)}</h3>
                                    <ul class="movie-seances__list">
                                    ${timeNew}
                                    </ul>
                            </div>`;
                            movie.innerHTML += hallHtml;
                        }
                    }
                });

                info.appendChild(movie);
            });

            let days = Array.from(document.querySelectorAll('.page-nav__day'));
            let dayWeek = document.querySelectorAll(".page-nav__day-week");
            let dayList = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            let allSeances = Array.from(document.querySelectorAll(".movie-seances__time"))
            let numbers = document.querySelectorAll(".page-nav__day-number")
            
            let today = new Date();
            today.setHours(0, 0, 0, 0)

            let newTime = new Date().getTime()

            function listDayNumber(index, dayDate) {
                dayDate.setDate(dayDate.getDate() + index);
                return dayDate
            }

            numbers.forEach((number, index) => {
                let dayDate = new Date(today);
               
                listDayNumber(index, dayDate)
                
                number.textContent = dayDate.getDate()
                dayWeek[index].textContent = dayList[dayDate.getDay()]
                
                if (dayWeek[index].textContent == "Сб" || dayWeek[index].textContent == "Вс") {
                    dayWeek[index].parentElement.classList.add("page-nav__day_weekend")        
                } else {
                    dayWeek[index].parentElement.classList.remove("page-nav__day_weekend")
                }
            })

            allSeances.forEach((time) => {
                let seanceTime = Number(time.dataset.seance_start) * 60000
               
                let startTime = today.getTime() + seanceTime

                let startTimeToday = today.getTime() + seanceTime
                time.setAttribute("data-time", startTimeToday)
   
                if (newTime > startTime) {
                    time.setAttribute("onclick", "return false")
                    time.style.backgroundColor = "#bcbcbc"
                } else {
                    time.removeAttribute("style", "onclick")
                }
               
                time.addEventListener("click", (e) => {

                    let chosenDay = document.querySelector(".page-nav__day_chosen")                    
                    document.cookie = `day=${chosenDay.getAttribute("day")};`

                    let idHallSelect = e.target.getAttribute("data-hall_id")
                    let selectHall = data.halls.find((hall) => hall.hall_id === idHallSelect)
                    let config = selectHall.hall_config
                    let priseStandart = selectHall.hall_price_standart
                    let priceVip = selectHall.hall_price_vip
                    
                    let attrubuts = {
                        ...e.target.dataset,
                        config,
                        priseStandart,
                        priceVip
                    }
            
                    localStorage.clear();
                    localStorage.setItem("selected", JSON.stringify(attrubuts));
                
                })
                    
            })

            days.forEach((day, number) => {
               
                let dayDate = new Date(today);

                listDayNumber(number, dayDate)
                day.setAttribute("day", dayDate.getTime())

                if (dayDate.getTime() === today.getTime()) {
                    day.classList.add("page-nav__day_today", "page-nav__day_chosen");
                } else {
                    day.classList.remove("page-nav__day_chosen")
                }

                day.addEventListener("click", (e) => {
                    e.preventDefault();

                    let find = document.querySelector(".page-nav__day_chosen")
                    if (find) {
                        find.classList.remove("page-nav__day_chosen")
                    }
                    day.classList.add("page-nav__day_chosen")

                    let time = document.querySelectorAll(".movie-seances__time")

                    for (let i = 0; i < time.length; i++) {
                        
                        let attrTime = +time[i].getAttribute("data-seance_start") * 60000
                        let attrDay = day.getAttribute("day")
                        let attrTimeNew = +attrDay + +attrTime
                       
                        time[i].setAttribute("data-time", attrTimeNew)

                        if (newTime > attrTimeNew) {
                            time[i].setAttribute("onclick", "return false")
                            time[i].style.backgroundColor = "#bcbcbc"
                        } else {
                            time[i].removeAttribute("style")
                            time[i].removeAttribute("onclick")
                        }

                    }
                })

                function getCookie() {
                    return document.cookie.split("; ").reduce((acc, item) => {
                        const [name, value] = item.split("=")
                        acc[name] = value
                        return acc
                    }, {})
                }
    
                let indexDay = getCookie()

                let attrDay = day.getAttribute("day")
                if (indexDay.day === attrDay) {
                    day.click()
                }
                
            })

        }
    })
})


