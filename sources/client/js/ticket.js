const select = JSON.parse(localStorage.selectedFilm)

import { dataFilm } from "./function.js"

dataFilm()

let qr = document.querySelector(".ticket__info-qr");
let info = document.querySelectorAll(".ticket__info")
let timeDate = new Date(+select.timestamp * 1000).toLocaleString('ru-RU').slice(0, 10)

let infoTicket = `Билет на ${timeDate} `
info.forEach((info) => {
    infoTicket += `${info.innerText} `
})

let qrCode = QRCreator(infoTicket, {image: "SVG"})
qrCode.download("qrcode.svg")
qr.append(qrCode.result)
