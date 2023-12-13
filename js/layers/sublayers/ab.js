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
    layerShown(){return false},
    tabFormat: [
        ["display-text", () => player.ab.points.lt('1e1000') ? `You have ${layerText("ab", format(player.ab.points))} 🆎` : `${layerText("ab", format(player.ab.points))} 🆎`],
        "blank",
        ["display-text", () => player.ab.points.lt('1e1000') ? `You are gaining ${layerText("ab", format(player.ab.gain))} 🆎 per second` : `${layerText("ab", format(player.ab.gain))} 🆎 per second`],
        "blank",
        "milestones",
        ["row", [["buyable", 11],["buyable", 12],["buyable", 13],["buyable", 14],]],
        "upgrades",
    ],
    update(diff) {
        player.ab.gain = calcABgain()
        if(hasUpgrade('kb', 22)) addPoints("ab", player.ab.gain.mul(diff))
    },
    buyables: {
        11: {
            title: "🆎 booster",
            display() {return `Cost: ${formatWhole(this.cost())} 🆎<br>Effect: ${formatWhole(buyableEffect(this.layer, this.id))}x 🆎<br> Bought ${formatWhole(getBuyableAmount(this.layer, this.id))}/250 times.<br>`+buyIn(this.cost(), player.ab.gain, player.ab.points, getBuyableAmount(this.layer, this.id).gte(250))},
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
            title: "🆎 booster (scaled)",
            display() {return `Cost: ${formatWhole(this.cost())} 🆎<br>Effect: ${formatWhole(buyableEffect(this.layer, this.id))}x 🆎<br> Bought ${formatWhole(getBuyableAmount(this.layer, this.id))}/250 times.<br>`+buyIn(this.cost(), player.ab.gain, player.ab.points, getBuyableAmount(this.layer, this.id).gte(250))},
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
            title: "🆎 booster (scaled^2)",
            display() {return `Cost: ${formatWhole(this.cost())} 🆎<br>Effect: ${formatWhole(buyableEffect(this.layer, this.id))}x 🆎<br> Bought ${formatWhole(getBuyableAmount(this.layer, this.id))}/250 times.<br>`+buyIn(this.cost(), player.ab.gain, player.ab.points, getBuyableAmount(this.layer, this.id).gte(250))},
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
            title: "🆎 booster 2",
            display() {return `Cost: ${formatWhole(this.cost())} 🆎<br>Effect: ^${format(buyableEffect(this.layer, this.id))} 🆎<br> Bought ${formatWhole(getBuyableAmount(this.layer, this.id))}/100 times.<br>`+buyIn(this.cost(), player.ab.gain, player.ab.points, getBuyableAmount(this.layer, this.id).gte(100))},
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
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "25%",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
    },
    upgrades: {
        11: {
            title: "sorry for 🆎 inflation",
            description: "/1e100 scaled^2 🆎 booster cost",
            cost: D(1e197),
            effect() {return hasUpgrade(this.layer, this.id) ? D(1e100) : D(1)},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "0px",
            },
        },
        12: {
            title: "🆎🆎🆎🆎🆎🆎",
            description: "Get a brisk 3x 🆎",
            cost: D(1e227),
            effect() {return hasUpgrade(this.layer, this.id) ? D(3) : D(1)},
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
            title: "long 🆎 wait",
            description: "🆎 boosts all 3 🆎 boosters base",
            cost: D(1e228),
            effect() {return player.ab.points.add(1).slog().sub(2).max(0).min(0.666)},
            effectDisplay() {return `+${format(upgradeEffect(this.layer, this.id))}`},
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
            title: "🆎 boosts 🆎",
            description: "🆎 boosts itself",
            cost: D(2e286),
            effect() {return player.ab.points.add(1).pow(0.05).min('1e1000')},
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
        21: {
            title: "🆎 is pretty cool",
            description: "🆎 boosts itself but 🆎etter",
            cost: D('3e651'),
            effect() {return player.ab.points.add(1).pow(0.25).min('1e400')},
            effectDisplay() {return `${format(upgradeEffect(this.layer, this.id))}x`},
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
            title: "🆎 endgame (for now...)",
            description: "Use 🆎's power to multiply kilobytes by 11 (check unlocks after this)",
            cost: D('e911'),
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
            title: "More 🆎",
            description: "🆎 boosts itself 🆎gain.",
            cost: D('e912'),
            unlocked() {return hasMilestone('unl', 9)},
            effect() {return player.ab.points.add(1).slog().min(3)},
            effectDisplay() {return `^${format(upgradeEffect(this.layer, this.id))}`},
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
            title: "no more 🆎",
            description: "Unlock nothing",
            cost: Decimal.pow(10, 3461),
            unlocked() {return hasMilestone('unl', 9)},
            style: {
                "height": "120px",
                "width": "120px",
                "border-top-left-radius": "0px",
                "border-top-right-radius": "0px",
                "border-bottom-left-radius": "0px",
                "border-bottom-right-radius": "25%",
            },
        }
    }
})
// 🆎🆎🆎🆎🆎🆎🆎🆎🆎🆎