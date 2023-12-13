addLayer("kb", {
    name: "kilobytes", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "KB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        //minreq: D(2.5e29)
    }},
    color: "#a155f2",
    requires() {
        let base = new Decimal('2.5e29') // Base layer cost
        let mul = D(1) // Cost multiplier
        let exp = D(1) // Cost exponent
        let cost = base.mul(mul).pow(exp) // Layer cost = Base cost*Cost multiplier^Cost exponent
        return cost // Returns cost if its higher than the minimum requirement, else returns the minimum requirement
    }, // Can be a function that takes requirement increases into account
    resource: "kilobytes", // Name of prestige currency
    baseResource: "bytes", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = 0.07
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect('kb', 12))
        if(hasUpgrade('kb', 14)) mult = mult.mul(2)
        if(hasUpgrade('kb', 15)) mult = mult.mul(4)
        if(hasUpgrade('kb', 21)) mult = mult.mul(12)
        if(hasUpgrade('ab', 22)) mult = mult.mul(11)
        if(hasMilestone('unl', 8)) mult = mult.mul(2.5)
        if(hasMilestone('unl', 9)) mult = mult.mul(10)
        if(hasUpgrade('eb', 11)) mult = mult.mul(2.222)
        return mult
    },
    componentStyles: {
        "prestige-button"() { return {'border-radius': "30px", 'border-top-right-radius': '0px', 'border-bottom-right-radius': "0px"} }
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "k", description: "K: Reset for kilobytes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown: true,
    upgrades: {
        11: {
            title: "Start II",
            description: "Start with 1024 bytes on reset and unlock a buyable",
            cost: D(3),
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "25%",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        12: {
            title: "useful upgradeTM",
            description: "You start with 3e25 bytes on reset.",
            cost: D(25),
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        13: {
            title: "free! (buyable levels)",
            description: "Gain more <b>Generic Buyable</b> levels based on kilobytes.",
            cost: D(50),
            effect() {
                let eff = player.kb.points.floor().mul(50)
                eff = eff.min(4900)
                return eff
            },
            effectDisplay() {return `+${formatWhole(upgradeEffect(this.layer, this.id))} levels`},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        14: {
            title: "ok this will be fast",
            description: "Start with 2.6e29 bytes on reset and x2 kilobyte gain",
            cost: D(500),
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "25%",
                "border-bottom-right-radius": "0px",
            },
        },
        15: {
            title: "aaaaaaaaa",
            description: "x4 kilobyte gain",
            cost: D(2222),
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        21: {
            title: "why cant i think of",
            description: "12x kilobytes",
            cost: D(15000),
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        22: {
            title: "any upgrade names?",
            description: "unlock 🆎",
            cost: D(200000),
            style: {
                "height": "240px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "30px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "30px",
            },
        },
    },
    buyables: {
        11: {
            cost(x) {return D(1.12).pow(x || getBuyableAmount(this.layer, this.id))},
            display() {return "("+formatWhole(getBuyableAmount(this.layer, this.id))+"/10)<br><h3>Generic Buyable?</h3><br>x2 point gain<br>Cost: "+format(this.cost())+" kilobytes<br>Currently: "+format(buyableEffect(this.layer, this.id))+"x"},
            effect() {
                let eff = D(2).pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            canAfford() {return player.kb.points.gte(this.cost())},
            buy() {
                let base = new Decimal(1)
                let growth = 1.12
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(cost.min(Decimal.sumGeometricSeries(D(10).sub(getBuyableAmount(this.layer, this.id)), 1, 1.12, getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(D(10)))
            },
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "25%",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
            purchaseLimit: 10,
        },
        12: {
            cost(x) {return D(2.35).pow(x || getBuyableAmount(this.layer, this.id))},
            display() {return "("+formatWhole(getBuyableAmount(this.layer, this.id))+"/8)<br><h3>buyable == generic</h3><br>+50% kilobytes.<br>Cost: "+format(this.cost())+" kilobytes<br>Currently: "+format(buyableEffect(this.layer, this.id))+"x"},
            effect() {
                let eff = D(0.5).mul(getBuyableAmount(this.layer, this.id)).add(1)
                return eff
            },
            canAfford() {return player.kb.points.gte(this.cost())},
            buy() {
                let base = new Decimal(1)
                let growth = 2.35
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(cost.min(Decimal.sumGeometricSeries(D(10).sub(getBuyableAmount(this.layer, this.id)), 1, 2.35, getBuyableAmount(this.layer, this.id))))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(D(8)))
            },
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "25%",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
            unlocked() {return hasUpgrade('kb', 11)},
            purchaseLimit: 8,
        },
    },
    tabFormat: {
        Main: {
            content: [
                "main-display",
                ["row", ["prestige-button", ["clickable", 11]]],
                "resource-display",
                ["row", [["buyable", 11], ["buyable", 12]]],
                ["row", [["column", [["upgrade", 11], ["upgrade", 14]]], ["column", [["upgrade", 12], ["upgrade", 15]]], ["column", [["upgrade", 13], ["upgrade", 21]]], ["upgrade", 22]]],
            ],
        },
        "🆎": {
            embedLayer: "ab",
            unlocked() {return hasUpgrade('kb', 22)}
        },
    },
    branches: ['b'],
    clickables: {
        11: {
            title: "Hold to reset",
            display: "(Mobile QoL)",
            onClick() {if(canReset(this.layer)) doReset(this.layer)},
            onHold() {if(canReset(this.layer)) doReset(this.layer)},
            canClick() {return true},
            style: {
                'border-top-left-radius': '0px',
                'border-bottom-left-radius': "0px",
                "border-width": "4px"
            }
        },
    },
})