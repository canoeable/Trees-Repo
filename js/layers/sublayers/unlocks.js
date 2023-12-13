addLayer("unl", {
    name: "unlocks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color()  {return numHex(calcNumToHex(10, player.unl.milestones.length))},
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row),
    layerShown(){return hasUpgrade('b', 21) || hasMilestone('unl', 1)},
    tooltip() {return `${format(D(player.unl.milestones.length), 0)} unlocks`},
    tabFormat: [
        ["display-text", () => layerText('unl', format(D(player.unl.milestones.length), 0))+" unlocks"],
        "milestones",
    ],
    milestones: {
        1: {
            requirementDescription: "40 bytes",
            effectDescription: "B buyables are free",
            done() {return player.b.points.gte(40) && hasUpgrade('b', 21)}
        },
        2: {
            requirementDescription: "450 B buyable levels",
            effectDescription: "Autobuy B buyables",
            done() {return getBuyableAmount('b', 11).add(getBuyableAmount('b', 12)).add(getBuyableAmount('b', 13)).gte(450)}
        },
        3: {
            requirementDescription: "1e19 bytes",
            effectDescription: "^2 upgrade 25",
            done() {return player.b.points.gte(1e19)},
            unlocked() {return hasMilestone('unl', 2)},
        },
        4: {
            requirementDescription: "1 kilobyte",
            effectDescription: "x1.5 bytes, x1.5 points",
            done() {return player.kb.points.gte(1)},
            unlocked() {return hasMilestone('unl', 3)},
        },
        5: {
            requirementDescription: "3 total kilobytes",
            effectDescription: "Generate 100% of bytes gain on reset per second.",
            done() {return player.kb.total.gte(3)},
            unlocked() {return hasMilestone('unl', 4)},
        },
        6: {
            requirementDescription: "5 <b>Generic Buyable?</b> levels",
            effectDescription: "Keep B upgrades on kilobyte reset",
            done() {return getBuyableAmount('kb', 11).gte(5)},
            unlocked() {return hasMilestone('unl', 5)},
        },
        7: {
            requirementDescription: "500,000 kilobytes",
            effectDescription: "Unlock a new layer",
            done() {return player.kb.points.gte(500000) && hasUpgrade('ab', 21)},
            unlocked() {return (hasMilestone('unl', 6) && hasUpgrade('ab', 21)) || hasMilestone(this.layer, this.id)},
        },
        8: {
            requirementDescription: "1 megabyte",
            effectDescription: "x2.5 kilobytes and x3.5 🆎",
            done() {return player.mb.points.gte(1)},
            unlocked() {return hasMilestone('unl', 7)},
        },
        9: {
            requirementDescription: "2 megabytes",
            effectDescription: "Unlock some new 🆎 upgrades, and x10 kilobytes",
            done() {return player.mb.points.gte(2)},
            unlocked() {return hasMilestone('unl', 8)},
        },
    },
    doReset(resettingLayer) {
        if(resettingLayer == 'eb') {
            let x = player.unl.milestones
            let index = [x.indexOf(1),x.indexOf(2),x.indexOf(3),x.indexOf(4),x.indexOf(5),x.indexOf(6),x.indexOf(7)]
            player.unl.milestones.splice()
        } else return
    }
})