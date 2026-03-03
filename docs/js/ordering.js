"use strict";

function whochoosefirst_choice() {
    const selection = document.getElementById("whochoosefirst").value;
    const player1 = sessionStorage.getItem("player1");
    const player2 = sessionStorage.getItem("player2");
    let first = "";
    let second = "";
    console.info(`Select role/order: ${selection} ${player1} ${player2}`);
    if (selection == "none") {
        console.warn("Somehow got none, ignore");
    } else if (selection == "player1") {
        console.info(`${player1} will select role/order`);
        first = player1;
        second = player2;
        
    } else {
        console.info(`${player2} will select role/order`);
        first = player2;
        second = player1;
    }
    sessionStorage.setItem("first_player", first);
    sessionStorage.setItem("second_player", second);
    choose_spysnipe_pick(first);
}

function choose_spysnipe_pick(first) {
    console.info(`${first} is selecting spy/snipe or pick order`);
    const paragraph = document.getElementById("spysnipe_or_pick_paragraph")
    paragraph.innerHTML = `<span><select name="spysnipe_or_pick" id="spysnipe_or_pick" onchange="spysnipe_or_pick_cb();">
                <option value="none" selected>${first} chooses to select Role or Pick Order</option>
                <option value="spysnipe">Spy or Snipe First</option>
                <option value="pickorder">Pick First/Second</option>
            </select}</span><br />`;
}

function spysnipe_or_pick_cb() {
    const choice = document.getElementById("spysnipe_or_pick").value;
    if (choice == "none") { 
        set_status("Choose Spy or Snipe First | Pick First/Second");
        return; 
    }
    console.info("In spysnipe_or_pick_cb");
    let role = "";
    let pick = "";
    if (choice == "spysnipe") {
        role = sessionStorage.getItem("first_player");
        pick = sessionStorage.getItem("second_player");
    } else {
        pick = sessionStorage.getItem("first_player");
        role = sessionStorage.getItem("second_player");
    }
    sessionStorage.setItem("spysnipe_choice", role);
    sessionStorage.setItem("pickorder_choice", pick);
    console.info(`${role} will select Spy/Snipe and ${pick} will select order`)


    let rolespan = document.createElement('span');
    rolespan.innerHTML = `<br /><select name="spysnipe" id="spysnipe" onchange="spysnipe_cb();">
                <option value="none" selected>${role} chooses to Spy or Snipe first</option>
                <option value="spy">Spy First</option>
                <option value="snipe">Snipe First</option>
            </select}</span> `;
    let pickspan = document.createElement('span');
    pickspan.innerHTML = `<select name="pickorder" id="pickorder" onchange="pickorder_cb();">
                <option value="none" selected>${pick} chooses to Pick/Ban First or Second</option>
                <option value="first">Pick/Ban First</option>
                <option value="second">Pick/Ban Second</option>
            </select}</span> `;
    const para = document.getElementById("spysnipe_or_pick_paragraph");
    para.appendChild(rolespan);
    para.appendChild(pickspan);


}

function spysnipe_cb() {
    const choice = document.getElementById("spysnipe").value;
    const player = sessionStorage.getItem("spysnipe_choice");
    if (choice == "none") {
        set_status("Choose Spy First or Sniper First");
        return;
    }
    let spy, sniper;
    if (choice == "spy") {
        spy = player;
        sniper = get_other_player(player);
    } else {
        spy = get_other_player(player);
        sniper = player
    }
    console.info(`First Spy: ${spy} | First Sniper: ${sniper}`);
    sessionStorage.setItem("spyfirst", spy);
    sessionStorage.setItem("snipefirst", sniper);
    do_populate_venuesets();
}

function pickorder_cb() {
    const choice = document.getElementById("pickorder").value;
    const player = sessionStorage.getItem("pickorder_choice");
    if (choice == "none") {
        set_status("Choose Pick First or Pick Second");
        return;
    }
    let first, second;
    if (choice == "first") {
        first = player;
        second = get_other_player(player);
    } else {
        first = get_other_player(player);
        second = player
    }
    console.info(`First Pick: ${first} | Second Pick: ${second}`);
    sessionStorage.setItem("playerA", first);
    sessionStorage.setItem("playerB", second);
    do_populate_venuesets();
}