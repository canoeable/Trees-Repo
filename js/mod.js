let modInfo = {
	name: "The Data Tree",
	id: "TheDataTree",
	author: "not-h4re",
	pointsName: "points",
	modFiles: ["layers/bytes.js", "layers/kilobytes.js", "layers/megabytes.js", "layers/exoticbytes.js", "layers/sublayers/ab.js", "layers/sublayers/unlocks.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.04",
	name: "Exotic",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.04</h3><br>
		- Added ??? points<br>
		- Added ??? bytes<br>
		- Byte Upgrade 21 point multiplier down to 1 (from 5) and byte multiplier down to 3 (from 5)<br>
		- Kilobyte Upgrade 21 now multiplies kilobyte gain by 2<br>
		- Kilobyte Upgrade 22 effect down to 0% passive generation (from 2000%), but it now multiplies kilobyte gain by 4<br>
		- Increased Kilobyte Upgrade 22 cost to 2222 (from 750)<br>
		- Increased megabytes base to 3.2 (from 2)<br>
		- Removed 🅰️<br>
		- Base megabyte cost is now 2e6 (from 7.77e5)<br>
		- Kilobyte Upgrade 11 now states that it unlocks a buyable<br>
		- 🆎 unlock cost is now 200,000 (from 50,000)<br>
		- Unlock 6 now only keeps byte upgrades on kilobyte reset<br>
		- Kilobyte Upgrade 23 cost up to 15000<br>
		- Unlock 7 requirement is now 500,000 kilobytes<br>
		- Endgame: 3 megabytes, EB upg 11 and 1 EB<br><br>
	<h3>v1.03</h3><br>
		- Bytes cost exponent is now 0.516 (from 0.487)<br>
		- Byte Upgrade 21 cost is now 0 (from 50) but it requires 40 bytes to buy<br>
		- Byte Upgrade 21 now boosts byte and point gain by x5<br>
		- You can now reset for fractional currency amounts<br>
		- Nerfed Kilobyte Upgrade 21 cost to 500 (from 1000)<br>
		- Nerfed Kilobyte Upgrade 22 cost to 750 (from 7500)<br>
		- Kilobyte Upgrade 22 now multiplies kilobyte gain by 1 (from 2) but it passively generates 2000% of kilobyte gain on reset per second<br>
		- Nerfed Kilobyte Upgrade 23 cost to 10000 (from 17500) and buffed its effect to 12 (from 3)<br>
		- Base 🆎 gain is now 5/s (from 1/s)<br>
		- I think thats everything<br><br>
	<h3>v1.02.1</h3><br>
		- Fixed bug where exporting didn't work if you had more than 2.5e29 bytes<br><br>
	<h3>v1.02</h3><br>
		- Restyled the game.<br>
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

	let gain = new Decimal(1.25)
	if(hasUpgrade('b', 12)) gain = gain.mul(upgradeEffect('b', 12))
	if(hasUpgrade('b', 32)) gain = gain.mul(upgradeEffect('b', 32))
	gain = gain.mul(buyableEffect('b', 11))
	if(hasMilestone('unl', 3)) gain = gain.mul(1.5)
	gain = gain.mul(buyableEffect('kb', 11))
	if(hasUpgrade('eb', 11)) gain = gain.mul(2.222)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	exoticpoints: D(0),
}}

// Display extra things at the top of the page
var displayThings = [ function() {
	if(player.exoticpoints.gt(0)) {
		return `You have `+layerText('eb', format(player.exoticpoints))+` exotic points<br>(+${layers.eb.exoticPointGain()}/sec)`
	} else return
}
]

// Determines when the game "ends"
function isEndgame() {
	return player.mb.points.gte(3) && player.eb.points.gte(1) && hasUpgrade('eb', 11)
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
	player.mb.points = player.mb.points.min(2)
	player.kb.points = player.kb.points.min(100000)
	player.b.points = player.b.points.min(1e30)
	player.points = player.points.min(1e30)
	player.a = undefined
}

function layerText(layer, text, tag='h2') { return `<${tag} style='color:${temp[layer].color};text-shadow:${temp[layer].color} 0px 0px 10px;'>${text}</${tag}>` }

function D(x) {return new Decimal(x)}
function d(x) {return new Decimal(x)}

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
	let gain = D(5)
	gain = gain.mul(buyableEffect("ab", 11))
	gain = gain.mul(buyableEffect("ab", 12))
	gain = gain.mul(buyableEffect("ab", 13))
	gain = gain.mul(upgradeEffect("ab", 12))
	if(hasUpgrade('ab', 14)) gain = gain.mul(upgradeEffect("ab", 14))
	gain = gain.pow(buyableEffect("ab", 14).max(1))
	if(hasUpgrade('ab', 21)) gain = gain.mul(upgradeEffect("ab", 21))
	if(hasMilestone('unl', 8)) gain = gain.mul(3.5)
	if(hasUpgrade('ab', 23)) gain = gain.pow(upgradeEffect("ab", 23))
	if(hasUpgrade('eb', 11)) gain = gain.mul(2.222)
	return gain
}

function buyIn(cost, gain, curr, maxed=false) {
	if(!maxed) {return D(curr).gte(cost) ? "" : "Can buy in: "+format(D(cost).sub(curr).div(gain))+" seconds"} else {return ""}
}

function T(n) {
	return n.pow(2).add(n).div(2)
}