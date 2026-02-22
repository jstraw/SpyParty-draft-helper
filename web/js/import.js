var competition_data = {};
var constants = {};

window.onload = async function() {
    window.fetch(new Request("data/contests.json")).then((resp) => {
        if (!resp.ok) {
            throw new Error('HTTP error! Status: ${response.status} - ${response.text}');
        }
        return resp.json();
    })
    .then((compdata) => {
        competition_data = compdata["contests"];
        console.log(compdata);
        var compdropdown = document.getElementById("competition");
        console.log(compdropdown);
        for (const c in compdata["contests"]) {
            var opt = document.createElement("option");
            opt.textContent = c;
            opt.value = c;
            compdropdown.appendChild(opt);
        }
    })

    constants = await window.fetch(new Request("data/constants.json")).then((resp) => {
        if (!resp.ok) {
            throw new Error('HTTP error! Status: ${response.status} - ${response.text}');
        }
        return resp.json();
    })
    console.log(constants);
}

function update_venuesets() {
    const competition = document.getElementById("competition").value;
    if (competition == "NONE") {
        return;
    }
    for (var vs of ["venueset_banA", "venueset_banB", "venueset_pickA", "venueset_pickB"]) {
        const venueset = document.getElementById(vs);
        while (venueset.firstChild) {
            venueset.removeChild(venueset.lastChild);
        }
        if (vs.includes("ban")) {
            var opt = document.createElement("option");
            opt.textContent = "Skip Ban";
            opt.value = "NONE";
            venueset.append(opt);
        }
        console.log("adding compeitions to " + vs);
        for (var venue of competition_data[competition]["venueset"]) {
            var opt = document.createElement("option");
            opt.textContent = venue;
            opt.value = venue;
            venueset.append(opt);
        }
    }
}


function roll_the_dice() {
    const status = document.getElementById("status");
    status.innerHTML = "";
    console.log(competition_data);
    const competition = document.getElementById("competition").value;
    if (competition == "NONE") {
        status.innerHTML = "Please Select A Contest (then Reroll Dice)";
        return
    }
    var player1 = document.getElementById("player1").value;
    var player2 = document.getElementById("player2").value;
    console.log(player1);
    console.log(player2);
    if (player1 == "" || player2 == "") {
        status.innerHTML = "Please Enter Players, then Reroll Dice";
        return;
    }
    var coin = Math.random() + .5;
    document.getElementById("coinflip").value = "Coin Flipped (raw):" + coin;
    if (Math.floor(coin) == 0) {
        console.log(Math.floor(coin));
        var playerA = player1;
        var playerB = player2;
        } else {
        console.log(Math.floor(coin));
        var playerA = player2;
        var playerB = player1;
    }
    document.getElementById("whoisplayerA").value = playerA;
    document.getElementById('nosideorban_opt').textContent = `${document.getElementById('whoisplayerA').value} Chooses spy/sniper or pick/ban:`;
    
}

function update_player(id) {
    document.getElementById(`player${id}_opt`).value = document.getElementById(`player${id}`).value;
    document.getElementById(`player${id}_opt`).textContent = document.getElementById(`player${id}`).value;
}

function set_question_players() {
    const sideorban = document.getElementById("sideorban").value;
    var choose = "";
    var second = "";
    console.log(sideorban);
    if (sideorban == 'nope') {return;}
    if (document.getElementById('whoisplayerA').value == player1) {
        choose = document.getElementById("player1").value;
        second = document.getElementById("player2").value;
    } else {
        second = document.getElementById("player1").value;
        choose = document.getElementById("player2").value;
    }

    document.getElementById("firstchoice").value = choose;
    document.getElementById("secondchoice").value = second;
    if (sideorban == "spysnipe") {
        document.getElementById('nospyorsnipe_opt').textContent = `${choose} Chooses spy/sniper first:`;
        document.getElementById('nopickorder_opt').textContent = `${second} Chooses to Pick/Ban 1st or 2nd:`;
    } else {
        document.getElementById('nospyorsnipe_opt').textContent = `${second} Chooses spy/sniper first:`;
        document.getElementById('nopickorder_opt').textContent = `${choose} Chooses to Pick/Ban 1st or 2nd:`;
    }

}

function do_pick(id_sel, sel_key, sub_key, fc, sc) {
    var sideorban = document.getElementById("sideorban").value;
    var selection = document.getElementById(id_sel).value;
    console.log(`Picking for ${sideorban} == ${sel_key} - ${id_sel} || ${sub_key} [${fc}, ${sc}]`);
    if (document.getElementById("sideorban").value == sel_key) {    
        if (document.getElementById(id_sel).value == sub_key) {
            playerA = fc;
            playerB = sc;
        } else {
            playerA = sc;
            playerB = fc;
        }
    } else {
        if (document.getElementById(id_sel).value == sub_key) {
            playerA = sc;
            playerB = fc;
        } else {
            playerA = fc;
            playerB = sc;
        }
    }
    console.log(playerA, playerB);
    return [playerA, playerB];
}

function set_pick_order() {
    console.log(`Pick order`)
    const fc = document.getElementById("firstchoice").value;
    const sc = document.getElementById("secondchoice").value;
    let [playerA, playerB] = do_pick("pickorder", "pickban", "first", fc, sc);
    console.log(`Picking First: ${playerA}, Second: ${playerB}`);
    document.getElementById("playerA").value = playerA;
    document.getElementById("playerB").value = playerB;
    update_players();
}

function set_spy_order() {
    console.log(`spy order`)
    const fc = document.getElementById("firstchoice").value;
    const sc = document.getElementById("secondchoice").value;
    let [firstspy, firstsnipe] = do_pick("spyorsnipe", "spysnipe", "spy", fc, sc);
    
    console.log(`First spy: ${firstspy}, First sniper: ${firstsnipe}`)
    document.getElementById("firstspy").value = firstspy;
    document.getElementById("firstsnipe").value = firstsnipe;


}


function update_players() {
    const contest_data = competition_data[competition]
    const playerA = document.getElementById("playerA").value;
    const playerB = document.getElementById("playerB").value;
    var text = "Optional Venue Set Ban for: ";
    document.getElementById("label_venueset_banA").innerHTML = `${text}${playerA}`;
    document.getElementById("label_venueset_banB").innerHTML = `${text}${playerB}`;
    text = "Venue Set Pick for: ";
    document.getElementById("label_venueset_pickA").innerHTML = `${text}${playerA}`;
    document.getElementById("label_venueset_pickB").innerHTML = `${text}${playerB}`;
    text = "Venue Ban for: ";
    document.getElementById("label_venue_banA").innerHTML = `${text}${playerA}`;
    document.getElementById("label_venue_banB").innerHTML = `${text}${playerB}`;
}

function do_populate_venues() {
    console.log(constants)
    const status = document.getElementById("status");
    status.innerHTML = "";
    const competition = document.getElementById("competition").value;
    var prop = "";
    try {
        prop = competition_data[competition]["prop"] + ".json";
    } catch (TypeError) {
        status.innerHTML = "Set a Competition first (can't generate venues without earlier data)"
        return;
    } 
    console.log("Prop File: " + prop);
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
        
    
    return;
}

function generate_draft() {
    console.log("Generate Draft Text");
    let text = "";
    const competiton = document.getElementById("competition").value;
    const emote = competition_data[competiton]["emote"];
    text += `# :${emote}: ${competiton} :${emote}:\n`;
    text += `## ${document.getElementById('player1').value} vs ${document.getElementById('player2').value}\n\n`;
    text += `${document.getElementById('whoisplayerA').value} wins coinflip / rankings\n`;
    text += `${document.getElementById('firstspy').value} will spy first and ${document.getElementById('firstsnipe').value} will snipe first\n`;
    text += `${document.getElementById('playerA').value} will pick first and ${document.getElementById('playerB').value} will pick second\n`;

    if (document.getElementById('venueset_banA').value != 'NONE') {
        text += `${document.getElementById('playerA').value} bans the venue pool: ${document.getElementById('venueset_banA').value}\n`;
    }
    if (document.getElementById('venueset_banB').value != 'NONE') {
        text += `${document.getElementById('playerB').value} bans the venue pool: ${document.getElementById('venueset_banB').value}\n`;
    }

    text += `${document.getElementById('playerA').value} picks the venue pool: ${document.getElementById('venueset_pickA').value}\n`;
    text += `${document.getElementById('playerB').value} picks the venue pool: ${document.getElementById('venueset_pickB').value}\n`;

    if (document.getElementById('venue_banA').value != 'NONE') {
        text += `${document.getElementById('playerA').value} bans the venue: ${document.getElementById('venue_banA').value}\n`;
    }
    if (document.getElementById('venue_banB').value != 'NONE') {
        text += `${document.getElementById('playerB').value} bans the venue: ${document.getElementById('venue_banB').value}\n\n\n`;
    }

    // text += play_order();

    text += "### Results";

    document.getElementById("draft_text").value = text;
}