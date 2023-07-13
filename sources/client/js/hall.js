const select = JSON.parse(localStorage.selected);

document.addEventListener("DOMContentLoaded", (e) => {
    
    let filName = document.querySelector(".buying__info-title")    
    let hallNameSelect = `${select.hall_name.slice(0, 3)} ${select.hall_name.slice(3)}`
    
    filName.textContent = select.film_name
    document.querySelector(".buying__info-start").textContent = `Начало сеанса: ${select.seance_time}`
    document.querySelector(".buying__info-hall").textContent = hallNameSelect
    document.querySelector(".price-standart").textContent = select.priseStandart
    document.querySelector(".price-vip").textContent = select.priceVip
    
    let price = 0
    
    localStorage.removeItem("selectedFilm")
    
    let seanceTimestamp = String((select.time / 1000).toFixed(0))
    
    createRequest({
        url: "https://jscp-diplom.netoserver.ru/",
        params: `event=get_hallConfig&timestamp=${seanceTimestamp}&hallId=${select.hall_id}&seanceId=${select.seance_id}`,
        callback: (response) => {
            if (response) {
                select.config = response
            }

            let wraper = document.querySelector(".conf-step__wrapper")
            wraper.insertAdjacentHTML("afterBegin", select.config)

            let rows = document.querySelectorAll(".conf-step__row")
            
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i]
                
                let chair = row.querySelectorAll(".conf-step__chair")
                let chairNumber = 0
                
                for (let j = 0; j < chair.length; j++) {
                    let chairJ = chair[j]
                    
                    if (!chairJ.classList.contains("conf-step__chair_disabled")) {
                        chairJ.setAttribute("indexPlaces", ++chairNumber)                        
                    }
                }
                row.setAttribute("indexRow", i + 1)
            }
            
            let chairs = document.querySelectorAll(".conf-step__chair") 
            chairs.forEach((chair) => {
                if (chair.classList.contains("conf-step__chair_disabled")) {
                    chair.setAttribute("disabled", true)
                } else {
                    chair.removeAttribute("disabled")
                }

                if (chair.classList.contains("conf-step__chair_taken")) {
                    chair.classList.remove("conf-step__chair_standart", "conf-step__chair_vip")
                }
            
                chair.addEventListener("click", (e) => {

                    let vipChair = e.target.classList.contains("conf-step__chair_vip");
                    let chairSelected = e.target.classList.contains("conf-step__chair_selected");

                    if (chairSelected) {
                        if (vipChair) price -= +select.priceVip;
                        else price -= +select.priseStandart;
                        e.target.classList.remove("conf-step__chair_selected");
                    } else {
                        if (vipChair) price += +select.priceVip;
                        else price += +select.priseStandart;
                        e.target.classList.add("conf-step__chair_selected");
                    }
                })
            })

            let buttonAcceptin = document.querySelector(".acceptin-button")

            buttonAcceptin.addEventListener("click", (e) => {
                e.preventDefault()
            
                let selectData = []
            
                let selectedChair = document.querySelectorAll(".conf-step__chair_selected")
            
                selectedChair.forEach((selected) => {
                    let place = selected.getAttribute("indexPlaces")
                    if (place) {
                        let parent = selected.parentNode
                        let row = parent.getAttribute("indexRow")
                                    
                        selectData.push({
                            row: row,
                            place: place
                        })
                    }
                })
            
                if (selectData.length <= 0) {
                    alert("Место не выбрано! Пожалуйста, выберете место")
                    return
                } 
                
                let hallConfig = document.querySelector(".conf-step__wrapper").innerHTML
            
                let dataSelect = {
                    film: filName.textContent,
                    hallName: select.hall_name,
                    place: selectData,
                    price: price,
                    timestamp: seanceTimestamp,
                    hallId: select.hall_id,
                    idSeance: select.seance_id,
                    hallConfiguration: hallConfig
                }
                localStorage.setItem("selectedFilm", JSON.stringify(dataSelect))
                window.location.href='./payment.html'
            })
        }
    })
});