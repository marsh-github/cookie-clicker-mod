// thanks for using my mod :)
// enjoy! ~ marsh

(function() {
    if (window.marsh_mod_loaded) {
        Game.Notify("Marsh's Mod", "Already loaded.", [16,5]);
        return;
    }
    window.marsh_mod_loaded = true;

    /*
        GUI
    */

    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes rainbow-border {
        0% { border-color: #ff0000; }
        16% { border-color: #ff7f00; }
        33% { border-color: #ffff00; }
        50% { border-color: #00ff00; }
        66% { border-color: #0000ff; }
        83% { border-color: #4b0082; }
        100% { border-color: #ff0000; }
    }

    @keyframes rainbow-glow {
        0%   { box-shadow: 0 0 10px #ff0000; }
        20%  { box-shadow: 0 0 10px #ff8000; }
        40%  { box-shadow: 0 0 10px #ffff00; }
        60%  { box-shadow: 0 0 10px #00ff00; }
        80%  { box-shadow: 0 0 10px #0000ff; }
        100% { box-shadow: 0 0 10px #ff0000; }
    }

    #marsh-mod-gui {
        position: absolute;
        top: 120px;
        left: 120px;
        background: rgba(15, 15, 15, 0.90);
        color: #fff;
        padding: 15px;

        width: auto;
        min-width: 320px;
        max-width: 600px;

        border: 3px solid #fff;
        border-radius: 12px;
        animation: rainbow-border 4s linear infinite;
        z-index: 999999;
        font-family: "Kavoon", cursive;
        user-select: none;

        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    #marsh-mod-gui h1 {
        font-size: 20px;
        text-align: center;
    }

    #marsh-mod-gui button, #marsh-mod-gui input {
        width: 100%;
        padding: 9px;
        background: #333;
        border: 1px solid #aaa;
        border-radius: 5px;
        color: #fff;
        font-size: 14px;
        transition: 0.2s;
    }

    #marsh-mod-gui button:hover {
        animation: rainbow-glow 1s linear infinite;
        transform: scale(1.03);
        cursor: pointer;
    }
`;
    document.head.appendChild(style);

    const gui = document.createElement("div");
    gui.id = "marsh-mod-gui";
    gui.innerHTML = `
        <h1>Marsh's Mod</h1>
        <button id="burst-btn">Burst Click (x100)</button>
        <button id="auto-click-btn">Toggle Autoclicker</button>
        <button id="gc-btn">Spawn Golden Cookie</button>
        <input id="cookie-input" type="number" placeholder="Enter cookie amount">
        <button id="give-cookies-btn">Give Cookies</button>
        <button id="set-cookies-btn">Set Cookies</button>
        <button id="frenzy-btn">Force Frenzy</button>
        <button id="achievements-btn">Give All Achievements</button>
        <button id="upgrades-btn">Give All Upgrades</button>
        <button id="close-gui">Close</button>
    `;
    document.body.appendChild(gui);

    let off_x = 0, off_y = 0, dragging = false;
    gui.onmousedown = function(e){
        dragging = true;
        off_x = e.clientX - gui.offsetLeft;
        off_y = e.clientY - gui.offsetTop;
    };
    document.onmousemove = function(e){
        if (dragging) {
            gui.style.left = (e.clientX - off_x) + "px";
            gui.style.top = (e.clientY - off_y) + "px";
        }
    };
    document.onmouseup = () => dragging = false;

    /*
        Functionality
    */

    const clickcookie_event = Game.ClickCookie;

    document.getElementById("burst-btn").onclick = () => {
        let extra = 100;
        let interval = setInterval(() => {
            clickcookie_event(null, Game.computedMouseCps);
            extra--;
            if (extra <= 0) clearInterval(interval);
        }, 0);
        Game.Notify("Marsh's Mod", "Burst fired!", [16,5]);
    };

    let auto_click_interval = null;
    document.getElementById("auto-click-btn").onclick = () => {
        if (auto_click_interval) {
            clearInterval(auto_click_interval);
            auto_click_interval = null;
            Game.Notify("Autoclicker", "Stopped.", [16,5]);
        } else {
            auto_click_interval = setInterval(() => {
                clickcookie_event(null, Game.computedMouseCps);
            }, 10);
            Game.Notify("Autoclicker", "Running at 100 CPS!", [16,5]);
        }
    };

    document.getElementById("gc-btn").onclick = () => {
        Game.shimmers.push(new Game.shimmer('golden'));
        Game.Notify("Marsh's Mod", "Golden cookie spawned!", [16,5]);
    };

    document.getElementById("give-cookies-btn").onclick = () => {
        const val = parseFloat(document.getElementById("cookie-input").value);
        if (!isNaN(val)) {
            Game.Earn(val);
            Game.Notify("Marsh's Mod", `Given ${val} cookies!`, [16,5]);
        }
    };

    document.getElementById("set-cookies-btn").onclick = () => {
        const val = parseFloat(document.getElementById("cookie-input").value);
        if (!isNaN(val)) {
            Game.cookies = val;
            Game.Notify("Marsh's Mod", `Cookies set to ${val}!`, [16,5]);
        }
    };

    document.getElementById("frenzy-btn").onclick = () => {
        Game.gainBuff('frenzy', Game.fps * 77, 7);
	    Game.Notify("Marsh's Mod", "Frenzy activated!", [16,5]);
    };

    document.getElementById("achievements-btn").onclick = () => {
        for (let i in Game.Achievements) {
            Game.Win(Game.Achievements[i].name);
        }
        Game.Notify("Marsh's Mod", "All achievements unlocked!", [16,5]);
    };

    document.getElementById("upgrades-btn").onclick = () => {
        for (let i in Game.UpgradesById) {
            Game.UpgradesById[i].earn();
        }
        Game.Notify("Marsh's Mod", "All upgrades unlocked!", [16,5]);
    };

    document.getElementById("close-gui").onclick = () => {
        gui.remove();
        Game.Notify("Marsh's Mod", "GUI closed.", [16,5]);
    };

    Game.Notify("Marsh's Mod", "Loaded successfully!", [16,5]);
})();
