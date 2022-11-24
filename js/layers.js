addLayer("b", {
    name: "bits", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires() {
        let req =  new Decimal(1.25).mul(player.b.points.add(1))
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "bits", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    directMult() {
        mult = new Decimal(1)
        if(hasUpgrade('by', 11)) mult = mult.mul(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "b: Reset for bits", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", () => "Next at "+format(D(1.25).mul(player.b.points.add(1)))+ " points"],
        "resource-display"
    ]
})

addLayer("by", {
    name: "bytes", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "By", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires() {
        let req = new Decimal(8).mul(player.by.points.add(1))
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "bytes", // Name of prestige currency
    baseResource: "bits", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "y", description: "y: Reset for bytes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", () => "Next at "+format(D(8).mul(player.by.points.add(1)))+ " bits"],
        "resource-display",
        "milestones",
        "buyables",
        "upgrades",
    ],
    upgrades: {
        11: {
            title: "Bytes Upgrade (1, 1)",
            description: "x2 to bits",
            cost: new Decimal(2),
            effect() {return new Decimal(2)},
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
        12: {
            title: "Bytes Upgrade (1, 2)",
            description: "^2 achievement (2, 2)",
            cost: new Decimal(3),
            effect() {return new Decimal(2)},
            effectDisplay() {return "^"+format(upgradeEffect(this.layer, this.id))}
        },
        13: {
            title: "Bytes Upgrade (1, 3)",
            description: "x1.81 to this layers effect",
            cost: new Decimal(5),
            effect() {return new Decimal(1.81)},
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"}
        },
    },
    branches: ['b'],
    effect() {
        let base = player.by.best.pow(0.45)
        if(hasUpgrade('by', 13)) base = base.mul(1.81)
        return base
    },
    effectDescription() {return "boosting points by "+layerText('by', format(tmp.by.effect)+"x")}
})

//TODO: Add custom colours

addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "a", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#f3ff05",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "", // Name of prestige currency
    baseResource: "", // Name of resource prestige is based on
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
    row: "side", // Row the layer is in on the tree (0 is the first row),
    layerShown(){return true},
    tabFormat: [
        ["display-text", () => "You have "+layerText('ach', formatWhole(player.ach.achievements.length)+"/10")+" achievements"],
        "blank",
        "achievements"
    ],
    achievements: {
        11: {
            name: "1 bit",
            tooltip: "Have 1 bit",
            done() {return player.b.points.gte(1)}
        },
        12: {
            name: "2 bits",
            tooltip: "Have 2 bits",
            done() {return player.b.points.gte(2)}
        },
        13: {
            name: "4 bits",
            tooltip: "Have 4 bits",
            done() {return player.b.points.gte(4)}
        },
        14: {
            name: "8 bits",
            tooltip: "Have 8 bits",
            done() {return player.b.points.gte(8)}
        },
        15: {
            name: "16 bits",
            tooltip: "Have 16 bits",
            done() {return player.b.points.gte(16)}
        },
        16: {
            name: "32 bits",
            tooltip: "Have 32 bits",
            done() {return player.b.points.gte(32)}
        },
        17: {
            name: "64 bits",
            tooltip: "Have 64 bits",
            done() {return player.b.points.gte(64)}
        },
        18: {
            name: "128 bits",
            tooltip: "Have 128 bits",
            done() {return player.b.points.gte(128)}
        },
        21: {
            name: "1 byte",
            tooltip: "Have 1 byte <br> Reward: x3 points",
            done() {return player.by.points.gte(1)}
        },
        22: {
            name: "2 bytes",
            tooltip: "Have 2 bytes",
            done() {return player.by.points.gte(2)}
        },
    },
    canReset() {return false},
    tooltip: "Achievements Layer but I give the tooltip a reaaaaaaaly long name because only like 2 people will read this"
})

//layer template
/*addLayer("b", {
    name: "bits", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "b", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires() {return new Decimal(1.25).mul(player.b.points.add(1))}, // Can be a function that takes requirement increases into account
    resource: "bits", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "b: Reset for bits", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", () => "Next at "+format(D(1.25).mul(player.b.points.add(1)))+ " points"],
        "resource-display"
    ]
})*/