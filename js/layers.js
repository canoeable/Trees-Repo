addLayer("f", {
    /*
    * Other than required things,
    * include the following in every layer
    */
    componentStyles: {
        'prestige-button'() {return {'border-radius': '12px'}}
    },
    // END
    
    // Layer data and subcurrency calculations
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        cooldown: 0,
    }},

    // Name and other displays
    name: "fish",
    symbol: "🐟",
    resource: "fish",
    position: 0,
    color: "#1b4af5",
    row: 0,
    layerShown(){return true},

    // Prestige formula (base is (points/10)^0.5)
    type: "none",

    // Bonuses

    // QoL things

    // Upgrades, buyables, etc.
    clickables: {
        11: {
            title: "Go Fishing",
            display() {return `You will gain ${formatWhole(layers.f.fishGain())} fish<br>Cooldown: ${format(player.f.cooldown)}s`},
            onClick() {
                player.f.cooldown = layers.f.cooldown()
                player.f.points = player.f.points.add(layers.f.fishGain())
            },
            canClick() {
                return player.f.cooldown == 0
            },
        },
        12: {
            title: "Hold to fish",
            display() {return `Mobile QoL (100% not stolen from Y🆎oi)`},
            onClick() {
                if(layers.f.clickables[11].canClick()) {
                    layers.f.clickables[11].onClick()
                }
            },
            onHold() {
                layers.f.clickables[12].onClick()
            },
            canClick() {return true},
        },
        13: {
            title: "Respec buyables",
            display() {return `Reset buyable levels.`},
            onClick() {
                if(confirm(`This will set all buyable levels to 0. It will NOT refund your fish.`)) {
                    player.f.buyables[11] = d(0);
                    player.f.buyables[12] = d(0);
                    player.f.buyables[13] = d(0);
                }
            },
            canClick() {return true}
        },
    },
    buyables: {
        11: {
            display() {return `(${formatWhole(getBuyableAmount(this.layer, this.id))}/12)
            <h3>Faster Fishing</h3>
            Decrease fishing cooldown by 50%
            Cost: ${format(this.cost())} fish
            Fishing cooldown is ${format(this.effect().mul(100))}% faster`},
            cost() {
                return d(1.7).pow(layers.f.totalBuyables().add(1)).floor()
            },
            effect() {return d(1.5).pow(getBuyableAmount(this.layer, this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                addBuyables(this.layer, this.id, d(1))
            },
            canAfford() {return player.f.points.gte(this.cost())},
            purchaseLimit: 12,
        },
        12: {
            display() {return `(${formatWhole(getBuyableAmount(this.layer, this.id))})
            <h3>More Fish</h3>
            Gain +1 and x1.2 more fish every time you go fishing
            Cost: ${format(this.cost())} fish
            You get +${format(this.effect().mul(1))} fish on going fishing`},
            cost() {
                return d(1.7).pow(layers.f.totalBuyables().add(1)).floor()
            },
            effect() {return getBuyableAmount(this.layer, this.id).add(1).mul(d(1.2).pow(getBuyableAmount(this.layer, this.id)))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                addBuyables(this.layer, this.id, d(1))
            },
            canAfford() {return player.f.points.gte(this.cost())},
        },
        13: {
            display() {return `(${formatWhole(getBuyableAmount(this.layer, this.id))})
            <h3>Slower Scaling</h3>
            Buyable amount in the cost formula is reduced by 1.6 (does not apply to this buyable)
            Cost: ${format(this.cost())} fish
            Effective total buyable count is reduced by ${format(this.effect().mul(1))}`},
            cost() {
                return d(1.7).pow(layers.f.totalBuyables().add(this.effect()).add(1)).floor()
            },
            effect() {return d(1.6).mul(getBuyableAmount(this.layer, this.id))},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                addBuyables(this.layer, this.id, d(1))
            },
            canAfford() {return player.f.points.gte(this.cost())},
        },
    },

    // Other 
    update(diff) {
        if(player.f.cooldown > 0) player.f.cooldown = Math.max(player.f.cooldown - diff, 0)
    },
    cooldown() {
        let cd = 5
        cd = cd / (buyableEffect('f', 11).toNumber())
        return cd
    },
    fishGain() {
        let gain = d(0)
        gain = gain.add(buyableEffect('f',  12))
        return gain
    },
    tabFormat: [
        "main-display",
        ["row", [["clickable", 11], ["clickable", 12]]],
        "blank",
        ["display-text", "Buyable costs are based on the sum of all three buyables"],
        ["clickable", 13],
        "blank",
        "buyables"
    ],
    totalBuyables() {
        let x = getBuyableAmount(this.layer, 11).add(getBuyableAmount(this.layer, 12).add(getBuyableAmount(this.layer, 13)))
        x = x.sub(buyableEffect('f', 13))
        return x
    },
    hotkeys: [
        {
            key: "f",
            description: "F: Go fishing",
            onPress() {layers.f.clickables[12].onClick()}
        }
    ]
})
