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
    return JSON.parse(sessionStorage.getItem(key));
}

function get_competition_value(key) {
    const competition = sessionStorage.getItem("competition");
    const data = session_get_json("competitions")[competition];
    console.info(`Looking up competition data: ${competition} - ${key} in ${data}`);
    if (Object.keys(data).includes(key)) {
        return data[key];
    } else {
        return null
    }
}