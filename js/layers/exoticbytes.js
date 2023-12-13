addLayer("eb", {
    name: "exotic bytes", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B<sub>E</sub>", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#fc9628",
    type: "custom",
    resource: "exotic bytes", // Name of prestige currency
    getResetGain() {
        let epreq = d(10).mul(player.eb.points.add(1).pow(3))
        let bytereq = d(1e30).mul(d(1e10).pow(player.eb.points.add(1)))
        
        let epgain = player.exoticpoints.div(10).pow(d(1).div(3)).floor().max(0)
        let bytegain = player.b.points.div(1e30).max(1).log(1e10).max(0).floor()

        return Decimal.min(epgain, bytegain)
    },
    baseAmount: D(1),
    onPrestige() {
        let x = player.unl.milestones
        let index = [x.indexOf(1),x.indexOf(2),x.indexOf(3),x.indexOf(4),x.indexOf(5),x.indexOf(6),x.indexOf(7)]
        player.unl.milestones.splice(index)
        player.exoticpoints = d(0)
    },
    canReset() {
        return getResetGain(this.layer).gte(1)
    },
    prestigeButtonText() {
        return `Infuse your exotic points with your bytes for +${formatWhole(getResetGain(this.layer))} exotic bytes<br><br>Req: ${format(player.eb.points.add(getResetGain(this.layer)).add(1).pow(3).mul(10))} exotic points and ${format(d(1e30).mul(d(1e10).pow(player.eb.points.add(getResetGain(this.layer)).add(1))))} bytes`
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    getNextAt() {return D(0)},
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "B", description: "shift+b: Reset for exotic bytes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.mb.points.gte(1)},
    exoticPointGain() {
        let gain = d(0.02)
        if(hasUpgrade('eb', 11)) gain = gain.mul(2.222)
        return gain
    },
    update(diff) {
        if(player.mb.points.gte(1)) {
            player.exoticpoints = player.exoticpoints.add(layers.eb.exoticPointGain().mul(diff))
        }
    },
    componentStyles: {
        "prestige-button"() { return {'border-radius': "30px"}}
    },
    branches: ['mb', 'b', 'unl'],
    upgrades: {
        11: {
            title: "Exotic bytes?!?!",
            description: "Multiply exotic point, byte, kilobyte, point and AB gain by x2.222",
            cost: d(1)
        }
    }
})