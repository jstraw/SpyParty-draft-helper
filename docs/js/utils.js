"use strict";

function clear_status() {
    set_status("");
}

function set_status(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
    console.warn(message);
}

function session_set_json (key, value) {
    sessionStorage.setItem(
        key,
        JSON.stringify(value)
    );
}

function session_get_json (key) {
    // you probably want get_competition_value for anything related to the contest
    // this can be used for getting the prop data and constants as well
    return JSON.parse(sessionStorage.getItem(key));
}

function get_competition_value(key) {
    const competition = sessionStorage.getItem("competition");
    const data = session_get_json("competitions")[competition];
    console.info(`Looking up competition data: ${competition} - ${key} in ${JSON.stringify(data)}`);
    if (Object.keys(data).includes(key)) {
        return data[key];
    } else {
        return null
    }
}

function get_other_player(player) {
    const player1 = sessionStorage.getItem("player1");
    const player2 = sessionStorage.getItem("player2");
    if (player == player1) {
        return player2;
    } else if (player == player2) {
        return player1;
    } 
    return null;
}

function get_venues() {
    const competition = sessionStorage.getItem("competition");
    try {
        prop = session_get_json("prop") + ".json";
    } catch (TypeError) {
        set_status("Set a Competition first (can't generate venues without earlier data)");
        return;
    } 
    console.info("Prop File: " + prop);
    window.fetch(new Request("data/props/" + prop)).then((resp) => {
        if (!resp.ok) {
            throw new Error('HTTP error! Status: ${response.status} - ${response.text}');
        }
        return resp.json();
    })
    .then((propdata) => {
        const pA_vs = document.getElementById("venueset_pickA").value;
        const pB_vs = document.getElementById("venueset_pickB").value;
        const pickA = document.getElementById("venue_banA");
        const pickB = document.getElementById("venue_banB");
        for (const venueset in propdata["venuesets"]) {
            if (venueset == pA_vs || venueset == pB_vs) {
                for (const venue in propdata["venuesets"][venueset]) {
                    const eleA = document.createElement("option");
                    const eleB = document.createElement("option");
                    const need = propdata["venuesets"][venueset][venue]["NumNeededMissions"];
                    const oftotal = propdata["venuesets"][venueset][venue]["NumSelectedMissions"];
                    const type = constants["gametype"][`${propdata["venuesets"][venueset][venue]["GameType"]}`];
                    const venue_name = `${venueset} - ${venue} ${type} (${need}/${oftotal})`;
                    console.log(venue_name)
                    eleA.value = venue_name;
                    eleB.value = venue_name;
                    eleA.textContent = venue_name;
                    eleB.textContent = venue_name;
                    pickA.appendChild(eleA)
                    pickB.appendChild(eleB)
                }
            }
        }
    })
}