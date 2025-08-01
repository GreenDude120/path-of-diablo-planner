
var character_sorceress = {class_name:"Sorceress", strength:10, dexterity:25, vitality:10, energy:35, life:40, mana:35, stamina:174, levelup_life:1.5, levelup_stamina:1, levelup_mana:2, ar_per_dexterity:5, life_per_vitality:2, stamina_per_vitality:1, mana_per_energy:2, starting_strength:10, starting_dexterity:25, starting_vitality:10, starting_energy:35, ar_const:-15, block_const:5, skill_layout:"./images/skill_trees/PoD/sorceress.png", mana_regen:1.66,
	weapon_frames:{dagger:16, sword:[17,21], axe:[17,15], mace:[17,15], thrown:[17,16], staff:15, polearm:15, scepter:17, wand:17, javelin:16, spear:22, bow:16, crossbow:19, orb:17},
	fcr_frames:13, fcr_bp:[0, 9, 20, 37, 63, 105, 200],
	fcr_frames_alt:19, fcr_bp_alt:[0, 7, 15, 23, 35, 52, 78, 117, 194],	// Lightning Surge & Chain Lightning
	fhr_frames:15, fhr_bp:[0, 5, 9, 14, 20, 30, 42, 60, 86, 142, 280],
	fbr_frames:9, fbr_bp:[0, 7, 15, 27, 48, 86, 200],
	
	// getSkillData - gets skill info from the skills data table
	//	skill: skill object for the skill in question
	//	lvl: level of the skill
	//	elem: which element of the skill to return
	// result: value of the skill element at the specified level
	// ---------------------------------
	getSkillData : function(skill, lvl, elem) {
		var sk = skills;
		var c = character;
		var result = skill.data.values[elem][lvl];
		
		if (skill.name == "Ice Bolt" && elem < 2) { 					result *= ((1 + (0.25*sk[1].level + 0.25*sk[2].level + 0.25*sk[4].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Frigerate" && elem < 4) { 					result *= ((1 + (0.20*sk[4].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Frost Nova" && elem < 2) { 					result *= ((1 + (0.16*sk[3].level + 0.16*sk[4].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Ice Blast" && elem < 2) { 					result *= ((1 + (0.12*sk[0].level + 0.12*sk[5].level + 0.12*sk[6].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Ice Blast" && elem == 2) { 					result *= (1 + (0.10*sk[5].level)) }
		if (skill.name == "Shiver Armor" && elem < 4 && elem > 1) { 	result *= ((1 + (0.18*sk[1].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Glacial Spike" && elem < 2) { 				result *= ((1 + (0.08*sk[0].level + 0.08*sk[3].level + 0.08*sk[7].level + 0.08*sk[9].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Glacial Spike" && elem == 2) { 				result *= (1 + (0.03*sk[6].level)) }
		if (skill.name == "Blizzard" && elem < 2) { 					result *= ((1 + (0.09*sk[3].level + 0.09*sk[5].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Freezing Pulse" && elem < 3 && elem > 0) { 	result *= ((1 + (0.05*sk[0].level + 0.05*sk[3].level + 0.05*sk[5].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Chilling Armor" && elem < 4 && elem > 1) { 	result *= ((1 + (0.18*sk[0].level)) * (1+c.cDamage/100)) }
		if (skill.name == "Frozen Orb" && elem < 2) { 					result *= ((1 + (0.02*sk[0].level)) * (1+c.cDamage/100)) }
		
		if (skill.name == "Charged Bolt" && elem < 3 && elem > 0) { 	result *= ((1 + (0.08*sk[15].level + 0.08*sk[16].level)) * (1+c.lDamage/100)) }
		if (skill.name == "Telekinesis" && elem < 2) { 					result *= ((1+c.lDamage/100)) }
		if (skill.name == "Nova" && elem < 2) { 						result *= ((1 + (0.03*sk[18].level)) * (1+c.lDamage/100)) }
		if (skill.name == "Lightning Surge" && elem < 2) { 				result *= ((1 + (0.05*sk[11].level + 0.05*sk[16].level)) * (1+c.lDamage/100)) }
		if (skill.name == "Chain Lightning" && elem < 3 && elem > 0) { 	result *= ((1 + (0.03*sk[11].level + 0.03*sk[15].level)) * (1+c.lDamage/100)) }
		if (skill.name == "Teleport" && elem == 0) { 					result = Math.max(0, (0.05*Math.floor((character.mana + character.level*character.mana_per_level + ((((character.energy + character.all_attributes)*(1+character.max_energy/100))-character.starting_energy)*character.mana_per_energy)) * (1 + character.max_mana/100)) - result)) }
		if (skill.name == "Discharge" && elem < 3 && elem > 0) { 		result *= ((1 + 0.03*sk[12].level + 0.03*sk[14].level + 0.01*Math.floor(((character.energy + character.all_attributes)*(1+character.max_energy/100))/2)) * (1+c.lDamage/100)) }
		if (skill.name == "Energy Shield" && elem == 0) { 				result = (4*sk[13].level + 6) }
		if (skill.name == "Thunder Storm" && elem == 0) { 				result = (2.75 - (0.12*sk[17].level)) }
		if (skill.name == "Thunder Storm" && elem < 4 && elem > 1) { 	result *= ((1 + (0.21*sk[13].level + 0.21*sk[15].level)) * (1+c.lDamage/100)) }
		
		if (skill.name == "Fire Bolt" && elem < 2) { 					result *= ((1 + (0.35*sk[26].level + 0.35*sk[27].level + 0.35*sk[29].level)) * (1+c.fDamage/100)) }
		if (skill.name == "Inferno" && elem < 2) {						result *= ((1 + 0.25*sk[23].level) * (1+c.fDamage/100)) }
		if (skill.name == "Blaze" && elem < 3 && elem > 0) { 			result *= ((1 + (0.08*sk[25].level + 0.03*sk[23].level)) * (1+c.fDamage/100)) }
		if (skill.name == "Immolate" && elem < 2) { 					result *= ((1 + (0.04*sk[23].level)) * (1+c.fDamage/100)) }
		if (skill.name == "Fire Ball" && elem < 2) { 					result *= ((1 + (0.06*sk[22].level + 0.06*sk[29].level)) * (1+c.fDamage/100)) }
		if (skill.name == "Fire Wall" && elem < 2) { 					result *= ((1 + (0.04*sk[23].level + 0.04*sk[24].level)) * (1+c.fDamage/100)) }
		if (skill.name == "Enflame" && elem < 4) { 						result *= ((1 + (0.12*sk[23].level)+  (0.12*sk[22].level)) * (1+c.fDamage/100)) }
//		if (skill.name == "Meteor" && elem < 2) { 						result *= ((1 + (0.06*sk[22].level + 0.06*sk[26].level)) * (1+c.fDamage/100)) * (1+c.physicalDamage/100)}	// physical damage multipled by fire bonus (25% of total fire damage as extra physical damage)
//		if (skill.name == "Meteor" && elem < 2) { 						result *= (1+c.physicalDamage/100)}	// physical damage multipled by fire bonus (25% of total fire damage as extra physical damage)
//		if (skill.name == "Meteor" && elem < 4 && elem > 1) { 			result *= ((1 + (0.06*sk[22].level + 0.06*sk[26].level)) * (1+c.fDamage/100)) }
//		if (skill.name == "Meteor" && elem < 6 && elem > 3) { 			result *= ((1 + (0.03*sk[24].level)) * (1+c.fDamage/100)) }
		if (skill.name == "Meteor" && elem < 2) { 			result *= ((1 + (0.06*sk[22].level + 0.06*sk[26].level)) * (1+c.fDamage/100)) }
		if (skill.name == "Meteor" && elem < 4 && elem > 1) { 			result *= ((1 + (0.03*sk[24].level)) * (1+c.fDamage/100)) }
		if (skill.name == "Hydra" && elem < 3 && elem > 0) { 			result *= ((1 + (0.01*sk[23].level + 0.02*sk[26].level)) * (1+c.fDamage/100)) }

//		if (skillName == "Dangoon Discharge Proc" && elem < 2) { 		result *= ((1 + 0.03*sk[12].level + 0.03*sk[14].level))} // + 0.01*Math.floor(((character.energy + character.all_attributes)*(1+character.max_energy/100))/2)) * (1+c.lDamage/100)) }

	return result
	},
	
	// getBuffData - gets a list of stats corresponding to a persisting buff
	//	effect: array element object for the buff
	// result: indexed array including stats affected and their values
	// ---------------------------------
	getBuffData : function(skill) {
		var id = skill.name.split(' ').join('_');
		var lvl = skill.level + skill.extra_levels;
		var result = {};
		
		if (skill.name == "Shiver Armor") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { if (effect_id != id && (effect_id.split("-")[0] == id || effect_id.split("-")[0] == "Chilling_Armor")) { disableEffect(effect_id) } } }
			result.defense_bonus = skill.data.values[1][lvl]; result.duration = skill.data.values[0][lvl];
		}
		if (skill.name == "Chilling Armor") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { if (effect_id != id && (effect_id.split("-")[0] == id || effect_id.split("-")[0] == "Shiver_Armor")) { disableEffect(effect_id) } } }
			result.defense_bonus = skill.data.values[1][lvl]; result.duration = skill.data.values[0][lvl];
		}
		if (skill.name == "Frigerate") {
			result.cDamage_min = skill.data.values[0][lvl] * (1 + (0.20*skills[4].level)) * (1+character.cDamage/100);
			result.cDamage_max = skill.data.values[1][lvl] * (1 + (0.20*skills[4].level)) * (1+character.cDamage/100);
			result.enemy_defense = skill.data.values[4][lvl]; result.radius = 16;
		}
		if (skill.name == "Enflame") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { if (effect_id != id && effect_id.split("-")[0] == id) { disableEffect(effect_id) } } }
			result.fDamage_min = skill.data.values[0][lvl] * (1 + (0.08*skills[23].level)) * (1+character.fDamage/100);
			result.fDamage_max = skill.data.values[1][lvl] * (1 + (0.08*skills[23].level)) * (1+character.fDamage/100);
			result.fDamage_min = skill.data.values[0][lvl] * (1 + (0.12*skills[22].level)) * (1+character.fDamage/100);
			result.fDamage_max = skill.data.values[1][lvl] * (1 + (0.12*skills[22].level)) * (1+character.fDamage/100);
			result.ar_bonus = skill.data.values[4][lvl]; result.radius = 16;
		}
		if (skill.name == "Blaze") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { if (effect_id != id && effect_id.split("-")[0] == id) { disableEffect(effect_id) } } }
			result.life_regen = 2; result.duration = skill.data.values[0][lvl];
		}
		if (skill.name == "Energy Shield") {
			result.absorb_es_deplete = (6 + 4*skills[13].level); 
			result.absorb_es_redirect = skill.data.values[2][lvl]; result.duration = skill.data.values[1][lvl];
			eseff = (6 + 4*skills[13].level); 
			esprcnt = skill.data.values[2][lvl];
		}
		if (skill.name == "Warmth") { result.ar_bonus = skill.data.values[0][lvl]; result.mana_regen = skill.data.values[1][lvl]; }
		if (skill.name == "Cold Mastery") { result.cPierce = skill.data.values[0][lvl]; result.cDamage = skill.data.values[1][lvl]; }
		if (skill.name == "Lightning Mastery") { result.lPierce = skill.data.values[0][lvl]; result.lDamage = skill.data.values[1][lvl]; }
		if (skill.name == "Fire Mastery") { result.fPierce = skill.data.values[0][lvl]; result.fDamage = skill.data.values[1][lvl]; }
		// No stat buffs:
		if (skill.name == "Thunder Storm") { result.duration = skill.data.values[1][lvl]; }
		
	return result
	},
	
	// getSkillDamage - returns the damage and attack rating for the selected skill
	//	skill: skill object for the selected skill
	//	ar: base attack rating
	//	min/max parameters: base damage of different types
	// ---------------------------------
	getSkillDamage : function(skill, ar, phys_min, phys_max, phys_mult, nonPhys_min, nonPhys_max) {
		var lvl = skill.level+skill.extra_levels;
		var ar_bonus = 0; var damage_bonus = 0; var weapon_damage = 100;
		var damage_min = 0; var damage_max = 0;
		var fDamage_min = 0; var fDamage_max = 0;
		var cDamage_min = 0; var cDamage_max = 0;
		var lDamage_min = 0; var lDamage_max = 0;
		var pDamage_min = 0; var pDamage_max = 0; var pDamage_duration = 0;
		var mDamage_min = 0; var mDamage_max = 0;
		var skillMin = 0; var skillMax = 0; var skillAr = 0;
		var attack = 0;	// 0 = no basic damage, 1 = includes basic attack damage
		var spell = 2;	// 0 = uses attack rating, 1 = no attack rating, 2 = non-damaging
		var damage_enhanced = character.damage_bonus + character.e_damage;
		
		if (skill.name == "Ice Bolt") {				attack = 0; spell = 1; cDamage_min = character.getSkillData(skill,lvl,0); cDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Frost Nova") {		attack = 0; spell = 1; cDamage_min = character.getSkillData(skill,lvl,0); cDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Ice Blast") {		attack = 0; spell = 1; cDamage_min = character.getSkillData(skill,lvl,0); cDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Glacial Spike") {	attack = 0; spell = 1; cDamage_min = character.getSkillData(skill,lvl,0); cDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Blizzard") {		attack = 0; spell = 1; cDamage_min = character.getSkillData(skill,lvl,0); cDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Freezing Pulse") {	attack = 0; spell = 1; cDamage_min = character.getSkillData(skill,lvl,1); cDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Frozen Orb") {		attack = 0; spell = 1; cDamage_min = character.getSkillData(skill,lvl,0); cDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Charged Bolt") {	attack = 0; spell = 1; lDamage_min = character.getSkillData(skill,lvl,1); lDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Telekinesis") {		attack = 0; spell = 1; lDamage_min = character.getSkillData(skill,lvl,0); lDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Nova") {			attack = 0; spell = 1; lDamage_min = character.getSkillData(skill,lvl,0); lDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Lightning Surge") {	attack = 0; spell = 1; lDamage_min = character.getSkillData(skill,lvl,0); lDamage_max = character.getSkillData(skill,lvl,1); damage_min = (lDamage_min*character.phys_Lightning_Surge/100) * (1+character.physicalDamage/100); damage_max = (lDamage_max*character.phys_Lightning_Surge/100) * (1+character.physicalDamage/100); }
		else if (skill.name == "Chain Lightning") {	attack = 0; spell = 1; lDamage_min = character.getSkillData(skill,lvl,1); lDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Discharge") {		attack = 0; spell = 1; lDamage_min = character.getSkillData(skill,lvl,1); lDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Thunder Storm") {	attack = 0; spell = 1; lDamage_min = character.getSkillData(skill,lvl,2); lDamage_max = character.getSkillData(skill,lvl,3); }
	//	else if (skill.name == "Static Field") {	attack = 0; spell = 2; }
		else if (skill.name == "Fire Bolt") {		attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,0); fDamage_max = character.getSkillData(skill,lvl,1); }
	//	else if (skill.name == "Blaze") {			attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,1); fDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Inferno") {			attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,0); fDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Immolate") {		attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,0); fDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Fire Ball") {		attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,0); fDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Fire Wall") {		attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,0); fDamage_max = character.getSkillData(skill,lvl,1); }
//		else if (skill.name == "Meteor") {			attack = 0; spell = 1; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); fDamage_min = character.getSkillData(skill,lvl,2); fDamage_max = character.getSkillData(skill,lvl,3); }
		else if (skill.name == "Meteor") {			attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,2); fDamage_max = character.getSkillData(skill,lvl,3); damage_min = (fDamage_min * 0.35) * (1+character.physicalDamage/100); (damage_max = fDamage_max * 0.35) * (1+character.physicalDamage/100); }
		else if (skill.name == "Hydra") {			attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,1); fDamage_max = character.getSkillData(skill,lvl,2); }

		if (attack == 0) { phys_min = 0; phys_max = 0; phys_mult = 1; nonPhys_min = 0; nonPhys_max = 0; damage_enhanced = 0; }
		nonPhys_min += (fDamage_min + cDamage_min + lDamage_min + pDamage_min + mDamage_min);
		nonPhys_max += (fDamage_max + cDamage_max + lDamage_max + pDamage_max + mDamage_max);
		phys_min = (~~phys_min * (phys_mult + damage_bonus/100) * (1 + (weapon_damage-100)/100) + (damage_min * (1+(damage_bonus+damage_enhanced)/100)));
		phys_max = (~~phys_max * (phys_mult + damage_bonus/100) * (1 + (weapon_damage-100)/100) + (damage_max * (1+(damage_bonus+damage_enhanced+(character.level*character.e_max_damage_per_level))/100)));
		if (spell != 2) { skillMin = Math.floor(phys_min+nonPhys_min); skillMax = Math.floor(phys_max+nonPhys_max); }
		if (spell == 0) { skillAr = Math.floor(ar*(1+ar_bonus/100)); }
	// Get breakdown of sources of skill damage
		skill2Breakdown = "Skill damage Breakdown-" ;  // \nPhys Damage: " + phys_min + "-" + phys_max +  "\nFire Damage: " + fDamage_min + "-" + fDamage_max + "\nCold Damage: " + cDamage_min + "-" + cDamage_max + "\nLight Damage: " + lDamage_min + "-" + lDamage_max  + "\nMagic Damage: " + mDamage_min + "-" + mDamage_max  + "\nPoison Damage: " + pDamage_min + "-" + pDamage_max ;
		if (phys_min > 0) {skill2Breakdown += "\nPhys Damage: " + Math.floor(phys_min) + "-" + Math.floor(phys_max)};
		if (fDamage_min > 0) {skill2Breakdown += "\nFire Damage: " + Math.floor(fDamage_min) + "-" + Math.floor(fDamage_max)};
		if (cDamage_min > 0) {skill2Breakdown += "\nCold Damage: " + Math.floor(cDamage_min) + "-" + Math.floor(cDamage_max)};
		if (lDamage_min > 0) {skill2Breakdown += "\nLight Damage: " + Math.floor(lDamage_min) + "-" + Math.floor(lDamage_max)};
		if (mDamage_min > 0) {skill2Breakdown += "\nMagic Damage: " + Math.floor(mDamage_min) + "-" + Math.floor(mDamage_max)};
		if (pDamage_min > 0) {skill2Breakdown += "\nPoison Damage: " + Math.floor(pDamage_min) + "-" + Math.floor(pDamage_max)};
		if (attack != 0){
			addmore = "yes"
		}
		if (attack == 0){
			addmore = "no"
		}		


		var result = {min:skillMin,max:skillMax,ar:skillAr};
		return result

	},
	
	// setSkillAmounts - helps update class-related skill levels, called by calculateSkillAmounts()
	//	s: index of skill
	// ---------------------------------
	setSkillAmounts : function(s) {
		skills[s].extra_levels += character.skills_sorceress
//			if (c.class_name != "Sorceress" ) {
//				skills[s].extra_levels += character.skills_sorceress
//			}		

		if (s == 0 || s == 2 || s == 3 || s == 5 || s == 6 || s == 7 || s == 9) { skills[s].extra_levels += character.skills_ele_poison_all }
		if (s == 22 || s == 24 || s == 25 || s == 26 || s == 27 || s == 29 || s == 31) { skills[s].extra_levels += character.skills_ele_poison_all }
		if (s == 11 || s == 12 || s == 14 || s == 15 || s == 16 || s == 18 || s == 19) { skills[s].extra_levels += character.skills_ele_poison_all }

		if (s == 31) {
			skills[s].extra_levels += character.skills_summon_all
		}
		if (s < 11) {
			skills[s].extra_levels += character.skills_cold
			skills[s].extra_levels += character.skills_tree1
			skills[s].extra_levels += character.skills_cold_all
//			skills[s].extra_levels += character.skills_ele_poison_all
		} else if (s > 21) {
//			if (character.class_name != "Sorceress" ) {
//				skills[s].extra_levels += character.skills_sorceress
//			}
			skills[s].extra_levels += character.skills_fire
			skills[s].extra_levels += character.skills_tree3
			skills[s].extra_levels += character.skills_fire_all
//			skills[s].extra_levels += character.skills_ele_poison_all
		} else {
			skills[s].extra_levels += character.skills_lightning
			skills[s].extra_levels += character.skills_tree2
//			skills[s].extra_levels += character.skills_lightning_all
//			skills[s].extra_levels += character.skills_ele_poison_all
		}
	}
};

/*[ 0] Ice Bolt			*/ var d112 = {values:[
		["damage min",3,4,5,6,7,8,9,10,12,14,16,18,20,22,24,26,29,32,35,38,41,44,48,52,56,60,64,68,73,78,83,88,93,98,103,108,113,118,123,128,133,138,143,148,153,158,163,168,173,178,183,188,193,198,203,208,213,218,223,228,], 
		["damage max",5,6,8,9,11,12,14,15,18,20,23,25,28,30,33,35,39,43,46,49,53,56,61,65,70,74,79,83,89,94,100,105,111,116,122,127,133,138,144,149,155,160,166,171,177,182,188,193,199,204,210,215,221,226,232,237,243,248,254,259,], 
		["cold length",6,7.4,8.8,10.2,11.6,13,14.4,15.8,17.2,18.6,20,21.4,22.8,24.2,25.6,27,28.4,29.8,31.2,32.6,34,35.4,36.8,38.2,39.6,41,42.4,43.8,45.2,46.6,48,49.4,50.8,52.2,53.6,55,56.4,57.8,59.2,60.6,62,63.4,64.8,66.2,67.6,69,70.4,71.8,73.2,74.6,76,77.4,78.8,80.2,81.6,83,84.4,85.8,87.2,88.6,], 
]};
/*[ 1] Frigerate		*/ var d113 = {values:[
		["your cold min",3,6,9,12,15,18,21,24,33,42,51,60,69,78,87,96,114,132,150,168,186,204,231,258,285,312,339,366,414,462,510,558,606,654,702,750,798,846,894,942,990,1038,1086,1134,1182,1230,1278,1326,1374,1422,1470,1518,1566,1614,1662,1710,1758,1806,1854,1902,], 
		["your cold max",6,9,12,15,18,21,24,27,39,51,63,75,87,99,111,123,150,177,204,231,258,285,330,375,420,465,510,555,627,699,771,843,915,987,1059,1131,1203,1275,1347,1419,1491,1563,1635,1707,1779,1851,1923,1995,2067,2139,2211,2283,2355,2427,2499,2571,2643,2715,2787,2859,], 
		["party cold min",1,2,3,4,5,6,7,8,11,14,17,20,23,26,29,32,38,44,50,56,62,68,77,86,95,104,113,122,138,154,170,186,202,218,234,250,266,282,298,314,330,346,362,378,394,410,426,442,458,474,490,506,522,538,554,570,586,602,618,634,], 
		["party cold max",2,3,4,5,6,7,8,9,13,17,21,25,29,33,37,41,50,59,68,77,86,95,110,125,140,155,170,185,209,233,257,281,305,329,353,377,401,425,449,473,497,521,545,569,593,617,641,665,689,713,737,761,785,809,833,857,881,905,929,953,], 
		["enemy defense",-8,-10,-12,-13,-15,-16,-16,-17,-18,-18,-19,-19,-20,-20,-20,-21,-21,-21,-21,-21,-22,-22,-22,-22,-22,-22,-23,-23,-23,-23,-23,-23,-23,-23,-23,-23,-23,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-25,], 
]};
/*[ 2] Frost Nova		*/ var d121 = {values:[
		["damage min",4,7,10,13,16,19,22,25,31,37,43,49,55,61,67,73,82,91,100,109,96,103,113,123,133,143,153,163,177,191,205,219,233,247,261,275,289,303,317,331,345,359,373,387,401,415,429,443,457,471,485,499,513,527,541,555,569,583,597,611,], 
		["damage max",8,13,18,23,28,33,38,43,52,61,70,79,88,97,106,115,127,139,151,163,153,163,175,188,200,213,225,238,253,269,284,300,315,331,346,362,377,393,408,424,439,455,470,486,501,517,532,548,563,579,594,610,625,641,656,672,687,703,718,734,], 
		["cold length",8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,], 
		["mana cost",8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,], 
]};
/*[ 3] Ice Blast		*/ var d122 = {values:[
		["damage min",8,14,21,29,36,43,50,56,71,85,98,113,127,140,154,169,189,211,231,253,274,295,323,351,379,407,435,463,498,533,568,603,638,673,708,743,778,813,848,883,918,953,988,1023,1058,1093,1128,1163,1198,1233,1268,1303,1338,1373,1408,1443,1478,1513,1548,1583,], 
		["damage max",12,19,27,34,42,49,56,64,79,93,107,122,137,151,165,180,202,223,245,266,288,309,338,366,395,423,452,480,516,551,587,622,658,693,729,764,800,835,871,906,942,977,1013,1048,1084,1119,1155,1190,1225,1260,1295,1330,1365,1400,1435,1470,1505,1540,1575,1610,], 
		["freeze length",3,3.2,3.4,3.6,3.8,4,4.2,4.4,4.6,4.8,5,5.2,5.4,5.6,5.8,6,6.2,6.4,6.6,6.8,7,7.2,7.4,7.6,7.8,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.8,11,11.2,11.4,11.6,11.8,12,12.2,12.4,12.6,12.8,13,13.2,13.4,13.6,13.8,14,14.2,14.4,14.6,14.8,], 
		["mana cost",6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,], 
]};
/*[ 4] Shiver Armor		*/ var d133 = {values:[
		["duration",160,172,184,196,208,220,232,244,256,268,280,292,304,316,328,340,352,364,376,388,400,412,424,436,448,460,472,484,496,508,520,532,544,556,568,580,592,604,616,628,640,652,664,676,688,700,712,724,736,748,760,772,784,796,808,820,832,844,856,868,], 
		["defense bonus",45,51,57,63,69,75,81,87,93,99,105,111,117,123,129,135,141,147,153,159,165,171,177,183,189,195,201,207,213,219,225,231,237,243,249,255,261,267,273,279,285,291,297,303,309,315,321,327,333,339,345,351,357,363,369,375,381,387,393,399,], 
		["damage min",12,17,22,27,32,37,42,47,54,61,68,75,82,89,96,103,115,127,139,151,165,175,193,211,229,247,265,283,307,331,355,379,403,427,451,475,499,523,547,571,595,619,643,667,691,715,739,763,787,811,835,859,883,907,931,955,979,1003,1027,1051,], 
		["damage max",16,22,28,34,40,46,52,58,66,74,82,90,98,106,114,122,135,148,161,174,187,200,220,240,260,280,300,320,348,376,404,432,460,488,516,544,572,600,628,656,684,712,740,768,796,824,852,880,908,936,964,992,1020,1048,1076,1104,1132,1160,1188,1216,], 
		["cold length",4,4,4,4,4,4,4,4,5,6,7,8,9,10,11,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,], 
]};
/*[ 5] Glacial Spike	*/ var d142 = {values:[
		["damage min",16,22,29,36,44,51,58,65,78,91,103,116,129,142,155,169,183,197,210,225,239,253,268,283,298,313,328,343,359,375,391,407,423,439,455,471,487,503,519,535,551,567,583,599,615,631,647,663,679,695,711,727,743,759,775,791,807,823,839,855,], 
		["damage max",24,31,39,46,53,61,69,76,90,103,116,130,144,157,171,184,198,213,228,242,257,271,287,302,318,333,348,364,381,397,414,430,447,463,480,496,513,529,546,562,579,595,612,628,645,661,678,694,711,727,744,760,777,793,810,826,843,859,876,892,], 
		["freeze length",1,1.1,1.2,1.3,1.4,1.6,1.7,1.8,1.9,2,2.2,2.3,2.4,2.5,2.6,2.8,2.9,3,3.1,3.2,3.3,3.4,3.5,3.6,3.7,3.8,3.9,4,4.1,4.2,4.3,4.4,4.5,4.6,4.7,4.8,4.9,5,5.1,5.2,5.3,5.4,5.5,5.6,5.7,5.8,5.9,6,6.1,6.2,6.3,6.4,6.5,6.6,6.7,6.8,6.9,7,7.1,7.2,], 
		["mana cost",9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,38,38.5,39,], 
]};
/*[ 6] Blizzard			*/ var d151 = {values:[
		["damage min",45,59,75,90,104,120,134,150,179,209,240,270,300,329,359,390,434,479,525,570,615,660,715,770,825,880,935,990,1055,1120,1185,1250,1315,1380,1445,1510,1575,1640,1705,1770,1835,1900,1965,2030,2095,2160,2225,2290,2355,2420,2485,2550,2615,2680,2745,2810,2875,2940,3005,3070,], 
		["damage max",75,91,107,122,139,154,171,186,217,248,279,310,341,372,403,434,480,527,572,619,665,711,767,823,879,935,991,1047,1113,1179,1245,1311,1377,1443,1509,1575,1641,1707,1773,1839,1905,1971,2037,2103,2169,2235,2301,2367,2433,2499,2565,2631,2697,2763,2829,2895,2961,3027,3093,3159,], 
		["mana cost",25,26,28,29,31,32,34,35,37,38,40,41,43,44,46,47,49,50,52,53,55,56,58,59,61,62,64,65,67,68,70,71,73,74,76,77,79,80,82,83,85,86,88,89,91,92,94,95,97,98,100,101,103,104,106,107,109,110,112,113,], 
]};
/*[ 7] Freezing Pulse	*/ var d152 = {values:[
		["pulses",3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,10,10,10,10,10,11,11,11,11,11,12,12,12,12,12,13,13,13,13,13,14,14,14,14,14,15,], 
		["damage min",39,59,79,99,119,139,159,179,201,223,245,267,289,311,333,355,379,403,427,451,475,499,525,551,577,603,629,655,683,711,739,767,795,823,851,879,907,935,963,991,1019,1047,1075,1103,1131,1159,1187,1215,1243,1271,1299,1327,1355,1383,1411,1439,1467,1495,1523,1551,], 
		["damage max",44,65,86,107,128,149,170,191,214,237,260,283,306,329,352,375,400,425,450,475,500,525,552,579,606,633,660,687,716,745,774,803,832,861,890,919,948,977,1006,1035,1064,1093,1122,1151,1180,1209,1238,1267,1296,1325,1354,1383,1412,1441,1470,1499,1528,1557,1586,1615,], 
		["mana cost",7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,], 
]};
/*[ 8] Chilling Armor	*/ var d153 = {values:[
		["duration",160,166,172,178,184,190,196,202,208,214,220,226,232,238,244,250,256,262,268,274,280,286,292,298,304,310,316,322,328,334,340,346,352,358,364,370,376,382,388,394,400,406,412,418,424,430,436,442,448,454,460,466,472,478,484,490,496,502,508,514,], 
		["defense bonus",45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,330,335,340,], 
		["damage min",8,10,14,17,20,23,26,29,34,39,44,49,54,59,64,69,76,83,90,97,104,111,121,131,141,151,161,171,184,197,210,223,236,249,262,275,288,301,314,327,340,353,366,379,392,405,418,431,444,457,470,483,496,509,522,535,548,561,574,587,], 
		["damage max",12,15,19,24,28,32,36,40,47,54,61,68,75,82,89,96,106,116,126,136,146,156,171,186,201,216,231,246,263,280,297,314,331,348,365,382,399,416,433,450,467,484,501,518,535,552,569,586,603,620,637,654,671,688,705,722,739,756,773,790,], 
		["cold length",4,4,4,4,4,4,4,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,], 
]};
/*[ 9] Frozen Orb		*/ var d161 = {values:[
		["damage min",50,67,84,102,120,137,155,172,191,211,230,250,270,289,309,328,350,372,394,416,438,460,484,508,532,556,580,604,630,655,681,706,732,757,783,808,834,859,885,910,936,961,987,1012,1038,1063,1089,1114,1140,1165,1191,1216,1242,1267,1293,1318,1344,1369,1395,1420,], 
		["damage max",60,77,95,114,131,150,168,185,206,225,245,266,285,306,325,345,368,390,413,436,458,481,505,530,554,579,603,628,654,680,706,732,758,784,810,836,862,888,914,940,966,992,1018,1044,1070,1096,1122,1148,1174,1200,1226,1252,1278,1304,1330,1356,1382,1408,1434,1460,], 
		["cold length",8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,], 
		["mana cost",25,26,28,29,31,32,34,35,37,38,40,41,43,44,46,47,49,50,52,53,55,56,58,59,61,62,64,65,67,68,70,71,73,74,76,77,79,80,82,83,85,86,88,89,91,92,94,95,97,98,100,101,103,104,106,107,109,110,112,113,], 
]};
/*[10] Cold Mastery		*/ var d162 = {values:[
		["pierce",5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,], 
		["damage",2,7,12,17,22,27,32,37,42,47,52,57,62,67,72,77,82,87,92,97,102,107,112,117,122,127,132,137,142,147,152,157,162,167,172,177,182,187,192,197,202,207,212,217,222,227,232,237,242,247,252,257,262,267,272,277,282,287,292,297,], 
]};

/*[11] Charged Bolt		*/ var d212 = {values:[
		["bolts",3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,], 
		["lightning min",2,2,3,3,4,4,5,5,6,6,8,9,10,11,12,13,16,19,22,25,28,31,35,38,42,45,49,52,57,61,66,70,75,79,84,88,93,97,102,106,111,115,120,124,129,133,138,142,147,151,156,160,165,169,174,178,183,187,192,196,], 
		["lightning max",4,4,5,5,6,6,7,7,9,10,12,13,15,16,18,19,25,31,37,43,49,55,63,70,78,85,93,100,109,118,127,136,145,154,163,172,181,190,199,208,217,226,235,244,253,262,271,280,289,298,307,316,325,334,343,352,361,370,379,388,], 
		["mana cost",3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,], 
]};
/*[12] Static Field		*/ var d221 = {values:[
		["radius",3.3,4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,20,20.6,21.3,22,22.6,23.3,24,24.6,25.3,26,26.6,27.3,28,28.6,29.3,30,30.6,31.3,32,32.6,33.3,34,34.6,35.3,36,36.6,37.3,38,38.6,39.3,40,40.6,41.3,42,42.6,], 
]};
/*[13] Telekinesis		*/ var d223 = {values:[
		["lightning min",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["lightning max",2,4,6,8,10,12,14,16,19,22,25,28,31,34,37,40,44,48,52,56,60,64,69,74,79,84,89,94,100,106,112,118,124,130,136,142,148,154,160,166,172,178,184,190,196,202,208,214,220,226,232,238,244,250,256,262,268,274,280,286,], 
]};
/*[14] Nova				*/ var d231 = {values:[
		["lightning min",1,1,1,1,1,1,1,1,6,11,16,21,26,31,36,41,51,61,71,81,91,101,121,141,161,181,201,221,244,267,290,313,336,359,382,405,428,451,474,497,520,543,566,589,612,635,658,681,704,727,750,773,796,819,842,865,888,911,934,957,], 
		["lightning max",40,60,80,100,120,140,160,180,220,260,300,340,380,420,460,500,560,620,680,740,800,860,935,1010,1085,1160,1235,1310,1385,1460,1535,1610,1685,1760,1835,1910,1985,2060,2135,2210,2285,2360,2435,2510,2585,2660,2735,2810,2885,2960,3035,3110,3185,3260,3335,3410,3485,3560,3635,3710,], 
		["mana cost",15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,40,40.5,41,41.5,42,42.5,43,43.5,44,44.5,], 
]};
/*[15] Lightning Surge	*/ var d232 = {values:[
		["lightning min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["lightning max",100,131,164,195,228,260,291,324,371,420,468,515,564,611,660,708,771,835,900,964,1028,1092,1184,1276,1368,1460,1552,1644,1752,1860,1968,2076,2184,2292,2400,2508,2616,2724,2832,2940,3048,3156,3264,3372,3480,3588,3696,3804,3912,4020,4128,4236,4344,4452,4560,4668,4776,4884,4992,5100,], 
		["mana cost",8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,], 
]};
/*[16] Chain Lightning	*/ var d242 = {values:[
		["hits",5,5,5,5,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,10,10,10,10,10,11,11,11,11,11,12,12,12,12,12,13,13,13,13,13,14,14,14,14,14,15,15,15,15,15,16,16,16,16,16,17,], 
		["lightning min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["lightning max",160,200,240,280,320,360,400,440,488,536,584,632,680,728,776,824,880,936,992,1048,1104,1160,1224,1288,1352,1416,1480,1544,1616,1688,1760,1832,1904,1976,2048,2120,2192,2264,2336,2408,2480,2552,2624,2696,2768,2840,2912,2984,3056,3128,3200,3272,3344,3416,3488,3560,3632,3704,3776,3848,], 
		["mana cost",10,11,13,14,16,17,19,20,22,23,25,26,28,29,31,32,34,35,37,38,40,41,43,44,46,47,49,50,52,53,55,56,58,59,61,62,64,65,67,68,70,71,73,74,76,77,79,80,82,83,85,86,88,89,91,92,94,95,97,98,], 
]};
/*[17] Teleport			*/ var d243 = {values:[
		["drain reduction",2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,], 
]};
/*[18] Discharge		*/ var d251 = {values:[
		["cooldown",7.8,7.6,7.5,7.3,7.2,7,6.8,6.7,6.5,6.4,6.2,6,5.9,5.7,5.6,5.4,5.2,5.1,4.9,4.8,4.6,4.4,4.3,4.1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,], 
		["lightning min",75,89,103,117,131,145,159,173,187,201,215,229,243,257,271,285,299,313,327,341,355,369,383,397,411,425,439,453,467,481,495,509,523,537,551,565,579,593,607,621,635,649,663,677,691,705,719,733,747,761,775,789,803,817,831,845,859,873,887,901,], 
		["lightning max",240,281,322,363,404,445,486,527,568,609,650,691,732,773,814,855,896,937,978,1019,1060,1101,1142,1183,1224,1265,1306,1347,1388,1429,1470,1511,1552,1593,1634,1675,1716,1757,1798,1839,1880,1921,1962,2003,2044,2085,2126,2167,2208,2249,2290,2331,2372,2413,2454,2495,2536,2577,2618,2659,], 
		["mana cost",85,89,93,97,101,105,109,113,117,121,125,129,133,137,141,145,149,153,157,161,165,169,173,177,181,185,189,193,197,201,205,209,213,217,221,225,229,233,237,241,245,249,253,257,261,265,269,273,277,281,285,289,293,297,301,305,309,313,317,321,], 
]};
/*[19] Energy Shield	*/ var d253 = {values:[
		["efficiency",], 
		["duration",144,204,264,324,384,444,504,564,624,684,744,804,864,924,984,1044,1104,1164,1224,1284,1344,1404,1464,1524,1584,1644,1704,1764,1824,1884,1944,2004,2064,2124,2184,2244,2304,2364,2424,2484,2544,2604,2664,2724,2784,2844,2904,2964,3024,3084,3144,3204,3264,3324,3384,3444,3504,3564,3624,3684,], 
		["absorbs",12,17,22,27,32,37,42,47,49,51,53,55,57,59,61,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,], 
]};
/*[20] Lightning Mastery*/ var d262 = {values:[
		["pierce",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["damage",2,6,10,14,18,22,26,30,34,38,42,46,50,54,58,62,66,70,74,78,82,86,90,94,98,102,106,110,114,118,122,126,130,134,138,142,146,150,154,158,162,166,170,174,178,182,186,190,194,198,202,206,210,214,218,222,226,230,234,238,], 
]};
/*[21] Thunder Storm	*/ var d263 = {values:[
		["delay",], 
		["duration",6,6.8,7.6,8.4,9.2,10,10.8,11.6,12.4,13.2,14,14.8,15.6,16.4,17.2,18,18.8,19.6,20.4,21.2,22,22.8,23.6,24.4,25.2,26,26.8,27.6,28.4,29.2,30,30.8,31.6,32.4,33.2,34,34.8,35.6,36.4,37.2,38,38.8,39.6,40.4,41.2,42,42.8,43.6,44.4,45.2,46,46.8,47.6,48.4,49.2,50,50.8,51.6,52.4,53.2,], 
		["lightning min",1,11,21,31,41,51,61,71,82,93,104,115,126,137,148,159,171,183,195,207,219,231,244,257,270,283,296,309,323,337,351,365,379,393,407,421,435,449,463,477,489,505,519,533,547,561,575,589,603,617,631,645,659,673,687,701,715,729,743,757,], 
		["lightning max",100,110,120,130,140,150,160,171,181,192,203,214,225,236,247,258,270,282,294,306,318,330,343,356,369,382,395,409,422,436,450,464,478,492,506,520,534,548,562,576,588,604,618,632,646,660,674,688,702,716,730,744,758,772,786,800,814,828,842,856,], 
		["mana cost",18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,40,40.5,41,41.5,42,42.5,43,43.5,44,44.5,45,45.5,46,46.5,47,47.5,], 
]};

/*[22] Fire Bolt		*/ var d312 = {values:[
		["fire min",3,4,6,7,9,10,12,13,15,17,19,21,23,25,27,29,37,45,53,61,69,77,91,105,119,133,147,161,184,207,230,253,276,299,322,345,368,391,414,437,460,483,506,529,552,575,598,621,644,667,690,713,736,759,782,805,828,851,874,897,], 
		["fire max",6,7,9,10,12,13,15,16,19,22,25,28,31,34,37,40,50,60,70,80,90,100,116,132,148,164,180,196,221,246,271,296,321,346,371,396,421,446,471,496,521,546,571,596,621,646,671,696,721,746,771,796,821,846,871,896,921,946,971,996,], 
]};
/*[23] Warmth			*/ var d313 = {values:[
		["attack rating",7,12,17,22,27,32,37,42,47,52,57,62,67,72,77,82,87,92,97,102,107,112,117,122,127,132,137,142,147,152,157,162,167,172,177,182,187,192,197,202,207,212,217,222,227,232,237,242,247,252,257,262,267,272,277,282,287,292,297,302,], 
		["mana recovery",20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,], 
]};
/*[24] Blaze			*/ /*var d321 = {values:[
		["duration",4.6,6.8,8.4,9.9,11,11.8,12.6,13.1,13.8,14.2,14.7,15.1,15.4,15.8,16,16.4,16.5,16.7,16.9,17.1,17.2,17.4,17.6,17.8,17.8,18.2,18.2,18.3,18.3,18.5,18.5,18.7,18.7,18.7,18.9,18.9,19,19,19.1,19.1,19.2,19.2,19.3,19.3,19.4,19.4,19.5,19.5,19.6,19.6,19.7,19.7,19.8,19.8,19.9,19.9,20,20,20.1,20.1,], 
		["damage min",1,2,3,4,5,7,8,9,11,14,16,18,21,23,25,28,31,35,38,42,30,32,37,42,46,51,56,60,69,77,85,93,101,110,118,126,134,142,151,159,167,175,183,192,200,208,216,224,233,241,249,257,265,274,282,290,298,306,315,323,], 
		["damage max",2,3,4,5,7,8,9,10,14,17,21,24,28,31,35,38,43,48,51,57,37,41,46,52,58,64,70,76,85,94,104,113,123,132,141,151,160,169,179,188,198,207,216,226,235,244,254,263,273,282,291,301,310,319,329,338,348,357,366,376,], 
		["mana cost",11,11.7,12.5,13.2,14,14.7,15.5,16.2,17,17.7,18.5,19.2,20,20.7,21.5,22.2,23,23.7,24.5,25.2,26,26.7,27.5,28.2,29,29.7,30.5,31.2,32,32.7,33.5,34.2,35,35.7,36.5,37.2,38,38.7,39,40,41,41.7,42.5,43.2,44,44.7,45.5,46.2,47,47.7,48.5,49.2,50,50.7,51.5,52.2,53,53.7,54.5,55.2,], 
]}; */
/*[24] Inferno			*/ var d321 = {values:[
		["damage min",2,4,7,9,11,14,16,18,25,32,39,46,53,60,67,75,85,96,106,117,127,138,158,178,198,217,237,257,294,330,366,403,439,475,512,548,584,621,657,693,730,766,802,839,875,911,948,984,1020,1057,1093,1129,1166,1202,1238,1275,1311,1347,1383,1420,], 
		["damage max",3,7,10,14,17,21,24,28,36,44,52,60,69,77,85,93,105,117,128,140,152,164,185,206,227,248,269,290,328,365,403,440,478,515,553,590,628,665,703,740,778,815,853,890,928,965,1003,1040,1078,1115,1153,1190,1228,1265,1303,1340,1378,1415,1453,1490,], 
		["mana cost",2,3,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,14,15,15,15,16,16,16,16,17,17,17,], 
]};
/*[25] Immolate			*/ var d331 = {values:[
		["fire min",16,22,28,34,40,46,52,58,70,82,94,106,118,130,142,154,178,202,226,250,273,297,365,434,502,569,638,706,810,913,1017,1121,1226,1330,1434,1538,1641,1745,1850,1954,2058,2162,2265,2369,2473,2578,2682,2786,2889,2993,3097,3202,3306,3410,3513,3617,3721,3826,3930,4034,], 
		["fire max",24,34,44,54,64,74,84,94,110,126,142,158,174,190,206,222,252,282,312,342,371,402,488,573,660,745,832,917,1065,1213,1362,1510,1658,1806,1954,2102,2250,2397,2545,2693,2841,2989,3138,3286,3434,3582,3730,3878,4026,4173,4321,4469,4617,4765,4913,5062,5210,5358,5506,5654,], 
		["mana cost",8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,], 
]};
/*[26] Fire Ball		*/ var d332 = {values:[
		["fire min",11,20,28,36,44,52,60,68,84,100,116,132,148,164,180,196,224,252,280,308,336,364,404,444,484,524,564,604,654,704,754,804,854,904,954,1004,1054,1104,1154,1204,1254,1304,1354,1404,1454,1504,1554,1604,1654,1704,1754,1804,1854,1904,1954,2004,2054,2104,2154,2204,], 
		["fire max",13,38,62,86,110,134,158,182,211,240,269,298,327,356,385,414,448,482,516,550,584,618,666,714,762,810,858,906,960,1014,1068,1122,1176,1230,1284,1338,1392,1446,1500,1554,1608,1662,1716,1770,1824,1878,1932,1986,2040,2094,2148,2202,2256,2310,2364,2418,2472,2526,2580,2634,], 
		["mana cost",5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,], 
]};
/*[27] Fire Wall		*/ var d341 = {values:[
		["fire min",140,224,309,393,478,562,646,731,862,993,1124,1256,1387,1518,1649,1781,1978,2174,2371,2568,2765,2962,3159,3356,3553,3750,3946,4143,4340,4537,4734,4931,5128,5325,5521,5718,5915,6112,6309,6506,6703,6900,7096,7293,7490,7687,7884,8081,8278,8475,8671,8868,9065,9262,9459,9656,9853,10050,10246,10443,], 
		["fire max",187,271,356,440,524,609,693,778,909,1040,1171,1302,1434,1565,1696,1828,2024,2213,2418,2615,2812,3009,3206,3403,3600,3796,3993,4190,4387,4584,4781,4978,5175,5371,5568,5765,5962,6159,6356,6553,6750,6946,7143,7340,7537,7734,7931,8128,8325,8521,8718,8915,9112,9309,9506,9703,9900,10096,10293,10490,], 
		["wall length",4,6,7,8,10,11,12,14,15,16,18,19,20,22,23,24,26,27,28,30,31,32,34,35,36,38,39,40,42,43,44,46,47,48,50,51,52,54,55,56,58,59,60,62,63,64,66,67,68,70,71,72,74,75,76,78,79,80,82,83,], 
		["mana cost",25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,], 
]};
/*[28] Enflame			*/ var d343 = {values:[
		["your fire min",9,15,21,27,33,39,45,51,63,75,87,99,111,123,135,147,174,201,228,255,282,309,360,411,462,513,564,615,681,747,813,879,945,1011,1077,1143,1209,1275,1341,1407,1473,1539,1605,1671,1737,1803,1869,1935,2001,2067,2133,2199,2265,2331,2397,2463,2529,2595,2661,2727,], 
		["your fire max",12,21,30,39,48,57,66,75,90,105,120,135,150,165,180,195,231,267,303,339,375,411,471,531,591,651,711,771,837,903,969,1035,1101,1167,1233,1299,1365,1431,1497,1563,1629,1695,1761,1827,1893,1959,2025,2091,2157,2223,2289,2355,2421,2487,2553,2619,2685,2751,2817,2883,], 
		["party fire min",3,5,7,9,11,13,15,17,21,25,29,33,37,41,45,49,58,67,76,85,94,103,120,137,154,171,188,205,227,249,271,293,315,337,359,381,403,425,447,469,491,513,535,557,579,601,623,645,667,689,711,733,755,777,799,821,843,865,887,909,], 
		["party fire max",4,7,10,13,16,19,22,25,30,35,40,45,50,55,60,65,77,89,101,113,125,137,157,177,197,217,237,257,279,301,323,345,367,389,411,433,455,477,499,521,543,565,587,609,631,653,675,697,719,741,763,785,807,829,851,873,895,917,939,961,], 
		["attack rating",50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,330,335,340,345,], 
]};
/*[29] Meteor			*/ var d352 = {values:[
//		["damage min",40,47.5,55,62.5,70,77.5,85,92.5,102.5,112.5,122.5,132.5,142.5,152.5,162.5,172.5,187.5,202.5,217.5,232.5,247.5,262.5,282.5,302.5,322.5,342.5,362.5,382.5,407.5,432.5,457.5,482.5,507.5,532.5,557.5,582.5,607.5,632.5,657.5,682.5,707.5,732.5,757.5,782.5,807.5,832.5,857.5,882.5,907.5,932.5,957.5,982.5,1007.5,1032.5,1057.5,1082.5,1107.5,1132.5,1157.5,1182.5,], 
//		["damage max",50,60,70,80,90,100,110,120,135,150,165,180,195,210,225,240,260,280,300,320,340,360,385,410,435,460,485,510,540,570,600,630,660,690,720,750,780,810,840,870,900,930,960,990,1020,1050,1080,1110,1140,1170,1200,1230,1260,1290,1320,1350,1380,1410,1440,1470,], 
//		["damage min",], 
//		["damage max",], 
		["fire min",160,190,220,250,280,310,340,370,410,450,490,530,570,610,650,690,750,810,870,930,990,1050,1130,1210,1290,1370,1450,1530,1630,1730,1830,1930,2030,2130,2230,2330,2430,2530,2630,2730,2830,2930,3030,3130,3230,3330,3430,3530,3630,3730,3830,3930,4030,4130,4230,4330,4430,4530,4630,4730,], 
		["fire max",200,240,280,320,360,400,440,480,540,600,660,720,780,840,900,960,1040,1120,1200,1280,1360,1440,1540,1640,1740,1840,1940,2040,2160,2280,2400,2520,2640,2760,2880,3000,3120,3240,3360,3480,3600,3720,3840,3960,4080,4200,4320,4440,4560,4680,4800,4920,5040,5160,5280,5400,5520,5640,5760,5880,], 
		["avg fire min",35,44,53,63,72,82,91,100,112,124,135,147,159,171,182,194,208,222,236,250,264,278,292,306,320,335,349,363,377,391,405,419,433,447,461,475,489,503,517,532,546,560,574,588,602,616,630,644,658,672,686,700,714,728,742,756,770,784,798,812,], 
		["avg fire max",58,67,77,86,95,105,114,124,135,147,159,171,182,194,206,217,232,246,260,274,288,302,316,330,344,358,372,386,400,414,428,442,456,470,485,499,513,527,541,555,569,583,597,611,625,639,653,667,681,695,709,723,737,751,765,779,793,807,821,835,], 
		["mana cost",20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,], 
]};
/*[30] Fire Mastery		*/ var d362 = {values:[
		["pierce",5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,], 
		["damage",2,7,12,17,22,27,32,37,42,47,52,57,62,67,72,77,82,87,92,97,102,107,112,117,122,127,132,137,142,147,152,157,162,167,172,177,182,187,192,197,202,207,212,217,222,227,232,237,242,247,252,257,262,267,272,277,282,287,292,297,], 
]};
/*[31] Hydra			*/ var d363 = {values:[
		["duration",3.5,3.6,3.6,3.7,3.8,3.9,4,4,4.1,4.2,4.3,4.4,4.4,4.5,4.6,4.7,4.8,4.8,4.9,5,5.1,5.2,5.2,5.3,5.4,5.5,5.6,5.6,5.7,5.8,5.9,6,6,6.1,6.2,6.3,6.4,6.4,6.5,6.6,6.7,6.8,6.8,6.9,7,7.1,7.2,7.2,7.3,7.4,7.5,7.6,7.6,7.7,7.8,7.9,8,8,8.1,8.2,], 
		["damage min",50,74,98,122,146,170,194,218,252,286,319,354,388,422,456,490,531,572,613,654,695,736,779,822,865,908,951,994,1039,1084,1129,1174,1219,1264,1309,1354,1399,1444,1489,1534,1579,1624,1669,1714,1759,1804,1849,1894,1939,1984,2029,2074,2119,2164,2209,2254,2299,2344,2389,2434,], 
		["damage max",64,96,128,160,192,224,256,288,329,370,411,452,493,534,575,616,660,706,751,796,841,886,933,980,1027,1074,1121,1168,1217,1266,1315,1364,1413,1462,1511,1560,1609,1658,1707,1756,1805,1854,1903,1952,2001,2050,2099,2148,2197,2246,2295,2344,2393,2442,2491,2540,2589,2638,2687,2736,], 
		["mana cost",25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,], 
]};

var skills_sorceress = [
{data:d112, key:"112", code:36, name:"Ice Bolt", i:0, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a magical bolt of ice<br>that damages and slows your enemies", syn_title:"<br>Ice Bolt Receives Bonuses From:<br>", syn_text:"Frigerate: +25% Cold Damage per Level<br>Frost Nova: +25% Cold Damage per Level<br>Shiver Armor: +25% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Cold Damage: ","-","<br>Cold Length: "," seconds<br>Mana Cost: 3",""]},
{data:d113, key:"113", code:37, name:"Frigerate", i:1, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:3, bindable:0, description:"Activated Aura - Chills your party's weapons<br>While active, adds cold damage to allies near you<br><br>Mana Cost: 25", syn_title:"<br>Frigerate Receives Bonuses From:<br>", syn_text:"Shiver Armor: +20% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Cold Damage (self): ","-","<br>Cold Damage (allies): ","-","<br>Enemy Defense: ","%"]},
{data:d121, key:"121", code:38, name:"Frost Nova", i:2, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates an expanding ring of ice that damages<br>and slows all nearby enemies", syn_title:"<br>Frost Nova Receives Bonuses From:<br>", syn_text:"Ice Blast: +16% Cold Damage per Level<br>Shiver Armor: +16% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Cold Damage: ","-","<br>Cold Length: "," seconds<br>Mana Cost: ",""]},
{data:d122, key:"122", code:39, name:"Ice Blast", i:3, req:[0], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a magical sphere of ice that<br>damages and freezes your enemy", syn_title:"<br>Ice Blast Receives Bonuses From:<br>", syn_text:"Ice Bolt: +12% Cold Damage per Level<br>Glacial Spike: +10% Freeze Length per Level<br>Blizzard: +12% Cold Damage per Level<br>Glacial Spike: +12% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Cold Damage: ","-","<br>Freezes for "," seconds<br>Mana Cost: ",""]},
{data:d133, key:"133", code:40, name:"Shiver Armor", i:4, req:[1,3,0], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Increases your defense rating<br>Freezes and damages enemies that hit you", syn_title:"<br>Shiver Armor Receives Bonuses From:<br>", syn_text:"Frigerate: +18% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Defense Bonus: "," percent<br>Cold Damage: ","-","<br>Cold Length: "," seconds<br>Mana Cost: 11",""]},
{data:d142, key:"142", code:41, name:"Glacial Spike", i:5, req:[3,0], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a magical ice comet<br>that freezes or kills nearby enemies<br><br>Radius: 2.6 yards", syn_title:"<br>Glacial Spike Receives Bonuses From:<br>", syn_text:"Ice Bolt: +8% Cold Damage per Level<br>Ice Blast: +8% Cold Damage per Level<br>Blizzard: +3% Freeze Length per Level<br>Frozen Orb: +8% Cold Damage per Level<br>Freezing Pulse: +8% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Cold Damage: ","-","<br>Freezes for "," seconds<br>Mana Cost: ",""]},
{data:d151, key:"151", code:42, name:"Blizzard", i:6, req:[2,5,3,0], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Summons massive shards of ice to destroy your enemies", syn_title:"<br>Blizzard Receives Bonuses From:<br>", syn_text:"Ice Blast: +9% Cold Damage per Level<br>Glacial Spike: +9% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Cold Damage: ","-","<br>Duration: 4 seconds<br>Mana Cost: ",""]},
{data:d152, key:"152", code:43, name:"Freezing Pulse", i:7, req:[5,3,0], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:2, description:"A powerful pulse of freezing air that passes<br>through enemies, slowing and damaging them", syn_title:"<br>Freezing Pulse Receives Bonuses From:<br>", syn_text:"Ice Bolt: +5% Cold Damage per Level<br>Ice Blast: +5% Cold Damage per Level<br>Glacial Spike: +5% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:[""," Freezing Pulses<br>Cold Damage: ","-","<br>Mana Cost: ",""]},
{data:d153, key:"153", code:44, name:"Chilling Armor", i:8, req:[4,1,3,0], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Increases defense and discharges an ice bolt in retaliation<br>against ranged attackers", syn_title:"<br>Chilling Armor Receives Bonuses From:<br>", syn_text:"Ice Bolt: +18% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Defense Bonus: "," percent<br>Cold Damage: ","-","<br>Cold Length: "," seconds<br>Mana Cost: 17",""]},
{data:d161, key:"161", code:45, name:"Frozen Orb", i:9, req:[6,2,5,3,0], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a magical globe that sprays a torrent of ice bolts<br>to lay waste to your enemies", syn_title:"<br>Frozen Orb Receives Bonuses From:<br>", syn_text:"Ice Bolt: +2% Cold Damage per Level<br>Cold Mastery", graytext:"", index:[0,""], text:["Cold Damage: ","-","<br>Cold Length: "," seconds<br>Mana Cost: ",""]},
{data:d162, key:"162", code:46, name:"Cold Mastery", i:10, req:[], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Increases the damage of your cold skills<br>by piercing enemies' resistances to cold", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Cold Pierce: +"," percent<br>Cold Damage: +"," percent",""]},

{data:d212, key:"212", code:47, name:"Charged Bolt", i:11, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates multiple, randomly directed<br>bolts of electrical energy", syn_title:"<br>Charged Bolt Receives Bonuses From:<br>", syn_text:"Lightning Surge: +8% Lightning Damage per Level<br>Chain Lightning: +8% Lightning Damage per Level<br>Lightning Mastery", graytext:"", index:[0,""], text:[""," bolts<br>Lightning Damage: ","-","<br>Mana Cost: ",""]},
{data:d221, key:"221", code:48, name:"Static Field", i:12, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates an electrical field that reduces life<br>of all nearby enemies<br><br>Weakens enemies by 20 percent", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: "," yards<br>Mana Cost: 9",""]},
{data:d223, key:"223", code:49, name:"Telekinesis", i:13, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Uses the power of your mind to<br>pick up items, use objects,<br>and knock back enemies", syn_title:"<br>Telekinesis Receives Bonuses From:<br>", syn_text:"Lightning Mastery", graytext:"", index:[0,""], text:["Lightning Damage: ","-","<br>Mana Cost: 7",""], notupdated:1},
{data:d231, key:"231", code:50, name:"Nova", i:14, req:[12], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates an expanding ring of lightning<br>to shock nearby enemies", syn_title:"<br>Nova Receives Bonuses From:<br>", syn_text:"Discharge: +3% Lightning Damage per Level<br>Lightning Mastery", graytext:"", index:[0,""], text:["Lightning Damage: ","-","<br>Mana Cost: ",""]},
{data:d232, key:"232", code:51, name:"Lightning Surge", i:15, req:[11], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a powerful lightning bolt<br>to lay waste to your enemies", syn_title:"<br>Lightning Surge Receives Bonuses From:<br>", syn_text:"Charged Bolt: +5% Lightning Damage per Level<br>Chain Lightning: +5% Lightning Damage per Level<br>Lightning Mastery", graytext:"", index:[0,""], text:["Lightning Damage: ","-","<br>Mana Cost: ",""]},
{data:d242, key:"242", code:52, name:"Chain Lightning", i:16, req:[15,11], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a bolt of lightning that<br>arcs through several targets", syn_title:"<br>Chain Lightning Receives Bonuses From:<br>", syn_text:"Charged Bolt: +3% Lightning Damage per Level<br>Lightning Surge: +3% Lightning Damage per Level<br>Lightning Mastery", graytext:"", index:[0,""], text:[""," hits<br>Lightning Damage: ","-","<br>Mana Cost: ",""]},
{data:d243, key:"243", code:53, name:"Teleport", i:17, req:[13], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Exhaust your energy to<br>instantly move to a destination<br><br>Each teleport attempt drains 5% of maximum mana", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Mana Drain: ","<br>Mana Cost: 12",""]},
{data:d251, key:"251", code:54, name:"Discharge", i:18, req:[14,12], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Unleashes a burst of electricity all around you", syn_title:"<br>Discharge Receives Bonuses From:<br>", syn_text:"1% Increased Lightning Damage per 2 Energy<br>Nova: +3% Lightning Damage per Level<br>Static Field: +3% Lightning Damage per Level<br>Lightning Mastery", graytext:"", index:[0,""], text:["Cooldown: "," seconds<br>Lightning Damage: ","-","<br>Mana Cost: ",""]},
{data:d253, key:"253", code:55, name:"Energy Shield", i:19, req:[16,17,13,15,11], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:4, bindable:1, description:"Creates a magical shield that consumes mana<br>instead of health when you take damage", syn_title:"<br>Energy Shield Receives Bonuses From:<br>", syn_text:"Telekinesis: +4% efficiency per Level", graytext:"", index:[0,""], text:["Efficiency: "," percent<br>Duration: "," seconds<br>Absorbs "," percent<br>Mana Cost: 5",""]},
{data:d262, key:"262", code:56, name:"Lightning Mastery", i:20, req:[], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Increases the damage of your lightning skills<br>by piercing enemies' resistances to lightning", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Lightning Pierce: +"," percent<br>Lightning Damage: +"," percent",""]},
{data:d263, key:"263", code:57, name:"Thunder Storm", i:21, req:[19,16,17,13,15,11], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:0, bindable:1, description:"Summons a deadly thunderstorm that strikes<br>your enemies with bolts of lightning", syn_title:"<br>Thunder Storm Receives Bonuses From:<br>", syn_text:"Teleport: -0.12 seconds hit delay per Level<br>Telekinesis: +21% Lightning Damage per Level<br>Lightning Surge: +21% Lightning Damage per Level<br>Lightning Mastery", graytext:"", index:[1," seconds"], text:["Delay between hits: ","Duration: "," seconds<br>Lightning Damage: ","-","<br>Mana Cost: ",""]},

{data:d312, key:"312", code:58, name:"Fire Bolt", i:22, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a magical flaming missile<br><br>Mana Cost: 2.5", syn_title:"<br>Fire Bolt Receives Bonuses From:<br>", syn_text:"Fire Ball: +35% Fire Damage per Level<br>Meteor: +35% Fire Damage per Level<br>Fire Wall: +35% Fire Damage per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Fire Damage: ","-",""]},
{data:d313, key:"313", code:59, name:"Warmth", i:23, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Increases your accuracy and<br>the rate at which you recover mana", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["To Attack Rating: +"," percent<br>Mana Recovery Rate: +"," percent"]},
/*{data:d321, key:"321", code:60, name:"Blaze", i:24, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:4, bindable:1, description:"Your footsteps create areas of burning ground<br>that damages enemies and heals you<br><br>+2% Life Regenerated per Second<br>Fire Trail Duration: 1 second", syn_title:"<br>Blaze Receives Bonuses From:<br>", syn_text:"Immolate: +8% Average Fire Damage per Second per Level<br>Warmth: +3% Average Fire Damage per Second per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Average Fire Damage: ","-"," per second<br>Mana Cost: ",""]}, */
{data:d321, key:"321", code:60, name:"Inferno", i:24, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:4, bindable:1, description:"Creates a continuous jet of flame to scorch <br> your enemies<br><br>Requires a minimum of 4 mana to cast", syn_title:"<br>Inferno Receives Bonuses From:<br>", syn_text:"Warmth: +25% Average Fire Damage per Second per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Average Fire Damage: ","-"," per second<br>Mana Cost: ",""]},
{data:d331, key:"331", code:61, name:"Immolate", i:25, req:[24], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a fiery blast in front of you<br>engulfing enemies with intense heat<br><br>Radius: 7 yards", syn_title:"<br>Immolate Receives Bonuses From:<br>", syn_text:"Warmth: +4% Fire Damage per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Fire Damage: ","-","<br>Mana Cost: ",""]},
{data:d332, key:"332", code:62, name:"Fire Ball", i:26, req:[22], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates an explosive sphere of fiery death<br>to engulf your enemies<br><br>Radius: 3 yards", syn_title:"<br>Fire Ball Receives Bonuses From:<br>", syn_text:"Fire Bolt: +6% Fire Damage per Level<br>Meteor: +6% Fire Damage per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Fire Damage: ","-","<br>Mana Cost: ",""]},
{data:d341, key:"341", code:63, name:"Fire Wall", i:27, req:[25,24], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Creates a wall of flame that<br>blocks or burns your enemies", syn_title:"<br>Fire Wall Receives Bonuses From:<br>", syn_text:"Warmth: +4% Fire Damage per Level<br>Inferno: +4% Fire Damage per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Fire Duration: 3.6 seconds<br>Average Fire Damage: ","-"," per second<br>"," yards<br>Mana Cost: ",""]},
{data:d343, key:"343", code:64, name:"Enflame", i:28, req:[23,26,22], reqlvl:18, level:0, extra_levels:0, force_levels:0, effect:3, bindable:0, description:"Activated Aura - Heats your party's weapons<br>While active, adds fire damage to allies near you<br><br>Mana Cost: 25", syn_title:"<br>Enflame Receives Bonuses From:<br>", syn_text:"Warmth: +12% Fire Damage per Level<br>Fire Bolt: +12% Fire Damage per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Fire Damage (self): ","-","<br>Fire Damage (allies): ","-","<br>Attack Bonus: +"," percent"]},
//{data:d352, key:"352", code:65, name:"Meteor", i:29, req:[26,27,22,25,24], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Summons a meteor from the heavens<br>to crush and incinerate your enemies<br><br>Gains Physical Damage equal to 35% of Fire Damage", syn_title:"<br>Meteor Receives Bonuses From:<br>", syn_text:"Fire Bolt: +6% Fire Damage per Level<br>Fire Ball: +6% Fire Damage per Level<br>Inferno: +3% Average Fire Damage per Second per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Damage: ","-","<br>Fire Damage: ","-","<br>Radius: 4 yards<br>Average Fire Damage: ","-"," per second<br>Mana Cost: ",""]},
{data:d352, key:"352", code:65, name:"Meteor", i:29, req:[26,27,22,25,24], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Summons a meteor from the heavens<br>to crush and incinerate your enemies<br><br>Gains Physical Damage equal to 35% of Fire Damage", syn_title:"<br>Meteor Receives Bonuses From:<br>", syn_text:"Fire Bolt: +6% Fire Damage per Level<br>Fire Ball: +6% Fire Damage per Level<br>Inferno: +3% Average Fire Damage per Second per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Fire Damage: ","-","<br>Radius: 4 yards<br>Average Fire Damage: ","-"," per second<br>Mana Cost: ",""]},
{data:d362, key:"362", code:66, name:"Fire Mastery", i:30, req:[], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Increases the damage of your fire skills<br>by piercing enemies' resistances to fire", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Fire Pierce: +"," percent<br>Fire Damage: +"," percent",""]},
{data:d363, key:"363", code:67, name:"Hydra", i:31, req:[28,23,26,22], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Summons a multi-headed beast of flame<br>to reduce your enemies to ashes<br><br>Maximum Hydras: 4", syn_title:"<br>Hydra Receives Bonuses From:<br>", syn_text:"Warmth: +1% Fire Damage per Level<br>Fire Ball: +2% Fire Damage per Level<br>Fire Mastery", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Hydra Fire Damage: ","-","<br>Mana Cost: ",""]}
];
