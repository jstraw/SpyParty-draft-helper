"use strict";

document.getElementById("set_players").addEventListener("click", function () {
    console.log("set_players");
    update_player("player1", document.getElementById("player1").value);
    update_player("player2", document.getElementById("player2").value);
})

function update_player(player, value) {
    console.log(`Set ${player} to ${value}`)
    if (value == "") {
        sessionStorage.removeItem(player);
    } else {
        sessionStorage.setItem(player, value);
    }
}



function coinflip_onclick() {
    clear_status();
    const competition = sessionStorage.getItem("competition");
    if (!competition) {
        set_status("Please Select A Contest before rolling dice");
        return;
    }

    console.info("Doing Coin Flip")
    const player1 = sessionStorage.getItem("player1");
    const player2 = sessionStorage.getItem("player2");

    if (!player1 || !player2) {
        set_status("Please Enter Players, then Reroll Dice");
        return;
    }

    var coin = Math.random() + .5;
    document.getElementById(
        "choosefirst").appendChild(
            document.createTextNode(
                "Coin Flipped (raw):" + coin));
    let first = "";
    let second = "";
    if (Math.floor(coin) == 0) {
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
    sessionStorage.setItem("choiceby", "coinflip");
    sessionStorage.setItem("coinflip_val", coin);
    choose_spysnipe_pick(first);

}

function override_onclick() {
    console.info("In Override onclick");
    const competition = sessionStorage.getItem("competition");
    if (!competition) {
        set_status("Please Choose a Competition.");
        return;
    }
    const whochoosefirst = document.getElementById("whochoosefirst_paragraph");
    console.info(whochoosefirst.outerHTML);
    const player1 = sessionStorage.getItem("player1");
    const player2 = sessionStorage.getItem("player2");
    if (!player1 || !player2) {
        set_status("Please Enter Players, then Press Button again");
        return;
    }
    let inst = "";
    if (this.value == "Override First Choice") {
        inst = "Choose who will select Role/Pick Order";
        sessionStorage.setItem("choiceby", "override");
    } else {
        inst = "Choose who has a higher rating";
        sessionStorage.setItem("choiceby", "rating");
    }
    whochoosefirst.innerHTML = `<span>${inst}</span>
            <select name="whochoosefirst" id="whochoosefirst" onchange="whochoosefirst_choice();">
                <option value="none" selected>Select a Player</option>
                <option value="player1">${player1}</option>
                <option value="player2">${player2}</option>
            </select>`;
}