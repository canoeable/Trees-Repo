addLayer("p", {
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
    type: "normal",
    exponent: 0.5, // <1 if normal type, >1 if static
    requires: new Decimal(10),

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
