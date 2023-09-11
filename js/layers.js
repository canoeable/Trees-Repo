addLayer("p", {
    /*
    * Other than required things,
    * include the following in every layer
    */
    componentStyles: {
        'prestige-button'() {return {'border-radius': '12px'}}
    },
    // END
    name: "prestige",
    symbol: "P",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    requires: new Decimal(10),
    color: "#4BDC13",
    resource: "prestige points",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5, // <1 if normal type, >1 if static
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        exp = d(1)
        return exp
    },
    row: 0,
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
})
