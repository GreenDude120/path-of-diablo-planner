
var character_necromancer = {class_name:"Necromancer", strength:15, dexterity:25, vitality:15, energy:25, life:45, mana:25, stamina:179, levelup_life:2, levelup_stamina:1, levelup_mana:2, ar_per_dexterity:5, life_per_vitality:2, stamina_per_vitality:1, mana_per_energy:2, starting_strength:15, starting_dexterity:25, starting_vitality:15, starting_energy:25, ar_const:-10, block_const:6, skill_layout:"./images/skill_trees/PoD/necromancer.png", mana_regen:1.66,
	weapon_frames:{dagger:18, sword:[18,22], axe:[18,19], mace:[18,19], thrown:[18,18], staff:19, polearm:19, scepter:18, wand:18, javelin:18, spear:23, bow:17, crossbow:19},
	fcr_frames:15, fcr_bp:[0, 9, 18, 30, 48, 75, 125],
	fhr_frames:13, fhr_bp:[0, 5, 10, 16, 26, 39, 56, 86, 152, 377],
	fbr_frames:11, fbr_bp:[0, 6, 13, 20, 32, 52, 86, 174, 600],
	
	// getSkillData - gets skill info from the skills data table
	//	skill: skill object for the skill in question
	//	lvl: level of the skill
	//	elem: which element of the skill to return
	// result: value of the skill element at the specified level
	// ---------------------------------
	getSkillData : function(skill, lvl, elem) {
		var result = skill.data.values[elem][lvl];
		var sum_damage = 1; if (skills[0].level > 0 || skills[0].force_levels > 0) { sum_damage = (1+((~~skills[0].data.values[4][skills[0].level+skills[0].extra_levels]) / 100)) }; sum_damage += (character.summon_damage_bonus/100 + character.summon_damage/100);	// TODO: are both of these needed?
		var sum_life = 1; if (skills[0].level > 0 || skills[0].force_levels > 0) { sum_life = (1+((~~skills[0].data.values[3][skills[0].level+skills[0].extra_levels]) / 100)) };
		var diffResult = skill.data.values[elem][character.difficulty];
		
		if (skill.name == "Raise Skeleton Warrior" && elem < 2) {	result *= sum_damage }
		if (skill.name == "Raise Skeleton Warrior" && elem == 2) {	result = (sum_life * (diffResult + (8 * skill.level))) }
		if (skill.name == "Clay Golem" && elem < 2) {				result = (sum_damage * diffResult) }
		if (skill.name == "Clay Golem" && elem == 2) {				result = (sum_life * diffResult) }
		if (skill.name == "Raise Skeletal Mage" && elem < 7) {		result *= sum_damage }
		if (skill.name == "Raise Skeletal Mage" && elem == 7) {		result = (sum_life * (diffResult + (6 * skill.level))) }
		if (skill.name == "Blood Golem" && elem < 2) {				result = (sum_damage * diffResult) }
		if (skill.name == "Blood Golem" && elem == 2) {				result = (sum_life * diffResult) }
		if (skill.name == "Iron Golem" && elem < 2) {				result = (sum_damage * diffResult) }
		if (skill.name == "Iron Golem" && elem == 2) {				result = (sum_life * diffResult) }
		if (skill.name == "Fire Golem" && elem < 2) {				result *= sum_damage }
		if (skill.name == "Fire Golem" && elem == 2) {				result = (sum_life * diffResult + 0.01*skill.level*diffResult) }
		if (skill.name == "Fire Golem" && elem > 3 && elem < 6) {	result *= sum_damage }
		if (skill.name == "Revive" && elem == 0) {					result = (skill.data.values[elem][1] + Math.min(1,(skills[0].level+skills[0].force_levels))*~~skills[0].data.values[0][skills[0].level+skills[0].extra_levels]) }
		if (skill.name == "Revive" && elem == 1) {					result = (skill.data.values[elem][1] + Math.min(1,(skills[0].level+skills[0].force_levels))*~~skills[0].data.values[1][skills[0].level+skills[0].extra_levels]) }

		if (skill.name == "Corpse Explosion" && elem == 0) { 		if (skill.level == 0) { result = skill.data.values[elem][1] } else { result = skill.data.values[elem][skill.level] + character.bonus_corpse_explosion } }
		if (skill.name == "Corpse Explosion" && elem == 1) { 		if (skill.level == 0) { result = skill.data.values[elem][1] } else { result = skill.data.values[elem][skill.level] + character.bonus_corpse_explosion } }
		if (skill.name == "Corpse Explosion" && elem > 3) { 		result *= (1 + (0.12*skills[9].level)) }
//		if (skill.name == "Corpse Explosion" && elem < 2) { 		result *= (1 + (0.12*skills[9].level)) }
		if (skill.name == "Bone Armor" && elem == 0) { 					result += 20*skills[17].level + 20*skills[18].level }
		if (skill.name == "Bone Wall" && elem < 1) { 					result *= (1 + (0.10*skills[13].level)) }
		if (skill.name == "Teeth" && elem > 0 && elem < 3) { 			result *= ((1 + (0.17*skills[16].level + 0.17*skills[18].level)) * (1+character.mDamage/100)) }
		if (skill.name == "Bone Spear" && elem < 2) { 					result *= ((1 + (0.07*skills[12].level + 0.07*skills[18].level)) * (1+character.mDamage/100)) }
		if (skill.name == "Bone Spirit" && elem < 2) { 					result *= ((1 + (0.10*skills[12].level + 0.10*skills[16].level)) * (1+character.mDamage/100)) }
		if (skill.name == "Deadly Poison" && elem > 0 && elem < 3) { 	result *= ((1 + (0.10*skills[15].level + 0.10*skills[19].level)) * (1+character.pDamage/100)) }
		if (skill.name == "Deadly Poison" && elem == 4) { 				result = 7*(skills[11].level + character.all_skills + character.skills_poison_all + character.skills_ele_poison_all); }
		if (skill.name == "Desecrate" && elem > 0 && elem < 3) { 		result *= ((1 + (0.16*skills[11].level + 0.16*skills[19].level)) * (1+character.pDamage/100)) }
		if (skill.name == "Poison Nova" && elem < 2) { 					result *= ((1 + (0.13*skills[11].level + 0.13*skills[15].level)) * (1+character.pDamage/100)) }
		
		if (skill.name == "Hemorrhage" && elem < 1) { 				result *= (1 + (0.18*skills[23].level + 0.18*skills[24].level + 0.18*skills[27].level)) }
//		if (skill.name == "Hemorrhage" && elem == 3) { 					result = (7.3 + (0.7 * Math.floor(skills[21].level / 5)) + (0.7 * Math.floor(skills[22].level))) }

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
		
		if (skill.name == "Bone Offering") { result.summon_damage_bonus = skill.data.values[3][lvl]; result.duration = skill.data.values[0][lvl]; result.radius = skill.data.values[1][lvl]; }	// TODO: Implement for summons: result.defense_bonus = skill.data.values[2][lvl]; result.curse_length_reduced = skill.data.values[4][lvl]; 
		if (skill.name == "Flesh Offering") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { if (effect_id != id && effect_id.split("-")[0] == id) { disableEffect(effect_id) } } }
			result.duration = skill.data.values[0][lvl]; result.radius = skill.data.values[1][lvl];	// TODO: Implement for summons: result.fcr = skill.data.values[2][lvl]; result.ias_skill = skill.data.values[3][lvl]; result.velocity = skill.data.values[4][lvl]; 
		}
		if (skill.name == "Blood Golem") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { var idName = effect_id.split("-")[0]; if (effect_id != id && (idName == "Blood_Golem" || idName == "Iron_Golem" || idName == "Clay_Golem" || idName == "Fire_Golem")) { disableEffect(effect_id) } } }
			result.life_per_ranged_hit = skill.data.values[3][lvl]; result.life_per_hit = skill.data.values[4][lvl]; result.radius = skill.data.values[5][lvl];
		}
		if (skill.name == "Iron Golem") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { var idName = effect_id.split("-")[0]; if (effect_id != id && (idName == "Blood_Golem" || idName == "Iron_Golem" || idName == "Clay_Golem" || idName == "Fire_Golem")) { disableEffect(effect_id) } } }
			if (typeof(golemItem.aura) != 'undefined') { if (golemItem.aura != "" && golemItem.aura != "Righteous Fire") {
				var auraInfo = getAuraData(golemItem.aura, golemItem.aura_lvl, "golem");
				for (affix in auraInfo) { result[affix] = auraInfo[affix] }
			} }
		}
		if (skill.name == "Deadly Poison") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { if (effect_id != id && effect_id.split("-")[0] == id) { disableEffect(effect_id) } } }
			result.pDamage_min = skill.data.values[1][lvl] * (1 + (0.10*skills[15].level + 0.10*skills[19].level));
			result.pDamage_max = skill.data.values[2][lvl] * (1 + (0.10*skills[15].level + 0.10*skills[19].level));
			result.pDamage_duration = 2; result.pDamage_duration_override = 2; result.duration = skill.data.values[0][lvl]; result.ar_bonus = 7*(skills[11].level + character.all_skills + character.skills_poison_all + character.skills_ele_poison_all);
//			result.pDamage_duration = 2; result.pDamage_duration_override = 2; result.enemy_pRes = skill.data.values[3][lvl]; result.duration = skill.data.values[0][lvl];
		}
		if (skill.name == "Bone Armor") { result.absorb_melee = skill.data.values[0][lvl] + 20*skills[17].level + 20*skills[18].level; }
		// No stat buffs:
		if (skill.name == "Clay Golem") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { var idName = effect_id.split("-")[0]; if (effect_id != id && (idName == "Blood_Golem" || idName == "Iron_Golem" || idName == "Clay_Golem" || idName == "Fire_Golem")) { disableEffect(effect_id) } } }
			result.slow_target = skill.data.values[3][lvl];
		}
		if (skill.name == "Fire Golem") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { var idName = effect_id.split("-")[0]; if (effect_id != id && (idName == "Blood_Golem" || idName == "Iron_Golem" || idName == "Clay_Golem" || idName == "Fire_Golem")) { disableEffect(effect_id) } } }
			result.amountSummoned = 1+character.extraFireGolem;
		}
		if (skill.name == "Raise Skeleton Warrior") { result.amountSummoned = skill.data.values[3][lvl]; }
		if (skill.name == "Raise Skeletal Mage") { result.amountSummoned = skill.data.values[8][lvl]; }
		if (skill.name == "Revive") { result.amountSummoned = skill.data.values[2][lvl]; result.duration = 600; }
		// Debuffs:
		if (skill.name == "Amplify Damage") { enemy_physRes = -100; result.radius = skill.data.values[0][lvl]; result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Dim Vision") { result.dimmedVision = 1; result.radius = skill.data.values[0][lvl]; result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Weaken") { result.enemy_damage = -33; result.radius = skill.data.values[0][lvl]; result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Iron Maiden") { result.thorns_reflect = skill.data.values[0][lvl]; result.radius = skill.data.values[2][lvl]; result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Terror") { result.fleeing = 1; result.radius = skill.data.values[0][lvl]; result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Confuse") { result.confused = 1; result.radius = skill.data.values[0][lvl]; result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Life Tap") { result.life_leech = skill.data.values[0][lvl]; result.radius = skill.data.values[1][lvl]; result.duration = skill.data.values[2][lvl]; }
		if (skill.name == "Attract") { result.attraction = 1; result.radius = 5.3; result.duration = skill.data.values[0][lvl]; }
		if (skill.name == "Decrepify") { enemy_physRes = -50; enemy_damage = -50; enemy_ias = -50; enemy_frw = -50; result.radius = skill.data.values[0][lvl]; result.duration = 10; }
		if (skill.name == "Lower Resist") { result.enemy_allRes = skill.data.values[2][lvl]; result.radius = skill.data.values[0][lvl]; result.duration = skill.data.values[1][lvl]; }
		
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
		
		if (skill.name == "Raise Skeleton Warrior") {	attack = 0; spell = 1; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Clay Golem") {			attack = 0; spell = 1; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Raise Skeletal Mage") {	attack = 0; spell = 1; lDamage_min = character.getSkillData(skill,lvl,0)/4; lDamage_max = character.getSkillData(skill,lvl,1)/4; cDamage_min = character.getSkillData(skill,lvl,2)/4; cDamage_max = character.getSkillData(skill,lvl,3)/4; fDamage_min = character.getSkillData(skill,lvl,4)/4; fDamage_max = character.getSkillData(skill,lvl,5)/4; pDamage_min = character.getSkillData(skill,lvl,6)/4; pDamage_max = character.getSkillData(skill,lvl,6)/4; pDamage_duration = 1.5; }
		else if (skill.name == "Blood Golem") {			attack = 0; spell = 1; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Iron Golem") {			attack = 0; spell = 1; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Fire Golem") {			attack = 0; spell = 1; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
	//	else if (skill.name == "Revive") {				attack = 0; spell = 2; }
		else if (skill.name == "Teeth") {				attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,1); mDamage_max = character.getSkillData(skill,lvl,2); }
		//else if (skill.name == "Teeth") {				attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,1) + (character.getSkillData(skill,lvl,1) * (mDamage/100)); mDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Desecrate") {			attack = 0; spell = 1; pDamage_min = character.getSkillData(skill,lvl,1); pDamage_max = character.getSkillData(skill,lvl,2); pDamage_duration = 2; }
		else if (skill.name == "Bone Spear") {			attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,0); mDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Bone Spirit") {			attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,0); mDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Poison Nova") {			attack = 0; spell = 1; pDamage_min = character.getSkillData(skill,lvl,0); pDamage_max = character.getSkillData(skill,lvl,1); pDamage_duration = 2; }
		else if (skill.name == "Corpse Explosion") {	attack = 0; spell = 1; fDamage_min = character.getSkillData(skill,lvl,4); fDamage_max = character.getSkillData(skill,lvl,5); }
	//	else if (skill.name == "Corpse Explosion") {	attack = 0; spell = 2; }
		else if (skill.name == "Hemorrhage") {			attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,0); mDamage_max = character.getSkillData(skill,lvl,0); }
		
		if (attack == 0) { phys_min = 0; phys_max = 0; phys_mult = 1; nonPhys_min = 0; nonPhys_max = 0; damage_enhanced = 0; }
		nonPhys_min += (fDamage_min + cDamage_min + lDamage_min + pDamage_min + mDamage_min);
		nonPhys_max += (fDamage_max + cDamage_max + lDamage_max + pDamage_max + mDamage_max);
		phys_min = (~~phys_min * (phys_mult + damage_bonus/100) * (1 + (weapon_damage-100)/100) + (damage_min * (1+(damage_bonus+damage_enhanced)/100)));
		phys_max = (~~phys_max * (phys_mult + damage_bonus/100) * (1 + (weapon_damage-100)/100) + (damage_max * (1+(damage_bonus+damage_enhanced+(character.level*character.e_max_damage_per_level))/100)));
		if (spell != 2) { skillMin = Math.floor(phys_min+nonPhys_min); skillMax = Math.floor(phys_max+nonPhys_max); }
		if (spell == 0) { skillAr = Math.floor(ar*(1+ar_bonus/100)); }

		// Get breakdown of sources of skill damage
		skill2Breakdown = "Skill damage Breakdown-" ;  // \nPhys Damage: " + phys_min + "-" + phys_max +  "\nFire Damage: " + fDamage_min + "-" + fDamage_max + "\nCold Damage: " + cDamage_min + "-" + cDamage_max + "\nLight Damage: " + lDamage_min + "-" + lDamage_max  + "\nMagic Damage: " + mDamage_min + "-" + mDamage_max  + "\nPoison Damage: " + pDamage_min + "-" + pDamage_max ;
		if (damage_min > 0) {skill2Breakdown += "\nSkill Damage: " + Math.floor(damage_min) + "-" + Math.floor(damage_max)};
		if (phys_min > 0) {skill2Breakdown += "\nSkill Phys Damage: " + Math.floor(phys_min) + "-" + Math.floor(phys_max)};
		if (fDamage_min > 0) {skill2Breakdown += "\nSkill Fire Damage: " + Math.floor(fDamage_min) + "-" + Math.floor(fDamage_max)};
		if (cDamage_min > 0) {skill2Breakdown += "\nSkill Cold Damage: " + Math.floor(cDamage_min) + "-" + Math.floor(cDamage_max)};
		if (lDamage_min > 0) {skill2Breakdown += "\nSkill Light Damage: " + Math.floor(lDamage_min) + "-" + Math.floor(lDamage_max)};
		if (mDamage_min > 0) {skill2Breakdown += "\nSkill Magic Damage: " + Math.floor(mDamage_min) + "-" + Math.floor(mDamage_max)};
		if (pDamage_min > 0) {skill2Breakdown += "\nSkill Poison Damage: " + Math.floor(pDamage_min) + "-" + Math.floor(pDamage_max)};
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
		skills[s].extra_levels += character.skills_necromancer
		if (s == 14) { skills[s].extra_levels += (character.skills_fire_all + character.skills_ele_poison_all)}
		if (s == 11 || s == 15 || s == 19) { skills[s].extra_levels += (character.skills_poison_all + character.skills_ele_poison_all)}
		if (s == 12 || s == 16 || s == 18) { skills[s].extra_levels += character.skills_magic_all }
		if (s == 1 || s == 3 || s == 5 || s == 6 || s == 8 || s == 9 || s == 10) { skills[s].extra_levels += character.skills_summon_all }
		
//		if (s == 11 || s == 15 || s == 19) { skills[s].extra_levels += character.skills_ele_poison_all }
		if (s < 11) {
			skills[s].extra_levels += character.skills_summoning_necromancer
			skills[s].extra_levels += character.skills_tree1
//			skills[s].extra_levels += character.skills_summon_all
		} else if (s > 19) {
			skills[s].extra_levels += character.skills_curses
			skills[s].extra_levels += character.skills_tree3
		} else {
			skills[s].extra_levels += character.skills_poisonBone
			skills[s].extra_levels += character.skills_tree2
		}
	}
};

/*[ 0] Summon Mastery	*/ var d111 = {values:[
		["revive life",5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,], 
		["revive damage",9,14,19,24,29,34,39,44,49,54,59,64,69,74,79,84,89,94,99,104,109,114,119,124,129,134,139,144,149,154,159,164,169,174,179,184,189,194,199,204,209,214,219,224,229,234,239,244,249,254,259,264,269,274,279,284,289,294,299,304,], 
		["defense",30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,], 
		["life",30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,], 
		["damage",15,27,39,51,63,75,87,99,111,123,135,147,159,171,183,195,207,219,231,243,255,267,279,291,303,315,327,339,351,363,375,387,399,411,423,435,447,459,471,483,495,507,519,531,543,555,567,579,591,603,615,627,639,651,663,675,687,699,711,723,], 
		["attack rating",30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,], 
		["resistances",15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,], 
]};
/*[ 1] Skeleton Warrior	*/ var d113 = {values:[
		["damage min",2,4,6,8,10,12,14,16,19,22,25,28,31,34,37,40,47,54,61,68,75,82,93,104,115,126,137,148,168,188,208,228,248,268,288,308,328,348,368,388,408,428,448,468,488,508,528,548,568,588,608,628,648,668,688,708,728,748,768,788,], 
		["damage max",3,5,7,9,11,13,15,17,20,23,26,29,32,35,38,41,48,55,62,69,76,83,94,105,116,127,138,149,169,189,209,229,249,269,289,309,329,349,369,389,409,429,449,469,489,509,529,549,569,589,609,629,649,669,689,709,729,749,769,789,], 
		["base life",25,100,200,], 
		["skeletons",1,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18,19,19,19,20,20,20,21,21,21,22,], 
		["mana cost",6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,], 
]};
/*[ 2] Bone Offering	*/ var d121 = {values:[
		["duration",5,5.2,5.4,5.6,5.8,6,6.2,6.4,6.6,6.8,7,7.2,7.4,7.6,7.8,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.8,11,11.2,11.4,11.6,11.8,12,12.2,12.4,12.6,12.8,13,13.2,13.4,13.6,13.8,14,14.2,14.4,14.6,14.8,15,15.2,15.4,15.6,15.8,16,16.2,16.4,16.6,16.8,], 
		["radius",12,12.7,13.3,14,14.7,15.3,16,16.7,17.3,18,18.7,19.3,20,20.7,21.3,22,22.7,23.3,24,24.7,25.3,26,26.7,27.3,28,28.7,29.3,30,30.7,31.3,32,32.7,33.3,34,34.7,35.3,36,36.7,37.3,38,38.7,39.3,40,40.7,41.3,42,42.7,43.3,44,44.7,45.3,46,46.7,47.3,48,48.7,49.3,50,50.7,51.3,], 
		["defense",17,24,30,35,39,42,44,46,48,50,52,53,54,55,56,57,58,58,59,60,60,61,61,62,62,63,63,63,64,64,65,65,65,65,65,66,66,66,66,66,66,67,67,67,68,68,68,68,68,68,68,68,68,69,69,69,69,69,69,70,], 
		["skeleton damage",10,16,22,28,34,40,46,52,58,64,70,76,82,88,94,100,106,112,118,124,130,136,142,148,154,160,166,172,178,184,190,196,202,208,214,220,226,232,238,244,250,256,262,268,274,280,286,292,298,304,310,316,322,328,334,340,346,352,358,364,], 
		["curse duration",5,8,11,14,17,20,23,26,29,32,35,38,41,44,47,50,53,56,59,62,65,68,71,74,77,80,83,86,89,92,95,98,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,], 
		["mana cost",6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,], 
]};
/*[ 3] Clay Golem		*/ var d122 = {values:[
		["base damage min",5,100,200,], 
		["base damage max",10,200,300,], 
		["base life",150,300,1200,], 
		["slow target",2,4,5,6,7,8,8,9,9,10,10,10,11,11,11,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,15,], 
		["mana cost",15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,], 
]};
/*[ 4] Flesh Offering	*/ var d131 = {values:[
		["duration",5,5.2,5.4,5.6,5.8,6,6.2,6.4,6.6,6.8,7,7.2,7.4,7.6,7.8,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.8,11,11.2,11.4,11.6,11.8,12,12.2,12.4,12.6,12.8,13,13.2,13.4,13.6,13.8,14,14.2,14.4,14.6,14.8,15,15.2,15.4,15.6,15.8,16,16.2,16.4,16.6,16.8,], 
		["radius",12,12.7,13.3,14,14.7,15.3,16,16.7,17.3,18,18.7,19.3,20,20.7,21.3,22,22.7,23.3,24,24.7,25.3,26,26.7,27.3,28,28.7,29.3,30,30.7,31.3,32,32.7,33.3,34,34.7,35.3,36,36.7,37.3,38,38.7,39.3,40,40.7,41.3,42,42.7,43.3,44,44.7,45.3,46,46.7,47.3,48,48.7,49.3,50,50.7,51.3,], 
		["cast rate",4,7,9,11,13,14,15,15,16,17,18,18,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,], 
		["attack speed",13,18,22,25,28,30,32,33,35,36,37,38,39,40,40,41,41,42,42,43,43,43,44,44,44,45,45,45,46,46,46,46,46,46,46,47,47,47,47,47,47,48,48,48,48,48,48,48,49,49,49,49,49,49,49,49,49,49,49,50,], 
		["movement speed",6,11,15,18,20,22,24,25,26,27,28,29,30,31,31,32,32,32,33,33,34,34,35,35,35,35,36,36,36,36,36,36,37,37,37,37,37,38,38,38,38,38,38,38,38,38,38,38,39,39,39,39,39,39,39,39,39,39,39,40,], 
		["mana cost",15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,], 
]};
/*[ 5] Skeletal Mage	*/ var d133 = {values:[
		["lightning min",2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,], 
		["lightning max",19,27,35,43,51,59,67,79,91,103,115,127,139,151,163,179,195,211,227,243,259,283,307,331,355,379,403,439,475,511,547,583,619,655,691,727,763,799,835,871,907,943,979,1015,1051,1087,1123,1159,1195,1231,1267,1303,1339,1375,1411,1447,1483,1519,1555,1591,], 
		["cold min",4,5,6,7,8,9,10,13,16,19,22,25,28,31,34,39,44,49,54,59,64,73,82,91,100,109,118,133,148,163,178,193,208,223,238,253,268,283,298,313,328,343,358,373,388,403,418,433,448,463,478,493,508,523,538,553,568,583,598,613,], 
		["cold max",6,8,10,12,14,16,18,22,26,30,34,38,42,46,50,56,62,68,74,80,86,96,106,116,126,136,146,162,178,194,210,226,242,258,274,290,306,322,338,354,370,386,402,418,434,450,466,482,498,514,530,546,562,578,594,610,626,642,658,674,], 
		["fire min",6,8,10,12,14,16,18,22,26,30,34,38,42,46,50,56,62,68,74,80,86,96,106,116,126,136,146,162,178,194,210,226,242,258,274,290,306,322,338,354,370,386,402,418,434,450,466,482,498,514,530,546,562,578,594,610,626,642,658,674,], 
		["fire max",10,14,18,22,26,30,34,40,46,52,58,64,70,76,82,90,98,106,114,122,130,142,154,166,178,190,202,220,238,256,274,292,310,328,346,364,382,400,418,436,454,472,490,508,526,544,562,580,598,616,634,652,670,688,706,724,742,760,778,796,], 
		["poison damage",10,14,18,22,26,30,34,40,46,52,58,64,70,76,82,90,98,106,114,122,130,142,154,166,178,190,202,220,238,256,274,292,310,328,346,364,382,400,418,436,454,472,490,508,526,544,562,580,598,616,634,652,670,688,706,724,742,760,778,796,], 
		["base life",75,150,200,], 
		["magi",1,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18,19,19,19,20,20,20,21,21,21,22,], 
		["mana cost",8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,], 
]};
/*[ 6] Blood Golem		*/ var d142 = {values:[
		["base damage min",10,200,350,], 
		["base damage max",20,300,500,], 
		["base life",300,450,1500,], 
		["life per ranged hit",2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,], 
		["life per melee hit",3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,], 
		["radius",7,7.3,7.6,8,8.3,8.6,9,9.3,9.6,10,10.3,10.6,11,11.3,11.6,12,12.3,12.6,13,13.3,13.6,14,14.3,14.6,15,15.3,15.6,16,16.3,16.6,17,17.3,17.6,18,18.3,18.6,19,19.3,19.6,20,20.3,20.6,21,21.3,21.6,22,22.3,22.6,23,23.3,23.6,24,24.3,24.6,25,25.3,25.6,26,26.3,26.6,], 
		["life stolen",49,56,61,66,70,73,75,77,79,80,82,83,85,86,86,88,88,89,89,90,91,91,92,92,92,93,94,94,94,94,95,95,95,95,95,96,96,97,97,97,97,97,97,97,98,98,98,98,98,98,98,98,98,99,99,99,99,99,99,100,], 
		["mana cost",25,29,33,37,41,45,49,53,57,61,65,69,73,77,81,85,89,93,97,101,105,109,113,117,121,125,129,133,137,141,145,149,153,157,161,165,169,173,177,181,185,189,193,197,201,205,209,213,217,221,225,229,233,237,241,245,249,253,257,261,], 
]};
/*[ 7] Convocation		*/ var d151 = {values:[
		["cooldown",9.7,9.4,9.1,8.8,8.6,8.3,8,7.7,7.4,7.2,6.9,6.6,6.3,6,5.8,5.5,5.2,4.9,4.6,4.4,4.1,3.8,3.5,3.2,3,2.7,2.4,2.1,1.8,1.6,1.3,1,0.7,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,], 
]};
/*[ 8] Iron Golem		*/ var d152 = {values:[
		["base damage min",20,250,300,], 
		["base damage max",30,350,400,], 
		["base life",350,500,1000,], 
		["damage returned",200,230,260,290,320,350,380,410,440,470,500,530,560,590,620,650,680,710,740,770,800,830,860,890,920,950,980,1010,1040,1070,1100,1130,1160,1190,1220,1250,1280,1310,1340,1370,1400,1430,1460,1490,1520,1550,1580,1610,1640,1670,1700,1730,1760,1790,1820,1850,1880,1910,1940,1970,], 
]};
/*[ 9] Fire Golem		*/ var d162 = {values:[
		["base fire min",32,37,42,52,62,72,82,92,102,112,122,147,172,197,222,247,272,322,372,422,472,522,572,662,752,842,932,1022,1112,1202,1292,1382,1472,1562,1652,1742,1832,1922,2012,2102,2192,2282,2372,2462,2552,2642,2732,2822,2912,3002,3092,3182,3272,3362,3452,3542,3632,3722,3812,3902,], 
		["base fire max",67,77,87,102,117,132,147,162,177,192,207,242,277,312,347,382,417,492,567,642,717,792,867,982,1097,1212,1327,1442,1557,1672,1787,1902,2017,2132,2247,2362,2477,2592,2707,2822,2937,3052,3167,3282,3397,3512,3627,3742,3857,3972,4087,4202,4317,4432,4547,4662,4777,4892,5007,5122,], 
		["base life",350,600,1800,], 
		["absorbs",36,45,52,58,62,66,69,71,74,76,78,79,81,82,83,85,85,86,87,88,88,89,90,90,91,91,92,92,93,93,94,94,94,94,94,95,95,96,96,96,96,96,96,96,97,97,97,97,98,98,98,98,98,99,99,99,99,99,99,100,], 
		["holy fire min",5,6,7,8,10,12,14,16,18,20,22,24,29,34,39,44,49,54,64,74,84,94,104,114,132,150,168,186,204,222,240,258,276,294,312,330,348,366,384,402,420,438,456,474,492,510,528,546,564,582,600,618,636,654,672,690,708,726,744,762,], 
		["holy fire max",11,13,15,17,20,23,26,29,32,35,38,41,48,55,62,69,76,83,98,113,128,143,158,173,196,219,242,265,288,311,334,357,380,403,426,449,472,495,518,541,564,587,610,633,656,679,702,725,748,771,794,817,840,863,886,909,932,955,978,1001,], 
		["mana cost",50,58,66,74,83,90,98,106,114,122,130,138,146,154,162,170,178,186,194,202,210,218,226,234,242,250,258,266,274,282,290,298,306,314,322,330,338,346,354,362,370,378,386,394,402,410,418,426,434,442,450,458,466,474,482,490,498,506,514,522,], 
]};
/*[10] Revive			*/ var d163 = {values:[
		["bonus life",150,], 
		["bonus damage",0,], 
		["monsters",1,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,6,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,10,10,10,10,10,11,11,11,11,11,12,12,12,12,12,13,13,13,13,13,14,], 
]};

/*[11] Deadly Poison	*/ var d211 = {values:[
		["duration",120,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180,184,188,192,196,200,204,208,212,216,220,224,228,232,236,240,244,248,252,256,260,264,268,272,276,280,284,288,292,296,300,304,308,312,316,320,324,328,332,336,340,344,348,352,356,], 
		["poison min",9,21,34,46,59,71,84,96,121,146,171,196,221,246,271,296,359,421,484,546,609,672,790,909,1028,1147,1265,1384,1528,1672,1815,1959,2103,2247,2390,2534,2678,2822,2965,3109,3253,3397,3540,3684,3828,3972,4115,4259,4403,4547,4690,4834,4978,5122,5265,5409,5552,5696,5839,5983,], 
		["poison max",21,34,46,59,71,84,96,109,134,159,184,209,234,259,284,309,371,434,496,559,622,684,803,922,1040,1159,1278,1397,1540,1684,1828,1972,2115,2259,2403,2547,2690,2834,2978,3122,3265,3409,3553,3697,3840,3984,4128,4272,4415,4559,4703,4847,4990,5134,5278,5422,5565,5709,5852,5996,], 
//		["enemy resist",-3,-5,-7,-8,-10,-10,-11,-12,-12,-13,-13,-14,-14,-14,-15,-15,-15,-15,-15,-16,-16,-16,-16,-16,-16,-17,-17,-17,-17,-17,-17,-17,-17,-17,-17,-17,-17,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,-18,], 
		["mana cost",3,3.2,3.5,3.7,4,4.2,4.5,4.7,5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.5,17.7,], 
		["attack rating",], 
]};
/*[12] Teeth			*/ var d212 = {values:[
		["teeth",3,4,5,6,7,8,9,10,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,], 
		["damage min",2,4,6,8,10,12,14,16,20,24,28,32,36,40,44,48,55,62,69,76,83,90,101,112,123,134,145,156,170,184,198,212,226,240,254,268,282,296,310,324,338,352,366,380,394,408,422,436,450,464,478,492,506,520,534,548,562,576,590,604,], 
		["damage max",4,7,10,13,16,19,22,25,30,35,40,45,50,55,60,65,74,83,92,101,110,119,133,147,161,175,189,203,222,241,260,279,298,317,336,355,374,393,412,431,450,469,488,507,526,545,564,583,602,621,640,659,678,697,716,735,754,773,792,811,], 
		["mana cost",3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,], 
]};
/*[13] Bone Armor		*/ var d213 = {values:[
		["absorbs",30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345,360,375,390,405,420,435,450,465,480,495,510,525,540,555,570,585,600,615,630,645,660,675,690,705,720,735,750,765,780,795,810,825,840,855,870,885,900,915,], 
		["mana cost",11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,], 
]};
/*[14] Corpse Explosion	*/ var d233 = {values:[
		["damage min",21,21,22,22,22,23,23,23,24,24,24,25,25,25,26,26,26,27,27,27,28,28,28,29,29,29,30,30,30,31,31,31,32,32,32,33,33,33,34,34,34,], 
		["damage max",27,27,28,28,28,29,29,29,30,30,30,31,31,31,32,32,32,33,33,33,34,34,34,35,35,35,36,36,36,37,37,37,38,38,38,39,39,39,40,40,40,], 
		["radius",4,4.3,4.6,5,5.3,5.6,6,6.3,6.6,7,7.3,7.6,8,8.3,8.6,9,9.3,9.6,10,10.3,10.6,10.9,11.2,11.5,11.8,12.1,12.4,12.7,13,13.3,13.6,13.9,14.2,14.5,14.8,15.1,15.4,15.7,16,16.3,16.6,16.9,17.2,17.5,17.8,18.1,18.4,18.7,19,19.3,19.6,19.9,20.2,20.5,20.8,21.1,21.4,21.7,22,22.3,], 
		["mana cost",15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,], 
//		["fire min",8,11,14,17,20,23,26,29,33,37,41,45,49,53,57,61,77,93,109,125, 140, 156, 185, 212, 240, 268, 296, 325, 370, 416, 462, 508, 555, 600, 646, 692, 738, 785, 830, 876, 922, 968, 1015, 1060, 1106, 1152,], 
//		["fire max",11,14,17,20,23,26,29,32,37,42,47,52,57,62,67,72,89,106,123,140, 156, 173, 202, 231, 260, 290, 318, 347, 395, 441, 488, 535, 582, 630, 676, 723, 770, 817, 865, 911, 958, 1005, 1052, 1100, 1146, 1193,], 
		["fire min",8,11,14,17,20,23,26,29,33,37,41,45,49,53,57,61,77,93,109,125, 140, 156, 185, 212, 240, 268, 296, 325, 370, 416, 462, 508, 555, 600, 646, 692, 738, 785, 830, 876, 922, 968, 1015, 1060, 1106, 1152,1198, 1244, 1290, 1337, 1382, 1428, 1474, 1520, 1567, 1612, 1658, 1704, 1750, 1797, 1842, 1888, 1934, 1980, 2027, 2072, 2118, 2164, 2210, 2257,], 
		["fire max",11,14,17,20,23,26,29,32,37,42,47,52,57,62,67,72,89,106,123,140, 156, 173, 202, 231, 260, 290, 318, 347, 395, 441, 488, 535, 582, 630, 676, 723, 770, 817, 865, 911, 958, 1005, 1052, 1100, 1146, 1193,1240, 1287, 1335, 1381, 1428, 1475, 1522, 1570, 1616, 1663, 1710, 1757, 1805, 1851, 1898, 1945, 1992, 2040, 2086, 2133, 2180, 2227, 2275, 2321,], 
//		["fire min",8,11,14,17,20,23,26,29,33,37,41,45,49,53,57,61,77,93,109,125,145,151,157,163,169,175,181,187,193,199,205,211,217,223,229,235,241,247,253,259,], 
//		["fire max",11,14,17,20,23,26,29,32,37,42,47,52,57,62,67,72,89,106,123,140,162,169,176,183,190,197,204,211,218,225,232,239,246,253,260,267,274,281,288,295,], 
]};
/*[15] Desecrate		*/ var d241 = {values:[
		["cooldown",5.7,5.4,5.1,4.8,4.6,4.3,4,3.7,3.4,3.2,2.9,2.6,2.3,2,1.8,1.5,1.2,0.9,0.6,0.4,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,], 
		["poison min",49,65,81,97,112,128,143,159,184,209,234,259,284,309,334,359,406,453,499,547,593,640,697,753,809,866,922,978,1056,1134,1212,1291,1368,1447,1524,1602,1680,1758,1836,1914,1992,2070,2148,2227,2306,2384,2461,2539,2616,2694,2772,2849,2927,3004,3082,3159,3237,3315,3392,3470,], 
		["poison max",118,134,149,165,181,197,212,228,253,278,303,328,353,378,403,428,474,522,568,616,662,709,766,822,878,934,991,1047,1124,1203,1281,1359,1437,1516,1593,1671,1749,1827,1905,1983,2061,2139,2217,2295,2374,2453,2531,2609,2688,2766,2845,2923,3002,3080,3159,3237,3316,3394,3472,3551,], 
		["mana cost",5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.5,17.7,18,18.2,18.5,18.7,19,19.2,19.5,19.7,], 
]};
/*[16] Bone Spear		*/ var d242 = {values:[
		["damage min",36,56,78,98,120,140,162,182,215,247,279,310,343,375,407,438,486,533,579,626,674,721,777,833,889,945,1001,1056,1125,1194,1264,1333,1402,1470,1539,1608,1677,1746,1815,1884,1953,2022,2091,2160,2230,2298,2367,2436,2505,2574,2643,2712,2781,2850,2919,2988,3057,3126,3195,3264,], 
		["damage max",58,79,100,121,141,163,183,205,236,268,301,333,364,396,429,461,507,554,602,649,695,743,798,854,910,966,1022,1079,1148,1217,1286,1354,1423,1493,1562,1631,1700,1769,1838,1907,1976,2045,2114,2183,2252,2321,2390,2459,2528,2597,2666,2735,2804,2873,2942,3011,3080,3149,3218,3287,], 
		["mana cost",7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.5,17.7,18,18.2,18.5,18.7,19,19.2,19.5,19.7,20,20.2,20.5,20.7,21,21.2,21.5,21.7,], 
]};
/*[17] Bone Wall		*/ var d243 = {values:[
		["life",431,528,626,725,823,920,1018,1116,1215,1312,1410,1508,1606,1704,1802,1900,1998,2095,2194,2292,2390,2487,2585,2684,2782,2879,2977,3075,3174,3271,3369,3467,3565,3663,3761,3859,3957,4055,4153,4251,4349,4446,4545,4643,4741,4838,4936,5035,5133,5230,5328,5426,5525,5622,5720,5818,5916,6014,6112,6210,], 
]};
/*[18] Bone Spirit		*/ var d253 = {values:[
		["damage min",63,100,136,172,208,243,280,316,356,396,436,476,516,556,596,636,686,736,786,836,886,936,991,1046,1101,1156,1211,1266,1326,1386,1446,1506,1566,1626,1686,1746,1806,1866,1926,1986,2046,2106,2166,2226,2286,2346,2406,2466,2526,2586,2646,2706,2766,2826,2886,2946,3006,3066,3126,3186,], 
		["damage max",96,132,168,203,240,276,312,348,388,428,468,508,548,588,628,668,718,768,818,868,918,968,1023,1078,1133,1188,1243,1298,1358,1418,1478,1538,1598,1658,1718,1778,1838,1898,1958,2018,2078,2138,2198,2258,2318,2378,2438,2498,2558,2618,2678,2738,2798,2858,2918,2978,3038,3098,3158,3218,], 
		["mana cost",12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,17,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,40,40.5,41,41.5,], 
]};
/*[19] Poison Nova		*/ var d261 = {values:[
		["poison min",65,81,96,112,128,144,159,175,200,225,250,275,300,325,350,375,412,450,487,525,562,600,659,719,778,837,897,956,1022,1087,1153,1219,1284,1350,1415,1481,1547,1612,1678,1744,1809,1875,1941,2006,2072,2137,2203,2269,2334,2400,2465,2531,2597,2662,2728,2794,2859,2925,2990,3056,], 
		["poison max",121,137,152,168,184,199,215,231,256,281,306,331,356,381,406,431,468,506,543,581,619,656,715,775,834,894,953,1012,1078,1144,1209,1275,1340,1406,1472,1537,1603,1669,1734,1800,1866,1931,1997,2063,2128,2194,2259,2325,2391,2456,2522,2587,2653,2719,2784,2850,2916,2981,3047,3112,], 
]};

/*[20] Amplify Damage	*/ var d312 = {values:[
		["radius",4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,17.9,18.6,19.3,19.9,20.6,21.3,21.9,22.6,23.3,23.9,24.6,25.3,25.9,26.6,27.3,27.9,28.6,29.3,29.9,30.6,31.3,31.9,32.6,33.3,33.9,34.6,35.3,35.9,36.6,37.3,37.9,38.6,39.3,39.9,40.6,41.3,41.9,42.6,43.3,], 
		["duration",12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,], 
]};
/*[21] Dim Vision		*/ var d321 = {values:[
		["radius",2.6,3.3,4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,20,20.6,21.3,22,22.6,23.3,24,24.6,25.3,26,26.6,27.3,28,28.6,29.3,30,30.6,31.3,32,32.6,33.3,34,34.6,35.3,36,36.6,37.3,38,38.6,39.3,40,40.6,41.3,42,], 
		["duration",3,3.2,3.4,3.7,4,4.2,4.4,4.7,5,5.2,5.4,5.7,6,6.2,6.4,6.7,7,7.2,7.4,7.7,8,8.2,8.4,8.7,9,9.2,9.4,9.7,10,10.2,10.4,10.7,11,11.2,11.4,11.7,12,12.2,12.4,12.7,13,13.2,13.4,13.7,14,14.2,14.4,14.7,15,15.2,15.4,15.7,16,16.2,16.4,16.7,17,17.2,17.4,17.7,], 
]};
/*[22] Hemorrhage		*/ var d322 = {values:[
		["damage",2,5,8,11,15,18,21,24,31,37,43,49,55,62,68,74,84,93,102,112,121,131,146,162,177,193,209,224,248,271.5,295,318.5,342,365.5,389,412,435.5,459,482.5,506,529.5,553,576,599.5,623,647,671,695,719,743,767,791,815,839,863,887,911,935,959,983,], 
		["duration",4,4.1,4.3,4.4,4.6,4.8,4.9,5.1,5.2,5.4,5.6,5.7,5.9,6,6.2,6.4,6.5,6.7,6.8,7,7.2,7.3,7.5,7.6,7.8,8,8.1,8.3,8.4,8.6,8.8,8.9,9.1,9.2,9.4,9.6,9.7,9.9,10,10.2,10.4,10.5,10.7,10.8,11,11.2,11.3,11.5,11.6,11.8,12,12.1,12.3,12.4,12.6,12.8,12.9,13.1,13.2,13.4,], 
		["mana cost",6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,], 
//		["radius",], 
	]};
/*[23] Weaken			*/ var d323 = {values:[
		["radius",4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,20,20.6,21.3,22,22.6,23.3,24,24.6,25.3,26,26.6,27.3,28,28.6,29.3,30,30.6,31.3,32,32.6,33.3,34,34.6,35.3,36,36.6,37.3,38,38.6,39.3,40,40.6,41.3,42,42.6,43.3,], 
		["duration",12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,], 
]};
/*[24] Iron Maiden		*/ var d332 = {values:[
		["damage returned",350,425,500,575,650,725,800,875,950,1025,1100,1175,1250,1325,1400,1475,1550,1625,1700,1775,1850,1925,2000,2075,2150,2225,2300,2375,2450,2525,2600,2675,2750,2825,2900,2975,3050,3125,3200,3275,3350,3425,3500,3575,3650,3725,3800,3875,3950,4025,4100,4175,4250,4325,4400,4475,4550,4625,4700,4775,], 
		["duration",12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,], 
		["radius",2.6,3.3,4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,20,20.6,21.3,22,22.6,23.3,24,24.6,25.3,26,26.6,27.3,28,28.6,29.3,30,30.6,31.3,32,32.6,33.3,34,34.6,35.3,36,36.6,37.3,38,38.6,39.3,40,40.6,41.3,42,], 
]};
/*[25] Terror			*/ var d333 = {values:[
		["radius",4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,20,20.6,21.3,22,22.6,23.3,24,24.6,25.3,26,26.6,27.3,28,28.6,29.3,30,30.6,31.3,32,32.6,33.3,34,34.6,35.3,36,36.6,37.3,38,38.6,39.3,40,40.6,41.3,42,42.6,43.3,], 
		["duration",12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,], 
]};
/*[26] Confuse			*/ var d341 = {values:[
		["radius",5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.7,19.3,20,20.7,21.3,22,22.7,23.3,24,24.7,25.3,26,26.7,27.3,28,28.7,29.3,30,30.7,31.3,32,32.7,33.3,34,34.7,35.3,36,36.7,37.3,38,38.7,39.3,40,40.7,41.3,42,42.7,43.3,44,44.7,], 
		["duration",3,3.2,3.4,3.7,4,4.2,4.4,4.7,5,5.2,5.4,5.7,6,6.2,6.4,6.7,7,7.2,7.4,7.7,8,8.2,8.4,8.7,9,9.2,9.4,9.7,10,10.2,10.4,10.7,11,11.2,11.4,11.7,12,12.2,12.4,12.7,13,13.2,13.4,13.7,14,14.2,14.4,14.7,15,15.2,15.4,15.7,16,16.2,16.4,16.7,17,17.2,17.4,17.7,], 
]};
/*[27] Life Tap			*/ var d342 = {values:[
		["heals",25,27,29,31,33,35,37,39,41,43,45,47,49,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,], 
		["radius",2.6,3.3,4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,20,20.6,21.3,22,22.6,23.3,24,24.6,25.3,26,26.6,27.3,28,28.6,29.3,30,30.6,31.3,32,32.6,33.3,34,34.6,35.3,36,36.6,37.3,38,38.6,39.3,40,40.6,41.3,42,], 
		["duration",12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,], 
]};
/*[28] Attract			*/ var d351 = {values:[
		["duration",2.4,3.4,4.4,5.4,6.4,7.4,8.4,9.4,10.4,11.4,12.4,13.4,14.4,15.4,16.4,17.4,18.4,19.4,20.4,21.4,22.4,23.4,24.4,25.4,26.4,27.4,28.4,29.4,30.4,31.4,32.4,33.4,34.4,35.4,36.4,37.4,38.4,39.4,40.4,41.4,42.4,43.4,44.4,45.4,46.4,47.4,48.4,49.4,50.4,51.4,52.4,53.4,54.4,55.4,56.4,57.4,58.4,59.4,60.4,61.4,], 
]};
/*[29] Decrepify		*/ var d353 = {values:[
		["radius",2.6,3.3,4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,20,20.6,21.3,22,22.6,23.3,24,24.6,25.3,26,26.6,27.3,28,28.6,29.3,30,30.6,31.3,32,32.6,33.3,34,34.6,35.3,36,36.6,37.3,38,38.6,39.3,40,40.6,41.3,42,], 
]};
/*[30] Lower Resist		*/ var d362 = {values:[
		["radius",4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,17.9,18.6,19.3,19.9,20.6,21.3,21.9,22.6,23.3,23.9,24.6,25.3,25.9,26.6,27.3,27.9,28.6,29.3,29.9,30.6,31.3,31.9,32.6,33.3,33.9,34.6,35.3,35.9,36.6,37.3,37.9,38.6,39.3,39.9,40.6,41.3,41.9,42.6,43.3,], 
		["duration",10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,], 
		["enemy resist",-52,-61,-68,-75,-80,-84,-87,-89,-92,-94,-96,-98,-100,-101,-102,-104,-104,-105,-106,-107,-108,-109,-110,-111,-112,-113,-114,-115,-116,-117,-118,-119,-120,-121,-122,-123,-124,-125,-126,-127,-128,-129,-130,-131,-132,-133,-134,-135,-136,-137,-138,-139,-140,-141,-142,-143,-144,-145,-146,-147,], 
]};

var skills_necromancer = [
{data:d111, key:"111", code:66, name:"Summon Mastery", i:0, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:0, description:"Passive - Increases the strength of your<br>summons and revives", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Bonuses to Revives:<br>Revive Life: +","<br>Revive Damage: +","<br><br>Bonuses to Summons:<br>Defense: +"," percent<br>Life: +"," percent<br>Damage: +"," percent<br>Attack Rating: +"," percent<br>Resistances: +"," percent", ""]},
{data:d113, key:"113", code:67, name:"Raise Skeleton Warrior", i:1, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Cast on the corpse of a slain monster.<br>This raises a skeleton warrior that<br>fights for you", syn_title:"<br>Raise Skeleton Warrior Receives Bonuses From:<br>", syn_text:"Summon Mastery", graytext:"", index:[3,""], text:["Damage: ","-","<br>Life: ",""," skeletons total<br>Mana Cost: ",""], notupdated:1},
{data:d121, key:"121", code:68, name:"Bone Offering", i:2, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:2, bindable:2, description:"Consumes corpses to temporarily empower<br>allied summons with toughness", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Radius: "," yards<br>Defense: +"," percent<br>Physical and Elemental Damage: +"," percent<br>Reduces curse duration by "," percent<br>Mana Cost: ",""], notupdated:1},
{data:d122, key:"122", code:69, name:"Clay Golem", i:3, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Creates a golem from the earth<br>to fight by your side", syn_title:"<br>Clay Golem Receives Bonuses From:<br>", syn_text:"Summon Mastery", graytext:"", index:[3,""], text:["Damage: ","-","<br>Life: ","Slows target by: "," percent<br>Mana Cost: ",""]},
{data:d131, key:"131", code:70, name:"Flesh Offering", i:4, req:[], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:2, bindable:2, description:"Consumes corpses to temporarily empower<br>allied summons with swiftness", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Radius: "," yards<br>Faster Cast Rate: +"," percent<br>Attack Speed: +"," percent<br>Walk/Run Speed: +"," percent<br>Mana Cost: ",""], notupdated:1},
{data:d133, key:"133", code:71, name:"Raise Skeletal Mage", i:5, req:[1], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Cast on the corpse of a slain monster.<br>This raises a skeleton mage that<br>fights for you", syn_title:"<br>Raise Skeletal Mage Receives Bonuses From:<br>", syn_text:"Summon Mastery", graytext:"", index:[7," over 1.5 seconds"], text:["Lightning Damage: ","-","<br>Cold Damage: ","-","<br>Fire Damage: ","-","<br>Poison Damage: ","Life: ","<br>"," skeleton magi<br>Mana Cost: ",""], notupdated:1},
{data:d142, key:"142", code:72, name:"Blood Golem", i:6, req:[3], reqlvl:18, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"A golem that steals the life of enemies<br>and shares it with you<br><br>1/4 of life stolen by golem is shared with you", syn_title:"<br>Blood Golem Receives Bonuses From:<br>", syn_text:"Summon Mastery", graytext:"", index:[3,"<br><br>Aura: Nearby Allies Gain Life on Hit"], text:["Damage: ","-","<br>Life: ","+"," Life Gained on Ranged Hit<br>+"," Life Gained on Melee hit<br>Radius: "," yards<br>","% Life Stolen per Hit<br>Mana Cost: ",""]},
{data:d151, key:"151", code:73, name:"Convocation", i:7, req:[], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Muster dark energies to warp<br>you and your minions to a location", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Cooldown: "," seconds<br>Mana Cost: 30",""]},
{data:d152, key:"152", code:74, name:"Iron Golem", i:8, req:[6,3], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:4, bindable:1, description:"Transforms a metallic item into a golem that gains<br>the properties of the item", syn_title:"<br>Iron Golem Receives Bonuses From:<br>", syn_text:"Summon Mastery", graytext:"", index:[3,""], text:["Damage: ","-","<br>Life: ","Thorns Damage<br>"," percent damage returned<br>Mana Cost: 35",""]},
{data:d162, key:"162", code:75, name:"Fire Golem", i:9, req:[8,6,3], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Creates a golem that converts the damage<br>it receives from fire into life", syn_title:"<br>Fire Golem Receives Bonuses From:<br>", syn_text:"Summon Mastery", graytext:"", index:[3,""], text:["Damage: ","-","<br>Life: ","Absorbs ","% of fire damage<br>Holy Fire: ","-","<br>Mana Cost: ",""]},
{data:d163, key:"163", code:76, name:"Revive", i:10, req:[5,1], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Returns a monster to life<br>to fight by your side", syn_title:"<br>Revive Receives Bonuses From:<br>", syn_text:"Summon Mastery", graytext:"", index:[2," percent"], text:["Duration: 600 seconds<br>Life: +"," percent<br>Damage: +","Monsters: ","<br>Mana Cost: 45",""]},

{data:d211, key:"211", code:77, name:"Deadly Poison", i:11, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Coats your weapon in deadly poison and<br>increases the potency of your poison skills<br><br>When active, poison damage<br>delivered by your weapon<br>always lasts for 2 seconds", syn_title:"<br>Deadly Poison Receives Bonuses From:<br>", syn_text:"Desecrate: +10% Poison Damage per Level<br>Poison Nova: +10% Poison Damage per Level", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Poison Damage: ","-"," over 2 seconds<br>Mana Cost: ","<br>","% bonus to Attack Rating"], notupdated:1},
//{data:d211, key:"211", code:77, name:"Deadly Poison", i:11, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Coats your weapon in deadly poison and<br>increases the potency of your poison skills<br><br>When active, poison damage<br>delivered by your weapon<br>always lasts for 2 seconds", syn_title:"<br>Deadly Poison Receives Bonuses From:<br>", syn_text:"Desecrate: +10% Poison Damage per Level<br>Poison Nova: +10% Poison Damage per Level", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Poison Damage: ","-","<br>over 2 seconds<br>Enemy Poison Resistance: "," percent<br>Mana Cost: ",""], notupdated:1},
{data:d212, key:"212", code:78, name:"Teeth", i:12, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Fires a barrage of summoned barbed teeth", syn_title:"<br>Teeth Receives Bonuses From:<br>", syn_text:"Bone Spear: +17% Magic Damage per Level<br>Bone Spirit: +17% Magic Damage per Level", graytext:"", index:[0,""], text:[""," Teeth<br>Magic Damage: ","-","<br>Mana Cost: ",""]},
{data:d213, key:"213", code:79, name:"Bone Armor", i:13, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:4, bindable:1, description:"Creates an orbiting shield of bone<br>that absorbs melee damage", syn_title:"<br>Bone Armor Receives Bonuses From:<br>", syn_text:"Bone Wall: +20 Damage Absorbed per Level<br>Bone Spirit: +20 Damage Absorbed per Level", graytext:"", index:[0,""], text:["Absorbs "," damage<br>Mana Cost: ",""]},
{data:d233, key:"233", code:80, name:"Corpse Explosion", i:14, req:[13], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Cast on the corpse of a slain monster.<br>It explodes, damaging nearby enemies<br>Corpse damage dealt as 50% Fire and 50% Physical", syn_title:"<br>Corpse Explosion Receives Bonuses From:<br>", syn_text:"Fire Golem: +12% Additional Fire Damage per Level", graytext:"<br>Damage increases by 1% per 3 Base Levels", index:[2," percent of corpse life"], text:["Damage: ","-","Radius: "," yards<br>Mana Cost: ","<br>Additional Fire Damage: ","-",""]},
//{data:d233, key:"233", code:80, name:"Corpse Explosion", i:14, req:[13], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Cast on the corpse of a slain monster.<br>It explodes, damaging nearby enemies", syn_title:"<br>Corpse Explosion Receives Bonuses From:<br>", syn_text:"Fire Golem: +12% to added Fire Damage per Level", graytext:"<br>Damage increases by 1% per 3 Base Levels", index:[2," percent of corpse life"], text:["Damage: ","-","Radius: "," yards<br>Mana Cost: ",""]},
{data:d241, key:"241", code:81, name:"Desecrate", i:15, req:[11], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Summons a pile of rotten corpses that release toxic fumes", syn_title:"<br>Desecrate Receives Bonuses From:<br>", syn_text:"Deadly Poison: +16% Poison Damage per Level<br>Poison Nova: +16% Poison Damage per Level", graytext:"", index:[0,""], text:["Cooldown: "," seconds<br>Poison Damage: ","-","<br>over 2 seconds<br>Mana Cost: ",""]},
{data:d242, key:"242", code:82, name:"Bone Spear", i:16, req:[12], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Summons a deadly spike of bone to impale your enemies", syn_title:"<br>Bone Spear Receives Bonuses From:<br>", syn_text:"Teeth: +7% Magic Damage per Level<br>Bone Spirit: +7% Magic Damage per Level<br>+2 Additional Spears While having 100+ Total Energy", graytext:"", index:[0,""], text:["Magic Damage: ","-","<br>Mana Cost: ",""]},
{data:d243, key:"243", code:83, name:"Bone Wall", i:17, req:[14,13], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Creates an impassable barrier<br>of bone and debris", syn_title:"<br>Bone Wall Receives Bonuses From:<br>", syn_text:"Bone Armor: +10% Life per Level", graytext:"", index:[0,""], text:["Life: ","<br>Duration: 24 seconds<br>Mana Cost: 17",""]},
{data:d253, key:"253", code:84, name:"Bone Spirit", i:18, req:[16,17,14,12,13], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Releases a spirit of the restless undead that<br>tracks its target or finds one of its own", syn_title:"<br>Bone Spirit Receives Bonuses From:<br>", syn_text:"Teeth: +10% Magic Damage per Level<br>Bone Spear: +10% Magic Damage per Level", graytext:"", index:[0,""], text:["Magic Damage: ","-","<br>Mana Cost: ",""]},
{data:d261, key:"261", code:85, name:"Poison Nova", i:19, req:[15,11], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Emits an expanding ring of concentrated poison", syn_title:"<br>Poison Nova Receives Bonuses From:<br>", syn_text:"Deadly Poison: +13% Poison Damage per Level<br>Desecrate: +13% Poison Damage per Level", graytext:"", index:[0,""], text:["Poison Damage: ","-","<br>over 2 seconds<br>Mana Cost: 20",""]},

{data:d312, key:"312", code:86, name:"Amplify Damage", i:20, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a group of enemies, increasing<br>the non-magic damage they receive<br><br>Damage Taken: +100 percent", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: "," yards<br>Duration: "," seconds<br>Mana Cost: 4",""]},
{data:d321, key:"321", code:87, name:"Dim Vision", i:21, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a group of monsters,<br>reducing their vision radius", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: "," yards<br>Duration: "," seconds<br>Mana Cost: 9",""]},
{data:d322, key:"322", code:88, name:"Hemorrhage", i:22, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a group of enemies to cause<br>bleeding which drains their life away<br><br>Ignores curse overrides/immunities", syn_title:"<br>Hemorrhage Receives Bonuses From:<br>", syn_text:"Life Tap: +20% Life Damage per Level<br>Weaken: +20% Life Damage per Level<br>Iron Maiden: +20% Life Damage per Level", graytext:"", index:[0,""], text:["Radius: 7.3 yards<br>Life Damage: "," per second<br>Duration: "," seconds<br>Mana Cost: ",""], notupdated:0, damagetoohigh:1},
{data:d323, key:"323", code:89, name:"Weaken", i:23, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a group of enemies,<br>reducing the amount of damage they inflict<br><br>Target's Damage: -33 percent", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: "," yards<br>Duration: "," seconds<br>Mana Cost: 4",""]},
{data:d332, key:"332", code:90, name:"Iron Maiden", i:24, req:[], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a group of enemies, causing them<br>to damage themselves when damaging others", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent damage returned<br>Duration: "," seconds<br>Radius: "," yards<br>Mana Cost: 5",""]},
{data:d333, key:"333", code:91, name:"Terror", i:25, req:[], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a group of monsters,<br>causing them to flee in terror", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: "," yards<br>Duration: "," seconds<br>Mana Cost: 7",""]},
{data:d341, key:"341", code:92, name:"Confuse", i:26, req:[], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a monster to force it to attack random targets<br>While also becoming more vulnerable to knockback<br><br>Chance Confused Enemy is Knocked Back When Hit:<br>(Based on body size) Small 100% / Medium 50% / Large 25%", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: "," yards<br>Duration: "," seconds<br>Mana Cost: 13",""], notupdated:0},
{data:d342, key:"342", code:93, name:"Life Tap", i:27, req:[], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a group of monsters so that<br>damaging them gives the attacker life", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Heals: "," percent of attack damage<br>Radius: "," yards<br>Duration: "," seconds<br>Mana Cost: 9",""]},
{data:d351, key:"351", code:94, name:"Attract", i:28, req:[], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a monster to become the<br>target of all nearby monsters<br>This curse may not be overridden by another curse<br><br>Radius: 5.3 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Mana Cost: 17",""]},
{data:d353, key:"353", code:95, name:"Decrepify", i:29, req:[], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses a group of enemies to make them<br>slow, weak and take amplified damage<br><br>Duration: 10 seconds", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: "," yards<br>Mana Cost: 11",""]},
{data:d362, key:"362", code:96, name:"Lower Resist", i:30, req:[], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Curses an enemy to take more damage from all magical attacks<br>Lowers resistances of monsters<br>Lowers maximum resistances of hostile players", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: "," yards<br>Duration: "," seconds<br>Resist All: "," percent<br>Mana Cost: 22",""]}
];
