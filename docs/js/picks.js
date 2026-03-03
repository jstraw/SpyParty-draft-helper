"use strict";

function do_populate_venuesets() {
    let var_check = [
        "playerA",
        "playerB",
        "spyfirst",
        "snipefirst"
    ];
    for (let x of var_check) {
        let value = sessionStorage.getItem(x);
        console.log(`Check ${x} against null: ${value}`)
        if (!value) {
            console.warn(`${x} is null, ${var_check} all need to be filled in.`);
            return;
        }
    }
    let draft_full = get_competition_value("draft");
    const venueset = get_competition_value("venueset");
    console.log(`Draft Data: ${draft_full}`);
    console.log(`Venueset: ${venueset}`);
    let draft = draft_full.filter((entry) => ![
        "choosefirst",
        "role",
        "order"
    ].includes(entry));
    console.debug(`${draft_full} -> ${draft}`);
    session_set_json("pickbans", draft);
    do_draft_step();

}

function do_draft_step() {
    const regex = /(pick|ban|restrict|double)-(venue|venueset)_(AB|BA)/;
    let draft = session_get_json("pickbans");
    let step = draft.shift();
    if (step == null) {
        set_status("Draft Complete");
        generate_draft();
        return;
    }

    // split out the bits of the draft step
    console.log(`${step} for regex ${regex}`);
    const match = step.match(regex);
    console.log(match);
    let [notavar, pickban, type, order] = match;
    console.log(`${match} - ${pickban}, ${type}, ${order}`);
    

    // if we're in a venueset, make sure we have the venuesets
    let venueset = get_competition_value("venueset");
    if (type == "venueset" && !venueset) {
        set_status(`Draft includes a venueset but no venueset is available.`);
        return;
    }
    
    for (let ab of order) {
        console.log(`setup selector for ${pickban} ${type} ${ab}`);
        let player = sessionStorage.getItem(`player${ab}`);
        let label = document.createElement("label")
        label.textContent = `${player} Select a ${pickban}: `
        label.id = `${pickban}-${type}_${ab}_label`;
        document.getElementById("picks_and_bans").appendChild(label);
        let element = document.createElement("select");
        element.id = `${pickban}-${type}_${ab}`;
        document.getElementById("picks_and_bans").appendChild(element);
        let br = document.createElement("br");
        document.getElementById("picks_and_bans").appendChild(br);
        let opt = document.createElement("option");
        opt.value = "none";
        if (pickban == "ban") {
            console.debug(`${pickban} == "ban"`);
            opt.textContent = `Skip ${pickban}`;
        } else if (pickban == "restrict") {
            console.debug(`${pickban} == "restrict"`);
            opt.textContent = `Skip ${pickban}`;
        } else {
            opt.textContent = `${pickban}`;
        }
        element.appendChild(opt);
        if (type == "venueset") {
            for (let v of venueset) {
                let opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                element.appendChild(opt);
            }
        } else if (type == "venue") {
            let venues = get_venues();
            for (let v of venues) {
                let opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                element.appendChild(opt);
            }
        }
    }

    
    
    session_set_json("pickbans", draft);
    console.info(`Wrote out Draft Step ${step}`);
}

function get_venues() {
    console.log("Into get_venue");
    let propdata = session_get_json("propdata");
    console.debug(`${JSON.stringify(propdata)} get_venue`);
    console.log(JSON.stringify(propdata))
    let venuelist = [];
    const venuesets = get_competition_value("venueset");
    console.debug(venuesets);
    if (venuesets == null) {
        for (let venue in propdata['quickplays']['quickplay']) {
            // console.debug(`${venue} data`);
            const v = propdata['quickplays']['quickplay'][venue];
            venuelist.push(`${v['Name']} (${v['NumNeededMissions']}/${v['NumSelectedMissions']})`);
        }
    } else {
        const vs_A = document.getElementById(`pick-venueset_A`).value;
        const vs_B = document.getElementById(`pick-venueset_B`).value;
        for (let venueset of venuesets) {
            console.debug(`looking at ${venueset} ${vs_A} ${vs_B}`);
            if (venueset == vs_A || venueset == vs_B) {
                for (let venue in propdata['venuesets'][venueset]) {
                    console.log(`${venue} data (venueset ${venueset})`);
                    const v = propdata['venuesets'][venueset][venue];
                    venuelist.push(`${v['Name']} (${v['NumNeededMissions']}/${v['NumSelectedMissions']})`);
                }
            }
        }
    }
    return venuelist;
}