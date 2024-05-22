let allomasok = [];
let jarmuvek = [];
let vonalak = [];
let baseUrl = "https://localhost:44339";
function getAllAllomas() {
    axios
        .get(baseUrl + "/allomasok")
        .then(function (serverResponse) {
            allomasok = serverResponse.data;
            let datalist = document.getElementById("megalloNevek");
            allomasok.forEach(function (allomas) {
                let option = document.createElement("option");
                option.value = allomas.nev;
                datalist.appendChild(option);
                displayIconAtCoordinates(
                    allomas.nev,
                    allomas.koord.x,
                    allomas.koord.y
                );
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}
async function showLines() {
    let numberOfColors = 100;
    let colorPairs = Array.from(
        {length: numberOfColors},
        generateRandomColorPair
    );
    let lightColors = colorPairs.map((pair) => pair[0]);
    let darkColors = colorPairs.map((pair) => pair[1]);
    let vonalJaratok = await axios
        .get(baseUrl + "/vonalak/jaratok")
        .then((response) => response.data);
    let megallok = await Promise.all(
        vonalJaratok.map(async (vonalJarat) => {
            return await axios
                .get(
                    baseUrl +
                        `/vonalak/megallok/${vonalJarat.vonalSzam}/${vonalJarat.jarmuTipus}/fixed`
                )
                .then((response) => response.data)
                .catch((error) => undefined);
        })
    ).then((response) => response.filter((vonal) => vonal !== undefined));
    megallok.forEach((vonal, index) => {
        if (vonal.oda.megallok.length < 2) return;
        let line = "";
        vonal.oda.megallok.forEach((megallo) => {
            line +=
                megallo.allomas.koord.x + "," + megallo.allomas.koord.y + " ";
        });
        let polyline = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polyline"
        );
        polyline.setAttribute("points", line);
        polyline.setAttribute(
            "style",
            `fill:none;stroke:${lightColors[index]};stroke-width:3`
        );
        $("#vonalrajz").append(polyline);
    });
}
function fillOptionLines() {
    axios.get(baseUrl + "/vonalak").then((response) => {
        response.data;
        console.log(vonalak);
        const selectElem = $("#selectLine");
        selectElem.append(`<option selected disabled>válasz</option>`);
        response.data.forEach((element) => {
            selectElem.append(
                `<option value="${element.id}">${element.vonalSzam}</option>`
            );
        });
    });
}
$(document).on("change", "#selectLine", function () {
    axios.get(baseUrl + "/inditasok/" + $(this).val()).then((response) => {
        let valasz = `<tr>
        <th>Vonal</th>
        <th>Nap</th>
        <th>Indulás</th>
    </tr>`;
        response.data.forEach((entry) => {
            valasz += `<tr>
              <td>${entry.vonal}</td>    
                <td>${entry.nap}</td>
                <td>${percekToOraPerc(entry.inditasIdeje)}</td>
            </tr>`;
        });
        $("#timetable").html(valasz);
    });
});
function generateRandomColorPair() {
    let hue = Math.floor(Math.random() * 360);
    let saturation = Math.floor(Math.random() * 50 + 50);
    let lightnessLight = Math.floor(Math.random() * 20 + 70);
    let lightnessDark = Math.floor(Math.random() * 20 + 30);
    return [
        `hsl(${hue}, ${saturation}%, ${lightnessLight}%)`,
        `hsl(${hue}, ${saturation}%, ${lightnessDark}%)`,
    ];
}
function displayIconAtCoordinates(stationName, x, y) {
    let iconDiv = document.createElement("div");
    iconDiv.style.position = "absolute";
    iconDiv.style.left = x - 8 + "px";
    iconDiv.style.top = y - 15 + "px";
    iconDiv.style.zIndex = 1000;
    iconDiv.style.overflow = "visible";
    let icon = document.createElement("i");
    icon.className = "bi bi-geo-fill";
    icon.style.color = "rgb(255, 231, 33)";
    iconDiv.appendChild(icon);
    let relativeDiv = document.createElement("div");
    relativeDiv.style.position = "relative";
    relativeDiv.style.left = "-50%";
    relativeDiv.style.opacity = 0;
    relativeDiv.innerHTML = stationName;
    iconDiv.appendChild(relativeDiv);
    let map = document.getElementById("map");
    map.appendChild(iconDiv);
    icon.addEventListener("click", function () {
        console.log("Icon clicked for station: " + stationName);
    });
    $(icon).hover(
        function () {
            $(relativeDiv).stop().animate({opacity: 1}, 400);
        },
        function () {
            $(relativeDiv).stop().animate({opacity: 0}, 400);
        }
    );
}
function getJarmuvek() {
    axios
        .get("https://localhost:44339/jarmutipusok")
        .then(function (serverResponse) {
            console.log(serverResponse);
            jarmuvek = serverResponse.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}
function getVonalak() {
    axios
        .get("https://localhost:44339/vonalak")
        .then(function (serverResponse) {
            console.log(serverResponse);
            vonalak = serverResponse.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}
function tervezes() {
    let honnanMegallo = document.getElementById("honnanMegallo").value;
    let hovaMegallo = document.getElementById("hovaMegallo").value;
    let honnanMegalloId = getIdByName(honnanMegallo);
    let hovaMegalloId = getIdByName(hovaMegallo);
    let datum = document
        .getElementById("date")
        .value.replace("-", ".")
        .replace("-", ".");
    let ido = document.getElementById("appt").value;
    let ejfeltolElteltPercek = convertTimeToMinutesFromMidnight(ido);
    let vehicle1 = document.getElementById("vehicle1").checked;
    let vehicle2 = document.getElementById("vehicle2").checked;
    let vehicle3 = document.getElementById("vehicle3").checked;
    let line1 = document.getElementById("line1").checked;
    let line2 = document.getElementById("line2").checked;
    let line3 = document.getElementById("line3").checked;
    let line4 = document.getElementById("line4").checked;
    let line5 = document.getElementById("line5").checked;
    let data = {
        honnan: honnanMegalloId,
        hova: hovaMegalloId,
        mikor: ejfeltolElteltPercek,
        indulas_e: true,
        datum: datum,
        jarmuKivetel: [],
        vonalKivetel: [],
    };
    if (vehicle1) {
        let jarmuId = getIdByMegnevezes("NCART");
        if (jarmuId !== null) {
            data.jarmuKivetel.push(jarmuId);
        }
    }
    if (vehicle2) {
        let jarmuId = getIdByMegnevezes("NCBT");
        if (jarmuId !== null) {
            data.jarmuKivetel.push(jarmuId);
        }
    }
    if (vehicle3) {
        let jarmuId = getIdByMegnevezes("NCET");
        if (jarmuId !== null) {
            data.jarmuKivetel.push(jarmuId);
        }
    }
    if (line1) {
        let lineId = "M1";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }
    if (line2) {
        let lineId = "M2";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }
    if (line3) {
        let lineId = "B1";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }
    if (line4) {
        let lineId = "E1";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }
    if (line5) {
        let lineId = "E2";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }
    axios
        .post("https://localhost:44339/dQw4w9WgXcQ/legkevesebb", data)
        .then(function (response) {
            console.log(response.data);
            if (response.data && response.data.length > 0) {
                let table = document.querySelector("#jarat table");
                if (table) {
                    table.innerHTML = "";
                    let headerRow = document.createElement("tr");
                    let headerCells = [
                        "VONAL",
                        "KEZDŐPONT",
                        "UTICÉL",
                        "INDUL",
                        "UTAZÁSI IDŐ",
                    ];
                    headerCells.forEach(function (header) {
                        let cell = document.createElement("th");
                        cell.textContent = header;
                        headerRow.appendChild(cell);
                    });
                    table.appendChild(headerRow);
                    response.data.forEach(function (entry) {
                        let row = document.createElement("tr");
                        displayDataInTableRow(entry, row);
                        table.appendChild(row);
                    });
                }
            }
        })
        .catch(function (error) {
            let table = document.querySelector("#jarat table");
            if (table) {
                table.innerHTML =
                    "<tr class='error'><td colspan='4'>Nincs elérhető útvonal. Kérem próbáljon meg más útvonalat keresni!</td></tr>";
            }
            console.log(error);
        })
        .finally(function () {
            document.getElementById("jarat").style.display = "block";
        });
}
function getIdByName(name) {
    for (let i = 0; i < allomasok.length; i++) {
        if (allomasok[i].nev === name) {
            return allomasok[i].id;
        }
    }
    return null;
}
function getNameById(id) {
    for (let i = 0; i < allomasok.length; i++) {
        if (allomasok[i].id === id) {
            return allomasok[i].nev;
        }
    }
    return null;
}
function getIdByMegnevezes(megnevezes) {
    for (let i = 0; i < jarmuvek.length; i++) {
        if (jarmuvek[i].megnevezes === megnevezes) {
            return jarmuvek[i].id;
        }
    }
    return null;
}
function convertTimeToMinutesFromMidnight(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const minutesFromMidnight = hours * 60 + minutes;
    return minutesFromMidnight;
}
function getVonalNevById(id) {
    for (let i = 0; i < vonalak.length; i++) {
        if (vonalak[i].id === id) {
            return vonalak[i].vonalSzam;
        }
    }
    return null;
}
function displayDataInTable(data) {
    let table = document.querySelector("#jarat table");
    if (!table || !data || data.length === 0) {
        console.log("No table or data available.");
        return;
    }
    let tableBody = table.querySelector("tbody");
    data.forEach(function (entry) {
        let row = document.createElement("tr");
        displayDataInTableRow(entry, row);
        tableBody.appendChild(row);
    });
}
function displayDataInTableRow(entry, row) {
    let vonalSzamCell = document.createElement("td");
    vonalSzamCell.textContent = getVonalNevById(entry.vonal);
    row.appendChild(vonalSzamCell);
    let kezdoMegalloCell = document.createElement("td");
    let kezdoMegalloId = entry.megallok[0].allomas;
    let kezdoMegalloNev = getNameById(kezdoMegalloId);
    kezdoMegalloCell.textContent = kezdoMegalloNev;
    row.appendChild(kezdoMegalloCell);
    let vegsoMegalloCell = document.createElement("td");
    let vegsoMegalloId = entry.megallok[entry.megallok.length - 1].allomas;
    let vegsoMegalloNev = getNameById(vegsoMegalloId);
    vegsoMegalloCell.textContent = vegsoMegalloNev;
    row.appendChild(vegsoMegalloCell);
    let mikorCell = document.createElement("td");
    let mikor = entry.nap + " " + percekToOraPerc(entry.indulasiIdo);
    mikorCell.textContent = mikor;
    row.appendChild(mikorCell);
    let osszesitettIdoCell = document.createElement("td");
    let osszesitettIdo = osszesitettIdoPercek(entry.megallok);
    osszesitettIdoCell.textContent = osszesitettIdo + "p";
    row.appendChild(osszesitettIdoCell);
    row.addEventListener("click", function () {
        let stopRow = row.nextElementSibling;
        if (stopRow && stopRow.classList.contains("stops")) {
            stopRow.remove();
        } else {
            let stops = entry.megallok.map((megallo) =>
                getNameById(megallo.allomas)
            );
            let stopRow = document.createElement("tr");
            stopRow.classList.add("stops");
            let stopCell = document.createElement("td");
            stopCell.colSpan = 4;
            stopCell.textContent = stops.join(" ➔ ");
            stopRow.appendChild(stopCell);
            row.parentNode.insertBefore(stopRow, row.nextSibling);
        }
    });
}
function osszesitettIdoPercek(megallok) {
    let osszeg = 0;
    megallok.forEach(function (megallo) {
        osszeg += megallo.hanyPerc;
    });
    return osszeg;
}
function osszesitettIdoPercek(megallok) {
    let osszeg = 0;
    megallok.forEach(function (megallo) {
        osszeg += megallo.hanyPerc;
    });
    return osszeg;
}
function percekToOraPerc(percek) {
    let ora = Math.floor(percek / 60);
    let perc = percek % 60;
    ora = ora < 10 ? "0" + ora : ora;
    perc = perc < 10 ? "0" + perc : perc;
    return ora + ":" + perc;
}
getAllAllomas();
getJarmuvek();
getVonalak();
showLines();
fillOptionLines();
