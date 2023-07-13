const select = JSON.parse(localStorage.selectedFilm)

import { dataFilm } from "./function.js"

dataFilm()

let cost = document.querySelector(".ticket__cost")
cost.textContent = select.price

let buttonAcception = document.querySelector(".acceptin-button")

let hallConfig = select.hallConfiguration.replace(/conf-step__chair_selected/g, "conf-step__chair_taken");
let params = `event=sale_add&timestamp=${select.timestamp}&hallId=${select.hallId}&seanceId=${select.idSeance}&hallConfiguration=${hallConfig}`

buttonAcception.addEventListener("click", (e) => {
    e.preventDefault()

    fetch ("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        body: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data.sales.result)
        window.location.href='./ticket.html'
    })
    .catch(error => console.error(error));

    
});