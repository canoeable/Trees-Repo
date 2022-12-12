addLayer('a', {
    startData() {return {
        unlocked: true,
        points: D(0),
        gain: D(1),
    }},
    type: "none",
    row: 2,
    layerShown: false,
    color: "#ff1414",
    tabFormat: [
        ["display-text", () => `You have ${layerText("a", format(player.a.points))} 🅰️`],
        "blank",
        ["display-text", () => `You are gaining ${layerText("a", format(player.a.gain))} 🅰️ per second`],
        "blank",
        "milestones",
        "buyables",
        "upgrades"
    ],
    update(diff) {
        player.a.gain = calcAgain()
        if(hasUpgrade('ab', 24) || player.a.total.gt(0)) addPoints("a", player.a.gain.mul(diff))
    },
    resource: "🅰️",
})
// 🅰️🅰️🅰️🅰️🅰️🅰️🅰️🅰️🅰️🅰️