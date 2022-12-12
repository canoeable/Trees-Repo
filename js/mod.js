let modInfo = {
	name: "The Data Tree",
	id: "TheDataTree",
	author: "not-h4re",
	pointsName: "points",
	modFiles: ["layers/bytes.js", "layers/kilobytes.js", "layers/megabytes.js", "layers/sublayers/ab.js", "layers/sublayers/a.js", "layers/sublayers/unlocks.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.02",
	name: "The not-so-great restyle",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.02</h3><br>
		- Restyled the game. (Thanks<br>
		- Added 🅰️.<br>
		- Added another unlock<br>
		- Endgame: 3 megabytes and 120 🅰️<br><br>
	<h3>v1.01</h3><br>
		- Fixed kilobytes buyables removing too much currency when bulking sometimes.<br>
		- Added a single unlock.<br>
		- Endgame is the same (2 megabytes)<br><br>
	<h3>v1.0</h3><br>
		- Made the game.<br>
		- endgame: 2 megabytes.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade('b', 11) || player.kb.unlocked
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1.111111)
	if(hasUpgrade('b', 12)) gain = gain.mul(upgradeEffect('b', 12))
	if(hasUpgrade('b', 32)) gain = gain.mul(upgradeEffect('b', 32))
	gain = gain.mul(buyableEffect('b', 11))
	if(hasMilestone('unl', 3)) gain = gain.mul(1.5)
	gain = gain.mul(buyableEffect('kb', 11))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [ function() {if(hasMilestone('unl', 7) && !player.mb.unlocked) return `It is recommended to get 2 megabytes for your first reset.`}
]

// Determines when the game "ends"
function isEndgame() {
	return player.mb.points.gte(3) && player.a.points.gte(120)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	player.a.points = D(0)
	player.mb.upgrades = []
}

function layerText(layer, text, tag='h2') { return `<${tag} style='color:${temp[layer].color};text-shadow:${temp[layer].color} 0px 0px 10px;'>${text}</${tag}>` }

function D(x) {return new Decimal(x)}

function createMilestone(req, effect, done) { return {
	requirementDescription: req,
	effectDescription: effect,
	done() {return done}
}}

function formatData(num, precision=3) {
	let suffix = [null, "B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
}

function numHex(s)
{
    var a = s.toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    return "#"+a;
}

function calcNumToHex(m, a) {
	return Math.floor(16777216 * (a / m))
}

function calcABgain() {
	let gain = D(1)
	gain = gain.mul(buyableEffect("ab", 11))
	gain = gain.mul(buyableEffect("ab", 12))
	gain = gain.mul(buyableEffect("ab", 13))
	gain = gain.mul(upgradeEffect("ab", 12))
	if(hasUpgrade('ab', 14)) gain = gain.mul(upgradeEffect("ab", 14))
	gain = gain.pow(buyableEffect("ab", 14).max(1))
	if(hasUpgrade('ab', 21)) gain = gain.mul(upgradeEffect("ab", 21))
	if(hasMilestone('unl', 8)) gain = gain.mul(3.5)
	if(hasUpgrade('ab', 23)) gain = gain.pow(upgradeEffect("ab", 23))
	return gain
}

function buyIn(cost, gain, curr, maxed=false) {
	if(!maxed) {return D(curr).gte(cost) ? "" : "Can buy in: "+format(D(cost).sub(curr).div(gain))+" seconds"} else {return ""}
}

function calcAgain() {
	let base = D(1)
	return base
}