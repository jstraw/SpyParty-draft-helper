"use strict";

const stage_lookup = {
    "choosefirst": draft_choosefirst,
    "role": draft_role,
    "order": draft_order,
    "pickban": draft_pickban
}

function generate_draft() {
    console.log("Generate Draft Text");
    let text = "";
    const competition = sessionStorage.getItem("competition");
    const emote = get_competition_value("emote");
    let draft = get_competition_value("draft");

    text += `# :${emote}: ${competition} :${emote}:\n`;
    text += `## ${sessionStorage.getItem('player1')} vs ${sessionStorage.getItem('player2')}\n\n`;
    for (let stage of draft) {
        console.debug(`Draft ${stage} in`);
        switch (stage) {
            case "choosefirst":
                text += draft_choosefirst();
                break;
            case "role":
                text += draft_role();
                break;
            case "order":
                text += draft_order();
                break;
            default:
                text += draft_pickban(stage);
                break;
        }
        console.debug(`Draft ${stage} out`);
    }

    text += "\n\n### Results\n\n";

    document.getElementById("draft_text").value = text;
    print_playlist();
}

function draft_choosefirst() {
    const choiceby = sessionStorage.getItem("choiceby");
    const fp = sessionStorage.getItem("first_player");
    switch (choiceby) {
        case "coinflip":
            return `${fp} wins the coinflip (${sessionStorage.getItem("coinflip_val")})\n`;
            break;
        default:
            return `${fp} is going to choose first (${choiceby})\n`;
            break;
    }
}

function draft_role() {
    return `${sessionStorage.getItem("spyfirst")} will Spy First and ${sessionStorage.getItem("snipefirst")} will Snipe First\n`;
}

function draft_order() {
    return `${sessionStorage.getItem("playerA")} will Pick/Ban First and ${sessionStorage.getItem("playerB")} will Pick/Ban Second\n`;
}

function draft_pickban(step) {
    console.log(`${step} in draft_pickban`);
    const regex = /(pick|ban|restrict|double)-(venue?|venueset?)_(AB|BA)/;
    const match = step.match(regex);
    console.log(match);
    let [notavar, pickban, type, order] = match;
    let id0 = `${pickban}-${type}_${order[0]}`;
    let id1 = `${pickban}-${type}_${order[1]}`;
    console.log(`${match} - ${pickban}, ${type}, ${order} ${id0} | ${id1}`);
    let pick0 = document.getElementById(id0);
    let pick1 = document.getElementById(id1);
    let text = "";
    if (pick0 == "none") {
        text += `${sessionStorage.getItem("player"+order[0])} Skips ${pickban}\n`;
    } else {
        text += `${sessionStorage.getItem("player"+order[0])} ${pickban}s the ${type}: ${document.getElementById(id0).value}\n`;
    }
    if (pick1 == "none") {
        text += `${sessionStorage.getItem("player"+order[1])} Skips ${pickban}\n`;
    } else {
        text += `${sessionStorage.getItem("player"+order[1])} ${pickban}s the ${type}: ${document.getElementById(id1).value}\n`;
    }
    return text;
}

function print_playlist() {
    let text = "### Note: This is Experimental for anything but WC/PP/SCL8 Regular Season atm\n";
    const match_type = sessionStorage.getItem("competition");
    switch (match_type) {
        case ("SCL 8") :
            let ids = ["double-venue_A", "double-venue_B", "pick-venue_A", "pick-venue_B"];
            for (let x of ids) {
                if (x.includes('double')) {
                    text += `${document.getElementById(x).value}\n`;    
                }
                text += `${document.getElementById(x).value}\n`;
            }
            break;
        case("Winter Cup 2026"):
        case("Penguin Pool 2026"):
            const venues = get_venues();
            const banA = document.getElementById("ban-venue_A").value;
            const banB = document.getElementById("ban-venue_B").value;
            let vlA = [];
            let vlB = [];
            const vs_A = document.getElementById(`pick-venueset_A`).value;
            const vs_B = document.getElementById(`pick-venueset_B`).value;
            for (let v of venues) {
                console.debug(`${v} - ${banA} or ${banB} || ${vs_A} - ${vs_B}`);
                if (v == banA || v == banB) {
                    continue;
                }
                if (v.includes(vs_A)) {
                    vlA.push(v);
                } else {
                    vlB.push(v);
                }
                
            }
            while (vlA.length || vlB.length) {
                if (vlA.length) {
                    text += `${vlA.shift()}\n`;
                }
                if (vlB.length) {
                    text += `${vlB.shift()}\n`;
                }
            }
            break;
    }
    document.getElementById("map_playlist").value = text;
}