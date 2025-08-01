//=========================================================================================================================
// functions.js
//		This is a giant file with all common functions
//		Functions are grouped based on their purpose, with functions listed at the beginning of each group
//		Use the search feature to navigate - each group begins with four periods
//		Groups:
//			BASIC
//			DROPDOWN CHOICES
//			DROPDOWN SETUP
//			EFFECTS
//			FILE SAVE AND LOAD
//			INVENTORY
//			INVENTORY DRAG AND DROP
//			STAT AND SKILL CHOICES
//			UPDATING
//		Other functions (in class files such as amazon.js):
//			getSkillData
//			getBuffData
//			getSkillDamage
//			setSkillAmounts
//=========================================================================================================================


//=========================================================================================================================
// BASIC ....
//=========================================================================================================================

/* Functions:
	startup
	reset
	init
	clearIconSources
	setIconSources
	updateSkillIcons
	changeLevel
	setIronGolem
	resetSkills
	resetEquipment
	resetCharms
	resetCorruptions
	toggleQuests
	toggleRunning
	changeVersion
	changeDifficulty
	toggleCoupling
	toggleAutocast
	toggleSynthwep
	toggleParameters
	changeMonster
	loadMonsters
	round
	getId
	getBaseId
	loadParams
*/

// startup - Resets everything and starts a new character
//	choice: name of new character class
// ---------------------------------
function startup(choice) {
	// TODO: prevent calculations from being done before info is loaded (e.g. when mouse is prepositioned over a skill while page loads)
	var character_setup = character_all[choice]
	for (stat in character_setup) { character[stat] = character_setup[stat] }
	//loadMonsters()
	setMercenary("none")
	setIronGolem("none")
	loadEquipment(choice)
	clearIconSources()
	resetEffects()
	resetSkills()
	resetEquipment()
	effects = {}
	calculateSkillAmounts()
	updateSkills()
	document.getElementById("quests").checked = 0
	document.getElementById("running").checked = 0
	document.getElementById("difficulty3").checked = 1
//	document.getElementById("parameters").checked = 1
	skills = skills_all[choice]
	for (stat in base_stats) { character[stat] = base_stats[stat] }
	for (stat in unequipped) { character[stat] = unequipped[stat] }
	for (stat in character_setup) { character[stat] = character_setup[stat] }
	setIconSources(choice)
	updateSkillIcons()
	document.getElementById("skill_tree").src = character_setup.skill_layout
	init()
	updateStats()
	toggleParameters(parameters)
	document.getElementById("quests").checked = true; toggleQuests(document.getElementById("quests"))
//	toggleQuests()
}

// reset - Calls startup() with the specified class name
//	name: string class name
// ---------------------------------
function reset(name) { startup(name.toLowerCase()); }

// init - Initiates mouse functions
// ---------------------------------
function init() {
	document.getElementById("skillmap").onmouseout = function() {skillOut()};
	for (let s = 0, len = skills.length; s < len; s++) {
		document.getElementById("s"+skills[s].key).onmouseover = function() {skillHover(skills[s])};
		document.getElementById("s"+skills[s].key).onclick = function() {skillUp(event,skills[s],1)};
		document.getElementById("s"+skills[s].key).oncontextmenu = function() {skillDown(event,skills[s])};
//		toggleQuests()
	}
}

// clearIconSources - Removes all active skill icons
// ---------------------------------
function clearIconSources() {
	for (let s = 0; s < skills.length; s++) {
		var iconId = "i"+skills[s].key
		document.getElementById(iconId).src = "./images/skills/none.png"
		document.getElementById(iconId).style.visibility = "hidden"
	}
}

// setIconSources - Sets new active skill icons based on character class
//	className: name of character class
// ---------------------------------
function setIconSources(className) {
	var prefix = "./images/skills/"+className+"/";
	for (let s = 0, len = skills.length; s < len; s++) {
		var iconId = "i"+skills[s].key;
		var iconName = skills[s].name;
		if (game_version == 2 && iconName == "Lightning Mastery") { iconName = "Lightning_Mastery" }
		else if (game_version == 3 && iconName == "Golem Mastery") { iconName = "Golem_Mastery" }
		document.getElementById(iconId).src = prefix+iconName+".png"
	}
}

// updateSkillIcons - Handles whether active skill icons are hidden or shown
// ---------------------------------
function updateSkillIcons() {
	for (let s = 0; s < skills.length; s++) {
		var iconId = "i"+skills[s].key;
		var show = 1;
		if (skills[s].req.length > 0) { for (let i = 0; i < skills[s].req.length; i++) {
			if (skills[skills[s].req[i]].level == 0) { show = 0; }
		} }
		if (character.level < skills[s].reqlvl) { show = 0; }
		if (show == 1) { document.getElementById(iconId).style.visibility = "visible" }
		else { document.getElementById(iconId).style.visibility = "hidden" }
	}
}

// changeLevel - Modifies the character's level
//	input: positive or negative change (-1 or 1)
// ---------------------------------
function changeLevel(event, input) {
	var levels = 1
	if (event != null) {
		if (event.shiftKey) { levels = 10 }
		if (event.ctrlKey) { levels = 100 }
	} 
	if (input < 0) {
		if (levels > character.level-1) { levels = (character.level-1) }
		if (levels > character.skillpoints) { levels = character.skillpoints }
		if (levels*5 > character.statpoints) { levels = Math.floor(character.statpoints/5) }
		levels *= input
	}
	var maxup = 99 - character.level
	if (levels > maxup) { levels = maxup }
	if (levels != 0) {
		character.level += levels
		character.skillpoints += levels
		character.statpoints += 5*levels
		character.stamina += character.levelup_stamina*levels
		character.life += character.levelup_life*levels
		character.mana += character.levelup_mana*levels
	}
	updateMercenary()
	update()
}

// setIronGolem - sets Iron Golem info based on the item used to create it
//	val: the item's name
// ---------------------------------
function setIronGolem(val) {
	golemItem = {name:"none"}
	if (val == "none" || val == "­ ­ ­ ­ Iron Golem") { document.getElementById("dropdown_golem").selectedIndex = 0 }
	else {
		var groups = ["helm","armor","gloves","boots","belt","weapon","offhand"];
		for (let g = 0; g < groups.length; g++) { for (item in equipment[groups[g]]) {
			if (equipment[groups[g]][item].name == val) {
				for (affix in equipment[groups[g]][item]) {
					// TODO: Add other item stats and display them somewhere?
					if (affix == "name" || affix == "aura_lvl" || affix == "aura") {
						golemItem[affix] = equipment[groups[g]][item][affix]
					}
				}
			}
		} }
	}
	for (id in effects) { if (id.split("-")[0] == "Iron_Golem") {
		for (affix in effects[id]) { if (affix != "info") {
			character[affix] -= effects[id][affix]	// stats are added to the character via getBuffData()
			effects[id][affix] = unequipped[affix]
		} }
		updateEffect(id)
	} }
	update()
	updateAllEffects()
}

// resetSkills - Resets functionality for skills
// ---------------------------------
function resetSkills() {
	for (bonus in skill_bonuses) { character[bonus] = skill_bonuses[bonus] }
	for (s = 0, len = skills.length; s < len; s++) {
		skills[s].level = 0
		skills[s].extra_levels = 0
		skills[s].force_levels = 0
		document.getElementById("p"+skills[s].key).innerHTML = ""
		document.getElementById("s"+skills[s].key).onmouseover = function() {mouseOut};
		document.getElementById("s"+skills[s].key).onclick = function() {mouseOut};
		document.getElementById("s"+skills[s].key).oncontextmenu = function() {mouseOut};
	}
	document.getElementById("dropdown_skill1").innerHTML = "<option class='gray-all' style='color:gray' disabled selected>" + " ­ ­ ­ ­ Skill 1" + "</option>"
	document.getElementById("dropdown_skill2").innerHTML = "<option class='gray-all' style='color:gray' disabled selected>" + " ­ ­ ­ ­ Skill 2" + "</option>"
}

// resetEquipment - Resets all items
// ---------------------------------
function resetEquipment() {
	for (group in corruptsEquipped) { equip(group, "none") }
	resetCharms()
	resetCorruptions()
}

// resetCharms - Resets all charms
// ---------------------------------
function resetCharms() {
	var group = "charms"
	for (charm in equipped[group]) {
		for (old_affix in equipped[group][charm]) {
			character[old_affix] -= equipped[group][charm][old_affix]
			equipped[group][charm][old_affix] = unequipped[old_affix]
		}
	}
	for (let s = 1; s < inv[0]["in"].length; s++) { inv[0]["in"][s] = "" }
	for (let t = 1; t < inv.length; t++) {
		inv[t].empty = 1
		inv[t].id
		document.getElementById(inv[t].id).innerHTML = ""
	}
}

// resetCorruptions - Resets all corruptions
// ---------------------------------
function resetCorruptions() {
	for (group in corruptsEquipped) { corrupt(group, "none") }
}

// toggleQuests - Toggles the completion of all quests and their rewards
//	quests: name identifier for 'Quests Completed' checkbox element
// ---------------------------------
function toggleQuests(quests) {
	if (quests.checked == false && (character.skillpoints < 12 || character.statpoints < 15)) { quests.checked = true }
	else {
		character.quests_completed *= -1
		var toggle = character.quests_completed
		character.skillpoints += (12*toggle)
		character.statpoints += (15*toggle)
		character.life += (60*toggle)
		character.fRes += (30*toggle)
		character.cRes += (30*toggle)
		character.lRes += (30*toggle)
		character.pRes += (30*toggle)
		// TODO: Include merchant price discount?
		updatePrimaryStats()
		updateOther()
	}
	updateURLDebounced()
	// Notes for adding per-quest options:
	// document.getElementById("quests").indeterminate = true;
	// Den of Evil, Radament's Lair, The Golden Bird, Lam Esen's Tome, The Fallen Angel, Prison of Ice
}

// toggleRunning - Toggles whether the character is running or walking/standing
//	running: name identifier for 'Running' checkbox element
// ---------------------------------
function toggleRunning(running) {
	if (running.checked == true) { character.running = 1 } else { character.running = 0 }
	updateStats()
	updateURLDebounced()
}

// changeVersion - Changes the version of the game
//	v: game version (1-3)
//  char_class: chosen character class or blank ("")
// ---------------------------------
function changeVersion(v, char_class) {
	if (game_version != v && document.getElementById("version"+v).disabled != true) {
		game_version = v
		document.getElementById("version"+v).checked = true
		if (v == 1) {
			skills_all = {amazon:skills_amazon_vanilla, assassin:skills_assassin_vanilla, barbarian:skills_barbarian_vanilla, druid:skills_druid_vanilla, necromancer:skills_necromancer_vanilla, paladin:skills_paladin_vanilla, sorceress:skills_sorceress_vanilla}
			character_all = {amazon:character_amazon_vanilla, assassin:character_assassin_vanilla, barbarian:character_barbarian_vanilla, druid:character_druid_vanilla, necromancer:character_necromancer_vanilla, paladin:character_paladin_vanilla, sorceress:character_sorceress_vanilla, any:character_any_vanilla}
			document.getElementById("stats").style.display = "none"
			document.getElementById("skill_details_active").style.display = "none"
			document.getElementById("gui_equipment").style.display = "none"
			document.getElementById("equipment_corruptions").style.display = "none"
			document.getElementById("equipment_a").style.display = "none"
			document.getElementById("equipment_b").style.display = "none"
			document.getElementById("side").style.display = "none"
			document.getElementById("nav_autocast").style.display = "none"
			document.getElementById("nav_running").style.display = "none"
			document.getElementById("version_spacing").style.display = "block"
			//document.getElementById("skill_details_inactive").style.display = "block"
			//document.getElementById("skill_details_inactive").innerHTML = "<br>Additional features aren't implemented for this version"
			settings.autocast = 1
		} else if (v == 2) {
			skills_all = {amazon:skills_amazon, assassin:skills_assassin, barbarian:skills_barbarian, druid:skills_druid, necromancer:skills_necromancer, paladin:skills_paladin, sorceress:skills_sorceress}
			character_all = {amazon:character_amazon, assassin:character_assassin, barbarian:character_barbarian, druid:character_druid, necromancer:character_necromancer, paladin:character_paladin, sorceress:character_sorceress, any:character_any}
			document.getElementById("stats").style.display = "block"
			document.getElementById("skill_details_active").style.display = "block"
			document.getElementById("gui_equipment").style.display = "block"
			document.getElementById("equipment_corruptions").style.display = "block"
			document.getElementById("equipment_a").style.display = "block"
			document.getElementById("equipment_b").style.display = "block"
			document.getElementById("side").style.display = "block"
			document.getElementById("nav_autocast").style.display = "block"
			document.getElementById("nav_running").style.display = "block"
			document.getElementById("version_spacing").style.display = "none"
			//document.getElementById("skill_details_inactive").style.display = "none"
		} else if (v == 3) {
			skills_all = {amazon:skills_pd2_amazon, assassin:skills_pd2_assassin, barbarian:skills_pd2_barbarian, druid:skills_pd2_druid, necromancer:skills_pd2_necromancer, paladin:skills_pd2_paladin, sorceress:skills_pd2_sorceress}
			character_all = {amazon:character_pd2_amazon, assassin:character_pd2_assassin, barbarian:character_pd2_barbarian, druid:character_pd2_druid, necromancer:character_pd2_necromancer, paladin:character_pd2_paladin, sorceress:character_pd2_sorceress, any:character_pd2_any}
			document.getElementById("stats").style.display = "none"
			document.getElementById("skill_details_active").style.display = "none"
			document.getElementById("gui_equipment").style.display = "none"
			document.getElementById("equipment_corruptions").style.display = "none"
			document.getElementById("equipment_a").style.display = "none"
			document.getElementById("equipment_b").style.display = "none"
			document.getElementById("side").style.display = "none"
			document.getElementById("nav_autocast").style.display = "none"
			document.getElementById("nav_running").style.display = "none"
			document.getElementById("version_spacing").style.display = "block"
			//document.getElementById("skill_details_inactive").style.display = "block"
			//document.getElementById("skill_details_inactive").innerHTML = "<br>Additional features aren't implemented for this version"
			settings.autocast = 1
		}
		
		// character class handling
		char_class = char_class.toLowerCase()
		var rand_class = character.class_name;
		var classes = ["amazon","assassin","barbarian","druid","necromancer","paladin","sorceress"];
		if (typeof(rand_class) == 'undefined') {	// select random class if page hasn't loaded yet
			var random = Math.floor(Math.random() * 7);
			var rand_class = classes[random];
		}
		if (classes.includes(char_class) == false) { char_class = rand_class }
		
		// reset some things		TODO: fix normal reset functionality & updating 		...this is only necessary for Lightning Mastery when switching from PD2 to PoD? Why? ...something to do with the other masteries (Fire & Cold) being oskills?
		for (id in effects) {
			effects[id].info.enabled = 0
			effects[id].info.snapshot = 0
			skills[effects[id].info.index].level = 0
			updateEffect(id)
			disableEffect(id)
			removeEffect(id,null)
		}
		
		// update URL
		params.set('v', v)
		if (settings.parameters == 1) {
			window.history.replaceState({}, '', `${location.pathname}?${params}`)
		} else {
			if (v == 2) { window.history.replaceState({}, '', `${location.pathname}?v=PoD`) }
			else if (v == 3) { window.history.replaceState({}, '', `${location.pathname}?v=PD2`) }
			else { window.history.replaceState({}, '', `${location.pathname}`) }
		}
		
		reset(char_class)
	}
}

// changeDifficulty - Changes the game difficulty
//	diff: game difficulty (1-3)
// ---------------------------------
function changeDifficulty(diff) {
	character.difficulty = diff
	var penalties = ["fRes_penalty", "cRes_penalty", "lRes_penalty", "pRes_penalty", "mRes_penalty"]
	for (let p = 0; p < penalties.length; p++) {
		if (diff == 1) { character[penalties[p]] = 0 }
		else if (diff == 2) { character[penalties[p]] = 40 }
		else if (diff == 3) { character[penalties[p]] = 100 }
	}
	//document.getElementById("difficulty"+diff).checked = true
	updateStats()
	if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
	if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
	updateURLDebounced()
}

// toggleCoupling - Changes whether adding/removing skill points can affect character level
//	coupling: name identifier for 'Skill Level Coupling' checkbox element
// ---------------------------------
function toggleCoupling(coupling) {
	if (coupling.checked) { settings.coupling = 1 } else { settings.coupling = 0 }
	updateURLDebounced()
}

// toggleAutocast - Changes whether buffs and auras are automatically enabled when added
//	autocast: name identifier for 'New Effects Begin Enabled' checkbox element
// ---------------------------------
function toggleAutocast(autocast) {
	if (autocast.checked) { settings.autocast = 1 } else { settings.autocast = 0 }
	updateURLDebounced()
}

// togglesynthwep - Changes whether adding/removing skill points can affect character level
//	coupling: name identifier for 'Skill Level Coupling' checkbox element
// ---------------------------------

function toggleSynthwep(synthwep) {
	if (synthwep.checked) { settings.synthwep = 1 } else { settings.synthwep = 0 }
	update()
	getCharacterInfo()
	loadEquipment(chioce)
	loadItems(choice)
}

// toggleParameters - Changes whether parameters are shown in the address bar
//	parameters: name identifier for 'URL Parameters' checkbox element
// ---------------------------------
function toggleParameters(parameters) {
	if (parameters.checked) {
		settings.parameters = 1
		params.set('url', ~~settings.parameters)
		window.history.replaceState({}, '', `${location.pathname}?${params}`)
	} else {
		settings.parameters = 0
		if (game_version == 2) { window.history.replaceState({}, '', `${location.pathname}?v=PoD`) }
		else if (game_version == 3) { window.history.replaceState({}, '', `${location.pathname}?v=PD2`) }
		else { window.history.replaceState({}, '', `${location.pathname}`) }
	}
}

// changeMonster - Changes the target monster
//	mon_id: monster's id
// ---------------------------------
function changeMonster(mon_id) {
	monsterID = ~~mon_id.split("on")[1]
	document.getElementById(mon_id).checked = true
	updatePrimaryStats()
}

// loadMonsters - UNUSED
// ---------------------------------
function loadMonsters() {
	var choices = '';
	for (mon in MonStats) {
		if (MonStats[mon][0] == 0) {
			var mon_id = MonStats[mon][1];
			var mon_name = MonStats[mon][2];
			var ex = MonStats[mon][13][MonStats[mon][13].length-1];
			var special = 0;
			if (ex != "1" && ex != "2" && ex != "3" && ex != "4" && ex != "5" && ex != "6" && ex != "7" && ex != "8" && ex != "9" && ex != "10") { special = 1 }
			if (special == 0 && ex == 1 && mon_id < 575) {
				choices += '<div class="nav-dropdown-content-item"><div class="nav-option"><input id="mon'+mon_id+'" type="radio" name="mon" onclick="changeMonster(this.id);"><label for="mon" onclick="changeMonster('+"'mon"+mon_id+"'"+');">'+mon_name+'</label></div></div>'
			}
			// TODO: Adjust selection menu to reduce displayed length - separate monsters by act?
		}
	}
	document.getElementById("monsters").innerHTML = choices
}

// round - Rounds and returns a number
//	num: number to round
// return: rounded number (no decimals if above 33 or ending in ".0")
// ---------------------------------
function round(num) {
	// TODO: Always round damage/life numbers
	var temp = num;
	var decimals = (toString(num) + ".");
	if (num >= 25) { temp = Math.round(num) }
	else {
		decimals = decimals.split(".");
		if (decimals[1].length > 1) { temp = num.toFixed(1) }
		else { temp = (Math.round((num + Number.EPSILON) * 10) / 10) }
	}
	return temp;
}

// getId - gets the ID for the given name
//	name: the name to be changed
// return: the ID for name (name with spaces replaced with underscores)
// ---------------------------------
function getId(name) {
	return name.split(' ').join('_');
}

// getBaseId - gets the base ID for the given base
//	base_name: the item's base name
// return: the base ID (base with spaces, hyphens, and apostrophes removed)
// ---------------------------------
function getBaseId(base_name) {
	return base_name.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s");
}

// loadParams - load character details from URL parameters
// ---------------------------------
function loadParams() {
	//if (params.has('level') == true) {		// if level is a parameter, all parameters are checked
		// TODO: Shorten URL?
		//var params_string = params.toString();
		//params_string = params_string.split(",").join("%2C")
		//params_string = params_string.split("~").join("%C2%AD")
		//params = new URLSearchParams(params_string);
		checkShorturl()
		
		var spent_skillpoints = 0;
		var param_level = Math.floor(Math.max(1,Math.min(99,~~params.get('level'))));
		var param_diff = ~~params.get('difficulty');
		var param_quests = ~~params.get('quests');
		var param_run = ~~params.get('running');
		var param_str = Math.max(0,Math.min(505,~~params.get('strength')));
		var param_dex = Math.max(0,Math.min(505,~~params.get('dexterity')));
		var param_vit = Math.max(0,Math.min(505,~~params.get('vitality')));
		var param_ene = Math.max(0,Math.min(505,~~params.get('energy')));
		var param_url = ~~params.get('url');
		var param_coupling = 1;
		if (params.has('coupling') == true) { param_coupling = params.get('coupling') }
		var param_synthwep = 1;
		if (params.has('synthwep') == true) { param_synthwep = params.get('synthwep') }
		var param_autocast = 1;
		if (params.has('autocast') == true) { param_autocast = params.get('autocast') }
		var param_skills = '0000000000000000000000000000000000000000000000000000000000000000000000';
		if (params.has('skills') == true) { param_skills = params.get('skills') }
		var param_charms = [];
		if (params.has('charm') == true) { param_charms = params.getAll('charm') }
//		if (params.has('charm') == true) { param_charms = params.getAll('charm') }
		
		var param_effects = [];											// per effect: id,enabled,snapshot ...if snapshot=1: ,origin,index ...per affix: ,affix,value
		if (params.has('effect') == true) { param_effects = params.getAll('effect') }
		var param_mercenary = "none";									// name ...per merc group: ,itemname
		if (params.has('mercenary') == true) { param_mercenary = params.get('mercenary').split(',') }
		var param_irongolem = 'none';
		if (params.has('irongolem') == true) { param_irongolem = params.get('irongolem') }
		var param_selected = [" ­ ­ ­ ­ Skill 1"," ­ ­ ­ ­ Skill 2"];	// selectedSkill[0],selectedSkill[1]
		if (params.has('selected') == true) { param_selected = params.get('selected').split(',') }
		var param_equipped = 0;											// per group: name,tier,corruption ...per socketable space: ,socketablename
		if (params.has('helm') && params.has('armor') && params.has('gloves') && params.has('boots') && params.has('belt') && params.has('amulet') && params.has('ring1') && params.has('ring2') && params.has('weapon') && params.has('offhand')) {
			param_equipped = {}
			for (group in corruptsEquipped) { param_equipped[group] = params.get(group).split(',') }
		}
		for (e in param_effects) { param_effects[e] = param_effects[e].split(',') }
		
		if (param_quests != 1) { param_quests = 0 }
		if (param_run != 1) { param_run = 0 }
		if ((param_str+param_dex+param_vit+param_ene) > (5*param_level + 15*param_quests)) { param_str = 0; param_dex = 0; param_vit = 0; param_ene = 0; }
		
		character.level = param_level
		character.strength_added = param_str
		character.dexterity_added = param_dex
		character.vitality_added = param_vit
		character.energy_added = param_ene
		if (param_diff == 1 || param_diff == 2 || param_diff == 3) {
			document.getElementById("difficulty"+param_diff).checked = true
			changeDifficulty(param_diff)
		}
		if (param_run == 1) {
			document.getElementById("running").checked = true
			toggleRunning(param_run)
			character.running = 1
		}
		if (param_quests == 1) {
			document.getElementById("quests").checked = true
			character.quests_completed = param_quests
			character.life += 60
			character.fRes += 30
			character.cRes += 30
			character.lRes += 30
			character.pRes += 30
		}
		if (param_url == 1) {
			document.getElementById("parameters").checked = true
			toggleParameters(param_url)
			// are these needed?
			settings.parameters = 1
			params.set('url', ~~settings.parameters)
			window.history.replaceState({}, '', `${location.pathname}?${params}`)
		}
		for (let s = 0; s < skills.length; s++) {
			skills[s].level = ~~(param_skills[s*2]+param_skills[s*2+1])
			spent_skillpoints += skills[s].level
		}
		character.skillpoints = character.level-1 + Math.max(0,character.quests_completed*12) - spent_skillpoints
		character.statpoints = (character.level-1)*5 + Math.max(0,character.quests_completed*15) - character.strength_added - character.dexterity_added - character.vitality_added - character.energy_added
		character.strength = character.starting_strength + character.strength_added
		character.dexterity = character.starting_dexterity + character.dexterity_added
		character.vitality = character.starting_vitality + character.vitality_added
		character.energy = character.starting_energy + character.energy_added
		character.life += (character.levelup_life*(character.level-1))
		character.mana += (character.levelup_mana*(character.level-1))
		character.stamina += (character.levelup_stamina*(character.level-1))
		
		//if (game_version == 2) {	// these features are only available on the PoD version
			
			// setup equipment
			if (param_equipped != 0) {
				for (group in corruptsEquipped) { if (param_equipped[group][0] != "none") {	// equipment
					var options = document.getElementById("dropdown_"+group).options;
					for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == param_equipped[group][0]) {  document.getElementById("dropdown_"+group).selectedIndex = i } }
					equip(group,param_equipped[group][0])
				} }
				for (group in corruptsEquipped) { if (param_equipped[group][2] != "none") {	// corruptions
					var options = document.getElementById("corruptions_"+group).options;
					for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == param_equipped[group][2]) {  document.getElementById("corruptions_"+group).selectedIndex = i } }
					corrupt(group,param_equipped[group][2])
				} }
				for (group in corruptsEquipped) {	// upgrades & downgrades
					var baseDiff = ~~param_equipped[group][1] - ~~equipped[group].tier;
					if (baseDiff < 0) { changeBase(group, "downgrade"); equipmentOut() }
					if (baseDiff > 0) { changeBase(group, "upgrade"); equipmentOut() }
				}
				for (group in corruptsEquipped) {	// upgrades & downgrades (duplicated)
					var baseDiff = ~~param_equipped[group][1] - ~~equipped[group].tier;
					if (baseDiff < 0) { changeBase(group, "downgrade"); equipmentOut(); }
					if (baseDiff > 0) { changeBase(group, "upgrade"); equipmentOut(); }
				}
				for (group in socketed) { for (let i = 3; i < param_equipped[group].length; i++) { if (param_equipped[group][i] != "") { addSocketable(param_equipped[group][i]); inv[tempSetup].load = group; tempSetup = 0; } } }
				for (let s = 1; s < inv[0].in.length; s++) { if (inv[s].empty != 1) { inv[0].onpickup = inv[0].in[s]; handleSocket(null,inv[s].load,s); } }	// socketables get moved to equipment
			}
			
			// setup mercenary & iron golem
			if (param_mercenary != "none") {
				setMercenary(param_mercenary[0])
				var g = 1;
				for (group in mercEquipped) {
					if (param_mercenary[g] != 'none') {
						var options = document.getElementById("dropdown_merc_"+group).options;
						for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == param_mercenary[g]) {  document.getElementById("dropdown_merc_"+group).selectedIndex = i } }
						equipMerc(group,param_mercenary[g])
					}
					g += 1
				}
			}
			if (param_irongolem != "none") {
				var options = document.getElementById("dropdown_golem").options;
				for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == param_irongolem) { document.getElementById("dropdown_golem").selectedIndex = i } }
				setIronGolem(param_irongolem)
			}
			
			// setup effects
//			if (param_effects != []) {
			if (param_effects.length > 0) {
				for (e in param_effects) { for (let i = 1; i < non_items.length; i++) {		// shrine effects
					if (param_effects[e][0] == non_items[i].effect) { addEffect('misc',non_items[i].name,i,'') }
				} }
				for (e in param_effects) { if (param_effects[e][2] == 1) {	// snapshotted effects
					var active = 0;
					var new_effect = 0;
					if (typeof(effects[param_effects[e][0]]) != 'undefined') {
						if (param_effects[e][1] == 1) { active = 1; toggleEffect(param_effects[e][0]); }
					} else {	// add temporary levels
						new_effect = 1;
						if (param_effects[e][3] == "skill") { skills[param_effects[e][4]].level += 1 }
						if (param_effects[e][3] == "oskill") { character["oskill_"+param_effects[e][0]] += 1 }
						addEffect(param_effects[e][3],param_effects[e][0].split('_').join(' '),param_effects[e][4],"")	// addEffect() doesn't work with zero skill levels, so this implementation is 'hacky'
						if (param_effects[e][1] == 1) { active = 1; toggleEffect(param_effects[e][0]); }
					}
						effects[param_effects[e][0]].info.snapshot = 1;
						document.getElementById(param_effects[e][0]+"_ss").src = "./images/skills/snapshot.png";
						for (let a = 5; a < param_effects[e].length; a=a+2) {
							effects[param_effects[e][0]][param_effects[e][a]] = param_effects[e][a+1]
						}
						if (active == 1) { toggleEffect(param_effects[e][0]) }
						if (new_effect == 1) {	// remove temporary levels
							if (param_effects[e][3] == "skill") { skills[param_effects[e][4]].level -= 1 }
							if (param_effects[e][3] == "oskill") { character["oskill_"+param_effects[e][0]] -= 1 }
						}
				} }
				if (effects != {}) { for (effect in effects) { if (typeof(effects[effect].info.enabled) != 'undefined') { for (e in param_effects) { if (param_effects[e][0] == effect) { if (param_effects[e][1] != effects[effect].info.enabled) { toggleEffect(effect) } } } } } }
			}
			
			selectedSkill[0] = param_selected[0]
			selectedSkill[1] = param_selected[1]
		//}
		for (let i = 0; i < param_charms.length; i++) { addCharm(param_charms[i]) }
		if (param_coupling == 0) {
			document.getElementById("coupling").checked = false
			//toggleCoupling(param_coupling)	// TODO: fix toggleCoupling parameter to take a boolean rather than the UI element
			settings.coupling = param_coupling
		}
		if (param_autocast == 0) {
			document.getElementById("autocast").checked = false
			//toggleAutocast(param_autocast)	// TODO: fix toggleAutocast parameter to take a boolean rather than the UI element
			settings.autocast = param_autocast
		}
	console.log([...params.entries()]);
	//}
	updateSkills()
	updateAllEffects()
	updateURLDebounced()
}



//=========================================================================================================================
// DROPDOWN CHOICES ....
//=========================================================================================================================

/* Functions:
	corrupt
	equipMerc
	equip
	checkWield
	reloadOffhandCorruptions
	adjustCorruptionSockets
	addCharm
	addSocketable
*/
	
// corrupt - Sets a corruption outcome for an item
//	group: name of item's group
//	val: name of corruption
// ---------------------------------
function corrupt(group, val) {
	for (old_affix in corruptsEquipped[group]) {
		character[old_affix] -= corruptsEquipped[group][old_affix]
		corruptsEquipped[group][old_affix] = unequipped[old_affix]
	}
	if (val == "­ ­ ­ ­ Corruption" || val == "none" || val == group || equipped[group].ethereal > 0 || equipped[group].sockets > 0 || equipped[group].rarity == "rw" || equipped[group].rarity == "common" || (group == "offhand" && equipped[group].type != "quiver" && equipped.weapon.twoHanded == 1 && (equipped.weapon.type != "sword" || character.class_name != "Barbarian"))) { document.getElementById("corruptions_"+group).selectedIndex = 0 }
	else {
		for (outcome in corruptions[group]) {
			if (corruptions[group][outcome].name == val && (group != "offhand" || (offhandType == corruptions[group][outcome].base || offhandType == "none"))) {
				for (affix in corruptions[group][outcome]) {
					corruptsEquipped[group][affix] = corruptions[group][outcome][affix]
					if (affix != "name" && affix != "base") {
						character[affix] += corruptions[group][outcome][affix]
					}
				}
			}
		}
		if (val == "+ Sockets") { adjustCorruptionSockets(group) }
	}
	updateSocketTotals()
	update()
}

// equipMerc - Equips or unequips a mercenary item
//	group: name of item's group
//	val: name of item
// ---------------------------------
function equipMerc(group, val) {
	var auraName = "";
	var auraLevel = 0;
	for (old_affix in mercEquipped[group]) {
		if (old_affix == "aura" || old_affix == "aura_lvl" || old_affix == "name" || old_affix == "type" || old_affix == "base" || old_affix == "only" || old_affix == "not" || old_affix == "img") {
			if (old_affix == "aura") {
				removeEffect(mercEquipped[group][old_affix].split(' ').join('_')+"-mercenary_"+group)
			}
		} else {
			mercenary[old_affix] -= mercEquipped[group][old_affix]
		}
	}
	mercEquipped[group] = {name:"none"}
	if (group == val) { document.getElementById(("dropdown_merc_"+group)).selectedIndex = 0 }
	else {
		for (item in equipment[group]) {
			if (equipment[group][item].name == val) {
				// add affixes from base item
				if (typeof(equipment[group][item]["base"]) != 'undefined') {	// TODO: Combine with duplicate code from equip()
					var base = getBaseId(equipment[group][item].base);
					var multEth = 1;
					var multED = 1;
					var multReq = 1;
					var reqEth = 0;
					if (typeof(equipment[group][item]["ethereal"]) != 'undefined') { if (equipment[group][item]["ethereal"] == 1) { multEth = 1.5; reqEth = 10; } }
					if (typeof(equipment[group][item]["e_def"]) != 'undefined') { multED += (equipment[group][item]["e_def"]/100) }
					if (typeof(equipment[group][item]["req"]) != 'undefined') { multReq += (equipment[group][item]["req"]/100) }
					for (affix in bases[base]) {
						if (affix != "group" && affix != "type" && affix != "upgrade" && affix != "downgrade" && affix != "subtype" && affix != "only" && affix != "def_low" && affix != "def_high" && affix != "durability" && affix != "range" && affix != "twoHands") {
							if (typeof(mercEquipped[group][affix]) == 'undefined') { mercEquipped[group][affix] = unequipped[affix] }	// undefined (new) affixes get initialized to zero
							if (affix == "base_damage_min" || affix == "base_damage_max") {
								mercEquipped[group][affix] = Math.ceil(multEth*bases[base][affix])
								mercenary[affix] += Math.ceil(multEth*bases[base][affix])
							} else if (affix == "req_strength" || affix == "req_dexterity") {
								mercEquipped[group][affix] = Math.max(0,Math.ceil(multReq*bases[base][affix] - reqEth))
							} else {
								mercEquipped[group][affix] = bases[base][affix]
								mercenary[affix] += bases[base][affix]
							}
						}
					}
				}
				// add regular affixes
				for (affix in equipment[group][item]) {
					if (typeof(mercEquipped[group][affix]) == 'undefined') { mercEquipped[group][affix] = unequipped[affix] }
					if (affix == "damage_vs_undead") {
						mercEquipped[group][affix] += equipment[group][item][affix]
						mercenary[affix] += equipment[group][item][affix]
					} else if (affix == "name" || affix == "type" || affix == "base" || affix == "only" || affix == "not" || affix == "img" || affix == "rarity" || affix == "req" || affix == "ethereal" || affix == "indestructible" || affix == "autorepair" || affix == "autoreplenish" || affix == "stack_size" || affix == "set_bonuses" || affix == "pod_changes" || affix == "aura_lvl" || affix == "twoHanded" || affix == "sockets" || affix == "e_def" || affix == "ctc" || affix == "cskill" || affix == "aura" || affix == "req_strength" || affix == "req_dexterity") {
						if (affix == "req_strength" || affix == "req_dexterity") {
							if (equipment[group][item][affix] > mercEquipped[group][affix]) { mercEquipped[group][affix] = equipment[group][item][affix] }
						} else {
							mercEquipped[group][affix] = equipment[group][item][affix]
							if (affix == "aura") { auraName = equipment[group][item][affix]; auraLevel = equipment[group][item].aura_lvl; }
						}
					} else {
						if (affix == "sup" || affix == "e_damage") {
							if (typeof(mercEquipped[group]["e_damage"]) == 'undefined') { mercEquipped[group]["e_damage"] = unequipped["e_damage"] }
							if (affix == "sup") { mercEquipped[group][affix] = equipment[group][item][affix] }
							mercEquipped[group]["e_damage"] += equipment[group][item][affix]
							mercenary["e_damage"] += equipment[group][item][affix]
						} else {
							mercEquipped[group][affix] = equipment[group][item][affix]
							mercenary[affix] += equipment[group][item][affix]
						}
					}
				}
				// TODO: implement set bonuses for mercenaries
			}
		}
		updateMercenary()
	}
	if (auraName != "" && auraLevel != 0) {
		addEffect("aura",auraName,auraLevel,"mercenary_"+group)
	}
	updateStats()
	updateAllEffects()
}

// equip - Equips an item by adding its stats to the character, or unequips it if it's already equipped
//	group: equipment group
//	val: name of item
// ---------------------------------
function equip(group, val) {
	// TODO: consider renaming... switchItem()?  Also, split into multiple smaller functions
	var auraName = "";
	var auraLevel = 0;
	var cskillName = ["","",""];
	var cskillLevel = [0,0,0];
	var ctcskillName = ["","","",""];
	var ctcskillLevel = [0,0,0,0];
	var old_set_bonuses = "";
	var old_set = "";
	var old_set_before = 0;
	var old_set_after = 0;
	var set_bonuses = "";
	var set = "";
	var set_before = 0;
	var set_after = 0;
	
	// check if item was imported from a different category (offhand weapons)
	var src_group = group;
	var found = 0;
	if (group == "offhand") { for (item in equipment[group]) { if (equipment[group][item].name == val) { found = 1 } } }
	if (found == 0 && group == "offhand") { src_group = "weapon" }
	if (group == "weapon") {applyCustomED('weapon')}
	var itemType = "";
	var twoHanded = 0;
	for (item in equipment[src_group]) { if (equipment[src_group][item].name == val) { twoHanded = ~~equipment[src_group][item].twoHanded; if (typeof(equipment[src_group][item].type) != 'undefined') { itemType = equipment[src_group][item].type } } }
	
	for (old_affix in equipped[group]) { if (old_affix == "set_bonuses") { old_set_bonuses = equipped[group].set_bonuses } }
	for (item in equipment[src_group]) { if (equipment[src_group][item].name == val) { if (typeof(equipment[src_group][item].set_bonuses) != 'undefined') { set_bonuses = equipment[src_group][item].set_bonuses } } }
	if (set_bonuses != "") { set = set_bonuses[0]; set_before = character[set]; }
	if (old_set_bonuses != "") { old_set = old_set_bonuses[0]; old_set_before = character[old_set]; }
	 
	// if replacing an item, previous item's affixes are removed from character
	for (old_affix in equipped[group]) {
		if (typeof(character[old_affix]) != 'undefined') { character[old_affix] -= equipped[group][old_affix] }
		if (old_affix == "aura") { removeEffect(equipped[group][old_affix].split(' ').join('_')+"-"+group) }
		if (old_affix == "cskill") {
			for (let i = 0; i < equipped[group].cskill.length; i++) {
				var cskill_name = equipped[group].cskill[i][1];
				for (cskill in effect_cskills) { if (cskill.split('_').join(' ') == cskill_name) { removeEffect(cskill+"-"+group) } }
			}
		}
		if (old_affix == "ctc") {
			for (let i = 0; i < equipped[group].ctc.length; i++) {
				var ctcskill_name = equipped[group].ctc[i][2];
				for (ctcskill in effect_ctcskills) { if (ctcskill.split('_').join(' ') == ctcskill_name) { removeEffect(ctcskill+"-"+group) } }
			}
		}
		if (old_affix != "set_bonuses") { equipped[group][old_affix] = unequipped[old_affix] }
	}
	// remove set bonuses from previous item
	if (old_set_bonuses != "") {
		old_set_after = character[old_set];
		if (old_set_before > old_set_after) {
			var before = Math.round(old_set_before,0)
			var after = Math.round(old_set_after,0)
			// remove set bonuses for old item
			for (let i = 1; i <= before; i++) {
				for (affix in equipped[group]["set_bonuses"][i]) {
					character[affix] -= equipped[group]["set_bonuses"][i][affix]
				}
			}
			equipped[group]["set_bonuses"][1] = 0	// save "state" for invalid/outdated set info
			if (before > after) {
				// remove old set bonus for other equipped items in the set (only if the removed set item wasn't a duplicate of another set item, i.e. ring)
				for (set_group in equipped) {
					if (set_group != group && equipped[set_group]["set_bonuses"] != null) {
						if (equipped[set_group]["set_bonuses"][0] == old_set && equipped[set_group]["set_bonuses"][1] == 1) {	// same set as removed item & set info is valid
							for (affix in equipped[set_group]["set_bonuses"][before]) {
								character[affix] -= equipped[set_group]["set_bonuses"][before][affix]
							}
						}
					}
				}
				// remove shared set bonuses
				for (affix in sets[old_set][before]) {
					if (character.class_name == "Sorceress" && (affix == "oskill_Fire_Ball" || affix == "oskill_Fire_Wall" || affix == "oskill_Meteor")) {
						character[affix] -= 3
					} else {
						character[affix] -= sets[old_set][before][affix]
					}
				}
			}
		}
	}
	// reset item object, to preserve normal affix order
	equipped[group] = {name:"none",tier:0}
//	if (group == "weapon" || group == "offhand") { equipped[group].type = ""}
//	if (group == "weapon") { equipped[group].twoHanded = 0 ;applyCustomED('weapon');}	// this line may be unnecessary
	if (group == "weapon") { equipped[group].twoHanded = 0 ;}	// this line may be unnecessary
	// add affixes to character
	for (item in equipment[src_group]) {
		if (equipment[src_group][item].name == val) {
		
			// add affixes from base item
			if (typeof(equipment[src_group][item]["base"]) != 'undefined') {
				var base = getBaseId(equipment[src_group][item].base);
				var multEth = 1;
				var multED = 1;
				var multReq = 1;
				var reqEth = 0;
				if (typeof(equipment[src_group][item]["ethereal"]) != 'undefined') { if (equipment[src_group][item]["ethereal"] == 1) { multEth = 1.5; reqEth = 10; } }
				if (typeof(equipment[src_group][item]["e_def"]) != 'undefined') { multED += (equipment[src_group][item]["e_def"]/100) }
				if (typeof(equipment[src_group][item]["req"]) != 'undefined') { multReq += (equipment[src_group][item]["req"]/100) }
				if (typeof(bases[base]) != 'undefined') { for (affix in bases[base]) {
					if (affix != "group" && affix != "type" && affix != "upgrade" && affix != "downgrade" && affix != "subtype" && affix != "only" && affix != "def_low" && affix != "def_high" && affix != "durability" && affix != "range" && affix != "twoHands" && affix != "nonmetal") {	// test: twoHands still unused elsewhere? okay here?
						if (typeof(equipped[group][affix]) == 'undefined') { equipped[group][affix] = unequipped[affix] }	// undefined (new) affixes get initialized to zero
						if (affix == "base_damage_min" || affix == "base_damage_max" || affix == "throw_min" || affix == "throw_max" || affix == "base_min_alternate" || affix == "base_max_alternate") {
							equipped[group][affix] = Math.ceil(multEth*bases[base][affix])
							character[affix] += Math.ceil(multEth*bases[base][affix])
						} else if (affix == "req_strength" || affix == "req_dexterity") {
//							if (equipment[src_group][item]["req"] != 'undefined')
//								{equipped[group][affix] = Math.max(0,Math.ceil((multReq*bases[base][affix] - reqEth) += (equipment[src_group][item]["req"]/100)))}
//							else {equipped[group][affix] = Math.max(0,Math.ceil(multReq*bases[base][affix] - reqEth))}
							equipped[group][affix] = Math.max(0,Math.ceil(multReq*bases[base][affix] - reqEth))
						} else if (affix == "tier") {
							equipped[group][affix] = bases[base][affix]
							equipped[group]["original_tier"] = bases[base][affix]
						} else {
							equipped[group][affix] = bases[base][affix]
							character[affix] += bases[base][affix]
						}
					}
				} }
			}
			// add regular affixes
			for (affix in equipment[src_group][item]) {
				if (typeof(equipped[group][affix]) == 'undefined') { equipped[group][affix] = unequipped[affix] }	// initialize undefined affixes
				if (affix == "damage_vs_undead") {									// damage_vs_undead is the only additive affix included in both bases[] (automods) and equipment[] (regular affixes)
					equipped[group][affix] += equipment[src_group][item][affix]
					character[affix] += equipment[src_group][item][affix]
				} else if (affix == "name" || affix == "type" || affix == "base" || affix == "only" || affix == "not" || affix == "img" || affix == "rarity" || affix == "req" || affix == "ethereal" || affix == "indestructible" || affix == "autorepair" || affix == "autoreplenish" || affix == "stack_size" || affix == "set_bonuses" || affix == "pod_changes" || affix == "twoHanded" || affix == "sockets" || affix == "e_def" || affix == "ctc" || affix == "cskill" || affix == "aura" || affix == "aura_lvl" || affix == "req_strength" || affix == "req_dexterity") {	// no need to add these as character affixes
					equipped[group][affix] = equipment[src_group][item][affix]
					if (affix == "req_strength" || affix == "req_dexterity") {
						if (equipment[src_group][item][affix] > equipped[group][affix]) { equipped[group][affix] = equipment[src_group][item][affix] }	// these affixes aren't additive (only the largest matters)
//						if ((equipment[src_group][item]["req"]) != 'undefined') { equipped[group][affix] += (equipment[src_group][item]["req"]/100) }
//						if ((equipment[src_group][item]["req"]) != 'undefined') {equipped[group][affix] -= (equipment[src_group][item]["req"]/100)  }


//						if (equipment[src_group][item][affix] > equipped[group][affix]) { equipped[group][affix] = equipment[src_group][item][affix] }	// these affixes aren't additive (only the largest matters)
					} else {
						equipped[group][affix] = equipment[src_group][item][affix]
						if (affix == "aura") { auraName = equipment[src_group][item][affix]; auraLevel = equipment[src_group][item].aura_lvl; }
						if (affix == "cskill") {
							for (let i = 0; i < equipped[group].cskill.length; i++) {
								var cskill_level = equipped[group].cskill[i][0];
								var cskill_name = equipped[group].cskill[i][1];
								for (cskill in effect_cskills) { if (cskill.split('_').join(' ') == cskill_name) { cskillName[i] = cskill_name; cskillLevel[i] = cskill_level; } }
							}
						}
						if (affix == "ctc") {
							for (let i = 0; i < equipped[group].ctc.length; i++) {
								var ctcskill_level = equipped[group].ctc[i][1];
								var ctcskill_name = equipped[group].ctc[i][2];
								for (ctcskill in effect_ctcskills) { if (ctcskill.split('_').join(' ') == ctcskill_name) { ctcskillName[i] = ctcskill_name; ctcskillLevel[i] = ctcskill_level; } }
							}
						}
					}
				} else {
					if ((affix == "sup" || affix == "e_damage") && src_group == "weapon") {
//						applyCustomED('weapon');
						if (typeof(equipped[group]["e_damage"]) == 'undefined') { equipped[group]["e_damage"] = unequipped["e_damage"]; character.e_damage = unequipped["e_damage"];}
						if (affix == "sup") { equipped[group][affix] = equipment[src_group][item][affix] }
//						applyCustomED('weapon');
						equipped[group]["e_damage"] += equipment[src_group][item][affix]
						character["e_damage"] += equipment[src_group][item][affix]
//						applyCustomED('weapon');
					} else {
						// TODO: implement "sup" for e_defense
						equipped[group][affix] = equipment[src_group][item][affix]
						var oskill_info = "";
						for (let o = 0; o < oskills.length; o++) { if (affix == oskills[o]) { oskill_info = oskills_info[oskills[o]] } }
						if (oskill_info != "") {
							if (oskill_info.native_class == character.class_name.toLowerCase()) { if (equipment[src_group][item][affix] > 3) { equipped[group][affix] -= (equipment[src_group][item][affix]-3) } }	// oskills are capped at 3 for 'native' classes
							character[affix] += equipped[group][affix]
						} else {
							character[affix] += equipment[src_group][item][affix]
						}
					}
				}
			}
		}
	}
	// add set bonuses
	if (set_bonuses != "") {
		set_after = character[set];
		if (set_before < set_after) {
			var before = Math.round(set_before,0)
			var after = Math.round(set_after,0)
			// add set bonuses for new item
			for (let i = 1; i <= after; i++) {
				for (affix in set_bonuses[i]) {
					character[affix] += set_bonuses[i][affix]
				}
			}
			equipped[group]["set_bonuses"][1] = 1	// valid set info
			if (before < after) {
				// add new set bonus for other equipped items in the set
				for (set_group in equipped) {
					if (set_group != group && equipped[set_group]["set_bonuses"] != null) {
						if (equipped[set_group]["set_bonuses"][0] == set && equipped[set_group]["set_bonuses"][1] == 1) {
							for (affix in equipped[set_group]["set_bonuses"][after]) {
								character[affix] += equipped[set_group]["set_bonuses"][after][affix]
							}
						}
					}
				}
				// add shared set bonuses
				for (affix in sets[set][after]) {
					if (character.class_name == "Sorceress" && (affix == "oskill_Fire_Ball" || affix == "oskill_Fire_Wall" || affix == "oskill_Meteor")) {
						character[affix] += 3
					} else {
						character[affix] += sets[set][after][affix]
					}
				}
			}
		}
	}
	// prevent incompatible weapon/offhand combinations
	if (equipped.weapon.name != "none" && equipped.offhand.name != "none") {
		if (group == "offhand") {
			if (itemType == "quiver" && equipped.weapon.type != "bow" && equipped.weapon.type != "crossbow") { equip('weapon', 'none') }
			else if (itemType != "quiver" && equipped.weapon.twoHanded == 1 && (equipped.weapon.type != "sword" || character.class_name != "Barbarian")) { equip('weapon', 'none') }
			else if (itemType == "claw" && equipped.weapon.type != "claw") { equip('weapon', 'none') }
		} else if (group == "weapon") {
			if (equipped.offhand.type == "quiver" && itemType != "bow" && itemType != "crossbow") { equip('offhand', 'none') }
			else if (equipped.offhand.type != "quiver" && twoHanded == 1 && (itemType != "sword" || character.class_name != "Barbarian")) { equip('offhand', 'none'); }
			else if (itemType != "claw" && equipped.offhand.type == "claw") { equip('offhand', 'none') }
		}
	}
	// adjust damage for 2-handed swords if wielded differently
	if (character.class_name == "Barbarian") {
		if (equipped.weapon.name != "none" && equipped.offhand.name != "none") {
			if (equipped.weapon.type == "sword" && equipped.weapon.twoHanded == 1) { checkWield("weapon", 1) }
			if (equipped.offhand.type == "sword" && equipped.offhand.twoHanded == 1) { checkWield("offhand", 1) }
		} else {
			if (equipped.weapon.type == "sword" && equipped.weapon.twoHanded == 1) { checkWield("weapon", 2) }
			if (equipped.offhand.type == "sword" && equipped.offhand.twoHanded == 1) { checkWield("offhand", 2) }
		}
	}
	// remove incompatible corruptions
	if (equipped[group].ethereal > 0 || equipped[group].sockets > 0 || equipped[group].rarity == "rw" || equipped[group].rarity == "common" || (group == "offhand" && (equipped[group].type == "shield" || equipped[group].type == "quiver") && equipped[group].type != corruptsEquipped[group].base)) { corrupt(group, group) }
	if (corruptsEquipped[group].name == "+ Sockets") { adjustCorruptionSockets(group) }
	if (group == "offhand") {
		// reload corruption options when the selected type changes
		if (equipped[group].type == "shield") { if (offhandType == "quiver" || offhandType == "weapon") { offhandType = "shield"; reloadOffhandCorruptions("shield"); } }
		else if (equipped[group].type == "quiver") { if (offhandType != "quiver") { offhandType = "quiver"; reloadOffhandCorruptions("quiver"); } }
		else if (equipped[group].name != "none") { if (offhandType != "weapon") { offhandType = "weapon"; reloadOffhandCorruptions("weapon"); } }
		else { if (offhandType == "quiver" || offhandType == "weapon") { offhandType = "none"; reloadOffhandCorruptions("shield"); } }
		if (equipped[group].type == "shield") { offhandType = "shield" } else if (equipped[group].name == "none") { offhandType = "none" }
	}
	else if (group == "weapon") {
//		applyCustomED('weapon');
		if (equipped.offhand.type != "quiver" && twoHanded == 1 && (itemType != "sword" || character.class_name != "Barbarian") && corruptsEquipped.offhand.name != "none") { reloadOffhandCorruptions("shield"); }
	}
	if (val == group || val == "none") { document.getElementById(("dropdown_"+group)).selectedIndex = 0; }
	// set inventory image
	if (equipped[group].name != "none") {
		var src = "";
		var base = "";
		if (typeof(equipped[group].img) != 'undefined') { src = equipped[group].img }
		if (typeof(equipped[group].base) != 'undefined') { base = equipped[group].base }
		document.getElementById(group+"_image").src = getItemImage(group,base,src)
	} else {
		var img = "./images/items/none.png"
		if (group == "helm" || group == "armor" || group == "boots" || group == "belt" || group == "weapon" || group == "offhand") { img = "./images/items/blank_"+group+".png" }
		document.getElementById(group+"_image").src = img
		document.getElementById("tooltip_inventory").style.display = "none"
	}
	
	if (auraName != "" && auraLevel != 0) {		// TODO: Why does this break things if called earlier? (item image wasn't appearing)
		addEffect("aura",auraName,auraLevel,group)
	}
	for (let i = 0; i < cskillName.length; i++) {
		if (cskillName[i] != "" && cskillLevel[i] != 0) {
			addEffect("cskill",cskillName[i],cskillLevel[i],group)
		}
	}
	for (let i = 0; i < ctcskillName.length; i++) {
		if (ctcskillName[i] != "" && ctcskillLevel[i] != 0) {
			addEffect("ctcskill",ctcskillName[i],ctcskillLevel[i],group)
		}
	}
//	applyCustomED('weapon');
//	if (equipped.weapon.name == "none") {equip(group, "none");}
	document.getElementById("slotSelect").value = group;
	updateSelectedItemSummary(group)

	update()
	updateAllEffects()
}

// checkWield - Adjust base damage for two-handed swords (dependent on whether wielded with 1 or 2 hands)
//	group: item's group (weapon or offhand)
//	hands_used: number of hands used to wield the weapon
// ---------------------------------
function checkWield(group, hands_used) {
		var base_min = equipped[group].base_damage_min;
		var base_max = equipped[group].base_damage_max;
		var min_alt = equipped[group].base_min_alternate;
		var max_alt = equipped[group].base_max_alternate;
		var swap = 0;
		if (hands_used == 2) { if (base_min < min_alt) { swap = 1 } }
		else { if (base_min > min_alt) { swap = 1 } }
		if (swap == 1) {
			character.base_damage_min -= base_min
			character.base_damage_max -= base_max
			equipped[group].base_damage_min = min_alt
			equipped[group].base_damage_max = max_alt
			equipped[group].base_min_alternate = base_min
			equipped[group].base_max_alternate = base_max
			character.base_damage_min += min_alt
			character.base_damage_max += max_alt
		}
}

// reloadOffhandCorruptions - reloads corruption dropdown options for offhands (when the selected item changes types)
//	kind: the group/type of the selected item
// ---------------------------------
function reloadOffhandCorruptions(kind) {
	// trash socketed items first
	for (affix in socketed.offhand.totals) { character[affix] -= socketed.offhand.totals[affix] }
	socketed.offhand.totals = {}
	for (let i = 0; i < socketed.offhand.items.length; i++) { socketed.offhand.items[i] = {id:socketed.offhand.items[i].id,name:socketed.offhand.items[i].name} }
	
	corrupt("offhand", "offhand")
	var choices = "<option>­ ­ ­ ­ Corruption</option>";
	for (let m = 1; m < corruptions["offhand"].length; m++) {
		if (corruptions["offhand"][m].base == kind) {
			choices += "<option>" + corruptions["offhand"][m].name + "</option>"
		}
	}
	document.getElementById("corruptions_offhand").innerHTML = choices
	document.getElementById("corruptions_offhand").selectedIndex = 0
}

// adjustCorruptionSockets - Adjusts the sockets granted by corruptions
//	group: item group (helm, armor, weapon, offhand)
// ---------------------------------
function adjustCorruptionSockets(group) {
	var max = 0;
	if (equipped[group].max_sockets > 0 && corruptsEquipped[group].name != group) {
		max = ~~equipped[group].max_sockets;
		if (equipped[group].ethereal > 0 || equipped[group].sockets > 0 || equipped[group].rarity == "rw" || equipped[group].rarity == "common" || equipped[group].type == "quiver") { max = 0 }
		if (max != corruptsEquipped[group].sockets) {
			character.sockets -= corruptsEquipped[group].sockets
			corruptsEquipped[group].sockets = max
			character.sockets += max
		}
	}
	if (max == 0 && equipped[group].name != "none" && corruptsEquipped[group].name == "+ Sockets") { corrupt(group, group) }
	updateStats()
}

// addCharm - Adds a charm to the inventory
//	val: the name of the charm
// ---------------------------------
function addCharm(val) {
	var charm_img = {prefix:"./images/items/charms/", small:["charm1_paw.png","charm1_disc.png","charm1_coin.png"], large:["charm2_page.png","charm2_horn.png","charm2_lantern.png"], grand:["charm3_lace.png","charm3_eye.png","charm3_monster.png"]};
	var charmImage = charm_img.prefix+"debug_plus.png";
	var charmHeight = "";
	var charmWidth = "29";
	var size = "";
	var charm_y = 1;
	var nameVal = val;
	var charmItem = "";
	for (item in equipment["charms"]) {
		if (equipment["charms"][item].name == val) {
			charmItem = equipment["charms"][item]
			size = charmItem.size
		}
	}
	var autoCast = settings.autocast;
	var r = Math.floor((Math.random() * 3));
	if (size == "grand") { charmHeight = "88"; charmImage = charm_img.prefix+charm_img.grand[r]; charm_y = 3; }
	else if (size == "large") { charmHeight = "59"; charmImage = charm_img.prefix+charm_img.large[r]; charm_y = 2; }
	else if (size == "small") { charmHeight = "29"; charmImage = charm_img.prefix+charm_img.small[r]; charm_y = 1; }
	if (typeof(charmItem.debug) != 'undefined') {
//		if (val == "+20 skills") { charmHeight = "29"; charmImage = charm_img.prefix+"debug_II.png"; charm_y = 1; }
//		else if (val == "+1 skill") { charmHeight = "29"; charmImage = charm_img.prefix+"debug_D.png"; charm_y = 1; }
//		else if (val == "+1 (each) skill") { charmHeight = "29"; charmImage = charm_img.prefix+"debug_P.png"; charm_y = 1;
		if (val == "+20 skills") { charmHeight = "29"; charmImage = charm_img.prefix+"debug_skull.png"; charm_y = 1; }
		else if (val == "+1 skill") { charmHeight = "29"; charmImage = charm_img.prefix+"debug_skull.png"; charm_y = 1; }
		else if (val == "+1 (each) skill") { charmHeight = "29"; charmImage = charm_img.prefix+"debug_skull.png"; charm_y = 1;
			if (autoCast == 1) { toggleAutocast("autocast"); document.getElementById("autocast").checked = 0; }
		}
		else if (val == "everything") { charmHeight = "29"; charmImage = charm_img.prefix+"debug_face.png"; charm_y = 1; }
		else { charmHeight = "29"; charmImage = charm_img.prefix+"debug_skull.png"; charm_y = 1; }
	}
	
	var allow = 1;
	for (let c = 1; c <= inv[0].in.length; c++) {
		if (inv[0].in[c] == val) {
			if (val == "Annihilus" || val == "Hellfire Torch" || val == "Gheed's Fortune") { allow = 0 } }
	}
	if (allow == 1) {
		if (val != "Annihilus" && val != "Hellfire Torch" && val != "Gheed's Fortune") {
			var append = "" + Math.floor((Math.random() * 999999) + 1);	// generate "unique" ID for charm
			val = val + "_" + append
		}
		if (nameVal == "Annihilus") { charmImage = charm_img.prefix+"charm1u.png"; }
		if (nameVal == "Hellfire Torch") { charmImage = charm_img.prefix+"charm2u.png"; }
		if (nameVal == "Gheed's Fortune") { charmImage = charm_img.prefix+"charm3u.png"; }
		if (nameVal == "Horadric Sigil") { charmImage = charm_img.prefix+"charm3s.png"; }
		var charmHTML = '<img style="width: ' + charmWidth + '; height: ' + charmHeight + '; pointer-events: auto;" id="' + val + '" src="' + charmImage + '" draggable="true" ondragstart="drag(event)" width="' + charmWidth + '" height="' + charmHeight + '" oncontextmenu="trash(event)" onmouseover="itemHover(event, this.value)" onmouseout="itemOut()" onclick="itemSelect(event)">';
		var insertion = "";
		var space_found = 0;
		var empty = 1;
		var i = 0;
		for (let x = 1; x <= 10; x++) {
			for (let y = 0; y < 4; y++) {
				i = y*10 + x
				empty = 1
				if (space_found == 0 && charm_y + (y+1) <= 5) {
					if (inv[i].empty == 0) { empty = 0 }
					if (charm_y > 1 && inv[i+10].empty == 0) { empty = 0 }
					if (charm_y > 2 && inv[i+20].empty == 0) { empty = 0 }
				} else { empty = 0 }
				if (empty == 1) { space_found = i }
			}
		}
		if (space_found > 0) {
			var i = space_found;
			insertion = inv[i].id;
			inv[i].empty = 0
			inv[0].in[i] = val
			if (charm_y > 1) { inv[i+10].empty = 0; inv[0].in[i+10] = val; }
			if (charm_y > 2) { inv[i+20].empty = 0; inv[0].in[i+20] = val; }
			document.getElementById(insertion).innerHTML += charmHTML;
			var ch = "charms";
			equipped[ch][val] = {}
			for (item in equipment[ch]) {
				if (equipment[ch][item].name == nameVal) {
					for (affix in equipment[ch][item]) {
						equipped[ch][val][affix] = equipment[ch][item][affix]
						if (affix != "name" && affix != "only" && affix != "rarity" && affix != "size" && affix != "pod_changes" && affix != "req_level") {
							character[affix] += equipment[ch][item][affix]
						}
					}
				}
			}
		}
	}
	document.getElementById("dropdown_charms").selectedIndex = 0
	// update
//	calculateSkillAmounts()
//	updateStats()
//	updateSkills()
//	if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
//	if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
	updateAllEffects()
	if (settings.autocast != autoCast) { toggleAutocast("autocast"); settings.autocast = 1; document.getElementById("autocast").checked = 1; }
}

// addSocketable - Adds a jewel, rune, or gem to the inventory
//	val: the name of the socketable item
// ---------------------------------
function addSocketable(val) {
	// TODO: Reduce duplicated code from addCharm()?
	var prefix = "./images/items/socketables/";
	var jewels = ["Jewel_blue.png","Jewel_green.png","Jewel_peach.png","Jewel_purple.png","Jewel_red.png","Jewel_white.png",];
	var itemImage = "";
	var nameVal = val;
	var item = "";
	for (sock in socketables) { if (socketables[sock].name == val) { item = socketables[sock] } }
	var r = Math.floor((Math.random() * 6));
	if (item.type == "jewel") { itemImage = prefix + "jewel/" + jewels[r] }
	else if (item.type == "rune" || item.type == "gem") { itemImage = prefix + item.type+"/" + item.name.split(' ').join('_') + ".png" }
	else if (item.type == "other") { itemImage = prefix + item.name+".png" }
	else { itemImage = prefix + "debug_plus.png" }
	
	var append = "_" + Math.floor((Math.random() * 999999) + 1);	// generate "unique" ID for item
	val = val + append
	
	var socketable = 'socketable';
	var itemHTML = '<img style="width: 28; height: 28; pointer-events: auto; z-index:5;" id="' + val + '" src="' + itemImage + '" draggable="true" ondragstart="dragSocketable(event)" width="28" height="28" oncontextmenu="trashSocketable(event,this.id,0)" onmouseover="itemHover(event, this.value)" onmouseout="itemOut()" onclick="socketableSelect(event)">';
	var insertion = "";
	var space_found = 0;
	var empty = 1;
	var i = 0;
	for (let x = 1; x <= 10; x++) {
		for (let y = 0; y < 4; y++) {
			i = y*10 + x
			empty = 1
			if (space_found == 0 && 1 + (y+1) <= 5) {
				if (inv[i].empty == 0) { empty = 0 }
			} else { empty = 0 }
			if (empty == 1) { space_found = i }
		}
	}
	if (space_found > 0) {
		var i = space_found;
		insertion = inv[i].id;
		inv[i].empty = 0
		inv[0].in[i] = val
		tempSetup = i
		document.getElementById(insertion).innerHTML += itemHTML;
	}
	document.getElementById("dropdown_socketables").selectedIndex = 0
	
	return val;	// currently UNUSED
}



//=========================================================================================================================
// DROPDOWN SETUP ....
//=========================================================================================================================

/* Functions:
	loadEquipment
	loadItems
	loadMisc
	loadSocketables
	loadCorruptions
	loadGolem
	loadMerc
	setMercenary
	updateMercenary
	getMercenaryAuraLevel
*/

// loadEquipment - Loads equipment/charm info to the appropriate dropdowns
//	className: name of character class
// ---------------------------------
function loadEquipment(className) {
	var equipmentGroups = ["helm", "armor", "gloves", "boots", "belt", "amulet", "ring1", "ring2", "weapon", "offhand", "charms"];
	var equipmentDropdowns = ["dropdown_helm", "dropdown_armor", "dropdown_gloves", "dropdown_boots", "dropdown_belt", "dropdown_amulet", "dropdown_ring1", "dropdown_ring2", "dropdown_weapon", "dropdown_offhand", "dropdown_charms"]
	for (let i = 0; i < equipmentGroups.length; i++) { loadItems(equipmentGroups[i], equipmentDropdowns[i], className) }
	loadMisc()
	loadMerc()
	loadCorruptions()
	loadSocketables()
	loadGolem()
}

// loadItems - Creates a dropdown menu option
//	group: equipment's group
//	dropdown: name of the dropdown to edit
//	className: name of the character class
// ---------------------------------
function loadItems(group, dropdown, className) {
	var showsynth = ""
	if (document.getElementById("synthwep").checked) {showsynth = "yes"}
	if (synthwep == 1) {showsynth = "yes"}
//	else {showsynth = "no"}
	if (group.length == 0) { document.getElementById(dropdown).innerHTML = "<option></option>" }
	else {
		var choices = "";
		var choices_offhand = "";
//			if(synthwep != 0)
//		{
//			equipment["weapon"] =+ '{debug:1, name:"Testeroo",req_level:71, e_damage:220, pierce:33, life_leech:18, owounds:33, slows_target:25, twoHanded:1, type:"crossbow", base:"Demon Crossbow", img:"Gut_Siphon"},'
//		}
		for (itemNew in equipment[group]) {
			var item = equipment[group][itemNew];
			if (typeof(item.only) == 'undefined' || item.only == className) {
				var halt = 0;
				if (className == "clear") { halt = 1 }
//				if (item.synth == "true" && showsynth != "yes") { halt = 1 }
//				if (toggleSynthwep() == 0 && settings.synthwep == "0") { halt = 1 }
//				if (document.getElementById("synthwep").checked = false && item.synth == "true") { halt = 1 }
//				else if (synthwep.checked = "true" && item.synth == "true") { halt = 1 }
//				if (showsynth = "no" && item.synth == "true" ) { halt = 1 }
//				if (item.synth == "true" && showsynth != "yes") { halt = 1 }
//				else if (settings.synthwep == "1" && item.synth == "true") { halt = 0 }
				if (typeof(item.not) != 'undefined') { for (let l = 0; l < item.not.length; l++) { if (item.not[l] == className) { halt = 1 } } }
				if (className == "Rogue Scout") { if (group == "offhand" || (group == "weapon" && item.type != "bow" && item.type != "crossbow" && item.name != "Weapon")) { halt = 1 } }
				if (className == "Desert Guard") { if (group == "offhand" || (group == "weapon" && item.type != "polearm" && item.type != "spear" && item.name != "Weapon")) { halt = 1 } }
				if (className == "Iron Wolf") { if ((group == "offhand" && item.type != "shield" && item.name != "Offhand") || (group == "weapon" && (item.type != "sword" || typeof(item.twoHanded) != 'undefined') && item.name != "Weapon")) { halt = 1 } }
				if (className == "Barb (merc)") { if (group == "offhand" || (group == "weapon" && item.type != "sword" && item.name != "Weapon")) { halt = 1 } }
				if (item.synth == "true" && showsynth != "yes") { halt = 1 }
//				if (showsynth != 1 && item.synth == "true" ) { halt = 1 }
				if (halt == 0) {
					var addon = "";
					if (choices == "") {
//						if (item.synth == "true") { addon = "" }
//						if (settings.synthwep == "0" && item.synth == "true") { halt = 1 }
//						if (showsynth = "no" && item.synth == "true" ) { halt = 1 }
//						if (item.synth == "true") { addon = "<option class='dropdown-unique'>" + item.name + "</option>" }
						if (item.synth == "true") { addon = "<option class='dropdown-unique'>" + item.name + "</option>" }

						if (group != "charms") { addon = "<option selected>" + "­ ­ ­ ­ " + item.name + "</option>" }
						else { addon = "<option disabled selected>" + "­ ­ ­ ­ " + item.name + "</option>" }
					} else {
						if (game_version == 2) {	// PoD item loading
							if (typeof(item.pd2) != 'undefined') { addon = "" }
							else if (typeof(item.debug) != 'undefined') { addon = "<option class='dropdown-debug'>" + item.name + "</option>" }
							else if (typeof(item.rarity) != 'undefined') { addon = "<option class='dropdown-"+item.rarity+"'>" + item.name + "</option>" }
//							else if (settings.synthwep == "1" && item.synth_wep == "true") { addon = "" }
							else { addon = "<option class='dropdown-unique'>" + item.name + "</option>" }
						} else {
							if (typeof(item.pod) != 'undefined') { addon = "" }
							else {
								if (game_version == 1 && typeof(item.pd2) != 'undefined') {
									addon = ""
								} else {
									if (typeof(item.debug) != 'undefined') { addon = "<option class='dropdown-debug'>" + item.name + "</option>" }
									else if (typeof(item.rarity) != 'undefined') { addon = "<option class='dropdown-"+item.rarity+"'>" + item.name + "</option>" }
									else { addon = "<option class='dropdown-unique'>" + item.name + "</option>" }
								}
							}
						}
					}
//					if (synthwep != 0 && item.synth_wep == "1") { addon = "<option class='dropdown-debug'>" + item.name + "</option>" }
					choices += addon
					if (className == "assassin" && item.name == "Offhand") { choices += offhandSetup }	// weapons inserted into offhand dropdown list
					if (className == "assassin" && item.type == "claw") { choices_offhand += addon }
					if (className == "barbarian" && item.name != "Weapon" && (typeof(item.twoHanded) == 'undefined' || item.twoHanded != 1 || item.type == "sword")) { choices_offhand += addon }
				}
			}
//			if (showsynth = "no" && item.synth == "true" ) { halt = 1 }

		}
		if (group == "weapon") { offhandSetup = choices_offhand }
		if (className == "barbarian" && group == "offhand") { choices += offhandSetup }	// weapons inserted into offhand dropdown list
		document.getElementById(dropdown).innerHTML = choices
	}
}


// loadMisc - Loads non-item effects to the 'Miscellaneous' dropdown menu
// ---------------------------------
function loadMisc() {
	var choices = "<option class='gray' disabled selected>­ ­ ­ ­ Miscellaneous</option>";
	for (let m = 1; m < non_items.length; m++) { choices += "<option>" + non_items[m].name + "</option>" }
	document.getElementById("dropdown_misc").innerHTML = choices
}

// loadSocketables - Loads jewels, runes, and gems to the 'Socketables' dropdown menu
// ---------------------------------
function loadSocketables() {
	var choices = "<option class='gray' disabled selected>­ ­ ­ ­ Socketables</option>";
	for (let m = 1; m < socketables.length; m++) {
		if (socketables[m].type == "rune") { choices += "<option class='dropdown-craft'>" + socketables[m].name + "</option>" }
		else if (typeof(socketables[m].rarity) != 'undefined') { choices += "<option class='dropdown-"+socketables[m].rarity+"'>" + socketables[m].name + "</option>" }
		else { choices += "<option>" + socketables[m].name + "</option>" }
	}
	document.getElementById("dropdown_socketables").innerHTML = choices
}

// loadCorruptions - Loads corruption options
// ---------------------------------
function loadCorruptions() {
	var groups = ["helm", "armor", "gloves", "boots", "belt", "amulet", "ring1", "ring2", "weapon", "offhand"];
	for (let i = 0; i < groups.length; i++) {
		var choices = "<option>­ ­ ­ ­ Corruption</option>";
		for (let m = 1; m < corruptions[groups[i]].length; m++) {
			if (groups[i] == "offhand") { if (corruptions[groups[i]][m].base == "shield") { choices += "<option>" + corruptions[groups[i]][m].name + "</option>" } }
			else { choices += "<option>" + corruptions[groups[i]][m].name + "</option>" }
		}
		document.getElementById("corruptions_"+groups[i]).innerHTML = choices
	}
}

// loadGolem - Loads options for the Iron Golem minion
// ---------------------------------
function loadGolem() {
	var choices = "<option>­ ­ ­ ­ Iron Golem</option>";
	for (group in corruptsEquipped) {
		for (itemNew in equipment[group]) {
			var item = equipment[group][itemNew];
			var metal = true;
			if (group == "amulet" || group == "ring1" || group == "ring2" || item.type == "quiver" || item.special > 0 || item.rarity == "magic" || item.only == "Desert Guard" || item.only == "Iron Wolf" || item.only == "Barb (merc)" || item.nonmetal == 1) { metal = false }
			else if (typeof(item.base) != 'undefined') { if (typeof(bases[getBaseId(item.base)].nonmetal) != 'undefined') { if (bases[getBaseId(item.base)].nonmetal == 1) { metal = false } } }
			if (metal == true) {
				var addon = "";
				if (item == equipment[group][0]) { addon = "<option class='gray-all' style='color:gray' disabled>" + item.name + "</option>" }
				else if (typeof(item.rarity) != 'undefined') { addon = "<option class='dropdown-"+item.rarity+"'>" + item.name + "</option>" }
				else { addon = "<option class='dropdown-unique'>" + item.name + "</option>" }
				choices += addon
			}
		}
	}
	document.getElementById("dropdown_golem").innerHTML = choices
}

// loadMerc - Loads mercenaries to the 'Mercenary' dropdown menu
// ---------------------------------
function loadMerc() {
	var choices = "<option>­ ­ ­ ­ Mercenary</option>";
	for (let m = 1; m < mercenaries.length; m++) { choices += "<option>" + mercenaries[m].name + "</option>" }
	document.getElementById("dropdown_mercenary").innerHTML = choices
}

// setMercenary - Handles mercenary selection, including adding auras and loading mercenary items to the appropriate dropdown menus
//	merc: selected mercenary name
// ---------------------------------
function setMercenary(merc) {
	var mercEquipmentGroups = ["helm", "armor", "weapon", "offhand"];
	var mercEquipmentDropdowns = ["dropdown_merc_helm", "dropdown_merc_armor", "dropdown_merc_weapon", "dropdown_merc_offhand"];
	if (document.getElementById("dropdown_merc_helm").innerHTML != "") { equipMerc('helm', 'helm'); }
	if (document.getElementById("dropdown_merc_armor").innerHTML != "") { equipMerc('armor', 'armor'); }
	if (document.getElementById("dropdown_merc_weapon").innerHTML != "") { equipMerc('weapon', 'weapon'); }
	if (document.getElementById("dropdown_merc_offhand").innerHTML != "") { equipMerc('offhand', 'offhand'); }
	if (mercenary.base_aura != "") { removeEffect(mercenary.base_aura.split(' ').join('_')+"-mercenary"); mercenary.base_aura = ""; }
	var mercType = merc;
	if (merc == "none" || merc == "­ ­ ­ ­ Mercenary") {
		for (let i = 0; i < mercEquipmentGroups.length; i++) { loadItems(mercEquipmentGroups[i], mercEquipmentDropdowns[i], "clear") }
		document.getElementById("dropdown_mercenary").selectedIndex = 0;
	} else {
		if (merc == mercenaries[1].name) { mercType = "Rogue Scout" }
		if (merc == mercenaries[2].name || merc == mercenaries[3].name || merc == mercenaries[4].name) { mercType = "Desert Guard" }
		if (merc == mercenaries[5].name || merc == mercenaries[6].name || merc == mercenaries[7].name) { mercType = "Iron Wolf" }
		if (merc == mercenaries[8].name) { mercType = "Barb (merc)" }
		for (let i = 0; i < mercEquipmentGroups.length; i++) { loadItems(mercEquipmentGroups[i], mercEquipmentDropdowns[i], mercType) }
		for (let m = 1; m < mercenaries.length; m++) {
			if (merc == mercenaries[m].name) { document.getElementById("dropdown_mercenary").selectedIndex = m; if (mercenary.base_aura == "") {
				mercenary.level = Math.max(1,character.level-1)
				mercenary.base_aura_level = getMercenaryAuraLevel(mercenary.level)
				mercenary.base_aura = mercenaries[m].aura
				addEffect("aura",mercenary.base_aura,mercenary.base_aura_level,"mercenary")
			} }
		}
	}
	mercenary.name = merc
	if (document.getElementById("dropdown_merc_helm").innerHTML == "") { document.getElementById("dropdown_merc_helm").style.display = "none" } else { document.getElementById("dropdown_merc_helm").style.display = "block" }
	if (document.getElementById("dropdown_merc_armor").innerHTML == "") { document.getElementById("dropdown_merc_armor").style.display = "none" } else { document.getElementById("dropdown_merc_armor").style.display = "block" }
	if (document.getElementById("dropdown_merc_weapon").innerHTML == "") { document.getElementById("dropdown_merc_weapon").style.display = "none" } else { document.getElementById("dropdown_merc_weapon").style.display = "block" }
	if (document.getElementById("dropdown_merc_offhand").innerHTML == "") { document.getElementById("dropdown_merc_offhand").style.display = "none" } else { document.getElementById("dropdown_merc_offhand").style.display = "block" }
	if (merc == "none" || merc == "­ ­ ­ ­ Mercenary") { document.getElementById("mercenary_spacing").style.display = "none" } else { document.getElementById("mercenary_spacing").style.display = "block" }
	if (mercType == "Iron Wolf") { document.getElementById("mercenary_spacing2").style.display = "block" } else { document.getElementById("mercenary_spacing2").style.display = "none" }
	if (merc == "none" || merc == "­ ­ ­ ­ Mercenary") { document.getElementById("merc_space").style.display = "block" } else { document.getElementById("merc_space").style.display = "none" }
	if (loaded == 1) { updateURLDebounced() }
}

// updateMercenary - updates mercenary base aura
// ---------------------------------
function updateMercenary() {
	mercenary.level = Math.max(1,character.level-1)
	if (mercenary.base_aura != "") {
		if (mercenary.base_aura_level != getMercenaryAuraLevel(mercenary.level)) {
			mercenary.base_aura_level = getMercenaryAuraLevel(mercenary.level)
			removeEffect(mercenary.base_aura.split(' ').join('_')+"-mercenary")	// TODO: merge with effect update functions. Use disable/enable instead.
			addEffect("aura",mercenary.base_aura,mercenary.base_aura_level,"mercenary")
		}
	}
}

// getMercenaryAuraLevel - Get mercenary aura level
//	hlvl: level of mercenary (must be lower than clvl)
// return: aura level of mercenary
// ---------------------------------
function getMercenaryAuraLevel(hlvl) {
	var result = 1;
	if (hlvl >= 9 && hlvl <= 42) { result = (3+Math.floor((hlvl-9)*7/32)) }
	else if (hlvl >= 43 && hlvl <= 74) { result = (11+Math.floor((hlvl-43)*7/32)) }
	else if (hlvl >= 75) { result = 18 }
	result = Math.min(18,(result + ~~mercenary.all_skills + ~~Math.ceil(mercenary.all_skills_per_level*hlvl)))
	return result;
}



//=========================================================================================================================
// EFFECTS ....
//=========================================================================================================================

/* Functions:
	addEffect
	initializeEffect
	setEffectData
	rightClickEffect
	leftClickEffect
	removeEffect
	toggleEffect
	disableEffect
	enableEffect
	updateAllEffects
	updateEffect
	adjustStackedAuras
	hoverEffectOn
	hoverEffectOff
	resetEffects
	getAuraData
	getCSkillData
	getCTCSkillData
	getMiscData
*/

// addEffect - Adds an effect with the given info (if it doesn't already exist)
//	origin: what kind of source the effect has ("skill", "aura", "misc")
//	name: name of the chosen effect
//	num: index, or aura level
//	other: "mercenary" or the item type which is granting the aura
// ---------------------------------
function addEffect(origin, name, num, other) {
	if (origin == "misc") { name = non_items[num].effect; document.getElementById("dropdown_misc").selectedIndex = 0; }
	var id = name.split(' ').join('_');
	if (other != "") { id += ("-"+other) }
	if (document.getElementById(id) == null) { initializeEffect(origin,name,num,other) }
	updateAllEffects()
}

// initializeEffect - Initializes an effect UI/data element
//	origin: what kind of source the effect has ("skill", "aura", "misc")
//	name: name of the chosen effect
//	num: index, or aura level
//	other: "mercenary" or the item type which is granting the aura
// ---------------------------------
function initializeEffect(origin, name, num, other) {
	var id = name.split(' ').join('_');
	if (other != "") { id += ("-"+other) }
	var prefix = "./images/effects/";
	var fileType = ".png";
	if (origin == "misc") {fileType = ".gif"}
	if (origin == "skill") { prefix = "./images/skills/"+character.class_name.toLowerCase()+"/"; }
	if (origin == "oskill") { prefix = "./images/skills/"+oskills_info["oskill_"+id].native_class+"/"; }
	var iconOff = prefix+"dark/"+name+" dark.png";
	var iconOn = prefix+name+fileType;
	
	var newDiv = document.createElement("div");
	var dClass = document.createAttribute("class");			dClass.value = "effect-container";				newDiv.setAttributeNode(dClass);
	var dId = document.createAttribute("id");			dId.value = id;							newDiv.setAttributeNode(dId);
	var dHoverOn = document.createAttribute("onmouseover");		dHoverOn.value = "hoverEffectOn(this.id)";			newDiv.setAttributeNode(dHoverOn);
	var dHoverOff = document.createAttribute("onmouseout");		dHoverOff.value = "hoverEffectOff()";				newDiv.setAttributeNode(dHoverOff);
	var dClickLeft = document.createAttribute("onclick");		dClickLeft.value = "leftClickEffect(event,this.id)";		newDiv.setAttributeNode(dClickLeft);
	var dClickRight = document.createAttribute("oncontextmenu");	dClickRight.value = "rightClickEffect(event,this.id,1)";	newDiv.setAttributeNode(dClickRight);
	
	var newEffect = document.createElement("img");
	var eClass = document.createAttribute("class");			eClass.value = "effect";					newEffect.setAttributeNode(eClass);
	var eId = document.createAttribute("id");			eId.value = id+"_e";						newEffect.setAttributeNode(eId);
	var eSrc = document.createAttribute("src");			eSrc.value = iconOff;						newEffect.setAttributeNode(eSrc);
	newDiv.appendChild(newEffect)
	
	var newEffectSnapshot = document.createElement("img");
	var oClass = document.createAttribute("class");			oClass.value = "effect";					newEffectSnapshot.setAttributeNode(oClass);
	var oId = document.createAttribute("id");			oId.value = id+"_ss";						newEffectSnapshot.setAttributeNode(oId);
	var oSrc = document.createAttribute("src");			oSrc.value = "./images/skills/none.png";			newEffectSnapshot.setAttributeNode(oSrc);
	newDiv.appendChild(newEffectSnapshot)
	
	var effectGUI = document.getElementById("side");
	effectGUI.appendChild(newDiv);
	
	if (typeof(effects[id]) == 'undefined') { effects[id] = {info:{}} }
	
	effects[id].info.enabled = 0
	effects[id].info.imageOff = iconOff
	effects[id].info.imageOn = iconOn
	effects[id].info.origin = origin
	effects[id].info.index = num
	effects[id].info.other = other
	effects[id].info.snapshot = 0
	effects[id].info.level = num
	setEffectData(origin,name,num,other)
	
	if (settings.autocast == 1) { toggleEffect(id) }	// TODO: should also toggle-on if effect is always-active
	adjustStackedAuras()
}

// setEffectData - Sets the effect's data (using current stat/skill values)
//	origin: what kind of source the effect has ("skill", "aura", "misc")
//	name: name of the chosen effect
//	num: index, or aura level
//	other: "mercenary" for auras
// ---------------------------------
function setEffectData(origin, name, num, other) {
	var id = name.split(' ').join('_');
	if (other != "") { id += ("-"+other) }
	var data = {};
	var lvl = effects[id].info.index
	if (origin == "aura") { data = getAuraData(name,num,other) }
	else if (origin == "skill") { data = character.getBuffData(skills[num]); lvl = skills[num].level + skills[num].extra_levels; }
	else if (origin == "oskill") {
		var skill = skills_all[oskills_info["oskill_"+id].native_class][num]; data = character_any.getBuffData(skill); lvl = character["oskill_"+skill.name.split(" ").join("_")] + character.all_skills + Math.ceil(character.all_skills_per_level*character.level);
		if (id == "Frigerate" || id == "Shiver_Armor" || id == "Cold_Mastery" || id == "Blizzard") { lvl += character.skills_cold_all }
		if (id == "Fire_Mastery" || id == "Flame_Dash" || id == "Fire_Ball" || id == "Fire_Wall" || id == "Meteor" || id == "Hydra") { lvl += character.skills_fire_all }
		if (id == "Desecrate") { lvl += character.skills_poison_all }
//		if (id == "Whirling Axes") { totalwhirly += whirlychance }
	}
	else if (origin == "misc") { data = getMiscData(name,num); }
	else if (origin == "cskill") { data = getCSkillData(name,num,other) }
	else if (origin == "ctcskill") { data = getCTCSkillData(name,num,other) }
	if (effects[id].info.snapshot == 0) { effects[id].info.level = lvl }
	if (effects[id].info.snapshot == 0) { for (affix in data) { effects[id][affix] = data[affix] } }
	// TODO: remove 'snapshot' for class effects if their base skill level decreases?
}

// rightClickEffect - Handles effect right clicks
//	id: the effect's id
//	direct: whether the effect icon was clicked directly (1 or null)
// ---------------------------------
function rightClickEffect(event, id, direct) {
	var mod = 0;
	if (event != null) { if (event.ctrlKey) { mod = 1 } }
	if (mod > 0) {
		var idName = id.split("-")[0];
		if ((effects[id].info.origin == "skill" && skills[effects[id].info.index].effect > 3) || (effects[id].info.origin == "oskill" && (id == "Battle_Orders" || id == "Battle_Command" || id == "Shiver_Armor" || id == "Werebear" || id == "Werewolf")) || (effects[id].info.origin == "cskill" && (idName != "Inner_Sight" && idName != "Heart_of_Wolverine" && idName != "Oak_Sage" && idName != "Spirit_of_Barbs" && idName != "Blood_Golem" && idName != "Iron_Golem")) || effects[id].info.origin == "ctcskill") {
			effects[id].info.snapshot = 0
			document.getElementById(id+"_ss").src = "./images/skills/none.png"
			updateAllEffects()
			update()
			if (typeof(effects[id].info.enabled) == 'undefined') { hoverEffectOff() }
		}
	} else {
		removeEffect(id,direct)
	}
}

// leftClickEffect - Handles effect left clicks
//	id: the effect's id
// ---------------------------------
function leftClickEffect(event, id) {
	var mod = 0;
	if (event != null) { if (event.ctrlKey) { mod = 1 } }
	if (mod > 0) {
		var idName = id.split("-")[0];
		if ((effects[id].info.origin == "skill" && skills[effects[id].info.index].effect > 3) || (effects[id].info.origin == "oskill" && (id == "Battle_Orders" || id == "Battle_Command" || id == "Shiver_Armor" || id == "Werebear" || id == "Werewolf")) || (effects[id].info.origin == "cskill" && (idName != "Inner_Sight" && idName != "Heart_of_Wolverine" && idName != "Oak_Sage" && idName != "Spirit_of_Barbs" && idName != "Blood_Golem" && idName != "Iron_Golem")) || effects[id].info.origin == "ctcskill") {
			if (effects[id].info.snapshot == 0) {
				effects[id].info.snapshot = 1;
				document.getElementById(id+"_ss").src = "./images/skills/snapshot.png";
			} else {
				effects[id].info.snapshot = 0;
				document.getElementById(id+"_ss").src = "./images/skills/none.png";
			}
			updateAllEffects()
			update()
			if (typeof(effects[id].info.enabled) == 'undefined') { hoverEffectOff() }
		}
	} else {
		toggleEffect(id)
	}
}

// removeEffect - Removes an effect
//	id: the effect's id
//	direct: whether the effect icon was clicked directly (1 or null)
// ---------------------------------
function removeEffect(id, direct) {
	if (document.getElementById(id) != null) { if (effects[id].info.snapshot != 1) {
		var on = effects[id].info.enabled;
		var halt = 0;
		if (direct != null && effects[id].info.origin != "misc") { halt = 1 }
		if (effects[id].info.origin == "skill") {
			halt = 1;
			var skill = skills[effects[id].info.index];
			if (typeof(skill.effect) != 'undefined') { if (skill.effect > 0) { if (skill.level == 0 && skill.force_levels == 0) { halt = 0 } } }
		}
		if (effects[id].info.enabled == 1) { disableEffect(id) }
		update()
		if (halt == 0) {
			document.getElementById(id).remove();
			effects[id] = null
			for (effect_id in effects) { if (effects[effect_id] != null) { duplicateEffects[effect_id] = effects[effect_id] } }
			effects = duplicateEffects
			duplicateEffects = {}
			var secondary = "";
			var secondary_level = 0;
			if (on == 1) {
				for (effect_id in effects) { if (typeof(effects[effect_id].info.enabled) != 'undefined') { if (effects[effect_id].info.level > secondary_level) { secondary = effect_id; secondary_level = effects[effect_id].info.level; } } }
				if (secondary != "") { enableEffect(secondary) }
			}
			document.getElementById("tooltip_effect").style.display = "none"
			updateAllEffects()
		}
		adjustStackedAuras()
	} }
}

// toggleEffect - Toggles an effect on or off
//	id: the effect's id
// ---------------------------------
function toggleEffect(id) {
	if (effects[id].info.enabled == 1) {
		disableEffect(id)
	} else {
		if (id.split("-")[0] == "Iron_Golem") { if (typeof(golemItem.aura) != 'undefined') { if (golemItem.aura != "") { for (effect_id in effects) { if (effect_id.split("-")[0] == getId(golemItem.aura)) { disableEffect(effect_id) } } } } }
		enableEffect(id)
	}
	updateEffect(id)	// current effect prioritized
	updateAllEffects()
}

// disableEffect - Disables an effect
//	id: the effect's id
// ---------------------------------
function disableEffect(id) {
	if (document.getElementById(id) != null && effects[id].info.enabled == 1) {
		effects[id].info.enabled = 0
		document.getElementById(id+"_e").src = effects[id].info.imageOff
		for (affix in effects[id]) { if (affix != "info") { character[affix] -= effects[id][affix] } }
		//update() or updateEffect(id)?
	}
}

// enableEffect - Enables an effect
//	id: the effect's id
// ---------------------------------
function enableEffect(id) {
	if (document.getElementById(id) != null && effects[id].info.enabled == 0) {
		effects[id].info.enabled = 1
		document.getElementById(id+"_e").src = effects[id].info.imageOn
		for (affix in effects[id]) { if (affix != "info") { character[affix] += effects[id][affix] } }
		if (effects[id].info.origin == "cskill" || effects[id].info.origin == "ctcskill") { disableEffect(id.split("-")[0]) }
	}
}

// updateAllEffects - Updates all effects
// ---------------------------------
function updateAllEffects() {
	calculateSkillAmounts()
	// updates skill effects
	for (let s = 0; s < skills.length; s++) {
		var skill = skills[s];
		if (typeof(skill.effect) != 'undefined') { if (skill.effect > 0) {
			var id = skill.name.split(' ').join('_');
			if (skill.level > 0 || skill.force_levels > 0) {
				if (document.getElementById(id) == null) { addEffect("skill",skill.name,skill.i,"") }
				else { updateEffect(id) }
			} else {
				if (document.getElementById(id) != null) { removeEffect(id,null) }
			}
		} }
	}
	// updates oskill effects
	if (character.class_name != null) {
		for (let o = 0; o < oskills.length; o++) {
			var natClass = oskills_info[oskills[o]].native_class;
			if (natClass != "none" && natClass != character.class_name.toLowerCase()) {
				var skill = skills_all[natClass][oskills_info[oskills[o]].i]
				if (typeof(skill.effect) != 'undefined') { if (skill.effect > 0) {
					var id = skill.name.split(' ').join('_');
					if (character[oskills[o]] > 0) {
						if (document.getElementById(id) == null) { addEffect("oskill",skill.name,skill.i,"") }
						else { updateEffect(id) }
					} else {
						if (document.getElementById(id) != null) { removeEffect(id,null) }
					}
				} }
			}
		}
	}
	// updates cskill effects
	for (id in effects) { if (effects[id].info.origin == "cskill") {
		var match = 0;
		var group = effects[id].info.other;
		var cskill_level = effects[id].info.index;
		var cskill_name = id.split("-")[0].split("_").join(" ");
		if (typeof(equipped[group].cskill) != 'undefined' && equipped[group].cskill != "") {
			for (unit in equipped[group].cskill) {
				if (cskill_level == equipped[group].cskill[unit][0] && cskill_name == equipped[group].cskill[unit][1]) { match = 1 }
			}
		}
		if (match == 0) { removeEffect(id,null) }
	} }
	// updates ctcskill effects
	for (id in effects) { if (effects[id].info.origin == "ctcskill") {
		var match = 0;
		var group = effects[id].info.other;
		var ctcskill_level = effects[id].info.index;
		var ctcskill_name = id.split("-")[0].split("_").join(" ");
		if (typeof(equipped[group].ctc) != 'undefined' && equipped[group].ctc != "") {
			for (unit in equipped[group].ctc) {
				if (ctcskill_level == equipped[group].ctc[unit][1] && ctcskill_name == equipped[group].ctc[unit][2]) { match = 1 }
				if (ctcskill_name == "Discharge") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Chain Lightning") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Ball Lightning") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Nova") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Molten Boulder") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Volcano") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Poison Nova") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Frozen Orb") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Hydra") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Fissure") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Armageddon") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Hurricane") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Meteor") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Fire Ball") { match = 0 } //without this line, CTC discharge would add lightining damage to attack damage display
				if (ctcskill_name == "Blizzard") { match = 0 } 
				if (ctcskill_name == "Ice Arrow") { match = 0 } 
				if (ctcskill_name == "Glacial Spike") { match = 0 } 
				if (ctcskill_name == "Static Field") { match = 0 } 
				if (ctcskill_name == "War Cry") { match = 0 } 
				if (ctcskill_name == "Firestorm") { match = 0 } 
				if (ctcskill_name == "Molten Strike") { match = 0 } 
			}
		}
		if (match == 0) { removeEffect(id,null) }
	} }
	update()	// needed?
	// disables duplicate effects (non-skills)
	for (id in effects) { if (document.getElementById(id) != null) { if (document.getElementById(id).getAttribute("class") == "hide") { document.getElementById(id).setAttribute("class","effect-container") } } }
	var checkedEffects = {};
	for (id in effects) { checkedEffects[id] = 0 }
	for (id1 in effects) {
		if (typeof(effects[id1].info.enabled) != 'undefined' && effects[id1].info.origin != "skill" && effects[id1].info.origin != "oskill") {
			for (id2 in effects) {
				if (id1 != id2 && checkedEffects[id2] != 1 && typeof(effects[id2].info.enabled) != 'undefined' && effects[id2].info.origin != "skill" && effects[id2].info.origin != "oskill") {
					var effect1 = id1.split('-')[0];
					var effect2 = id2.split('-')[0];
					if (effect1 == effect2) {
						if (document.getElementById(id1).getAttribute("class") != "hide" && document.getElementById(id2).getAttribute("class") != "hide") {
							var magnitude1 = effects[id1].info.level;
							var magnitude2 = effects[id2].info.level;
							if (magnitude1 > magnitude2) {
								document.getElementById(id2).setAttribute("class","hide");
								document.getElementById(id1).setAttribute("class","effect-container");
							} else {
								document.getElementById(id1).setAttribute("class","hide");
								document.getElementById(id2).setAttribute("class","effect-container");
							}
						}
					}
				}
			}
		}
		checkedEffects[id1] = 1
	}
	for (id in effects) { if (typeof(effects[id].info.enabled) != 'undefined') { if (document.getElementById(id).getAttribute("class") == "hide") { disableEffect(id) } } }
	// disables duplicate effects (skills)
	if (character.class_name == "Paladin") { for (id1 in effects) {
		if (typeof(effects[id1].info.enabled) != 'undefined' && effects[id1].info.enabled == 1 && effects[id1].info.origin == "skill") {
			for (id2 in effects) {
				if (typeof(effects[id2].info.enabled) != 'undefined' && id1 != id2 && effects[id2].info.enabled == 1 && effects[id2].info.origin != "skill" && document.getElementById(id2).getAttribute("class") != "hide") {
					var effect1 = id1.split('-')[0];
					var effect2 = id2.split('-')[0];
					if (effect1 == effect2) {
						var magnitude1 = effects[id1].info.level;
						var magnitude2 = effects[id2].info.level;
						if (magnitude1 >= magnitude2) { disableEffect(id2); enableEffect(id1); }
						else { disableEffect(id1); enableEffect(id2); }
					}
				}
			}
		}
		update()	// needed?
	} }
	// disable incompatible effects
	for (id in effects) {
		if (id == "Fists_of_Ember") { if (equipped.weapon.type != "claw" && equipped.weapon.type != "dagger") { disableEffect(id) } }
		else if (id == "Fists_of_Thunder") { if (equipped.weapon.type != "claw" && equipped.weapon.type != "dagger") { disableEffect(id) } }
		else if (id == "Fists_of_Ice") { if (equipped.weapon.type != "claw" && equipped.weapon.type != "dagger") { disableEffect(id) } }
		else if (id == "Frenzy") { if (offhandType != "weapon") { disableEffect(id) } }
		else if (id == "Maul") { if (effects["Werebear"].info.enabled != 1) { disableEffect(id) } }
		else if (id == "Feral_Rage") { if (effects["Werewolf"].info.enabled != 1) { disableEffect(id) } }
		else if (id == "Holy_Shield") { if (offhandType != "shield") { disableEffect(id) } }
		else if (id == "Weapon_Block") { if (equipped.weapon.type != "claw" || equipped.offhand.type != "claw") { disableEffect(id) } }
	//	else if (id == "Claw_Mastery") { if (equipped.weapon.type != "claw" && equipped.offhand.type != "claw") { disableEffect(id) } else { enableEffect(id) } }
	//	else if (id == "Edged_Weapon_Mastery") { if (equipped.weapon.type != "sword" && equipped.weapon.type != "axe" && equipped.weapon.type != "dagger" && equipped.offhand.type != "sword" && equipped.offhand.type != "axe" && equipped.offhand.type != "dagger") { disableEffect(id) } else { enableEffect(id) } }
	//	else if (id == "Pole_Weapon_Mastery") { if (equipped.weapon.type != "polearm" && equipped.weapon.type != "spear" && equipped.offhand.type != "polearm" && equipped.offhand.type != "spear") { disableEffect(id) } else { enableEffect(id) } }
	//	else if (id == "Blunt_Weapon_Mastery") { if (equipped.weapon.type != "mace" && equipped.weapon.type != "scepter" && equipped.weapon.type != "staff" && equipped.weapon.type != "wand" && equipped.offhand.type != "mace" && equipped.offhand.type != "scepter" && equipped.offhand.type != "staff" && equipped.offhand.type != "wand") { disableEffect(id) } else { enableEffect(id) } }
	//	else if (id == "Thrown_Weapon_Mastery") { if (equipped.weapon.type != "thrown" && equipped.weapon.type != "javelin" && equipped.offhand.type != "thrown" && equipped.offhand.type != "javelin") { disableEffect(id) } else { enableEffect(id) } }
	}
	for (id in effects) { if (typeof(effects[id].info.enabled) != 'undefined') { if (effects[id].info.enabled == 1) { if (id.split("-")[0] == "Iron_Golem") {
		if (typeof(golemItem.aura) != 'undefined') { if (golemItem.aura != "" && golemItem.aura != "Righteous Fire") {
			var aura = golemItem.aura; var aura_lvl = golemItem.aura_lvl;
			for (effect_id in effects) {
				if (typeof(effects[effect_id].info.enabled) != 'undefined') { if (effects[effect_id].info.enabled == 1) {
					if (getId(aura) == effect_id.split('-')[0]) { disableEffect(id) }
				} }
			}
		} }
	} } } }
	update()
}

// updateEffect - Updates a single effect
//	id: the effect's id
// ---------------------------------
function updateEffect(id) {
	var origin = effects[id].info.origin;
	var index = effects[id].info.index;
	var other = effects[id].info.other;
	var name = id.split('-')[0].split('_').join(' ');
	var active = effects[id].info.enabled;
	var old_data = {}
	for (affix in effects[id]) { if (affix != "info") { old_data[affix] = effects[id][affix] } }
	
	setEffectData(origin,name,index,other)
	if (active == 1) {
		for (affix in old_data) { character[affix] -= old_data[affix] }
		effects[id].info.enabled = 0
		enableEffect(id)
	}
}

// adjustStackedAuras - Combines stackable auras if multiples exist
// ---------------------------------
function adjustStackedAuras() {
	/* Possible Stacking Auras
		Holy Shock	Dream helm, Dream shield
		Holy Fire	Dragon armor, Dragon shield, Hand of Justice weapons
		Thorns		Edge bow, Bramble armor
		Redemption	Phoenix shield, Phoenix weapons
		Holy Freeze	Doom weapons
		Fanaticism	Beast Weapons
		Might		Last Wish weapons
		Sanctuary	Azurewrath/Lawbringer weapons
	*/
//	var stackableAuras = ["Holy_Shock","Holy_Fire","Thorns","Redemption","Holy_Freeze","Fanaticism","Might","Sanctuary"];
	var stackableAuras = ["Holy_Shock","Holy_Fire"];
	var stackedAuras = [0,0,0,0,0,0,0,0];
	var stackedLevels = [0,0,0,0,0,0,0,0];
	for (id in effects) {
		if (typeof(effects[id].info.enabled) != 'undefined' && effects[id].info.origin == "aura" && effects[id].info.other.split('_')[0] != "mercenary" && effects[id].info.other != "combined") {
			var effect = id.split('-')[0];
			for (let i = 0; i < stackableAuras.length; i++) {
				if (effect == stackableAuras[i]) {
					stackedAuras[i] += 1
					stackedLevels[i] += effects[id].info.index
				}
			}
		}
	}
	for (let i = 0; i < stackedAuras.length; i++) {
		var active = false;
		var id = stackableAuras[i]+"-combined";
		if (typeof(effects[id]) != 'undefined') { if (typeof(effects[id].info.enabled) != 'undefined') { active = true } }
		if (stackedAuras[i] > 1) {
			if (active == false) { addEffect("aura",stackableAuras[i].split("_").join(" "),stackedLevels[i],"combined") }
			else { effects[id].info.index = stackedLevels[i]; updateEffect(id); }
		} else {
			if (active != false) { removeEffect(id,null) }
		}
	}
}

// hoverEffectOn - Shows the effect tooltip (on mouse-over)
//	id: the effect's id
// ---------------------------------
function hoverEffectOn(id) {
	var idName = id.split("-")[0];
	var name = idName.split("_").join(" ");
	document.getElementById("tooltip_effect").style.display = "block"
	var offset = 30;
	var done = false;
	for (effect_id in effects) {
		if (id == effect_id) { done = true }
		if (done == false) {
			if (effects[effect_id] != null) { if (typeof(effects[effect_id].info.enabled) != 'undefined') {
				if (document.getElementById(effect_id).getAttribute("class") != "hide") { offset += 36 }
			} }
		}
	}
	var origin = effects[id].info.origin;
	var other = effects[id].info.other;
	var level = "Level "+effects[id].info.level; if (name == "Lifted Spirit" || name == "Righteous Fire" || origin == "misc") { level = "" }
	var source = "";
	var note = "";
	var affixes = "";
//	for (affix in effects[id]) { if (affix != "info" && affix != "duration" && affix != "radius") {
//		if (stats[affix] != unequipped[affix] && stats[affix] != 1) {
//			var affix_info = getAffixLine(affix,"effects",id,"");
//			if (affix_info[1] != 0) { affixes += affix_info[0]+"<br>" }
//		}
//	} }
	// Aura display fix
	patchAuraDisplayDamage(effects, id);

	for (affix in effects[id]) {
	if (affix != "info" && affix != "duration" && affix != "radius") {
		if (stats[affix] != unequipped[affix] && stats[affix] != 1) {
		var affix_info = getAffixLine(affix, "effects", id, "");
		if (affix_info[1] != 0) {
			affixes += affix_info[0] + "<br>";
		}
		}
	}
	}

	restoreAuraDisplayDamage(effects, id);

	if (origin != "skill" && origin != "oskill" && origin != "misc") {
		source = "Source: "
		var group = other;
		var other_minion = other.split("_")[0];
		if (other_minion == "mercenary") {
			group = other.split("_")[1]
			if (other == "mercenary") { source += "Mercenary" }
			else { source += "Mercenary - "+mercEquipped[group].name }
		} else if (other_minion == "combined") {
			source = "Multiple Sources"
		} else {
			source += equipped[group].name
		}
		if (origin == "cskill") { for (let i = 0; i < equipped[group].cskill.length; i++) { if (equipped[group].cskill[i][1] == name) { note = "<br>"+equipped[group].cskill[i][2]+" charges" } } }
		else if (origin == "ctcskill") { for (let i = 0; i < equipped[group].ctc.length; i++) { if (equipped[group].ctc[i][2] == name) { note = "<br>"+equipped[group].ctc[i][0]+"% chance to cast "+equipped[group].ctc[i][3] } } }
	} else if (origin == "oskill") {
		for (group in equipped) { if (typeof(equipped[group]["oskill_"+idName]) != 'undefined') { if (equipped[group]["oskill_"+idName] > 0) { source = "Source: "+equipped[group].name } } }
		if (source == "" && (id == "Battle_Command" || id == "Battle_Orders")) { source = "Source: Call to Arms (unequipped)" }
		if (source == "" && id == "Shiver_Armor") { source = "Source: Medusa's Gaze (unequipped)" }
	} else if (origin == "misc") {
		source = "Source: "+non_items[effects[id].info.index].name.split(":")[0]
	}
	if (typeof(effects[id].duration) != 'undefined') { if (effects[id].duration != 0) { note += "<br>Duration: "+effects[id].duration+" seconds" } }
	if (source == "Source: Potion") { note += " each" }
	if (id.split("-")[0] == "Iron_Golem" && golemItem.name != "none") {
		note += "<br>Item: "+golemItem.name.split(" ­ ")[0]
		if (affixes != "") { note += "<br>"+golemItem.aura }
	}
	if (typeof(effects[id].radius) != 'undefined') { if (effects[id].radius != 0) { note += "<br>Radius: "+effects[id].radius+" yards" } }
	if (level != "" && source != "") { level += "<br>" }
	if (source != "") { source = source.split(" ­ ")[0] }
	document.getElementById("tooltip_effect").style.top = offset+"px"
	document.getElementById("effect_name").innerHTML = name
	document.getElementById("effect_info").innerHTML = level+source+note
	document.getElementById("effect_affixes").innerHTML = affixes
}

// hoverEffectOff - Hides the effect tooltip
// ---------------------------------
function hoverEffectOff() {
	document.getElementById("tooltip_effect").style.display = "none"
}

// resetEffects - Removes all effects
// ---------------------------------
function resetEffects() {
	for (id in effects) { if (typeof(effects[id].info.snapshot) != 'undefined') { effects[id].info.snapshot = 0 } }
	updateAllEffects()
	for (id in effects) { if (document.getElementById(id) != null) { removeEffect(id,null) } }
}

// getAuraData - gets a list of stats corresponding to the aura (excludes synergy bonuses)
//	aura: name of the aura
//	lvl: level of the aura (1+)
//	source: "mercenary" or the item type which is granting the aura
// result: indexed array of stats granted and their values
// ---------------------------------
function getAuraData(aura, lvl, source) {
	source = source.split('_')[0]
	var result = {};
	var a = -1;
	var auras = [];
	for (let u = 0; u < 20; u++) {
		if (skills_all["paladin"][u].name == aura) { auras = skills_all["paladin"]; a = u; }
	}
	for (let u = 0; u < auras_extra.length; u++) {
		if (auras_extra[u].name == aura) { auras = auras_extra; a = u; }
	}
	// Defensive Auras
	if (aura == "Prayer") { result.life_regen = 1; result.life_replenish = auras[a].data.values[0][lvl]; result.radius = 24; }
	else if (aura == "Resist Fire") { result.fRes = auras[a].data.values[1][lvl]; result.fRes_max = auras[a].data.values[2][lvl]; result.radius = 28; }
	else if (aura == "Defiance") { result.defense_bonus = auras[a].data.values[0][lvl]; result.radius = 24; }
	else if (aura == "Resist Cold") { result.cRes = auras[a].data.values[1][lvl]; result.cRes_max = auras[a].data.values[2][lvl]; result.radius = 28; }
	else if (aura == "Cleansing") { result.poison_length_reduced = auras[a].data.values[2][lvl]; result.curse_length_reduced = auras[a].data.values[2][lvl]; result.radius = 24; }
	else if (aura == "Resist Lightning") { result.lRes = auras[a].data.values[1][lvl]; result.lRes_max = auras[a].data.values[2][lvl]; result.radius = 28; }
	else if (aura == "Vigor") { result.velocity = auras[a].data.values[0][lvl]; result.max_stamina = auras[a].data.values[1][lvl]; result.heal_stam = auras[a].data.values[2][lvl]; result.radius = 21.3; }
	else if (aura == "Meditation") { result.mana_regen = auras[a].data.values[1][lvl]; result.radius = 24; }
	else if (aura == "Redemption") { result.redeem_chance = auras[a].data.values[0][lvl]; result.redeem_amount = auras[a].data.values[1][lvl]; result.radius = 16; }
	else if (aura == "Salvation") { result.fDamage = auras[a].data.values[0][lvl]; result.cDamage = auras[a].data.values[0][lvl]; result.lDamage = auras[a].data.values[0][lvl]; result.all_res = auras[a].data.values[1][lvl]; result.radius = 28; salvdam = auras[a].data.values[0][lvl]; salvres = auras[a].data.values[1][lvl]; }
	// Offensive Auras
	else if (aura == "Might") { result.damage_bonus = auras[a].data.values[0][lvl]; result.radius = 16; }
//	else if (aura == "Holy Fire") { result.fDamage_min = auras[a].data.values[0][lvl]; result.fDamage_max = auras[a].data.values[1][lvl]; result.radius = 12; }
	else if (aura == "Holy Fire") { result.fDamage_min = auras[a].data.values[0][lvl]; result.fDamage_max = auras[a].data.values[1][lvl]; result.ftick_min = auras[a].data.values[2][lvl]; result.ftick_max = auras[a].data.values[3][lvl]; result.radius = 12; 
		if (character.class_name == "Sorceress") {
			result.ftick_min = Math.floor(auras[a].data.values[2][lvl] * (1 + Math.min(1,(skills[30].level+skills[30].force_levels))*(~~skills[30].data.values[1][skills[30].level+skills[30].extra_levels])/100)* (1+character.fDamage/100)) ; 
			result.ftick_max = Math.floor(auras[a].data.values[3][lvl] * (1 + Math.min(1,(skills[30].level+skills[30].force_levels))*(~~skills[30].data.values[1][skills[30].level+skills[30].extra_levels])/100)* (1+character.fDamage/100)) ; 
//			result.addeddmgdisplaywrong = 1
		}
		if (character.class_name == "Paladin") {
			result.fDamage_min = auras[a].data.values[0][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level);
			result.fDamage_max = auras[a].data.values[1][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level); 
			result.ftick_min = auras[a].data.values[2][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level) * (1+character.fDamage/100);
			result.ftick_max = auras[a].data.values[3][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level) * (1+character.fDamage/100); 
//			result.addeddmgdisplaywrong = 1
		}
		else { 
			result.ftick_min = Math.floor(auras[a].data.values[2][lvl] * (1+character.fDamage/100)) ; 
			result.ftick_max = Math.floor(auras[a].data.values[3][lvl] * (1+character.fDamage/100)) ; 
//			result.addeddmgdisplaywrong = 1
		}
	}
	else if (aura == "Precision") { result.cstrike = auras[a].data.values[2][lvl]; result.ar_bonus = auras[a].data.values[3][lvl]; result.radius = 16; if (source == "mercenary" || source == "golem") { result.pierce = auras[a].data.values[1][lvl] } else { result.pierce = auras[a].data.values[0][lvl] }}
	else if (aura == "Blessed Aim") { result.ar_bonus = auras[a].data.values[1][lvl]; result.hammer_on_hit = auras[a].data.values[0][lvl]; result.radius = 16; }
	else if (aura == "Concentration") { result.ar = auras[a].data.values[0][lvl]; result.damage_bonus = auras[a].data.values[1][lvl]; result.hammer_bonus = auras[a].data.values[2][lvl]; result.radius = 16; }
//	else if (aura == "Holy Freeze") { result.cDamage_min = auras[a].data.values[0][lvl]; result.cDamage_max = auras[a].data.values[1][lvl]; result.slow_enemies = auras[a].data.values[4][lvl]; result.radius = 13.3; }
	else if (aura == "Holy Freeze") { result.cDamage_min = auras[a].data.values[0][lvl]; result.cDamage_max = auras[a].data.values[1][lvl]; result.slow_enemies = auras[a].data.values[4][lvl]; result.ctick_min = auras[a].data.values[2][lvl]; result.ctick_max = auras[a].data.values[3][lvl]; result.radius = 13.3; 
		if (character.class_name == "Sorceress") {
			result.ctick_min = Math.floor(auras[a].data.values[2][lvl] * (1 + Math.min(1,(skills[10].level+skills[10].force_levels))*(~~skills[10].data.values[1][skills[10].level+skills[10].extra_levels])/100)* (1+character.cDamage/100)) ; 
			result.ctick_max = Math.floor(auras[a].data.values[3][lvl] * (1 + Math.min(1,(skills[10].level+skills[10].force_levels))*(~~skills[10].data.values[1][skills[10].level+skills[10].extra_levels])/100)* (1+character.cDamage/100)) ; 
//			result.addeddmgdisplaywrong = 1
		}
		if (character.class_name == "Paladin") {
			result.cDamage_min = auras[a].data.values[0][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level);
			result.cDamage_max = auras[a].data.values[1][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level); 
			result.ctick_min = auras[a].data.values[2][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level) * (1+character.cDamage/100);
			result.ctick_max = auras[a].data.values[3][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level) * (1+character.cDamage/100); 
//			result.addeddmgdisplaywrong = 1
		}
		else { 
			result.ctick_min = Math.floor(auras[a].data.values[2][lvl] * (1+character.cDamage/100)) ; 
			result.ctick_max = Math.floor(auras[a].data.values[3][lvl] * (1+character.cDamage/100)) ; 
//			result.addeddmgdisplaywrong = 1
		} 
	}	
//	else if (aura == "Holy Shock") { result.lDamage_min = auras[a].data.values[0][lvl]; result.lDamage_max = auras[a].data.values[1][lvl]; result.radius = 18.6; }
	else if (aura == "Holy Shock") { result.lDamage_min = auras[a].data.values[0][lvl]; result.lDamage_max = auras[a].data.values[1][lvl]; result.ltick_min = auras[a].data.values[2][lvl]; result.ltick_max = auras[a].data.values[3][lvl]; result.radius = 18.6; 
		if (character.class_name == "Sorceress") {
			result.ltick_min = Math.floor(auras[a].data.values[2][lvl] * (1 + Math.min(1,(skills[20].level+skills[20].force_levels))*(~~skills[20].data.values[1][skills[20].level+skills[20].extra_levels])/100)* (1+character.lDamage/100)) ; 
			result.ltick_max = Math.floor(auras[a].data.values[3][lvl] * (1 + Math.min(1,(skills[20].level+skills[20].force_levels))*(~~skills[20].data.values[1][skills[20].level+skills[20].extra_levels])/100)* (1+character.lDamage/100)) ; 
//			result.addeddmgdisplaywrong = 1
		}
		if (character.class_name == "Paladin") {
			result.lDamage_min = auras[a].data.values[0][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level);
			result.lDamage_max = auras[a].data.values[1][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level); 
			result.ltick_min = auras[a].data.values[2][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level) * (1+character.lDamage/100);
			result.ltick_max = auras[a].data.values[3][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level) * (1+character.lDamage/100); 
//			result.addeddmgdisplaywrong = 1
		}
		else { 
			result.ltick_min = Math.floor(auras[a].data.values[2][lvl] * (1+character.lDamage/100)) ; 
			result.ltick_max = Math.floor(auras[a].data.values[3][lvl] * (1+character.lDamage/100)) ; 
//			result.addeddmgdisplaywrong = 1
		} 
	}
//	else if (aura == "Sanctuary") { result.damage_vs_undead = auras[a].data.values[0][lvl]; result.radius = 12.6; }
	else if (aura == "Sanctuary") { 
		result.damage_vs_undead = auras[a].data.values[0][lvl]; 
		result.mtick_min = auras[a].data.values[1][lvl] * (1+character.mDamage/100); 
		result.mtick_max = auras[a].data.values[2][lvl] * (1+character.mDamage/100); 
		result.radius = 12.6; 
		if (character.class_name == "Paladin") {
			result.mtick_min = Math.floor(auras[a].data.values[1][lvl] * ((1+(0.18*skills[4].level + 0.18*skills[30].level))* (1+character.mDamage/100)));
			result.mtick_max = Math.floor(auras[a].data.values[2][lvl] * ((1+(0.18*skills[4].level + 0.18*skills[30].level))* (1+character.mDamage/100))) ; }
	}
	else if (aura == "Fanaticism") { result.radius = 12; if (source == "mercenary" || source == "golem") { result.damage_bonus = auras[a].data.values[0][lvl] } else { result.damage_bonus = auras[a].data.values[1][lvl]; result.ias_skill = auras[a].data.values[2][lvl]; result.ar_bonus = auras[a].data.values[3][lvl]; }}
	else if (aura == "Conviction") { result.enemy_defense = auras[a].data.values[0][lvl]; result.enemy_fRes = auras[a].data.values[1][lvl]; result.enemy_cRes = auras[a].data.values[1][lvl]; result.enemy_lRes = auras[a].data.values[1][lvl]; result.enemy_pRes = auras[a].data.values[1][lvl]; result.radius = 24; }
	// Others
	else if (aura == "Thorns") { result.thorns_reflect = auras[a].values[0][lvl]; result.radius = 16; }	// TOCHECK: radius is a guess - get confirmation
	else if (aura == "Inner Sight") { result.enemy_defense_flat = auras[a].values[0][lvl]; result.radius = auras[a].values[1][lvl]; }
	else if (aura == "Righteous Fire") { result.flamme = auras[a].values[0][lvl]; result.radius = 12; }		// No buffs. Deals 45% of max life as fire damage per second in a small area.
	else if (aura == "Lifted Spirit") { result.damage_bonus = auras[a].values[0][lvl]; result.fDamage = auras[a].values[0][lvl]; result.cDamage = auras[a].values[0][lvl]; result.lDamage = auras[a].values[0][lvl]; result.pDamage = auras[a].values[0][lvl]; result.radius = 16; }	// TOCHECK: radius is a guess - get confirmation
	// Paladin Synergies
	if (character.class_name == "Paladin") {
		if (aura == "Cleansing") { result.life_replenish = Math.min(1,(skills[0].level+skills[0].force_levels))*~~(skills[0].data.values[0][skills[0].level+skills[0].extra_levels]); }
		else if (aura == "Meditation") { result.life_replenish = Math.min(1,(skills[0].level+skills[0].force_levels))*~~(skills[0].data.values[0][skills[0].level+skills[0].extra_levels]); }
//		else if (aura == "Holy Fire") { 
//			result.fDamage_min = auras[a].data.values[0][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level);
//			result.fDamage_max = auras[a].data.values[1][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level); 
//			result.ftick_min = auras[a].data.values[2][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level) * (1+character.fDamage/100);
//			result.ftick_max = auras[a].data.values[3][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level) * (1+character.fDamage/100); }
//		else if (aura == "Holy Freeze") { 
//			result.cDamage_min = auras[a].data.values[0][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level);
//			result.cDamage_max = auras[a].data.values[1][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level); 
//			result.ctick_min = auras[a].data.values[2][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level) * (1+character.cDamage/100);
//			result.ctick_max = auras[a].data.values[3][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level) * (1+character.cDamage/100); }
//		else if (aura == "Holy Shock") { 
//			result.lDamage_min = auras[a].data.values[0][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level);
//			result.lDamage_max = auras[a].data.values[1][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level); 
//			result.ltick_min = auras[a].data.values[2][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level) * (1+character.lDamage/100);
//			result.ltick_max = auras[a].data.values[3][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level) * (1+character.lDamage/100); }
	}
//	Fix for aura display popup damage values
	if (result.fDamage_min !== undefined) {
	result.fDamage_min_display = result.fDamage_min * (1+character.fDamage/100);
	result.fDamage_max_display = result.fDamage_max * (1+character.fDamage/100);
	}
	if (result.cDamage_min !== undefined) {
	result.cDamage_min_display = result.cDamage_min * (1+character.cDamage/100);
	result.cDamage_max_display = result.cDamage_max * (1+character.cDamage/100);
	}
	if (result.lDamage_min !== undefined) {
	result.lDamage_min_display = result.lDamage_min * (1+character.lDamage/100);
	result.lDamage_max_display = result.lDamage_max * (1+character.lDamage/100);
	}
	if (result.mDamage_min !== undefined) {
	result.mDamage_min_display = result.mDamage_min * (1+character.mDamage/100);
	result.mDamage_max_display = result.mDamage_max * (1+character.mDamage/100);
	}

	return result;
}

// getCSkillData - gets a list of stats corresponding to the cskill (item charge-skill)
//	name: name of the skill
//	lvl: level of the skill (1+)
//	group: source item group for the skill
// result: indexed array of stats granted and their values
// ---------------------------------
function getCSkillData(name, lvl, group) {
	var result = {};
	var unit = getId(name);
	var id = unit+"-"+group;
	var skill = skills_all[effect_cskills[unit].native_class][effect_cskills[unit].i];
	// Amazon
	if (name == "Inner Sight") { result.enemy_defense_flat = skill.data.values[0][lvl]; result.radius = skill.data.values[1][lvl]; }
	else if (name == "Phase Run") { result.fhr = 30; result.velocity = 30; result.duration = skill.data.values[0][lvl]; result.reset_on_kill = skill.data.values[1][lvl]; }
	// Assassin
	else if (name == "Cloak of Shadows") { result.defense_bonus = skill.data.values[0][lvl]; result.enemy_defense = skill.data.values[1][lvl]; result.duration = 8; }
	else if (name == "Venom") { result.pDamage_min = skill.data.values[1][lvl]; result.pDamage_max = skill.data.values[2][lvl]; result.pDamage_duration = 0.4; result.pDamage_duration_override = 0.4; result.duration = skill.data.values[0][lvl]; }
	// Druid
	else if (name == "Cyclone Armor") { result.absorb_elemental = skill.data.values[0][lvl]; }
	else if (name == "Heart of Wolverine") { result.damage_bonus = skill.data.values[1][lvl]; result.ar_bonus = skill.data.values[2][lvl]; result.radius = skill.data.values[3][lvl]; }
	else if (name == "Oak Sage") { result.max_life = skill.data.values[1][lvl]; result.radius = skill.data.values[2][lvl]; }
	else if (name == "Spirit of Barbs") { result.thorns_reflect = skill.data.values[1][lvl]; result.radius = skill.data.values[2][lvl]; }
	// Necromancer
	else if (name == "Blood Golem") {
		if (effects[id].info.enabled == 1) { for (effect_id in effects) { var idName = effect_id.split("-")[0]; if (effect_id != id && (idName == "Blood_Golem" || idName == "Iron_Golem" || idName == "Clay_Golem" || idName == "Fire_Golem")) { disableEffect(effect_id) } } }
		result.life_per_ranged_hit = skill.data.values[3][lvl]; result.life_per_hit = skill.data.values[4][lvl]; result.radius = skill.data.values[5][lvl];
	}
	else if (name == "Iron Golem") {
		if (effects[id].info.enabled == 1) { for (effect_id in effects) { var idName = effect_id.split("-")[0]; if (effect_id != id && (idName == "Blood_Golem" || idName == "Iron_Golem" || idName == "Clay_Golem" || idName == "Fire_Golem")) { disableEffect(effect_id) } } }
		if (typeof(golemItem.aura) != 'undefined') { if (golemItem.aura != "") {
			var auraInfo = getAuraData(golemItem.aura, golemItem.aura_lvl, "golem");
			for (affix in auraInfo) { result[affix] = auraInfo[affix] }
		} }
	}
	else if (name == "Deadly Poison") {
		result.pDamage_min = skill.data.values[1][lvl]; result.pDamage_max = skill.data.values[2][lvl]; result.pDamage_duration = 2; result.pDamage_duration_override = 2; result.enemy_pRes = skill.data.values[3][lvl]; result.duration = skill.data.values[0][lvl];
		if (character.class_name == "Necromancer") {
			result.pDamage_min = skill.data.values[1][lvl] * (1 + (0.10*skills[15].level + 0.10*skills[19].level));
			result.pDamage_max = skill.data.values[2][lvl] * (1 + (0.10*skills[15].level + 0.10*skills[19].level));
		}
	}
	// Sorceress
	else if (name == "Enflame") {
		result.fDamage_min = skill.data.values[0][lvl]; result.fDamage_max = skill.data.values[1][lvl]; result.ar_bonus = skill.data.values[4][lvl];
		if (character.class_name == "Sorceress") {
			result.fDamage_min = skill.data.values[0][lvl] * (1 + (0.08*skills[23].level)) * (1 + Math.min(1,(skills[30].level+skills[30].force_levels))*(~~skills[30].data.values[1][skills[30].level+skills[30].extra_levels])/100);
			result.fDamage_max = skill.data.values[1][lvl] * (1 + (0.08*skills[23].level)) * (1 + Math.min(1,(skills[30].level+skills[30].force_levels))*(~~skills[30].data.values[1][skills[30].level+skills[30].extra_levels])/100);
		}
	}
	else if (name == "Warmth") {
		result.ar_bonus = skill.data.values[0][lvl]; result.mana_regen = skill.data.values[1][lvl]; 
	}
	return result;
}

// getCTCSkillData - gets a list of stats corresponding to the ctcskill (item chance-to-cast skill)
//	name: name of the skill
//	lvl: level of the skill (1+)
//	group: source item group for the skill
// result: indexed array of stats granted and their values
// ---------------------------------
function getCTCSkillData(name, lvl, group) {
	var result = {};
	var unit = getId(name);
	var effect_id = unit+"-"+group;
	var skill = skills_all[effect_ctcskills[unit].native_class][effect_ctcskills[unit].i];
	// Assassin
	if (name == "Fade") {
		if (effects[effect_id].info.enabled == 1) { for (id in effects) { if (id == "Burst_of_Speed" || id == unit) { disableEffect(id) } } }
		result.curse_length_reduced = skill.data.values[0][lvl]; result.all_res = skill.data.values[1][lvl]; result.pdr = skill.data.values[2][lvl]; result.duration = skill.data.values[3][lvl];
	}
	else if (name == "Venom") { result.pDamage_min = skill.data.values[1][lvl]; result.pDamage_max = skill.data.values[2][lvl]; result.pDamage_duration = 0.4; result.pDamage_duration_override = 0.4; result.duration = skill.data.values[0][lvl]; }
	// Amazon
	else if (name == "Molten Strike") {
		if (character.class_name == "Amazon") {
			result.fDamage_min = skill.data.values[1][lvl] * ((1 + 0.10*skills[3].level) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[2][lvl] * ((1 + 0.10*skills[3].level) * (1+character.fDamage/100)) ;
		}
		if (character.class_name != "Amazon") {
			result.fDamage_min = skill.data.values[1][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[2][lvl] * (1+character.fDamage/100) ;
		}
		moltenstext = "(" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + " phys)" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}" ; 
	}
	else if (name == "Ice Arrow") {
		if (character.class_name == "Amazon") {
			result.cDamage_min = skill.data.values[0][lvl] * (1 + (0.10*skills[20].level)) * (1+character.cDamage/100) ;
			result.cDamage_max = skill.data.values[1][lvl] * (1 + (0.10*skills[20].level)) * (1+character.cDamage/100) ;
		}
		if (character.class_name != "Amazon") {
			result.cDamage_min = skill.data.values[0][lvl] * (1+character.cDamage/100) ;
			result.cDamage_max = skill.data.values[1][lvl] * (1+character.cDamage/100) ;
		}
		icearrowtext = "(" + Math.round(result.cDamage_min) + "-" + Math.round(result.cDamage_max) + " phys)" + " {" +Math.round((result.cDamage_min+result.cDamage_max)/2) + "}" ; 
	}
	// Barb
	else if (name == "War Cry") {
		if (character.class_name == "Barbarian") {
			result.damage_min = skill.data.values[0][lvl] * (1 + 0.06*skills[0].level + 0.06*skills[2].level + 0.06*skills[5].level) ;
			result.damage_max = skill.data.values[1][lvl] * (1 + 0.06*skills[0].level + 0.06*skills[2].level + 0.06*skills[5].level) ;
		}
		if (character.class_name != "Barbarian") {
			result.damage_min = skill.data.values[0][lvl] ;
			result.damage_max = skill.data.values[1][lvl] ;
		}
		warcrytext = "(" + Math.round(result.damage_min) + "-" + Math.round(result.damage_max) + " phys)" + " {" +Math.round((result.damage_min+result.damage_max)/2) + "}"; 
	}	

	else if (name == "Cleave") {
//		if (character.class_name == "Barbarian") {
//			result.damage_min = skill.data.values[0][lvl] * (1 + 0.06*skills[0].level + 0.06*skills[2].level + 0.06*skills[5].level) ;
//			result.damage_max = skill.data.values[1][lvl] * (1 + 0.06*skills[0].level + 0.06*skills[2].level + 0.06*skills[5].level) ;
//		}
		if (character.class_name != "Barbarian") {
			result.damage_min = skill.data.values[0][lvl] ;
			result.damage_max = skill.data.values[1][lvl] ;
		}
		cleavetext = "(" + Math.round(result.damage_min) + "-" + Math.round(result.damage_max) + " phys)" + " {" +Math.round((result.damage_min+result.damage_max)/2) + "}"; 
	}	
	// Druid
	else if (name == "Cyclone Armor") { result.absorb_elemental = skill.data.values[0][lvl]; }
	else if (name == "Volcano") {
		if (character.class_name == "Druid") {
			result.damage_min = skill.data.values[0][lvl] * ((1 + 0.20*skills_all["druid"][1].level) * (1+character.physicalDamage/100)) ;
			result.damage_max = skill.data.values[1][lvl] * ((1 + 0.20*skills_all["druid"][1].level) * (1+character.physicalDamage/100)) ;
			result.fDamage_min = skill.data.values[2][lvl] * ((1 + 0.14*skills_all["druid"][4].level + 0.14*skills_all["druid"][9].level) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[3][lvl] * ((1 + 0.14*skills_all["druid"][4].level + 0.14*skills_all["druid"][9].level) * (1+character.fDamage/100)) ;
		} 
		if (character.class_name != "Druid") {
			result.damage_min = skill.data.values[0][lvl] * (1+character.physicalDamage/100) ;
			result.damage_max = skill.data.values[1][lvl] * (1+character.physicalDamage/100) ;
			result.fDamage_min = skill.data.values[2][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[3][lvl] * (1+character.fDamage/100) ;
		}
		volctext = "(" + Math.round(result.damage_min) + "-" + Math.round(result.damage_max) + " phys)" + " {" +Math.round((result.damage_min+result.damage_max)/2) + "}, "+ " (" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + " fire)" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}"; 
	}
	else if (name == "Molten Boulder") {
		if (character.class_name == "Druid") {
			result.damage_min = skill.data.values[0][lvl] * ((1 + 0.20*skills_all["druid"][7].level) * (1+character.physicalDamage/100)) ;
			result.damage_max = skill.data.values[1][lvl] * ((1 + 0.20*skills_all["druid"][7].level) * (1+character.physicalDamage/100)) ;
			result.fDamage_min = skill.data.values[2][lvl] * ((1 + 0.23*skills_all["druid"][0].level + 0.14*skills_all["druid"][9].level) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[3][lvl] * ((1 + 0.23*skills_all["druid"][0].level + 0.14*skills_all["druid"][9].level) * (1+character.fDamage/100)) ;
			result.fDamage_min2 = skill.data.values[4][lvl] * ((1 + 0.17*skills_all["druid"][0].level + 0.14*skills_all["druid"][9].level) * (1+character.fDamage/100)) ;
			result.fDamage_max2 = skill.data.values[5][lvl] * ((1 + 0.17*skills_all["druid"][0].level + 0.14*skills_all["druid"][9].level) * (1+character.fDamage/100)) ;
		} 
		if (character.class_name != "Druid") {
			result.damage_min = skill.data.values[0][lvl] * (1+character.physicalDamage/100) ;
			result.damage_max = skill.data.values[1][lvl] * (1+character.physicalDamage/100) ;
			result.fDamage_min = skill.data.values[2][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[3][lvl] * (1+character.fDamage/100) ;
			result.fDamage_min2 = skill.data.values[4][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max2 = skill.data.values[5][lvl] * (1+character.fDamage/100) ;
		}
		mbouldertext = "(" + Math.round(result.damage_min) + "-" + Math.round(result.damage_max) + " phys)" + " {" +Math.round((result.damage_min+result.damage_max)/2) + "}, "+ " (" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + " fire)" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}," + " (" + Math.round(result.fDamage_min2) + "-" + Math.round(result.fDamage_max2) + " burn)" + " {" +Math.round((result.fDamage_min2+result.fDamage_max2)/2) + "}"; 
	}
	else if (name == "Fissure") {
		if (character.class_name == "Druid") {
			result.fDamage_min = skill.data.values[0][lvl] * ((1 + 0.15*skills_all["druid"][0].level + 0.15*skills_all["druid"][7].level) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[1][lvl] * ((1 + 0.15*skills_all["druid"][0].level + 0.15*skills_all["druid"][7].level) * (1+character.fDamage/100)) ;
		} 
		if (character.class_name != "Druid") {
			result.fDamage_min = skill.data.values[0][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[1][lvl] * (1+character.fDamage/100) ;
		}
		fissuretext = "(" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + " fire)" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}"; 
	}
	else if (name == "Hurricane") {
		if (character.class_name == "Druid") {
			result.cDamage_min = skill.data.values[1][lvl] * ((1 + 0.04*skills_all["druid"][3].level + 0.04*skills_all["druid"][6].level + 0.04*skills_all["druid"][8].level) * (1+character.cDamage/100)) ;
			result.cDamage_max = skill.data.values[2][lvl] * ((1 + 0.04*skills_all["druid"][3].level + 0.04*skills_all["druid"][6].level + 0.04*skills_all["druid"][8].level) * (1+character.cDamage/100)) ;
		} 
		if (character.class_name != "Druid") {
			result.cDamage_min = skill.data.values[1][lvl] * (1+character.cDamage/100) ;
			result.cDamage_max = skill.data.values[2][lvl] * (1+character.cDamage/100) ;
		}
		hurritext = "(" + Math.round(result.cDamage_min) + "-" + Math.round(result.cDamage_max) + " cold)" + " {" +Math.round((result.cDamage_min+result.cDamage_max)/2) + "}"; 
	}
	else if (name == "Armageddon") {
		if (character.class_name == "Druid") {
			result.damage_min = skill.data.values[1][lvl] * ((1 + 0.12*skills_all["druid"][1].level) * (1+character.physicalDamage/100)) ;
			result.damage_max = skill.data.values[2][lvl] * ((1 + 0.12*skills_all["druid"][1].level) * (1+character.physicalDamage/100)) ;
			result.fDamage_min = skill.data.values[3][lvl] * ((1 + 0.12*skills_all["druid"][0].level + 0.12*skills_all["druid"][7].level) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[4][lvl] * ((1 + 0.12*skills_all["druid"][0].level + 0.12*skills_all["druid"][7].level) * (1+character.fDamage/100)) ;
		} 
		if (character.class_name != "Druid") {
			result.damage_min = skill.data.values[1][lvl] * (1+character.physicalDamage/100) ;
			result.damage_max = skill.data.values[2][lvl] * (1+character.physicalDamage/100) ;
			result.fDamage_min = skill.data.values[3][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[4][lvl] * (1+character.fDamage/100) ;
		}
		armatext = "(" + Math.round(result.damage_min) + "-" + Math.round(result.damage_max) + " phys)" + " {" +Math.round((result.damage_min+result.damage_max)/2) + "}, "+ " (" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + " fire)" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}"; 
	}
	else if (name == "Firestorm") {
		if (character.class_name == "Druid") {
			result.fDamage_min = skill.data.values[1][lvl] * ((1 + (0.30*skills[1].level + 0.30*skills[4].level)) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[2][lvl] * ((1 + (0.30*skills[1].level + 0.30*skills[4].level)) * (1+character.fDamage/100)) ;
		} 
		if (character.class_name != "Druid") {
			result.fDamage_min = skill.data.values[1][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[2][lvl] * (1+character.fDamage/100) ;
		}
		firestormtext = "(" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + " fire)" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}"; 
	}	
	// Sorceress
	else if (name == "Chilling Armor") {
		if (effects[effect_id].info.enabled == 1) { for (id in effects) { if (id == "Shiver_Armor" || id == unit) { disableEffect(id) } } }
		result.defense_bonus = skill.data.values[1][lvl]; result.duration = skill.data.values[0][lvl];
	}
	else if (name == "Blaze") { result.life_regen = 2; result.duration = skill.data.values[0][lvl]; }
	else if (name == "Enflame") {
		result.fDamage_min = skill.data.values[0][lvl]; result.fDamage_max = skill.data.values[1][lvl]; result.ar_bonus = skill.data.values[4][lvl];
		if (character.class_name == "Sorceress") {
			result.fDamage_min = skill.data.values[0][lvl] * (1 + (0.08*skills[23].level)) * (1 + Math.min(1,(skills[30].level+skills[30].force_levels))*(~~skills[30].data.values[1][skills[30].level+skills[30].extra_levels])/100);
			result.fDamage_max = skill.data.values[1][lvl] * (1 + (0.08*skills[23].level)) * (1 + Math.min(1,(skills[30].level+skills[30].force_levels))*(~~skills[30].data.values[1][skills[30].level+skills[30].extra_levels])/100);
		}
	}
	else if (name == "Discharge") {
		if (character.class_name == "Sorceress") {
			result.lDamage_min = skill.data.values[1][lvl] * ((1 + 0.03*skills_all["sorceress"][12].level + 0.03*skills_all["sorceress"][14].level + 0.01*Math.floor(((character.energy + character.all_attributes)*(1+character.max_energy/100))/2)) * (1+character.lDamage/100)) ;
			result.lDamage_max = skill.data.values[2][lvl] * ((1 + 0.03*skills_all["sorceress"][12].level + 0.03*skills_all["sorceress"][14].level + 0.01*Math.floor(((character.energy + character.all_attributes)*(1+character.max_energy/100))/2)) * (1+character.lDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
			result.lDamage_min = skill.data.values[1][lvl] * (0.01*Math.floor(((character.energy + character.all_attributes)*(1+character.max_energy/100))/2) * (1+character.lDamage/100)) ;
			result.lDamage_max = skill.data.values[2][lvl] * (0.01*Math.floor(((character.energy + character.all_attributes)*(1+character.max_energy/100))/2) * (1+character.lDamage/100)) ;
		}
		dischargetext = "(" + Math.round(result.lDamage_min) + "-" + Math.round(result.lDamage_max) + ")" + " {" +Math.round((result.lDamage_min+result.lDamage_max)/2) + "}";
	}
	else if (name == "Chain Lightning") {
		if (character.class_name == "Sorceress") {
			result.lDamage_min = skill.data.values[1][lvl] * ((1 + 0.03*skills_all["sorceress"][11].level + 0.03*skills_all["sorceress"][15].level) * (1+character.lDamage/100)) ;
			result.lDamage_max = skill.data.values[2][lvl] * ((1 + 0.03*skills_all["sorceress"][11].level + 0.03*skills_all["sorceress"][15].level) * (1+character.lDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
			result.lDamage_min = skill.data.values[1][lvl] * (1+character.lDamage/100) ;
			result.lDamage_max = skill.data.values[2][lvl] * (1+character.lDamage/100) ;
		}
		cltext = "(" + Math.round(result.lDamage_min) + "-" + Math.round(result.lDamage_max) + ")" + " {" +Math.round((result.lDamage_min+result.lDamage_max)/2) + "}";
	}
	else if (name == "Nova") {
		if (character.class_name == "Sorceress") {
			result.lDamage_min = skill.data.values[0][lvl] * ((1 + 0.03*skills_all["sorceress"][18].level) * (1+character.lDamage/100)) ;
			result.lDamage_max = skill.data.values[1][lvl] * ((1 + 0.03*skills_all["sorceress"][18].level) * (1+character.lDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
			result.lDamage_min = skill.data.values[0][lvl] * (1+character.lDamage/100) ;
			result.lDamage_max = skill.data.values[1][lvl] * (1+character.lDamage/100) ;
		}
		novatext = "(" + Math.round(result.lDamage_min) + "-" + Math.round(result.lDamage_max) + ")" + " {" +Math.round((result.lDamage_min+result.lDamage_max)/2) + "}";
	}
	else if (name == "Frozen Orb") {
		if (character.class_name == "Sorceress") {
			result.cDamage_min = skill.data.values[0][lvl] * ((1 + 0.02*skills_all["sorceress"][0].level) * (1+character.cDamage/100)) ;
			result.cDamage_max = skill.data.values[1][lvl] * ((1 + 0.02*skills_all["sorceress"][0].level) * (1+character.cDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
			result.cDamage_min = skill.data.values[0][lvl] * (1+character.cDamage/100) ;
			result.cDamage_max = skill.data.values[1][lvl] * (1+character.cDamage/100) ;
		}
		forbtext = "(" + Math.round(result.cDamage_min) + "-" + Math.round(result.cDamage_max) + ")" + " {" +Math.round((result.cDamage_min+result.cDamage_max)/2) + "}";
	}
	else if (name == "Hydra") {
		if (character.class_name == "Sorceress") {
			result.fDamage_min = skill.data.values[1][lvl] * ((1 + 0.01*skills_all["sorceress"][23].level + 0.02*skills_all["sorceress"][26].level) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[2][lvl] * ((1 + 0.01*skills_all["sorceress"][23].level + 0.02*skills_all["sorceress"][26].level) * (1+character.fDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
			result.fDamage_min = skill.data.values[1][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[2][lvl] * (1+character.fDamage/100) ;
		}
		hydratext = "(" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + ")" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}";
	}
	else if (name == "Fire Ball") {
		if (character.class_name == "Sorceress") {
			result.fDamage_min = skill.data.values[0][lvl] * ((1 + 0.06*skills_all["sorceress"][22].level + 0.06*skills_all["sorceress"][29].level) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[1][lvl] * ((1 + 0.06*skills_all["sorceress"][22].level + 0.06*skills_all["sorceress"][29].level) * (1+character.fDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
			result.fDamage_min = skill.data.values[0][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[1][lvl] * (1+character.fDamage/100) ;
		}
		fireballtext = "(" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + ")" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}";
	}
	else if (name == "Blizzard") {
		if (character.class_name == "Sorceress") {
			result.cDamage_min = skill.data.values[0][lvl] * ((1 + 0.09*skills_all["sorceress"][3].level + 0.09*skills_all["sorceress"][5].level) * (1+character.cDamage/100)) ;
			result.cDamage_max = skill.data.values[1][lvl] * ((1 + 0.09*skills_all["sorceress"][3].level + 0.09*skills_all["sorceress"][5].level) * (1+character.cDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
			result.cDamage_min = skill.data.values[0][lvl] * (1+character.cDamage/100) ;
			result.cDamage_max = skill.data.values[1][lvl] * (1+character.cDamage/100) ;
		}
		blizztext = "(" + Math.round(result.cDamage_min) + "-" + Math.round(result.cDamage_max) + ")" + " {" +Math.round((result.cDamage_min+result.cDamage_max)/2) + "}";
	}	
	else if (name == "Meteor") {
		if (character.class_name == "Sorceress") {
//			result.damage_min = skill.data.values[0][lvl] * ((1 + 0.06*skills_all["sorceress"][22].level + 0.06*skills_all["sorceress"][26].level) * (1+character.physicalDamage/100)) ;
//			result.damage_max = skill.data.values[1][lvl] * ((1 + 0.06*skills_all["sorceress"][22].level + 0.06*skills_all["sorceress"][26].level) * (1+character.physicalDamage/100)) ;
			result.fDamage_min = skill.data.values[0][lvl] * ((1 + 0.06*skills_all["sorceress"][22].level + 0.06*skills_all["sorceress"][26].level) * (1+character.fDamage/100)) ;
			result.fDamage_max = skill.data.values[1][lvl] * ((1 + 0.06*skills_all["sorceress"][22].level + 0.06*skills_all["sorceress"][26].level) * (1+character.fDamage/100)) ;
			result.fDamage_min2 = skill.data.values[2][lvl] * ((1 + 0.03*skills_all["sorceress"][24].level) * (1+character.fDamage/100)) ;
			result.fDamage_max2 = skill.data.values[3][lvl] * ((1 + 0.03*skills_all["sorceress"][24].level) * (1+character.fDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
//			result.damage_min = skill.data.values[0][lvl] * (1+character.physicalDamage/100) ;
//			result.damage_max = skill.data.values[1][lvl] * (1+character.physicalDamage/100) ;
			result.fDamage_min = skill.data.values[0][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max = skill.data.values[1][lvl] * (1+character.fDamage/100) ;
			result.fDamage_min2 = skill.data.values[2][lvl] * (1+character.fDamage/100) ;
			result.fDamage_max2 = skill.data.values[3][lvl] * (1+character.fDamage/100) ;
		}
//		meteotext = "(" + Math.round(result.damage_min) + "-" + Math.round(result.damage_max) + " phys)" + " {" +Math.round((result.damage_min+result.damage_max)/2) + "}, "+ " (" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + " fire)" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}"; 
		meteotext = "(" + Math.round(result.fDamage_min2) + "-" + Math.round(result.fDamage_max2) + " fire)" + " {" +Math.round((result.fDamage_min2+result.fDamage_max2)/2) + "}, "+ " (" + Math.round(result.fDamage_min) + "-" + Math.round(result.fDamage_max) + " fire over time)" + " {" +Math.round((result.fDamage_min+result.fDamage_max)/2) + "}"; 
	}
	else if (name == "Glacial Spike") {
		if (character.class_name == "Sorceress") {
			result.cDamage_min = skill.data.values[0][lvl] * ((1 + (0.08*skills_all["sorceress"][0].level + 0.08*skills_all["sorceress"][3].level + 0.08*skills_all["sorceress"][7].level + 0.08*skills_all["sorceress"][9].level)) * (1+character.cDamage/100)) ;
			result.cDamage_max = skill.data.values[1][lvl] * ((1 + (0.08*skills_all["sorceress"][0].level + 0.08*skills_all["sorceress"][3].level + 0.08*skills_all["sorceress"][7].level + 0.08*skills_all["sorceress"][9].level)) * (1+character.cDamage/100)) ;
		} 
		if (character.class_name != "Sorceress") {
			result.cDamage_min = skill.data.values[0][lvl] * (1+character.cDamage/100) ;
			result.cDamage_max = skill.data.values[1][lvl] * (1+character.cDamage/100) ;
		}
		glacialtext = "(" + Math.round(result.cDamage_min) + "-" + Math.round(result.cDamage_max) + ")" + " {" +Math.round((result.cDamage_min+result.cDamage_max)/2) + "}";
	}	
	else if (name == "Static Field") {
		staticftext = ""
	}		
	
	// Necromancer
	else if (name == "Flesh Offering") { result.duration = skill.data.values[0][lvl]; result.radius = skill.data.values[1][lvl]; }	// TODO: implement for summons: result.fcr = skill.data.values[2][lvl]; result.ias_skill = skill.data.values[3][lvl]; result.velocity = skill.data.values[4][lvl]; 
	else if (name == "Poison Nova") {
		if (character.class_name == "Necromancer") {
			result.pDamage_min = skill.data.values[0][lvl] * ((1 + 0.13*skills_all["necromancer"][11].level + 0.13*skills_all["necromancer"][15].level) * (1+character.pDamage/100)) ;
			result.pDamage_max = skill.data.values[1][lvl] * ((1 + 0.13*skills_all["necromancer"][11].level + 0.13*skills_all["necromancer"][15].level) * (1+character.pDamage/100)) ;
		} 
		if (character.class_name != "Necromancer") {
			result.pDamage_min = skill.data.values[0][lvl] * (1+character.pDamage/100) ;
			result.pDamage_max = skill.data.values[1][lvl] * (1+character.pDamage/100) ;
		}
		pnovatext = "(" + Math.round(result.pDamage_min) + "-" + Math.round(result.pDamage_max) + ")" + " {" +Math.round((result.pDamage_min+result.pDamage_max)/2) + "}";
	}
	return result;
}

// getMiscData - gets a list of stats corresponding to the miscellaneous effect (shrine/potion)
//	name: name of selected misc effect
//	index: index of the selected misc element
// return: affixes of the misc element
// ---------------------------------
function getMiscData(name, index) {
	var result = {};
	for (affix in non_items[index]) { if (affix != "i" && affix != "name" && affix != "recharge" && affix != "effect") {
		result[affix] = non_items[index][affix]
	} }
	return result
}



//=========================================================================================================================
// FILE SAVE AND LOAD ....
//=========================================================================================================================

/* Functions:
	getCharacterInfo
	saveTextAsFile
	destroyClickedElement
	loadFileAsText
	parseFile
	setCharacterInfo
*/

// getCharacterInfo - Gets character info and converts it to text format
// return: the formatted text
// ---------------------------------
function getCharacterInfo() {
	var not_applicable = [
		0,1,2,3,	// TODO: Fix, these should never be variable names (is an array being treated as a regular variable somewhere?)
		'getSkillData','getBuffData','getSkillDamage','setSkillAmounts','skill_layout','weapon_frames','wereform_frames','fcr_bp','fcr_bp_alt','fcr_bp_werebear','fcr_bp_werewolf','fhr_bp','fhr_bp_alt','fhr_bp_werebear','fhr_bp_werewolf','fbr_bp','fbr_bp_alt','fbr_bp_werebear','fbr_bp_werewolf',
		'name','type','rarity','not','only','ctc','cskill','set_bonuses','group','size','upgrade','downgrade','aura','tier','weapon','armor','shield','max_sockets','duration','nonmetal','debug'	// TODO: Prevent item qualities from being added as character qualities
	];
	var charInfo = "{version:"+game_version+",character:{";
	for (stat in character) {
		var halt = 0;
		for (let i = 0; i < not_applicable.length; i++) { if (stat == not_applicable[i]) { halt = 1 } }
		if (isNaN(Number(stat)) == false && character[stat] == "undefined") { halt = 1 }	// TODO: determine why numbers are being added to character (especially 0,1,2,3 which are being defined as NaN instead of just undefined)
		if ((typeof(unequipped[stat]) != 'undefined' && character[stat] == unequipped[stat]) || unequipped[stat] == "") { halt = 1 }
		if (halt == 0 || stat == "statpoints" || stat == "strength_added" || stat == "dexterity_added" || stat == "vitality_added" || stat == "energy_added" || stat == "strength" || stat == "dexterity" || stat == "vitality" || stat == "energy" || stat == "life" || stat == "mana" || stat == "stamina" || stat == "mana_regen") { charInfo += (stat+":"+character[stat]+",") }
	}
	charInfo += "},skills:["
	for (let s = 0; s < skills.length; s++) { charInfo += "["+skills[s].level+","+skills[s].extra_levels+","+skills[s].force_levels+"]," }
	charInfo += "],equipped:{"
	for (group in corruptsEquipped) { charInfo += (group+":{name:"+equipped[group].name+",tier:"+equipped[group].tier+"},") }
	charInfo += "charms:["
	for (charm in equipped.charms) { if (typeof(equipped.charms[charm].name) != 'undefined' && equipped.charms[charm].name != 'none') { charInfo += "'"+equipped.charms[charm].name+"'," } }
	charInfo += "]},corruptsEquipped:{"
	for (group in corruptsEquipped) { charInfo += (group+":{name:'"+corruptsEquipped[group].name+"'},") }
	charInfo += "},mercEquipped:{"
	for (group in mercEquipped) { charInfo += (group+":{name:'"+mercEquipped[group].name+"'},") }
	charInfo += "},socketed:{"
	for (group in socketed) {
		charInfo += group+":["
		for (let i = 0; i < socketed[group].items.length; i++) { charInfo += ("name:{'"+socketed[group].items[i].name+"'},") }
		charInfo += "],"
	}
	charInfo += "},effects:{"
	for (id in effects) { if (typeof(effects[id].info.enabled) != 'undefined') {
		charInfo += (id+":{enabled:"+effects[id].info.enabled+",snapshot:"+effects[id].info.snapshot)
		if (effects[id].info.snapshot == 1) {
			charInfo += (",origin:"+effects[id].info.origin+",index:"+effects[id].info.index)
			for (affix in effects[id]) { if (affix != "info") {
				charInfo += (","+affix+":"+effects[id][affix])
			} }
		}
		charInfo += "},"
	} }
	charInfo += "},selectedSkill:["+selectedSkill[0]+","+selectedSkill[1]
	charInfo += "],mercenary:'"+mercenary.name+"'"
	charInfo += ",settings:{coupling:"+settings.coupling+",autocast:"+settings.autocast+",synthwep:"+settings.synthwep
	charInfo += "},ironGolem:"+golemItem.name
	charInfo += "}"
//	document.getElementById("fhr_bp").innerHTML = charInfo.fhr_bp
	return charInfo
}

// saveTextAsFile - Saves the current character info as a text file
// ---------------------------------
function saveTextAsFile() {
	document.getElementById("inputTextToSave").value = getCharacterInfo().split(",}").join("}").split(",]").join("]")
	fileText = getCharacterInfo().split(",}").join("}").split(",]").join("]")

	var textToSave = document.getElementById("inputTextToSave").value;
	var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
	var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
	
	var file_prefix = "";
	if (game_version == 2) { file_prefix = "pod_" }
	else if (game_version == 3) { file_prefix = "pd2_" }
	var downloadLink = document.createElement("a");
	downloadLink.download = file_prefix+character.class_name.toLowerCase();
	downloadLink.innerHTML = "Download File";
	downloadLink.href = textToSaveAsURL;
	downloadLink.onclick = destroyClickedElement;
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);

	downloadLink.click();
	document.getElementById("inputTextToSave").value = ""
}

// destroyClickedElement - removes the file window popup (after save)
// ---------------------------------
function destroyClickedElement(event) {
	document.body.removeChild(event.target);
}

// loadFileAsText - Loads character info from a text file
// ---------------------------------
function loadFileAsText() {
	var fileToLoad = document.getElementById("fileToLoad").files[0];
	var textFromFileLoaded = "";
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		textFromFileLoaded = fileLoadedEvent.target.result;
		document.getElementById("inputTextToSave").value = fileLoadedEvent.target.result;
		parseFile(textFromFileLoaded)
		setCharacterInfo(fileInfo.character.class_name.toLowerCase())
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}

// parseFile - Processes the text and converts it back to useable data
//	file: text from file
// ---------------------------------
function parseFile(file) {
	fileInfo = {character:{class_name:""},skills:[],equipped:{charms:[]},corruptsEquipped:{},mercEquipped:{},socketed:{helm:[],armor:[],weapon:[],offhand:[]},effects:{},selectedSkill:["",""],mercenary:"",settings:{},ironGolem:""};	// reset fileInfo
	
	if (file.includes("version:")) {
		var new_version = file.split("version:")[1].split(",character:")[0];
		fileInfo.version = ~~new_version
	}
	var new_character = file.split("character:{")[1].split("},skills:")[0].split(",");
	for (let i = 0; i < new_character.length; i++) {
		var split = new_character[i].split(":");
		var val = split[1];
		if (isNaN(Number(val)) == false) { val = Number(val) }
		fileInfo.character[split[0]] = val
	}
	var new_skills = file.split("skills:[[")[1].split("]],equipped:")[0].split("],[");
	for (let s = 0; s < new_skills.length; s++) {
		if (typeof(fileInfo.skills[s]) == 'undefined') { fileInfo.skills[s] = [] }
		fileInfo.skills[s][0] = ~~new_skills[s].split(",")[0]
		fileInfo.skills[s][1] = ~~new_skills[s].split(",")[1]
		fileInfo.skills[s][2] = ~~new_skills[s].split(",")[2]
	}
	var new_equipped = file.split("equipped:{")[1].split("},charms:")[0].split("},");
	for (let e = 0; e < new_equipped.length; e++) {
		var group = new_equipped[e].split(":{")[0];
		var stats = new_equipped[e].split(":{")[1].split(",");
		fileInfo.equipped[group] = {}
		for (let i = 0; i < stats.length; i++) {
			var stat = stats[i].split(":")[0];
			var value = stats[i].split(":")[1];
			fileInfo.equipped[group][stat] = value
		}
	}
	var new_corruptions = file.split("corruptsEquipped:{")[1].split(",mercEquipped:")[0].split(",");
	for (let e = 0; e < new_corruptions.length; e++) {
		var group = new_corruptions[e].split(":{")[0];
		var name = new_corruptions[e].split("name:'")[1].split("'}")[0];
		fileInfo.corruptsEquipped[group] = {}
		fileInfo.corruptsEquipped[group].name = name
	}
	var new_socketed = file.split("socketed:{")[1].split("},effects:")[0].split("],");
	for (let g = 0; g < new_socketed.length; g++) {
		var group = new_socketed[g].split(":[")[0];
		var new_socketedGroup = new_socketed[g].split(":[")[1].split("'},");
		for (let i = 0; i < new_socketedGroup.length; i++) {
			var name = new_socketedGroup[i].split(":{'")[1].split("'}")[0];
			fileInfo.socketed[group][i] = name
		}
	}
	var new_effects = file.split("effects:{")[1].split("},selectedSkill:")[0];
	if (new_effects != "") {
		new_effects = file.split("effects:{")[1].split("}},selectedSkill:")[0].split("},");
		for (let i = 0; i < new_effects.length; i++) {
			var id = new_effects[i].split(":{")[0];
			var stats = new_effects[i].split(":{")[1].split(",")
			fileInfo.effects[id] = {}
			fileInfo.effects[id].info = {}
			for (let t = 0; t < stats.length; t++) {
				var stat = stats[t].split(":")[0];
				var value = stats[t].split(":")[1];
				if (stat == "enabled" || stat == "snapshot" || stat == "index") {
					fileInfo.effects[id].info[stat] = ~~value
				} else if (stat == "origin") {
					fileInfo.effects[id].info[stat] = value
				} else {
					fileInfo.effects[id][stat] = ~~value
				}
			}
		}
	}
	var new_mercenary = file.split("mercenary:'")[1].split("',settings:")[0];
	fileInfo.mercenary = new_mercenary
	var new_mercEquipped = file.split("mercEquipped:{")[1].split("},socketed:")[0].split(",");
	for (let e = 0; e < new_mercEquipped.length; e++) {
		var group = new_mercEquipped[e].split(":{name:'")[0];
		var name = new_mercEquipped[e].split(":{name:'")[1].split("'}")[0];
		fileInfo.mercEquipped[group] = {}
		fileInfo.mercEquipped[group].name = name
	}
	var new_selectedSkill = file.split("selectedSkill:[")[1].split("],mercenary:")[0].split(",");
	fileInfo.selectedSkill[0] = new_selectedSkill[0]
	fileInfo.selectedSkill[1] = new_selectedSkill[1]
	var new_settings = file.split("settings:{")[1].split("},ironGolem")[0].split(",");
	for (let i = 0; i < new_settings.length; i++) {
		var setting = new_settings[i].split(":")[0];
		var value = new_settings[i].split(":")[1];
		fileInfo.settings[setting] = value
	}
	var new_charms = file.split("charms:[")[1].split("]},corruptsEquipped:")[0]
	if (new_charms.length > 0) {
		new_charms = file.split("charms:['")[1].split("']},corruptsEquipped:")[0].split("','");
		for (let i = 0; i < new_charms.length; i++) { fileInfo.equipped.charms[i] = new_charms[i] }
	}
	var new_golem = file.split("ironGolem:")[1].split("}")[0];
	fileInfo.ironGolem = new_golem
}

// setCharacterInfo - Sets character info from loaded text
//	className: name of character class
// ---------------------------------
function setCharacterInfo(className) {
	if (typeof(fileInfo.version) == 'undefined') { changeVersion(2,className) }
	else { changeVersion(fileInfo.version,className) }
	startup(className)
	if (settings.coupling == 0) { document.getElementById("coupling").checked = true; toggleCoupling(document.getElementById("coupling")); }
	if (settings.autocast == 0) { document.getElementById("autocast").checked = true; toggleAutocast(document.getElementById("autocast")); }
	if (settings.synthwep == 0) { document.getElementById("synthwep").checked = true; toggleSynthwep(document.getElementById("synthwep")); }
	if (character.difficulty != fileInfo.character.difficulty) { document.getElementById("difficulty3").checked = false; document.getElementById("difficulty"+fileInfo.character.difficulty).checked = true; changeDifficulty(fileInfo.character.difficulty) }
	if (character.running != fileInfo.character.running) { document.getElementById("running").checked = true; toggleRunning(document.getElementById("running")) }
	if (character.quests_completed != fileInfo.character.quests_completed) { document.getElementById("quests").checked = true; toggleQuests(document.getElementById("quests")) }
	for (let s = 0; s < skills.length; s++) { if (~~fileInfo.skills[s][0] > 0) { skillUp(null,skills[s],~~fileInfo.skills[s][0]) } }
	skillOut()
	for (group in corruptsEquipped) {	// equipment
		var options = document.getElementById("dropdown_"+group).options;
		for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == fileInfo.equipped[group].name) {  document.getElementById("dropdown_"+group).selectedIndex = i } }
		equip(group,fileInfo.equipped[group].name)
	}
	for (group in corruptsEquipped) {	// corruptions
		var options = document.getElementById("corruptions_"+group).options;
		for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == fileInfo.corruptsEquipped[group].name) {  document.getElementById("corruptions_"+group).selectedIndex = i } }
		corrupt(group,fileInfo.corruptsEquipped[group].name)
	}
	for (group in corruptsEquipped) {	// upgrades & downgrades
		var baseDiff = ~~fileInfo.equipped[group].tier - ~~equipped[group].tier;
		if (baseDiff < 0) { changeBase(group, "downgrade"); equipmentOut(); }
		if (baseDiff > 0) { changeBase(group, "upgrade"); equipmentOut(); }
	}
	for (group in corruptsEquipped) {	// upgrades & downgrades (duplicated)
		var baseDiff = ~~fileInfo.equipped[group].tier - ~~equipped[group].tier;
		if (baseDiff < 0) { changeBase(group, "downgrade"); equipmentOut(); }	// duplicated (things break for some reason when a while/for loop is used instead)
		if (baseDiff > 0) { changeBase(group, "upgrade"); equipmentOut(); }		// duplicated (things break for some reason when a while/for loop is used instead)
	}
	character.level = fileInfo.character.level
	//for (let i = 1; i < fileInfo.character.level, i++) { changeLevel(null,1) }
	setMercenary(fileInfo.mercenary)
	for (group in mercEquipped) {
		if (fileInfo.mercEquipped[group].name != 'none') {
			var options = document.getElementById("dropdown_merc_"+group).options;
			for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == fileInfo.mercEquipped[group].name) {  document.getElementById("dropdown_merc_"+group).selectedIndex = i } }
			equipMerc(group,fileInfo.mercEquipped[group].name)
		}
	}
	for (group in fileInfo.socketed) { for (let i = 0; i < fileInfo.socketed[group].length; i++) { if (fileInfo.socketed[group][i] != "") { addSocketable(fileInfo.socketed[group][i]); inv[tempSetup].load = group; tempSetup = 0; } } }
	for (let s = 1; s < inv[0].in.length; s++) { if (inv[s].empty != 1) { inv[0].onpickup = inv[0].in[s]; handleSocket(null,inv[s].load,s); } }	// socketables get moved to equipment
	for (effect in fileInfo.effects) { for (let i = 1; i < non_items.length; i++) {
		if (effect == non_items[i].effect) { addEffect('misc',non_items[i].name,i,'') }
	} }
	for (let i = 0; i < fileInfo.equipped.charms.length; i++) { addCharm(fileInfo.equipped.charms[i]) }
	for (let s = 0; s < skills.length; s++) { skills[s].level = ~~fileInfo.skills[s][0]; skills[s].extra_levels = ~~fileInfo.skills[s][1]; skills[s].force_levels = ~~fileInfo.skills[s][2]; }
	var options = document.getElementById("dropdown_golem").options;
	for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == fileInfo.ironGolem) { document.getElementById("dropdown_golem").selectedIndex = i } }
	setIronGolem(fileInfo.ironGolem)
	selectedSkill[0] = fileInfo.selectedSkill[0]
	selectedSkill[1] = fileInfo.selectedSkill[1]
	for (effect in fileInfo.effects) { if (typeof(fileInfo.effects[effect].info.snapshot) != 'undefined') { if (fileInfo.effects[effect].info.snapshot == 1) {
		var active = 0;
		var new_effect = 0;
		if (typeof(effects[effect]) != 'undefined') {
			if (fileInfo.effects[effect].info.enabled == 1) { active = 1; toggleEffect(effect); }
		} else {	// add temporary levels
			new_effect = 1;
			var info = fileInfo.effects[effect].info;
			if (info.origin == "skill") { skills[info.index].level += 1 }
			if (info.origin == "oskill") { character["oskill_"+effect] += 1 }
			addEffect(info.origin,effect.split('_').join(' '),info.index,"")	// addEffect() doesn't work with zero skill levels, so this implementation is 'hacky'
			if (fileInfo.effects[effect].info.enabled == 1) { active = 1; toggleEffect(effect); }
		}
			effects[effect].info.snapshot = 1;
			document.getElementById(effect+"_ss").src = "./images/skills/snapshot.png";
			for (affix in fileInfo.effects[effect]) { if (affix != "info") {
				effects[effect][affix] = fileInfo.effects[effect][affix]
			} }
			if (active == 1) { toggleEffect(effect) }
			if (new_effect == 1) {	// remove temporary levels
				var info = fileInfo.effects[effect].info;
				if (info.origin == "skill") { skills[info.index].level -= 1 }
				if (info.origin == "oskill") { character["oskill_"+effect] -= 1 }
			}
	} } }
	if (effects != {}) { for (effect in effects) { if (typeof(effects[effect].info.enabled) != 'undefined') { if (fileInfo.effects[effect].info.enabled != effects[effect].info.enabled) { toggleEffect(effect) } } } }
	for (stat in fileInfo.character) { character[stat] = fileInfo.character[stat] }
	if (settings.coupling != fileInfo.settings.coupling) { if (settings.coupling == 1) { document.getElementById("coupling").checked = false }; toggleCoupling(document.getElementById("coupling")) }
	if (settings.autocast != fileInfo.settings.autocast) { if (settings.autocast == 1) { document.getElementById("autocast").checked = false }; toggleAutocast(document.getElementById("autocast")) }
	if (settings.synthwep != fileInfo.settings.synthwep) { if (settings.synthwep == 1) { document.getElementById("synthwep").checked = false }; toggleSynthwep(document.getElementById("synthwep")) }
	//updateStats()
	document.getElementById("inputTextToSave").value = ""
	update()
	var class_names = ["","amazon","assassin","barbarian","druid","necromancer","paladin","sorceress"];
	for (let c = 1; c < class_names.length; c++) { if (character.class_name.toLowerCase() == class_names[c]) { document.getElementById("dropdown_class").selectedIndex = c } }
}



//=========================================================================================================================
// INVENTORY ....
//=========================================================================================================================

/* Functions:
	getItemImage
	itemSelect
	socketableSelect
	itemHover
	itemOut
	equipmentHover
	equipmentOut
	getAffixLine
	inventoryLeftClick
	inventoryRightClick
	changeBase
*/

// getItemImage - gets the image filename for the specified item
//	group: item's group
//	base_name: item base (use "" if none)
//	source: specified file name, if it has one (use "" if none)
// return: filename of item's image
// ---------------------------------
function getItemImage(group, base_name, source) {
	var prefix = "./images/items/"
	var filename = source
	var base = getBaseId(base_name);
	if (base_name != "") {
		if (base_name == "Bolts") { prefix += group + "/" }	// only bolts have explicit bases so far (other quivers are assumed to be arrows) ...but importantly, neither are included in bases[]
		else {
			prefix += (bases[base].group + "/")
			if (bases[base].group == "weapon") {
				var type = equipped[group].type;
				if (type == "hammer" || type == "club") { type = "mace" }
				prefix += (type + "/")
			}
		}
		if (source != "") {
			prefix += "special/"
		} else {
			if (base_name == "Tiara" || base_name == "Diadem" || base_name == "Bolts") {
				filename = base_name
			} else {
				if (typeof(bases[base].downgrade) != 'undefined') {
					filename = bases[base].downgrade
					base = getBaseId(bases[base].downgrade)
					if (typeof(bases[base].downgrade) != 'undefined') {
						filename = bases[base].downgrade
					}
				} else {
					filename = base_name
				}
			}
		}
	} else {
		// quest weapons, unique quiver/jewelry
		if (source != "") {
			if (group == "weapon" || (group == "offhand" && offhandType == "weapon")) {
				var type = equipped[group].type;
				if (type == "hammer" || type == "club") { type = "mace" }
				prefix += ("weapon/" + type + "/special/")
			} else {
				if (group == "amulet") { prefix += "amulet/" }
				else {	prefix += (group + "/special/") }
			}
		// jewelry, quivers (arrows)
		} else {
			if (group == "amulet" || group == "ring1" || group == "ring2") {
				if (group == "amulet") { prefix += "amulet/"; filename = "Amulet_" + Math.ceil(Math.random() * 3); }
				else { prefix += "ring/"; filename = "Ring_" + Math.ceil(Math.random() * 5); }
			} else if (group == "offhand") {
				prefix += "offhand/"; filename = "Arrows";
			}
		}
	}
	filename = prefix + filename.split(" ").join("_") + ".png"
	return filename
}

// itemSelect - Duplicates the selected charm
//	id: unique string identifier for charm
// ---------------------------------
function itemSelect(ev) {
	var dup = 0;
	if (ev.shiftKey) { dup = 1 }
	if (ev.ctrlKey) { dup = 10 }
	if (dup > 0) {
		if (name != "Annihilus" && name != "Hellfire Torch" && name != "Gheed's Fortune") {
			for (let d = 0; d < dup; d++) {
				addCharm(lastCharm)
			}
		}
	}
}

// socketableSelect - Duplicates the selected socketable item (gem, rune, jewel)
// ---------------------------------
function socketableSelect(ev) {
	var dup = 0;
	if (ev.shiftKey) { dup = 1 }
	if (ev.ctrlKey) { dup = 10 }
	if (dup > 0) { for (let d = 0; d < dup; d++) { addSocketable(lastSocketable) } }
}

// itemHover - Shows item tooltip on mouse-over for Charm Inventory
//	id: unique string identifier for item
// ---------------------------------
function itemHover(ev, id) {
	var base = "";
	var type = "charm";
	var index = 0;
	var transfer = 0;
	var color = "White";
	for (let i = 1; i < inv.length; i++) { if (inv[i].id == id) { transfer = i } }
	var val = inv[0]["in"][transfer];
	var name = val.split("_")[0];
	var height = 1;

	if (typeof(equipped["charms"][val]) == 'undefined') { for (let k = 0; k < socketables.length; k++) { if (socketables[k].name == name) { type = socketables[k].type; index = k; } } }
	if (type == "charm") {
		//name = equipped.charms[val].name
		color = "Indigo"
		if (name == "Annihilus" || name == "Hellfire Torch" || name == "Gheed's Fortune" || name == "Horadric Sigil") { color = "Gold" }
		if (equipped["charms"][val].size != "small" && equipped["charms"][val].size != "large" && equipped["charms"][val].size != "grand") { color = "Red" }
		lastCharm = name
		if (equipped["charms"][val].size == "large") { height = 2; base = "<br>Large Charm"; }
		else if (equipped["charms"][val].size == "grand") { height = 3; base = "<br>Grand Charm"; }
		else { base = "<br>Small Charm" }
		if (name.substr(0,3) == "+1 " && height == 3) { name = name.substr(3) }
		if (equipped["charms"][val].rarity == "magic" || equipped["charms"][val].debug == 1) { base = "" }
	} else {
		if (type == "rune") { color = "Orange" }
		else if (socketables[index].rarity == "unique") { color = "Gold" }
		else if (socketables[index].rarity == "magic") { color = "Blue" }
		else if (socketables[index].rarity == "rare") { color = "Yellow" }
		lastSocketable = name
		name = name.split(" (")[0]
		if (type == "jewel" && socketables[index].rarity != "magic") { base = "<br>Jewel" }
	}

	var cell_x = id[1]-1; if (cell_x == -1) { cell_x = 9 }
	var cell_y = id[2]-1 + height;
	var offset_x = 350;
	var offset_y = 433;
	if (game_version != 2) { offset_y = 313 }
	offset_x += (10+cell_x*28)
	offset_y += (124+cell_y*29)
	var main_affixes = "";
	var affixes = "";
	if (type == "charm" && name != "+1 (each) skill") {
		affixes = ""
		for (affix in equipped["charms"][val]) {
			if (stats[affix] != unequipped[affix] && stats[affix] != 1) {
				var affix_info = getAffixLine(affix,"charms",val,"");
				if (affix_info[1] != 0) {
					if (affix == "req_level") { main_affixes += affix_info[0]+"<br>" }
					else { affixes += affix_info[0]+"<br>" }
				}
			}
		}
	} else if (type == "jewel" || type == "rune" || type == "gem" || type == "other") {
		for (affix in socketables[index]) {
			if (stats[affix] != unequipped[affix] && stats[affix] != 1) {
				var affix_info = getAffixLine(affix,"socketables",index,"");
				if (affix_info[1] != 0) {
					if (affix == "req_level") { main_affixes += affix_info[0]+"<br>" }
					else { affixes += affix_info[0]+"<br>" }
				}
			}
		}
		for (affix in socketables[index]) { if (affix == "weapon" || affix == "armor" || affix == "shield") {
			affixes += (affix[0].toUpperCase()+affix.slice(1)+":<br>")
			for (affix_sub in socketables[index][affix]) { if (affix_sub != "pDamage_duration") {	// why does it break with pDamage_duration?
				var affix_info = getAffixLine(affix_sub,"socketables",index,affix);
				if (affix_info[1] != 0) { affixes += affix_info[0]+"<br>" }
			} }
		} }
	}
	document.getElementById("item_name").style.color = colors[color]
	document.getElementById("item_name").innerHTML = name+base
	document.getElementById("item_info").innerHTML = main_affixes
	document.getElementById("item_corruption").innerHTML = ""
	document.getElementById("item_affixes").innerHTML = affixes
	document.getElementById("item_set_affixes").innerHTML = ""
	document.getElementById("item_socketed_affixes").innerHTML = ""
	document.getElementById("item_group_affixes").innerHTML = ""
	document.getElementById("tooltip_inventory").style.display = "block"
	var wid = Math.floor(document.getElementById("tooltip_inventory").getBoundingClientRect().width/2);
	document.getElementById("tooltip_inventory").style.top = offset_y+"px"
	document.getElementById("tooltip_inventory").style.left = (offset_x-wid)+"px"
	if (name == "") { document.getElementById("tooltip_inventory").style.left = 950+"px" }
	
	// TODO better system:
	
	// start with cell divs at high z-index
	// on mouseover, use cell info...
	// if cell is not empty
	//	if cell is not main-cell of occupying item			// main-cell: top cell when traversing inv[].in
	//		lower z-index of cell  (pushes the item above, so it can be grabbed while all its other individual cells are surfaced)
	// then, 
	// on mouseout: raise z-level of cell 
	//
	// ...this should fix the bug that prevents charms from being moved into an overlapping space below themselves (or to the right for future items wider than 1 space)
	
}

// itemOut - hides item tooltip for Charm Inventory
// ---------------------------------
function itemOut() {
	document.getElementById("tooltip_inventory").style.display = "none"
}

// equipmentHover - shows equipment info on mouse-over
//	group: equipment group name
// ---------------------------------
function equipmentHover(group) {
	var offset_x = 350;
	var offset_y = 433;
	var groupId = group;
	if (group == "helm" || group == "armor" || group == "weapon" || group == "offhand") { groupId += "_" }
	var name = "";
	var sock = "";
	var base = "";
	if (equipped[group].name != "none" && (group == "helm" || group == "armor" || (group == "weapon" && equipped[group].type != "javelin" && equipped[group].type != "thrown") || (group == "offhand" && equipped[group].type != "quiver"))) {
		var sockets = ~~corruptsEquipped[group].sockets + ~~equipped[group].sockets;
		sockets = Math.min(sockets,equipped[group].max_sockets)
		if (socketed[group].sockets > 0 || equipped[group].sockets > 0) {
			if (corruptsEquipped[group].name == "none") { sock = "<font color='"+colors.Gray+"'> ["+sockets+"]</font>" }
			else { sock = "<font color='"+colors.Red+"'> ["+sockets+"]</font>" }
		}
	}
	if (typeof(equipped[group].base) != 'undefined' && equipped[group].base != "") { base = equipped[group].base }
	else if (equipped[group].name != "none" && (group == "ring1" || group == "ring2")) { base = "Ring" }
	else if (equipped[group].name != "none" && group == "amulet") { base = "Amulet" }
	else if (equipped[group].type == "quiver") { base = "Arrows" }
	else if (equipped[group].type == "jewel") { base = "Jewel" }
	else if (equipped[group].size == "small") { base = "Small Charm" }
	else if (equipped[group].size == "large") { base = "Large Charm" }
	else if (equipped[group].size == "grand") { base = "Grand Charm" }
	
	if (equipped[group].name != "none") { name = equipped[group].name.split(" ­ ")[0].split(" (")[0]; }
	if (base.split("_")[0] != "Special") { base = "<br>"+base }
	if (equipped[group].rarity == "common" || equipped[group].rarity == "magic") { base = "" }
	var corruption = "";
	var affixes = "";
	var main_affixes = "";
	var socketed_affixes = "";
	var set_affixes = "";
	var set_group_affixes = "";
//	if (equipped[group].name === "Custom Amulet") {
//		equipped[group].affixes += "all_skills[15]";
//	}

	if (equipped[group].name != "none" && corruptsEquipped[group].name != "none") {
		for (affix in corruptsEquipped[group]) {
			if (stats[affix] != unequipped[affix] && stats[affix] != 1) {
				var halt = 0; if (affix == "sockets" && corruptsEquipped[group].name != "+ Sockets") { halt = 1; }
				var affix_info = getAffixLine(affix,"corruptsEquipped",group,"");
				if (affix_info[1] != 0 && halt == 0) { corruption += affix_info[0]+"<br>" }
			}
		}
	}
	for (affix in equipped[group]) {
		if (character.class_name === "Paladin")
		{	
		if (equipped[group][affix] != unequipped[affix] && stats[affix] != unequipped[affix] && stats[affix] != 1 && affix != "velocity") {
			var affix_info = getAffixLine(affix,"equipped",group,"");
			if (affix_info[1] != 0) {
				if (affix == "base_damage_min" || affix == "base_defense" || affix == "req_level" || affix == "req_strength" || affix == "req_dexterity" || affix == "durability" || affix == "baseSpeed" || affix == "range" || affix == "throw_min" || affix == "base_min_alternate" || affix == "block" || affix == "velocity" || affix == "smite_min") { main_affixes += affix_info[0]+"<br>" }
				else { affixes += affix_info[0]+"<br>" }
			}
		}
		}
		else{
		if (equipped[group][affix] != unequipped[affix] && stats[affix] != unequipped[affix] && stats[affix] != 1 && affix != "velocity" && affix != "smite_min") {
			var affix_info = getAffixLine(affix,"equipped",group,"");
			if (affix_info[1] != 0) {
				if (affix == "base_damage_min" || affix == "base_defense" || affix == "req_level" || affix == "req_strength" || affix == "req_dexterity" || affix == "durability" || affix == "baseSpeed" || affix == "range" || affix == "throw_min" || affix == "base_min_alternate" || affix == "block" || affix == "velocity") { main_affixes += affix_info[0]+"<br>" }
				else { affixes += affix_info[0]+"<br>" }
			}
		}
		}

	}
	if (equipped[group].name != "none" && (group == "helm" || group == "armor" || group == "weapon" || group == "offhand")) {
		updateSocketTotals()
		for (affix in socketed[group].totals) {
			if (stats[affix] != unequipped[affix] && stats[affix] != 1 && affix != "req_level" && affix != "ctc") {
				var affix_info = getAffixLine(affix,"socketed",group,"");
				if (affix_info[1] != 0) { socketed_affixes += affix_info[0]+"<br>" }
			}
		}
		var ctc_possible = ["100% chance to cast level 29 Blaze when you level up","100% chance to cast level 43 Frost Nova when you level up","100% chance to cast level 41 Nova when you level up","100% chance to cast level 23 Venom when you level up"];
		var ctc_included = [0,0,0,0];
		for (let i = 0; i < socketed[group].items.length; i++) { for (affix in socketed[group].items[i]) { if (affix == "ctc") {
			var source = socketed[group].items[i];
			var affix_line = "";
			for (let j = 0; j < source[affix].length; j++) {
				var line = source[affix][j][0]+"% chance to cast level "+source[affix][j][1]+" "+source[affix][j][2]+" "+source[affix][j][3];
				for (let k = 0; k < ctc_possible.length; k++) { if (line == ctc_possible[k]) {
					if (ctc_included[k] == 0) { affix_line += line+"<br>" }
					ctc_included[k] = 1
				} }
			}
			socketed_affixes += affix_line
		} } }
	}
	// TODO: Reduce duplicated code from set bonuses - rewrite getAffixLine?
	if (typeof(equipped[group].rarity) != 'undefined') { if (equipped[group].rarity == "set") {
		var bonuses = equipped[group].set_bonuses;
		var set = bonuses[0];
		var group_bonuses = sets[set];
		var amount = Math.round(character[set]);
		var list_bonuses = {};
		var list_group_bonuses = {};
		for (let i = 1; i < bonuses.length; i++) {
			if (amount >= i) {
				for (affix in bonuses[i]) {
					if (typeof(list_bonuses[affix]) == 'undefined') { list_bonuses[affix] = 0 }
					list_bonuses[affix] += bonuses[i][affix]
				}
			}
		}
		for (let i = 1; i < group_bonuses.length; i++) {
			if (amount >= i) {
				for (affix in group_bonuses[i]) {
					if (typeof(list_group_bonuses[affix]) == 'undefined') { list_group_bonuses[affix] = 0 }
					list_group_bonuses[affix] += group_bonuses[i][affix]
				}
			}
		}
		for (affix in list_bonuses) { if (stats[affix] != unequipped[affix] && stats[affix] != 1) {
			var source = list_bonuses;
			var affix_line = "";
			var value = source[affix];
			var value_combined = ~~value;
			var halt = false;
			var both = 0;
			var stat = stats[affix];
			if (stat.alt != null) {
				if (typeof(source[stat.index[0]]) != 'undefined' && typeof(source[stat.index[1]]) != 'undefined') { if (source[stat.index[0]] > 0 && source[stat.index[1]] > 0) { both = 1; if (stat.index[1] == affix) { halt = true } } }
				if (both == 0) { stat = null; stat = stats_alternate[affix]; }
			}
			for (let i = 0; i < stat.index.length; i++) {
				value = source[stat.index[i]]
				if (value == 'undefined') { value = 0 }
				if (isNaN(value) == false) { value_combined += value }
				var rounding = true;
				if (stat.mult != null) {
					if (stat.mult[i] != 1) { value *= character[stat.mult[i]] }
					else { rounding = false }
				}
				if (isNaN(value) == false && rounding == true) { value = round(value) }
				var affix_text = stat.format[i];
				if (value < 0 && affix_text[affix_text.length-1] == "+") { affix_text = affix_text.slice(0,affix_text.length-1) }
				affix_line += affix_text
				affix_line += value
			}
			var affix_text = stat.format[stat.index.length];
			affix_line += affix_text
			if (halt == true) { value_combined = 0 }
			if (value_combined != 0) { set_affixes += affix_line+"<br>" }
		} }
		for (affix in list_group_bonuses) { if (stats[affix] != unequipped[affix] && stats[affix] != 1) {
			var source = list_group_bonuses;
			var affix_line = "";
			var value = source[affix];
			var value_combined = ~~value;
			var halt = false;
			var both = 0;
			var stat = stats[affix];
			if (stat.alt != null) {
				if (typeof(source[stat.index[0]]) != 'undefined' && typeof(source[stat.index[1]]) != 'undefined') { if (source[stat.index[0]] > 0 && source[stat.index[1]] > 0) { both = 1; if (stat.index[1] == affix) { halt = true } } }
				if (both == 0) { stat = null; stat = stats_alternate[affix]; }
			}
			for (let i = 0; i < stat.index.length; i++) {
				value = source[stat.index[i]]
				if (value == 'undefined') { value = 0 }
				if (isNaN(value) == false) { value_combined += value }
				var rounding = true;
				if (stat.mult != null) {
					if (stat.mult[i] != 1) { value *= character[stat.mult[i]] }
					else { rounding = false }
				}
				if (isNaN(value) == false && rounding == true) { value = round(value) }
				var affix_text = stat.format[i];
				if (value < 0 && affix_text[affix_text.length-1] == "+") { affix_text = affix_text.slice(0,affix_text.length-1) }
				affix_line += affix_text
				affix_line += value
			}
			var affix_text = stat.format[stat.index.length];
			affix_line += affix_text
			if (halt == true) { value_combined = 0 }
			if (value_combined != 0) { set_group_affixes += affix_line+"<br>" }
		} }
		if (set_group_affixes != "") { set_group_affixes = "<br>"+group_bonuses[0]+":<br>"+set_group_affixes }
	} }
	if (socketed_affixes != "") { socketed_affixes = "<br>"+socketed_affixes }
	var runeword = "";
	if (equipped[group].rarity == "rw") {
		var rw_name = equipped[group].name.split(" ­ ")[0].split(" ").join("_").split("'").join("");
		var runes = "";
		var i = 0;
		for (i = 0; i < runewords[rw_name].length; i++) { runes += runewords[rw_name][i]; }
		runeword = "<br>"+"<font color='"+colors.Gold+"'>'"+runes+"'</font>"
		name = "<font color='"+colors.Gold+"'>"+name+"</font>"
		affixes += "Socketed ("+i+")<br>"
	}
	document.getElementById("item_name").innerHTML = name+sock+base+runeword
	document.getElementById("item_info").innerHTML = main_affixes
	document.getElementById("item_corruption").innerHTML = corruption
	document.getElementById("item_affixes").innerHTML = affixes
	document.getElementById("item_set_affixes").innerHTML = set_affixes
	document.getElementById("item_socketed_affixes").innerHTML = socketed_affixes
	document.getElementById("item_group_affixes").innerHTML = set_group_affixes
	
	var textColor = "Gold";
	if (equipped[group].rarity == "set") { textColor = "Green" }
	else if (equipped[group].rarity == "magic") { textColor = "Blue" }
	else if (equipped[group].rarity == "rare") { textColor = "Yellow" }
	else if (equipped[group].rarity == "craft") { textColor = "Orange" }
	else if ((equipped[group].rarity == "common" || equipped[group].rarity == "rw") && equipped[group].ethereal == 1) { textColor = "Gray" }
	else if (equipped[group].rarity == "common" || equipped[group].rarity == "rw") { textColor = "White" }
	document.getElementById("item_name").style.color = colors[textColor]
	document.getElementById("tooltip_inventory").style.display = "block"
	
	var wid = Math.floor(document.getElementById(groupId).getBoundingClientRect().width/2 - document.getElementById("tooltip_inventory").getBoundingClientRect().width/2);
	if (name != "") {
		if (groupId == "helm_") { offset_x += 2*30+wid; offset_y += 60;
		} else if (groupId == "armor_") { offset_x += 4*30+wid; offset_y += 90;
		} else if (groupId == "gloves") { offset_x += 6*30+wid; offset_y += 60;
		} else if (groupId == "boots") { offset_x += 6*30+wid; offset_y += 120;
		} else if (groupId == "belt") { offset_x += 4*30+wid; offset_y += 120;
		} else if (groupId == "amulet") { offset_x += 2.5*30+wid; offset_y += 90;
		} else if (groupId == "ring1") { offset_x += 2*30+wid; offset_y += 120;
		} else if (groupId == "ring2") { offset_x += 3*30+wid; offset_y += 120;
		} else if (groupId == "weapon_") { offset_x += 0+wid; offset_y += 120;
		} else if (groupId == "offhand_") { offset_x += 8*30+wid; offset_y += 120;
		}
		document.getElementById("tooltip_inventory").style.top = offset_y+"px"
		document.getElementById("tooltip_inventory").style.left = offset_x+"px"
	}
	if (name == "") { document.getElementById("tooltip_inventory").style.left = 950+"px" }
}

// equipmentOut - stops showing equipment info (mouse-over ends)
// ---------------------------------
function equipmentOut() {
	document.getElementById("tooltip_inventory").style.left = 350+"px"	// why does the prevent misalignment?
	document.getElementById("tooltip_inventory").style.display = "none"
}

// getAffixLine - determines how an affix should be displayed
//	affix: name of the affix
//	loc: location of the affix
//	group: group of affix
//	subgroup: subgroup of affix (for socketables)
// return: the formatted affix line and combined value of affixes used
// ---------------------------------
function getAffixLine(affix, loc, group, subgroup) {
	var source;
	if (loc == "equipped") { source = equipped[group]; }
	else if (loc == "corruptsEquipped") { source = corruptsEquipped[group]; }
	else if (loc == "charms") { source = equipped.charms[group]; }
	else if (loc == "socketables") { source = socketables[group]; if (subgroup != "") { source = socketables[group][subgroup] } }
	else if (loc == "socketed") { source = socketed[group].totals; }
	else if (loc = "effects") { source = effects[group]; }
	var affix_line = "";
	var value = source[affix];
	var value_combined = ~~value;
	var halt = false;
	var both = 0;
	var stat = stats[affix];
	if (affix != "ctc" && affix != "cskill" && affix != "set_bonuses") {
		if (stat.alt != null) {
			if (typeof(source[stat.index[0]]) != 'undefined' && typeof(source[stat.index[1]]) != 'undefined') { if (source[stat.index[0]] > 0 && source[stat.index[1]] > 0) { both = 1; if (stat.index[1] == affix) { halt = true } } }
			if (both == 0) { stat = null; stat = stats_alternate[affix]; }
		}
		for (let i = 0; i < stat.index.length; i++) {
			value = source[stat.index[i]]
			if (value == 'undefined') { value = 0 }
			if (isNaN(value) == false) { value_combined += value }
			var rounding = true;
			if (stat.mult != null) {
				if (stat.mult[i] != 1) {
					value *= character[stat.mult[i]]
					if (affix == "all_skills_per_level") { value = Math.ceil(value) }
				}
				else { rounding = false }
			}
			if (isNaN(value) == false && rounding == true) { value = round(value) }
			var affix_text = stat.format[i];
			if (value < 0 && affix_text[affix_text.length-1] == "+") { affix_text = affix_text.slice(0,affix_text.length-1) }
			affix_line += affix_text
			affix_line += value
		}
		var affix_text = stat.format[stat.index.length];
		if (affix_text == " to Class Skills") { affix_text = " to "+character.class_name+" Skills" }
		affix_line += affix_text
		if (affix == "aura" && (source[affix] == "Lifted Spirit" || source[affix] == "Righteous Fire")) { affix_line = source[affix]+" Aura when Equipped" }
		if (halt == true) { value_combined = 0 }
	} else {
		affix_line == ""; value_combined = 1;
		if (affix == "ctc") {
			for (let i = 0; i < source[affix].length; i++) {
				var line = source[affix][i][0]+"% chance to cast level "+source[affix][i][1]+" "+source[affix][i][2]+" "+source[affix][i][3];
				affix_line += line
				if (i < source[affix].length-1) { affix_line += "<br>" }
			}
		} else if (affix == "cskill") {
			for (let i = 0; i < source[affix].length; i++) {
				var line = "Level "+source[affix][i][0]+" "+source[affix][i][1]+" ("+source[affix][i][2]+" charges)";
				affix_line += line
				if (i < source[affix].length-1) { affix_line += "<br>" }
			}
		}
	}
	var result = [affix_line,value_combined];
	return result
}

// inventoryLeftClick - Handles equipment inventory left clicks
//	group: equipment group name
// ---------------------------------
function inventoryLeftClick(event, group) {
    if (event.shiftKey && (equipped[group].rarity) != "set" && event.shiftKey && (equipped[group].type) != "bow" && event.shiftKey && (equipped[group].type) != "crossbow") {
        changeBase(group, "toggleEthereal");
    } else if (event.ctrlKey) {
        changeBase(group, "upgrade");
    } else {
        // Existing functionality
    }
}

// inventoryRightClick - Handles equipment inventory right clicks
//	group: equipment group name
// ---------------------------------
function inventoryRightClick(event, group) {
    if (event.shiftKey && (equipped[group].rarity) != "set" && event.shiftKey && (equipped[group].type) != "bow" && event.shiftKey && (equipped[group].type) != "crossbow") {
        changeBase(group, "toggleEthereal");
    } else if (event.ctrlKey) {
        changeBase(group, "downgrade");
    } else {
		equip(group, group)	// right click = unequip
    }
}


// changeBase - Modifies the base for an equipped item (upgrading)
//	group: equipment group to modify
//	change: what kind of change to make ("upgrade" or "downgrade")
// ---------------------------------
function changeBase(group, change) {
	var base_name = equipped[group].base;
	if (typeof(equipped[group].base) == 'undefined' && typeof(equipped[group].special) != 'undefined') { base_name = "Special_0" }
	var base = getBaseId(base_name);
	var halt = 0;
	if ((typeof(equipped[group].rarity) == 'undefined' || equipped[group].rarity == "unique" || equipped[group].rarity == "set") && change == "downgrade" && equipped[group].tier <= equipped[group].original_tier) { halt = 1 }		// prevents unique/set from being downgraded below their baseline
	//if (typeof(equipped[group].rarity) != 'undefined' && equipped[group].rarity != "unique" && equipped[group].rarity != "rare" && equipped[group].rarity != "set") { halt = 1 }	// limit to unique/rare/set
	if (typeof(bases[base][change]) != 'undefined' && halt == 0) {
		base = bases[base][change];
		equipped[group].base = base;
		base = getBaseId(base)
		var multEth = 1;
		var multED = 1;
		var multReq = 1;
		var reqEth = 0;

		if (typeof(equipped[group]["ethereal"]) != 'undefined') { if (equipped[group]["ethereal"] == 1) { multEth = 1.5; reqEth = 10; } }
		if (typeof(equipped[group]["e_def"]) != 'undefined') { multED += (equipped[group]["e_def"]/100) }
		if (typeof(equipped[group]["req"]) != 'undefined') { multReq += (equipped[group]["req"]/100) }
		for (affix in bases[base]) { if (affix != "group" && affix != "type" && affix != "upgrade" && affix != "downgrade" && affix != "subtype" && affix != "only" && affix != "def_low" && affix != "def_high" && affix != "durability" && affix != "range" && affix != "twoHands") {
		/*	if (affix == "base_defense") {
				character[affix] -= equipped[group][affix]
				equipped[group][affix] = Math.ceil(multEth*multED*bases[base][affix])
				character[affix] += equipped[group][affix]
			} else 
		*/	if (affix == "base_damage_min" || affix == "base_damage_max" || affix == "throw_min" || affix == "throw_max" || affix == "base_min_alternate" || affix == "base_max_alternate") {
				character[affix] -= equipped[group][affix]
				equipped[group][affix] = Math.ceil(multEth*bases[base][affix])
				character[affix] += equipped[group][affix]
			} else if (affix == "req_strength" || affix == "req_dexterity") {
				equipped[group][affix] = Math.max(0,Math.ceil(multReq*bases[base][affix] - reqEth))
			} else if (affix == "req_level") {
				equipped[group]["tier"] = bases[base]["tier"]
				if (change == "upgrade" && equipped[group].tier > equipped[group].original_tier) {
					if ((equipped[group][affix]+5) <= bases[base][affix]) {
						equipped[group][affix] = bases[base][affix]
					} else {
						equipped[group][affix] += 5
					}
				} else {
					if (equipped[group].tier > equipped[group].original_tier) {		// downgrading back to the original base is already handled below
						var req_level_original = 0; for (item in equipment[group]) { if (equipment[group][item].name == equipped[group].name) { req_level_original = equipment[group][item].req_level } };	// original level requirement isn't available without looking up original item
						equipped[group][affix] = bases[base][affix]
						if ((req_level_original+5) > equipped[group][affix]) { equipped[group][affix] = req_level_original+5 }
					}
				}
			} else {		// any affixes that are undefined should not be checked (base upgrades/downgrades share the same affixes)
				character[affix] -= equipped[group][affix]
				equipped[group][affix] = bases[base][affix]
				character[affix] += bases[base][affix]
			}
		} }
		if (equipped[group].tier == equipped[group].original_tier) {	// used to reset affixes such as req_level, req_strength, req_dexterity (since they are often different from the base affixes)
			var name = equipped[group].name;
			equip(group,"none");
			equip(group,name);
			var options = document.getElementById("dropdown_"+group).options;
			for (let i = 0; i < options.length; i++) { if (options[i].innerHTML == equipped[group].name) {  document.getElementById("dropdown_"+group).selectedIndex = i } }
		}
		if (base == "Special_0") { var name = equipped[group].name; equip(group,"none"); equip(group,name); }
		if (base == "Special_1" || base == "Special_2" || base == "Special_3") { document.getElementById(group+"_image").src = "./images/items/weapon/axe/Hand_Axe.png" }
	}

	
	if (change === "toggleEthereal") {
		const item = equipped[group];
//			let base = getBaseId(item.base); // Retrieve the base item
//			let reqEth = 0;
//			let multEth = 1;

		if (item.ethereal) {
			// Remove ethereal status
			item.ethereal = false;
			multEth = 1; // Reset multiplier
			reqEth = 0;  // Reset requirement reduction
			if (typeof item["req_strength"] !== "undefined") {
				item["req_strength"] = Math.max(0, Math.ceil(bases[base]["req_strength"]));
			}
			if (typeof item["req_dexterity"] !== "undefined") {
				item["req_dexterity"] = Math.max(0, Math.ceil(bases[base]["req_dexterity"]));
			}
			if (typeof item["base_defense"] !== "undefined") {
				item["base_defense"] = Math.max(0, Math.ceil(bases[base]["base_defense"]));
			}
			if (typeof item["base_damage_min"] !== "undefined") {
				item["base_damage_min"] = Math.max(0, Math.ceil(bases[base]["base_damage_min"]));
			}
			if (typeof item["base_damage_max"] !== "undefined") {
				item["base_damage_max"] = Math.max(0, Math.ceil(bases[base]["base_damage_max"]));
			}


		} else {
			// Apply ethereal status
			item.ethereal = true;
			equipped[group]["ethereal"] == 1 ;
			multEth = 1.5; // Increase multiplier for ethereal
			reqEth = 10;  // Reduce requirements by 10%
			if (typeof item["req_strength"] !== "undefined") {
				item["req_strength"] = Math.max(0, Math.ceil(bases[base]["req_strength"] * 0.9));
			}
			if (typeof item["req_dexterity"] !== "undefined") {
				item["req_dexterity"] = Math.max(0, Math.ceil(bases[base]["req_dexterity"] * 0.9));
			}
			if (typeof item["base_defense"] !== "undefined") {
				item["base_defense"] = Math.max(0, Math.ceil(bases[base]["base_defense"] * 1.5));
			}
			if (typeof item["base_damage_min"] !== "undefined") {
				item["base_damage_min"] = Math.max(0, Math.ceil(bases[base]["base_damage_min"] * 1.5));
			}
			if (typeof item["base_damage_max"] !== "undefined") {
				item["base_damage_max"] = Math.max(0, Math.ceil(bases[base]["base_damage_max"] * 1.5));
			}

		}

		// Dynamically update affected attributes
//			if (typeof item["req_strength"] !== "undefined") {
//				item["req_strength"] = Math.max(0, Math.ceil(bases[base]["req_strength"] * 0.9));
//			}
//			if (typeof item["req_dexterity"] !== "undefined") {
//				item["req_dexterity"] = Math.max(0, Math.ceil(bases[base]["req_dexterity"] * 0.9));
//			}
	}


	if (corruptsEquipped[group].name == "+ Sockets") { adjustCorruptionSockets(group) }
	updateSocketTotals()
	equipmentOut()
	equipmentHover(group)
	// update
	calculateSkillAmounts()
	updateStats()
	updateSkills()
	if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
	if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
	// updateAllEffects()?
	updateURLDebounced()
}



//=========================================================================================================================
// INVENTORY DRAG AND DROP ....
//=========================================================================================================================

/* Functions:
	allowDrop
	drag
	drop
	trash
	handleSocket
	socket
	allowSocket
	dragSocketable
	trashSocketable
*/

// allowDrop - Handles placement validation for Charm Inventory
//	cell: position of item in 10x4 inventory (1-40)
//	y: height of item (1-3)
// ---------------------------------
function allowDrop(ev, cell, y) {
	if (inv[0].pickup_y + y <= 5) {
		var allow = 1
		if (inv[cell].empty == 0 && inv[0].in[cell] != inv[0].onpickup) { allow = 0 }
		if (inv[0].pickup_y > 1 && inv[cell+10].empty == 0 && inv[0].in[cell+10] != inv[0].onpickup) { allow = 0 }
		if (inv[0].pickup_y > 2 && inv[cell+20].empty == 0 && inv[0].in[cell+20] != inv[0].onpickup) { allow = 0 }
		if (allow == 1) {
			var inEquipment = 0;
			var val = inv[0].onpickup;
			var groups = ["helm", "armor", "weapon", "offhand"];
			for (group in equipped) { if (val == equipped[group].name) { inEquipment = 1 } }
			if (inEquipment == 0) { ev.preventDefault(); }
		}
	}
}

// drag - Handles item dragging for Charm Inventory
// ---------------------------------
function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
	inv[0].onpickup = ev.target.id
	var height = document.getElementById(inv[0].onpickup).height;
	if (height > 80) { inv[0].pickup_y = 3 }
	else if (height > 50) { inv[0].pickup_y = 2 }
	else { inv[0].pickup_y = 1 }
}

// drop - Handles item dropping for Charm Inventory
//	cell: 1-40 (upper left position of item in 10x4 inventory)
// ---------------------------------
function drop(ev,cell) {
	// TODO: Is any of this similar enough to addCharm() or addSocketable() to be combined?
	ev.preventDefault();
	var val = inv[0].onpickup;
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
	for (s = 1; s <= inv[0].in.length; s++) {
		if (inv[0].in[s] == inv[0].onpickup) { inv[s].empty = 1; inv[0].in[s] = ""; 
			inv[s].y = 1;
			document.getElementById(inv[s].id).style = "position: absolute; width: 29px; height: 29px; z-index: 3;";
		}
	}
	inv[cell].empty = 0
	inv[0].in[cell] = inv[0].onpickup
	if (inv[0].pickup_y > 1) { inv[cell+10].empty = 0; inv[0].in[cell+10] = inv[0].onpickup; inv[cell].y = 2; }
	if (inv[0].pickup_y > 2) { inv[cell+20].empty = 0; inv[0].in[cell+20] = inv[0].onpickup; inv[cell].y = 3; }
	inv[0].onpickup = "none"
	
	// Remove affixes if unsocketed from equipment
	var socketable = 0;
	var name = val.split('_')[0];
	for (let k = 0; k < socketables.length; k++) { if (socketables[k].name == name) { socketable = 1 } }
	if (socketable == 1) {
		var groups = ["helm", "armor", "weapon", "offhand"];
		for (let g = 0; g < groups.length; g++) {
			for (let i = 0; i < socketed[groups[g]].items.length; i++) {
				if (val == socketed[groups[g]].items[i].id) {
					for (affix in socketed[groups[g]].items[i]) { if (affix != "id") {
						character[affix] -= socketed[groups[g]].items[i][affix]
						socketed[groups[g]].totals[affix] -= socketed[groups[g]].items[i][affix]
					} }
					socketed[groups[g]].items[i] = {id:"",name:""}
					socketed[groups[g]].socketsFilled -= 1
				}
			}
		}
		// update
		calculateSkillAmounts()
		updateStats()
		updateSkills()
		if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
		if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
		// updateAllEffects()?
		updateURLDebounced()
	}
}

// trash - Handles item removal for Charm Inventory
// ---------------------------------
function trash(ev) {
	var val = ev.target.id;
	var name = val.split('_')[0];
	var group = "charms"
//	if (name == "+1 (each) skill") { for (let i = 0; i < skills.length; i++) { if (skills[i].level == 0) { removeEffect(getId(skills[i].name)) } } }	// && skills[i].force_levels <= 1
	for (old_affix in equipped[group][val]) {
		character[old_affix] -= equipped[group][val][old_affix]
		equipped[group][val][old_affix] = unequipped[old_affix]
	}
	for (let s = 1; s <= inv[0].in.length; s++) {
		if (inv[0].in[s] == ev.target.id) {
			inv[s].empty = 1;
			inv[0].in[s] = "";
		}
	}
	ev.target.remove();
	
	// find/remove duplicates
	var dup = 0;
	if (ev.shiftKey) { dup = 9 }
	if (ev.ctrlKey) { dup = 39 }
	if (dup > 0) {
		for (let d = 0; d < inv[0].in.length; d++) {
			if (dup > 0 && name == inv[0].in[d].split('_')[0]) {
				val = inv[0].in[d];
				var size = equipped[group][val].size
				for (old_affix in equipped[group][val]) {
					character[old_affix] -= equipped[group][val][old_affix]
					equipped[group][val][old_affix] = unequipped[old_affix]
				}
				inv[0].in[d] = "";
				inv[d].empty = 1;
				if (size == "large" || size == "grand") { inv[d+10].empty = 1; inv[0].in[d+10] = ""; }
				if (size == "grand") { inv[d+20].empty = 1; inv[0].in[d+20] = ""; }
				document.getElementById(val).remove()
				dup--
			}
		}
	}
	calculateSkillAmounts()
	updateStats()
	updateSkills()
	if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
	if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
	updateAllEffects()
	document.getElementById("tooltip_inventory").style.display = "none"
}

// handleSocket - calls socket (other functionality is unused currently)
//	group: equipment group name
//	source: inventory space to drag from if event is null
// ---------------------------------
function handleSocket(event, group, source) {
	// TODO: Modify so that it can be used as a way to 'hack' socketables to display within bounds?
	var ident = "";
	if (source > 0) { ident = inv[0].in[source] }
	else { ident = event.dataTransfer.getData("text") }
	socket(event,group,source)
//	trashSocketable(event,ident,1)
//	var newId = addSocketable(ident.split("_")[0])
//	var newSource = 1; for (let s = 1; s <= inv[0].in.length; s++) { if (inv[0].in[s] == newId) { newSource = s } }
//	socket(null,group,newSource)
}

// socket - Adds a socketable item (jewel, rune, gem) to equipment
//	group: equipment group name
//	source: inventory space to drag from if event is null (used when loading a character)
// ---------------------------------
function socket(event, group, source) {
	if (event == null && source > 0) {
		var id = inv[0].in[source];
		document.getElementById(group).appendChild(document.getElementById(id))
	} else {
		event.preventDefault();
		var data = event.dataTransfer.getData("text");
		document.getElementById(group).appendChild(document.getElementById(data))
	}
	// equipment destination
	var spaceFound = 0;
	var index = 0;
	for (let i = 0; i < socketed[group].items.length; i++) { if (socketed[group].items[i].name == "") { spaceFound = 1; index = i; } }	// TODO: reverse order to clarify saved file?
	if (spaceFound == 1) {
		var name = inv[0].onpickup.split('_')[0];
		// Remove previous affixes, if being moved from another equipment item
		var groups = ["helm", "armor", "weapon", "offhand"];
		for (let g = 0; g < groups.length; g++) {
			for (let i = 0; i < socketed[groups[g]].items.length; i++) {
				if (inv[0].onpickup == socketed[groups[g]].items[i].id) {
					for (affix in socketed[groups[g]].items[i]) { if (affix != "id") {
						character[affix] -= socketed[groups[g]].items[i][affix]
						socketed[groups[g]].totals[affix] -= socketed[groups[g]].items[i][affix]
					} }
					socketed[groups[g]].items[i] = {id:"",name:""}
					socketed[groups[g]].socketsFilled -= 1
				}
			}
		}
		// Add affixes
		for (let k = 0; k < socketables.length; k++) { if (socketables[k].name == name) {
			socketed[group].items[index].id = inv[0].onpickup
			for (affix in socketables[k]) {
				if (affix != "type" && affix != "rarity" && affix != "img") {
					var affix_dest = affix;
					if (affix == "e_damage") { if (group == "weapon" || (group == "offhand" && offhandType == "weapon")) { /*don't change*/ } else { affix_dest = "damage_bonus" } }
					if (typeof(socketed[group].totals[affix_dest]) == 'undefined') { socketed[group].totals[affix_dest] = 0 }
					socketed[group].items[index][affix_dest] = socketables[k][affix]
					character[affix_dest] += socketables[k][affix]
					socketed[group].totals[affix_dest] += socketables[k][affix]
				}
				if (affix == group || (affix == "armor" && group == "helm") || (affix == "armor" && group == "offhand" && typeof(socketables[k]["shield"]) == 'undefined' && offhandType != "weapon") || (affix == "shield" && group == "offhand" && offhandType != "weapon") || (affix == "weapon" && group == "offhand" && offhandType == "weapon")) {
					for (groupAffix in socketables[k][affix]) {
						if (typeof(socketed[group].totals[groupAffix]) == 'undefined') { socketed[group].totals[groupAffix] = 0 }
						socketed[group].items[index][groupAffix] = socketables[k][affix][groupAffix]
						character[groupAffix] += socketables[k][affix][groupAffix]
						socketed[group].totals[groupAffix] += socketables[k][affix][groupAffix]
					}
				}
			}
		} }
		socketed[group].socketsFilled += 1
		calculateSkillAmounts()
		updateStats()
		updateSkills()
		if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
		if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
		// updateAllEffects()?
		updateURLDebounced()
	}
	// inventory destination
	for (let s = 1; s <= inv[0].in.length; s++) {
		if (inv[0].in[s] == inv[0].onpickup) {
			inv[s].empty = 1; inv[0].in[s] = ""; inv[s].y = 1;
			document.getElementById(inv[s].id).style = "position: absolute; width: 28px; height: 28px; z-index: 3;";
		}
	}
	inv[0].onpickup = "none"
}

// allowSocket - Checks on mouse-over whether a socketable item may be added
//	group: equipment group being mouse-over'd
// ---------------------------------
function allowSocket(event, group) {
	socketed[group].sockets = ~~equipped[group].sockets + ~~corruptsEquipped[group].sockets
	var allow = 0;
	if (socketed[group].sockets > 0 && socketed[group].socketsFilled < socketed[group].sockets) {
		var name = inv[0].onpickup.split('_')[0];
		for (let k = 0; k < socketables.length; k++) {
			if (socketables[k].name == name) { if (socketed[group].socketsFilled < socketed[group].sockets) { allow = 1 } }
		}
	}
	if (allow == 1) {
		var spaceAvailable = 0;
		for (let i = 0; i < socketed[group].items.length; i++) {
			if (socketed[group].items[i].name == "") { spaceAvailable = 1; }
		}
		if (spaceAvailable == 1) { event.preventDefault(); }
	}
}

// dragSocketable - Handles item dragging for socketables (gems, runes, jewels)
// ---------------------------------
function dragSocketable(ev) {
//	ev.dataTransfer.setData("text", ev.target.id);
//	inv[0].onpickup = ev.target.id
//	inv[0].pickup_y = 1
	drag(ev)
}

// trashSocketable - Handles item removal for socketables (gems, runes, jewels)
//	ident: id for item's UI element
//	override: currently unused (0), but could be changed (1) if a socketable item needs to be removed without having access to the event parameter
// ---------------------------------
function trashSocketable(event, ident, override) {
	var val = ident;
	var target = document.getElementById(ident);
	var dup = 0;
	if (override == 0) {
		val = event.target.id
		target = event.target
		if (event.shiftKey) { dup = 9 }
		if (event.ctrlKey) { dup = 39 }
	}
	var nameVal = val.split('_')[0];
	// removed from equipment
	var groups = ["helm", "armor", "weapon", "offhand"];
	for (let g = 0; g < groups.length; g++) {
		for (let i = 0; i < socketed[groups[g]].items.length; i++) {
			if (val == socketed[groups[g]].items[i].id) {
				for (affix in socketed[groups[g]].items[i]) {
					if (affix != "id" && affix != "name") {
						character[affix] -= socketed[groups[g]].items[i][affix]
						socketed[groups[g]].totals[affix] -= socketed[groups[g]].items[i][affix]
					}
				}
				socketed[groups[g]].items[i] = {id:"",name:""}
				socketed[groups[g]].socketsFilled -= 1
			}
		}
	}
	// removed from inventory
	for (s = 1; s <= inv[0].in.length; s++) {
		if (inv[0].in[s] == val) {
			inv[s].empty = 1;
			inv[0].in[s] = "";
		}
	}
	
	target.remove()
	
	// find/remove duplicates
	if (dup > 0) {
		for (let d = 0; d < inv[0].in.length; d++) {
			if (dup > 0 && nameVal == inv[0].in[d].split('_')[0]) {
				val = inv[0].in[d];
				inv[0].in[d] = "";
				inv[d].empty = 1;
				document.getElementById(val).remove()
				dup--
			}
		}
	}
	
	// update
	calculateSkillAmounts()
	updateStats()
	updateSkills()
	if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
	if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
	// updateAllEffects()?
	updateURLDebounced()
	document.getElementById("tooltip_inventory").style.display = "none"
}



//=========================================================================================================================
// STAT AND SKILL CHOICES ....
//=========================================================================================================================

/* Functions:
	addStat
	removeStat
	skillUp
	skillDown
	skillHover
	skillOut
	showBaseLevels
	hoverStatOn
	hoverStatOff
*/

// addStat - Raises the selected stat
//	stat: button identifier (string) for corresponding stat
// ---------------------------------
function addStat(event, stat) {
	var points = 1
	if (event.shiftKey) { points = 10 }
	if (event.ctrlKey) { points = 100 }
	if (character.statpoints < points) { points = character.statpoints }
	if (character.statpoints >= points) {
		if (stat == "btn_strength") {		character.strength += points;	character.strength_added += points; }
		else if (stat == "btn_dexterity") {	character.dexterity += points;	character.dexterity_added += points; }
		else if (stat == "btn_vitality") {	character.vitality += points;	character.vitality_added += points; }
		else if (stat == "btn_energy") {	character.energy += points;	character.energy_added += points; }
		character.statpoints -= points
		updateAllEffects()
	}
}

// removeStat - Lowers the selected stat
//	stat: button identifier (string) for corresponding stat
// ---------------------------------
function removeStat(event, stat) {
	var points = 1
	if (event.shiftKey) { points = 10 }
	if (event.ctrlKey) { points = 100 }
	if ((stat == "btn_strength")) {
		if (points > character.strength_added) { points = character.strength_added }
		character.strength -= points
		character.strength_added -= points
	} else if ((stat == "btn_dexterity")) {
		if (points > character.dexterity_added) { points = character.dexterity_added }
		character.dexterity -= points
		character.dexterity_added -= points
	} else if ((stat == "btn_vitality")) {
		if (points > character.vitality_added) { points = character.vitality_added }
		character.vitality -= points
		character.vitality_added -= points
	} else if ((stat == "btn_energy")) {
		if (points > character.energy_added) { points = character.energy_added }
		character.energy -= points
		character.energy_added -= points
	} else { points = 0 }
	character.statpoints += points
	updateAllEffects()
}

// skillUp - Raises the skill level
//	skill: the skill to modify
//	levels: number of levels to add (1 by default)
// ---------------------------------
function skillUp(event, skill, levels) {
	var old_level = skill.level;
	if (levels == 1 && event != null) {
		if (event.shiftKey) { levels = 10 }
		if (event.ctrlKey) { levels = 20 }
	}
	if (old_level+levels > MAX) { levels = MAX-old_level }
	if (levels > (99-character.level) + character.skillpoints) { levels = (99-(character.level) + character.skillpoints) }
	if (settings.coupling == 0 && levels > character.skillpoints) { levels = character.skillpoints }
	if (character.level <= 99-levels || character.skillpoints >= levels) {
		skill.level += levels
		if (skill.level > old_level) {
			if (levels <= character.skillpoints) {
				character.skillpoints -= levels
				levels = 0
			} else {
				levels -= character.skillpoints
				character.skillpoints = 0
			}
			if (levels > 0) {
				character.level += levels
				character.statpoints += (5*levels)
				character.life += (character.levelup_life*levels)
				character.stamina += (character.levelup_stamina*levels)
				character.mana += (character.levelup_mana*levels)
			}
		}
	}
	skillHover(skill)
    if (skill.bindable > 0 && (old_level == 0 || (old_level > 0 && skill.level == 0 && skill.force_levels == 0))) {
	updateSkills()
    }
	updateMercenary()
//	for (let s = 0; s < skills.length; s++) { modifyEffect(skills[s]) }
	if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
	if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
	updateAllEffects()
	for (effect in effects) { updateEffect(effect) }
}

// skillDown - Lowers the skill level
//	skill: the skill to modify
// ---------------------------------
function skillDown(event, skill) {
	// TODO: Allow even when all statpoints have been used (just increase available skillpoints without changing character's level)
	var old_level = skill.level
	var levels = 1
	if (event.shiftKey) { levels = 10 }
	if (event.ctrlKey) { levels = 20 }
	if (old_level-levels < 0) { levels = old_level }
	var maxdown = character.level - 1
	var maxstatdown = character.statpoints
	var levels_temp = 0;
	if (character.quests_completed > 0 && character.skillpoints < 12) { levels_temp = 12 - character.skillpoints; maxdown += levels_temp; maxstatdown += (levels_temp*5) }
	if (levels > maxdown) { levels = maxdown }
	if (settings.coupling == 1) {
		if (levels <= maxdown && 5*levels <= maxstatdown) {
			if (character.quests_completed > 0 && character.skillpoints < 12) {
				if (levels_temp > levels) { levels_temp = levels }
				skill.level -= levels_temp
				character.skillpoints += levels_temp
				levels -= levels_temp
			}
			skill.level -= levels
			if (skill.level < old_level) {
				character.level -= levels
				character.statpoints -= 5*levels
				character.life -= (character.levelup_life*levels)
				character.stamina -= (character.levelup_stamina*levels)
				character.mana -= (character.levelup_mana*levels)
			}
		} else if (levels <= maxdown) {
			skill.level -= levels
			character.skillpoints += levels
		}
	} else {
		skill.level -= levels
		character.skillpoints += levels
	}
	skillHover(skill)
    if (skill.bindable > 0 && (old_level == 0 || (old_level > 0 && skill.level == 0 && skill.force_levels == 0))) {
	updateSkills()
    }
	updateMercenary()
	if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
	if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
	updateAllEffects()
	for (effect in effects) { updateEffect(effect) }
}

// skillHover - Shows skill description tooltip on mouse-over
//	skill: the mouse-over'ed skill
// ---------------------------------
function skillHover(skill) {
	document.getElementById("title").innerHTML = skill.name
	document.getElementById("description").innerHTML = skill.description
	document.getElementById("graytext").innerHTML = skill.graytext
	document.getElementById("syn_title").innerHTML = skill.syn_title
	document.getElementById("syn_text").innerHTML = skill.syn_text
	if (typeof(skill.incomplete) != 'undefined') { if (skill.incomplete != "") {
		if (skill.syn_text != "") { document.getElementById("syn_text").innerHTML += "<br>" }
		if (skill.incomplete == 1) {
			document.getElementById("syn_text").innerHTML += "<br><font color='"+colors.Red+"'>SKILL DATA IS OUTDATED OR UNVERIFIED</font>"
		} else {
			document.getElementById("syn_text").innerHTML += "<br><font color='"+colors.Red+"'>"+skill.incomplete+"</font>"
		}
	} }
	if (typeof(skill.damagetoohigh) != 'undefined') { if (skill.damagetoohigh != "") {
		if (skill.syn_text != "") { document.getElementById("syn_text").innerHTML += "<br>" }
		if (skill.damagetoohigh == 1) {
			document.getElementById("syn_text").innerHTML += "<br><font color='"+colors.Red+"'font-size:12px>Damage displayed here is higher than <br>in game damage, need better data</font>"
		} else {
			document.getElementById("syn_text").innerHTML += "<br><font color='"+colors.Red+"'>"+skill.damagetoohigh+"</font>"
		}
	} }
	if (typeof(skill.damagewrong) != 'undefined') { if (skill.damagewrong != "") {
		if (skill.syn_text != "") { document.getElementById("syn_text").innerHTML += "<br>" }
		if (skill.damagewrong == 1) {
			document.getElementById("syn_text").innerHTML += "<br><font color='"+colors.Red+"'font-size:12px>Per-level stats displayed here have not been  <br>verified in game and may not be accurate</font>"
		} else {
			document.getElementById("syn_text").innerHTML += "<br><font color='"+colors.Red+"'>"+skill.damagewrong+"</font>"
		}
	} }
	if (typeof(skill.notupdated) != 'undefined') { if (skill.notupdated != "") {
		if (skill.syn_text != "") { document.getElementById("syn_text").innerHTML += "<br>" }
		if (skill.notupdated == 1) {
			document.getElementById("syn_text").innerHTML += "<br><font color='"+colors.Red+"'font-size:12px>Skill may not be updated to newest patch values</font>"
		} else {
			document.getElementById("syn_text").innerHTML += "<br><font color='"+colors.Red+"'>"+skill.notupdated+"</font>"
		}
	} }
	var levels = 0;
	var next_display = "";
	var current_display = "";
	var pre_display = "";
	var next_value = 0;
	var current_value = 0;
	for (let i = 0, len = skill.data.values.length; i < len; i++) {
		next_display += skill.text[i]
		if (skill.level == 0 && skill.force_levels == 0) {
			next_value = character.getSkillData(skill, skill.level+1, i)
		} 
		if (skill.hardpoints && skill.name == "Weapon Block") {
			if (i == 1)
				{
				levels = skill.level
				next_value = character.getSkillData(skill, levels+1, i)
				next_value = round(next_value)
				}
				else{
					next_value = character.getSkillData(skill, (skill.level+skill.extra_levels+1), i)
					next_value = round(next_value)
		
				}		} else {
			next_value = character.getSkillData(skill, (skill.level+skill.extra_levels+1), i)
		}
		next_value = round(next_value)
		if (next_value < 0 && next_display.endsWith("+")) { next_display = next_display.substr(0,next_display.length-1) }
		next_display += next_value
		
		current_display += skill.text[i]
		//if (skill.level+skill.extra_levels <= LIMIT) { levels = skill.level+skill.extra_levels } else { levels = LIMIT }
		levels = skill.level+skill.extra_levels
		if (skill.hardpoints && skill.name == "Weapon Block") {
			if (i == 1)
			{
			levels = skill.level
			current_value = character.getSkillData(skill, levels, i)
			current_value = round(current_value)
			}
			else{
				current_value = character.getSkillData(skill, levels, i)
				current_value = round(current_value)
	
			}
		}
		if (!skill.hardpoints) {
		current_value = character.getSkillData(skill, levels, i)
		current_value = round(current_value)
		}
		if (current_value < 0 && current_display.endsWith("+")) { current_display = current_display.substr(0,current_display.length-1) }
		current_display += current_value
		
		if (skill.index[0] == (i+1)) {
			if (skill.level > 0) { pre_display += current_display } else { pre_display += next_display }
			current_display = ""
			next_display = ""
		}
	}
	pre_display += skill.index[1]
	if (skill.level > 0 || skill.force_levels > 0) {
		if (skill.index[0] > 0) { pre_display = "<br>" + pre_display }
		if (skill.level > 0) { pre_display += "<br>" }
		pre_display += "<br>Current Skill Level: " + (levels) + "<br>"
		current_display += skill.text[skill.data.values.length] + "<br>"
		document.getElementById("next_level_text").innerHTML = "<br>Next Level"
	} else {
		document.getElementById("next_level_text").innerHTML = "<br>First Level"
		current_display = ""
		if (skill.index[0] > 0) { pre_display = "<br>" + pre_display + "<br>" }
	}
	if (skill.level < MAX && (skill.level+skill.extra_levels < LIMIT)) { next_display += skill.text[skill.data.values.length] } else { next_display = "(maximum level reached)" }
	document.getElementById("next").innerHTML = next_display
	document.getElementById("current").innerHTML = current_display
	document.getElementById("pretext").innerHTML = pre_display
	
	if (skill.level == 0 || (skill.level > 0 && skill.index[0] > 0)) {
		document.getElementById("description").innerHTML = skill.description + "<br>"
	}
	
	calculateSkillAmounts()
	updateStats()
	showBaseLevels(skill)
	
	document.getElementById("tooltip").style.display = "block"
	document.getElementById("tooltip").style.visibility = "visible"
	document.getElementById("tooltip").style.left = "0px"
	var tt_width = document.getElementById("tooltip").clientWidth;
	var icon_center = [0,38,269,500][skill.key[0]]+(69*(skill.key[2]-1));
	var ttx = Math.min(690-tt_width,Math.max(0,icon_center-tt_width/2));
	var tty = [0,82,150,218,286,354,422][skill.key[1]];
	var style = "display: block; top: "+tty+"px; left: "+ttx+"px;"
	document.getElementById("tooltip").style = style
	
	// moves the tooltip up if it's cutoff below the viewable screen area
	var rect = document.getElementById("tooltip").getBoundingClientRect();
	if (rect.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
		var diff = Math.max(rect.bottom - window.innerHeight, rect.bottom - document.documentElement.clientHeight);
		style = "display: block; top: "+(Math.max(0,tty-diff))+"px; left: "+ttx+"px;"
		document.getElementById("tooltip").style = style
	}
}

// skillOut - Hides skill tooltip
// ---------------------------------
function skillOut() {
	document.getElementById("tooltip").style.visibility = "hidden"
	checkRequirements()
}

// showBaseLevels - Shows base levels for a skill
//	skill: the skill to use
// ---------------------------------
function showBaseLevels(skill) {
	if ((skill.extra_levels > 0 && skill.level > 0) || skill.force_levels > 0) {
		document.getElementById("p"+skill.key).style.color = "#999999";
		document.getElementById("p"+skill.key).innerHTML = skill.level;
	}
}

// hoverStatOn - shows a stat's value without anything added from items (on mouse-over)
//	stat: the value ("strength", "dexterity", "vitality", "energy")
// ---------------------------------
function hoverStatOn(stat) {
	document.getElementById(stat).style.color = "gray"
	document.getElementById(stat).innerHTML = character["starting_"+stat]+character[stat+"_added"]
}

// hoverStatOff - shows a stat's value as normal
//	stat: the value ("strength", "dexterity", "vitality", "energy")
// ---------------------------------
function hoverStatOff(stat) {
	document.getElementById(stat).style.color = "white"
	updatePrimaryStats()
	checkRequirements()
}



//=========================================================================================================================
// UPDATING ....
//=========================================================================================================================

/* Functions:
	update
	getWeaponDamage
	getNonPhysWeaponDamage
	updateStats
	updatePrimaryStats
	updateSecondaryStats
	updateTertiaryStats
	updateCTC
	updateChargeSkills
	updateOther
	removeInvalidSockets
	calculateSkillAmounts
	checkRequirements
	updateSkills
	checkSkill
	checkIronGolem
	checkOffhand
	updateSocketTotals
	updateURL
	getmmmpld
*/

// update - Updates everything
// ---------------------------------
function update() {
	checkOffhand()
	calculateSkillAmounts()
	updateStats()
	checkRequirements()
	updateSkills()
	if (selectedSkill[0] != " ­ ­ ­ ­ Skill 1") { checkSkill(selectedSkill[0], 1) }
	if (selectedSkill[1] != " ­ ­ ­ ­ Skill 2") { checkSkill(selectedSkill[1], 2) }
	checkIronGolem()
	if (loaded == 1) { updateURLDebounced() }
}

// getWeaponDamage - Calculates physical min/max damage and multiplier for an equipped weapon
//	str: total strength
//	dex: total dexterity
//	group: weapon's group ('weapon' or 'offhand')
//	thrown: 1 if the weapon is being thrown, otherwise 0
// return: array with [min damage, max damage, multiplier]
// ---------------------------------
function getWeaponDamage(str, dex, group, thrown) {
	var c = character;
	var type = equipped[group].type;
	var other = "offhand";
	if (group == "offhand") { other = "weapon" }
	// multiplier from stats
	var statBonus = 0;
	if (typeof(type) != 'undefined') { 
		if (type == "hammer") { statBonus = (str*1.1/100) }
		else if ((type == "spear" || type == "javelin") && equipped[group].only == "amazon") { statBonus = ((str*0.8/100)+(dex*0.5/100)) }
		else if (type == "bow" || type == "crossbow" || type == "javelin") { statBonus = (dex/100) }						// check if javelins are counted as missile weapons or throwing weapons
		else if (type == "dagger" || type == "thrown" || type == "claw" || type == "javelin") { statBonus = ((str*0.75/100)+(dex*0.75/100)) }	// check if javelins are counted as missile weapons or throwing weapons
		else  { statBonus = (str/100) }
	}
	// multiplier from skills
	var weapon_skillup = 0;
	if (type == "sword" || type == "axe" || type == "dagger") { weapon_skillup = c.edged_damage; c.ar_skillup2 = c.edged_ar; c.cstrike_skillup = c.edged_cstrike; }
	else if (type == "polearm" || type == "spear") { weapon_skillup = c.pole_damage; c.ar_skillup2 = c.pole_ar; c.cstrike_skillup = c.pole_cstrike; }
	else if (type == "mace" || type == "scepter" || type == "staff" || type == "hammer" || type == "club" || type == "wand") { weapon_skillup = c.blunt_damage; c.ar_skillup2 = c.blunt_ar; c.cstrike_skillup = c.blunt_cstrike; }
	else if (type == "thrown" || type == "javelin") { weapon_skillup = c.thrown_damage; c.ar_skillup2 = c.thrown_ar; c.pierce_skillup = c.thrown_pierce; c.cstrike_skillup = c.thrown_cstrike; }	// check if javelins can benefit from Pole Weapon Mastery
	else if (type == "claw") { weapon_skillup = c.claw_damage; c.ar_skillup2 = c.claw_ar; c.cstrike_skillup = c.claw_cstrike; }
	else { weapon_skillup = 0; c.ar_skillup2 = 0; c.cstrike_skillup = 0; c.pierce_skillup = 0; }
	var e_damage_other = 0;
	var phys_min_other = 0;
	var phys_max_other = 0;
	if (offhandType == "weapon") {
		e_damage_other = (~~(equipped[other].e_damage) + ~~(socketed[other].totals.e_damage) + ~~(corruptsEquipped[other].e_damage))
		phys_min_other = ~~equipped[other].damage_min + c.level*~~equipped[other].min_damage_per_level
		phys_max_other = ~~equipped[other].damage_max + c.level*~~equipped[other].max_damage_per_level
	}
	var e_damage = c.e_damage - e_damage_other;
	var base_min = equipped[group].base_damage_min;
	var base_max = equipped[group].base_damage_max;
	if (thrown == 1) { base_min = ~~(equipped[group].throw_min); base_max = ~~(equipped[group].throw_max); }
	var phys_min = (base_min * (1+e_damage/100) + c.damage_min + c.level*c.min_damage_per_level - phys_min_other);
	var phys_max = (base_max * (1+(e_damage+(c.level*c.e_max_damage_per_level))/100) + c.damage_max + c.level*c.max_damage_per_level - phys_max_other);
	var phys_mult = (1+statBonus+(c.damage_bonus+weapon_skillup)/100);
//	if (c.skillName == "Shock Wave") {var phys_mult = (1+statBonus+((c.damage_bonus-(1+e_damage/100)-(1+e_damage/100))+weapon_skillup)/100);}
//	else {var phys_mult = (1+statBonus+(c.damage_bonus+weapon_skillup)/100)}
	if (phys_max < phys_min) { phys_max = phys_min + 1 };
	var values = [phys_min, phys_max, phys_mult, base_min, statBonus, weapon_skillup, e_damage];
//	var values2 = [statBonus, weapon_skillup, e_damage];
	return values 
//	return values2
}

// getNonPhysWeaponDamage - Calculates non-physical damage for an equipped weapon
//	group: weapon's group ('weapon' or 'offhand')
// return: indexed array with elemental/magic min/max damage values
// ---------------------------------
function getNonPhysWeaponDamage(group) {
	var c = character;
	var other = "offhand";
	if (group == "offhand") { other = "weapon" }
	var energyTotal = (c.energy + c.all_attributes)*(1+c.max_energy/100);
	var cDamage_sockets_filled = ~~(equipped.weapon.cDamage_per_socketed*socketed.weapon.socketsFilled)+~~(equipped.offhand.cDamage_per_socketed*socketed.offhand.socketsFilled);
	var f_min = c.fDamage_min*(1+c.fDamage/100);
	var f_max = (c.fDamage_max+(c.level*c.fDamage_max_per_level))*(1+c.fDamage/100);
	var c_min = (c.cDamage_min+(c.cDamage_per_ice*c.charge_ice)+cDamage_sockets_filled)*(1+c.cDamage/100);
	var c_max = (c.cDamage_max+(c.cDamage_per_ice*c.charge_ice)+(c.level*c.cDamage_max_per_level)+cDamage_sockets_filled)*(1+c.cDamage/100);
	var l_min = c.lDamage_min*(1+c.lDamage/100);
	var l_max = (c.lDamage_max+(c.level*c.lDamage_max_per_level)+(Math.floor(energyTotal/2)*c.lDamage_max_per_2_energy))*(1+c.lDamage/100);
	var p_min = (c.pDamage_all+c.pDamage_min)*(1+c.pDamage/100);	// TODO: Damage over time should be separate from regular damage. Calculate poison bitrate.
	var p_max = (c.pDamage_all+c.pDamage_max)*(1+c.pDamage/100);	//	 Also, poison doesn't overlap from different sources?
//	var mDamage_sockets_filled = ~~(equipped.weapon.mDamage_per_socketed*socketed.weapon.socketsFilled)+~~(equipped.offhand.mDamage_per_socketed*socketed.offhand.socketsFilled);
//	var m_min = (c.mDamage_min +mDamage_sockets_filled)*(1+c.mDamage/100);
//	var m_max = (c.mDamage_max +mDamage_sockets_filled)*(1+c.mDamage/100);
//	var m_min = c.mDamage_min;
//	var m_max = c.mDamage_max;
	var m_min = c.mDamage_min*(1+c.mDamage/100);
	var m_max = c.mDamage_max*(1+c.mDamage/100);
	if (offhandType == "weapon") {
		f_min = (c.fDamage_min-~~(equipped[other].fDamage_min))*(1+c.fDamage/100);
		f_max = ((c.fDamage_max-~~(equipped[other].fDamage_max))+(c.level*c.fDamage_max_per_level))*(1+c.fDamage/100);
		c_min = ((c.cDamage_min-~~(equipped[other].cDamage_min))+(c.cDamage_per_ice*c.charge_ice)+cDamage_sockets_filled)*(1+c.cDamage/100);
		c_max = ((c.cDamage_max-~~(equipped[other].cDamage_max))+(c.cDamage_per_ice*c.charge_ice)+(c.level*c.cDamage_max_per_level)+cDamage_sockets_filled)*(1+c.cDamage/100);
		l_min = (c.lDamage_min-~~(equipped[other].lDamage_min))*(1+c.lDamage/100);
		l_max = ((c.lDamage_max-~~(equipped[other].lDamage_max))+(c.level*c.lDamage_max_per_level)+(Math.floor(energyTotal/2)*c.lDamage_max_per_2_energy))*(1+c.lDamage/100);
		p_min = (c.pDamage_all+c.pDamage_min-~~(equipped[other].pDamage_min))*(1+c.pDamage/100);
		p_max = (c.pDamage_all+c.pDamage_max-~~(equipped[other].pDamage_max))*(1+c.pDamage/100);
//		m_min = (c.mDamage_min - ~~(equipped[other].mDamage_min)+mDamage_sockets_filled)*(1+c.mDamage/100);
//		m_max = (c.mDamage_max - ~~(equipped[other].mDamage_max)+mDamage_sockets_filled)*(1+c.mDamage/100);
//		m_min = c.mDamage_min - ~~(equipped[other].mDamage_min);
//		m_max = c.mDamage_max - ~~(equipped[other].mDamage_max);
		m_min = (c.mDamage_min - ~~(equipped[other].mDamage_min))*(1+c.mDamage/100);
		m_max = (c.mDamage_max - ~~(equipped[other].mDamage_max))*(1+c.mDamage/100);
}
	if (f_max < f_min) { f_max = f_min + 1 };
	if (c_max < c_min) { c_max = c_min + 1 };
	if (l_max < l_min) { l_max = l_min + 1 };
	if (p_max < p_min) { p_max = p_min + 1 };
	if (m_max < m_min) { m_max = m_min + 1 };
	var values = {fMin:f_min,fMax:f_max,cMin:c_min,cMax:c_max,lMin:l_min,lMax:l_max,pMin:p_min,pMax:p_max,mMin:m_min,mMax:m_max};
	return values
}

// updateStats - Updates all stats
// ---------------------------------
function updateStats() { if (loaded == 1) { updatePrimaryStats(); updateOther(); updateSecondaryStats(); updateTertiaryStats(); } }

// updatePrimaryStats - Updates stats shown by the default (original D2) stat page
// ---------------------------------
function updatePrimaryStats() {
	var c = character;
	var strTotal = (c.strength + c.all_attributes + c.level*c.strength_per_level);
	var dexTotal = (c.dexterity + c.all_attributes + c.level*c.dexterity_per_level);
	var vitTotal = (c.vitality + c.all_attributes + c.level*c.vitality_per_level);
	var energyTotal = (c.energy + c.all_attributes)*(1+c.max_energy/100);
	
	var life_addon = (vitTotal-c.starting_vitality)*c.life_per_vitality;
	var stamina_addon = (vitTotal-c.starting_vitality)*c.stamina_per_vitality;
	var mana_addon = (energyTotal-c.starting_energy)*c.mana_per_energy;
	
	var item_def = 0;
	for (group in corruptsEquipped) {
		if (typeof(equipped[group].base_defense) != 'undefined') { if (equipped[group].base_defense != unequipped.base_defense) {
			var multEth = 1;
			var multED = 1;
			if (typeof(equipped[group]["ethereal"]) != 'undefined') { if (equipped[group]["ethereal"] == 1) { multEth = 1.5; } }
			if (typeof(equipped[group]["e_def"]) != 'undefined') { multED += (equipped[group]["e_def"]/100) }
			if (typeof(corruptsEquipped[group]["e_def"]) != 'undefined') { multED += (corruptsEquipped[group]["e_def"]/100) }
			if (group == "helm" || group == "armor" || group == "weapon" || group == "offhand") { if (typeof(socketed[group].totals["e_def"]) != 'undefined') { multED += (socketed[group].totals["e_def"]/100) } }
			if (typeof(equipped[group].set_bonuses) != 'undefined') {
				for (let i = 2; i < equipped[group].set_bonuses.length; i++) { if (i <= character[equipped[group].set_bonuses[0]]) {
					for (affix in equipped[group].set_bonuses[i]) { if (affix == "e_def") { multED += equipped[group].set_bonuses[i][affix]/100 } }
				} }
			}
			equipped[group].item_defense = Math.ceil(multEth*multED*equipped[group].base_defense)// + ~~equipped[group].defense + Math.floor(~~equipped[group].defense_per_level*c.level)
			item_def += equipped[group].item_defense
			// TODO: Incorporate other defense affixes so item_defense can be referenced in the tooltip for total defense?
		} } else {
			//equipped[group].item_defense = ~~equipped[group].defense + Math.floor(~~equipped[group].defense_per_level*c.level)
		}
	}
	var def = (item_def + c.defense + c.level*c.defense_per_level + Math.floor(dexTotal/4)) * (1 + (c.defense_bonus + c.defense_skillup)/100);
	var ar = ((dexTotal - 7) * 5 + c.ar + c.level*c.ar_per_level + c.ar_const + (c.ar_per_socketed*socketed.offhand.socketsFilled)) * (1+(c.ar_skillup + c.ar_skillup2 + c.ar_bonus + c.level*c.ar_bonus_per_level)/100) * (1+c.ar_shrine_bonus/100);
	
/*	// Poison Calculation Testing
	var pDamage = c.pDamage_all;
	var pDuration = c.pDamage_duration;
	var pFrames = pDuration*25;
	var pAmount = Math.floor(pDamage*256/pFrames + (pFrames-1)/pFrames);
	var pBite = pAmount*pFrames;
	var pTotal_duration = Math.floor(pFrames / c.pDamage_duration);	// sum
	var pTotal_damage = Math.round(pAmount * pTotal_duration);	// sum
	document.getElementById("f4").innerHTML = c.pDamage_all+" over "+c.pDamage_duration+"s = "+Math.round(pTotal_damage/((256/25)*pDuration))+" "+pBite/pFrames
	document.getElementById("c4").innerHTML = pAmount+" "+pTotal_duration+" "+Math.round(pTotal_damage/(pDamage/pDuration))
*/
	var physDamage = getWeaponDamage(strTotal,dexTotal,"weapon",0);
	var dmg = getNonPhysWeaponDamage("weapon");
	var basic_min = Math.floor(physDamage[0]*physDamage[2] + dmg.fMin + dmg.cMin + dmg.lMin + dmg.pMin + dmg.mMin);
	var basic_max = Math.floor(physDamage[1]*physDamage[2] + dmg.fMax + dmg.cMax + dmg.lMax + dmg.pMax + dmg.mMax);
	if (basic_min > 0 || basic_max > 0) { document.getElementById("basic_attack").innerHTML = basic_min + "-" + basic_max + " {"+Math.ceil((basic_min+basic_max)/2)+"}";
		var breakdown = "Damage Breakdown- "; // \nPhys Damage: " + phys_min + "-" + phys_max +  "\nFire Damage: " + fDamage_min + "-" + fDamage_max + "\nCold Damage: " + cDamage_min + "-" + cDamage_max + "\nLight Damage: " + lDamage_min + "-" + lDamage_max  + "\nMagic Damage: " + mDamage_min + "-" + mDamage_maz  + "\nPoison Damage: " + pDamage_min + "-" + pDamage_max
//		if (Math.floor(physDamage[0]*physDamage[2]) > 0) {breakdown += "\nPhys Damage: " + Math.floor(physDamage[0]*physDamage[2]) + "-" + Math.floor(physDamage[1]*physDamage[2]) + "\nBase Weapon Damage: " + Math.floor(physDamage[3]) + "\nStat Bonus Damage: " + Math.floor(physDamage[4]*100) + "\nMastery Bonus Damage: " + Math.floor(physDamage[5]) + "\nOn Weapon ED: " + Math.floor(physDamage[3]*(1+physDamage[6]/100)) + "\nOff Weapon ED: " + physDamage[3]*(c.damage_bonus/100)}; //base_min, statBonus, weapon_skillup, e_damage , need damage_bonus
		if (Math.floor(physDamage[0]*physDamage[2]) > 0) {breakdown += "\nPhys Damage: " + Math.floor(physDamage[0]*physDamage[2]) + "-" + Math.floor(physDamage[1]*physDamage[2])}
		if (dmg.fMin > 0) {breakdown += "\nFire Damage: " + Math.floor(dmg.fMin) + "-" + Math.floor(dmg.fMax)};
		if (dmg.cMin > 0) {breakdown += "\nCold Damage: " + Math.floor(dmg.cMin) + "-" + Math.floor(dmg.cMax)};
		if (dmg.lMin > 0) {breakdown += "\nLight Damage: " + Math.floor(dmg.lMin) + "-" + Math.floor(dmg.lMax)};
		if (dmg.mMin > 0) {breakdown += "\nMagic Damage: " + Math.floor(dmg.mMin) + "-" + Math.floor(dmg.mMax)};
		if (dmg.pMin > 0) {breakdown += "\nPoison Damage: " + Math.floor(dmg.pMin) + "-" + Math.floor(dmg.pMax)};
		var TooltipElement = document.getElementById("basic_attack");
		TooltipElement.title = breakdown;
	}

	else { document.getElementById("basic_attack").innerHTML = "" }
	if (offhandType == "weapon") {
		var ohd = getNonPhysWeaponDamage("offhand");
		var physDamage_offhand = getWeaponDamage(strTotal,dexTotal,"offhand",0);
		var basic_min_offhand = Math.floor(physDamage_offhand[0]*physDamage_offhand[2] + ohd.fMin + ohd.cMin + ohd.lMin + ohd.pMin + ohd.mMin);
		var basic_max_offhand = Math.floor(physDamage_offhand[1]*physDamage_offhand[2] + ohd.fMax + ohd.cMax + ohd.lMax + ohd.pMax + ohd.mMax);
		if (equipped.weapon.name != "none") {
			if (basic_min_offhand > 0 || basic_max_offhand > 0) { document.getElementById("offhand_basic_damage").innerHTML = basic_min_offhand + "-" + basic_max_offhand + " {"+Math.ceil((basic_min_offhand+basic_max_offhand)/2)+"}"
				var ohdbreakdown = "Damage Breakdown- "; // \nPhys Damage: " + phys_min + "-" + phys_max +  "\nFire Damage: " + fDamage_min + "-" + fDamage_max + "\nCold Damage: " + cDamage_min + "-" + cDamage_max + "\nLight Damage: " + lDamage_min + "-" + lDamage_max  + "\nMagic Damage: " + mDamage_min + "-" + mDamage_maz  + "\nPoison Damage: " + pDamage_min + "-" + pDamage_max
				if (Math.floor(physDamage_offhand[0]*physDamage_offhand[2]) > 0) {ohdbreakdown += "\nPhys Damage: " + Math.floor(physDamage_offhand[0]*physDamage_offhand[2]) + "-" + Math.floor(physDamage_offhand[1]*physDamage_offhand[2])};
				if (ohd.fMin > 0) {ohdbreakdown += "\nFire Damage: " + Math.floor(ohd.fMin) + "-" + Math.floor(ohd.fMax)};
				if (ohd.cMin > 0) {ohdbreakdown += "\nCold Damage: " + Math.floor(ohd.cMin) + "-" + Math.floor(ohd.cMax)};
				if (ohd.lMin > 0) {ohdbreakdown += "\nLight Damage: " + Math.floor(ohd.lMin) + "-" + Math.floor(ohd.lMax)};
				if (ohd.mMin > 0) {ohdbreakdown += "\nMagic Damage: " + Math.floor(ohd.mMin) + "-" + Math.floor(ohd.mMax)};
				if (ohd.pMin > 0) {ohdbreakdown += "\nPoison Damage: " + Math.floor(ohd.pMin) + "-" + Math.floor(ohd.pMax)};
				var TooltipElement = document.getElementById("offhand_basic_damage");
				TooltipElement.title = ohdbreakdown;
			}
			else { document.getElementById("offhand_basic_damage").innerHTML = "" }
		} else {
			if (basic_min_offhand > 0 || basic_max_offhand > 0) { document.getElementById("basic_attack").innerHTML = basic_min_offhand + "-" + basic_max_offhand + " {"+Math.ceil((basic_min_offhand+basic_max_offhand)/2)+"}"; document.getElementById("offhand_basic").style.display = "none"; }
		}
	}
	
	var block_shield = c.block;
	if (c.class_name == "Amazon" || c.class_name == "Assassin" || c.class_name == "Barbarian") { block_shield -= 5 }
	if (c.class_name == "Druid" || (c.class_name == "Necromancer" && equipped.offhand.only != "necromancer") || c.class_name == "Sorceress") { block_shield -= 10 }
	var block = (Math.max(0,block_shield) + c.ibc)*(dexTotal-15)/(c.level*2)
	if (c.block_skillup > 0) { block = Math.min((c.block_skillup*(dexTotal-15)/(c.level*2)),c.block_skillup) }
	if (c.running > 0) { block = Math.min(25,block/3) }
	if (c.block > 0 || c.block_skillup > 0) {
		document.getElementById("block_label").style.visibility = "visible"
		document.getElementById("block").innerHTML = Math.floor(Math.min(75,block))+"%"
	} else {
		document.getElementById("block_label").style.visibility = "hidden"
		document.getElementById("block").innerHTML = ""
	}
	
	//var enemy_lvl = ~~MonStats[monsterID][4+c.difficulty];
	var enemy_lvl = Math.min(~~c.level,89);	// temp, sets 'area level' at the character's level (or as close as possible if the area level isn't available in the selected difficulty)
	if (c.difficulty == 1) { enemy_lvl = Math.min(43,enemy_lvl) }
	else if (c.difficulty == 2) { enemy_lvl = Math.max(36,Math.min(66,enemy_lvl)) }
	else if (c.difficulty == 3) { enemy_lvl = Math.max(67,enemy_lvl) }
	var enemy_def = (~~MonStats[monsterID][8] * ~~MonLevel[enemy_lvl][c.difficulty])/100;
	enemy_def = Math.max(0,enemy_def + enemy_def*(c.enemy_defense+c.target_defense)/100+c.enemy_defense_flat)
	var hit_chance = Math.round(Math.max(5,Math.min(95,(100 * ar / (ar + enemy_def)) * (2 * c.level / (c.level + enemy_lvl)))));

	document.getElementById("strength").innerHTML = Math.floor(strTotal)
	document.getElementById("dexterity").innerHTML = Math.floor(dexTotal)
	document.getElementById("vitality").innerHTML = Math.floor(vitTotal)
	document.getElementById("energy").innerHTML = Math.floor(energyTotal)
	document.getElementById("strength2").innerHTML = Math.floor(strTotal)
	document.getElementById("dexterity2").innerHTML = Math.floor(dexTotal)
	document.getElementById("vitality2").innerHTML = Math.floor(vitTotal)
	document.getElementById("energy2").innerHTML = Math.floor(energyTotal)
	document.getElementById("defense").innerHTML = Math.floor(def + c.melee_defense)
	if ((c.missile_defense-c.melee_defense) > 0) { document.getElementById("defense").innerHTML += " (+" + (c.missile_defense) + ")" }	// add difference when missile & melee defense are both present?
	if (c.running > 0) { document.getElementById("defense").style.color = "brown" }
	else { document.getElementById("defense").style.color = "gray" }
	document.getElementById("ar").innerHTML = Math.floor(ar)+" ("+hit_chance+"%)"
	document.getElementById("stamina").innerHTML = Math.floor((c.stamina + c.level*c.stamina_per_level + stamina_addon) * (1+c.stamina_skillup/100) * (1+c.max_stamina/100))
//	var lifeTotal = Math.floor((c.life + c.level*c.life_per_level + life_addon) * (1 + c.max_life/100));
	lifeTotal = Math.floor((c.life + c.level*c.life_per_level + life_addon) * (1 + c.max_life/100));
	document.getElementById("life").innerHTML = lifeTotal
	document.getElementById("mana").innerHTML = Math.floor((c.mana + c.level*c.mana_per_level + mana_addon) * (1 + c.max_mana/100))
	document.getElementById("level").innerHTML = c.level
	document.getElementById("class_name").innerHTML = c.class_name
	document.getElementById("remainingstats").innerHTML = c.statpoints
	document.getElementById("remainingskills").innerHTML = c.skillpoints
	document.getElementById("fres").innerHTML = (c.fRes + c.all_res - c.fRes_penalty + c.resistance_skillup) + " / " + Math.min(RES_CAP,(c.fRes_max_base + c.fRes_max + c.fRes_skillup)) + "%"
	document.getElementById("cres").innerHTML = (c.cRes + c.all_res - c.cRes_penalty + c.resistance_skillup) + " / " + Math.min(RES_CAP,(c.cRes_max_base + c.cRes_max + c.cRes_skillup)) + "%"
	document.getElementById("lres").innerHTML = (c.lRes + c.all_res - c.lRes_penalty + c.resistance_skillup) + " / " + Math.min(RES_CAP,(c.lRes_max_base + c.lRes_max + c.lRes_skillup)) + "%"
	document.getElementById("pres").innerHTML = (c.pRes + c.all_res - c.pRes_penalty + c.resistance_skillup) + " / " + Math.min(RES_CAP,(c.pRes_max_base + c.pRes_max + c.pRes_skillup)) + "%"
	var magicRes = c.mRes;
	if (c.mRes > 0 || c.mDamage_reduced > 0) { magicRes += "%" }
	if (c.mDamage_reduced > 0) { magicRes += (" +"+c.mDamage_reduced) }
	document.getElementById("mres").innerHTML = magicRes
	
	var ias = c.ias + Math.floor(dexTotal/8)*c.ias_per_8_dexterity;
	if (offhandType == "weapon" && typeof(equipped.offhand.ias) != 'undefined') { ias -= equipped.offhand.ias }
	var ias_total = ias + c.ias_skill;
	document.getElementById("ias").innerHTML = ias; if (ias > 0) { document.getElementById("ias").innerHTML += "%" }
	if (equipped.weapon.type != "" && equipped.weapon.special != 1) {
		var weaponType = equipped.weapon.type;
		var eIAS = Math.floor(120*ias/(120+ias));
		var weaponFrames = 0;
		var weaponSpeedModifier = c.baseSpeed - ~~equipped.offhand.baseSpeed;
		var anim_speed = 256;
		if (weaponType != "") {
			// TODO: Add fpa/aps to skills (many skills attack multiple times at different speeds, or interact with IAS differently (e.g. +30 WSM for throwing skills))
			if (weaponType == "club" || weaponType == "hammer") { weaponType = "mace" }
			weaponFrames = c.weapon_frames[weaponType];
			if (typeof(effects["Werewolf"]) != 'undefined') { if (effects["Werewolf"].info.enabled == 1) { weaponFrames = character_all.druid.wereform_frames[weaponType]; anim_speed = 256; } }
			if (typeof(effects["Werebear"]) != 'undefined') { if (effects["Werebear"].info.enabled == 1) { weaponFrames = character_all.druid.wereform_frames[weaponType]; anim_speed = 224; } }
			if (weaponType == "sword" || weaponType == "axe" || weaponType == "mace") { if (equipped.weapon.twoHanded == 1) { weaponFrames = weaponFrames[1]; } else { weaponFrames = weaponFrames[0]; } }
			if (weaponType == "thrown") { if (equipped.weapon.subtype == "dagger") { weaponFrames = weaponFrames[1]; } else { weaponFrames = weaponFrames[0]; } }
			if (weaponType == "claw") { anim_speed = 208 }	// can't interact with werewolf/werebear frames due to itemization
		}
		weaponFrames += 1
		var combined_ias = Math.min(175,Math.max(15,(100 + c.ias_skill + eIAS - weaponSpeedModifier)));
		var frames_per_attack = Math.ceil((weaponFrames*256)/Math.floor(anim_speed * combined_ias / 100)) - 1;
		if (weaponType == "claw") {
			var frames_per_attack_alternate = Math.ceil(((weaponFrames+1)*256)/Math.floor(anim_speed * combined_ias / 100)) - 1;
			frames_per_attack = (frames_per_attack + frames_per_attack_alternate) / 2
		}
		/*
		// TODO: implement wereform IAS frame info
		if (typeof(effects["Werewolf"]) != 'undefined' || typeof(effects["Werebear"]) != 'undefined') {	if (effects["Werewolf"].info.enabled == 1 || effects["Werebear"].info.enabled == 1) {
			var wereFrames = 0;
			var frames_neutral = 0;
			var frames_char = frames_per_attack;
			if (typeof(effects["Werewolf"]) != 'undefined') { if (effects["Werewolf"].info.enabled == 1) { wereFrames = 12; frames_neutral = 9; } }
			if (typeof(effects["Werebear"]) != 'undefined') { if (effects["Werebear"].info.enabled == 1) { wereFrames = 13; frames_neutral = 10; } }
			if (weaponType == "sword") { if (equipped.weapon.twoHanded == 1) { frames_char = wereFrames } }
			anim_speed = Math.floor(256*frames_neutral/Math.floor(256*frames_char/Math.floor((100+~~equipped.weapon.ias - weaponSpeedModifier)*256/100)))
			frames_per_attack = Math.ceil((wereFrames*256)/Math.floor(anim_speed * (100 + c.ias_skill + eIAS - weaponSpeedModifier) / 100)) - 1;
		} }
		*/
		// TODO: implement basic IAS breakpoints for dual-wielding
		if (offhandType != "weapon") {
			document.getElementById("ias").innerHTML += " ("+frames_per_attack+" fpa)"
		}
		// This adds the on-weapon ias stat, not the best way to do it but it adds up ias from all equipped items except weapon
		// and subtracts that from the total ias. I couldn't figure out how to get just the on weapon ias plus ias from sockets
		// so i took everything else and removed it from the total. 
//		if (effects["Werebear"] != null || effects["Werewolf"] != null ) {	
			if (equipped.armor.ias > 1) {armorias = equipped.armor.ias}		
				else {armorias = 0}	
			if (equipped.helm.ias > 1) {helmias = equipped.helm.ias}		
				else {helmias = 0}	
			if (equipped.amulet.ias > 1) {amuletias = equipped.amulet.ias}		
				else {amuletias = 0}	
			if (equipped.belt.ias > 1) {beltias = equipped.belt.ias}		
				else {beltias = 0}	
			if (equipped.ring1.ias > 1) {ring1ias = equipped.ring1.ias}		
				else {ring1ias = 0}	
			if (equipped.ring2.ias > 1) {ring2ias = equipped.ring2.ias}		
				else {ring2ias = 0}	
			if (equipped.boots.ias > 1) {bootsias = equipped.boots.ias}		
				else {bootsias = 0}	
			if (equipped.gloves.ias > 1) {glovesias = equipped.gloves.ias}		
				else {glovesias = 0}	
			offwepias = armorias + helmias + amuletias + beltias + ring1ias + ring2ias + bootsias + glovesias
			wias = ias - offwepias
		if (effects["Werebear"] != null || effects["Werewolf"] != null ) {	
			document.getElementById("wias_label").style.visibility = "visible"
			document.getElementById("wias").innerHTML = wias + "<br>"
		} else {
			document.getElementById("wias_label").style.visibility = "hidden"
			document.getElementById("wias").innerHTML = ""
		}	
	}
	if (c.flamme > 0) { document.getElementById("flamme").innerHTML = "Righteous Fire deals "+Math.floor((c.flamme/100*lifeTotal)*(1+c.fDamage/100))+" damage per second<br>" } else { document.getElementById("flamme").innerHTML = "" }
} 

// updateSecondaryStats - Updates stats shown on the secondary (Path of Diablo) stat page
// ---------------------------------
function updateSecondaryStats() {
	var c = character;
	
	var physRes = ""; if (c.pdr > 0) { physRes = Math.min(50,c.pdr)+"% " }
	if (c.damage_reduced > 0) { physRes += ("+"+c.damage_reduced) }
	if (c.pdr == 0 && c.damage_reduced == 0) { physRes = 0 }
	document.getElementById("pdr").innerHTML = physRes

	var fAbs = ""; if (c.fAbsorb > 0) { fAbs = c.fAbsorb+"% " }
	if (c.fAbsorb_flat > 0 || c.fAbsorb_flat_per_level > 0) { fAbs += ("+"+Math.floor(c.fAbsorb_flat + (c.level*c.fAbsorb_flat_per_level))) }
	if (c.fAbsorb == 0 && c.fAbsorb_flat == 0 && c.fAbsorb_flat_per_level == 0) { fAbs = 0 }
	document.getElementById("fabsorb").innerHTML = fAbs
	var cAbs = ""; if (c.cAbsorb > 0) { cAbs = c.cAbsorb+"% " }
	if (c.cAbsorb_flat > 0 || c.cAbsorb_flat_per_level > 0) { cAbs += ("+"+Math.floor(c.cAbsorb_flat + (c.level*c.cAbsorb_flat_per_level))) }
	if (c.cAbsorb == 0 && c.cAbsorb_flat == 0 && c.cAbsorb_flat_per_level == 0) { cAbs = 0 }
	document.getElementById("cabsorb").innerHTML = cAbs
	var lAbs = ""; if (c.lAbsorb > 0) { lAbs = c.lAbsorb+"% " }
	if (c.lAbsorb_flat > 0) { lAbs += ("+"+c.lAbsorb_flat) }
	if (c.lAbsorb == 0 && c.lAbsorb_flat == 0) { lAbs = 0 }
	document.getElementById("labsorb").innerHTML = lAbs
	document.getElementById("mabsorb").innerHTML = c.mAbsorb_flat

	if (eseff > 0) {
		document.getElementById("eseff_label").style.visibility = "visible"
		document.getElementById("eseff").innerHTML = eseff + "%"
	} else {
		document.getElementById("eseff_label").style.visibility = "hidden"
		document.getElementById("eseff").innerHTML = ""
	}	
	if (esprcnt > 0) {
		document.getElementById("esprcnt_label").style.visibility = "visible"
		document.getElementById("esprcnt").innerHTML = esprcnt + "%";
//		getESDamageTaken - No extra function needed, this does the job
		var esdamagetaken = "Per 500 damage taken,\nHP will lose:" ;
		esdamagetaken += "\nPhys: " + Math.round(((500 * (1-(esprcnt/100))) - c.damage_reduced) *(1-(c.pdr/100))*(1-(c.block/100)));
//		esdamagetaken += "\nPhys: " + Math.round((500-c.damage_reduced)*(1-(c.pdr/100))*(1-(c.block/100))*(1-(esprcnt/100))) ;
//		esdamagetaken += "\nFire: " + Math.round((500-c.mDamage_reduced)*(1-(c.fRes + c.all_res - c.fRes_penalty + c.resistance_skillup)/100)*(1-esprcnt/100)) ;
//		esdamagetaken += "\nCold: " + Math.round((500-c.mDamage_reduced)*(1-(c.cRes + c.all_res - c.cRes_penalty + c.resistance_skillup)/100)*(1-esprcnt/100)) ;
//		esdamagetaken += "\nLight: " + Math.round((500-c.mDamage_reduced)*(1-(c.lRes + c.all_res - c.lRes_penalty + c.resistance_skillup)/100)*(1-esprcnt/100)) ;
		esdamagetaken += "\nFire: " + Math.round(((500 * (1-esprcnt/100))  - c.mDamage_reduced) * (1-(c.fRes + c.all_res - c.fRes_penalty + c.resistance_skillup)/100) * (1-c.fAbsorb/100) - (c.fAbsorb_flat + (c.level*c.fAbsorb_flat_per_level))) ;
		esdamagetaken += "\nCold: " + Math.round(((500 * (1-esprcnt/100))  - c.mDamage_reduced) * (1-(c.cRes + c.all_res - c.cRes_penalty + c.resistance_skillup)/100) * (1-c.cAbsorb/100) - (c.cAbsorb_flat + (c.level*c.cAbsorb_flat_per_level))) ;
		esdamagetaken += "\nLight: " + Math.round(((500 * (1-esprcnt/100))  - c.mDamage_reduced) * (1-(c.lRes + c.all_res - c.lRes_penalty + c.resistance_skillup)/100) * (1-c.lAbsorb/100) - c.lAbsorb_flat) ;
		esdamagetaken += "\nThese cannot be negative numbers, assume anything "
		esdamagetaken += "\nbelow zero is actually 1"

		var TooltipElement = document.getElementById("esprcnt");
		TooltipElement.title = esdamagetaken  ;	
	} else {
		document.getElementById("esprcnt_label").style.visibility = "hidden"
		document.getElementById("esprcnt").innerHTML = ""
	}	
	
	document.getElementById("cdr").innerHTML = c.cdr; if (c.cdr > 0) { document.getElementById("cdr").innerHTML += "%" }
	var fcrTotal = c.fcr + Math.floor(c.level*c.fcr_per_level);
	
	var fcr_f = c.fcr_frames;
	for (let i = 1; i < c.fcr_bp.length; i++) { if (fcrTotal >= c.fcr_bp[i]) { fcr_f -= 1 } }
	
	var fhr_f = c.fhr_frames;
	for (let i = 1; i < c.fhr_bp.length; i++) { if (c.fhr >= c.fhr_bp[i]) { fhr_f -= 1 } }
	if (c.class_name == "Paladin") { if (equipped.weapon.type == "spear" || equipped.weapon.type == "staff") {
		fhr_f = c.fhr_frames_alt;
		for (let i = 1; i < c.fhr_bp_alt.length; i++) { if (c.fhr >= c.fhr_bp_alt[i]) { fhr_f -= 1 } }
	} }
	if (c.class_name == "Druid") { if (equipped.weapon.twoHanded != 1 && (equipped.weapon.type == "axe" || equipped.weapon.type == "mace" || equipped.weapon.type == "sword" || equipped.weapon.type == "wand")) {	// TODO: Also include throwing axes?
		fhr_f = c.fhr_frames_alt;
		for (let i = 1; i < c.fhr_bp_alt.length; i++) { if (c.fhr >= c.fhr_bp_alt[i]) { fhr_f -= 1 } }
	} }
	
	var fbr_f = c.fbr_frames;
	for (let i = 1; i < c.fbr_bp.length; i++) { if (c.fbr >= c.fbr_bp[i]) { fbr_f -= 1 } }
	if (c.class_name == "Amazon") { if (equipped.weapon.twoHanded != 1 && (equipped.weapon.type == "axe" || equipped.weapon.type == "mace" || equipped.weapon.type == "sword" || equipped.weapon.type == "wand")) {	// TODO: Also include throwing axes?
		fbr_f = c.fbr_frames_alt;
		for (let i = 1; i < c.fbr_bp_alt.length; i++) { if (c.fbr >= c.fbr_bp_alt[i]) { fbr_f -= 1 } }
	} }
	if (c.class_name == "Paladin") { if (effects["Holy_Shield"] != null) { if (typeof(effects["Holy_Shield"].info.enabled) != 'undefined') { if (effects["Holy_Shield"].info.enabled == 1) {
		fbr_f = c.fbr_frames_alt;
		for (let i = 1; i < c.fbr_bp_alt.length; i++) { if (c.fbr >= c.fbr_bp_alt[i]) { fbr_f -= 1 } }
	} } } }
	
	if (effects["Werebear"] != null) { if (typeof(effects["Werebear"].info.enabled) != 'undefined') { if (effects["Werebear"].info.enabled == 1) {
		fcr_f = character_all.druid.fcr_frames_werebear
		for (let i = 1; i < character_all.druid.fcr_bp_werebear.length; i++) { if (fcrTotal >= character_all.druid.fcr_bp_werebear[i]) { fcr_f -= 1 } }
		fhr_f = character_all.druid.fhr_frames_werebear
		for (let i = 1; i < character_all.druid.fhr_bp_werebear.length; i++) { if (c.fhr >= character_all.druid.fhr_bp_werebear[i]) { fhr_f -= 1 } }
		fbr_f = character_all.druid.fbr_frames_werebear
		for (let i = 1; i < character_all.druid.fbr_bp_werebear.length; i++) { if (c.fbr >= character_all.druid.fbr_bp_werebear[i]) { fbr_f -= 1 } }
	} } }
	if (effects["Werewolf"] != null) { if (typeof(effects["Werewolf"].info.enabled) != 'undefined') { if (effects["Werewolf"].info.enabled == 1) {
		fcr_f = character_all.druid.fcr_frames_werewolf
		for (let i = 1; i < character_all.druid.fcr_bp_werewolf.length; i++) { if (fcrTotal >= character_all.druid.fcr_bp_werewolf[i]) { fcr_f -= 1 } }
		fhr_f = character_all.druid.fhr_frames_werewolf
		for (let i = 1; i < character_all.druid.fhr_bp_werewolf.length; i++) { if (c.fhr >= character_all.druid.fhr_bp_werewolf[i]) { fhr_f -= 1 } }
		fbr_f = character_all.druid.fbr_frames_werewolf
		for (let i = 1; i < character_all.druid.fbr_bp_werewolf.length; i++) { if (c.fbr >= character_all.druid.fbr_bp_werewolf[i]) { fbr_f -= 1 } }
	} } }
	
	document.getElementById("fcr").innerHTML = fcrTotal; if (fcrTotal > 0) { document.getElementById("fcr").innerHTML += "%" }
	document.getElementById("fhr").innerHTML = c.fhr; if (c.fhr > 0) { document.getElementById("fhr").innerHTML += "%" }

	document.getElementById("fbr").innerHTML = c.fbr; if (c.fbr > 0) { document.getElementById("fbr").innerHTML += "%" }
	if (fcrTotal > 0 || equipped.weapon.name != "none" || equipped.offhand.name != "none") { document.getElementById("fcr").innerHTML += " ("+fcr_f+"f)" }
	if (c.fhr > 0 || equipped.weapon.name != "none" || equipped.offhand.name != "none") { document.getElementById("fhr").innerHTML += " ("+fhr_f+"f)" }
	if (c.fbr > 0 || c.block > 0 || c.block_skillup > 0) { document.getElementById("fbr").innerHTML += " ("+fbr_f+"f)" }
	
	// actual movespeed
	var movespeed = 9;
	var movement = (1 + (Math.floor(150*c.frw/(150+c.frw)) + c.frw_skillup + c.velocity)/100);
	if (c.running > 0) { movespeed = round(9 * movement) } else { movespeed = round(6 * movement) }
	document.getElementById("velocity").innerHTML = movespeed + " yds/s"
	document.getElementById("frw").innerHTML = Math.floor(c.frw + c.frw_skillup); if (c.frw > 0 || c.frw_skillup > 0) { document.getElementById("frw").innerHTML += "%" }
	//document.getElementById("frw").innerHTML += " ("+movespeed+" yds/s)"
	
	document.getElementById("life_leech").innerHTML = c.life_leech; if (c.life_leech > 0) { document.getElementById("life_leech").innerHTML += "%" }
	document.getElementById("mana_leech").innerHTML = c.mana_leech; if (c.mana_leech > 0) { document.getElementById("mana_leech").innerHTML += "%" }
	var LPH = c.life_per_hit + "m , " + c.life_per_ranged_hit + "r";
	if (LPH == "0m , 0r") { LPH = 0 }
	document.getElementById("life_per_hit").innerHTML = LPH
	var MPH = c.mana_per_hit + "m , " + c.mana_per_ranged_hit + "r";
	if (MPH == "0m , 0r") { MPH = 0 }
	document.getElementById("mana_per_hit").innerHTML = MPH
	
	document.getElementById("fdamage").innerHTML = c.fDamage; if (c.fDamage > 0) { document.getElementById("fdamage").innerHTML += "%" }
	document.getElementById("cdamage").innerHTML = c.cDamage; if (c.cDamage > 0) { document.getElementById("cdamage").innerHTML += "%" }
	document.getElementById("ldamage").innerHTML = c.lDamage; if (c.lDamage > 0) { document.getElementById("ldamage").innerHTML += "%" }
	document.getElementById("pdamage").innerHTML = c.pDamage; if (c.pDamage > 0) { document.getElementById("pdamage").innerHTML += "%" }
	document.getElementById("mdamage").innerHTML = c.mDamage; if (c.mDamage > 0) { document.getElementById("mdamage").innerHTML += "%" }
	document.getElementById("physicalDamage").innerHTML = c.physicalDamage; if (c.physicalDamage > 0) { document.getElementById("physicalDamage").innerHTML += "%" }

//	document.getElementById("fpierce").innerHTML = c.fPierce; 
//	if (c.multPierce > 0 && c.fPierce > 0) 
//		{ document.getElementById("fpierce").innerHTML = Math.round(c.fPierce * c.multPierce); document.getElementById("fpierce").innerHTML += "%" }
//	else{	document.getElementById("fpierce").innerHTML = c.fPierce; if (c.fPierce > 0) { document.getElementById("fpierce").innerHTML += "%" }}

	document.getElementById("fpierce").innerHTML = c.fPierce; if (c.fPierce > 0) { document.getElementById("fpierce").innerHTML += "%" }
	document.getElementById("cpierce").innerHTML = c.cPierce; if (c.cPierce > 0) { document.getElementById("cpierce").innerHTML += "%" }
	document.getElementById("lpierce").innerHTML = c.lPierce; if (c.lPierce > 0) { document.getElementById("lpierce").innerHTML += "%" }
	document.getElementById("ppierce").innerHTML = c.pPierce; if (c.pPierce > 0) { document.getElementById("ppierce").innerHTML += "%" }
	document.getElementById("mpierce").innerHTML = c.mPierce; if (c.mPierce > 0) { document.getElementById("mpierce").innerHTML += "%" }
	
	document.getElementById("pierce").innerHTML = c.pierce + c.pierce_skillup; if (c.pierce > 0 || c.pierce_skillup > 0) { document.getElementById("pierce").innerHTML += "%" }
	document.getElementById("e_damage").innerHTML = c.e_damage; if (c.e_damage > 0) { document.getElementById("e_damage").innerHTML += "%" }
	document.getElementById("damage_bonus").innerHTML = c.damage_bonus; if (c.damage_bonus > 0) { document.getElementById("damage_bonus").innerHTML += "%" }
	document.getElementById("cblow").innerHTML = c.cblow; if (c.cblow > 0) { document.getElementById("cblow").innerHTML += "%" }
	document.getElementById("dstrike").innerHTML = c.dstrike + Math.floor(c.level*c.dstrike_per_level); if (c.dstrike > 0 || c.dstrike_per_level > 0) { document.getElementById("dstrike").innerHTML += "%" }
	document.getElementById("cstrike").innerHTML = c.cstrike + c.cstrike_skillup; if (c.cstrike > 0 || c.cstrike_skillup > 0) { document.getElementById("cstrike").innerHTML += "%" }
	var cstriketotal = c.cstrike + c.cstrike_skillup
	var doubled = (cstriketotal + (c.dstrike + Math.floor(c.level*c.dstrike_per_level)) * (100 - cstriketotal)/100) ;
	TooltipElementdoubled = document.getElementById("dstrike");
	TooltipElementdoubled.title = doubled + "% chance of double damage from " + cstriketotal + "% CS and " + (c.dstrike + Math.floor(c.level*c.dstrike_per_level)) + "% DS chances" ; // \nFormula is Critical Strike + Deadly Strike * (100 - Critical Strike)/100";
	document.getElementById("owounds").innerHTML = c.owounds; if (c.owounds > 0) { document.getElementById("owounds").innerHTML += "%" }

//	document.getElementById("damage_reduced").innerHTML = c.damage_reduced; if (c.damage_reduced > 0) { document.getElementById("damage_reduced")}
	document.getElementById("mDamage_reduced").innerHTML = c.mDamage_reduced; if (c.mDamage_reduced > 0) { document.getElementById("mDamage_reduced")}
	
	var mf = Math.floor(c.mf + c.level*c.mf_per_level);
	var eMF = Math.floor(mf*250/(mf+250));
	document.getElementById("mf").innerHTML = mf; if (c.mf != 0 || c.mf_per_level != 0) { document.getElementById("mf").innerHTML += "% ("+eMF+"%)" }
	document.getElementById("gf").innerHTML = c.gf; if (c.gf != 0) { document.getElementById("gf").innerHTML += "%" }
	
	document.getElementById("damage_vs_demons").innerHTML = c.damage_vs_demons; if (c.damage_vs_demons > 0) { document.getElementById("damage_vs_demons").innerHTML += "%" }
	document.getElementById("damage_vs_undead").innerHTML = Math.floor(c.damage_vs_undead + c.level*c.damage_vs_undead_per_level); if (c.damage_vs_undead > 0 || c.damage_vs_undead_per_level > 0) { document.getElementById("damage_vs_undead").innerHTML += "%" }
	document.getElementById("ar_vs_demons").innerHTML = c.ar_vs_demons
	document.getElementById("ar_vs_undead").innerHTML = Math.floor(c.ar_vs_undead + c.level*c.ar_vs_undead_per_level)
	
	if (c.life_per_demon_kill > 0) { document.getElementById("life_per_kill").innerHTML = c.life_per_kill + " , " + c.life_per_demon_kill + " (demons)" } else { document.getElementById("life_per_kill").innerHTML = c.life_per_kill }
	document.getElementById("mana_per_kill").innerHTML = c.mana_per_kill
	var lifeRegen = "";
//	if (c.life_regen > 0) { lifeRegen = c.life_regen+"% " }; if (c.life_replenish > 0) { lifeRegen += ("+"+c.life_replenish) }; if (c.life_regen == 0 && c.life_replenish == 0) { lifeRegen = 0 }
	if (c.life_regen > 0) { lifeRegen = c.life_regen+"% "}; if (c.life_replenish > 0) { lifeRegen += ("+"+c.life_replenish); lifeRegen += " (" + (Math.floor(lifeTotal * (c.life_regen/100))+ c.life_replenish) +")"  }; if (c.life_regen == 0 && c.life_replenish == 0) { lifeRegen = 0 }
	document.getElementById("life_regen").innerHTML = lifeRegen
//	Testing mana regen formulas, how much per second
//	var energyTotal = Math.floor((c.energy + c.all_attributes)*(1+c.max_energy/100));	
//	console.log(energyTotal, "Energy total")
//	var mana_addon = (energyTotal-c.starting_energy)*c.mana_per_energy;
//	console.log(mana_addon, "Mana addon")
//	var manaTotal = (c.mana + c.level*c.mana_per_level + mana_addon) * (1 + c.max_mana/100);
//	console.log(manaTotal, "Mana total")
////	Math.floor((c.mana + c.level*c.mana_per_level + mana_addon) * (1 + c.max_mana/100))
//	manaRegeneratedPerSecond = Math.round(10 * (5 * ((256 * manaTotal / (25 * 120)) * (100 + c.mana_regen) / 100) / 256)) / 10;
////	manaRegeneratedPerSecond = 	Math.round(manaTotal * (100 + c.mana_regen) / 12000)
//	console.log(manaRegeneratedPerSecond, "Mana per second")
	document.getElementById("mana_regen").innerHTML = Math.round(c.mana_regen,1)+"%"//+" ("+manaRegeneratedPerSecond+" per second)"	// TODO: mana_regen should multiply base regen (1.66%) instead of being additive? Or is the 1.66 value meant to be 166%?
//	document.getElementById("mana_regen").innerHTML = Math.round(c.mana_regen,1)+"%"+" ("+manaRegeneratedPerSecond+" per second)"	// TODO: mana_regen should multiply base regen (1.66%) instead of being additive? Or is the 1.66 value meant to be 166%?
	//var manaTotal = Math.floor((c.mana + c.level*c.mana_per_level + mana_addon) * (1 + c.max_mana/100));
	//var manaRegeneratedPerSecond = 25 * Math.floor(Math.floor(256*manaTotal/(25*120)) * ((100+c.mana_regen)/100)) / 256;
	
	document.getElementById("damage_to_mana").innerHTML = c.damage_to_mana; if (c.damage_to_mana > 0) { document.getElementById("damage_to_mana").innerHTML += "%" }
	
//	document.getElementById("enemy_fres").innerHTML = c.enemy_fRes; if (c.enemy_fRes < 0) { document.getElementById("enemy_fres").innerHTML += "%" } ; elseif (c.enemy_fRes < 0); {document.getElementById("enemy_fres").style.visibility = "hidden"}
	document.getElementById("enemy_fres").innerHTML = c.enemy_fRes; if (c.enemy_fRes < 0) { document.getElementById("enemy_fres").innerHTML += "%" }
	document.getElementById("enemy_cres").innerHTML = c.enemy_cRes; if (c.enemy_cRes < 0) { document.getElementById("enemy_cres").innerHTML += "%" }
	document.getElementById("enemy_lres").innerHTML = c.enemy_lRes; if (c.enemy_lRes < 0) { document.getElementById("enemy_lres").innerHTML += "%" }
	document.getElementById("enemy_pres").innerHTML = c.enemy_pRes; if (c.enemy_pRes < 0) { document.getElementById("enemy_pres").innerHTML += "%" }
	document.getElementById("enemy_mres").innerHTML = c.enemy_mRes; if (c.enemy_mRes < 0) { document.getElementById("enemy_mres").innerHTML += "%" }
	document.getElementById("enemy_physRes").innerHTML = c.enemy_physRes; if (c.enemy_physRes < 0) { document.getElementById("enemy_physRes").innerHTML += "%" }

//	document.getElementById("totalwhirly").innerHTML = totalwhirly
//	document.getElementById("whirlychance").innerHTML = whirlychance
//	document.getElementById("whirlychance").innerHTML = c.whirlychance; if (c.whirlychance > 0) { document.getElementById("whirlychance").innerHTML += "%" }
//	document.getElementById("added_whirlychance").innerHTML = c.added_whirlychance; if (c.added_whirlychance > 0) { document.getElementById("added_whirlychance").innerHTML += "%" }
	if (c.added_whirlychance > 0 || c.whirlychance > 0){ 
		c.totalwhirly = (c.added_whirlychance + c.whirlychance);
		document.getElementById("wa_label").style.visibility = "visible";
		document.getElementById("totalwhirly").innerHTML = c.totalwhirly; 
	}
	else {
		document.getElementById("wa_label").style.visibility = "hidden"
		document.getElementById("totalwhirly").innerHTML = ""
	}
//	if (c.added_whirlychance > 0 || c.whirlychance > 0){ c.totalwhirly = (c.added_whirlychance + c.whirlychance)}
//	document.getElementById("totalwhirly").innerHTML = c.totalwhirly; if (c.totalwhirly > 0) { document.getElementById("totalwhirly").innerHTML += "%" }

	if (character.class_name != "Druid"){document.getElementById("fhr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + c.fhr_bp}
	else if (character.class_name == "Druid") {document.getElementById("fhr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1-hand swing: " + c.fhr_bp_alt + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All other weapon: " + c.fhr_bp + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Werebear: " + c.fhr_bp_werebear + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Werewolf: " + c.fhr_bp_werewolf}
	if (character.class_name == "Amazon"||"Assassin"||"Barbarian"||"Paladin"||"Necromancer"){document.getElementById("fcr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + c.fcr_bp}
	if (character.class_name == "Druid") {document.getElementById("fcr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unchanged: " + c.fcr_bp + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Werebear: " + c.fcr_bp_werebear + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Werewolf: " + c.fcr_bp_werewolf}
	if (character.class_name == "Sorceress") {document.getElementById("fcr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + c.fcr_bp + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Light/Chain Light: " + c.fcr_bp_alt}
	if (character.class_name == "Sorceress"||"Assassin"||"Barbarian"||"Necromancer"){document.getElementById("fbr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + c.fbr_bp}
	if (character.class_name == "Amazon") {document.getElementById("fbr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1-hand swing: " + c.fbr_bp_alt + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All other weapon: " + c.fbr_bp}
	if (character.class_name == "Paladin") {document.getElementById("fbr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Holy Sheild active: " + c.fbr_bp_alt + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No Holy Sheild: " + c.fbr_bp}
	if (character.class_name == "Druid") {document.getElementById("fbr_bp").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unchanged: " + c.fbr_bp + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Werebear: " + c.fbr_bp_werebear + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Werewolf: " + c.fbr_bp_werewolf}



//	document.write("<a href='" + link + "'>" + text + "</a>");
	//	if (c.fhr_bp_alt)	{document.getElementById("fhr_bp").innerHTML = c.fhr_bp + "<br>" + "1-hand swing FHR: " + c.fhr_bp_alt}
//	else{document.getElementById("fhr_bp").innerHTML = c.fhr_bp}
}

// updateTertiaryStats - Updates other stats
// ---------------------------------
function updateTertiaryStats() {
	var c = character;
	var pLength = 0; if (c.difficulty == 2) { pLength = 40 }; if (c.difficulty == 3) { pLength = 100 };		// TODO: implement as character stat similar to resistance penalties?
	var cLength = c.curse_length_reduced;	// TODO: implement curse_length_reduced as multiplicative rather than additive?
	var cL_Cleansing = 0;
	var cL_Fade = 0;
	for (e in effects) {
		if (typeof(effects[e].info.enabled) != 'undefined') { if (effects[e].info.enabled == 1) {
			if (e.split("-")[0] == "Cleansing") { cL_Cleansing = effects[e].curse_length_reduced }
			if (e.split("-")[0] == "Fade") { cL_Fade = effects[e].curse_length_reduced }
		} }
	}
	if (cL_Cleansing > 0 && cL_Fade > 0) { cLength = 100 - Math.floor(100-cL_Cleansing - (100-cL_Cleansing)*(cL_Fade/100)) }
	document.getElementById("poison_reduction").innerHTML = Math.min(75,c.poison_length_reduced-pLength); if (c.poison_length_reduced-pLength != 0) { document.getElementById("poison_reduction").innerHTML += "%" };
	document.getElementById("curse_reduction").innerHTML = cLength; if (cLength > 0) { document.getElementById("curse_reduction").innerHTML += "%" };
	var thorns = c.thorns_reflect;
	if (c.thorns_reflect == 0) { thorns = Math.floor(c.thorns_lightning + c.thorns + c.level*c.thorns_per_level) } else { thorns += "%"; if (c.thorns > 0 || c.thorns_per_level > 0) { thorns += (" +"+Math.floor(c.thorns_lightning + c.thorns + c.level*c.thorns_per_level)) } }
	document.getElementById("thorns").innerHTML = thorns
	var lightRadius = "";
	if (c.light_radius > 0) { lightRadius = "+"+c.light_radius + " to Light Radius<br>" } else if (c.light_radius < 0) { lightRadius = c.light_radius + " to Light Radius<br>" } else { lightRadius = "" }
	document.getElementById("light_radius").innerHTML = lightRadius
	if (c.slower_stam_drain > 0) { document.getElementById("slower_stam_drain").innerHTML = "+"+c.slower_stam_drain+"% Slower Stamina Drain<br>" } else { document.getElementById("slower_stam_drain").innerHTML = "" }
	if (c.heal_stam > 0 || c.heal_stam_per_level > 0) { document.getElementById("heal_stam").innerHTML = "Heal Stamina +" + Math.floor(c.heal_stam + c.level*c.heal_stam_per_level)+"%<br>" } else { document.getElementById("heal_stam").innerHTML = "" }
	var enemyDef = "";
	if (c.enemy_defense != 0 || c.target_defense != 0) { enemyDef += (Math.min(99,(c.enemy_defense + c.target_defense))+"%"); if (c.enemy_defense_flat != 0 || c.monster_defense_per_hit != 0) { enemyDef += ", " } }
	if (c.enemy_defense_flat != 0) { enemyDef += c.enemy_defense_flat; if (c.monster_defense_per_hit != 0) { enemyDef += ", " } }
	if (c.monster_defense_per_hit != 0) { enemyDef += (c.monster_defense_per_hit+" per hit") }
	if (enemyDef == "") { enemyDef = "0"}
	document.getElementById("enemy_defense").innerHTML = enemyDef
	var enemyBlind = "";
	if (c.blind_on_hit > 0) { enemyBlind = "Hit Blinds Target"; if (c.blind_on_hit > 1) { enemyBlind += (" +"+c.blind_on_hit+"<br>"); } else { enemyBlind += "<br>" } }
	document.getElementById("blind_on_hit").innerHTML = enemyBlind
	if (c.flee_on_hit > 0) { document.getElementById("flee_on_hit").innerHTML = "Hit Causes Monster to Flee " + Math.min(100,c.flee_on_hit) + "%<br>" } else { document.getElementById("flee_on_hit").innerHTML = "" }
	if (c.discount > 0) { document.getElementById("discount").innerHTML = "Vendor Prices Reduced by " + c.discount + "%<br>" } else { document.getElementById("discount").innerHTML = "" }
	
	//if (c.fDamage_min > 0) { document.getElementById("fDamage_min").innerHTML = "+"+c.fDamage_min+" Fire Damage<br>" } else { document.getElementById("fDamage_min").innerHTML = "" }
	if (c.itd > 0) { document.getElementById("itd").innerHTML = "Ignore Target Defense<br>" } else { document.getElementById("itd").innerHTML = "" }
	if (c.pmh > 0) { document.getElementById("pmh").innerHTML = "Prevent Monster Heal<br>" } else { document.getElementById("pmh").innerHTML = "" }
	if (c.cbf > 0) { document.getElementById("cbf").innerHTML = "Cannot Be Frozen<br>" }
	else if (c.half_freeze > 1) { document.getElementById("cbf").innerHTML = "Cannot Be Frozen<br>" }
	else if (c.half_freeze > 0) { document.getElementById("cbf").innerHTML = "Half Freeze Duration<br>" }
	else { document.getElementById("cbf").innerHTML = "" } 
	if (c.knockback > 0) { document.getElementById("knockback").innerHTML = "Knockback<br>" } else { document.getElementById("knockback").innerHTML = "" }
	if (c.melee_splash > 0) { document.getElementById("melee_splash").innerHTML = "Melee Attacks deal Cheese Damage<br>" } else { document.getElementById("melee_splash").innerHTML = "" }
	if (c.slows_target > 0 || c.slow_enemies > 0) { document.getElementById("slow_target").innerHTML = "Targets Slowed " + (c.slows_target + c.slow_enemies)+"%<br>" } else { document.getElementById("slow_target").innerHTML = "" }
	if (c.freezes_target > 1) { document.getElementById("freezes_target").innerHTML = "Freezes Target +" + c.freezes_target + "<br>" }
	else if (c.freezes_target > 0) { document.getElementById("freezes_target").innerHTML = "Freezes Target<br>" }
	else { document.getElementById("freezes_target").innerHTML = "" }
	if (c.peace > 0) { document.getElementById("peace").innerHTML = "Slain Monsters Rest in Peace<br>" } else { document.getElementById("peace").innerHTML = "" }
	if (c.glow > 0) { document.getElementById("glow").innerHTML = "Character is Glowing<br>" } else { document.getElementById("glow").innerHTML = "" }
	var statlines = "";
	if (c.fade > 0) { statlines += "Character is Faded<br>" }
	if (c.all_skills_ember > 0) { statlines += "+"+c.all_skills_ember+" to All Skills when 5 Ember Charges are active<br>" }
	if (c.bonus_sanctuary_rate > 0) { statlines += "+"+c.bonus_sanctuary_rate+"% Increased Sanctuary Area Damage Rate<br>" }
	if (c.summon_damage > 0) { statlines += "Summons deal +"+c.summon_damage+"% Increased Damage<br>" }
	if (c.summon_defense > 0) { statlines += "Summons have +"+c.summon_defense+"% Enhanced Defense<br>" }
	if (c.bonus_corpse_explosion > 0) { statlines += "Corpse Explosion deals +"+c.bonus_corpse_explosion+"% of Maximum Corpse life<br>" }
	if (c.phys_Lightning_Surge > 0) { statlines += "Lightning Surge Deals "+c.phys_Lightning_Surge+"% Extra Damage As Physical<br>" }
	if (c.extraValkyrie > 0) { statlines += "Can Summon One Additional Valkyrie<br>" }
	if (c.extraGrizzly > 0) { statlines += "Can Summon One Additional Grizzly Bear<br>" }
	if (c.curseGrizzly > 0) { statlines += "Summon Grizzly Bear cannot be cursed<br>" }
	if (c.extraFireGolem > 0) { statlines += "Can Summon One Additional Fire Golem<br>" }
	if (c.extraHydra > 0) { statlines += "Can Summon One Additional Hydra<br>" }
	if (c.radius_FreezingArrow > 0) { statlines += "+"+c.radius_FreezingArrow+"% to Freezing Arrow Radius<br>" }
	if (c.explosive_attack > 0) { statlines += "Fires Explosive Arrows or Bolts<br>" }
	if (c.magic_attack > 0) { statlines += "Fires Magic Arrows<br>" }
	if (c.reset_cooldown_on_kill > 0) { statlines += c.reset_cooldown_on_kill+"% Chance to Reset Skill Cooldown on Kill<br>" }
	if (c.cdr_on_striking > 0) { statlines += "Gain "+c.cdr_on_striking+"% Reduced Skill Cooldown For 4 Seconds On Striking<br>" }
	if (c.reanimate > 0) { statlines += c.reanimate+"% Reanimate As: Returned<br>" }
	if (c.half_Battle_Orders > 0 && c.class_name != "Barbarian") { statlines += "Battle Order's life and mana bonuses are halved<br>" }
	if (c.extra_Bone_Spears > 0) { statlines += "Bone Spear fires "+c.extra_Bone_Spears+" Additional Projectiles<br>" }
	if (c.extra_conversion_Magic_Arrow > 0) { statlines += "+"+c.extra_conversion_Magic_Arrow+"% Magic Arrow Damage Converted to Magic<br>" }
	if (c.extra_arrows_Ice_Arrow > 0) { statlines += "Ice Arrow fires "+c.extra_arrows_Ice_Arrow+" Additional Arrows<br>" }
	if (c.extra_arrows_Cold_Arrow > 0) { statlines += "Cold Arrow fires "+c.extra_arrows_Cold_Arrow+" Additional Projectiles<br>" }
	if (c.extra_arrows_Magic_Arrow > 0) { statlines += "Magic Arrow fires "+c.extra_arrows_Magic_Arrow+" Additional Arrows<br>" }
	if (c.extra_arrows_Fire_Arrow > 0) { statlines += "Fire Arrow fires "+c.extra_arrows_Fire_Arrow+" Additional Arrows<br>" }
	if (c.experience > 0) { statlines += "+"+c.experience+"% Experience Gained<br>" }
	if (c.ctc_temp1 > 0) { statlines += "10% chance to cast level 15 Nova on striking<br>" }
	if (c.ctc_temp2 > 0) { statlines += "25% chance to cast level 5 Static Field when struck<br>" }
	if (c.all_skills > 0) { statlines += "Equpiment adds +" + c.all_skills + " all skills total<br>" }
	if (c.oskill_Multiple_Shot > 0) { statlines += "Doomslinger will fire " + c.multiproj + " projectiles<br>" }
	if (c.ftick_min > 0) { statlines += "Holy Fire aura tick damage: " + c.ftick_min + "-" + c.ftick_max + "<br>"}
	if (c.ctick_min > 0) { statlines += "Holy Freeze aura tick damage: " + c.ctick_min + "-" + c.ctick_max + "<br>"}
	if (c.ltick_min > 0) { statlines += "Holy Shock aura tick damage: " + c.ltick_min + "-" + c.ltick_max + "<br>"}
	if (c.mtick_min > 0) { statlines += "Sanctuary aura tick damage: " + c.mtick_min + "-" + c.mtick_max + "<br>"}
	if (c.issalvation > 0) { statlines += "Salvation damage bonus: " + "+" + salvdam + "%" + "<br>"}
	if (c.issalvation > 0) { statlines += "Salvation resistance bonus: " + "+" + salvres + "%" + "<br>"}
	if (c.mana_regen > 0) {statlines += "Mana Regen: " + Math.ceil(c.mana/120*(1+c.mana_regen/100)) + " per second" + "<br>"}
//	if (c.jf_molten > 0) {statlines += "Molten Strike will do " + checkSkill("Molten Strike").output + "<br>"}

	if (character.dodge > 0) { statlines += character.dodge + "% Chance to <b>Dodge</b> melee attack when attacking or standing still" + "<br>"}
	if (c.avoid > 0) { statlines += c.avoid + "% Chance to <b>Avoid</b> missiles when attacking or standing still" + "<br>"}
	if (c.evade > 0) { statlines += c.evade + "% Chance to <b>Evade</b> melee or missile attack when walking or running" + "<br>"}
	if (character.metamorphosis_bear1 > 0) { 
//		character.oskill_Cleave = character.maul_charges
		character.skill_Cleave = character.maul_charges
//		var outcome = {min:0,max:0,ar:0};
//		var physDamage = getWeaponDamage(character.strTotal,character.dexTotal,"weapon",0);
//		var dmg = getNonPhysWeaponDamage("weapon");
//		var basic_min = Math.floor(physDamage[0]*physDamage[2]);
//		var basic_max = Math.floor(physDamage[1]*physDamage[2]);

//		var nonPhys_min = Math.floor(dmg.fMin + dmg.cMin + dmg.lMin + dmg.pMin + dmg.mMin);
//		var nonPhys_max = Math.floor(dmg.fMax + dmg.cMax + dmg.lMax + dmg.pMax + dmg.mMax);

//		outcome = character_all.any.getSkillDamage("Cleave", ar, physDamage[0], physDamage[1], physDamage[2], nonPhys_min, nonPhys_max)
//		var output = ": " + outcome.min + "-" + outcome.max + " {"+Math.ceil((outcome.min+outcome.max)/2)+"}";
//		var outcome = {min:0,max:0,ar:0};
//		outcome = c.getSkillDamage(skill, ar, physDamage_offhand[0], physDamage_offhand[1], physDamage_offhand[2], nonPhys_min_offhand, nonPhys_max_offhand);
//		var output = outcome.min + "-" + outcome.max + " {"+Math.ceil((outcome.min+outcome.max)/2)+"}";

//		cleave_dam_min = outcome.min
//		cleave_dam_max = outcome.max
//		getCTCSkillData("Cleave", character.maul_charges, "helm")
		physDamage = getWeaponDamage(character.strTotal,character.dexTotal,"weapon",0)
		cleave_dam_min = Math.floor((physDamage[0]*.6) * (1 + character.damage_bonus/100)) // * (1 + (60-100)/100) + (physDamage[0] * (1+(character.damage_bonus+character.damage_enhanced)/100)) )
		cleave_dam_max = Math.floor((physDamage[1]*.6) * (1 + character.damage_bonus/100)) //* (1 + (60-100)/100) + (character.damage_min * (1+(character.damage_bonus+character.damage_enhanced)/100)) )
//console.warn  (character.skill_Cleave, basic_min, basic_max, physDamage, dmg, outcome)
		maul_min = Math.floor((character_all.any.getSkillData("Cleave",character.maul_charges,0) * (1 + (character.damage_bonus + character.e_damage)/100)))
		maul_max = Math.floor((character_all.any.getSkillData("Cleave",character.maul_charges,1) * (1 + character.damage_bonus/100 + character.e_damage/100)))
		
//		statlines += "Maul attacks gain cleave" + " (" + maul_min + ")" + " (" + maul_max + ")" + "<br>" + "Grizzly Maul attacks gain cleave" + "<br>"
		statlines += "Maul attacks gain cleave" + "<br>" + "Grizzly Maul attacks gain cleave" + "<br>"
//		statlines += "You have: " + character.maul_charges + " Maximum Maul Charges" + "<br>"
		statlines += "BETA - Grizzly Cleave damage: " + cleave_dam_min + "-" + cleave_dam_max + "<br>&nbsp;&nbsp;&nbsp;&nbsp;Plus " + maul_min + "-" + maul_max + ""
		
	}

	
//	if (character.customStats != null) { statlines += c.addcraft }

	document.getElementById("statlines").innerHTML = statlines
	updateCTC()
	updateChargeSkills()
}

// updateCTC - Updates CTC (chance to cast) stats gained from items
// ---------------------------------
function updateCTC() {
	var stats = "";
	
	
	
	for (group in equipped) {
		if (typeof(equipped[group].ctc) != 'undefined') {
			if (equipped[group].ctc != "") {
				for (let i = 0; i < equipped[group].ctc.length; i++) {
					if (equipped[group].ctc[i][2] == "Discharge") {
//						getCTCSkillData(ctcname,ctclvl) ;
						var danctcdmg = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
//						var danctcdmg = character.getCTCSkillData("Discharge",21) ;
//						ctcdmg = "(" + danctcdmg.result.lDamage_min + "-" + danctcdmg.result.lDamage_max + ")" ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + dischargetext;
					}

					else if (equipped[group].ctc[i][2] == "Chain Lightning") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + cltext;
					}

					else if (equipped[group].ctc[i][2] == "Nova") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + novatext;
					}
					else if (equipped[group].ctc[i][2] == "Volcano") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + volctext;
					}

					else if (equipped[group].ctc[i][2] == "Molten Boulder") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + mbouldertext;
					}
					else if (equipped[group].ctc[i][2] == "Fissure") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + fissuretext;
					}
					else if (equipped[group].ctc[i][2] == "Hurricane") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + hurritext;
					}
					else if (equipped[group].ctc[i][2] == "Armageddon") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + armatext;
					}

					else if (equipped[group].ctc[i][2] == "Ball Lightning") {
						lDamage_min = character_all.any.getSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1],0) ;
						lDamage_max = character_all.any.getSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1],1) ;
						balltext = "(" + Math.round(lDamage_min) + "-" + Math.round(lDamage_max) + ")" + " {" +Math.round((lDamage_min+lDamage_max)/2) + "}";
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + balltext;
					}

					else if (equipped[group].ctc[i][2] == "Poison Nova") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + pnovatext;
					}

					else if (equipped[group].ctc[i][2] == "Frozen Orb") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + forbtext;
					}

					else if (equipped[group].ctc[i][2] == "Hydra") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + hydratext;
					}

					else if (equipped[group].ctc[i][2] == "Fire Ball") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + fireballtext;
					}

					else if (equipped[group].ctc[i][2] == "Meteor") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + meteotext;
					}

					else if (equipped[group].ctc[i][2] == "Blizzard") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + blizztext;
					}

					else if (equipped[group].ctc[i][2] == "Glacial Spike") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + glacialtext;
					}

					else if (equipped[group].ctc[i][2] == "Ice Arrow") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + icearrowtext;
					}

					else if (equipped[group].ctc[i][2] == "Static Field") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + staticftext;
					}

					else if (equipped[group].ctc[i][2] == "War Cry") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + warcrytext;
					}

					else if (equipped[group].ctc[i][2] == "Cleave") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + warcrytext;
					}

					else if (equipped[group].ctc[i][2] == "Firestorm") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + firestormtext;
					}

					else if (equipped[group].ctc[i][2] == "Molten Strike") {
						var danctcdmg2 = getCTCSkillData(equipped[group].ctc[i][2],equipped[group].ctc[i][1]) ;
						var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] + " " + moltenstext;
					}

					else {var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] ;//+ ctcdmg ;// + dischargetext;
					}

					//var stat = equipped[group].ctc[i][0]+"% chance to cast level "+equipped[group].ctc[i][1]+" "+equipped[group].ctc[i][2]+" "+equipped[group].ctc[i][3] ;//+ ctcdmg ;// + dischargetext;
					stats += (stat + "<br>")					
				}				
			}
		}
	}
	
	// TODO: Add socketed ctc effects to socketed.totals so this can be simplified? Duplicate code in equipmentHover()
	var ctc_possible = ["100% chance to cast level 29 Blaze when you level up","100% chance to cast level 43 Frost Nova when you level up","100% chance to cast level 41 Nova when you level up","100% chance to cast level 23 Venom when you level up"];
	var ctc_included = [0,0,0,0];
	for (group in socketed) {
		for (let i = 0; i < socketed[group].items.length; i++) { for (affix in socketed[group].items[i]) { if (affix == "ctc") {
			var source = socketed[group].items[i];
			for (let j = 0; j < source[affix].length; j++) {
				var line = source[affix][j][0]+"% chance to cast level "+source[affix][j][1]+" "+source[affix][j][2]+" "+source[affix][j][3];
				for (let k = 0; k < ctc_possible.length; k++) { if (line == ctc_possible[k]) {
					if (ctc_included[k] == 0) { stats += line+"<br>" }
					ctc_included[k] = 1
				} }
			}
		} } }
	}
	document.getElementById("ctc").innerHTML = stats
}

// updateChargeSkills - Updates CSkills (skills with limited charges) gained from items
// ---------------------------------
function updateChargeSkills() {
	var stats = "";
	for (group in equipped) {
		if (typeof(equipped[group].cskill) != 'undefined') {
			if (equipped[group].cskill != "") {
				for (let i = 0; i < equipped[group].cskill.length; i++) {
					var stat = "Level "+equipped[group].cskill[i][0]+" "+equipped[group].cskill[i][1]+" ("+equipped[group].cskill[i][2]+" charges)";
					stats += (stat + "<br>")
				}
			}
		}
	}
	document.getElementById("cskill").innerHTML = stats
}

// updateOther - Updates other interface elements
// ---------------------------------
function updateOther() {
	var c = character;
	if (c.statpoints == 0) {
		document.getElementById("remainingstats").innerHTML = ""
		document.getElementById("hide_statpoints").style.visibility = "visible"
	} else {
		document.getElementById("hide_statpoints").style.visibility = "hidden"
	}
	if (c.skillpoints == 0) {
		document.getElementById("remainingskills").innerHTML = ""
		document.getElementById("hide_skillpoints").style.visibility = "visible"
	} else {
		document.getElementById("hide_skillpoints").style.visibility = "hidden"
	}
	if (c.level == 1 && c.statpoints == 0 && c.quests_completed < 0) {
		document.getElementById("hide_stats").style.visibility = "visible"
	} else {
		document.getElementById("hide_stats").style.visibility = "hidden"
	}
	updateSkillIcons()
	checkRequirements()
	
	// update available sockets - TODO: move this to a more suitable 'update' function
	for (group in socketed) {
		socketed[group].sockets = (~~(equipped[group].sockets) + ~~(corruptsEquipped[group].sockets))
		removeInvalidSockets(group)
	}
}

// removeInvalidSockets - Handles indirect removal/validation of socketables
//	group: the item group which is socketed
// ---------------------------------
function removeInvalidSockets(group) {
//	if (socketed[group].socketsFilled > socketed[group].sockets) {
		var invalidSockets = Math.max(0, socketed[group].socketsFilled - socketed[group].sockets)
		if (socketed[group].sockets == 0) { invalidSockets = 6 }
		for (let i = socketed[group].items.length-1; i >= 0; i--) {
			if (socketed[group].items[i].name != "" && invalidSockets > 0) {
				for (affix in socketed[group].items[i]) { if (affix != "id") { character[affix] -= socketed[group].items[i][affix] } }
				document.getElementById(socketed[group].items[i].id).remove();
				socketed[group].socketsFilled -= 1
				socketed[group].items[i] = {id:"",name:""}
				invalidSockets -= 1
			}
		}
//	}
}

// calculateSkillAmounts - Updates skill levels
// ---------------------------------
function calculateSkillAmounts() {
	for (s = 0; s < skills.length; s++) {
		skills[s].extra_levels = 0
		skills[s].extra_levels += character.all_skills + Math.ceil(character.all_skills_per_level*character.level)
		skills[s].extra_levels += character.skills_class
		if (character.charge_ember == 5) { skills[s].extra_levels += character.all_skills_ember }
		var display = skills[s].level;
		var skill_id = "skill_" + getId(skills[s].name);
		skills[s].force_levels = character[skill_id]
		var oskill_id = "o"+skill_id;
		if (typeof(character[oskill_id]) != 'undefined') { skills[s].force_levels += Math.min(3,character[oskill_id]) }

		const classSkills = {
			"sorceress": character.sorceress_skills_all,
			"druid": character.druid_skills_all,
			"amazon": character.amazon_skills_all,
		};
		
//		var natClass = oskill_id.info.natClass.class_name;
//		if (character.class_name.toLowerCase() !== natClass) {
//			const addnatclass = natClass + "_skills_all"; // String representation of the variable name
//			
//			// Use the mapping object to dynamically access the variable value
//			if (classSkills[natClass]) {
//				skills[s].extra_levels += classSkills[natClass];
//			} else {
//				console.error(`No skill variable found for class: ${natClass}`);
//			}
//		}

//		var natClass = oskills_info.native_class;
//		if (character.class_name.toLowerCase() != natClass) {
//			addnatclass = natClass + "_skills_all"
//			skills[s].extra_levels += addnatclass
//		}

		character.setSkillAmounts(s)	// adds to skills[s].extra_levels: points from class, tree, fire/cold/lightning/poison/magic
		skills[s].extra_levels += skills[s].force_levels

//		var natClass = oskills_info.native_class;
//		skills[s].extra_levels += character[oskill_id].[character.class]_skills_all

		display += skills[s].extra_levels
		if (skills[s].level > 0 || skills[s].force_levels > 0) {
			document.getElementById("p"+skills[s].key).innerHTML = display
		} else { document.getElementById("p"+skills[s].key).innerHTML = "" }
	}
	var skillChoices = "";
	for (let s = 0; s < skills.length; s++) {
		if (skills[s].level > 0 || skills[s].force_levels > 0) { skillChoices += '<option class="gray">'+skills[s].name+'</option>' }
	}
}

// checkRequirements - Recolors stats/skills based on unmet item/skill/level requirements
// ---------------------------------
function checkRequirements() {
	var highest_level = 1; var highest_str = 0; var highest_dex = 0;
	for (group in equipped) {
		if (group == "charms") { for (item in equipped[group]) {
			if (equipped[group][item].req_level > highest_level) { highest_level = equipped[group][item].req_level }
			if (equipped[group][item].req_strength > highest_str) { highest_str = equipped[group][item].req_strength }
			if (equipped[group][item].req_dexterity > highest_dex) { highest_dex = equipped[group][item].req_dexterity }
		} }
		if (equipped[group].req_level > highest_level) { highest_level = equipped[group].req_level }
//if (typeof(equipment[src_group][item]["req"]) != 'undefined') 
//{ multReq += (equipment[src_group][item]["req"]/100) }
//		if ((equipped[group][item]["req"]) < 0 || (equipped[group][item]["req"]) != 'undefined') 
//			{ equipped[group][item].req_strength += equipped[group][item]["req"]/100; equipped[group][item].req_dexterity += equipped[group][item]["req"]/100;}
//		
//		if (equipped[group].req_strength > highest_str) { highest_str = equipped[group].req_strength }
//		if (equipped[group].req_dexterity > highest_dex) { highest_dex = equipped[group].req_dexterity }
//		if (equipped[group].req_level > highest_level) { highest_level = equipped[group].req_level }
		if (equipped[group].req_strength > highest_str) { highest_str = equipped[group].req_strength }
		if (equipped[group].req_dexterity > highest_dex) { highest_dex = equipped[group].req_dexterity }
	}
	character.req_level = highest_level
	character.req_strength = highest_str
	character.req_dexterity = highest_dex
	if (character.req_level > character.level) {
		document.getElementById("level").style.color = "#ff8080" }
	else { document.getElementById("level").style.color = "white" }
	if (character.req_strength > (character.strength+character.all_attributes+(character.level*character.strength_per_level))) {
		document.getElementById("strength").style.color = "#ff8080" }
	else { document.getElementById("strength").style.color = "white" }
	if (character.req_dexterity > (character.dexterity+character.all_attributes)) {
		document.getElementById("dexterity").style.color = "#ff8080" }
	else { document.getElementById("dexterity").style.color = "white" }
	for (let s = 0; s < skills.length; s++) {
		var req_met = 1;
		if (skills[s].level > Math.max(0,(character.level - skills[s].reqlvl + 1))) { req_met = 0 }
		if (skills[s].force_levels == 0 && skills[s].req.length > 0 && req_met == 1) { for (let r = 0; r < skills[s].req.length; r++) {
			if (skills[skills[s].req[r]].level == 0) { req_met = 0 }
		} }
		if (req_met == 0) {
			document.getElementById("p"+skills[s].key).style.color = "#ff8080"; }	// red
		else if (skills[s].extra_levels > 0) {
			document.getElementById("p"+skills[s].key).style.color = "#8080ff"; }	// blue
		else { document.getElementById("p"+skills[s].key).style.color = "white"; }
		if (skills[s].level > 0 || skills[s].force_levels > 0) {
			document.getElementById("p"+skills[s].key).innerHTML = (skills[s].level + skills[s].extra_levels);
		}
	}
}

// updateSkills - Updates the list of skills available in the skill dropdown menus
// ---------------------------------
function updateSkills() {
	var choices = "";
	var k = 1;
	var oskillList = [];
	var oskillOptions = [];
	for (let o = 0; o < oskills.length; o++) {
		if (character[oskills[o]] > 0) {
			var natClass = oskills_info[oskills[o]].native_class;
			if (character.class_name.toLowerCase() != natClass) {
				var natIndex = oskills_info[oskills[o]].i;
				var addSkill = 0;
				if (natClass != "none") { if (skills_all[natClass][natIndex].bindable > 0) { addSkill = 1 } } else { addSkill = 1 }
				if (addSkill == 1) {
					oskillList[k] = oskills_info[oskills[o]].name
					oskillOptions[k] = "<option class='gray-all'>" + oskills_info[oskills[o]].name + "</option>"
					choices += oskillOptions[k]
					k++
				}
			}
		}
	}
	skillList = oskillList;
	skillOptions = oskillOptions;
	for (let s = 0; s < skills.length; s++) {
		if (skills[s].bindable > 0 && (skills[s].level > 0 || skills[s].force_levels > 0)) {
			skillList[k] = skills[s].name
			skillOptions[k] = "<option class='gray-all'>" + skills[s].name + "</option>"
			choices += skillOptions[k]
			k++
		}
	}
	
	// TODO: make less inefficient, include oskills
	for (let s = 0; s < skills.length; s++) {
		if (skills[s].level == 0 && skills[s].force_levels == 0) {
			if (selectedSkill[0] == skills[s].name) { selectedSkill[0] = " ­ ­ ­ ­ Skill 1" }
			if (selectedSkill[1] == skills[s].name) { selectedSkill[1] = " ­ ­ ­ ­ Skill 2" }
		}
	}

	document.getElementById("dropdown_skill1").innerHTML = "<option class='gray-all' style='color:gray' disabled>" + " ­ ­ ­ ­ Skill 1" + "</option>" + choices
	document.getElementById("dropdown_skill2").innerHTML = "<option class='gray-all' style='color:gray' disabled>" + " ­ ­ ­ ­ Skill 2" + "</option>" + choices
	var selectedIndex = [0,0];
	for (let l = 0; l < skillList.length; l++) {
		if (skillList[l] == selectedSkill[0]) { selectedIndex[0] = l }
		if (skillList[l] == selectedSkill[1]) { selectedIndex[1] = l }
	}
	document.getElementById("dropdown_skill1").selectedIndex = selectedIndex[0]
	document.getElementById("dropdown_skill2").selectedIndex = selectedIndex[1]
	if (selectedSkill[0] == " ­ ­ ­ ­ Skill 1") { document.getElementById("skill1_info").innerHTML = ":"; document.getElementById("ar_skill1").innerHTML = ""; }
	if (selectedSkill[1] == " ­ ­ ­ ­ Skill 2") { document.getElementById("skill2_info").innerHTML = ":"; document.getElementById("ar_skill2").innerHTML = ""; }
}

// checkSkill - Updates skill damage and other info for the selected skill
//	skillName: skill name displayed in dropdown
//	num: 1 or 2 (for skill1 or skill2)
// ---------------------------------
function checkSkill(skillName, num) {
	skill2Breakdown = ""
	if (skillName == " ­ ­ ­ ­ Skill "+num) { document.getElementById("dropdown_skill"+num).selectedIndex = 0 }
	if (document.getElementById("dropdown_skill"+num).selectedIndex == 0) { skillName = " ­ ­ ­ ­ Skill "+num }
	selectedSkill[num-1] = skillName
	var native_skill = 0;
	var skill = {};
	var index = 0;
	for (let s = 0; s < skills.length; s++) { if (skillName == skills[s].name) {
		native_skill = 1
		skill = skills[s]
	} }
	
	var c = character;
	var strTotal = (c.strength + c.all_attributes + c.level*c.strength_per_level);
	var dexTotal = (c.dexterity + c.all_attributes + c.level*c.dexterity_per_level);
	var energyTotal = Math.floor((c.energy + c.all_attributes)*(1+c.max_energy/100));
//	var ar = ((dexTotal - 7) * 5 + c.ar + c.level*c.ar_per_level + c.ar_const) * (1+(c.ar_skillup + c.ar_skillup2 + c.ar_bonus + c.level*c.ar_bonus_per_level)/100) * (1+c.ar_shrine_bonus/100);
//	var ar = ((dexTotal - 7) * 5 + c.ar + c.level*c.ar_per_level + c.ar_const + (c.ar_per_socketed*socketed.offhand.socketsFilled)) * (1+(c.ar_skillup + c.ar_skillup2 + c.ar_bonus + c.level*c.ar_bonus_per_level)/100) * (1+c.ar_shrine_bonus/100);
	// Base AR before % bonuses
	let baseAR =
	((dexTotal - 7) * 5) +
	c.ar +
	(c.level * c.ar_per_level) +
	c.ar_const;
	console.log("Character base AR: ", baseAR)
	// Additive % bonuses (excluding shrine, which is applied separately)
	let arBonusPercent =
	c.ar_skillup +
	c.ar_skillup2 +
	c.ar_bonus +
	(c.level * c.ar_bonus_per_level);
	console.log("Character bonus AR: ", arBonusPercent)

	character.baseAR = 
		((dexTotal - 7) * 5) +
		c.ar +
		(c.level * c.ar_per_level) +
		c.ar_const;

	character.arBonusPercent = 
		c.ar_skillup +
		c.ar_skillup2 +
		c.ar_bonus +
		(c.level * c.ar_bonus_per_level);
	console.log("Base AR, Bonus AR: ", baseAR, arBonusPercent)

	// Total AR after % increases
	let ar = baseAR * (1 + arBonusPercent / 100) * (1 + c.ar_shrine_bonus / 100);
//	const ar = baseAR 
	console.log("Character AR: ", ar)

	var artest =  "(1+("+c.ar_skillup +"+"+ c.ar_skillup2+ "+" + c.ar_bonus + "+" + c.level + "*" + c.ar_bonus_per_level+ ")/100) * (1+" + c.ar_shrine_bonus + "/100) * 100";
	var physDamage = [0,0,1];
	if (skillName == "Poison Javelin" || skillName == "Lightning Bolt" || skillName == "Plague Javelin" || skillName == "Lightning Fury" || skillName == "Power Throw" || skillName == "Ethereal Throw") {
		physDamage = getWeaponDamage(strTotal,dexTotal,"weapon",1);
	} else { physDamage = getWeaponDamage(strTotal,dexTotal,"weapon",0); }
	var dmg = {fMin:0,fMax:0,cMin:0,cMax:0,lMin:0,lMax:0,pMin:0,pMax:0,mMin:0,mMax:0};
	dmg = getNonPhysWeaponDamage("weapon")
	var nonPhys_min = Math.floor(dmg.fMin + dmg.cMin + dmg.lMin + dmg.pMin + dmg.mMin);
	var nonPhys_max = Math.floor(dmg.fMax + dmg.cMax + dmg.lMax + dmg.pMax + dmg.mMax);
	
	if (skillName != " ­ ­ ­ ­ Skill 1" && skillName != " ­ ­ ­ ­ Skill 2") {
		var outcome = {min:0,max:0,ar:0};
		if (native_skill == 0) { outcome = character_all.any.getSkillDamage(skillName, ar, physDamage[0], physDamage[1], physDamage[2], nonPhys_min, nonPhys_max); }
		else { outcome = c.getSkillDamage(skill, ar, physDamage[0], physDamage[1], physDamage[2], nonPhys_min, nonPhys_max); }
//		console.log("Skill AR right after getskilldamage: ", character.ar_skillup, outcome.ar)
		//		ar = ((dexTotal - 7) * 5 + c.ar + c.level*c.ar_per_level + c.ar_const) * (1+(c.ar_skillup + c.ar_skillup2 + c.ar_bonus + c.level - outcome.ar *c.ar_bonus_per_level)/100) * (1+c.ar_shrine_bonus/100);
		
		//var enemy_lvl = ~~MonStats[monsterID][4+c.difficulty];
		var enemy_lvl = Math.min(~~c.level,89);	// temp, sets 'area level' at the character's level (or as close as possible if the area level isn't available in the selected difficulty)
		if (c.difficulty == 1) { enemy_lvl = Math.min(43,enemy_lvl) }
		else if (c.difficulty == 2) { enemy_lvl = Math.max(36,Math.min(66,enemy_lvl)) }
		else if (c.difficulty == 3) { enemy_lvl = Math.max(67,enemy_lvl) }
		var enemy_def = (MonStats[monsterID][8] * MonLevel[enemy_lvl][c.difficulty])/100;
		enemy_def = Math.max(0,enemy_def + enemy_def*(c.enemy_defense+c.target_defense)/100+c.enemy_defense_flat)
		var hit_chance = Math.round(Math.max(5,Math.min(95,(100 * outcome.ar / (outcome.ar + enemy_def)) * (2 * c.level / (c.level + enemy_lvl)))));
		
		var output = ": " + outcome.min + "-" + outcome.max + " {"+Math.ceil((outcome.min+outcome.max)/2)+"}";
		if (~~outcome.min != 0 && ~~outcome.max != 0) { document.getElementById("skill"+num+"_info").innerHTML = output } else { document.getElementById("skill"+num+"_info").innerHTML = ":" }
		if (outcome.ar != 0) { document.getElementById("ar_skill"+num).innerHTML = "AR: " + outcome.ar + " ("+hit_chance+"%)" } else { document.getElementById("ar_skill"+num).innerHTML = "" }
//		if (outcome.ar != 0) { document.getElementById("ar_skill"+num).innerHTML = "AR: " + outcome.ar + " ("+hit_chance+"%) Bonus: " + c.ar_bonus +"%" } else { document.getElementById("ar_skill"+num).innerHTML = "" }

//		if (addmore == "yes" && skill.name != "War Cry") {
		if (addmore == "yes") {
			if (dmg.fMin > 0) {skill2Breakdown += "\nAdded Fire Damage: " + Math.floor(dmg.fMin) + "-" + Math.floor(dmg.fMax)};
			if (dmg.cMin > 0) {skill2Breakdown += "\nAdded Cold Damage: " + Math.floor(dmg.cMin) + "-" + Math.floor(dmg.cMax)};
			if (dmg.lMin > 0) {skill2Breakdown += "\nAdded Light Damage: " + Math.floor(dmg.lMin) + "-" + Math.floor(dmg.lMax)};
			if (dmg.mMin > 0) {skill2Breakdown += "\nAdded Magic Damage: " + Math.floor(dmg.mMin) + "-" + Math.floor(dmg.mMax)};
			if (dmg.pMin > 0) {skill2Breakdown += "\nAdded Poison Damage: " + Math.floor(dmg.pMin) + "-" + Math.floor(dmg.pMax)};
		}
		TooltipElement = document.getElementById("skill2_info");
		TooltipElement.title = skill2Breakdown;
		
	}
	if (offhandType == "weapon" && (skillName == "Dual Strike" || skillName == "Double Swing" || skillName == "Frenzy" || skillName == "Whirlwind") && equipped.weapon.name != "none") {
		document.getElementById("offhand_skill"+num).style.display = "inline"
		document.getElementById("offhand_skill"+num).style.margin = "0px 0px 0px "+(document.getElementById("dropdown_skill"+num).clientWidth+10)+"px"
		var physDamage_offhand = getWeaponDamage(strTotal,dexTotal,"offhand",0);
		var ohd = getNonPhysWeaponDamage("offhand");
		var nonPhys_min_offhand = Math.floor(ohd.fMin + ohd.cMin + ohd.lMin + ohd.pMin + ohd.mMin);
		var nonPhys_max_offhand = Math.floor(ohd.fMax + ohd.cMax + ohd.lMax + ohd.pMax + ohd.mMax);
		var outcome = {min:0,max:0,ar:0};
		outcome = c.getSkillDamage(skill, ar, physDamage_offhand[0], physDamage_offhand[1], physDamage_offhand[2], nonPhys_min_offhand, nonPhys_max_offhand);
		var output = outcome.min + "-" + outcome.max + " {"+Math.ceil((outcome.min+outcome.max)/2)+"}";
		if (outcome.min != 0 && outcome.max != 0) { document.getElementById("offhand_skill"+num+"_damage").innerHTML = output }
		//if (outcome.ar != 0) { document.getElementById("ar_skill"+num).innerHTML += " ... " + outcome.ar }
	} else {
		document.getElementById("offhand_skill"+num).style.display = "none"
	}
	if (skillName == "Lightning Surge" || skillName == "Chain Lightning") {
		var fcrTotal = character.fcr + character.level*character.fcr_per_level;
		var fcr_f = c.fcr_frames_alt;
		for (let i = 1; i < c.fcr_bp_alt.length; i++) { if (fcrTotal >= c.fcr_bp_alt[i]) { fcr_f -= 1 } }
		document.getElementById("ar_skill"+num).innerHTML = "Cast Rate: "+fcr_f+" frames"
	}
	if (skillName == "Multiple Shot") {
		c.multiproj = c.all_skills + 1
	}
	 
	updateSkills()
}

// checkIronGolem - Handles whether the Iron Golem dropdown should be visible
// ---------------------------------
function checkIronGolem() {
	var active = false;
	for (effect in effects) { if (effect.split("-")[0] == "Iron_Golem" && typeof(effects[effect].info.enabled) != 'undefined') { if (effects[effect].info.enabled == 1) { active = true } } }
	if (active != false) { document.getElementById("golem").style.display = "block"; document.getElementById("golem_spacing").style.display = "block"; }
	else { document.getElementById("golem").style.display = "none"; document.getElementById("golem_spacing").style.display = "none" }
}

// checkOffhand - Handles whether a separate line for offhand damage should be visible
// ---------------------------------
function checkOffhand() {
	if (offhandType == "weapon") {
		document.getElementById("offhand_basic").style.display = "inline"
	} else {
		document.getElementById("offhand_basic").style.display = "none"
		document.getElementById("offhand_skill1").style.display = "none"
		document.getElementById("offhand_skill2").style.display = "none"
	}
}

// updateSocketTotals - Updates the list of total stats gained from socketed jewels/runes/gems
// ---------------------------------
function updateSocketTotals() {
	var groups = ["helm", "armor", "weapon", "offhand"];
	for (let g = 0; g < groups.length; g++) {
		socketed[groups[g]].totals = {}
		for (let i = 0; i < socketed[groups[g]].items.length; i++) {
			for (affix in socketed[groups[g]].items[i]) { if (affix != "id" && affix != "name") {
				if (typeof(socketed[groups[g]].totals[affix]) == 'undefined') { socketed[groups[g]].totals[affix] = 0 }
				socketed[groups[g]].totals[affix] += socketed[groups[g]].items[i][affix]
			} }
		}
	}
}

let updateURLDebounced = debounce(updateURL, 200); // Only allow 1 update per 200ms

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
// updateURL - Updates the character parameters in the browser URL
// ---------------------------------
let updateURLTimeout = null;
function updateURL() {
	var param_quests = ~~character.quests_completed; if (param_quests == -1) { param_quests = 0 };
	var param_run = ~~character.running; if (param_run == -1) { param_run = 0 };
	
	//params.set('v', game_version)		// handled elsewhere currently
	params.set('class', character.class_name.toLowerCase())
	params.set('level', ~~character.level)
	params.set('difficulty', ~~character.difficulty)
	params.set('quests', param_quests)
	if (game_version == 2) { params.set('running', param_run) } else if (params.has('running')) { params.delete('running') }
	//params.set('running', param_run)
	params.set('strength', ~~character.strength_added)
	params.set('dexterity', ~~character.dexterity_added)
	params.set('vitality', ~~character.vitality_added)
	params.set('energy', ~~character.energy_added)
	params.set('url', ~~settings.parameters)
	params.set('coupling', ~~settings.coupling)
	params.set('synthwep', ~~settings.synthwep)
	if (game_version == 2) { params.set('autocast', ~~settings.autocast) } else if (params.has('autocast')) { params.delete('autocast') }
	//params.set('autocast', ~~settings.autocast)
	var param_skills = '';
	for (let s = 0; s < skills.length; s++) {
		var skill_level = skills[s].level;
		if (skill_level < 10) { skill_level = '0'+skill_level }
		param_skills += skill_level
	}
	params.set('skills', param_skills)
	params.delete('selected')
	for (group in corruptsEquipped) { params.delete(group) }
	params.delete('effect')
	params.delete('mercenary')
	params.delete('irongolem')
	
	if (game_version == 2) {	// these features are only available on the PoD version
		params.set('selected', selectedSkill[0]+','+selectedSkill[1])
		for (group in corruptsEquipped) {
			var param_equipped = equipped[group].name+','+equipped[group].tier+','+corruptsEquipped[group].name
			for (group_sock in socketed) { if (group == group_sock) {
				for (let i = 0; i < socketed[group].items.length; i++) {
					param_equipped += ','+socketed[group].items[i].name
				}
			} }
			params.set(group, param_equipped)
		}
	}
	
	for (id in effects) { if (typeof(effects[id].info.enabled) != 'undefined') {
		var param_effect = id+','+effects[id].info.enabled+','+effects[id].info.snapshot;
		if (effects[id].info.snapshot == 1) {
			param_effect += ','+effects[id].info.origin+','+effects[id].info.index
			for (affix in effects[id]) { if (affix != "info") {
				param_effect += ','+affix+','+effects[id][affix]
			} }
		}
		params.append('effect', param_effect)
	} }
		
	if (game_version == 2) {	// these features are only available on the PoD version
		var param_mercenary = mercenary.name;
		if (mercenary.name == "­ ­ ­ ­ Mercenary") { param_mercenary = "none" }
		for (group in mercEquipped) { param_mercenary += ','+mercEquipped[group].name }
		params.set('mercenary', param_mercenary)
		if (golemItem.name != "none") { params.set('irongolem', golemItem.name) }
	}
	
	params.delete('charm')
//	for (charm in equipped.charms) { if (typeof(equipped.charms[charm].name) != 'undefined' && equipped.charms[charm].name != 'none') { params.append('charm', equipped.charms[charm].name) }}
	for (charm in equipped.charms) { if (typeof(equipped.charms[charm].name) != 'undefined' && equipped.charms[charm].name != 'none') { params.append('charm', equipped.charms[charm].name) }}
	
	if (settings.parameters == 1) { window.history.replaceState({}, '', `${location.pathname}?${params}`) }
	
	// TODO: Shorten URL?
	//var params_string = params.toString();
	//params_string = params_string.split("%2C").join(",")
	//params_string = params_string.split("%C2%AD").join("~")
	//if (settings.parameters == 1) { window.history.replaceState({}, '', `${location.pathname}?`+params_string) }
}
// 	getmmmpl
//	This creates the url to mmmpld's ias calc and opens it in a new browser tab
//  url structure: https://mmmpld.github.io/pod-attack-calc/?c=2&ss=2&io=55&w1=22
//	c for class, ss for shapeshift, io for ias, and w for weapon id

function getmmmpld() {
	updatePrimaryStats()
//	updateStats()
//	get class
	getCharacterInfo()
	switch (character.class_name){
	case "Amazon":
		url_num = 0;
		break;
	case "Assassin":
		url_num = 1;
		break;
	case "Barbarian":
		url_num = 2;
		break;
	case "Druid":
		url_num = 3;
		break;
	case "Necromancer":
		url_num = 4;
		break;
	case "Paladin":
		url_num = 5;
		break;
	case "Sorceress":
		url_num = 6;
		break;
	}

//	get werebear/wolf status for url
	if (effects["Werebear"] != null){wereurl = "&ss=1"}
	else if(effects["Werewolf"] != null){wereurl = "&ss=2"}
	else{wereurl = null}
//	get ias for url
	iasurl = null
	try{
		thisias = offwepias; // + wias;
		iasurl = "&io=" + thisias;
	}
	catch(error){
		iasurl = "&io=0";
	}
	try{
		onwepias = wias
		iasurl2 = "&i1=" + wias;
	}
	catch(error){
		iasurl2 = "&i1=0";
	}
//	get weapon id for url
	thisiasindex = equipped.weapon.iasindex
	if (thisiasindex != null && thisiasindex > 0) {wepindex = "&w1=" + thisiasindex}
	else {wepindex = null}

//	Does this really metter here, off weapon vs on weapon ias?
//	if (offwepias > 0) {ias_link = "https://mmmpld.github.io/pod-attack-calc/?c=" + url_num + "&io=" + offwepias}
//	else {ias_link = "https://mmmpld.github.io/pod-attack-calc/?c=" + url_num} 
//	if (offwepias != null && wias != null)	{thisias = offwepias + wias}
//	thisias = offwepias + wias
//	if (thisias > 0){iasurl = "&io=" + thisias} 
//	else {iasurl = "&io=0"}
//	else if (thisias){iasurl = "&io=0"}
//	else {iasurl = "&io=0"}  //{iasurl = null}

//	put it all together
	ias_link = "https://mmmpld.github.io/pod-attack-calc/?c=" + url_num 
	if (wereurl != null) {ias_link += wereurl}
	if (iasurl != null) {ias_link += iasurl}
	if (wepindex != null) {ias_link += wepindex}
	if (iasurl2 != null) {ias_link += iasurl2}
//	go to the url
	window.open(ias_link);

}

// Trying to break down the damage that makes the combined skill damage
// would be cool to see how much of total is from each element
// Works when added to class js but not when called as a function
function addSomemore() {
	if (Math.floor(physDamage[0]*physDamage[2]) > 0) {skill2Breakdown += "\nWPhys Damage: " + Math.floor(physDamage[0]*physDamage[2]) + "-" + Math.floor(physDamage[1]*physDamage[2])};
	if (dmg.fMin > 0) {skill2Breakdown += "\nWFire Damage: " + dmg.fMin + "-" + dmg.fMax};
	if (dmg.cMin > 0) {skill2Breakdown += "\nWCold Damage: " + dmg.cMin + "-" + dmg.cMax};
	if (dmg.lMin > 0) {skill2Breakdown += "\nWLight Damage: " + dmg.lMin + "-" + dmg.lMax};
	if (dmg.mMin > 0) {skill2Breakdown += "\nWMagic Damage: " + dmg.mMin + "-" + dmg.mMax};
	if (dmg.pMin > 0) {skill2Breakdown += "\nWPoison Damage: " + dmg.pMin + "-" + dmg.pMax};
}

TooltipElementimporttest = document.getElementById("importtest");
//TooltipElementimporttest.title = "Currently only pulls class, level, stats, skills"; 

//async function importChar() {
//let characterName = document.getElementById('importname').value
//let characterName = "necrosallsuck"
//let characterData;

//=========================================================================================================================
// Character Import
//=========================================================================================================================
// Get character name from the ui
async function importChar() {
    // Get the textbox input value
    let characterName = document.getElementById('importname').value.trim();

    // If no value is entered in the textbox, check the URL for the "import" parameter
    if (!characterName) {
        const url = window.location.href; // Get the current URL
        const params = new URLSearchParams(url.split('?')[1]); // Parse query parameters
        characterName = params.get('import'); // Get the "import" parameter value
    }

    // If still no value is found, handle the error or provide a default
    if (!characterName) {
        console.error("No character name provided or found in the URL!");
//        return;
    }

//let builderurl = "https://build.pathofdiablo.com/?v=PoD&"
//let builderurl = "https://build.pathofdiablo.com/?v=2&quests=1&coupling=1&synthwep=0&autocast=1&"
//let builderurl = "file:///home/derek/Desktop/path-of-diablo-planner/index.html?v=2&quests=1&coupling=1&synthwep=0&autocast=1&"
let builderurl = "file:///home/derek/Desktop/path-of-diablo-planner/index.html?v=2&"
let data; 
function normalizeText(text) {
    return text.replace(/[\u00A0\u200B\u200C\u200D\uFEFF\u2011]/g, '').trim(); // Removes invisible spaces
}

// API call to get character
//characterName = "PIG_ASN"
if (characterName) {
	console.log("Character Name:", characterName);
	
	// Fetch character data and process it
	try {
		const characterData = await fetchCharacterData(characterName);
		processCharacterData(characterData);  // Process after retrieval
	} catch (error) {
		console.error("Error during API calls:", error);
	}
} else {
	console.warn("Character Name is not set in the configuration.");
}

async function fetchCharacterData(characterName) {
	console.log("Start function fetchCharacterData");
//    const url = `https://beta.pathofdiablo.com/api/characters/${encodeURIComponent("sorcsallsuck")}/summary`;
	const url = 'https://beta.pathofdiablo.com/api/characters/'+characterName+'/summary'
	//    console.log("API URL:", url);

    try {
        const response = await fetch(url);
        console.log("fetch worked");

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Character Data fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching character data:", error);
        return null;
    }
}

// Set character stats & skills from api response
// Function to process characterData after it's fetched
function processCharacterData(characterData) {
    if (!characterData || !characterData.Equipped) {
        console.warn("No character data found.");
        return;
    }

    console.log("Processing character data for direct item equipping...");
    
	reset(characterData.Class.toLowerCase())
//    character.class = characterData.Class;
    character.level = characterData.Stats.Level;
	character.strength = characterData.Stats.Strength
	character.dexterity = characterData.Stats.Dexterity
	character.vitality = characterData.Stats.Vitality
	character.energy = characterData.Stats.Energy
    // Loop through equipped items and equip them directly
    characterData.Equipped.forEach(item => {
        if (item.SynthesisedFrom && item.SynthesisedFrom.length > 0) {
            console.log(`Synthesized item detected: ${item.Title}`);
            item = synthesizeFromAPI(item, characterData); // Merge donor properties
        }
//	character.skills_sorceress.skillName["Warmth"] = 10
//	skills_sorceress.find(skill => skill.name === "Warmth").level = 10
//	character["skill_warmth"].level = 10
//	character.skillName["skill_warmth"].level = 10
    // Dynamically reference the correct skills array
    const classKey = `skills_${characterData.Class.toLowerCase()}`; // Example: "skills_sorceress"
    const classSkills = window[classKey]; // Assuming skill arrays are globally accessible

    if (!classSkills) {
        console.error(`Skill data not found for class: ${characterData.Class}`);
        return;
    }

    // Loop through each skill from API and update
    characterData.SkillTabs.forEach(tab => {
        tab.Skills.forEach(apiSkill => {
            const skillObject = classSkills.find(skill => skill.name === apiSkill.Name);
            
            if (skillObject) {
                skillObject.level = apiSkill.Level;
//                console.log(`Updated ${skillObject.name} to level ${skillObject.level}`);
            } else {
                console.warn(`Skill not found for class ${characterData.Class}: ${apiSkill.Name}`);
            }
        });
    });
    equipItemDirectly(item);
    });

	// Add Torch and Anni by default
	addCharm("Hellfire Torch");
	addCharm("Annihilus");

	// Determine which SkillTab has the most points
	let dominantTab = characterData.SkillTabs.reduce((maxTab, currentTab) =>
		currentTab.Total > maxTab.Total ? currentTab : maxTab
	);

	// Map skill tab names to charm names
	const charmMap = {
		// Amazon
		"Javelin and Spear Skills": "+1 Harpoonist's Grand Charm",
		"Passive and Magic Skills": "+1 Acrobat's Grand Charm",
		"Bow and Crossbow Skills": "+1 Fletcher's Grand Charm",

		// Assassin
		"Martial Arts": "+1 Shogukusha's Grand Charm",
		"Shadow Disciplines": "+1 Mentalist's Grand Charm",
		"Traps": "+1 Entrapping Grand Charm",

		// Barbarian
		"Warcries": "+1 Sounding Grand Charm",
		"Masteries": "+1 Fanatic Grand Charm",
		"Combat Skills": "+1 Expert's Grand Charm",

		// Druid
		"Elemental Skills": "+1 Nature's Grand Charm",
		"Shape Shifting Skills": "+1 Spiritual Grand Charm",
		"Summoning Skills": "+1 Trainer's Grand Charm",

		// Necromancer
		"Summoning Skills": "+1 Graverobber's Grand Charm",
		"Poison and Bone Skills": "+1 Fungal Grand Charm",
		"Curses": "+1 Hexing Grand Charm",

		// Paladin
		"Defensive Auras": "+1 Preserver's Grand Charm",
		"Offensive Auras": "+1 Captain's Grand Charm",
		"Combat Skills": "+1 Lion Branded Grand Charm",

		// Sorceress
		"Cold Skills": "+1 Chilling Grand Charm",
		"Lightning Skills": "+1 Sparking Grand Charm",
		"Fire Skills": "+1 Burning Grand Charm"
	};


	// Add charm if there's a match
	if (charmMap[dominantTab.Name]) {
		for (let i = 0; i < 9; i++) {
			addCharm(charmMap[dominantTab.Name]);
		}
//		addCharm(charmMap[dominantTab.Name]);
		console.log(`Added charm for dominant tab: ${dominantTab.Name}`);
	} else {
		console.warn(`No charm mapped for dominant skill tab: ${dominantTab.Name}`);
	}

    update(); // Update interface dynamically
}

// Equip items from api response
function formatSlotName(slot) {
    if (slot === "ring1" || slot === "ring2") return "Ring"; // Special case for ring1
    return slot.charAt(0).toUpperCase() + slot.slice(1);
}

const pendingPropertyLists = {};

function equipItemDirectly(item) {
	const pendingPropertyLists = {};

	const slotMapping = {
		body: "armor",
		weapon1: "weapon",
		weapon2: "offhand",
		helmet: "helm"
	};

	const rawSlot = item.Worn;
	const slot = slotMapping[rawSlot] || rawSlot;

	let equipName = item.Title;
	let offhandtag = item.Tag
	switch (item.QualityCode) {
		case "q_unique":
		case "q_set":
			equipName = item.Title;
			break;
		case "q_runeword":
			equipName = `${item.Title} ­ ­ - ­ ­ ${item.Tag}`;
			break;
		case "q_magic":
		case "q_rare":
		case "q_crafted":
			// Check if Tag is Bolts or Arrows
			if (item.Tag === "Bolts" || item.Tag === "Arrows") {
				console.log("Offhand equipped: ", offhandtag)
				equipName = `Imported ${item.QualityCode.slice(2)} ${offhandtag}`;
			} else {
				equipName = `Imported ${item.QualityCode.slice(2)} ${formatSlotName(slot)}`;
			}
			break;
	}


	// Save the real properties for use *after* placeholder is equipped
	if (item.PropertyList && ["q_magic", "q_rare", "q_crafted"].includes(item.QualityCode)) {
		pendingPropertyLists[slot] = item.PropertyList;
		console.log(`✅ Stashed PropertyList for slot ${slot}`, item.PropertyList);
	}

	// Equip the placeholder item via dropdown
	const dropdownId = `dropdown_${slot}`;
	const dropdown = document.getElementById(dropdownId);
	if (dropdown) {
		dropdown.value = equipName;
		dropdown.dispatchEvent(new Event("change"));
		console.log(`Dropdown updated and change event triggered: ${dropdownId} -> ${equipName}`);
	} else {
		console.warn(`Dropdown not found for slot: ${slot}`);
	}

	// After a short delay, apply the stored properties to the equipped item
	setTimeout(() => {
		if (pendingPropertyLists[slot]) {
			if (!equipped[slot]) {
				console.warn(`❌ No item equipped in slot: ${slot} to apply properties`);
				return;
			}

			// Inject PropertyList temporarily into the equipped item
			equipped[slot].PropertyList = pendingPropertyLists[slot];
			console.log(`✅ Injecting PropertyList into equipped[${slot}]`, equipped[slot].PropertyList);

			applyMatchedProperties(slot);
			delete pendingPropertyLists[slot]; // Clean up
		}
	}, 0);
}



function applyMatchedProperties(slot) {
    if (!equipped[slot]) {
        console.warn(`❌ No equipped item found in slot: ${slot}`);
        return;
    }
    const equippedItem = equipped[slot];

    // Rename generic items if needed
    if (["q_magic", "q_rare", "q_crafted"].includes(equippedItem.QualityCode)) {
        const qualityName = equippedItem.QualityCode.split("_")[1];
        const formattedQuality = qualityName.charAt(0).toUpperCase() + qualityName.slice(1);
        const formattedSlot = formatSlotName(slot);
        equippedItem.Title = `Imported ${formattedQuality} ${formattedSlot}`;
        console.log(`⚠️ Adjusted item name: "${equippedItem.Title}"`);
    }

    equippedItem.PropertyList.forEach(propText => {
        const matches = findMatchingStat(propText, stats);
        if (!matches || matches.length === 0) {
            console.warn(`❌ No match for: "${propText}"`);
            return;
        }

        // If we can extract a number from the propertyText, do it once here
        const numericValue = parseInt(propText.match(/[-+]?\d+/)?.[0], 10) || 0;

	matches.forEach(({ statKey, value }) => {
		if (statKey === "ctc") {
			if (!Array.isArray(equippedItem.ctc)) equippedItem.ctc = [];
			equippedItem.ctc.push(value);
			console.log(`✅ Added CTC:`, value);
		} else if (statKey === "cskill") {
			if (!Array.isArray(equippedItem.cskill)) equippedItem.cskill = [];
			equippedItem.cskill.push(value);
			console.log(`✅ Added Charged Skill:`, value);
		} else {
			const valueToApply = typeof value === "number" ? value : numericValue;
			equippedItem[statKey] = (equippedItem[statKey] || 0) + valueToApply;
			character[statKey] = (character[statKey] || 0) + valueToApply;
		}
	});

    });

    updateSelectedItemSummary(equippedItem);
    update();
    console.log(`🔄 UI refreshed for item: ${equippedItem.Title}`);
}



function findMatchingStat(propertyText, stats) {
    console.log(`Checking property: "${propertyText}" against stats`);
	const afterKillStat = parseAfterKillStat(propertyText);
	if (afterKillStat) {
		return [afterKillStat];
	}

    const ctcParsed = parseChanceToCast(propertyText);
    if (ctcParsed) {
        console.log(`🎯 Parsed CTC: ${JSON.stringify(ctcParsed.value)}`);
        return [ctcParsed];  // Return in array form for compatibility
    }
    const cskillParsed = parseChargedSkill(propertyText);
    if (cskillParsed) {
        console.log(`🎯 Parsed Charged Skill: ${JSON.stringify(cskillParsed.value)}`);
        return [cskillParsed];
    }	
    // Try to match "Adds #–# [Element] Damage"
    const damageMatch = propertyText.match(/Adds\s+(\d+)[–-](\d+)\s*(\w*)\s*Damage/i);
    if (damageMatch) {
        const [, min, max, elementRaw] = damageMatch;
        const element = elementRaw.toLowerCase();
        let prefix = "damage"; // default is physical

        switch (element) {
            case "fire": prefix = "fDamage"; break;
            case "cold": prefix = "cDamage"; break;
            case "lightning": prefix = "lDamage"; break;
            case "poison": prefix = "pDamage"; break;
            // fall through: unknown/empty means physical
        }

        console.log(`🎯 Range match: ${prefix}_min = ${min}, ${prefix}_max = ${max}`);
        return [
            { statKey: `${prefix}_min`, value: parseInt(min, 10) },
            { statKey: `${prefix}_max`, value: parseInt(max, 10) }
        ];
    }

    // Fallback to format-based matching
    for (const [statKey, statData] of Object.entries(stats)) {
        if (statData.editable !== 1) continue;

        const formatPattern = new RegExp(
            statData.format.map(f =>
                f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            ).join(".*"),
            "i"
        );

        if (formatPattern.test(propertyText)) {
            console.log(`✅ Matched property: "${propertyText}" → ${statKey}`);
            return [{ statKey }];
        }
    }

    console.warn(`❌ No match found for "${propertyText}"`);
    return [];
}

// Inside findMatchingStat or as a helper function
function parseChanceToCast(line) {
    const ctcRegex = /(\d+)% Chance to cast level (\d+)\s+(.+?)\s+(when [\w\s]+)$/i;
    const match = line.match(ctcRegex);
    if (!match) return null;

    const [, percent, level, skillName, trigger] = match;
    return {
        statKey: "ctc",
        value: [parseInt(percent), parseInt(level), skillName.trim(), trigger.trim()]
    };
}

function parseChargedSkill(line) {
    const chargedRegex = /Level (\d+)\s+(.+?)\s+\((\d+)\/\d+ Charges\)/i;
    const match = line.match(chargedRegex);
    if (!match) return null;

    const [, level, skillName, charges] = match;
    return {
        statKey: "cskill",
        value: [parseInt(level), skillName.trim(), parseInt(charges)]
    };
}

function parseAfterKillStat(line) {
    const match = line.match(/\+(\d+)\s+(?:to\s+)?(Mana|Life)\s+after\s+each\s+Kill/i);
    if (!match) return null;

    const [, value, type] = match;
    const statKey = type.toLowerCase() + "_after_kill";  // e.g., "mana_after_kill"

    return {
        statKey,
        value: parseInt(value, 10)
    };
}



// recreate synths found in api response
function synthesizeFromAPI(baseItem, apiData, applyAll = false) {
    if (!baseItem.SynthesisedFrom) return baseItem;

//    const slot = baseItem.Worn === "weapon1" ? "weapon" : baseItem.Worn;
    const slot = baseItem.Worn === "weapon1" ? "weapon" : baseItem.Worn === "weapon2" ? "offhand" : baseItem.Worn;
    window.currentSynthSlot = slot;

    equipItemDirectly(baseItem);
    const equippedItem = equipped[slot];

    if (!equippedItem) {
        console.warn(`Failed to equip synthesized item "${baseItem.Title}"`);
        return baseItem;
    }

    // Collect donor items
    const donorItems = baseItem.SynthesisedFrom
        .map(name => findDonorItem(name, apiData))
        .filter(Boolean);

    // Include base (equipped) item in synth properties
    const synthProperties = gatherSynthPropertiesFromMultiple([equippedItem, ...donorItems]);
//	applyMatchedProperties(slot)
if (!applyAll) {
	for (const key in equippedItem) {
		if (key === "name" || key.startsWith("base") || key.startsWith("req_")) continue;
		character[key] -= equippedItem[key];
		delete equippedItem[key];
	}
	equippedItem.emptysynth = 1;

	// Generate synth property UI
	generateSynthPropertyUI(synthProperties, slot);

	setTimeout(() => {
		matchSynthStatsFromAPIStrings(baseItem.PropertyList || [], synthProperties, stats);
	}, 0);

    } else {
        donorItems.forEach(donor => mergeItemProperties(equippedItem, donor));
        updateSelectedItemSummary(slot);
        update();
    }

    return equippedItem;
}

function matchSynthStatsFromAPIStrings(apiStatStrings, synthProperties, stats) {
	if (!Array.isArray(apiStatStrings) || !Array.isArray(synthProperties)) return;

	apiStatStrings.forEach(apiText => {
		apiText = apiText.trim();
		console.log(`🔍 Matching API stat: "${apiText}"`);

		let matchedKey = null;
		let matchedValue = null;

		// Loop through all editable stats
		for (const [statKey, statData] of Object.entries(stats)) {
			if (statData.editable !== 1) continue;

			// Build regex pattern from the stat's format, e.g. ["+", "% Enhanced Damage"]
			const patternStr = statData.format
				.map(piece => piece.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // escape regex chars
				.join(".*?"); // allow anything (like numbers) in between
			const pattern = new RegExp(`^${patternStr}$`, "i");

			if (pattern.test(apiText)) {
				// Try to extract the number value from the string
				const numMatch = apiText.match(/[-+]?\d+(\.\d+)?/);
				const value = numMatch ? parseFloat(numMatch[0]) : null;
				if (value !== null) {
					matchedKey = statKey;
					matchedValue = value;
					break;
				}
			}
		}

		if (!matchedKey) {
			console.warn(`❌ No matching stat key for "${apiText}"`);
			return;
		}
console.log("🔍 Searching synthProperties for:", matchedKey, matchedValue);
//console.table(synthProperties);

		// Now match with synthProperties using resolved key and value
		const match = synthProperties.find(
			p => p.key === matchedKey && Number(p.value) === Number(matchedValue)
		);
		if (match) {
			const checkbox = document.querySelector(
				`input[type="checkbox"][data-key="${match.key}"][data-value="${match.value}"]`
			);
			if (checkbox && !checkbox.checked) {
				checkbox.checked = true;
				checkbox.dispatchEvent(new Event("change"));
				console.log(`✅ Auto-checked: ${match.key}: ${match.value}`);
			}
		} else {
			console.warn(`❌ No synth property matched for resolved stat "${matchedKey}: ${matchedValue}"`);
		}
	});
}

function matchSynthStatsFromAPI(apiPropertyList, synthProperties) {
	if (!Array.isArray(apiPropertyList) || !Array.isArray(synthProperties)) return;

	apiPropertyList.forEach(apiProp => {
		const match = synthProperties.find(({ key, value }) => {
			const [apiKey, apiRawValue] = apiProp.split(":").map(s => s.trim());
			const apiValue = isNaN(apiRawValue) ? apiRawValue : parseFloat(apiRawValue);
			return apiKey === key && apiValue === value;
		});

		if (match) {
			const checkbox = document.querySelector(
				`input[type="checkbox"][data-key="${match.key}"][data-value="${match.value}"]`
			);
			if (checkbox && !checkbox.checked) {
				checkbox.checked = true;
				checkbox.dispatchEvent(new Event("change"));
				console.log(`✅ Auto-checked: ${match.key}: ${match.value}`);
			}
		} else {
			console.warn(`❌ No matching synth checkbox found for: "${apiProp}"`);
		}
	});
}

function gatherSynthPropertiesFromMultiple(items) {
    const result = [];

    items.forEach(item => {
        const source = item.Title || item.name || "Unknown";

        // ✅ If PropertyList doesn't exist, build it from raw properties
        let propList = item.PropertyList;
        if (!propList || propList.length === 0) {
            propList = Object.entries(item)
                .filter(([key]) =>
                    !["name", "req_level", "type", "base", "img", "twoHanded", "ctc", "cskill", "Worn", "SynthesisedFrom", "Title", "PropertyList", "tier", "max_sockets", "baseSpeed", "light_radius", "base_damage_min", "base_damage_max", "original_tier", "pod_changes", "req_strength", "req_dexterity", "iasindex"].includes(key)
                )
                .map(([key, value]) => `${key}: ${value}`);
        }

        propList.forEach(propString => {
            const [key, value] = propString.split(":").map(s => s.trim());
            result.push({ key, value, source });
        });
    });

    return result;
}




function findDonorItem(name) {
    for (const slot in equipment) {
        const item = equipment[slot].find(i => i.name === name);
        if (item) return item;
    }
    return null; // Return `null` if the donor item isn't found
}




function mergeItemProperties(baseItem, donor) {
    if (!donor) {
        console.warn(`Donor item is missing or undefined.`);
        return;
    }

    if (!baseItem.PropertyList) baseItem.PropertyList = [];

    if (!donor.PropertyList) {
        console.warn(`Donor item "${donor.name}" has no PropertyList—building dynamically.`);
        donor.PropertyList = Object.entries(donor)
            .filter(([key]) => !["name", "req_level", "type", "base", "img", "twoHanded", "ctc", "cskill"].includes(key))
            .map(([key, value]) => `${key}: ${value}`);
    }

    donor.PropertyList.forEach(propString => {
        const [key, value] = propString.split(": ").map(str => str.trim());
        const numericValue = parseFloat(value);

        // Apply to baseItem
        if (!baseItem[key]) baseItem[key] = 0;
        if (!isNaN(numericValue)) {
            baseItem[key] += numericValue;
        } else {
            baseItem[key] = value;
        }

        // Apply to character (if relevant)
        if (!character[key]) character[key] = 0;
        if (!isNaN(numericValue)) {
            character[key] += numericValue;
        }

        // Avoid duplicates in PropertyList
        if (!baseItem.PropertyList.includes(propString) && !key.includes("PropertyList")) {
            baseItem.PropertyList.push(propString);
            console.log(`Added stat: ${key}: ${value} to ${baseItem.Title}`);
        }
    });

    console.log("Final Synthesized Item:", JSON.stringify(baseItem, null, 2));
    updateSelectedItemSummary(baseItem.Worn);
    update();
}

////////////////////////////////////////////////////////
// start listing potential properties for synth items

const validEquipmentProperties = new Set();

// ✅ Extract valid properties from all items inside nested lists (`weapon`, `armor`, etc.)
Object.entries(equipment).forEach(([category, itemList]) => {
    itemList.forEach(item => {
        Object.keys(item).forEach(prop => validEquipmentProperties.add(prop));
    });
});

function gatherSynthProperties(baseItem, donorItems) {
    const properties = []; // ✅ Store all occurrences (including duplicates)

    const addProperties = (item, source) => {
        Object.entries(item).forEach(([key, value]) => {
            properties.push({ key, value, source }); // ✅ Keep ALL properties, ensuring they remain in the equipped item
        });
    };

    addProperties(baseItem, "Base Item");
    donorItems.forEach(donor => addProperties(donor, `Donor: ${donor.name}`));

    return properties; // ✅ This ensures properties exist for merging and deletion later
}

function filterPropertiesForUI(properties) {
    const equipmentItems = Object.values(equipment).flat(); // ✅ Flatten all categories
    const equipmentProperties = new Set(equipmentItems.flatMap(item => Object.keys(item))); // ✅ Extract valid names

    const excludedPrefixes = ["img", "base", "twoHanded", "name", "req_", "type"];

    return properties.filter(prop => {
        return equipmentProperties.has(prop.key) && !excludedPrefixes.some(prefix => prop.key.startsWith(prefix));
    });
}


function shouldIncludeProperty(key) {
    const excludedKeys = ["name", "type", "base", "img", "req_level"];
    return !excludedKeys.includes(key);
}

function generateSynthPropertyUI(properties, slot = "weapon") {
    const containerId = slot === "offhand" ? "offhandsynthPropertyContainer" : "synthPropertyContainer";
    const container = document.getElementById(containerId);

    if (!container || !properties || properties.length === 0) {
        if (container) container.style.display = "none";
        return;
    }

    container.style.display = "block";
    container.innerHTML = `<strong>Potential Synth Properties (${slot}):</strong>`;

    const equippedItem = equipped[slot];

    properties.forEach(({ key, value, source }) => {
        const checkboxId = `${slot}-${key}-${source.replace(/\s+/g, '_')}`;
        const div = document.createElement("div");

        div.innerHTML = `
            <label>
                <input type="checkbox" id="${checkboxId}" data-key="${key}" data-value="${value}">
                ${key}: ${value} <small>(${source})</small>
            </label>
        `;

        const checkbox = div.querySelector("input");
        checkbox.addEventListener("change", (e) => {
            const statKey = e.target.dataset.key;
            const rawValue = e.target.dataset.value;
            const value = isNaN(rawValue) ? rawValue : parseFloat(rawValue);

            if (e.target.checked) {
                equippedItem[statKey] = value;
                character[statKey] = (character[statKey] || 0) + (isNaN(value) ? 0 : value);
            } else {
                if (!isNaN(value)) {
                    character[statKey] -= value;
                }
                delete equippedItem[statKey];
            }

            // Update PropertyList without duplication
            equippedItem.PropertyList = equippedItem.PropertyList || [];
            const propString = `${statKey}: ${value}`;
            if (e.target.checked) {
                if (!equippedItem.PropertyList.includes(propString)) {
                    equippedItem.PropertyList.push(propString);
                }
            } else {
                equippedItem.PropertyList = equippedItem.PropertyList.filter(p => p !== propString);
            }

            updateSelectedItemSummary(equippedItem.Worn);
            update();
        });

        container.appendChild(div);
    });
}

function parseAddsDamageStat(text) {
    const regex = /Adds\s+(\d+)\s*(?:–|to|-)\s*(\d+)\s*(Cold|Fire|Lightning|Magic|Poison)?\s*Damage/i;
    const match = text.match(regex);
    if (!match) return null;

    const min = parseInt(match[1], 10);
    const max = parseInt(match[2], 10);
    const element = match[3] ? match[3].toLowerCase() : null;

    let keyPrefix;
    switch (element) {
        case "cold": keyPrefix = "cDamage"; break;
        case "fire": keyPrefix = "fDamage"; break;
        case "lightning": keyPrefix = "lDamage"; break;
        case "magic": keyPrefix = "mDamage"; break;
        case "poison": keyPrefix = "pDamage"; break;
        default: keyPrefix = "damage"; // physical
    }

    return {
        keys: [`${keyPrefix}_min`, `${keyPrefix}_max`],
        values: [min, max],
        label: `${element ? element.charAt(0).toUpperCase() + element.slice(1) + " " : ""}Damage`,
    };
}

const parsed = parseAddsDamageStat(propertyText);
if (parsed) {
    parsed.keys.forEach((key, idx) => {
        const value = parsed.values[idx];

        const match = synthProperties.find(
            prop => prop.key === key && Number(prop.value) === value
        );

        if (match) {
            console.log(`✅ Matched adds-damage property: "${key}: ${value}" from "${propertyText}"`);
            const checkbox = document.querySelector(`input[type="checkbox"][data-key="${key}"][data-value="${value}"]`);
            if (checkbox && !checkbox.checked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event("change"));
            }
        } else {
            console.warn(`❌ No synth match found for "${key}: ${value}"`);
        }
    });
}












function applyItemStatToCharacter(property) {
    console.log(`Applying property: ${property}`);
    
    // Check if the property is numerical
    const numericMatch = property.match(/(\d+)/);
    if (numericMatch) {
        const value = parseInt(numericMatch[1], 10);

        // Determine property type (Strength, Energy, Resistances, etc.)
        const propertyKey = determinePropertyKey(property);
        
        if (!character[propertyKey]) {
            character[propertyKey] = 0; // Initialize if missing
        }
        character[propertyKey] += value;
    }
}

function determinePropertyKey(property) {
    if (property.includes("Strength")) return "strength";
    if (property.includes("Dexterity")) return "dexterity";
    if (property.includes("Vitality")) return "vitality";
    if (property.includes("Energy")) return "energy";
    if (property.includes("Resist")) return "resistances";
    
    return "misc"; // Catch-all for unknown properties
}




//	window.open(builderurl);
//	window.location.href = builderurl ;
document.getElementById('importname').value = ""
}

async function justthesynth() {
    // Get the textbox input value
    let characterName = document.getElementById('importname').value.trim();

    // If no value is entered in the textbox, check the URL for the "import" parameter
    if (!characterName) {
        const url = window.location.href; // Get the current URL
        const params = new URLSearchParams(url.split('?')[1]); // Parse query parameters
        characterName = params.get('import'); // Get the "import" parameter value
    }

    // If still no value is found, handle the error or provide a default
    if (!characterName) {
        console.error("No character name provided or found in the URL!");
//        return;
    }
// API call to get character
//characterName = "Zardragon"
if (characterName) {
	console.log("Character Name:", characterName);
	
	// Fetch character data and process it
	try {
		const characterData = await fetchCharacterData(characterName);
		processCharacterData(characterData);  // Process after retrieval
	} catch (error) {
		console.error("Error during API calls:", error);
	}
} else {
	console.warn("Character Name is not set in the configuration.");
}

async function fetchCharacterData(characterName) {
	console.log("Start function fetchCharacterData");
//    const url = `https://beta.pathofdiablo.com/api/characters/${encodeURIComponent("sorcsallsuck")}/summary`;
	const url = 'https://beta.pathofdiablo.com/api/characters/'+characterName+'/summary'
	//    console.log("API URL:", url);

    try {
        const response = await fetch(url);
        console.log("fetch worked");

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Character Data fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching character data:", error);
        return null;
    }
}

// Set character stats & skills from api response
// Function to process characterData after it's fetched
function processCharacterData(characterData) {
    if (!characterData || !characterData.Equipped) {
        console.warn("No character data found.");
        return;
    }

    console.log("Processing character data for direct item equipping...");
    
    // Loop through equipped items and equip them directly
    characterData.Equipped.forEach(item => {
        if (item.SynthesisedFrom && item.SynthesisedFrom.length > 0) {
            console.log(`Synthesized item detected: ${item.Title}`);
            item = synthesizeFromAPI(item, characterData); // Merge donor properties
		    equipItemDirectly(item);
		}
    });

    update(); // Update interface dynamically
}

// Equip items from api response
function formatSlotName(slot) {
    if (slot === "ring1" || slot === "ring2") return "Ring"; // Special case for ring1
    return slot.charAt(0).toUpperCase() + slot.slice(1);
}

const pendingPropertyLists = {};

function equipItemDirectly(item) {
	const pendingPropertyLists = {};

	const slotMapping = {
		body: "armor",
		weapon1: "weapon",
		weapon2: "offhand",
		helmet: "helm"
	};

	const rawSlot = item.Worn;
	const slot = slotMapping[rawSlot] || rawSlot;

	let equipName = item.Title;
	let offhandtag = item.Tag
	switch (item.QualityCode) {
		case "q_unique":
		case "q_set":
			equipName = item.Title;
			break;
		case "q_runeword":
			equipName = `${item.Title} ­ ­ - ­ ­ ${item.Tag}`;
			break;
		case "q_magic":
		case "q_rare":
		case "q_crafted":
			// Check if Tag is Bolts or Arrows
			if (item.Tag === "Bolts" || item.Tag === "Arrows") {
				console.log("Offhand equipped: ", offhandtag)
				equipName = `Imported ${item.QualityCode.slice(2)} ${offhandtag}`;
			} else {
				equipName = `Imported ${item.QualityCode.slice(2)} ${formatSlotName(slot)}`;
			}
			break;
	}


	// Save the real properties for use *after* placeholder is equipped
	if (item.PropertyList && ["q_magic", "q_rare", "q_crafted"].includes(item.QualityCode)) {
		pendingPropertyLists[slot] = item.PropertyList;
		console.log(`✅ Stashed PropertyList for slot ${slot}`, item.PropertyList);
	}

	// Equip the placeholder item via dropdown
	const dropdownId = `dropdown_${slot}`;
	const dropdown = document.getElementById(dropdownId);
	if (dropdown) {
		dropdown.value = equipName;
		dropdown.dispatchEvent(new Event("change"));
		console.log(`Dropdown updated and change event triggered: ${dropdownId} -> ${equipName}`);
	} else {
		console.warn(`Dropdown not found for slot: ${slot}`);
	}

	// After a short delay, apply the stored properties to the equipped item
	setTimeout(() => {
		if (pendingPropertyLists[slot]) {
			if (!equipped[slot]) {
				console.warn(`❌ No item equipped in slot: ${slot} to apply properties`);
				return;
			}

			// Inject PropertyList temporarily into the equipped item
			equipped[slot].PropertyList = pendingPropertyLists[slot];
			console.log(`✅ Injecting PropertyList into equipped[${slot}]`, equipped[slot].PropertyList);

			applyMatchedProperties(slot);
			delete pendingPropertyLists[slot]; // Clean up
		}
	}, 0);
}



function applyMatchedProperties(slot) {
    if (!equipped[slot]) {
        console.warn(`❌ No equipped item found in slot: ${slot}`);
        return;
    }
    const equippedItem = equipped[slot];

    // Rename generic items if needed
    if (["q_magic", "q_rare", "q_crafted"].includes(equippedItem.QualityCode)) {
        const qualityName = equippedItem.QualityCode.split("_")[1];
        const formattedQuality = qualityName.charAt(0).toUpperCase() + qualityName.slice(1);
        const formattedSlot = formatSlotName(slot);
        equippedItem.Title = `Imported ${formattedQuality} ${formattedSlot}`;
        console.log(`⚠️ Adjusted item name: "${equippedItem.Title}"`);
    }

    equippedItem.PropertyList.forEach(propText => {
        const matches = findMatchingStat(propText, stats);
        if (!matches || matches.length === 0) {
            console.warn(`❌ No match for: "${propText}"`);
            return;
        }

        // If we can extract a number from the propertyText, do it once here
        const numericValue = parseInt(propText.match(/[-+]?\d+/)?.[0], 10) || 0;

		matches.forEach(({ statKey, value }) => {
			if (statKey === "ctc") {
				if (!Array.isArray(equippedItem.ctc)) equippedItem.ctc = [];
				equippedItem.ctc.push(value);
				console.log(`✅ Added CTC:`, value);
			} else if (statKey === "cskill") {
				if (!Array.isArray(equippedItem.cskill)) equippedItem.cskill = [];
				equippedItem.cskill.push(value);
				console.log(`✅ Added Charged Skill:`, value);
			} else {
				const valueToApply = typeof value === "number" ? value : numericValue;
				equippedItem[statKey] = (equippedItem[statKey] || 0) + valueToApply;
				character[statKey] = (character[statKey] || 0) + valueToApply;
			}
		});
    });

    updateSelectedItemSummary(equippedItem);
    update();
    console.log(`🔄 UI refreshed for item: ${equippedItem.Title}`);
}



function findMatchingStat(propertyText, stats) {
	const afterKillStat = parseAfterKillStat(propertyText);
	if (afterKillStat) {
		return [afterKillStat];
	}

	const ctcParsed = parseChanceToCast(propertyText);
    if (ctcParsed) {
        console.log(`🎯 Parsed CTC: ${JSON.stringify(ctcParsed.value)}`);
        return [ctcParsed];  // Return in array form for compatibility
    }
    const cskillParsed = parseChargedSkill(propertyText);
    if (cskillParsed) {
        console.log(`🎯 Parsed Charged Skill: ${JSON.stringify(cskillParsed.value)}`);
        return [cskillParsed];
    }	
    console.log(`Checking property: "${propertyText}" against stats`);

    // Try to match "Adds #–# [Element] Damage"
    const damageMatch = propertyText.match(/Adds\s+(\d+)[–-](\d+)\s*(\w*)\s*Damage/i);
    if (damageMatch) {
        const [, min, max, elementRaw] = damageMatch;
        const element = elementRaw.toLowerCase();
        let prefix = "damage"; // default is physical

        switch (element) {
            case "fire": prefix = "fDamage"; break;
            case "cold": prefix = "cDamage"; break;
            case "lightning": prefix = "lDamage"; break;
            case "poison": prefix = "pDamage"; break;
            // fall through: unknown/empty means physical
        }

        console.log(`🎯 Range match: ${prefix}_min = ${min}, ${prefix}_max = ${max}`);
        return [
            { statKey: `${prefix}_min`, value: parseInt(min, 10) },
            { statKey: `${prefix}_max`, value: parseInt(max, 10) }
        ];
    }

    // Fallback to format-based matching
    for (const [statKey, statData] of Object.entries(stats)) {
        if (statData.editable !== 1) continue;

        const formatPattern = new RegExp(
            statData.format.map(f =>
                f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            ).join(".*"),
            "i"
        );

        if (formatPattern.test(propertyText)) {
            console.log(`✅ Matched property: "${propertyText}" → ${statKey}`);
            return [{ statKey }];
        }
    }

    console.warn(`❌ No match found for "${propertyText}"`);
    return [];
}

// Inside findMatchingStat or as a helper function
function parseChanceToCast(line) {
    const ctcRegex = /(\d+)% Chance to cast level (\d+)\s+(.+?)\s+(when [\w\s]+)$/i;
    const match = line.match(ctcRegex);
    if (!match) return null;

    const [, percent, level, skillName, trigger] = match;
    return {
        statKey: "ctc",
        value: [parseInt(percent), parseInt(level), skillName.trim(), trigger.trim()]
    };
}

function parseChargedSkill(line) {
    const chargedRegex = /Level (\d+)\s+(.+?)\s+\((\d+)\/\d+ Charges\)/i;
    const match = line.match(chargedRegex);
    if (!match) return null;

    const [, level, skillName, charges] = match;
    return {
        statKey: "cskill",
        value: [parseInt(level), skillName.trim(), parseInt(charges)]
    };
}

function parseAfterKillStat(line) {
    const match = line.match(/\+(\d+)\s+(?:to\s+)?(Mana|Life)\s+after\s+each\s+Kill/i);
    if (!match) return null;

    const [, value, type] = match;
    const statKey = type.toLowerCase() + "_after_kill";  // e.g., "mana_after_kill"

    return {
        statKey,
        value: parseInt(value, 10)
    };
}


function parseSingleDamageStat(line) {
    const match = line.match(/\+(\d+)\s+to\s+(Maximum|Minimum)\s+Damage/i);
    if (!match) return null;

    const [, val, type] = match;
    const statKey = type === "Maximum" ? "damage_max" : "damage_min";

    return {
        statKey,
        value: parseInt(val)
    };
}

// recreate synths found in api response
function synthesizeFromAPI(baseItem, apiData, applyAll = false) {
    if (!baseItem.SynthesisedFrom) return baseItem;

//    const slot = baseItem.Worn === "weapon1" ? "weapon" : baseItem.Worn;
    const slot = baseItem.Worn === "weapon1" ? "weapon" : baseItem.Worn === "weapon2" ? "offhand" : baseItem.Worn;
    window.currentSynthSlot = slot;

    equipItemDirectly(baseItem);
    const equippedItem = equipped[slot];

    if (!equippedItem) {
        console.warn(`Failed to equip synthesized item "${baseItem.Title}"`);
        return baseItem;
    }

    // Collect donor items
    const donorItems = baseItem.SynthesisedFrom
        .map(name => findDonorItem(name, apiData))
        .filter(Boolean);

    // Include base (equipped) item in synth properties
    const synthProperties = gatherSynthPropertiesFromMultiple([equippedItem, ...donorItems]);
//	applyMatchedProperties(slot)
if (!applyAll) {
	for (const key in equippedItem) {
		if (key === "name" || key.startsWith("base") || key.startsWith("req_")) continue;
		character[key] -= equippedItem[key];
		delete equippedItem[key];
	}
	equippedItem.emptysynth = 1;

	// Generate synth property UI
	generateSynthPropertyUI(synthProperties, slot);

	setTimeout(() => {
		matchSynthStatsFromAPIStrings(baseItem.PropertyList || [], synthProperties, stats);
	}, 0);

    } else {
        donorItems.forEach(donor => mergeItemProperties(equippedItem, donor));
        updateSelectedItemSummary(slot);
        update();
    }

    return equippedItem;
}

function matchSynthStatsFromAPIStrings(apiStatStrings, synthProperties, stats) {
	if (!Array.isArray(apiStatStrings) || !Array.isArray(synthProperties)) return;

	apiStatStrings.forEach(apiText => {
		apiText = apiText.trim();
//		console.log(`🔍 Matching API stat: "${apiText}"`);

		let matchedKey = null;
		let matchedValue = null;

		// Loop through all editable stats
		for (const [statKey, statData] of Object.entries(stats)) {
			if (statData.editable !== 1) continue;

			// Build regex pattern from the stat's format, e.g. ["+", "% Enhanced Damage"]
			const patternStr = statData.format
				.map(piece => piece.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // escape regex chars
				.join(".*?"); // allow anything (like numbers) in between
			const pattern = new RegExp(`^${patternStr}$`, "i");

			if (pattern.test(apiText)) {
				// Try to extract the number value from the string
				const numMatch = apiText.match(/[-+]?\d+(\.\d+)?/);
				const value = numMatch ? parseFloat(numMatch[0]) : null;
				if (value !== null) {
					matchedKey = statKey;
					matchedValue = value;
					break;
				}
			}
		}

		if (!matchedKey) {
			console.warn(`❌ No matching stat key for "${apiText}"`);
			return;
		}
		console.log("🔍 Searching synthProperties for:", matchedKey, matchedValue);
		//console.table(synthProperties);

		// Now match with synthProperties using resolved key and value
		const match = synthProperties.find(
			p => p.key === matchedKey && Number(p.value) === Number(matchedValue)
		);
		if (match) {
			const checkbox = document.querySelector(
				`input[type="checkbox"][data-key="${match.key}"][data-value="${match.value}"]`
			);
			if (checkbox && !checkbox.checked) {
				checkbox.checked = true;
				checkbox.dispatchEvent(new Event("change"));
				console.log(`✅ Auto-checked: ${match.key}: ${match.value}`);
			}
		} else {
			console.warn(`❌ No synth property matched for resolved stat "${matchedKey}: ${matchedValue}"`);
		}
	});
}

function matchSynthStatsFromAPI(apiPropertyList, synthProperties) {
	if (!Array.isArray(apiPropertyList) || !Array.isArray(synthProperties)) return;

	apiPropertyList.forEach(apiProp => {
		const match = synthProperties.find(({ key, value }) => {
			const [apiKey, apiRawValue] = apiProp.split(":").map(s => s.trim());
			const apiValue = isNaN(apiRawValue) ? apiRawValue : parseFloat(apiRawValue);
			return apiKey === key && apiValue === value;
		});

		if (match) {
			const checkbox = document.querySelector(
				`input[type="checkbox"][data-key="${match.key}"][data-value="${match.value}"]`
			);
			if (checkbox && !checkbox.checked) {
				checkbox.checked = true;
				checkbox.dispatchEvent(new Event("change"));
				console.log(`✅ Auto-checked: ${match.key}: ${match.value}`);
			}
		} else {
			console.warn(`❌ No matching synth checkbox found for: "${apiProp}"`);
		}
	});
}

function gatherSynthPropertiesFromMultiple(items) {
    const result = [];

    items.forEach(item => {
        const source = item.Title || item.name || "Unknown";

        // ✅ If PropertyList doesn't exist, build it from raw properties
        let propList = item.PropertyList;
        if (!propList || propList.length === 0) {
            propList = Object.entries(item)
                .filter(([key]) =>
                    !["name", "req_level", "type", "base", "img", "twoHanded", "ctc", "cskill", "Worn", "SynthesisedFrom", "Title", "PropertyList", "tier", "max_sockets", "baseSpeed", "light_radius", "base_damage_min", "base_damage_max", "original_tier", "pod_changes", "req_strength", "req_dexterity", "iasindex"].includes(key)
                )
                .map(([key, value]) => `${key}: ${value}`);
        }

        propList.forEach(propString => {
            const [key, value] = propString.split(":").map(s => s.trim());
            result.push({ key, value, source });
        });
    });

    return result;
}




function findDonorItem(name) {
    for (const slot in equipment) {
        const item = equipment[slot].find(i => i.name === name);
        if (item) return item;
    }
    return null; // Return `null` if the donor item isn't found
}




function mergeItemProperties(baseItem, donor) {
    if (!donor) {
        console.warn(`Donor item is missing or undefined.`);
        return;
    }

    if (!baseItem.PropertyList) baseItem.PropertyList = [];

    if (!donor.PropertyList) {
        console.warn(`Donor item "${donor.name}" has no PropertyList—building dynamically.`);
        donor.PropertyList = Object.entries(donor)
            .filter(([key]) => !["name", "req_level", "type", "base", "img", "twoHanded", "ctc", "cskill"].includes(key))
            .map(([key, value]) => `${key}: ${value}`);
    }

    donor.PropertyList.forEach(propString => {
        const [key, value] = propString.split(": ").map(str => str.trim());
        const numericValue = parseFloat(value);

        // Apply to baseItem
        if (!baseItem[key]) baseItem[key] = 0;
        if (!isNaN(numericValue)) {
            baseItem[key] += numericValue;
        } else {
            baseItem[key] = value;
        }

        // Apply to character (if relevant)
        if (!character[key]) character[key] = 0;
        if (!isNaN(numericValue)) {
            character[key] += numericValue;
        }

        // Avoid duplicates in PropertyList
        if (!baseItem.PropertyList.includes(propString) && !key.includes("PropertyList")) {
            baseItem.PropertyList.push(propString);
            console.log(`Added stat: ${key}: ${value} to ${baseItem.Title}`);
        }
    });

    console.log("Final Synthesized Item:", JSON.stringify(baseItem, null, 2));
    updateSelectedItemSummary(baseItem.Worn);
    update();
}

////////////////////////////////////////////////////////
// start listing potential properties for synth items

const validEquipmentProperties = new Set();

// ✅ Extract valid properties from all items inside nested lists (`weapon`, `armor`, etc.)
Object.entries(equipment).forEach(([category, itemList]) => {
    itemList.forEach(item => {
        Object.keys(item).forEach(prop => validEquipmentProperties.add(prop));
    });
});

function gatherSynthProperties(baseItem, donorItems) {
    const properties = []; // ✅ Store all occurrences (including duplicates)

    const addProperties = (item, source) => {
        Object.entries(item).forEach(([key, value]) => {
            properties.push({ key, value, source }); // ✅ Keep ALL properties, ensuring they remain in the equipped item
        });
    };

    addProperties(baseItem, "Base Item");
    donorItems.forEach(donor => addProperties(donor, `Donor: ${donor.name}`));

    return properties; // ✅ This ensures properties exist for merging and deletion later
}

function filterPropertiesForUI(properties) {
    const equipmentItems = Object.values(equipment).flat(); // ✅ Flatten all categories
    const equipmentProperties = new Set(equipmentItems.flatMap(item => Object.keys(item))); // ✅ Extract valid names

    const excludedPrefixes = ["img", "base", "twoHanded", "name", "req_", "type"];

    return properties.filter(prop => {
        return equipmentProperties.has(prop.key) && !excludedPrefixes.some(prefix => prop.key.startsWith(prefix));
    });
}


function shouldIncludeProperty(key) {
    const excludedKeys = ["name", "type", "base", "img", "req_level"];
    return !excludedKeys.includes(key);
}

function generateSynthPropertyUI(properties, slot = "weapon") {
    const containerId = slot === "offhand" ? "offhandsynthPropertyContainer" : "synthPropertyContainer";
    const container = document.getElementById(containerId);

    if (!container || !properties || properties.length === 0) {
        if (container) container.style.display = "none";
        return;
    }

    container.style.display = "block";
    container.innerHTML = `<strong>Potential Synth Properties (${slot}):</strong>`;

    const equippedItem = equipped[slot];

    properties.forEach(({ key, value, source }) => {
        const checkboxId = `${slot}-${key}-${source.replace(/\s+/g, '_')}`;
        const div = document.createElement("div");

        div.innerHTML = `
            <label>
                <input type="checkbox" id="${checkboxId}" data-key="${key}" data-value="${value}">
                ${key}: ${value} <small>(${source})</small>
            </label>
        `;

        const checkbox = div.querySelector("input");
        checkbox.addEventListener("change", (e) => {
            const statKey = e.target.dataset.key;
            const rawValue = e.target.dataset.value;
            const value = isNaN(rawValue) ? rawValue : parseFloat(rawValue);

            if (e.target.checked) {
                equippedItem[statKey] = value;
                character[statKey] = (character[statKey] || 0) + (isNaN(value) ? 0 : value);
            } else {
                if (!isNaN(value)) {
                    character[statKey] -= value;
                }
                delete equippedItem[statKey];
            }

            // Update PropertyList without duplication
            equippedItem.PropertyList = equippedItem.PropertyList || [];
            const propString = `${statKey}: ${value}`;
            if (e.target.checked) {
                if (!equippedItem.PropertyList.includes(propString)) {
                    equippedItem.PropertyList.push(propString);
                }
            } else {
                equippedItem.PropertyList = equippedItem.PropertyList.filter(p => p !== propString);
            }

            updateSelectedItemSummary(equippedItem.Worn);
            update();
        });

        container.appendChild(div);
    });
}

function parseAddsDamageStat(text) {
    const regex = /Adds\s+(\d+)\s*(?:–|to|-)\s*(\d+)\s*(Cold|Fire|Lightning|Magic|Poison)?\s*Damage/i;
    const match = text.match(regex);
    if (!match) return null;

    const min = parseInt(match[1], 10);
    const max = parseInt(match[2], 10);
    const element = match[3] ? match[3].toLowerCase() : null;

    let keyPrefix;
    switch (element) {
        case "cold": keyPrefix = "cDamage"; break;
        case "fire": keyPrefix = "fDamage"; break;
        case "lightning": keyPrefix = "lDamage"; break;
        case "magic": keyPrefix = "mDamage"; break;
        case "poison": keyPrefix = "pDamage"; break;
        default: keyPrefix = "damage"; // physical
    }

    return {
        keys: [`${keyPrefix}_min`, `${keyPrefix}_max`],
        values: [min, max],
        label: `${element ? element.charAt(0).toUpperCase() + element.slice(1) + " " : ""}Damage`,
    };
}

const parsed = parseAddsDamageStat(propertyText);
if (parsed) {
    parsed.keys.forEach((key, idx) => {
        const value = parsed.values[idx];

        const match = synthProperties.find(
            prop => prop.key === key && Number(prop.value) === value
        );

        if (match) {
            console.log(`✅ Matched adds-damage property: "${key}: ${value}" from "${propertyText}"`);
            const checkbox = document.querySelector(`input[type="checkbox"][data-key="${key}"][data-value="${value}"]`);
            if (checkbox && !checkbox.checked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event("change"));
            }
        } else {
            console.warn(`❌ No synth match found for "${key}: ${value}"`);
        }
    });
}












function applyItemStatToCharacter(property) {
    console.log(`Applying property: ${property}`);
    
    // Check if the property is numerical
    const numericMatch = property.match(/(\d+)/);
    if (numericMatch) {
        const value = parseInt(numericMatch[1], 10);

        // Determine property type (Strength, Energy, Resistances, etc.)
        const propertyKey = determinePropertyKey(property);
        
        if (!character[propertyKey]) {
            character[propertyKey] = 0; // Initialize if missing
        }
        character[propertyKey] += value;
    }
}

function determinePropertyKey(property) {
    if (property.includes("Strength")) return "strength";
    if (property.includes("Dexterity")) return "dexterity";
    if (property.includes("Vitality")) return "vitality";
    if (property.includes("Energy")) return "energy";
    if (property.includes("Resist")) return "resistances";
    
    return "misc"; // Catch-all for unknown properties
}




//	window.open(builderurl);
//	window.location.href = builderurl ;
document.getElementById('importname').value = ""
}

function parseProperties(item) {
    const customStats = [];
    
    if (!item.PropertyList || !Array.isArray(item.PropertyList)) {
        console.warn("Item has no valid PropertyList.");
        return customStats; // Return an empty array if there's no PropertyList
    }

    item.PropertyList.forEach((property) => {
        // Iterate through the `stats` object to find a match
        for (const statKey in stats) {
            const stat = stats[statKey];

            // Handle cases where `index` or `format` are undefined or null
            if (!stat.index || !stat.format) {
                if (property.includes(statKey)) {
                    // For boolean stats or simple matches
                    customStats.push(`${statKey} is enabled`);
                    break;
                }
                continue;
            }

            // Handle formatted stats
            const [prefix, suffix] = stat.format;
            if (property.startsWith(prefix) && property.endsWith(suffix)) {
                // Extract the value between the prefix and suffix
                const value = property.slice(prefix.length, property.length - suffix.length).trim();
                customStats.push(`${item.Title} ${item.Worn} gives ${prefix}${value}${suffix}`);
                break;
            }
        }
    });

    return customStats;
}


document.addEventListener("DOMContentLoaded", () => {
	const statSelect = document.getElementById("stat-select");
	const numberInput = document.getElementById("value-select");
	const generateButton = document.getElementById("generate-item");
	const outputDiv = document.getElementById("item-output");
    const placeSelect = document.getElementById("place-select");
	
	// Populate dropdown
	Object.keys(custom_stats).forEach(statKey => {
		const stat = custom_stats[statKey];
		const displayText = stat.format.join("");
		const option = document.createElement("option");
		option.value = statKey;
		option.textContent = displayText;
//		statSelect.appendChild(option);
	});

	// Handle button click
	generateButton.addEventListener("click", () => {
		const selectedStat = statSelect.value;
		const selectedNumber = parseInt(numberInput.value, 10) || 0;
        const selectedPlace = placeSelect.value;

        if (!selectedStat || isNaN(selectedNumber) || !selectedPlace) {
			outputDiv.textContent = "Please select a valid type, stat and value.";
			return;
		}

        // Generate item name based on place
        const itemName = `Custom ${selectedPlace}`;

        // Create the item object
        const customItem = {
            name: itemName,
            req_level: 100,
            [selectedStat]: selectedNumber,
        };

		console.log("Generated Item:", customItem);
		outputDiv.textContent = `Generated Item: ${JSON.stringify(customItem, null, 2)}`;
	});

});

// Set on-weapon enhanced damage
function applyCustomED(slot) {
	const input = document.getElementById('ed_' + slot);
	const customDelta = parseInt(input.value, 10); // Can be positive or negative

	const item = equipped[slot];
	if (!item) {
		character.e_damage = 0;
		return;
	}

	// If there's no original e_damage, default it to 0
	if (typeof item.baseED !== 'number') {
		item.baseED = typeof item.e_damage === 'number' ? item.e_damage : 0;
	}

	// Always reset to baseED before applying adjustment
	item.e_damage = item.baseED;

	if (!isNaN(customDelta)) {
		item.e_damage = customDelta;
		character.e_damage = customDelta;
	} else {
		character.e_damage = 0;
		item.e_damage = item.baseED; // Keep original
	}

//	updateCharacterStats?.();
	update?.();
}

function populateWeaponDropdown() {
	const selector = document.getElementById('weaponSelector');
	for (const [key, item] of Object.entries(bases)) {
		if (item.group === "weapon") {
			const option = document.createElement("option");
			option.value = key;
			option.textContent = key.replace(/_/g, ' '); // Optional: prettier name
			selector.appendChild(option);
		}
	}
}

function selectWeapon() {
	const selected = document.getElementById('weaponSelector').value;
	if (!selected || !bases[selected]) return;

	const base = bases[selected];

	// Create a basic equipped weapon item from the base definition
	const newWeapon = {
		name: selected,
		e_damage: 0,
		baseED: 0,
		base_damage_min: base.base_damage_min || 0,
		base_damage_max: base.base_damage_max || 0,
		baseSpeed: base.baseSpeed || 0,
		range: base.range || 1,
		// You can copy over more fields if needed
	};

	equipped.weapon = newWeapon;

//	updateCharacterStats?.();
	update?.();
}

// Stats found in custom stats dropdown
// needs property editable:1 to show in the list
function populateStatDropdown(searchTerm = '') {
    const dropdown = document.getElementById('statDropdown');
    dropdown.innerHTML = ''; // Clear existing options

    const formattedStats = Object.entries(stats)
        .filter(([_, value]) => value && Array.isArray(value.format) && value.editable === 1)
        .map(([key, value]) => {
            const text = value.friendly?.[0] || value.format.join(' ');
            return { key, text };
        })
        .filter(stat => stat.text.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sort alphabetically
    formattedStats.sort((a, b) => a.text.localeCompare(b.text));

    // Add options to the dropdown
    for (const stat of formattedStats) {
        const option = document.createElement('option');
        option.value = stat.key;
        option.textContent = stat.text;
        dropdown.appendChild(option);
    }
}


// Search for properties
function filterStatDropdown() {
    const searchTerm = document.getElementById('statSearch').value;
    populateStatDropdown(searchTerm);
}
// Initial population when page loads
populateStatDropdown();


// Add stats from custom list
function addCustomStat() {

		const statKey = document.getElementById('statDropdown').value;
//		const value = parseInt(document.getElementById('statValue').value, 10);
		const value = parseFloat(document.getElementById('statValue').value);
		const selectedSlot = document.getElementById("slotSelect").value;
		console.log("addCustomStat called");
		console.log("equipped:", equipped);
	console.log("selectedSlot:", selectedSlot);
		
		if (isNaN(value)) return;
	
		// Auto-equip a named custom item if slot is empty
		if (!equipped[selectedSlot] || equipped[selectedSlot].name === "none") {
			const customNames = {
				weapon: "Custom Weapon",
				helm: "Custom Helm",
				armor: "Custom Armor",
				offhand: "Custom Offhand",
				gloves: "Custom Gloves",
				boots: "Custom Boots",
				belt: "Custom Belt",
				ring1: "Custom Ring",
				ring2: "Custom Ring",
				amulet: "Custom Amulet"
			};
	
			const itemName = customNames[selectedSlot];
			const slotItems = equipment[selectedSlot];
			console.log("Trying to equip from slot:", selectedSlot);
			console.log("Looking for item named:", itemName);
			console.log("Items available in slot:", equipment[selectedSlot].map(i => i.name));	
			if (itemName && Array.isArray(slotItems)) {
				console.log("Trying to equip from slot:", selectedSlot);
				console.log("Looking for item named:", itemName);
				console.log("Items available in slot:", equipment[selectedSlot].map(i => i.name));
				const found = slotItems.find(item => item.name.trim().toLowerCase() === itemName.toLowerCase());

				if (found) {
					equipped[selectedSlot] = JSON.parse(JSON.stringify(found));
					equip(selectedSlot,itemName);
					updateSelectedItemSummary(selectedSlot);
				} else {
					alert(`Could not find "${itemName}" in equipment[${selectedSlot}]`);
					return;
				}
			}
		}
	
		const item = equipped[selectedSlot];
		if (!item) return;
	
		if (!item[statKey]) item[statKey] = 0;
		item[statKey] += value;
	
		if (!character[statKey]) character[statKey] = 0;
		character[statKey] += value;
	
		update();
		updateSelectedItemSummary(selectedSlot);
	}
	
function larzuk() {
	const statKey = "sockets";
	const value = 1;
	const selectedSlot = document.getElementById("slotSelect").value;
	console.log("larzuk called");
	console.log("equipped:", equipped);
	console.log("selectedSlot:", selectedSlot);

	// Only allow specific slots
	const allowedSlots = ["weapon", "offhand", "helm", "armor"];
	const rejectionMessages = {
		amulet: "Surely you jest, amulets don't get sockets!",
		ring1: "Ha! Imagine that, a world where rings have sockets!",
		ring2: "Sockets in rings? Not on my watch!",
		gloves: "The legend of old socket hands; No thank you.",
		boots: "We will not help you put holes in your shoes",
		belt: "This isn't a Batman utility belt",
	};

	if (!allowedSlots.includes(selectedSlot)) {
		const message = rejectionMessages[selectedSlot] || "You can only add sockets to weapons, shields, helms, or armor.";
		showPopup(message);
		return;
	}

	if (isNaN(value)) return;

	// Auto-equip a named custom item if slot is empty
	if (!equipped[selectedSlot] || equipped[selectedSlot].name === "none") {
		const customNames = {
			weapon: "Custom Weapon",
			helm: "Custom Helm",
			armor: "Custom Armor",
			offhand: "Custom Offhand"
		};

		const itemName = customNames[selectedSlot];
		const slotItems = equipment[selectedSlot];

		if (itemName && Array.isArray(slotItems)) {
			const found = slotItems.find(item => item.name.trim().toLowerCase() === itemName.toLowerCase());

			if (found) {
				equipped[selectedSlot] = JSON.parse(JSON.stringify(found));
				equip(selectedSlot, itemName);
				updateSelectedItemSummary(selectedSlot);
			} else {
				alert(`Could not find "${itemName}" in equipment[${selectedSlot}]`);
				return;
			}
		}
	}

	const item = equipped[selectedSlot];
	if (!item) return;

	if (!item[statKey]) item[statKey] = 0;
	item[statKey] += value;

	if (!character[statKey]) character[statKey] = 0;
	character[statKey] += value;

	update();
	updateSelectedItemSummary(selectedSlot);
}


// Update the summary box
function updateSelectedItemSummary() {
	const selectedSlot = document.getElementById("slotSelect").value;
	const item = equipped[selectedSlot];
	const container = document.getElementById("itemSummaryContent");

	if (!item) {
		container.textContent = "(no item equipped)";
		return;
	}

	container.innerHTML = ''; // Clear existing content

	for (const key in item) {
		if (item.hasOwnProperty(key) && typeof item[key] !== 'object') {
			const line = document.createElement('div');
			line.style.display = 'flex';
			line.style.justifyContent = 'space-between';
			line.style.alignItems = 'center';

			const text = document.createElement('span');
			text.textContent = `${key}: ${item[key]}`;

			const removeButton = document.createElement('button');
			removeButton.textContent = '✖';
			removeButton.style.marginLeft = '10px';
			removeButton.style.background = 'transparent';
			removeButton.style.color = '#f66';
			removeButton.style.border = 'none';
			removeButton.style.cursor = 'pointer';
			removeButton.title = `Remove ${key}`;
			removeButton.onclick = function () {
				character[key] -= item[key];
				delete item[key];
				updateSelectedItemSummary();
				update?.(); // Optional: update character stats
			};

			line.appendChild(text);
			line.appendChild(removeButton);
			container.appendChild(line);
//		console.log("Item passed into summary:", JSON.stringify(item, null, 2));
		}

	}
}

// Remove all stats on an item, unused?
function resetAllStatsOnItem() {
	const selectedSlot = document.getElementById('slotSelect').value;
	const item = equipped[selectedSlot];
	if (!item) return;

	// Remove all numeric properties that aren't standard item properties
	for (const key in item) {
		if (item.hasOwnProperty(key)) {
				delete item[key];
			
		}
	}

	updateSelectedItemSummary();
	update(); // Optional: trigger stat recalculation
}

// Export to csv
// User requested capability for offline play
function exportEquippedToCSV() {
	let rows = [["slot", "name", "base", "stat", "value"]];

	for (const [slot, item] of Object.entries(equipped)) {
		if (!item || item.name === "none") continue;

		for (const [key, value] of Object.entries(item)) {
			if (["name", "base"].includes(key)) continue;
			if (typeof value !== "number" && typeof value !== "string") continue;

			rows.push([slot, item.name || "", item.base || "", key, value]);
		}

		// Ensure we still write the item itself even if it has no stats
		if (!Object.keys(item).some(k => typeof item[k] === "number" || typeof item[k] === "string")) {
			rows.push([slot, item.name || "", item.base || "", "", ""]);
		}
	}

	const csvContent = rows.map(r => r.join(",")).join("\n");
	const blob = new Blob([csvContent], { type: "text/csv" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = "equipped_items.csv";
	link.click();
}

// Import from csv
// User requested capability for offline play
function importFromCSV(csvText) {
	const lines = csvText.trim().split('\n');
	if (lines.length < 2) return;

	const header = lines[0].split(',').map(h => h.trim());
	const rows = lines.slice(1).map(line => {
		const values = line.split(',').map(v => v.trim());
		const row = {};
		header.forEach((h, i) => row[h] = values[i]);
		return row;
	});

	// Group rows by slot+name for batching
	const grouped = {};
	for (const row of rows) {
		const key = `${row.slot}|${row.name}`;
		if (!grouped[key]) grouped[key] = { slot: row.slot, name: row.name, stats: [] };
		grouped[key].stats.push({ stat: row.stat, value: row.value });
	}

	for (const key in grouped) {
		const { slot, name, stats } = grouped[key];

		// Try to equip the item
		const success = equip(slot, name);
		if (!success) {
			console.warn(`Could not equip "${name}" in slot "${slot}"`);
//			continue;
		}

		const item = equipped[slot];
		if (!item) continue;

		// Strip all properties except core identifiers
		for (const prop in item) {
			if (!["name", "base", "rarity", "img"].includes(prop)) {
//				console.log(item[prop])
				character[prop] -= item[prop]
				delete item[prop];
				update?.(); // Optional: update character stats

			}
		}

		for (const { stat, value } of stats) {
			const parsed = parseFloat(value);
			item[stat] = isNaN(parsed) ? value : parsed;
		
			// Also apply numeric stat to character totals (like addCustomStat does)
			if (!isNaN(parsed)) {
				if (!character[stat]) character[stat] = 0;
				character[stat] += parsed;
			}
		}
		
	}

	update(); // Refresh character view
}


document.addEventListener("DOMContentLoaded", function () {
	document.getElementById('importCSV').addEventListener('change', function (e) {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = function (event) {
			const csvText = event.target.result;
			importFromCSV(csvText);
		};
		reader.readAsText(file);
	});
});

// Sample items array (use your full data in practice)
const synthableItems = equipment.weapon
  .filter(item =>
    item.req_level &&
    !item.rarity &&
    !item.synth
  )
  .sort((a, b) => a.name.localeCompare(b.name));
  

  document.addEventListener('DOMContentLoaded', () => {
	function populateDropdowns() {
	console.log("Populating dropdowns with:", synthableItems);
	const dropdownIds = ['baseItem', 'donor1', 'donor2', 'donor3', 'donor4'];
	for (const id of dropdownIds) {
	  const select = document.getElementById(id);
	  if (!select) {
		console.warn(`Dropdown with id "${id}" not found.`);
		continue;
	  }
	  select.innerHTML = '<option value="">-- Select Item --</option>';
	  for (const item of synthableItems) {
		const option = document.createElement('option');
		option.value = item.name;
		option.textContent = item.name;
		select.appendChild(option);
	  }
	}
  }
  populateDropdowns();
})

function synthesize() {
  const baseName = document.getElementById('baseItem').value;
  const donorNames = [
    document.getElementById('donor1').value,
    document.getElementById('donor2').value,
    document.getElementById('donor3').value,
    document.getElementById('donor4').value,
  ].filter(name => name); // Remove blanks

  const base = JSON.parse(JSON.stringify(synthableItems.find(i => i.name === baseName)));
  if (!base) {
    alert("Please select a base item.");
    return;
  }



//  base.synth = true;
  base.name = base.name;

//  document.getElementById('synthResult').textContent = JSON.stringify(base, null, 2);
//  equipSynthesizedItem()
const slot = "weapon"; // or get from baseItem.type-to-slot map
const baseItemName = base.name;
const finalStats = []; // array of { stat: "e_damage", value: 123 }, etc.

for (const [key, value] of Object.entries(base)) {
  if (
    ["name", "base", "rarity", "img", "type", "req_level", "synth"].includes(key) ||
    key.startsWith("req_")
  ) continue;

  finalStats.push({ stat: key, value });
}
// Make sure the synthesized item is in equipment[slot] so `equip()` can find it
if (!equipment[slot].some(i => i.name === base.name)) {
	equipment[slot].push(base);
  }
  
// After combining all donor item stats into finalStats:
equipSynthesizedItem(slot, baseItemName, finalStats);

}

function equipSynthesizedItem(baseItem) {
    const slot = baseItem.Worn === "weapon1" ? "weapon" : baseItem.Worn === "weapon2" ? "offhand" : baseItem.Worn;
    const baseItemName = baseItem.Title;
    const finalStats = [];

    for (const [key, value] of Object.entries(baseItem)) {
        if (["Title", "Quality", "QualityCode", "Tag", "TextTag", "Worn", "Ethereal", "Enhanced"].includes(key) || key.startsWith("req_")) continue;

        finalStats.push({ stat: key, value });
    }

    equip(slot, baseItemName);

    const item = equipped[slot];
    if (!item) return;

    // Strip non-core properties before applying new stats
    for (const prop in item) {
        if (!["name", "base", "rarity", "img", "base_damage_min", "base_damage_max"].includes(prop)) {
            if (!isNaN(item[prop]) && character[prop]) {
                character[prop] -= item[prop];
            }
            delete item[prop];
        }
    }

    // Apply merged properties
    for (const { stat, value } of finalStats) {
        const parsed = parseFloat(value);
        item[stat] = isNaN(parsed) ? value : parsed;

        if (!isNaN(parsed)) {
            if (!character[stat]) character[stat] = 0;
            character[stat] += parsed;
        }
    }
    updateSelectedItemSummary();
    update();
}


function createQuicklink() {
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(`Long URL: ${currentUrl}`);
    const issueTitle = encodeURIComponent("Request quicklink for long URL");
    const newIssueUrl = `https://github.com/qordwasalreadytaken/path-of-diablo-planner/issues/new?labels=shortlink&title=${issueTitle}&body=${encodedUrl}`;

    // Copy to clipboard
    navigator.clipboard.writeText(currentUrl).then(() => {
        console.log("Copied long URL to clipboard.");
    }).catch(err => {
        console.error("Failed to copy URL to clipboard:", err);
    });

    // Open GitHub issue form
    window.open(newIssueUrl, "_blank");
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str) {
  // Add padding
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/*
document.getElementById('copyShortLink').addEventListener('click', () => {
  const urlParams = window.location.search.substring(1); // e.g. "foo=1&bar=2"
  // Compress
  const compressed = pako.deflate(new TextEncoder().encode(urlParams));
  // Encode to base64url
  const encoded = base64UrlEncode(compressed);

  const shortUrl = `${window.location.origin}${window.location.pathname}?s=${encoded}`;
  
  // Copy to clipboard and alert
  navigator.clipboard.writeText(shortUrl).then(() => {
    alert('Short URL copied to clipboard!');
  }).catch(() => {
    alert('Failed to copy short URL');
  });
}); */

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('createLink');
  if (!button) {
    console.warn('createLink button not found');
    return;
  }

  button.addEventListener('click', async () => {
    const currentUrl = window.location.href;
    const cacheKey = `short:${currentUrl}`;
    const cachedShort = localStorage.getItem(cacheKey);

    if (cachedShort) {
      await navigator.clipboard.writeText(cachedShort);
      showPopup(`Reused existing shortlink:\n${cachedShort}`);
      return;
    }

    const now = Math.floor(Date.now() / 1000);
//    const expiration = now + 300; // 5 minutes for quick expiration testing
//	const expiration = now + 604800; //one week
//	const expiration = now + 1209600; // 2 weeks
	const expiration = now + 2419200; // 4 weeks
//	const expiration = now + 60 * 60 * 24 * 365; // 1 year

    try {
//      const res = await fetch('https://sink.actuallyiamqord.workers.dev/api/proxy-create-link', {
      const res = await fetch('https://b.pathofdiablo.com/api/proxy-create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: currentUrl, expiration }),
      });

    if (!res.ok) {
      // Friendly fallback for Cloudflare quota exhaustion
      if (res.status === 1105 || res.status === 503) {
        showPopup(`⚠️ The shortener is currently offline due to rate limiting. Please try again later.`);
      } else {
        const errText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errText}`);
      }
      return;
    }
      const data = await res.json();
      const shortLink = data.shortLink;

      localStorage.setItem(cacheKey, shortLink);
      await navigator.clipboard.writeText(shortLink);
      showPopup(`Shortlink copied:\n${shortLink}`);
    } catch (error) {
      showPopup(`❌ Error:\n${error.message}`);
      console.error(error);
    }
  });
});

function showPopup(message, duration = 3000) {
  const popup = document.getElementById('popup');
  if (!popup) {
    alert(message); // fallback
    return;
  }

  popup.textContent = message;
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, duration);
}

function showPopup(message, duration = 3000) {
  const popup = document.getElementById('popup');
  if (!popup) {
    alert(message); // fallback
    return;
  }

  popup.textContent = message;
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, duration);
}

function switchClass(newClass) {
  const url = new URL(window.location.href);
  url.searchParams.set("class", newClass);
  window.location.href = url.toString();
}

function copyToClipboard(inputElement) {
navigator.clipboard.writeText(inputElement.value).then(() => {
	// Optional: visual feedback
	inputElement.style.backgroundColor = "#333"; // or any effect
	inputElement.title = "Copied!";
	showPopup(`Import link copied, make sure to change character name before sharing`);
}).catch(err => {
	console.error('Failed to copy: ', err);
});
}

  
// Trying to fix aura pop up to display correct damage without double dipping final damage values
function patchAuraDisplayDamage(effects, id) {
  const types = ["fDamage", "cDamage", "lDamage", "pDamage", "mDamage"];
  for (const type of types) {
    const minKey = `${type}_min`;
    const maxKey = `${type}_max`;
    const minDisplay = `${minKey}_display`;
    const maxDisplay = `${maxKey}_display`;

    if (effects[id][minDisplay] !== undefined) {
      effects[id][`_original_${minKey}`] = effects[id][minKey];
      effects[id][minKey] = effects[id][minDisplay];
    }
    if (effects[id][maxDisplay] !== undefined) {
      effects[id][`_original_${maxKey}`] = effects[id][maxKey];
      effects[id][maxKey] = effects[id][maxDisplay];
    }
  }
}

function restoreAuraDisplayDamage(effects, id) {
  const types = ["fDamage", "cDamage", "lDamage", "pDamage", "mDamage"];
  for (const type of types) {
    for (const suffix of ["min", "max"]) {
      const key = `${type}_${suffix}`;
      const orig = `_original_${key}`;
      if (effects[id][orig] !== undefined) {
        effects[id][key] = effects[id][orig];
        delete effects[id][orig];
      }
    }
  }
}





// Notes for Organization Overhaul:
//   TODO...
//   variable names for item classification 
//		slot - equipment slot for item  ("helm","armor","boots","gloves","belt","amulet","ring1","ring2","weapon","offhand")
//		group - similar to slot, but generalized for the item  ("helm","armor","boots","gloves","belt","amulet","ring","weapon","offhand","charm","socketable")
//		subgroup - in between group/type, maybe? might allow "helm","shield", and combo weapons ("throwing weapon","amazon_weapon"...) to be used via the same variable? or would a true/false system (so multiple variables can be checked) be more convenient?
//		type - more specific to the item  ("armor","boots","gloves","belt","amulet","ring","charm" are the same, but "helm","weapon","offhand","socketable" have more variety - "helm","circlet","barbarian helm","druid helm",    "axe","mace","sword","dagger","throwing weapon","javelin","spear","polearm","bow","crossbow","staff","wand","scepter","claw","orb","amazon weapon",    "shield","paladin shield","necromancer shield","quiver",    "jewel","rune","gem","misc")
//		subtype - "club","mace","hammer"?
//   variable names for item affixes
//		item affix variables (from item_affixes.js) can be converted to whatever is needed 1:1 (so variables being worked with may be more human-readable)
//		item affix codes (used in filters) cannot all be converted 1:1 from other variables
//			sometimes multiple codes refer to the same variable
//			sometimes codes refer to calculated values
//		min/max damage variables
//			damage over time
//				poison damage - values used for calculation (from item_affixes.js or elsewhere) are different than tooltip displayed values
//				...how to calculate from poison 'bitrate'?
//				burning damage - should this have its own variables?
//			variable names (e.g. fDamage_min, fDamage_max, fDamage)
//				replace fDamage (percent bonus) with bonus_fDamage
//				...same for other 3 elements, magic, & physical
//		e_def/defense_bonus - distinction needed?
//		e_damage/damage_bonus - distinction needed?
//   data organization for item affixes
//		available affixes
//			when base item is updated (ilvl, group, type, base, rarity, name), available affixes may change (any affix that is already selected should remain selected if possible)
//			...add variables to 'data' to store selected categories/values so they can be easily compared to list of newly available affix categories 
//			...maybe info can be shown when considering things in the opposite direction? for example, show the ilvl range for the currently available affixes?
//   user interface
//		is there a way to indicate if/when an item's filter display would change?  (so the user doesn't need to test so many combinations)
//		...maybe just using non-item differences like CLVL, DIFFICULTY, CHARSTAT15, etc.
//


// TODO: update PoD skills when more info becomes available (Assassin martial arts skills & Barbarian passives)
// TODO: Snapshotted skills don't apply correctly after loading the save file. The snapshot jumps to the last buff listed.
// ...For example, I snapshotted Energy Shield with a Memory staff, and then switched to Spirit weapon and Spirit shield. After saving and loading, Energy Shield wasn't snapshotted and the last buff was instead (in my case, Prayer from my merc). When I removed my merc and repeated the process, Warmth was the last buff listed and snapshotted.
// ...I couldn't find a way to remove the snapshot. I tried combinations of left and right clicking with ctrl and shift.
