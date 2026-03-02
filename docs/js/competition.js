"use strict";
document.getElementById("competition").onchange = function () {
    if (this.value == "NONE") {
        console.info("Competition is not Set (todo, cleanup)");
        return;
    }

    
    sessionStorage.setItem("competition", this.value);
    let venueset = get_competition_value("venueset");
    session_set_json("venueset", venueset);
    console.info(`venueset: ${venueset}`);

    const choosefirst_options = get_competition_value("choosefirst");
    console.info(`Options for First Choice: ${choosefirst_options}`);

    const cfParagraph = document.getElementById("choosefirst");

    for (let opt of choosefirst_options) {
        switch (opt) {
            case "rating":
                console.log("Adding Rating Choose First Option");
                const rating = document.createElement("input");
                rating.type = "button";
                rating.id = "choosefirstByRating";
                rating.value = "Choose First By Rating/Results";
                cfParagraph.appendChild(rating);
                rating.addEventListener("click", override_onclick);
                break;
            case "coinflip":
                console.log("Adding Coin Flip Choose First Option");
                const coinflip = document.createElement("input");
                coinflip.type = "button";
                coinflip.id = "choosefirstByCoinflip";
                coinflip.value = "Choose First By Coin Flip";
                cfParagraph.appendChild(coinflip);
                coinflip.addEventListener("click", coinflip_onclick);
                break;
            case "override":
                console.log("Adding Override Choose First Option");
                const override = document.createElement("input");
                override.type = "button";
                override.id = "choosefirstByOverride";
                override.value = "Override First Choice";
                cfParagraph.appendChild(override);
                override.addEventListener("click", override_onclick);
                break;
            default:
                console.warn(`Invalid chooosefirst option ${opt}`);
                break;
        }
    }
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
