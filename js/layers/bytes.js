addLayer("b", {
    name: "bytes", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#278782",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "bytes", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.478, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('b', 14)) mult = mult.mul(upgradeEffect('b', 14))
        if(hasUpgrade('b', 22)) mult = mult.mul(upgradeEffect('b', 22))
        if(hasUpgrade('b', 23)) mult = mult.mul(upgradeEffect('b', 23))
        mult = mult.mul(buyableEffect('b', 13))
        if(hasMilestone('unl', 4)) mult = mult.mul(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    componentStyles: {
        "prestige-button"() { return {'border-radius': "30px", 'border-top-right-radius': '0px', 'border-bottom-right-radius': "0px"} },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for bytes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown: true,
    upgrades: {
        11: {
            title: "tratS",
            description: "Start generating points.",
            cost: D(1),
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
            title: "generic upgrade",
            description: "Points are boosted based on points",
            cost: D(2),
            effect() {
                let eff = player.points.add(1).pow(0.111111111111).add(1)
                if(hasUpgrade('b', 13)) eff = eff.mul(upgradeEffect('b', 13))
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
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
            title: "generic upgrade booster",
            description: "The previous upgrade is boosted based on bytes.",
            cost: D(3),
            effect() {
                let eff = player.b.points.add(1).pow(0.4).add(1)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
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
            title: "generic upgrade two",
            description: "Gain more bytes based on points.",
            cost: D(16),
            effect() {
                let eff = player.points.add(1).log10().cbrt().add(1)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        15: {
            title: "less generic upgrade",
            description: "Unlock 2 buyables",
            cost: D(32),
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "25%",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        21: {
            title: "somewhat generic upgrade",
            description: "Unlock <b>unlocks</b>",
            cost: D(50),
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "25%",
                "border-bottom-right-radius": "0px",
            },
        },
        22: {
            title: "g e n e r i c  u p g r a d e",
            description: "<b>Generic Buyable</b> also boosts bytes, at a reduced rate.",
            cost: D(2500),
            effect() {
                let eff = buyableEffect('b', 11).pow(0.8)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        23: {
            title: "this upgrade is very generic",
            description: "Bytes Upgrades boost bytes",
            cost: D(100000),
            effect() {
                let eff = D(player.b.upgrades.length).add(1)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        24: {
            title: "less generic upgrade 2",
            description: "Unlocks another buyable",
            cost: D(1000000),
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        25: {
            title: "tmp.b.upgrades [25] = generic",
            description: "/10,000 buyable cost",
            cost: D(2e9),
            effect() {
                let eff = D(10000)
                if(!hasUpgrade(this.layer, this.id)) eff = D(1)
                if(hasUpgrade('b', 31)) eff = eff.pow(upgradeEffect('b', 31))
                if(hasMilestone('unl', 3)) eff = eff.pow(2)
                return eff
            },
            effectDisplay() {return "/"+format(upgradeEffect(this.layer, this.id))},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "25%",
            },
        },
        31: {
            title: "these titles arent generic",
            description: "^2 previous upgrade",
            cost: D(3.33e12),
            effect() {
                let eff = D(2)
                if(hasUpgrade('b', 33)) eff = eff.pow(upgradeEffect('b', 33))
                return eff
            },
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "25%",
                "border-bottom-right-radius": "0px",
            },
        },
        32: {
            title: "generic this, generic that",
            description: "2287.493x points",
            cost: D(1.5e15),
            effect() {
                let eff = D(2287.493)
                return eff
            },
            effectDisplay() {return `${format(upgradeEffect(this.layer, this.id))}x`},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        33: {
            title: "this.upgrade == generic",
            description: "^1.7 upgrade 31",
            cost: D(2.5e25),
            effect() {
                let eff = D(1.7)
                return eff
            },
            effectDisplay() {return `^${format(upgradeEffect(this.layer, this.id))}`},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "25%",
            },
        },
    },
    buyables: {
        11: {
            cost() {return D(1).mul(getBuyableAmount(this.layer, this.id).add(1))},
            display() {return "("+formatWhole(getBuyableAmount(this.layer, this.id).add(tmp['b'].buyables[11].bonus))+"/"+formatWhole(D(100).add(tmp['b'].buyables[11].bonus))+")<br><h3>Generic Buyable</h3><br>+10% points<br>Cost: "+format(this.cost())+" bytes<br>Currently: "+format(buyableEffect(this.layer, this.id))+"x"},
            effect() {return D(1).add(D(0.1).mul(getBuyableAmount(this.layer, this.id).add(tmp['b'].buyables[11].bonus))).mul(buyableEffect('b', 12))},
            canAfford() {return player.b.points.gte(this.cost())},
            buy() {if(!hasMilestone('unl', 1)){player[this.layer].points = player[this.layer].points.sub(this.cost())}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "25%",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
            unlocked() {return hasUpgrade('b', 15)},
            purchaseLimit: 100,
            bonus() {
                let bonus = D(0)
                if(hasUpgrade('kb', 13)) bonus = bonus.add(upgradeEffect('kb', 13))
                return bonus
            },
        },
        12: {
            cost(x) {return D(1.12).pow(x || getBuyableAmount(this.layer, this.id)).div(upgradeEffect('b', 25))},
            display() {return "("+formatWhole(getBuyableAmount(this.layer, this.id))+"/1,000)<br><h3>Generic Buyable 2</h3><br>x1.01 to previous buyable<br>Cost: "+format(this.cost())+" bytes<br>Currently: "+format(buyableEffect(this.layer, this.id))+"x"},
            effect() {
                let eff = D(1.01).pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            canAfford() {return player.b.points.gte(this.cost())},
            buy() {
                let base = new Decimal(1).div(upgradeEffect('b', 25))
                let growth = 1.12
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasMilestone('unl', 1)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(1000))
            },
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
            unlocked() {return hasUpgrade('b', 15)},
            purchaseLimit: 1000,
        },
        13: {
            cost(x) {return D(1.12001).pow(x || getBuyableAmount(this.layer, this.id)).div(upgradeEffect('b', 25))},
            display() {return "("+formatWhole(getBuyableAmount(this.layer, this.id))+"/1,000)<br><h3>Generic Buyable 3</h3><br>x1.025 bytes<br>Cost: "+format(this.cost())+" bytes<br>Currently: "+format(buyableEffect(this.layer, this.id))+"x"},
            effect() {
                let eff = D(1.025).pow(getBuyableAmount(this.layer, this.id))
                return eff
            },
            canAfford() {return player.b.points.gte(this.cost())},
            buy() {
                let base = new Decimal(1).div(upgradeEffect('b', 25))
                let growth = 1.12001
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                if (!hasMilestone('unl', 1)) player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(1000))
            },
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "25%",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
            unlocked() {return hasUpgrade('b', 24)},
            purchaseLimit: 1000,
        },
    },
    automate() {
        if(hasMilestone('unl', 2)) {
            buyBuyable('b', 11);  buyBuyable('b', 11);  buyBuyable('b', 11);  buyBuyable('b', 11);  buyBuyable('b', 11);  buyBuyable('b', 11);  buyBuyable('b', 11);  buyBuyable('b', 11);  buyBuyable('b', 11);  buyBuyable('b', 11)
            buyBuyable('b', 12)
            buyBuyable('b', 13)
        }
        //if(getBuyableAmount('b', 12).gte(1000)) setBuyableAmount('b', 12, D(1000))
        //if(getBuyableAmount('b', 13).gte(1000)) setBuyableAmount('b', 13, D(1000))
        if(hasMilestone('unl', 2) && player.b.points.gte(101)) setBuyableAmount('b', 11, D(100))
    },
    passiveGeneration() {
        if(hasMilestone('unl', 5)) return 1
    },
    doReset(resettingLayer) {
        if(layers[resettingLayer].row <= layers[this.layer].row) return
        let keep = [];
        let keepcurrency = D(0)
        if(hasUpgrade('kb', 11)) keepcurrency = D(1024)
        if(hasUpgrade('kb', 12)) keepcurrency = D(3e25)
        if(hasUpgrade('kb', 14)) keepcurrency = D(2.6e29)
        layerDataReset(this.layer, keep)
        if(keepcurrency.gte(1)) addPoints('b', keepcurrency)
        if(hasMilestone('unl', 6)) player.b.upgrades = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33]
    },
    tabFormat: [
        "main-display",
        ["row", ["prestige-button", ["clickable", 11]]],
        "resource-display",
        ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13]]],
        "upgrades",
    ],
    //autoUpgrade() {return hasMilestone('unl', 6)}
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