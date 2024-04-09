/*
* idea list:
* v-ignition at 44 upgrades
* something similar to forge of antiphon??
* idk how i'd even make that in a tmt game 
*
*/


// clover

addLayer("c", {
    /*
    * Other than required things,
    * include the following in every layer
    */
    componentStyles: {
        'prestige-button'() {return {'border-radius': '12px'}}
    },
    onPrestige() {
        player.cpoints = d(0)
        player.dpoints = d(0)
        player.hpoints = d(0)
        player.spoints = d(0)
    },
    // END
    
    // DO NOT DELETE!!
    update(diff){
        handlePointGain(diff)
    },
    // thanks

    // Layer data and subcurrency calculations
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},

    // Name and other displays
    name: "clover points",
    symbol: "c",
    resource: "clover points",
    position: 0,
    color: "#00ff0d",
    row: 0,
    layerShown(){return true},

    // Prestige formula (base is (points/10)^0.5)
    baseResource: "clover frags",
    baseAmount() {return player.cpoints},
    type: "normal",
    exponent() {
        exp = 1/3
        if(hasUpgrade('c', 14)) exp = exp + 1/12
        if(hasUpgrade('d', 14)) exp = exp + 1/12
        return exp
    }, // <1 if normal type, >1 if static
    requires: new Decimal(10),
    shouldRoundDown: true, // Only works on 'normal' layers

    // Bonuses
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade('c', 12)) mult = mult.mul(d(2).pow(0.5))
        if(hasUpgrade('d', 12)) mult = mult.mul(d(2).pow(0.5))
        if(hasUpgrade(this.layer, 16)) mult = mult.mul(upgradeEffect(this.layer, 16))
        if(hasUpgrade(this.layer, 21)) mult = mult.mul(upgradeEffect(this.layer, 21))
        if(hasUpgrade(this.layer, 22)) mult = mult.div(3)

        if(hasUpgrade('i', 13)) mult = mult.mul(upgradeEffect('i', 13))
        if(hasUpgrade(this.layer, 27)) mult = mult.mul(upgradeEffect(this.layer, 27))
        if(hasUpgrade(this.layer, 24)) mult = mult.mul(10)
        if(hasUpgrade('i', 12)) mult = mult.mul(2.22)
        if(hasUpgrade('c', 33)) mult = mult.mul(upgradeEffect('c', 33))
        if(hasUpgrade(this.layer, 32)) mult = mult.mul(4.321)
        if(hasUpgrade(this.layer, 35)) mult = mult.div(6)
        if(hasUpgrade(this.layer,36))mult=mult.mul(4)

        if(hasMilestone('i', 3)) mult = mult.mul(clickableEffect('i', 12)[1])
        
        if(hasUpgrade('c', 13)) mult = mult.mul(upgradeEffect('c', 13)[0])
        if(hasUpgrade('d', 13)) mult = mult.mul(upgradeEffect('d', 13)[1])
        return mult.max(1)
    },
    gainExp() {
        exp = d(1)
        return exp
    },

    // QoL things
    hotkeys: [
        {key: "p", description: "p: pause/unpause", onPress(){if(player.devSpeed == undefined) player.devSpeed = 1; player.devSpeed = player.devSpeed * -1}},
        {key: "c", description: "c: reset for clover points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    // Upgrades, buyables, etc.
    upgrades: {
        rows: 1,
        11: {
            title: "c1",
            description: "x3 clover frag gain",
            cost: d(1)
        },
        12: {
            title: "c2",
            description: "x1.414 clover and dia point gain",
            cost: d(4),
        },
        13: {
            title: "c3",
            description: "clover and dia point multis are increased based on the others",
            cost: d(7),
            effect() {
                return [layers.d.gainMult().pow(0.2).min(6), layers.c.gainMult().pow(0.2).min(6)]
            },
            tooltip() {
                return `x<sup>0.2</sup><br>x${format(upgradeEffect('c', 13)[0])} clover points, x${format(upgradeEffect('c', 13)[1])} dia points. caps at x6`
            }
        },
        14: {
            title: "c4",
            description: "boost clover and dia point formula",
            cost: d(11),
            tooltip: "(points/10)^(1/3) -> (points/10)^(1/3 + x), where x = (number of c4 and d4 owned)/12"
        },
        15: {
            title: "c5",
            description: "multiply all frag gain by 1.04 per owned clover upgrade",
            cost: d(5),
            effect() {
                let x = player.c.upgrades.length
                if(hasUpgrade('d', 15)) x = x + player.d.upgrades.length
                if(hasUpgrade('h', 15)) x = x + player.h.upgrades.length
                if(hasUpgrade('s', 15)) x = x + player.s.upgrades.length
                return d(1.04).pow(x).min(1000)
            },
            tooltip() {return `caps at x1000<br>currently x${format(upgradeEffect(this.layer, this.id))}`}
        },
        16: {
            title: "c6",
            description: "slightly boost clover points",
            cost: d(24),
            effect() {
                return d(1.7)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`}
        },
        17: {
            title: "c7",
            description: "multiply clover frag gain by 4.4",
            cost: d(88),
        },
        18: {
            title: "c8",
            description: "clover frags boost itself",
            cost: d(286),
            effect() {
                return player.cpoints.add(0.1).pow(0.15).add(1)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `x<sup>0.15</sup>`,
        },
        21: {
            title: "c9",
            description: "sqrt(c5 effect) applies to clover point gain",
            cost: d(718),
            effect() {return upgradeEffect('c', 15).pow(0.5)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `it literally tells you the formula in the upgrade description`,
        },
        22: {
            title: "c10",
            description: "divide clover point gain by 3, but multiply clover frag gain by 16",
            cost: d(1673),
        },
        23: {
            title: "c11",
            description: "boost clover frags based on spade + heart points",
            cost: d(4444),
            effect() {return player.s.points.add(player.h.points).add(1).log(9).add(1)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "Made by Nif!<br>log9(spade points + heart points + 1) + 1",
        },
        24: {
            title: "c12",
            description: "multiply clover point gain by 10",
            cost: d(18750),
            unlocked() {return hasMilestone('i', 1)},
        },
        25: {
            title: "c13",
            description: "multiply clover frag gain by 4.44",
            unlocked() {return hasMilestone('i', 1)},
            cost: d(1e6),
        },
        26: {
            title: "c14",
            description: "ignition points requirement /2.2",
            unlocked() {return hasMilestone('i', 1)},
            cost: d(2.5e6),
        },
        27: {
            title: "c15",
            description: "best ignition points boost clover point gain",
            cost: d(2.2e7),
            unlocked() {return hasMilestone('i', 1)},
            effect() {return player.i.total.add(1).log(3.3).add(1.2)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `log<sub>3.3</sub>(x+1) + 1.2`
        },
        28: {
            title: "c16",
            description: "increase all base frag gain by 0.333",
            unlocked() {return hasMilestone('i', 1)},
            cost: d(4.44e8),
        },
        31: {
            title: "c17",
            description: "clover frag gain is multiplied",
            cost: d(3e9),
            effect() {
                let x = layerEffect('c').add(layerEffect('d').add(layerEffect('h').add(layerEffect('s'))))
                x = x.sub(layerEffect(this.layer))
                x = x.sqrt()
                return x
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "sqrt(sum of d, h and s effects)",
            unlocked() {return hasMilestone('i', 1)},
        },
        32: {
            title: "c18",
            description: "multiply clover point gain by 4.321",
            cost: d(1.234e10),
            unlocked() {return hasMilestone('i', 1)},
        },
        33: {
            title: "c19",
            description: "multiply all row 0 layers point gain",
            unlocked() {return hasMilestone('i', 1)},
            cost: d(4.444e10),
            effect() {
                let x = d(player.i.milestones.length).add(1)
                let exp = 0.3
                if(hasUpgrade('d', 33)) exp = exp + 0.3
                if(hasUpgrade('s', 33)) exp = exp + 0.3
                if(hasUpgrade('h', 33)) exp = exp + 0.3
                x = x.pow(exp)
                if(player.i.total.eq(3)) x = x.mul(3)
                return x
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "(ignition milestones + 1)^(0.3*(# of c19, d19, h19 and s19 owned)), x3 if on ignition 3",
        },
        34: {
            title: "c20",
            description: "raise clover frag gain to ^1.09",
            cost: d(6.666e11),
            unlocked() {return hasMilestone('i', 1)},
        },
        35: {
            title: "c21",
            description: "multiply clover frag gain by 121, but /6 clover point gain",
            cost: d(3e12),
            unlocked() {return hasMilestone('i', 1)},
        },
        36: {
            title: "c22",
            description: "x4 clover point gain",
            cost: d(1e13),
            unlocked() {return hasMilestone('i', 1)},
        },
    },
    effect() {
        if(!hasUpgrade('i', 11)) return d(1)
        return player[this.layer].points.add(1).log10().add(1)
    },
    effectDescription() {
        if(hasUpgrade('i', 11)) return `boosting clover frags by ${layerText(format(layerEffect(this.layer)), this.layer)}`
    },
    autoUpgrade() {
        return tmp[this.layer].maxUpgBuy > 0
    },
    maxUpgBuy() {
        x = 0
        if(hasMilestone('i', 2)) x = 18
        if(hasMilestone('i', 3)) x = 28
        if(hasMilestone('i', 4)) x = 36
        return x
    },
    clickables: {
        11: {
            title: "Buy all upgrades",
            canClick() {return true},
            onClick() {
                autobuyUpgrades('c', true)
            },
            unlocked() {return hasMilestone('i', 1)},
        },
    },
})

// dia
addLayer("d", {
    /*
    * Other than required things,
    * include the following in every layer
    */
    componentStyles: {
        'prestige-button'() {return {'border-radius': '12px'}}
    },
    onPrestige() {
        player.cpoints = d(0)
        player.dpoints = d(0)
        player.hpoints = d(0)
        player.spoints = d(0)
    },
    // END
    
    // Layer data and subcurrency calculations
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},

    // Name and other displays
    name: "dia points",
    symbol: "d",
    resource: "dia points",
    position: 1,
    color: "#0014ad",
    row: 0,
    layerShown(){return true},

    // Prestige formula (base is (points/10)^0.5)
    baseResource: "dia frags",
    baseAmount() {return player.dpoints},
    type: "normal",
    exponent() {
        exp = 1/3
        if(hasUpgrade('c', 14)) exp = exp + 1/12
        if(hasUpgrade('d', 14)) exp = exp + 1/12
        return exp
    }, // <1 if normal type, >1 if static
    requires: new Decimal(10),
    shouldRoundDown: true, // Only works on 'normal' layers

    // Bonuses
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade('d', 12)) mult = mult.mul(d(2).pow(0.5))
        if(hasUpgrade('c', 12)) mult = mult.mul(d(2).pow(0.5))
        if(hasUpgrade(this.layer, 16)) mult = mult.mul(upgradeEffect(this.layer, 16))
        if(hasUpgrade(this.layer, 21)) mult = mult.mul(upgradeEffect(this.layer, 21))
        if(hasUpgrade(this.layer, 22)) mult = mult.div(3)

        if(hasUpgrade('i', 13)) mult = mult.mul(upgradeEffect('i', 13))
        if(hasUpgrade(this.layer, 24)) mult = mult.mul(10)
        if(hasUpgrade(this.layer, 27)) mult = mult.mul(upgradeEffect(this.layer, 27))
        if(hasUpgrade(this.layer, 32)) mult = mult.mul(4.321)
        if(hasUpgrade('c', 33)) mult = mult.mul(upgradeEffect('c', 33))
        if(hasUpgrade(this.layer, 35)) mult = mult.div(6)
        if(hasUpgrade('i', 12)) mult = mult.mul(2.22)
        if(hasUpgrade(this.layer,36))mult=mult.mul(4)

        if(hasMilestone('i', 3)) mult = mult.mul(clickableEffect('i', 12)[1])
        
        if(hasUpgrade('c', 13)) mult = mult.mul(upgradeEffect('c', 13)[1])
        if(hasUpgrade('d', 13)) mult = mult.mul(upgradeEffect('d', 13)[0])
        return mult.max(1)
    },
    gainExp() {
        exp = d(1)
        return exp
    },

    // QoL things
    hotkeys: [
        {key: "d", description: "d: reset for dia points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    // Upgrades, buyables, etc.
    upgrades: {
        rows: 1,
        11: {
            title: "d1",
            description: "x3 dia frag gain",
            cost: d(1)
        },
        12: {
            title: "d2",
            description: "x1.414 dia and clover point gain",
            cost: d(4),
        },
        13: {
            title: "d3",
            description: "dia and clover point multis are increased based on the others",
            cost: d(7),
            effect() {
                return [layers.c.gainMult().pow(0.2).min(6), layers.d.gainMult().pow(0.2).min(6)]
            },
            tooltip() {
                return `x<sup>0.2</sup><br>x${format(upgradeEffect('d', 13)[0])} dia points, x${format(upgradeEffect('d', 13)[1])} clover points. caps at x6`
            }
        },
        14: {
            title: "d4",
            description: "boost dia and clover point formula",
            cost: d(11),
            tooltip: "(points/10)^(1/3) -> (points/10)^(1/3 + x), where x = (number of c4 and d4 owned)/12"
        },
        15: {
            title: "d5",
            description: "c5 now counts dia upgrades too",
            cost: d(9),
        },
        16: {
            title: "d6",
            description: "slightly boost dia points",
            cost: d(24),
            effect() {
                return d(1.7)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`}
        },
        17: {
            title: "d7",
            description: "multiply dia frag gain by 4.4",
            cost: d(88),
        },
        18: {
            title: "d8",
            description: "dia frags boost itself",
            cost: d(286),
            effect() {
                return player.dpoints.add(0.1).pow(0.15).add(1)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `x<sup>0.15</sup>`,
        },
        21: {
            title: "d9",
            description: "sqrt(c5 effect) applies to dia point gain",
            cost: d(718),
            effect() {return upgradeEffect('c', 15).pow(0.5)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `it literally tells you the formula in the upgrade description`,
        },
        22: {
            title: "d10",
            description: "divide dia point gain by 3, but multiply dia frag gain by 16",
            cost: d(1673),
        },
        23: {
            title: "d11",
            description: "boost dia frags based on spade + heart points",
            cost: d(4444),
            effect() {return player.s.points.add(player.h.points).add(1).log(9).add(1)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "Made by Nif!<br>log9(spade points + heart points + 1) + 1",
        },
        24: {
            title: "d12",
            description: "multiply dia point gain by 10",
            cost: d(18750),
            unlocked() {return hasMilestone('i', 1)},
        },
        25: {
            title: "d13",
            description: "multiply dia frag gain by 4.44",
            unlocked() {return hasMilestone('i', 1)},
            cost: d(1e6),
        },
        26: {
            title: "d14",
            description: "ignition points requirement /1.7",
            cost: d(2.5e6),
            unlocked() {return hasMilestone('i', 1)},
        },
        27: {
            title: "d15",
            description: "best ignition points boost dia point gain",
            cost: d(2.2e7),
            unlocked() {return hasMilestone('i', 1)},
            effect() {return player.i.total.add(1).log(3.3).add(1.2)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `log<sub>3.3</sub>(x+1) + 1.2`
        },
        28: {
            title: "d16",
            description: "increase all base frag gain by 0.333",
            unlocked() {return hasMilestone('i', 1)},
            cost: d(4.44e8),
        },
        31: {
            title: "d17",
            description: "dia frag gain is multiplied",
            cost: d(3e9),
            effect() {
                let x = layerEffect('c').add(layerEffect('d').add(layerEffect('h').add(layerEffect('s'))))
                x = x.sub(layerEffect(this.layer))
                x = x.sqrt()
                return x
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "sqrt(sum of c, h and s effects)",
            unlocked() {return hasMilestone('i', 1)},
        },
        32: {
            title: "d18",
            description: "multiply dia point gain by 4.321",
            cost: d(1.234e10),
            unlocked() {return hasMilestone('i', 1)},
        },
        33: {
            title: "d19",
            description: "increase c19 exponent by 0.3",
            cost: d(4.444e10),
            unlocked() {return hasMilestone('i', 1)},
        },
        34: {
            title: "d20",
            description: "raise dia frag gain to ^1.09",
            cost: d(6.666e11),
            unlocked() {return hasMilestone('i', 1)},
        },
        35: {
            title: "d21",
            description: "multiply dia frag gain by 121, but /6 dia point gain",
            cost: d(3e12),
            unlocked() {return hasMilestone('i', 1)},
        },
        36: {
            title: "d22",
            description: "x4 dia point gain",
            cost: d(1e13),
            unlocked() {return hasMilestone('i', 1)},
        },
    },
    effect() {
        if(!hasUpgrade('i', 11)) return d(1)
        return player[this.layer].points.add(1).log10().add(1)
    },
    effectDescription() {
        if(hasUpgrade('i', 11)) return `boosting dia frags by ${layerText(format(layerEffect(this.layer)), this.layer)}`
    },
    autoUpgrade() {
        return tmp[this.layer].maxUpgBuy > 0
    },
    maxUpgBuy() {
        x = 0
        if(hasMilestone('i', 2)) x = 18
        if(hasMilestone('i', 3)) x = 28
        if(hasMilestone('i', 4)) x = 36
        return x
    },
    clickables: {
        11: {
            title: "Buy all upgrades",
            canClick() {return true},
            onClick() {
                autobuyUpgrades('d', true)
            },
            unlocked() {return hasMilestone('i', 1)},
        },
    },
})

// heart
addLayer("h", {
    /*
    * Other than required things,
    * include the following in every layer
    */
    componentStyles: {
        'prestige-button'() {return {'border-radius': '12px'}}
    },
    onPrestige() {
        player.cpoints = d(0)
        player.dpoints = d(0)
        player.hpoints = d(0)
        player.spoints = d(0)
    },
    // END
    
    // Layer data and subcurrency calculations
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},

    // Name and other displays
    name: "heart points",
    symbol: "h",
    resource: "heart points",
    position: 2,
    color: "#ad0000",
    row: 0,
    layerShown(){return true},

    // Prestige formula (base is (points/10)^0.5)
    baseResource: "heart frags",
    baseAmount() {return player.hpoints},
    type: "normal",
    exponent() {
        exp = 1/3
        if(hasUpgrade('h', 13)) exp = 1/2
        return exp
    }, // <1 if normal type, >1 if static
    requires: new Decimal(10),
    shouldRoundDown: true, // Only works on 'normal' layers

    // Bonuses
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade('h', 12)) mult = mult.mul(2)
        if(hasUpgrade(this.layer, 16)) mult = mult.mul(upgradeEffect(this.layer, 16))
        if(hasUpgrade(this.layer, 21)) mult = mult.mul(upgradeEffect(this.layer, 21))
        if(hasUpgrade(this.layer, 22)) mult = mult.div(3)

        if(hasUpgrade('i', 13)) mult = mult.mul(upgradeEffect('i', 13))
        if(hasUpgrade(this.layer, 24)) mult = mult.mul(10)
        if(hasUpgrade(this.layer, 27)) mult = mult.mul(upgradeEffect(this.layer, 27))
        if(hasUpgrade('i', 12)) mult = mult.mul(2.22)
        if(hasUpgrade('c', 33)) mult = mult.mul(upgradeEffect('c', 33))
        if(hasUpgrade(this.layer, 35)) mult = mult.div(6)
        if(hasUpgrade(this.layer,36))mult=mult.mul(4)
        if(hasUpgrade(this.layer, 32)) mult = mult.mul(4.321)

        if(hasMilestone('i', 3)) mult = mult.mul(clickableEffect('i', 12)[1])

        if(hasUpgrade('s', 14)) mult = mult.mul(upgradeEffect('s', 14)[1])
        if(hasUpgrade('h', 14)) mult = mult.mul(upgradeEffect('h', 14)[0])
        return mult
    },
    gainExp() {
        exp = d(1)
        return exp
    },

    // QoL things
    hotkeys: [
        {key: "h", description: "h: reset for heart points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    // Upgrades, buyables, etc.
    upgrades: {
        rows: 1,
        11: {
            title: "h1",
            description: "x3 heart frag gain",
            cost: d(1)
        },
        12: {
            title: "h2",
            description: "doubles heart point gain",
            cost: d(4),
        },
        13: {
            title: "h3",
            description: "boosts heart point formula (cbrt(x/10) -> sqrt(x/10))",
            cost: d(7),
        },
        14: {
            title: "h4",
            description: "heart and spade point multis are increased based on the others",
            cost: d(11),
            effect() {
                return [layers.s.gainMult().pow(0.2).min(6), layers.h.gainMult().pow(0.2).min(6)]
            },
            tooltip() {
                return `x<sup>0.2</sup><br>x${format(upgradeEffect('d', 13)[0])} heart points, x${format(upgradeEffect('d', 13)[1])} spade points. caps at x6`
            }
        },
        15: {
            title: "h5",
            description: "c5 now counts heart upgrades too",
            cost: d(9),
        },
        16: {
            title: "h6",
            description: "slightly boost heart points",
            cost: d(24),
            effect() {
                return d(1.7)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`}
        },
        17: {
            title: "h7",
            description: "multiply heart frag gain by 4.4",
            cost: d(88),
        },
        18: {
            title: "h8",
            description: "heart frags boost itself",
            cost: d(286),
            effect() {
                return player.hpoints.add(0.1).pow(0.15).add(1)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `x<sup>0.15</sup>`,
        },
        21: {
            title: "h9",
            description: "sqrt(c5 effect) applies to heart point gain",
            cost: d(718),
            effect() {return upgradeEffect('c', 15).pow(0.5)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `it literally tells you the formula in the upgrade description`,
        },
        22: {
            title: "h10",
            description: "divide heart point gain by 3, but multiply heart frag gain by 16",
            cost: d(1673),
        },
        23: {
            title: "h11",
            description: "boost heart frags based on clover + dia points",
            cost: d(4444),
            effect() {return player.c.points.add(player.d.points).add(1).log(9).add(1)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "Made by Nif!<br>log9(clover points + dia points + 1) + 1",
        },
        24: {
            title: "h12",
            description: "multiply heart point gain by 10",
            cost: d(18750),
            unlocked() {return hasMilestone('i', 1)},
        },
        25: {
            title: "h13",
            description: "multiply heart frag gain by 4.44",
            cost: d(1e6),
            unlocked() {return hasMilestone('i', 1)},
        },
        26: {
            title: "h14",
            description: "ignition points requirement /2.74",
            cost: d(2.5e6),
            unlocked() {return hasMilestone('i', 1)},
        },
        27: {
            title: "h15",
            description: "best ignition points boost heart point gain",
            cost: d(2.2e7),
            unlocked() {return hasMilestone('i', 1)},
            effect() {return player.i.total.add(1).log(3.3).add(1.2)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `log<sub>3.3</sub>(x+1) + 1.2`
        },
        28: {
            title: "h16",
            description: "increase all base frag gain by 0.333",
            unlocked() {return hasMilestone('i', 1)},
            cost: d(4.44e8),
        },
        31: {
            title: "h17",
            description: "heart frag gain is multiplied",
            cost: d(3e9),
            effect() {
                let x = layerEffect('c').add(layerEffect('d').add(layerEffect('h').add(layerEffect('s'))))
                x = x.sub(layerEffect(this.layer))
                x = x.sqrt()
                return x
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "sqrt(sum of d, c and s effects)",
            unlocked() {return hasMilestone('i', 1)},
        },
        32: {
            title: "h18",
            description: "multiply heart point gain by 4.321",
            cost: d(1.234e10),
            unlocked() {return hasMilestone('i', 1)},
        },
        33: {
            title: "h19",
            description: "increase c19 exponent by 0.3",
            cost: d(4.444e10),
            unlocked() {return hasMilestone('i', 1)},
        },
        34: {
            title: "h20",
            description: "raise heart frag gain to ^1.09",
            cost: d(6.666e11),
            unlocked() {return hasMilestone('i', 1)},
        },
        35: {
            title: "h21",
            description: "multiply heart frag gain by 121, but /6 heart point gain",
            cost: d(3e12),
            unlocked() {return hasMilestone('i', 1)},
        },
        36: {
            title: "h22",
            description: "x4 heart point gain",
            cost: d(1e13),
            unlocked() {return hasMilestone('i', 1)},
        },
    },
    effect() {
        if(!hasUpgrade('i', 11)) return d(1)
        return player[this.layer].points.add(1).log10().add(1)
    },
    effectDescription() {
        if(hasUpgrade('i', 11)) return `boosting heart frags by ${layerText(format(layerEffect(this.layer)), this.layer)}`
    },
    autoUpgrade() {
        return tmp[this.layer].maxUpgBuy > 0
    },
    maxUpgBuy() {
        x = 0
        if(hasMilestone('i', 2)) x = 18
        if(hasMilestone('i', 3)) x = 28
        if(hasMilestone('i', 4)) x = 36
        return x
    },
    clickables: {
        11: {
            title: "Buy all upgrades",
            canClick() {return true},
            onClick() {
                autobuyUpgrades('h', true)
            },
            unlocked() {return hasMilestone('i', 1)},
        },
    },
})

// spade
addLayer("s", {
    /*
    * Other than required things,
    * include the following in every layer
    */
    componentStyles: {
        'prestige-button'() {return {'border-radius': '12px'}}
    },
    onPrestige() {
        player.cpoints = d(0)
        player.dpoints = d(0)
        player.hpoints = d(0)
        player.spoints = d(0)
    },
    // END
    
    // Layer data and subcurrency calculations
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},

    // Name and other displays
    name: "spade points",
    symbol: "s",
    resource: "spade points",
    position: 3,
    color: "#4a4a4a",
    row: 0,
    layerShown(){return true},

    // Prestige formula (base is (points/10)^0.5)
    baseResource: "spade frags",
    baseAmount() {return player.spoints},
    type: "normal",
    exponent() {
        exp = 1/3
        if(hasUpgrade('s', 13)) exp = 1/2
        return exp
    }, // <1 if normal type, >1 if static
    requires: new Decimal(10),
    shouldRoundDown: true, // Only works on 'normal' layers

    // Bonuses
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade('s', 12)) mult = mult.mul(2)
        if(hasUpgrade(this.layer, 16)) mult = mult.mul(upgradeEffect(this.layer, 16))
        if(hasUpgrade(this.layer, 21)) mult = mult.mul(upgradeEffect(this.layer, 21))
        if(hasUpgrade(this.layer, 22)) mult = mult.div(3)

        if(hasUpgrade('i', 13)) mult = mult.mul(upgradeEffect('i', 13))
        if(hasUpgrade('i', 12)) mult = mult.mul(2.22)
        if(hasUpgrade(this.layer, 24)) mult = mult.mul(10)
        if(hasUpgrade(this.layer, 32)) mult = mult.mul(4.321)
        if(hasUpgrade(this.layer, 27)) mult = mult.mul(upgradeEffect(this.layer, 27))
        if(hasUpgrade('c', 33)) mult = mult.mul(upgradeEffect('c', 33))
        if(hasUpgrade(this.layer, 35)) mult = mult.div(6)
        if(hasUpgrade(this.layer,36))mult=mult.mul(4)

        if(hasMilestone('i', 3)) mult = mult.mul(clickableEffect('i', 12)[1])

        if(hasUpgrade('s', 14)) mult = mult.mul(upgradeEffect('s', 14)[0])
        if(hasUpgrade('h', 14)) mult = mult.mul(upgradeEffect('h', 14)[1])
        return mult.max(1)
    },
    gainExp() {
        exp = d(1)
        return exp
    },

    // QoL things
    hotkeys: [
        {key: "s", description: "s: reset for spade points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    // Upgrades, buyables, etc.
    upgrades: {
        rows: 1,
        11: {
            title: "s1",
            description: "x3 spade frag gain",
            cost: d(1)
        },
        12: {
            title: "s2",
            description: "doubles spade point gain",
            cost: d(4),
        },
        13: {
            title: "s3",
            description: "boost spade point formula (cbrt(x/10) -> sqrt(x/10))",
            cost: d(7),
        },
        14: {
            title: "s4",
            description: "spade and heart point multis are increased based on the others",
            cost: d(11),
            effect() {
                return [layers.h.gainMult().pow(0.2).min(6), layers.s.gainMult().pow(0.2).min(6)]
            },
            tooltip() {
                return `x<sup>0.2</sup><br>x${format(upgradeEffect('d', 13)[0])} heart points, x${format(upgradeEffect('d', 13)[1])} spade points. caps at x6`
            }
        },
        15: {
            title: "s5",
            description: "c5 now counts spade upgrades too",
            cost: d(9),
        },
        16: {
            title: "s6",
            description: "slightly boost spade points",
            cost: d(24),
            effect() {
                return d(1.7)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`}
        },
        17: {
            title: "s7",
            description: "multiply spade frag gain by 4.4",
            cost: d(88),
        },
        18: {
            title: "s8",
            description: "spade frags boost itself",
            cost: d(286),
            effect() {
                return player.spoints.add(0.1).pow(0.15).add(1)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `x<sup>0.15</sup>`,
        },
        21: {
            title: "s9",
            description: "sqrt(c5 effect) applies to spade point gain",
            cost: d(718),
            effect() {return upgradeEffect('c', 15).pow(0.5)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `it literally tells you the formula in the upgrade description`,
        },
        22: {
            title: "s10",
            description: "divide spade point gain by 3, but multiply spade frag gain by 16",
            cost: d(1673),
        },
        23: {
            title: "s11",
            description: "boost spade frags based on clover + dia points",
            cost: d(4444),
            effect() {return player.c.points.add(player.d.points).add(1).log(9).add(1)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "Made by Nif!<br>log9(clover points + dia points + 1) + 1",
        },
        24: {
            title: "s12",
            description: "multiply spade point gain by 10",
            cost: d(18750),
            unlocked() {return hasMilestone('i', 1)},
        },
        25: {
            title: "s13",
            description: "multiply spade frag gain by 4.44",
            cost: d(1e6),
            unlocked() {return hasMilestone('i', 1)},
        },
        26: {
            title: "s14",
            description: "ignition points requirement /2.2",
            cost: d(2.5e6),
            unlocked() {return hasMilestone('i', 1)},
        },
        27: {
            title: "s15",
            description: "best ignition points boost spade point gain",
            cost: d(2.2e7),
            unlocked() {return hasMilestone('i', 1)},
            effect() {return player.i.total.add(1).log(3.3).add(1.2)},
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: `log<sub>3.3</sub>(x+1) + 1.2`
        },
        28: {
            title: "s16",
            description: "square base frag gain (i hope this doesnt inflate my game)",
            unlocked() {return hasMilestone('i', 1)},
            cost: d(4.44e8),
        },
        31: {
            title: "s17",
            description: "spade frag gain is multiplied",
            cost: d(3e9),
            effect() {
                let x = layerEffect('c').add(layerEffect('d').add(layerEffect('h').add(layerEffect('s'))))
                x = x.sub(layerEffect(this.layer))
                x = x.sqrt()
                return x
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "sqrt(sum of d, h and c effects)",
            unlocked() {return hasMilestone('i', 1)},
        },
        32: {
            title: "s18",
            description: "multiply spade point gain by 4.321",
            cost: d(1.234e10),
            unlocked() {return hasMilestone('i', 1)},
        },
        33: {
            title: "s19",
            description: "increase c19 exponent by 0.3",
            cost: d(4.444e10),
            unlocked() {return hasMilestone('i', 1)},
        },
        34: {
            title: "s20",
            description: "raise spade frag gain to ^1.09",
            cost: d(6.666e11),
            unlocked() {return hasMilestone('i', 1)},
        },
        35: {
            title: "s21",
            description: "multiply spade frag gain by 121, but /6 spade point gain",
            cost: d(3e12),
            unlocked() {return hasMilestone('i', 1)},
        },
        36: {
            title: "s22",
            description: "x4 spade point gain",
            cost: d(1e13),
            unlocked() {return hasMilestone('i', 1)},
        },
    },
    effect() {
        if(!hasUpgrade('i', 11)) return d(1)
        return player[this.layer].points.add(1).log10().add(1)
    },
    effectDescription() {
        if(hasUpgrade('i', 11)) return `boosting spade frags by ${layerText(format(layerEffect(this.layer)), this.layer)}`
    },
    autoUpgrade() {
        return tmp[this.layer].maxUpgBuy > 0
    },
    maxUpgBuy() {
        x = 0
        if(hasMilestone('i', 2)) x = 18
        if(hasMilestone('i', 3)) x = 28
        if(hasMilestone('i', 4)) x = 36
        return x
    },
    clickables: {
        11: {
            title: "Buy all upgrades",
            canClick() {return true},
            onClick() {
                autobuyUpgrades('s', true)
            },
            unlocked() {return hasMilestone('i', 1)},
        },
    },
})

// ignite
addLayer("i", {
    // Other than required things,
    // include the following in every layer
    
    componentStyles: {
        'prestige-button'() {return {'border-radius': '12px'}}
    },
    onPrestige() {
        player.cpoints = d(0)
        player.dpoints = d(0)
        player.hpoints = d(0)
        player.spoints = d(0)
    },
    // END
    
    // Layer data and subcurrency calculations
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),
        lostbest: d(0),
        darkbest: d(0),
        coinz: d(0),
    }},

    // Name and other displays
    name: "ignition",
    symbol: "i",
    resource: "ignition points",
    position: 0,
    color: "#690404",
    row: 1,
    layerShown(){return true},
    branches: ['c', 'd', 's', 'h'],

    // Prestige formula (base is (points/10)^0.5)
    baseResource: "sum of all points",
    baseAmount() {return player.c.points.add(player.d.points).add(player.s.points).add(player.h.points)},
    requires: new Decimal(20000),
    shouldRoundDown: true, // Only works on 'normal' layers
    type: "custom",
    getResetGain() {
        let x = player.c.points.add(player.d.points).add(player.s.points).add(player.h.points)
        let gain = x.mul(tmp.i.gainMult).pow(tmp.i.gainExp)
        gain = gain.div(20).max(1).log(1000)
        gain = gain.sub(player.i.total).max(0).floor()
        return gain
    },
    getNextAt() {
        let amt = player.i.total.add(getResetGain('i').add(1))
        let mult = tmp.i.gainMult
        let exp = tmp.i.gainExp
        let req = d(1000).pow(amt).mul(20).pow(exp.recip()).div(mult)

        return req
    },
    prestigeButtonText() {
        return `Ignite your points for <b>+${formatWhole(getResetGain('i'))}</b> ignition points<br><br>Next: ${format(getNextAt('i'), 1)} sum of points`
    },
    canReset() {
        return getResetGain(this.layer).gte(1)
    },

    // Bonuses
    gainMult() {
        x = new Decimal(1)
        if(hasUpgrade('c', 26)) x = x.mul(2.2)
        if(hasUpgrade('d', 26)) x = x.mul(1.7)
        if(hasUpgrade('h', 26)) x = x.mul(2.74)
        if(hasUpgrade('s', 26)) x = x.mul(2.2)
        return x
    },
    gainExp() {
        exp = d(1)
        return exp
    },

    // QoL things
    hotkeys: [
        {key: "i", description: "i: burn your points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    // Upgrades, buyables, etc.
    upgrades: {
        11: {
            title: "i11",
            description: "row 0 layers now have a small effect",
            cost: d(1),
            tooltip: "log<sub>10</sub>(x)"
        },
        12: {
            title: "i12",
            description: "multiply all row 0 layers gain by 2.22",
            cost: d(1),
        },
        13: {
            title: "i13",
            description: "ignition points boost everything before it",
            cost: d(1),
            effect() {
                return player.i.total.mul(0.544).add(1)
            },
            effectDisplay() {return `x${format(upgradeEffect(this.layer, this.id))}`},
            tooltip: "x * 0.544 + 1"
        },
        14: {
            title: "i14",
            description() {
                if(hasMilestone('i', 2)) return "gain "+formatWhole(passiveGenAmt().mul(100))+"% of row 0 layers gain on reset per second. cap: "+formatWhole(passiveGenCap())
                if(!hasMilestone('i', 2)) return "gain 10 spade, dia, heart and clover points per second"
                return "if this shows up, contact erulure on discord" // a
            },
            cost: d(1),
        },
        101: {
            title: "c11",
            description: "all frag gain is ^2.5 when in the lost realm",
            cost: d(75),

            // this is so it deducts coinz and not ignition points
            currencyLayer: "i",
            currencyInternalName: "coinz",
            currencyDisplayName: "coinz",
        },
        102: {
            title: "c12",
            description: "x7.5 coinz gain",
            cost: d(256),
            
            // this is so it deducts coinz and not ignition points
            currencyLayer: "i",
            currencyInternalName: "coinz",
            currencyDisplayName: "coinz",
        },
    },
    clickables: {
        11: {
            title: "Respec",
            display: "Respec your upgrades",
            canClick() {return true},
            onClick() {
                if(!confirm("this will force an ignition reset, are you sure?")) return
                player.i.points = player.i.total
                player.i.upgrades = []
                doReset('i', true)
                layers.i.onPrestige()
            },
        },
        12: {
            title: "Lost Realm",
            display: "Your frag gain is log10(x)",
            canClick() {
                return true
            },
            onClick() {
                if(player.realm == "normal") {
                    handleRealmEnters("lost")
                } else {
                    handleRealmExit()
                }
            },
            effect() {
                let eff1 = player.i.lostbest.add(1).log(2).pow(2).add(1) // max passive gen boost
                let eff2 = player.i.lostbest.add(1).log(10).mul(10).add(1) // all point multi

                if(player.i.darkbest.gt(0)) eff1 = eff1.pow(clickableEffect('i', 13))

                return [eff1, eff2]
            },
            tooltip: "i hope you have enough multipliers"
        },
        13: {
            title: "Dark Realm",
            display: "Your frag gain is ^0.3",
            canClick() {
                return true
            },
            onClick() {
                if(player.realm == "normal") {
                    handleRealmEnters("dark")
                } else {
                    handleRealmExit()
                }
            },
            effect() {
                let eff = player.i.darkbest.add(1).log10().add(1).log(10).add(1)

                return eff
            }
        },
    },
    milestones: {
        1: {
            requirementDescription: "First Ignition",
            effectDescription: "unlock 11 new upgrades for all row 0 layers. x3 all frag gain",
            done() {return player.i.total.gte(1)},
        },
        2: {
            requirementDescription: "Second Ignition",
            effectDescription: "autobuy the first 8 row 0 layers upgrades. i14 is improved",
            done() {return player.i.total.gte(2)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
        },
        3: {
            requirementDescription: "Fourth Ignition",
            effectDescription: "unlock something. autobuy the first 16 row 0 layers upgrades",
            done() {return player.i.total.gte(4)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
        },
        4: {
            requirementDescription: "5th ignition",
            effectDescription: `passive gen cap is x1000. the first 22 upgrades for row 0 layers are now autobought, and coinz cap is multiplied by 2.5`,
            done() {return player.i.total.gte(5)},
            unlocked() {return hasMilestone(this.layer, this.id-1)},
        }
    },
    buyables: {
        11: {
            display() {
                return `(you have ${format(getBuyableAmount(this.layer, this.id))})<br>x1.333 coinz gain<br>cost: ${format(this.cost())} coinz<br>currently x${format(this.effect())}`
            },
            cost() {return Decimal.mul(20, Decimal.pow(5/3, getBuyableAmount(this.layer, this.id).pow(1.12)))},
            effect() {return Decimal.pow(4/3, getBuyableAmount(this.layer, this.id))},
            buy() {
                player.i.coinz = player.i.coinz.sub(this.cost())
                addBuyables(this.layer, this.id, d(1))
            },
            canAfford() {return player.i.coinz.gte(this.cost())},
        },
        12: {
            display() {
                return `(you have ${format(getBuyableAmount(this.layer, this.id))})<br>x1.7 coinz cap<br>cost: ${format(this.cost())} coinz<br>currently x${format(this.effect())}`
            },
            cost() {return Decimal.mul(20, Decimal.pow(2.7, getBuyableAmount(this.layer, this.id).pow(1.12)))},
            effect() {return Decimal.pow(1.7, getBuyableAmount(this.layer, this.id))},
            buy() {
                player.i.coinz = player.i.coinz.sub(this.cost())
                addBuyables(this.layer, this.id, d(1))
            },
            canAfford() {return player.i.coinz.gte(this.cost())},
        }
    },

    update(diff){
        x = d(diff)
        if(hasUpgrade('i', 14)) {
            if(hasMilestone('i', 2)){
                player.c.points = player.c.points.add(getResetGain('c').mul(passiveGenAmt()).min(passiveGenCap()).mul(diff))
                player.d.points = player.d.points.add(getResetGain('d').mul(passiveGenAmt()).min(passiveGenCap()).mul(diff))
                player.h.points = player.h.points.add(getResetGain('h').mul(passiveGenAmt()).min(passiveGenCap()).mul(diff))
                player.s.points = player.s.points.add(getResetGain('s').mul(passiveGenAmt()).min(passiveGenCap()).mul(diff))
            }
            if(!hasMilestone('i', 2)){
                player.c.points = player.c.points.add(x.mul(10))
                player.d.points = player.d.points.add(x.mul(10))
                player.h.points = player.h.points.add(x.mul(10))
                player.s.points = player.s.points.add(x.mul(10))
            }
        }
        if(player.realm == "lost" && fragSum().gt(player.i.lostbest)) player.i.lostbest = fragSum()
        if(player.realm == "dark" && fragSum().gt(player.i.darkbest)) player.i.darkbest = fragSum()
        if(hasMilestone('i', 3)) player.i.coinz = player.i.coinz.add(layers.i.coinzGain(diff)).min(layers.i.coinzCap())
    },

    tabFormat: {
        "Main":{
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["microtabs", "stuff"]
            ]
        },
        "Realms":{
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                ["microtabs", "realms"]
            ],
            unlocked() {return hasMilestone('i', 3)}
        }
    },
    coinzGain(mod=1){
        let x = player.i.lostbest.add(player.i.darkbest).add(1).pow(0.1).sub(1)

        x = x.mul(buyableEffect(this.layer, 11))
        if(hasUpgrade('i', 102)) x = x.mul(7.5)

        x = x.mul(mod)
        return x
    },
    coinzCap(){
        let logbase = 4
        let pow = 2

        let x = player.i.lostbest.add(player.i.darkbest).add(1).log(logbase).add(1).pow(pow)

        x = x.mul(buyableEffect('i', 12))
        if(hasMilestone('i', 4)) x = x.mul(2.5)

        return x
    },
    microtabs: {
        "stuff":{
            "upgrades": {
                content: [
                    ["clickable", 11],
                    ["row", () => {return arrayGen(1,4,11,"upgrade")}],
                ],
            },
            "milestones": {
                content: [
                    "milestones",
                ],
            },
        },
        "realms":{
            "lost realm": {
                content: [
                    ["display-text", function() {
                        return `you have ${layerText(format(player.i.coinz), 'i')} coinz (+${format(layers.i.coinzGain())}/s, caps at ${format(layers.i.coinzCap())})`
                    }],
                    "blank",
                    ["row", [
                        ["column", [
                            ["clickable", 12],
                            ["raw-html", `<span style='font-style: italic;'>"when I lost my way.."</span>`]
                        ]],
                        ["column", [
                            ["display-text", function() {return `best sum of frags in lost realm: ${layerText(format(player.i.lostbest), 'i')}`}],
                            ["display-text", function() {return `boosting max passive generation by ${layerText("x"+format(tmp.i.clickables[12].effect[0]), 'i')}<br> and clover, spade, heart and dia points by ${layerText("x"+format(tmp.i.clickables[12].effect[1]), 'i')}`}]
                        ]],
                    ]],
                ],
            },
            "dark realm":{
                content: [
                    ["display-text", function() {
                        return `you have ${layerText(format(player.i.coinz), 'i')} coinz (+${format(layers.i.coinzGain())}/s, caps at ${format(layers.i.coinzCap())})`
                    }],
                    "blank",
                    ["row", [
                        ["column", [
                            ["clickable", 13],
                            ["raw-html", `<span style='font-style: italic;'>"save me from my darkest days.."</span>`]
                        ]],
                        ["column", [
                            ["display-text", function() {return `best sum of frags in dark realm: ${layerText(format(player.i.darkbest), 'i')}`}],
                            ["display-text", function() {return `boosting lost realm effect 1 by ${layerText("^"+format(tmp.i.clickables[13].effect), 'i')}`}]
                        ]],
                    ]],
                ],
            },
            "buyables + upgrades":{
                content:[
                    ["display-text", function() {
                        return `you have ${layerText(format(player.i.coinz), 'i')} coinz (+${format(layers.i.coinzGain())}/s, caps at ${format(layers.i.coinzCap())})`
                    }],
                    "blank",
                    "buyables",
                    ["row", () => {return arrayGen(1,2,101,"upgrade")}],
                ]
            }
        },
    },
})