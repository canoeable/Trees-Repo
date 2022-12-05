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
    exponent: 0.4783485762389642375424957625, // Prestige currency exponent
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
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for bytes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "tratS",
            description: "Start generating points.",
            cost: D(1),
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
        },
        15: {
            title: "less generic upgrade",
            description: "Unlock 2 buyables",
            cost: D(32),
        },
        21: {
            title: "somewhat generic upgrade",
            description: "Unlock <b>unlocks</b>",
            cost: D(50),
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
        },
        24: {
            title: "less generic upgrade 2",
            description: "Unlocks another buyable",
            cost: D(1000000),
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
        },    },
    buyables: {
        11: {
            cost() {return D(1).mul(getBuyableAmount(this.layer, this.id).add(1))},
            display() {return "("+formatWhole(getBuyableAmount(this.layer, this.id).add(tmp['b'].buyables[11].bonus))+"/"+formatWhole(D(100).add(tmp['b'].buyables[11].bonus))+")<br><h3>Generic Buyable</h3><br>+10% points<br>Cost: "+format(this.cost())+" bytes<br>Currently: "+format(buyableEffect(this.layer, this.id))+"x"},
            effect() {return D(1).add(D(0.1).mul(getBuyableAmount(this.layer, this.id).add(tmp['b'].buyables[11].bonus))).mul(buyableEffect('b', 12))},
            canAfford() {return player.b.points.gte(this.cost())},
            buy() {if(!hasMilestone('unl', 1)){player[this.layer].points = player[this.layer].points.sub(this.cost())}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))},
            style: {
                "height": "120px",
                "width": "120px"
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
                "width": "120px"
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
                "width": "120px"
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
    clickables: {
        1: {
            title: "Buy all buyables",
            onClick() {
                buyBuyable('b', 11)
                buyBuyable('b', 12)
                buyBuyable('b', 13)
            },
            onHold() {
                buyBuyable('b', 11)
                buyBuyable('b', 12)
                buyBuyable('b', 13)
            },
            canClick() {return hasUpgrade('b', 15)},
        }
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        ["row", [["buyable", 11], ["buyable", 12], ["buyable", 13], ["clickable", 1]]],
        "upgrades",
    ],
    //autoUpgrade() {return hasMilestone('unl', 6)}
})

/*
colour bank: 
#537a3a
#bd225d
*/

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
        if(hasUpgrade('kb', 15)) mult = mult.mul(2)
        if(hasUpgrade('kb', 21)) mult = mult.mul(3)
        if(hasUpgrade('ab', 21)) mult = mult.mul(11)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "k", description: "K: Reset for kilobytes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Start II",
            description: "Start with 1024 bytes on reset.",
            cost: D(3),
        },
        12: {
            title: "useful upgradeTM",
            description: "You start with 3e25 bytes on reset.",
            cost: D(25),
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
        },
        14: {
            title: "ok this will be fast",
            description: "Start with 2.6e29 bytes on reset",
            cost: D(1000),
        },
        15: {
            title: "aaaaaaaaa",
            description: "2x kilobytes",
            cost: D(7500),
        },
        21: {
            title: "why cant i think of",
            description: "3x kilobytes",
            cost: D(17500),
        },
        22: {
            title: "any upgrade names?",
            description: "unlock 🆎",
            cost: D(50000),
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
                player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(D(10)))
            },
            style: {
                "height": "120px",
                "width": "120px"
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
                player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(D(8)))
            },
            style: {
                "height": "120px",
                "width": "120px"
            },
            unlocked() {return hasUpgrade('kb', 11)},
            purchaseLimit: 8,
        },
    },
    tabFormat: {
        Main: {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "buyables",
                "upgrades",
            ],
        },
        "🆎": {
            embedLayer: "ab",
            unlocked() {return hasUpgrade('kb', 22)}
        },
    },
})

addLayer("mb", {
    name: "megabytes", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#67944a",
    requires: new Decimal(777777), // Can be a function that takes requirement increases into account
    resource: "megabytes", // Name of prestige currency
    baseResource: "kilobytes", // Name of resource prestige is based on
    baseAmount() {return player.kb.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "M", description: "M: Reset for megabytes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone('unl', 7) || player.mb.unlocked},
    canBuyMax() {return true}
})

addLayer("ab", {
    name: "ab", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🆎", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff1414",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "🆎", // Name of prestige currency
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
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return false},
    tabFormat: [
        ["display-text", () => player.ab.points.lt('1e1000') ? `You have ${layerText("ab", format(player.ab.points))} 🆎` : `${layerText("ab", format(player.ab.points))} 🆎`],
        "blank",
        ["display-text", () => player.ab.points.lt('1e1000') ? `You are gaining ${layerText("ab", format(player.ab.gain))} 🆎 per second` : `${layerText("ab", format(player.ab.gain))} 🆎 per second`],
        "blank",
        "milestones",
        "buyables",
        "upgrades",
    ],
    update(diff) {
        player.ab.gain = calcABgain()
        if(hasUpgrade('kb', 22)) addPoints("ab", player.ab.gain.mul(diff))
    },
    buyables: {
        11: {
            title: "🆎 booster",
            display() {return `Cost: ${formatWhole(this.cost())} 🆎<br>Currently: ${formatWhole(buyableEffect(this.layer, this.id))}x 🆎<br> Bought ${formatWhole(getBuyableAmount(this.layer, this.id))}/250 times.<br>`+buyIn(this.cost(), player.ab.gain, player.ab.points)},
            cost() {return D(50).mul(D(2.5).pow(getBuyableAmount(this.layer, this.id)))},
            buy() {
                let base = new Decimal(50)
                let growth = 2.5
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(cost)
                addBuyables(this.layer, this.id, max.min(D(250).sub(getBuyableAmount(this.layer, this.id))))
            }, // 🆎
            effect() {                
                let base = D(2)
                if(hasUpgrade('ab', 13)) base = base.add(upgradeEffect('ab', 13))
                let amt = getBuyableAmount(this.layer, this.id)
                let eff = base.pow(amt)
                return eff
            },
            canAfford() {return player.ab.points.gte(this.cost())},
            purchaseLimit: 250,
        },
        12: {
            title: "🆎 booster (scaled)",
            display() {return `Cost: ${formatWhole(this.cost())} 🆎<br>Currently: ${formatWhole(buyableEffect(this.layer, this.id))}x 🆎<br> Bought ${formatWhole(getBuyableAmount(this.layer, this.id))}/250 times.<br>`+buyIn(this.cost(), player.ab.gain, player.ab.points)},
            cost() {return D(50).mul(D(5).pow(getBuyableAmount(this.layer, this.id)))},
            buy() {
                let base = new Decimal(50)
                let growth = 5
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(cost)
                addBuyables(this.layer, this.id, max.min(D(250).sub(getBuyableAmount(this.layer, this.id))))
            }, // 🆎
            effect() {
                let base = D(2)
                if(hasUpgrade('ab', 13)) base = base.add(upgradeEffect('ab', 13))
                let amt = getBuyableAmount(this.layer, this.id)
                let eff = base.pow(amt)
                return eff
            },
            canAfford() {return player.ab.points.gte(this.cost())},
            purchaseLimit: 250,
        },
        13: {
            title: "🆎 booster (superscaled)",
            display() {return `Cost: ${formatWhole(this.cost())} 🆎<br>Currently: ${formatWhole(buyableEffect(this.layer, this.id))}x 🆎<br> Bought ${formatWhole(getBuyableAmount(this.layer, this.id))}/250 times.<br>`+buyIn(this.cost(), player.ab.gain, player.ab.points)},
            cost() {return D(5000).div(upgradeEffect("ab", 11)).mul(D(20).pow(getBuyableAmount(this.layer, this.id)))},
            buy() {
                let base = new Decimal(5000).div(upgradeEffect('ab', 11))
                let growth = 20
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(cost)
                addBuyables(this.layer, this.id, max.min(D(250).sub(getBuyableAmount(this.layer, this.id))))
            }, // 🆎
            effect() {                
                let base = D(2)
                if(hasUpgrade('ab', 13)) base = base.add(upgradeEffect('ab', 13))
                let amt = getBuyableAmount(this.layer, this.id)
                let eff = base.pow(amt)
                return eff
            },
            canAfford() {return player.ab.points.gte(this.cost())},
            purchaseLimit: 250,
        },
        21: {
            title: "🆎 booster 2",
            display() {return `Cost: ${formatWhole(this.cost())} 🆎<br>Currently: ^${format(buyableEffect(this.layer, this.id))} 🆎<br> Bought ${formatWhole(getBuyableAmount(this.layer, this.id))}/100 times.<br>`+buyIn(this.cost(), player.ab.gain, player.ab.points)},
            cost() {return D(1e302).mul(D(500).pow(getBuyableAmount(this.layer, this.id)))},
            buy() {
                let base = new Decimal(1e302)
                let growth = 500
                let max = Decimal.affordGeometricSeries(player[this.layer].points, base, growth, getBuyableAmount(this.layer, this.id))
                let cost = Decimal.sumGeometricSeries(max, base, growth, getBuyableAmount(this.layer, this.id))
                player[this.layer].points = player[this.layer].points.sub(cost)
                addBuyables(this.layer, this.id, max.min(D(100).sub(getBuyableAmount(this.layer, this.id))))
            }, // 🆎
            effect() {                
                let base = D(0.01)
                let amt = getBuyableAmount(this.layer, this.id)
                let eff = base.mul(amt)
                eff = eff.add(1)
                return eff
            },
            canAfford() {return player.ab.points.gte(this.cost())},
            purchaseLimit: 100,
        },
    },
    upgrades: {
        11: {
            title: "sorry for 🆎 inflation",
            description: "/1e100 superscaled 🆎 booster cost",
            cost: D(1e197),
            effect() {return hasUpgrade(this.layer, this.id) ? D(1e100) : D(1)}
        },
        12: {
            title: "🆎🆎🆎🆎🆎🆎",
            description: "Get a brisk 3x 🆎",
            cost: D(1e227),
            effect() {return hasUpgrade(this.layer, this.id) ? D(3) : D(1)}
        },
        13: {
            title: "long 🆎 wait",
            description: "🆎 boosts all 3 🆎 boosters base",
            cost: D(1e228),
            effect() {return player.ab.points.add(1).slog().sub(2).max(0).min(0.666)},
            effectDisplay() {return `+${format(upgradeEffect(this.layer, this.id))}`}
        },
        14: {
            title: "🆎 boosts 🆎",
            description: "🆎 boosts itself",
            cost: D(2e286),
            effect() {return player.ab.points.add(1).pow(0.05).min(1e1000)},
            effectDisplay() {return `${format(upgradeEffect(this.layer, this.id))}x`}
        },
        15: {
            title: "🆎 is pretty cool",
            description: "🆎 boosts itself but 🆎etter",
            cost: D('3e651'),
            effect() {return player.ab.points.add(1).pow(0.25).min(1e400)},
            effectDisplay() {return `${format(upgradeEffect(this.layer, this.id))}x`}
        },
        21: {
            title: "🆎 endgame (for now...)",
            description: "Use 🆎's power to multiply kilobytes by 11 (check unlocks after this)",
            cost: D('e911'),
        },
    }
})

// 🆎🆎🆎🆎🆎🆎🆎🆎🆎🆎

addLayer("unl", {
    name: "unlocks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color()  {return numHex(calcNumToHex(8, player.unl.milestones.length))},
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
            requirementDescription: "50 bytes",
            effectDescription: "B buyables are free",
            done() {return player.b.points.gte(50) && hasUpgrade('b', 21)}
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
            requirementDescription: "3 kilobytes",
            effectDescription: "Generate 100% of bytes gain on reset per second.",
            done() {return player.kb.points.gte(3)},
            unlocked() {return hasMilestone('unl', 4)},
        },
        6: {
            requirementDescription: "5 <b>Generic Buyable?</b> levels",
            effectDescription: "Keep B upgrades.",
            done() {return getBuyableAmount('kb', 11).gte(5)},
            unlocked() {return hasMilestone('unl', 5)},
        },
        7: {
            requirementDescription: "200,000 kilobytes",
            effectDescription: "Unlock a new layer",
            done() {return player.kb.points.gte(200000) && hasUpgrade('ab', 21)},
            unlocked() {return hasMilestone('unl', 6) && hasUpgrade('ab', 21)},
        },
    }
})

// base layer
/*addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 69, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})*/

//addLayer("p", {name: "prestige", symbol: "P", position: 0, startData() { return {unlocked: true, points: new Decimal(0),}}, color: "#4BDC13", requires: new Decimal(10), resource: "prestige points", baseResource: "points", baseAmount() {return player.points}, type: "normal", exponent: 0.5, gainMult() {mult = new Decimal(1); return mult}, gainExp() {return new Decimal(1)}, row: 0, hotkeys: [{key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},], layerShown(){return true}})
//base layer, 1 line