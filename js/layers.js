/*
* idea list:
* ignition every 11 upgrades
* v-ignition at 44 upgrades
*
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
    },
})

// ignite
/*addLayer("i", {
    // Other than required things,
    // include the following in every layer
    
    componentStyles: {
        'prestige-button'() {return {'border-radius': '12px'}}
    },
    // END
    
    // Layer data and subcurrency calculations
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),
    }},

    // Name and other displays
    name: "prestige",
    symbol: "P",
    resource: "prestige points",
    position: 0,
    color: "#4BDC13",
    row: 0,
    layerShown(){return true},

    // Prestige formula (base is (points/10)^0.5)
    baseResource: "points",
    baseAmount() {return player.points},
    requires: new Decimal(600),
    shouldRoundDown: true, // Only works on 'normal' layers
    type: "custom",
    getResetGain() {
        let x = player.c.points.add(player.d.points).add(player.s.points).add(player.h.points)
        let gain = x.div(600).div(d(10).pow(player.i.total))
        gain = gain.mul(tmp.i.gainMult()).pow(tmp.i.gainExp())
        return gain.floor().max(0)
    },
    getNextAt() {
        
    },

    // Bonuses
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        exp = d(1)
        return exp
    },

    // QoL things
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    // Upgrades, buyables, etc.
})
*/