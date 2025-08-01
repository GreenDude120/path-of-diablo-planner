
var character_paladin = {class_name:"Paladin", strength:25, dexterity:20, vitality:25, energy:15, life:55, mana:15, stamina:189, levelup_life:2.5, levelup_stamina:1, levelup_mana:1.5, ar_per_dexterity:5, life_per_vitality:3, stamina_per_vitality:1, mana_per_energy:1.5, starting_strength:25, starting_dexterity:20, starting_vitality:25, starting_energy:15, ar_const:20, block_const:3, skill_layout:"./images/skill_trees/PoD/paladin.png", mana_regen:1.66,
	weapon_frames:{dagger:16, sword:[14,17], axe:[14,17], mace:[14,17], thrown:[14,16], staff:17, polearm:17, scepter:14, wand:14, javelin:16, spear:19, bow:15, crossbow:19},
	// Skills that may adjust IAS breakpoints: Sacrifice, Zeal, Vengeance, Conversion, Smite
	fcr_frames:15, fcr_bp:[0, 9, 18, 30, 48, 75, 125],
	fhr_frames:9, fhr_bp:[0, 7, 15, 27, 48, 86, 200],
	fhr_frames_alt:13, fhr_bp_alt:[0, 3, 7, 13, 20, 32, 48, 75, 129, 280],	// Spears or Staves
	fbr_frames:5, fbr_bp:[0, 13, 32, 86, 600],
	fbr_frames_alt:2, fbr_bp_alt:[0, 86],	// Holy Shield active
	
	// getSkillData - gets skill info from the skills data table
	//	skill: skill object for the skill in question
	//	lvl: level of the skill
	//	elem: which element of the skill to return
	// result: value of the skill element at the specified level
	// ---------------------------------
	getSkillData : function(skill, lvl, elem) {
		var result = skill.data.values[elem][lvl];
		
		if (skill.name == "Resist Fire" && elem == 0) { 		result = Math.floor(skill.level/4); character.fRes_skillup = result; }
		if (skill.name == "Resist Cold" && elem == 0) { 		result = Math.floor(skill.level/4); character.cRes_skillup = result; }
		if (skill.name == "Resist Lightning" && elem == 0) { 	result = Math.floor(skill.level/4); character.lRes_skillup = result; }
		if (skill.name == "Prayer" && elem == 1) { 				result = Math.floor((character.life + character.level*character.life_per_level + (((character.vitality + character.all_attributes + character.level*character.vitality_per_level)-character.starting_vitality)*character.life_per_vitality)) * (1 + character.max_life/100))*0.01 + skill.data.values[0][lvl] }
		if (skill.name == "Cleansing" && elem == 0) {			result = Math.min(1,(skills[0].level+skills[0].force_levels))*~~skills[0].data.values[0][skills[0].level+skills[0].extra_levels] }
		if (skill.name == "Cleansing" && elem == 1) {			result = Math.floor(skill.level/2); character.pRes_skillup = result; }
		if (skill.name == "Meditation" && elem == 0) {			result = Math.min(1,(skills[0].level+skills[0].force_levels))*~~skills[0].data.values[0][skills[0].level+skills[0].extra_levels] }
//		if (skill.name == "Blessed Aim" && elem == 0) { 		result = (5*skill.level); character.ar_skillup = result; }
		if (skill.name == "Holy Fire" && elem < 4) { 			result *= ((1+(0.08*skills[1].level + 0.08*skills[9].level)) * (1+character.fDamage/100)) }
		if (skill.name == "Holy Freeze" && elem < 4) { 			result *= ((1+(0.04*skills[3].level + 0.06*skills[9].level)) * (1+character.cDamage/100)) }
		if (skill.name == "Holy Shock" && elem < 4) { 			result *= ((1+(0.04*skills[5].level + 0.06*skills[9].level)) * (1+character.lDamage/100)) }
		if (skill.name == "Sanctuary" && elem > 0 && elem < 3) { result *= ((1+(0.18*skills[4].level + 0.18*skills[30].level))* (1+character.mDamage/100)) }

		if (skill.name == "Sacrifice" && elem == 1) { 	result += (10*skills[8].level + 5*skills[18].level) }
		if (skill.name == "Smite" && elem == 0) { 		result += (8*skills[2].level) }
		if (skill.name == "Holy Bolt" && elem < 2) { 	result *= ((1+(0.35*skills[17].level + 0.35*skills[29].level)) * (1+character.mDamage/100)) }
		if (skill.name == "Holy Bolt" && elem == 2) { 	result *= (1+(0.35*skills[0].level)) }
		if (skill.name == "Zeal" && elem == 1) { 		result += (10*skills[20].level) }
		if (skill.name == "Charge" && elem == 0) { 		result += (26*skills[6].level + 26*skills[10].level) }	// TODO: are these synergies supposed to be multiplicative instead of additive?
		
		var phys_min = 0;
		var phys_max = 0;
		if (skill.name == "Vengeance" && equipped.weapon.name != "none" && elem < 8) {
			phys_min = (character.base_damage_min * (1+character.e_damage/100) + character.damage_min + character.level*character.min_damage_per_level);
			phys_max = (character.base_damage_max * (1+character.e_damage/100) + character.damage_max + character.level*character.max_damage_per_level);
		}
		if (skill.name == "Vengeance" && elem == 0) { 						result = phys_min }
		if (skill.name == "Vengeance" && elem == 1) { 						result = phys_max }
		if (skill.name == "Vengeance" && elem == 2) { 						result = Math.floor(phys_min * ((skill.data.values[8][lvl] + 15*skills[1].level + 2*skills[9].level)/100) * (1+character.fDamage/100)) }
		if (skill.name == "Vengeance" && elem == 3) { 						result = Math.floor(phys_max * ((skill.data.values[8][lvl] + 15*skills[1].level + 2*skills[9].level)/100) * (1+character.fDamage/100)) }
		if (skill.name == "Vengeance" && elem == 4) { 						result = Math.floor(phys_min * ((skill.data.values[9][lvl] + 15*skills[3].level + 2*skills[9].level)/100) * (1+character.cDamage/100)) }
		if (skill.name == "Vengeance" && elem == 5) { 						result = Math.floor(phys_max * ((skill.data.values[9][lvl] + 15*skills[3].level + 2*skills[9].level)/100) * (1+character.cDamage/100)) }
		if (skill.name == "Vengeance" && elem == 6) { 						result = Math.floor(phys_min * ((skill.data.values[10][lvl] + 15*skills[5].level + 2*skills[9].level)/100) * (1+character.lDamage/100)) }
		if (skill.name == "Vengeance" && elem == 7) { 						result = Math.floor(phys_max * ((skill.data.values[10][lvl] + 15*skills[5].level + 2*skills[9].level)/100) * (1+character.lDamage/100)) }
		if (skill.name == "Vengeance" && elem == 8) { 						result += (12*skills[1].level + 2*skills[9].level) }
		if (skill.name == "Vengeance" && elem == 9) { 						result += (12*skills[3].level + 2*skills[9].level) }
		if (skill.name == "Vengeance" && elem == 10) { 						result += (12*skills[5].level + 2*skills[9].level) }
		if (skill.name == "Blessed Hammer" && elem < 2) { 					result *= ((1+(0.14*skills[6].level + 0.14*skills[13].level)) * (1+character.hammer_bonus/100) * (1+character.mDamage/100)) }
		if (skill.name == "Holy Shield" && elem == 3) { 					result += (15*skills[2].level) }
		if (skill.name == "Fist of the Heavens" && elem < 2) { 				result *= ((1+(0.13*skills[22].level)) * (1+character.mDamage/100)) }
		if (skill.name == "Fist of the Heavens" && elem >1 && elem < 4) { 	result *= ((1+(0.08*skills[16].level)) * (1+character.lDamage/100)) }
		if (skill.name == "Dashing Strike" && elem > 0 && elem < 3) { 		result *= ((1+(0.12*skills[21].level + 0.12*skills[24].level + 0.12*skills[28].level)) * (1+character.mDamage/100)) }
		
	return result
	},
	
	// getBuffData - gets a list of stats corresponding to a persisting buff
	//	effect: array element object for the buff
	// result: indexed array including stats affected and their values
	// ---------------------------------
	getBuffData : function(skill) {
		var lvl = skill.level + skill.extra_levels;
		var result = {};
		if (skill.i < 20) { disableAuras(skill) }
		
	    // Defensive Auras	
		if (skill.name == "Prayer") { result.life_regen = 1; result.life_replenish = skill.data.values[0][lvl]; result.radius = 24; }
		if (skill.name == "Resist Fire") { result.fRes = skill.data.values[1][lvl]; result.fRes_max = skill.data.values[2][lvl]; result.radius = 28; }
		if (skill.name == "Defiance") { result.defense_bonus = skill.data.values[0][lvl]; result.radius = 24; }
		if (skill.name == "Resist Cold") { result.cRes = skill.data.values[1][lvl]; result.cRes_max = skill.data.values[2][lvl]; result.radius = 28; }
		if (skill.name == "Cleansing") {
			result.life_replenish = Math.min(1,(skills[0].level+skills[0].force_levels))*~~(skills[0].data.values[0][skills[0].level+skills[0].extra_levels]);
			result.poison_length_reduced = skill.data.values[2][lvl]; result.curse_length_reduced = skill.data.values[2][lvl]; result.radius = 24;
		}
		if (skill.name == "Resist Lightning") { result.lRes = skill.data.values[1][lvl]; result.lRes_max = skill.data.values[2][lvl]; result.radius = 28; }
		if (skill.name == "Vigor") { result.velocity = skill.data.values[0][lvl]; result.max_stamina = skill.data.values[1][lvl]; result.heal_stam = skill.data.values[2][lvl]; result.radius = 21.3; }
		if (skill.name == "Meditation") {
			result.life_replenish = Math.min(1,(skills[0].level+skills[0].force_levels))*~~(skills[0].data.values[0][skills[0].level+skills[0].extra_levels]);
			result.mana_regen = skill.data.values[1][lvl]; result.radius = 24;
		}
		if (skill.name == "Redemption") { result.redeem_chance = skill.data.values[0][lvl]; result.redeem_amount = skill.data.values[1][lvl]; result.radius = 16; }
		if (skill.name == "Salvation") { result.fDamage = skill.data.values[0][lvl]; result.cDamage = skill.data.values[0][lvl]; result.lDamage = skill.data.values[0][lvl]; result.all_res = skill.data.values[1][lvl]; result.radius = 28; }
	    // Offensive Auras
		if (skill.name == "Might") { result.damage_bonus = skill.data.values[0][lvl]; result.radius = 16; }
		if (skill.name == "Holy Fire") {
			result.fDamage_min = skill.data.values[0][lvl] * (1 + 0.08*skills[1].level + 0.08*skills[9].level);
			result.fDamage_max = skill.data.values[1][lvl] * (1 + 0.08*skills[1].level + 0.08*skills[9].level);
			result.ftick_min = skill.data.values[2][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level) * (1+character.fDamage/100);
			result.ftick_max = skill.data.values[3][lvl] * (1 + 0.04*skills[1].level + 0.06*skills[9].level) * (1+character.fDamage/100); 
			result.radius = 12;
//			result.addeddmgdisplaywrong = 1
		}
		if (skill.name == "Precision") { result.pierce = skill.data.values[0][lvl]; result.cstrike = skill.data.values[2][lvl]; result.ar_bonus = skill.data.values[3][lvl]; result.radius = 16; }
		if (skill.name == "Blessed Aim") { result.hammer_on_hit = skill.data.values[0][lvl]; result.ar_bonus = skill.data.values[1][lvl]; result.radius = 16; }
//		if (skill.name == "Blessed Aim") { result.ar_bonus = skill.data.values[2][lvl]; result.hammer_on_hit = skill.data.values[1][lvl]; result.radius = 16; }
//		if (skill.name == "Blessed Aim") { result.ar_bonus = skill.data.values[1][lvl]; result.hammer_on_hit = skill.data.values[0][lvl]; result.radius = 16; }
		if (skill.name == "Concentration") { result.ar = skill.data.values[0][lvl]; result.damage_bonus = skill.data.values[1][lvl]; result.hammer_bonus = skill.data.values[2][lvl]; result.radius = 16; }
		if (skill.name == "Holy Freeze") {
			result.cDamage_min = skill.data.values[0][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level);
			result.cDamage_max = skill.data.values[1][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level);
			result.slow_enemies = skill.data.values[4][lvl]; result.radius = 13.3;
			result.ctick_min = skill.data.values[2][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level) * (1+character.cDamage/100) ; 
			result.ctick_max = skill.data.values[3][lvl] * (1 + 0.04*skills[3].level + 0.06*skills[9].level) * (1+character.cDamage/100) ; 
//			result.addeddmgdisplaywrong = 1
		}
		if (skill.name == "Holy Shock") {
			result.lDamage_min = skill.data.values[0][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level);
			result.lDamage_max = skill.data.values[1][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level);
			result.radius = 18.6;
			result.ltick_min = skill.data.values[2][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level) * (1+character.lDamage/100);
			result.ltick_max = skill.data.values[3][lvl] * (1 + 0.04*skills[5].level + 0.06*skills[9].level) * (1+character.lDamage/100); 
//			result.addeddmgdisplaywrong = 1
		}
		if (skill.name == "Sanctuary") { 
			result.damage_vs_undead = skill.data.values[0][lvl]; 
			result.radius = 12.6; 
			result.mtick_min = Math.floor(skill.data.values[1][lvl] * ((1+(0.18*skills[4].level + 0.18*skills[30].level))* (1+character.mDamage/100)));
			result.mtick_max = Math.floor(skill.data.values[2][lvl] * ((1+(0.18*skills[4].level + 0.18*skills[30].level))* (1+character.mDamage/100))) ; }
		if (skill.name == "Fanaticism") { result.damage_bonus = skill.data.values[1][lvl]; result.ias_skill = skill.data.values[2][lvl]; result.ar_bonus = skill.data.values[3][lvl]; result.radius = 12; }
		if (skill.name == "Conviction") { result.enemy_defense = skill.data.values[0][lvl]; result.enemy_fRes = skill.data.values[1][lvl]; result.enemy_cRes = skill.data.values[1][lvl]; result.enemy_lRes = skill.data.values[1][lvl]; result.enemy_pRes = skill.data.values[1][lvl]; result.radius = 24; }
	    // Combat
		if (skill.name == "Holy Shield") {
			result.defense_skillup = skill.data.values[3][lvl] + 15*skills[2].level;
			result.smite_min = skill.data.values[0][lvl]; result.smite_max = skill.data.values[1][lvl]; result.block = skill.data.values[4][lvl]; result.duration = skill.data.values[2][lvl];
		}
		if (skill.name == "Fist of the Heavens") {
			result.mDamage_min = skill.data.values[0][lvl] * (1+character.mDamage/100);
			result.mDamage_max = skill.data.values[1][lvl] * (1+character.mDamage/100);
			result.lDamage_min = skill.data.values[2][lvl] * (1+character.lDamage/100);
			result.lDamage_max = skill.data.values[3][lvl] * (1+character.lDamage/100);		}
		// No stat buffs:
		if (skill.name == "Conversion") { result.duration = skill.data.values[1][lvl]; }
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
		var strTotal = (character.strength + character.all_attributes + character.level*character.strength_per_level);	// used in Smite calculation
		var nonWeaponED = ~~socketed.helm.totals.e_damage + ~~socketed.armor.totals.e_damage + ~~socketed.offhand.totals.e_damage;	// used in Smite calculation
		var damage_enhanced = character.damage_bonus + character.e_damage;
		
	//	if (skill.name == "Holy Fire") {				attack = 0; spell = 2; }
	//	else if (skill.name == "Holy Freeze") {			attack = 0; spell = 2; }
	//	else if (skill.name == "Holy Shock") {			attack = 0; spell = 2; }
		if (skill.name == "Sacrifice") {				attack = 1; spell = 0; weapon_damage = 150; ar_bonus = character.getSkillData(skill,lvl,0); damage_bonus = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Smite") {				attack = 1; spell = 1; phys_min = 0; phys_max = 0; nonPhys_min = 0; nonPhys_max = 0; damage_bonus = character.getSkillData(skill,lvl,0); damage_enhanced = strTotal+character.damage_bonus+nonWeaponED-~~equipped.weapon.sup; damage_min = character.smite_min + character.damage_min + character.level*character.min_damage_per_level; damage_max = character.smite_max + character.damage_max + character.level*character.max_damage_per_level; }
		else if (skill.name == "Holy Bolt") {			attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,0); mDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Zeal") {				attack = 1; spell = 0; ar_bonus = character.getSkillData(skill,lvl,0); damage_bonus = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Charge") {				attack = 1; spell = 0; ar_bonus = character.getSkillData(skill,lvl,1); damage_bonus = character.getSkillData(skill,lvl,0); }
		else if (skill.name == "Vengeance") {			attack = 1; spell = 0; fDamage_min = character.getSkillData(skill,lvl,2); fDamage_max = character.getSkillData(skill,lvl,3); cDamage_min = character.getSkillData(skill,lvl,4); cDamage_max = character.getSkillData(skill,lvl,5); lDamage_min = character.getSkillData(skill,lvl,6); lDamage_max = character.getSkillData(skill,lvl,7); ar_bonus = character.getSkillData(skill,lvl,11); }
		else if (skill.name == "Blessed Hammer") {		attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,0); mDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Fist of the Heavens") {	attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,0); mDamage_max = character.getSkillData(skill,lvl,1); lDamage_min = character.getSkillData(skill,lvl,2); lDamage_max = character.getSkillData(skill,lvl,3); }
		else if (skill.name == "Dashing Strike") {		attack = 0; spell = 1; mDamage_min = character.getSkillData(skill,lvl,1); mDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Conversion") {			attack = 1; spell = 0; }

		if (typeof(skill.reqWeapon) != 'undefined') { var match = 0; for (let w = 0; w < skill.reqWeapon.length; w++) {
			if (skill.name == "Smite") { if (equipped.offhand.type == "shield") { match = 1 } }
			else { if (equipped.weapon.type == skill.reqWeapon[w]) { match = 1 } }
		} if (match == 0) { spell = 2 } }
		
		if (attack == 0) { phys_min = 0; phys_max = 0; phys_mult = 1; nonPhys_min = 0; nonPhys_max = 0; damage_enhanced = 0; }
		nonPhys_min += (fDamage_min + cDamage_min + lDamage_min + pDamage_min + mDamage_min);
		nonPhys_max += (fDamage_max + cDamage_max + lDamage_max + pDamage_max + mDamage_max);
		phys_min = (~~phys_min * (phys_mult + damage_bonus/100) * (1 + (weapon_damage-100)/100) + (damage_min * (1+(damage_bonus+damage_enhanced)/100)));
		phys_max = (~~phys_max * (phys_mult + damage_bonus/100) * (1 + (weapon_damage-100)/100) + (damage_max * (1+(damage_bonus+damage_enhanced+(character.level*character.e_max_damage_per_level))/100)));
		if (spell != 2) { skillMin = Math.floor(phys_min+nonPhys_min); skillMax = Math.floor(phys_max+nonPhys_max); }
		if (spell == 0) { skillAr = Math.floor(ar*(1+ar_bonus/100)); }

		skill2Breakdown = "Skill damage Breakdown-" ;  // \nPhys Damage: " + phys_min + "-" + phys_max +  "\nFire Damage: " + fDamage_min + "-" + fDamage_max + "\nCold Damage: " + cDamage_min + "-" + cDamage_max + "\nLight Damage: " + lDamage_min + "-" + lDamage_max  + "\nMagic Damage: " + mDamage_min + "-" + mDamage_max  + "\nPoison Damage: " + pDamage_min + "-" + pDamage_max ;
		if (phys_min > 0) {skill2Breakdown += "\nPhys Damage: " + Math.floor(phys_min) + "-" + Math.floor(phys_max)};
		if (fDamage_min > 0) {skill2Breakdown += "\nFire Damage: " + Math.floor(fDamage_min) + "-" + Math.floor(fDamage_max)};
		if (cDamage_min > 0) {skill2Breakdown += "\nCold Damage: " + Math.floor(cDamage_min) + "-" + Math.floor(cDamage_max)};
		if (lDamage_min > 0) {skill2Breakdown += "\nLight Damage: " + Math.floor(lDamage_min) + "-" + Math.floor(lDamage_max)};
		if (mDamage_min > 0) {skill2Breakdown += "\nMagic Damage: " + Math.floor(mDamage_min) + "-" + Math.floor(mDamage_max)};
		if (pDamage_min > 0) {skill2Breakdown += "\nPoison Damage: " + Math.floor(pDamage_min) + "-" + Math.floor(pDamage_max)};
		if (attack == 1){
			addmore = "yes"
		}
		if (skill.i = 30){
			addmore = "no"
		}

		var result = {min:skillMin,max:skillMax,ar:skillAr};
		return result
		return skill2Breakdown; 		
	},
	
	// setSkillAmounts - helps update class-related skill levels, called by calculateSkillAmounts()
	//	s: index of skill
	// ---------------------------------
	setSkillAmounts : function(s) {
		skills[s].extra_levels += character.skills_paladin
		if (s == 11) { skills[s].extra_levels += (character.skills_fire_all + character.skills_ele_poison_all)}
		if (s == 15) { skills[s].extra_levels += (character.skills_cold_all + character.skills_ele_poison_all)}
		if (s == 16 || s == 29) { skills[s].extra_levels += (character.skills_lightning_all + character.skills_ele_poison_all)}
		if (s == 17 || s == 22 || s == 26 || s == 30) { skills[s].extra_levels += character.skills_magic_all }
		if (s == 27) { skills[s].extra_levels += character.skills_summon_all}
		if (s < 10) {
			skills[s].extra_levels += character.skills_defensive
			skills[s].extra_levels += character.skills_tree1
		} else if (s > 19) {
			skills[s].extra_levels += character.skills_combat_paladin
			skills[s].extra_levels += character.skills_tree3
		} else {
			skills[s].extra_levels += character.skills_offensive
			skills[s].extra_levels += character.skills_tree2
		}
	}
};

// disableAuras - disable all auras except the specified aura
//	skill: skill object for the specified aura
// ---------------------------------
function disableAuras(skill) {
	var id = skill.name.split(' ').join('_');
	if (effects[id].info.enabled == 1) {
		for (let s = 0; s < 20; s++) {
			var sk = skills[s].name.split(' ').join('_');
			if (document.getElementById(sk) != null) { if (effects[sk].info.enabled == 1) { if (id != sk) { disableEffect(sk) } } }
		}
	}
};

/*[ 0] Prayer			*/ var d111 = {values:[
		["heals",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,20,22,24,26,28,30,32,34,36,38,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130,133,136,], 
		["total healing",], 
]};
/*[ 1] Resist Fire		*/ var d113 = {values:[
		["passive max resist",], 
		["resist",65,77,86,94,100,105,109,112,116,118,121,123,125,127,128,130,131,132,133,134,135,136,137,138,138,139,140,140,141,141,142,142,143,143,143,144,144,145,145,145,145,146,146,146,147,147,147,147,148,148,148,148,148,149,149,149,149,149,149,150,], 
		["max resist",1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,], 
]};
/*[ 2] Defiance			*/ var d122 = {values:[
		["defense",80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,650,660,670,], 
]};
/*[ 3] Resist Cold		*/ var d123 = {values:[
		["passive max resist",], 
		["resist",65,77,86,94,100,105,109,112,116,118,121,123,125,127,128,130,131,132,133,134,135,136,137,138,138,139,140,140,141,141,142,142,143,143,143,144,144,145,145,145,145,146,146,146,147,147,147,147,148,148,148,148,148,149,149,149,149,149,149,150,], 
		["max resist",1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,], 
]};
/*[ 4] Cleansing		*/ var d131 = {values:[
		["heals",], 
		["passive max poison resist",], 
		["duration reduction",39,46,51,56,60,63,65,67,69,70,72,73,75,76,76,78,78,79,79,80,81,81,82,82,82,83,84,84,84,84,85,85,85,85,85,86,86,87,87,87,87,87,87,87,88,88,88,88,88,88,88,88,88,89,89,89,89,89,89,90,], 
]};
/*[ 5] Resist Lightning	*/ var d133 = {values:[
		["passive max resist",], 
		["resist",65,77,86,94,100,105,109,112,116,118,121,123,125,127,128,130,131,132,133,134,135,136,137,138,138,139,140,140,141,141,142,142,143,143,143,144,144,145,145,145,145,146,146,146,147,147,147,147,148,148,148,148,148,149,149,149,149,149,149,150,], 
		["max resist",1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,], 
]};
/*[ 6] Vigor			*/ var d142 = {values:[
		["velocity",13,18,22,25,28,30,32,33,35,36,37,38,39,40,40,41,41,42,42,43,43,43,44,44,44,45,45,45,46,46,46,46,46,46,46,47,47,47,47,47,47,48,48,48,48,48,48,48,49,49,49,49,49,49,49,49,49,49,49,50,], 
		["stamina",50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475,500,525,550,575,600,625,650,675,700,725,750,775,800,825,850,875,900,925,950,975,1000,1025,1050,1075,1100,1125,1150,1175,1200,1225,1250,1275,1300,1325,1350,1375,1400,1425,1450,1475,1500,1525,], 
		["stamina recovery",50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475,500,525,550,575,600,625,650,675,700,725,750,775,800,825,850,875,900,925,950,975,1000,1025,1050,1075,1100,1125,1150,1175,1200,1225,1250,1275,1300,1325,1350,1375,1400,1425,1450,1475,1500,1525,], 
]};
/*[ 7] Meditation		*/ var d151 = {values:[
		["heals",], 
		["mana recovery",80,88,96,104,112,120,128,136,144,152,160,168,176,184,192,200,208,216,224,232,240,248,256,264,272,280,288,296,304,312,320,328,336,344,352,360,368,376,384,392,400,408,416,424,432,440,448,456,464,472,480,488,496,504,512,520,528,536,544,552,], 
]};
/*[ 8] Redemption		*/ var d162 = {values:[
		["redeem chance",14,25,33,40,45,49,53,56,59,61,64,65,67,69,70,72,73,73,74,75,76,77,78,79,79,80,81,81,81,81,82,82,83,83,83,84,84,85,85,85,85,86,86,86,87,87,87,87,88,88,88,88,88,89,89,89,89,89,89,90,], 
		["recover amount",25,33,41,49,57,65,73,81,89,97,105,113,121,129,137,145,153,161,169,177,185,193,201,209,217,225,233,241,249,257,265,273,281,289,297,305,313,321,329,337,345,353,361,369,377,385,393,401,409,417,425,433,441,449,457,465,473,481,489,497,], 
]};
/*[ 9] Salvation		*/ var d163 = {values:[
		["elemental damage",6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,], 
		["resist",40,48,55,60,65,68,71,73,76,77,79,81,82,83,84,86,86,87,88,88,89,90,90,91,91,92,93,93,93,93,94,94,95,95,95,95,95,96,96,96,96,97,97,97,97,97,97,97,98,98,98,98,98,99,99,99,99,99,99,100,], 
]};

/*[10] Might			*/ var d211 = {values:[
		["damage",50,58,66,74,82,90,98,106,114,122,130,138,146,154,162,170,178,186,194,202,210,218,226,234,242,250,258,266,274,282,290,298,306,314,322,330,338,346,354,362,370,378,386,394,402,410,418,426,434,442,450,458,466,474,482,490,498,506,514,522,], 
]};
/*[11] Holy Fire		*/ var d222 = {values:[
		["attack min",5,10,15,20,25,30,35,40,50,60,70,80,90,100,110,120,145,170,195,220,245,270,320,370,420,470,520,570,660,750,840,930,1020,1110,1200,1290,1380,1470,1560,1650,1740,1830,1920,2010,2100,2190,2280,2370,2460,2550,2640,2730,2820,2910,3000,3090,3180,3270,3360,3450,], 
		["attack max",15,25,35,45,55,65,75,85,100,115,130,145,160,175,190,205,240,275,310,345,380,415,490,565,640,715,790,865,980,1095,1210,1325,1440,1555,1670,1785,1900,2015,2130,2245,2360,2475,2590,2705,2820,2935,3050,3165,3280,3395,3510,3625,3740,3855,3970,4085,4200,4315,4430,4545,], 
		["aura min",1,2,3,4,5,6,7,8,10,12,14,16,18,20,22,24,29,34,39,44,49,54,64,74,84,94,104,114,132,150,168,186,204,222,240,258,276,294,312,330,348,366,384,402,420,438,456,474,492,510,528,546,564,582,600,618,636,654,672,690,], 
		["aura max",3,5,7,9,11,13,15,17,20,23,26,29,32,35,38,41,48,55,62,69,76,83,98,113,128,143,158,173,196,219,242,265,288,311,334,357,380,403,426,449,472,495,518,541,564,587,610,633,656,679,702,725,748,771,794,817,840,863,886,909,], 
]};
/*[12] Precision		*/ var d223 = {values:[
		["pierce",9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,], 
		["party pierce",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["crit chance",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["attack rating",50,70,90,110,130,150,170,190,210,230,250,270,290,310,330,350,370,390,410,430,450,470,490,510,530,550,570,590,610,630,650,670,690,710,730,750,770,790,810,830,850,870,890,910,930,950,970,990,1010,1030,1050,1070,1090,1110,1130,1150,1170,1190,1210,1230,], 
]};
/*[13] Blessed Aim		*/ var d231 = {values:[
//		["passive attack rating",], 
//		["hammer chance",1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,], 
		["hammer chance",12,14,16,18,20,22,24,26,28,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["attack rating",100,115,130,145,160,175,190,205,220,235,250,265,280,295,310,325,340,355,370,385,400,415,430,445,460,475,490,505,520,535,550,565,580,595,610,625,640,655,670,685,700,715,730,745,760,775,790,805,820,835,850,865,880,895,910,925,940,955,970,985,], 
]};
/*[14] Concentration	*/ var d241 = {values:[
		["attack rating",300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800,1900,2000,2100,2200,2300,2400,2500,2600,2700,2800,2900,3000,3100,3200,3300,3400,3500,3600,3700,3800,3900,4000,4100,4200,4300,4400,4500,4600,4700,4800,4900,5000,5100,5200,5300,5400,5500,5600,5700,5800,5900,6000,6100,6200,], 
		["damage",50,56,62,68,74,80,86,92,98,104,110,116,122,128,134,140,146,152,158,164,170,176,182,188,194,200,206,212,218,224,230,236,242,248,254,260,266,272,278,284,290,296,302,308,314,320,326,332,338,344,350,356,362,368,374,380,386,392,398,404,], 
		["hammer damage",50,56,62,68,74,80,86,92,98,104,110,116,122,128,134,140,146,152,158,164,170,176,182,188,194,200,206,212,218,224,230,236,242,248,254,260,266,272,278,284,290,296,302,308,314,320,326,332,338,344,350,356,362,368,374,380,386,392,398,404,], 
]};
/*[15] Holy Freeze		*/ var d242 = {values:[
		["attack min",20,30,40,50,60,70,80,90,110,130,150,170,190,210,230,250,290,330,370,410,450,490,570,650,730,810,890,970,1100,1230,1360,1490,1620,1750,1880,2010,2140,2270,2400,2530,2660,2790,2920,3050,3180,3310,3440,3570,3700,3830,3960,4090,4220,4350,4480,4610,4740,4870,5000,5130,], 
		["attack max",40,50,60,70,80,90,100,110,140,170,200,230,260,290,320,350,410,470,530,590,650,710,830,950,1070,1190,1310,1430,1610,1790,1970,2150,2330,2510,2690,2870,3050,3230,3410,3590,3770,3950,4130,4310,4490,4670,4850,5030,5210,5390,5570,5750,5930,6110,6290,6470,6650,6830,7010,7190,], 
		["aura min",4,6,8,10,12,14,16,18,22,26,30,34,38,42,46,50,58,66,74,82,90,98,114,130,146,162,178,194,220,246,272,298,324,350,376,402,428,454,480,506,532,558,584,610,636,662,688,714,740,766,792,818,844,870,896,922,948,974,1000,1026,], 
		["aura max",8,10,12,14,16,18,20,22,28,34,40,46,52,58,64,70,82,94,106,118,130,142,166,190,214,238,262,286,322,358,394,430,466,502,538,574,610,646,682,718,754,790,826,862,898,934,970,1006,1042,1078,1114,1150,1186,1222,1258,1294,1330,1366,1402,1438,], 
		["enemies slowed",14,18,20,23,25,26,27,28,29,30,31,31,32,33,33,34,34,34,34,35,35,36,36,36,36,36,37,37,37,37,37,37,37,37,37,38,38,38,38,38,38,38,38,38,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,40,], 
]};
/*[16] Holy Shock		*/ var d252 = {values:[
		["attack min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["attack max",50,100,150,200,250,300,350,400,500,600,700,800,900,1000,1100,1200,1375,1550,1725,1900,2075,2250,2500,2750,3000,3250,3500,3750,4050,4350,4650,4950,5250,5550,5850,6150,6450,6750,7050,7350,7650,7950,8250,8550,8850,9150,9450,9750,10050,10350,10650,10950,11250,11550,11850,12150,12450,12750,13050,13350,], 
		["aura min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["aura max",10,20,30,40,50,60,70,80,100,120,140,160,180,200,220,240,275,310,345,380,415,450,500,550,600,650,700,750,810,870,930,990,1050,1110,1170,1230,1290,1350,1410,1470,1530,1590,1650,1710,1770,1830,1890,1950,2010,2070,2130,2190,2250,2310,2370,2430,2490,2550,2610,2670,], 
]};
/*[17] Sanctuary		*/ var d253 = {values:[
		["damage to undead",50,80,110,140,170,200,230,260,290,320,350,380,410,440,470,500,530,560,590,620,650,680,710,740,770,800,830,860,890,920,950,980,1010,1040,1070,1100,1130,1160,1190,1220,1250,1280,1310,1340,1370,1400,1430,1460,1490,1520,1550,1580,1610,1640,1670,1700,1730,1760,1790,1820,], 
		["magic damage min",12,16,20,24,28,32,36,40,46,52,58,64,70,76,82,88,98,108,118,128,138,148,162,176,190,204,218,232,250,268,286,304,322,340,358,376,394,412,430,448,466,484,502,520,538,556,574,592,610,628,646,664,682,700,718,736,754,772,790,808,], 
		["magic damage max",24,30,36,42,48,54,60,66,74,82,90,98,106,114,122,130,142,154,166,178,190,202,218,234,250,266,282,298,318,338,358,378,398,418,438,458,478,498,518,538,558,578,598,618,638,658,678,698,718,738,758,778,798,818,838,858,878,898,918,938,], 
]};
/*[18] Fanaticism		*/ var d261 = {values:[
		["party damage",25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,], 
		["damage",50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,], 
		["attack speed",14,18,20,23,25,26,27,28,29,30,31,31,32,33,33,34,34,34,34,35,35,35,36,36,36,36,37,37,37,37,37,37,37,37,37,38,38,38,38,38,38,38,38,38,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,40,], 
		["attack rating",40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,330,335,], 
]};
/*[19] Conviction		*/ var d263 = {values:[
		["defense",-32,-38,-43,-47,-50,-52,-54,-56,-58,-59,-60,-61,-62,-63,-64,-65,-65,-66,-66,-67,-67,-68,-68,-69,-69,-69,-70,-70,-70,-70,-71,-71,-71,-71,-71,-72,-72,-72,-72,-72,-72,-73,-73,-73,-73,-73,-73,-73,-74,-74,-74,-74,-74,-74,-74,-74,-74,-74,-74,-75,], 
		["resist",-30,-35,-40,-45,-50,-55,-60,-65,-70,-75,-80,-85,-90,-95,-100,-105,-110,-115,-120,-125,-130,-135,-140,-145,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,-150,], 
]};

/*[20] Sacrifice		*/ var d311 = {values:[
		["attack rating",25,35,45,55,65,75,85,95,105,115,125,135,145,155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325,335,345,355,365,375,385,395,405,415,425,435,445,455,465,475,485,495,505,515,525,535,545,555,565,575,585,595,605,615,], 
		["damage",200,220,240,260,280,300,320,340,360,380,400,420,440,460,480,500,520,540,560,580,600,620,640,660,680,700,720,740,760,780,800,820,840,860,880,900,920,940,960,980,1000,1020,1040,1060,1080,1100,1120,1140,1160,1180,1200,1220,1240,1260,1280,1300,1320,1340,1360,1380,], 
]};
/*[21] Smite			*/ var d313 = {values:[
		["damage",50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,330,335,340,345,], 
		["stun length",0.6,0.8,1,1.2,1.4,1.6,1.8,2,2.2,2.4,2.6,2.8,3,3.2,3.4,3.6,3.8,4,4.2,4.4,4.6,4.8,5,5.2,5.4,5.6,5.8,6,6.2,6.4,6.6,6.8,7,7.2,7.4,7.6,7.8,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.8,11,11.2,11.4,11.6,11.8,12,12.2,12.4,], 
]};
/*[22] Holy Bolt		*/ var d322 = {values:[
		["magic min",8,16,24,32,40,48,56,64,74,84,94,104,114,124,134,144,157,170,183,196,209,222,238,254,270,286,302,318,338,358,378,398,418,438,458,478,498,518,538,558,578,598,618,638,658,678,698,718,738,758,778,798,818,838,858,878,898,918,938,958,], 
		["magic max",16,24,32,40,48,56,64,72,83,94,105,116,127,138,149,160,175,190,205,220,235,250,268,286,304,322,340,358,381,404,427,450,473,496,519,542,565,588,611,634,657,680,703,726,749,772,795,818,841,864,887,910,933,956,979,1002,1025,1048,1071,1094,], 
		["heals",5,9,13,17,21,25,29,33,37,41,45,49,53,57,61,65,69,73,77,81,85,89,93,97,101,105,109,113,117,121,125,129,133,137,141,145,149,153,157,161,165,169,173,177,181,185,189,193,197,201,205,209,213,217,221,225,229,233,237,241,], 
		["mana cost",4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,], 
]};
/*[23] Zeal				*/ var d331 = {values:[
		["attack bonus",25,35,45,55,65,75,85,95,105,115,125,135,145,155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325,335,345,355,365,375,385,395,405,415,425,435,445,455,465,475,485,495,505,515,525,535,545,555,565,575,585,595,605,615,], 
		["damage",0,0,0,0,7,14,21,28,35,42,49,56,63,70,77,84,91,98,105,112,119,126,133,140,147,154,161,168,175,182,189,196,203,210,217,224,231,238,245,252,259,266,273,280,287,294,301,308,315,322,329,336,343,350,357,364,371,378,385,392,], 
		["hits",2,3,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,], 
]};
/*[24] Charge			*/ var d333 = {values:[
		["damage",50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475,500,525,550,575,600,625,650,675,700,725,750,775,800,825,850,875,900,925,950,975,1000,1025,1050,1075,1100,1125,1150,1175,1200,1225,1250,1275,1300,1325,1350,1375,1400,1425,1450,1475,1500,1525,], 
		["attack rating",50,85,120,155,190,225,260,295,330,365,400,435,470,505,540,575,610,645,680,715,750,785,820,855,890,925,960,995,1030,1065,1100,1135,1170,1205,1240,1275,1310,1345,1380,1415,1450,1485,1520,1555,1590,1625,1660,1695,1730,1765,1800,1835,1870,1905,1940,1975,2010,2045,2080,2115,], 
]};
/*[25] Vengeance		*/ var d341 = {values:[
		["weapon damage min",], 
		["weapon damage max",], 
		["weapon fire min",], 
		["weapon fire max",], 
		["weapon cold min",], 
		["weapon cold max",], 
		["weapon lightning min",], 
		["weapon lightning max",], 
		["fire damage",70,78,86,94,102,110,118,126,134,142,150,158,166,174,182,190,198,206,214,222,230,238,246,254,262,270,278,286,294,302,310,318,326,334,342,350,358,366,374,382,390,398,406,414,422,430,438,446,454,462,470,478,486,494,502,510,518,526,534,542,], 
		["cold damage",70,78,86,94,102,110,118,126,134,142,150,158,166,174,182,190,198,206,214,222,230,238,246,254,262,270,278,286,294,302,310,318,326,334,342,350,358,366,374,382,390,398,406,414,422,430,438,446,454,462,470,478,486,494,502,510,518,526,534,542,], 
		["lightning damage",70,78,86,94,102,110,118,126,134,142,150,158,166,174,182,190,198,206,214,222,230,238,246,254,262,270,278,286,294,302,310,318,326,334,342,350,358,366,374,382,390,398,406,414,422,430,438,446,454,462,470,478,486,494,502,510,518,526,534,542,], 
		["attack rating",20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,], 
		["mana cost",4,4.1,4.2,4.3,4.5,4.6,4.7,4.8,5,5.1,5.2,5.3,5.5,5.6,5.7,5.8,6,6.1,6.2,6.3,6.5,6.6,6.7,6.8,7,7.1,7.2,7.3,7.5,7.6,7.7,7.8,8,8.1,8.2,8.3,8.5,8.6,8.7,8.8,9,9.1,9.2,9.3,9.5,9.6,9.7,9.8,10,10.1,10.2,10.3,10.5,10.6,10.7,10.8,11,11.1,11.2,11.3,], 
]};
/*[26] Blessed Hammer	*/ var d342 = {values:[
		["damage min",12,20,28,36,44,52,60,68,78,88,98,108,118,128,138,148,160,172,184,196,208,220,233,246,259,272,285,298,312,326,340,354,368,382,396,410,424,438,452,466,480,494,508,522,536,550,564,578,592,606,620,634,648,662,676,690,704,718,732,746,], 
		["damage max",16,24,32,40,48,56,64,72,82,92,102,112,122,132,142,152,164,176,188,200,212,224,237,250,263,276,289,302,316,330,344,358,372,386,400,414,428,442,456,470,484,498,512,526,540,554,568,582,596,610,624,638,652,666,680,694,708,722,736,750,], 
		["mana cost",5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,], 
]};
/*[27] Conversion		*/ var d351 = {values:[
		["convert chance",26,32,36,40,43,45,47,48,50,51,52,53,54,55,55,56,57,57,58,58,59,59,60,60,60,60,61,61,61,61,62,62,62,62,62,63,63,63,63,63,63,64,64,64,64,64,64,64,65,65,65,65,65,65,65,65,65,65,65,66,], 
		["duration",10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,], 
]};
/*[28] Holy Shield		*/ var d353 = {values:[
		["smite min",3,5,7,9,11,13,15,17,20,23,26,29,32,35,38,41,45,49,53,57,61,65,69,73,77,81,85,89,93,97,101,105,109,113,117,121,125,129,133,137,141,145,149,153,157,161,165,169,173,177,181,185,189,193,197,201,205,209,213,217,], 
		["smite max",6,8,10,12,14,16,18,20,23,26,29,32,35,38,41,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180,184,188,192,196,200,204,208,212,216,220,], 
		["duration",30,55,80,105,130,155,180,205,230,255,280,305,330,355,380,405,430,455,480,505,530,555,580,605,630,655,680,705,730,755,780,805,830,855,880,905,930,955,980,1005,1030,1055,1080,1105,1130,1155,1180,1205,1230,1255,1280,1305,1330,1355,1380,1405,1430,1455,1480,1505,], 
		["defense",25,40,55,70,85,100,115,130,145,160,175,190,205,220,235,250,265,280,295,310,325,340,355,370,385,400,415,430,445,460,475,490,505,520,535,550,565,580,595,610,625,640,655,670,685,700,715,730,745,760,775,790,805,820,835,850,865,880,895,910,], 
		["block",14,18,20,23,25,27,27,28,29,30,31,31,32,33,33,34,34,34,34,35,35,35,36,36,36,36,37,37,37,37,37,37,37,37,37,38,38,38,38,38,38,38,38,38,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,], 
]};
/*[29]Fist of the Heavens*/var d362 = {values:[
		["magic damage min",40,44,50,55,60,65,70,75,85,95,105,115,125,135,145,155,170,185,200,215,230,245,265,285,305,325,345,365,395,425,455,485,515,545,575,605,635,665,695,725,755,785,815,845,875,905,935,965,995,1025,1055,1085,1115,1145,1175,1205,1235,1265,1295,1325,], 
		["magic damage max",50,55,60,65,70,75,80,85,95,105,115,125,135,145,155,165,180,195,210,225,240,255,275,295,315,335,355,375,405,435,465,495,525,555,585,615,645,675,705,735,765,795,825,855,885,915,945,975,1005,1035,1065,1095,1125,1155,1185,1215,1245,1275,1305,1335,], 
		["lightning min",150,165,180,195,210,225,240,255,285,315,345,375,405,435,465,495,540,585,630,675,720,765,820,875,930,985,1040,1095,1160,1225,1290,1355,1420,1485,1550,1615,1680,1745,1810,1875,1940,2005,2070,2135,2200,2265,2330,2395,2460,2525,2590,2655,2720,2785,2850,2915,2980,3045,3110,3175,], 
		["lightning max",200,215,230,245,260,275,290,305,335,365,395,425,455,485,515,545,590,635,680,725,770,815,870,925,980,1035,1090,1145,1210,1275,1340,1405,1470,1535,1600,1665,1730,1795,1860,1925,1990,2055,2120,2185,2250,2315,2380,2445,2510,2575,2640,2705,2770,2835,2900,2965,3030,3095,3160,3225,], 
		["mana cost",15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,40,40.5,41,41.5,42,42.5,43,43.5,44,44.5,], 
]};
/*[30] Dashing Strike	*/ var d363 = {values:[
		["stun length",0.4,0.4,0.5,0.6,0.7,0.8,0.8,0.9,1,1.1,1.2,1.2,1.3,1.4,1.5,1.6,1.6,1.7,1.8,1.9,2,2,2.1,2.2,2.3,2.4,2.4,2.5,2.6,2.7,2.8,2.8,2.9,3,3.1,3.2,3.2,3.3,3.4,3.5,3.6,3.6,3.7,3.8,3.9,4,4,4.1,4.2,4.3,4.4,4.4,4.5,4.6,4.7,4.8,4.8,4.9,5,5.1,], 
		["magic min",37,54,73,90,109,126,145,163,189,215,240,267,293,318,345,371,399,426,454,482,511,539,569,599,629,659,689,719,751,783,815,847,879,911,943,975,1007,1039,1071,1103,1135,1167,1199,1231,1263,1295,1327,1359,1391,1423,1455,1487,1519,1551,1583,1615,1647,1679,1711,1743,], 
		["magic max",48,67,85,104,124,143,162,181,207,235,262,289,315,343,370,396,426,454,484,513,542,571,602,633,664,695,726,757,790,823,856,889,922,955,988,1021,1054,1087,1120,1153,1186,1219,1252,1285,1318,1351,1384,1417,1450,1483,1516,1549,1582,1615,1648,1681,1714,1747,1780,1813,], 
		["mana cost",4,4.3,4.7,5.1,5.5,5.8,6.2,6.6,7,7.3,7.7,8.1,8.5,8.8,9.2,9.6,10,10.3,10.7,11.1,11.5,11.8,12.2,12.6,13,13.3,13.7,14.1,14.5,14.8,15.2,15.6,16,16.3,16.7,17.1,17.5,17.8,18.2,18.6,19,19.3,19.7,20.1,20.5,20.8,21.2,21.6,22,22.3,22.7,23.1,23.5,23.8,24.2,24.6,25,25.3,25.7,26.1,], 
]};

var skills_paladin = [
{data:d111, key:"111", code:97, name:"Prayer", i:0, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura slowly regenerates<br>the life of you and your party<br><br>Radius: 24 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Heals: 1% of Maximum Life<br>Heals: "," Additional Life<br>Total Healing: ",""]},
{data:d113, key:"113", code:98, name:"Resist Fire", i:1, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura decreases fire damage<br>done to you and your party", syn_title:"", syn_text:"", graytext:"", index:[1,"% Maximum Fire Resistance"], text:["Radius: 28 yards<br>Passive: +","Resist Fire: +"," percent<br>Maximum Resist Fire: +"," percent",""]},
{data:d122, key:"122", code:99, name:"Defiance", i:2, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases the defense rating<br>of you and your party<br><br>Radius: 24 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Defense Bonus: +"," percent",""]},
{data:d123, key:"123", code:100, name:"Resist Cold", i:3, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura decreases cold damage<br>done to you and your party", syn_title:"", syn_text:"", graytext:"", index:[1,"% Maximum Cold Resistance"], text:["Radius: 28 yards<br>Passive: +","Resist Cold: +"," percent<br>Maximum Resist Cold: +"," percent",""]},
{data:d131, key:"131", code:101, name:"Cleansing", i:4, req:[0], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura reduces the length<br>of time you and your party<br>will remain poisoned or cursed", syn_title:"<br>Cleansing Receives Bonuses From:<br>", syn_text:"Prayer", graytext:"", index:[2,"% Maximum Poison Resistance"], text:["Radius: 24 yards<br>Heals "," Life per 2 Seconds<br>Passive: +","Duration reduced by "," percent",""]},
{data:d133, key:"133", code:102, name:"Resist Lightning", i:5, req:[], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura decreases lightning damage<br>done to you and your party", syn_title:"", syn_text:"", graytext:"", index:[1,"% Maximum Lightning Resistance"], text:["Radius: 28 yards<br>Passive: +","Resist Lightning: +"," percent<br>Maximum Resist Lightning: +"," percent",""]},
{data:d142, key:"142", code:103, name:"Vigor", i:6, req:[2,4,0], reqlvl:18, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases stamina recovery rate, maximum stamina<br>and movement speed for you and your party<br><br>Radius: 21.3 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Velocity: +"," percent<br>Stamina Bonus: +"," percent<br>Stamina Recovery Rate: +"," percent",""]},
{data:d151, key:"151", code:104, name:"Meditation", i:7, req:[4,0], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases mana recovery<br>for you and your party", syn_title:"<br>Meditation Receives Bonuses From:<br>", syn_text:"Prayer", graytext:"", index:[1," Life per 2 Seconds"], text:["Radius: 24 yards<br>Heals ","Mana Recovery Rate: +"," percent",""]},
{data:d162, key:"162", code:105, name:"Redemption", i:8, req:[6,2,4,0], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura attempts to redeem<br>the souls of slain enemies to give<br>you life and mana<br><br>Radius: 16 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Chance to redeem soul: "," percent<br>Life/Mana Recovered: "," points",""]},
{data:d163, key:"163", code:106, name:"Salvation", i:9, req:[], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases the elemental resistances<br>and damage of you and your party<br><br>Radius: 28 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Elemental Damage: +"," percent<br>Resist All: +"," percent",""]},

{data:d211, key:"211", code:107, name:"Might", i:10, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases the damage<br>done by you and your party<br><br>Radius: 16 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent",""]},
{data:d222, key:"222", code:108, name:"Holy Fire", i:11, req:[10], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura damages nearby enemies<br>with heavenly flames<br>Adds fire damage to your attack<br><br>Radius: 12 yards", syn_title:"<br>Holy Fire Receives Bonuses From:<br>", syn_text:"Resist Fire: +8% Fire Damage per Level<br>Salvation: +8% Fire Damage per Level", graytext:"", index:[0,""], text:["Fire Damage: ","-"," to your attack<br>Fire Damage: ","-",""]},
{data:d223, key:"223", code:109, name:"Precision", i:12, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, increases your chance to<br>hit, pierce and deal double damage<br><br>Radius: 16 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Your Piercing Attack: "," percent chance<br>Party Piercing Attack: "," percent chance<br>Critical Strike: "," percent chance<br>Attack Rating: +"," percent",""]},
{data:d231, key:"231", code:110, name:"Blessed Aim", i:13, req:[10], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases the attack rating<br>for you and your party", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Radius: 16 yards<br><br>Chance for you to cast Blessed Hammer on hit: ","%<br>Attack Rating: +"," percent",""], notupdated:0},
//{data:d231, key:"231", code:110, name:"Blessed Aim", i:13, req:[10], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases the attack rating<br>for you and your party", syn_title:"", syn_text:"", graytext:"", index:[1,"% Attack Rating"], text:["Radius: 16 yards<br>Passive: +","Chance for you to cast Blessed Hammer on hit: ","%<br>Attack Rating: +"," percent",""], notupdated:0},
//{data:d231, key:"231", code:110, name:"Blessed Aim", i:13, req:[10], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases the attack rating<br>for you and your party<br><br>Radius: 16 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["<br>Chance for you to cast Blessed Hammer on hit: ","%<br>Attack Rating: +"," percent"]},
{data:d241, key:"241", code:111, name:"Concentration", i:14, req:[13,10], reqlvl:18, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases the damage and decreases the chance<br>that the attack will be interrupted for you and your party<br><br>Radius: 16 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Attack Rating: +","<br>Chance uninterruptable: 20 percent<br>Damage: +"," percent<br>Blessed Hammer Magic Damage: +"," percent",""]},
{data:d242, key:"242", code:112, name:"Holy Freeze", i:15, req:[11,10], reqlvl:18, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura freezes nearby monsters<br>Adds cold damage to your attack<br><br>Radius: 13.3 yards", syn_title:"<br>Holy Freeze Receives Bonuses From:<br>", syn_text:"Resist Cold: +4% Cold Damage per Level<br>Salvation: +6% Cold Damage per Level", graytext:"", index:[0,""], text:["Cold Damage: ","-"," to your attack<br>Cold Damage: ","-","<br>Enemies slowed "," percent",""]},
{data:d252, key:"252", code:113, name:"Holy Shock", i:16, req:[15,11,10], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura causes pulses of electricity<br>to damage nearby enemies<br>Adds lightning damage to your attack<br><br>Radius: 18.6 yards", syn_title:"<br>Holy Shock Receives Bonuses From:<br>", syn_text:"Resist Lightning: +4% Lightning Damage per Level<br>Salvation: +6% Lightning Damage per Level", graytext:"", index:[0,""], text:["Lightning Damage: ","-"," to your attack<br>Lightning Damage: ","-",""]},
{data:d253, key:"253", code:114, name:"Sanctuary", i:17, req:[12,15,11,10], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura deals magic damage to nearby<br>enemies and increases your damage against undead<br><br>Radius: 12.6 yards", syn_title:"<br>Sanctuary Receives Bonuses From:<br>", syn_text:"Cleansing: +18% Magic Damage per Level<br>Dashing Strike: +18% Magic Damage per Level", graytext:"", index:[0,""], text:["Damage to Undead: +"," percent<br>Magic Damage: ","-",""]},
{data:d261, key:"261", code:115, name:"Fanaticism", i:18, req:[14,13,10], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura increases damage, attack speed,<br>and attack rating for you and your party<br><br>Radius: 12 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Party Damage: +"," percent<br>Your Damage: +"," percent<br>Attack Speed: +"," percent<br>Attack Rating: +"," percent",""]},
{data:d263, key:"263", code:116, name:"Conviction", i:19, req:[17,12,15,11,10], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:3, bindable:1, description:"When active, aura reduces the defenses<br>and resistances of nearby enemies<br><br>Radius: 24 yards", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Defense: "," percent<br>Resistances: "," percent",""]},

{data:d311, key:"311", code:117, name:"Sacrifice", i:20, req:[], reqlvl:1, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Increased accuracy and damage<br>at the cost of life<br><br>Deals 150% of Weapon damage<br>4 percent damage to self", syn_title:"<br>Sacrifice Receives Bonuses From:<br>", syn_text:"Redemption: +10% Damage per Level<br>Fanaticism: +5% Damage per Level", graytext:"", index:[0,""], text:["To Attack Rating: +"," percent<br>Damage: +"," percent",""], notupdated:0},
{data:d313, key:"313", code:118, name:"Smite", i:21, req:[], reqlvl:1, reqWeapon:[""], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Temporarily stun your enemy<br>by bashing it with your shield<br><br>Gains additional damage while Holy Shield is active", syn_title:"<br>Smite Receives Bonuses From:<br>", syn_text:"Defiance: +8% Damage per Level", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Stun Length: "," seconds<br>Mana Cost: 4",""]},
{data:d322, key:"322", code:119, name:"Holy Bolt", i:22, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:2, description:"A bolt of Divine energy that<br>damages enemies and heals allies<br><br>Heal Duration: 1 second", syn_title:"<br>Holy Bolt Receives Bonuses From:<br>", syn_text:"Sanctuary: +35% Magic Damage per Level<br>Fist of the Heavens: +35% Magic Damage per Level<br>Prayer: +35% Life Healed per Level<br>+2 Additional Bolts while having 100+ Total Energy", graytext:"", index:[0,""], text:["Magic Damage: ","-","<br>Heals: "," per second<br>Mana Cost: ",""]},
{data:d331, key:"331", code:120, name:"Zeal", i:23, req:[20], reqlvl:12, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Allows you to attack multiple adjacent enemies<br>with a single attack<br><br>Deals 100% of Weapon Damage", syn_title:"<br>Zeal Receives Bonuses From:<br>", syn_text:"Sacrifice: +10% Damage per Level", graytext:"", index:[0,""], text:["Attack Bonus: +"," percent<br>Damage: +"," percent<br>"," hits<br>Mana Cost: 2",""]},
{data:d333, key:"333", code:121, name:"Charge", i:24, req:[21], reqlvl:12, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Charge into battle and attack an enemy<br><br>Deals 100% of weapon Damage", syn_title:"<br>Charge Receives Bonuses From:<br>", syn_text:"Vigor: +26% Damage per Level<br>Might: +26% Damage per Level", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>Mana Cost: 8",""]},
{data:d341, key:"341", code:122, name:"Vengeance", i:25, req:[23,20], reqlvl:18, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Fire, lightning, and cold damage are added<br>to each successful attack", syn_title:"<br>Vengeance Receives Bonuses From:<br>", syn_text:"Resist Fire: +15% Fire Damage per Level<br>Resist Cold: +15% Cold Damage per Level<br>Resist Lightning: +15% Lightning Damage per Level<br>Salvation: +2% Elemental Damage per Level", graytext:"", index:[8,""], text:["Damage from Weapon: ","-","<br>Fire Damage: ","-","<br>Cold Damage: ","-","<br>Lightning Damage: ","-","Fire Damage: +"," percent<br>Cold Damage: +"," percent<br>Lightning Damage: +"," percent<br>Attack Rating: +"," percent<br>Mana Cost: ",""], notupdated:0},
{data:d342, key:"342", code:123, name:"Blessed Hammer", i:26, req:[22], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Summons an ethereal hammer that<br>spirals outwards damaging enemies it hits<br><br>150 percent Damage to Undead", syn_title:"<br>Blessed Hammer Receives Bonuses From:<br>", syn_text:"Blessed Aim: +14% Magic Damage per Level<br>Vigor: +14% Magic Damage per Level", graytext:"", index:[0,""], text:["Magic Damage: ","-","<br>Mana Cost: ",""]},
{data:d351, key:"351", code:124, name:"Conversion", i:27, req:[25,23,20], reqlvl:24, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Converts monsters to fight against<br>other foul demons and beasts", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Chance to convert: "," percent<br>Duration: "," seconds<br>Mana Cost: 20",""], notupdated:1},
{data:d353, key:"353", code:125, name:"Holy Shield", i:28, req:[24,26,21,22], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Enhances your shield with divine power", syn_title:"<br>Holy Shield Receives Bonuses From:<br>", syn_text:"Defiance: +15% Defense per Level", graytext:"", index:[0,""], text:["Smite Damage: +","-","<br>Duration: "," seconds<br>Defense Bonus: +"," percent<br>Successful Block: +"," percent<br>Mana Cost: 35",""]},
{data:d362, key:"362", code:126, name:"Fist of the Heavens", i:29, req:[26,27,22,25,23,20], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:2, description:"Lightning Strikes your target as holy bolts<br>seek out nearby enemies", syn_title:"<br>Fist of the Heavens Receives Bonuses From:<br>", syn_text:"Holy Bolt: +13% Holy Bolt Damage per Level<br>Holy Shock: +8% Lightning damage per Level", graytext:"", index:[0,""], text:["Holy Bolt Magic Damage: ","-","<br>Lightning Damage: ","-","<br>Mana Cost: ",""]},
{data:d363, key:"363", code:127, name:"Dashing Strike", i:30, req:[28,24,26,21,22], reqlvl:30, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Instantly dash forward to the target enemy or ally<br>stunning and damaging enemies nearby<br><br>Cooldown: 5 seconds", syn_title:"<br>Dashing Strike Receives Bonuses From:<br>", syn_text:"Smite: +12% Magic Damage per Level<br>Charge: +12% Magic Damage per Level<br>Holy Shield: +12% Magic Damage per Level", graytext:"", index:[0,""], text:["Stun Length: "," seconds<br>Magic Damage: ","-","<br>Mana Cost: ",""]}
];