
var character_amazon = {class_name:"Amazon", strength:20, dexterity:25, vitality:20, energy:15, life:50, mana:15, stamina:184, levelup_life:2.5, levelup_stamina:1, levelup_mana:1.5, ar_per_dexterity:5, life_per_vitality:3, stamina_per_vitality:1, mana_per_energy:1.5, starting_strength:20, starting_dexterity:25, starting_vitality:20, starting_energy:15, ar_const:10, block_const:3, skill_layout:"./images/skill_trees/PoD/amazon.png", mana_regen:1.66,
	weapon_frames:{dagger:12, sword:[13,17], axe:[13,17], mace:[13,17], thrown:[13,12], staff:17, polearm:17, scepter:13, wand:13, javelin:12, spear:17, bow:13, crossbow:19},
	// Skills that may adjust IAS breakpoints: Jab, Fend, Strafe
	fcr_frames:19, fcr_bp:[0, 7, 14, 22, 32, 48, 68, 99, 152],
	fhr_frames:11, fhr_bp:[0, 6, 13, 20, 32, 52, 86, 174, 600],
	fbr_frames:5, fbr_bp:[0, 13, 32, 86, 600],
	fbr_frames_alt:17, fbr_bp_alt:[0, 4, 6, 11, 15, 23, 29, 40, 56, 80, 120, 200, 480],	// 1-hand swinging weapons (axes, maces, swords, throwing axes, wands)
	
	// getSkillData - gets skill info from the skills data table
	//	skill: skill object for the skill in question
	//	lvl: level of the skill
	//	elem: which element of the skill to return
	// result: value of the skill element at the specified level
	// ---------------------------------
	getSkillData : function(skill, lvl, elem) {
		var result = skill.data.values[elem][lvl];
		
		if (skill.name == "Molten Strike" && elem > 0 && elem < 3) { 		result *= ((1 + 0.15*skills[0].level) * (1+character.fDamage/100)) }
		if (skill.name == "Poison Javelin" && elem < 2) { 					result *= ((1 + 0.15*skills[6].level + 0.02*(character.dexterity + character.all_attributes + character.level*character.dexterity_per_level)) * (1+character.pDamage/100)) }
		if (skill.name == "Poison Javelin" && elem == 3) { 					result = -(3 + 1*skills[6].level) }
		if (skill.name == "Plague Javelin" && elem > 0 && elem < 3) { 		result *= ((1 + (0.22*skills[2].level)) * (1+character.pDamage/100)) }
		if (skill.name == "Power Strike" && elem > 0 && elem < 3) { 		result *= ((1 + (0.20*skills[5].level + 0.20*skills[8].level)) * (1+character.lDamage/100)) }
		if (skill.name == "Lightning Bolt" && elem < 2) { 					result *= ((1 + (0.12*skills[1].level + 0.12*skills[9].level)) * (1+character.lDamage/100)) }
		if (skill.name == "Charged Strike" && elem > 0 && elem < 3) { 		result *= ((1 + (0.20*skills[1].level + 0.20*skills[8].level)) * (1+character.lDamage/100)) }
		if (skill.name == "Lightning Strike" && elem > 0 && elem < 3) { 	result *= ((1 + (0.15*skills[1].level + 0.15*skills[5].level)) * (1+character.lDamage/100)) }
//		if (skill.name == "Lightning Fury" && elem > 0 && elem < 3) { 		result *= ((1 + (0.05*skills[4].level)) * (1+character.lDamage/100)) }
		if (skill.name == "Lightning Fury" && elem > 0 && elem < 3) { 		result *= ((1 + (0.02*skills[4].level + 0.02*skills[1].level)) * (1+character.lDamage/100)) }
		
		// calculates bow's physical damage - similar to getWeaponDamage()
		var bow_min = 1;
		var bow_max = 1;
		var bow_mult = 1;
		if (skill.name == "Decoy" && (equipped.weapon.type == "bow" || equipped.weapon.type == "crossbow") && (elem == 1 || elem == 2)) {
			var dexTotal = (character.dexterity + character.all_attributes + character.level*character.dexterity_per_level);
			bow_min = (character.base_damage_min * (1+character.e_damage/100) + character.damage_min + character.level*character.min_damage_per_level);
			bow_max = (character.base_damage_max * (1+(character.e_damage+(character.level*character.e_max_damage_per_level))/100) + character.damage_max + character.level*character.max_damage_per_level);
			bow_mult = (1+dexTotal/100+character.damage_bonus/100);
		}
		if (skill.name == "Decoy" && elem == 0) {						result = Math.max(1, skills[22].level) }
		if (skill.name == "Decoy" && elem == 1) {						result = Math.floor(bow_min*bow_mult) }
		if (skill.name == "Decoy" && elem == 2) {						result = Math.floor(bow_max*bow_mult) }
		if (skill.name == "Decoy" && elem > 2 && elem < 5) {			result *= (1 + character.summon_damage/100) }
		if (skill.name == "Valkyrie" && elem < 2) { 					result *= (1 + (0.20*skills[1].level + 0.20*skills[8].level + character.summon_damage/100)) }
		if (skill.name == "Valkyrie" && elem > 1 && elem < 4) { 		result *= (1 + (0.18*skills[0].level + 0.18*skills[3].level + character.summon_damage/100)) }
		
		if (skill.name == "Magic Arrow" && elem == 0) { 				result += character.extra_conversion_Magic_Arrow }
		if (skill.name == "Cold Arrow" && elem > 0 && elem < 3) { 		result *= ((1 + (0.12*skills[24].level)) * (1+character.cDamage/100)) }
		if (skill.name == "Ice Arrow" && elem < 2) { 					result *= ((1 + (0.10*skills[20].level)) * (1+character.cDamage/100)) }
		if (skill.name == "Ice Arrow" && elem == 2) { 					result *= (1 + (0.05*skills[29].level)) }
		if (skill.name == "Freezing Arrow" && elem == 0) { 				result = 3.3 * (1+character.radius_FreezingArrow/100) }
		if (skill.name == "Freezing Arrow" && elem > 0 && elem < 3) { 	result *= ((1 + (0.21*skills[20].level + 0.04*skills[24].level)) * (1+character.cDamage/100)) }
		if (skill.name == "Freezing Arrow" && elem == 3) { 				result = (2 * (1 + 0.04*skills[24].level)) }
		if (skill.name == "Fire Arrow" && (elem == 1 || elem == 2 || elem == 4 || elem == 5)) { result *= ((1 + (0.12*skills[26].level)) * (1+character.fDamage/100)) }
		if (skill.name == "Exploding Arrow" && elem < 2) { 				result *= ((1 + (0.20*skills[21].level + 0.20*skills[23].level)) * (1+character.fDamage/100)) }
		if (skill.name == "Strafe" && elem == 5) { 						result = Math.max(1, skills[27].level) }
		if (skill.name == "Immolation Arrow" && elem < 2) { 			result *= ((1 + (0.15*skills[26].level)) * (1+character.fDamage/100)) }
		if (skill.name == "Immolation Arrow" && elem > 1 && elem < 4) { result *= ((1 + (0.16*skills[23].level)) * (1+character.fDamage/100)) }

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
		
		if (skill.name == "Phase Run") { result.fhr = 30; result.velocity = 30; result.duration = skill.data.values[0][lvl]; result.reset_on_kill = skill.data.values[1][lvl]; }
		if (skill.name == "Inner Sight") {
			if (effects[id].info.enabled == 1) { for (effect_id in effects) { if (effect_id != id && effect_id.split("-")[0] == id) { disableEffect(effect_id) } } }
			result.enemy_defense_flat = skill.data.values[0][lvl]; result.radius = skill.data.values[1][lvl];
		}
		if (skill.name == "Lethal Strike") { result.cstrike = skill.data.values[0][lvl]; }
		if (skill.name == "Penetrate") { result.ar_bonus = skill.data.values[0][lvl]; }
		if (skill.name == "Pierce") { result.pierce = skill.data.values[0][lvl]; }
		if (skill.name == "Dodge") { result.dodge = skill.data.values[0][lvl]; }
		if (skill.name == "Avoid") { result.avoid = skill.data.values[0][lvl]; }
		if (skill.name == "Evade") { result.evade = skill.data.values[0][lvl]; }
		if (skill.name == "Poison Javelin") { result.enemy_pRes = -skill.data.values[3]; }
		// No stat buffs:
		if (skill.name == "Decoy") { result.duration = skill.data.values[8][lvl]; }
		if (skill.name == "Valkyrie") { result.amountSummoned = 1+character.extraValkyrie; }
		
		
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
		var attack = 0;	// 0 = no basic damage, 1 = includes basic attack damage, 2 = includes basic throw damage
		var spell = 2;	// 0 = uses attack rating, 1 = no attack rating, 2 = non-damaging
		var damage_enhanced = character.damage_bonus + character.e_damage + character.physicalDamage;

		if (skill.name == "Jab") { 						attack = 1; spell = 0; ar_bonus = character.getSkillData(skill,lvl,0); damage_bonus = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Power Strike") { 		attack = 1; spell = 0; ar_bonus = character.getSkillData(skill,lvl,0); lDamage_min = character.getSkillData(skill,lvl,1); lDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Poison Javelin") {		attack = 2; spell = 0; pDamage_min = character.getSkillData(skill,lvl,0); pDamage_max = character.getSkillData(skill,lvl,1); pDamage_duration = 5; }
		else if (skill.name == "Fend") { 				attack = 1; spell = 0; weapon_damage = 125; ar_bonus = character.getSkillData(skill,lvl,0); damage_bonus = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Lightning Bolt") {		attack = 2; spell = 1; nonPhys_min = 0; nonPhys_max = 0; lDamage_min = phys_min+character.lDamage_min + character.getSkillData(skill,lvl,0); lDamage_max = phys_max+character.lDamage_max+(character.lDamage_max_per_2_energy*Math.floor((character.energy+character.all_attributes)*(1+character.max_energy/100)/2)) + character.getSkillData(skill,lvl,1); }	// lDamage bonus only applies to skill damage
		else if (skill.name == "Charged Strike") {		attack = 1; spell = 1; lDamage_min = character.getSkillData(skill,lvl,1); lDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Plague Javelin") {		attack = 2; spell = 0; ar_bonus = character.getSkillData(skill,lvl,0); pDamage_min = character.getSkillData(skill,lvl,1); pDamage_max = character.getSkillData(skill,lvl,2); pDamage_duration = 5; }
		else if (skill.name == "Molten Strike") { 		attack = 1; spell = 0; ar_bonus = character.getSkillData(skill,lvl,0); weapon_damage = 0.2*85; fDamage_min = character.getSkillData(skill,lvl,1)*(1+character.fDamage/100); fDamage_max = character.getSkillData(skill,lvl,2)*(1+character.fDamage/100); }
	//	else if (skill.name == "Molten Strike") { 		attack = 1; spell = 0; ar_bonus = character.getSkillData(skill,lvl,0); weapon_damage = 0.2*85; fDamage_min = 0.6*0.85*phys_min*phys_mult*(1+character.fDamage/100) + character.getSkillData(skill,lvl,1); fDamage_max = 0.6*0.85*phys_max*phys_mult*(1+character.fDamage/100) + character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Lightning Strike") {	attack = 1; spell = 1; lDamage_min = character.getSkillData(skill,lvl,1); lDamage_max = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Lightning Fury") {		attack = 2; spell = 1; lDamage_min = character.getSkillData(skill,lvl,1); lDamage_max = character.getSkillData(skill,lvl,2); }
	//	else if (skill.name == "Decoy") {				attack = 0; spell = 1; }
	//	else if (skill.name == "Valkyrie") {			attack = 0; spell = 1; }
		else if (skill.name == "Cold Arrow") {			attack = 1; spell = 0; weapon_damage = 100-character.getSkillData(skill,lvl,0); cDamage_min = phys_min*phys_mult*(character.getSkillData(skill,lvl,0)/100)*(1+character.cDamage/100) + character.getSkillData(skill,lvl,1); cDamage_max = phys_max*(character.getSkillData(skill,lvl,0)/100)*(1+character.cDamage/100) + character.getSkillData(skill,lvl,2); ar_bonus = character.getSkillData(skill,lvl,4); }
		else if (skill.name == "Magic Arrow") {			attack = 1; spell = 0; weapon_damage = 100-character.getSkillData(skill,lvl,0); mDamage_min = phys_min*phys_mult*(character.getSkillData(skill,lvl,0)/100) * (1+character.mDamage/100) + character.getSkillData(skill,lvl,1); mDamage_max = phys_max*(character.getSkillData(skill,lvl,0)/100) * (1+character.mDamage/100) + character.getSkillData(skill,lvl,2); ar_bonus = character.getSkillData(skill,lvl,3); }	// mDamage or regular damage? is damage converted to Magic after all enhancements?
		else if (skill.name == "Multiple Shot") {		attack = 1; spell = 0; weapon_damage = 87; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Fire Arrow") {			attack = 1; spell = 0; weapon_damage = 100-character.getSkillData(skill,lvl,0); fDamage_min = phys_min*phys_mult*(character.getSkillData(skill,lvl,0)/100)*(1+character.fDamage/100) + character.getSkillData(skill,lvl,4); fDamage_max = phys_max*(character.getSkillData(skill,lvl,0)/100)*(1+character.fDamage/100) + character.getSkillData(skill,lvl,5); ar_bonus = character.getSkillData(skill,lvl,3); }
		else if (skill.name == "Ice Arrow") {			attack = 1; spell = 0; cDamage_min = character.getSkillData(skill,lvl,0); cDamage_max = character.getSkillData(skill,lvl,1); ar_bonus = character.getSkillData(skill,lvl,3); }
		else if (skill.name == "Guided Arrow") {		attack = 1; spell = 1; weapon_damage = 150; damage_bonus = character.getSkillData(skill,lvl,0); }
		else if (skill.name == "Exploding Arrow") {		attack = 1; spell = 0; fDamage_min = character.getSkillData(skill,lvl,0); fDamage_max = character.getSkillData(skill,lvl,1); ar_bonus = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Strafe") {				attack = 1; spell = 0; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); damage_bonus = character.getSkillData(skill,lvl,3); }
		else if (skill.name == "Immolation Arrow") {	attack = 1; spell = 0; fDamage_min = character.getSkillData(skill,lvl,0); fDamage_max = character.getSkillData(skill,lvl,1); ar_bonus = character.getSkillData(skill,lvl,4); }
		else if (skill.name == "Freezing Arrow") {		attack = 1; spell = 0; cDamage_min = character.getSkillData(skill,lvl,1); cDamage_max = character.getSkillData(skill,lvl,2); ar_bonus = character.getSkillData(skill,lvl,4); }
		
		if (typeof(skill.reqWeapon) != 'undefined') { var match = 0; for (let w = 0; w < skill.reqWeapon.length; w++) {
			if (equipped.weapon.type == skill.reqWeapon[w]) { match = 1 }
		} if (match == 0) { spell = 2 } }
		
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
		if (attack == 1){
			addmore = "yes"
		}
		
		var result = {min:skillMin,max:skillMax,ar:skillAr};
		return result
	},
	
	// setSkillAmounts - helps update class-related skill levels, called by calculateSkillAmounts()
	//	s: index of skill
	// ---------------------------------
	setSkillAmounts : function(s) {
		skills[s].extra_levels += character.skills_amazon
		if (s == 7 || s == 23 || s == 26 || s == 28) { skills[s].extra_levels += character.skills_fire_all }
		if (s == 20 || s == 24 || s == 29) { skills[s].extra_levels += character.skills_cold_all }
		if (s == 1 || s == 4 || s == 5 || s == 8 || s == 9) { skills[s].extra_levels += character.skills_lightning_all }
		if (s == 2 || s == 6) { skills[s].extra_levels += character.skills_poison_all }
		if (s == 21) { skills[s].extra_levels += character.skills_magic_all }
		if (s == 17 || s == 18) { skills[s].extra_levels += character.skills_summon_all }
		if (s == 7 || s == 23 || s == 26 || s == 28 || s == 20 || s == 24 || s == 29 || s == 1 || s == 4 || s == 5 || s == 8 || s == 9 || s == 2 || s == 6) { skills[s].extra_levels += character.skills_ele_poison_all }
		if (s < 10) {
			skills[s].extra_levels += character.skills_javelins
			skills[s].extra_levels += character.skills_tree1
		} else if (s > 19) {
			skills[s].extra_levels += character.skills_bows
			skills[s].extra_levels += character.skills_tree3
		} else {
			skills[s].extra_levels += character.skills_passives
			skills[s].extra_levels += character.skills_tree2
		}
	}
};

/*[ 0] Jab				*/ var d111 = {values:[
		["attack rating",40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,], 
		["damage",30,36,42,48,54,60,66,72,78,84,90,96,102,108,114,120,126,132,138,144,150,156,162,168,174,180,186,192,198,204,210,216,222,228,234,240,246,252,258,264,270,276,282,288,294,300,306,312,318,324,330,336,342,348,354,360,366,372,378,384,], 
		["mana cost",2,2.2,2.5,2.7,3,3.2,3.5,3.7,4,4.2,4.5,4.7,5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,], 
]};
/*[ 1] Power Strike		*/ var d122 = {values:[
		["attack rating",20,32,44,56,68,80,92,104,116,128,140,152,164,176,188,200,212,224,236,248,260,272,284,296,308,320,332,344,356,368,380,392,404,416,428,440,452,464,476,488,500,512,524,536,548,560,572,584,596,608,620,632,644,656,668,680,692,704,716,728,], 
		["lightning min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["lightning max",16,36,56,76,96,116,136,156,206,256,306,356,406,456,506,556,636,716,796,876,956,1036,1136,1236,1336,1436,1536,1636,1786,1936,2086,2236,2386,2536,2686,2836,2986,3136,3286,3436,3586,3736,3886,4036,4186,4336,4486,4636,4786,4936,5086,5236,5386,5536,5686,5836,5986,6136,6286,6436,], 
		["mana cost",2,2.2,2.5,2.7,3,3.2,3.5,3.7,4,4.2,4.5,4.7,5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,], 
]};
/*[ 2] Poison Javelin	*/ var d123 = {values:[
		["poison min",15,23,31,39,46,54,62,70,85,101,117,132,148,164,179,195,218,242,265,289,312.5,335.5,367,398,429.5,460.5,492,523,570,617,664,710.5,757.5,804.5,851.5,898,945,992,1039,1085.5,1132.5,1179.5,1226.5,1273,1320,1367,1414,1460.5,1507.5,1554.5,1601.5,1648,1695,1742,1789,1835.5,1882.5,1929.5,1976.5,2023,], 
		["poison max",23,31,39,46,54,62,70,78,95,113,130,148,166,183,201,218,244,269,294,320,345.5,371,404,437.5,470.5,503.5,537,570,619,667.5,716.5,765.5,814,863,912,960.5,1009.5,1058.5,1107,1156,1205,1253.5,1302.5,1351.5,1400,1449,1498,1046.5,1595.5,1644.5,1693,1742,1791,1839.5,1888.5,1937.5,1986,2035,2083.5,2132.5,], 
		["mana cost",4,4.2,4.5,4.7,5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.5,17.7,18,18.2,18.5,18.7,], 
		["poison resistance",], 
]};
/*[ 3] Fend				*/ var d131 = {values:[
		["attack rating",25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,], 
		["damage",40,47,54,61,68,75,82,89,96,103,110,117,124,131,138,145,152,159,166,173,180,187,194,201,208,215,222,229,236,243,250,257,264,271,278,285,292,299,306,313,320,327,334,341,348,355,362,369,376,383,390,397,404,411,418,425,432,439,446,453,], 
]};
/*[ 4] Lightning Bolt	*/ var d133 = {values:[
		["lightning min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["lightning max",40,55,70,85,100,115,130,145,165,185,205,225,245,265,285,305,345,385,425,465,505,545,625,705,785,865,945,1025,1145,1265,1385,1505,1625,1745,1865,1985,2105,2225,2345,2465,2585,2705,2825,2945,3065,3185,3305,3425,3545,3665,3785,3905,4025,4145,4265,4385,4505,4625,4745,4865,], 
		["mana cost",6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.5,17.7,18,18.2,18.5,18.7,19,19.2,19.5,19.7,20,20.2,20.5,20.7,], 
]};
/*[ 5] Charged Strike	*/ var d142 = {values:[
		["bolts",3,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,], 
		["lightning min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["lightning max",30,45,60,75,90,105,120,135,155,175,195,215,235,255,275,295,318,343,367,391,415,439,467,495,523,551,579,607,642,677,712,747,782,817,852,887,922,957,992,1027,1062,1097,1132,1167,1202,1237,1272,1307,1342,1377,1412,1447,1482,1517,1552,1587,1622,1657,1692,1727,], 
		["mana cost",4,4.2,4.5,4.7,5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.5,17.7,18,18.2,18.5,18.7,], 
]};
/*[ 6] Plague Javelin	*/ var d143 = {values:[
		["attack rating",30,39,48,57,66,75,84,93,102,111,120,129,138,147,156,165,174,183,192,201,210,219,228,237,246,255,264,273,282,291,300,309,318,327,336,345,354,363,372,381,390,399,408,417,426,435,444,453,462,471,480,489,498,507,516,525,534,543,552,561,], 
		["poison min",39,70,101,132,163,195,226,257,316,375,433,492,550,609,667,726,843,960,1077,1195,1312,1429,1625,1820,2015,2210,2406,2601,2875,3148,3421,3695,3968,4242,4515,4789,5062,5335,5609,5882,6156,6429,6703,6976,7250,7523,7796,8070,8343,8617,8890,9164,9437,9710,9984,10257,10531,10804,11078,11351,], 
		["poison max",62,101,140,179,218,257,296,335,413,492,570,648,726,804,882,960,1097,1234,1370,1507,1644,1781,1996,2210,2425,2640,2855,3070,3382,3695,4007,4320,4632,4945,5257,5570,5882,6195,6507,6820,7132,7445,7757,8070,8382,8695,9007,9320,9632,9945,10257,10570,10882,11195,11507,11820,12132,12445,12757,13070,], 
		["mana cost",7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,], 
]};
/*[ 7] Molten Strike	*/ var d151 = {values:[
		["attack rating",10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,], 
		["fire min",15,23,31,39,47,55,63,71,85,99,113,127,141,155,169,183,203,223,243,263,283,303,329,355,381,407,433,459,491,523,555,587,619,651,683,715,747,779,811,843,875,907,939,971,1003,1035,1067,1099,1131,1163,1195,1227,1259,1291,1323,1355,1387,1419,1451,1483,], 
		["fire max",25,35,45,55,65,75,85,95,111,127,143,159,175,191,207,223,245,267,289,311,333,355,383,411,439,467,495,523,558,593,628,663,698,733,768,803,838,873,908,943,978,1013,1048,1083,1118,1153,1188,1223,1258,1293,1328,1363,1398,1433,1468,1503,1538,1573,1608,1643,], 
]};
/*[ 8] Lightning Strike	*/ var d162 = {values:[
		["hits",2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,], 
		["lightning min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["lightning max",25,40,55,70,85,100,115,130,160,190,220,250,280,310,340,370,410,450,490,530,570,610,660,710,760,810,860,910,970,1030,1090,1150,1210,1270,1330,1390,1450,1510,1570,1630,1690,1750,1810,1870,1930,1990,2050,2110,2170,2230,2290,2350,2410,2470,2530,2590,2650,2710,2770,2830,], 
]};
/*[ 9] Lightning Fury	*/ var d163 = {values:[
		["bolts",2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,], 
		["lightning min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["lightning max",40,55,70,85,100,115,130,145,170,195,220,345,270,395,320,345,375,405,435,465,495,525,565,605,645,685,725,765,815,865,915,965,1015,1065,1115,1165,1215,1265,1315,1365,1415,1465,1515,1565,1615,1665,1715,1765,1815,1865,1915,1965,2015,2065,2115,2165,2215,2265,2315,2365,], 
		["mana cost",10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,], 
]};

/*[10] Inner Sight		*/ var d211 = {values:[
		["enemy defense",-40,-65,-90,-115,-140,-165,-190,-215,-260,-305,-350,-395,-440,-485,-530,-575,-635,-695,-755,-815,-875,-935,-1015,-1095,-1175,-1255,-1335,-1415,-1515,-1615,-1715,-1815,-1915,-2015,-2115,-2215,-2315,-2415,-2515,-2615,-2715,-2815,-2915,-3015,-3115,-3215,-3315,-3415,-3515,-3615,-3715,-3815,-3915,-4015,-4115,-4215,-4315,-4415,-4515,-4615,], 
		["radius",6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,], 
]};
/*[11] Lethal Strike	*/ var d213 = {values:[
		["critical chance",16,25,32,38,42,46,49,51,54,56,58,59,61,62,63,65,65,66,67,68,68,69,70,71,71,71,72,72,73,73,74,74,74,74,74,75,75,76,76,76,76,77,77,77,77,77,77,77,78,78,78,78,78,79,79,79,79,79,79,80,], 
]};
/*[12] Phase Run		*/ var d221 = {values:[
		["duration",7,7.3,7.7,8,8.4,8.8,9.1,9.5,9.8,10.2,10.6,10.9,11.3,11.6,12,12.4,12.7,13.1,13.4,13.8,14.2,14.5,14.9,15.2,15.6,16,16.3,16.7,17,17.4,17.8,18.1,18.5,18.8,19.2,19.6,19.9,20.3,20.6,21,21.4,21.7,22.1,22.4,22.8,23.2,23.5,23.9,24.2,24.6,25,25.3,25.7,26,26.4,26.8,27.1,27.5,27.8,28.2,], 
		["reset chance",2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12,13,13,13,14,14,14,15,15,15,16,16,16,17,17,17,18,18,18,19,19,19,20,20,20,21,21,21,22,], 
		["mana cost",1,1,1,1.2,1.5,1.7,2,2.2,2.5,2.7,3,3.2,3.5,3.7,4,4.2,4.5,4.7,5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,], 
]};
/*[13] Dodge			*/ var d222 = {values:[
//				  1			  5				10				15			  20			 25				30			   35			  40			  45			50			   55			  60
//		["chance",9,14,18,21,24,26,27,29,30,31,32,33,34,35,35,36,37,37,37,38,38,39,39,39,39,40,40,40,41,41,41,41,42,42,42,42,42,42,42,42,42,43,43,43,43,43,43,43,44,44,44,44,44,44,44,44,44,44,44,45,], 
		["chance",9,14,18,21,24,27,28,30,31,32,34,35,36,37,37,38,40,40,40,41,42,43,43,43,43,45,45,46,46,46,47,47,48,48,48,49,49,49,49,49,50,51,51,51,51,52,52,52,53,53,54,54,54,54,54,55,55,55,55,56,], 		
]};
/*[14] Avoid			*/ var d232 = {values:[
//				  1			  5				10				15			  20			 25				30			   35			  40			  45			50			   55			  60
//		["chance",8,12,16,19,22,24,25,26,28,29,30,31,32,32,33,34,34,34,35,35,36,36,36,37,37,37,38,38,38,38,38,38,39,39,39,39,39,40,40,40,40,40,40,40,40,40,40,40,41,41,41,41,41,41,41,41,41,41,41,42,], 
		["chance",8,12,16,19,22,25,26,27,29,30,32,33,34,34,35,36,37,37,38,38,40,40,40,41,41,42,43,43,43,43,44,44,45,45,45,46,46,47,47,47,48,48,48,48,48,49,49,49,50,50,51,51,51,51,51,52,52,52,52,53,], ]};
/*[15] Penetrate		*/ var d233 = {values:[
		["attack rating",75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345,360,375,390,405,420,435,450,465,480,495,510,525,540,555,570,585,600,615,630,645,660,675,690,705,720,735,750,765,780,795,810,825,840,855,870,885,900,915,930,945,960,], 
]};
/*[16] Evade			*/ var d242 = {values:[
//				  1			  5				10				15			  20			 25				30			   35			  40			  45			50			   55			  60
//		["chance",6,11,14,17,20,21,23,24,26,26,27,28,29,30,30,31,31,32,32,32,33,33,34,34,34,34,35,35,35,35,35,35,36,36,36,36,36,37,37,37,37,37,37,37,37,37,37,37,38,38,38,38,38,38,38,38,38,38,38,39,], 
		["chance",6,11,14,17,20,22,24,25,27,27,29,30,31,32,32,33,34,35,35,35,37,37,38,38,38,39,40,40,40,40,41,41,42,42,42,43,43,44,44,44,45,45,45,45,45,46,46,46,47,47,48,48,48,48,48,49,49,49,49,49,50,], 
]};
/*[17] Decoy			*/ var d251 = {values:[
		["multishot level",], 
		["bow min",], 
		["bow max",], 
		["damage min",12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,], 
		["damage max",7,13,19,25,31,37,43,49,55,61,67,73,79,85,91,97,103,109,115,121,127,133,139,145,151,157,163,169,175,181,187,193,199,205,211,217,223,229,235,241,247,253,259,265,271,277,283,289,295,301,307,313,319,325,331,337,343,349,355,361,], 
		["resistances",4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,85,], 
		["attack rating",40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,], 
		["life",10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,], 
		["duration",3,3.2,3.4,3.6,3.8,4,4.2,4.4,4.6,4.8,5,5.2,5.4,5.6,5.8,6,6.2,6.4,6.6,6.8,7,7.2,7.4,7.6,7.8,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.8,11,11.2,11.4,11.6,11.8,12,12.2,12.4,12.6,12.8,13,13.2,13.4,13.6,13.8,14,14.2,14.4,14.6,14.8,], 
		["mana cost",19,19,18,18,17,17,16,16,15,15,14,14,13,13,12,12,11,11,10,10,9,9,8,8,7,7,6,6,5,5,4,4,3,3,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
]};
/*[18] Valkyrie			*/ var d261 = {values:[
		["lightning min",1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
		["lightning max",30,45,60,75,90,105,120,135,155,175,195,215,235,255,275,295,319,343,367,391,415,439,467,495,523,551,579,607,642,677,712,747,782,817,852,887,922,957,992,1027,1062,1097,1132,1167,1202,1237,1272,1307,1342,1377,1412,1447,1482,1517,1552,1587,1622,1657,1692,1727,], 
		["damage min",8,13,18,24,28,33,38,43,48,53,58,63,68,73,78,83,88,93,98,103,108,113,118,123,128,133,138,143,148,153,158,163,168,173,178,183,188,193,198,203,208,213,218,223,228,233,238,243,248,253,258,263,268,273,278,283,288,293,298,303,], 
		["damage max",21,27,33,42,45,51,57,63,69,75,81,87,93,99,105,111,117,123,129,135,141,147,153,159,165,171,177,183,189,195,201,207,213,219,225,231,237,243,249,255,261,267,273,279,285,291,297,303,309,315,321,327,333,339,345,351,357,363,369,375,], 
		["life",528,616,704,792,880,968,1056,1144,1232,1320,1408,1496,1584,1672,1760,1848,1936,2024,2112,2200,2288,2376,2464,2552,2640,2728,2816,2904,2992,3080,3168,3256,3344,3432,3520,3608,3696,3784,3872,3960,4048,4136,4224,4312,4400,4488,4576,4664,4752,4840,4928,5016,5104,5192,5280,5368,5456,5544,5632,5720,], 
		["attack rating",40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,], 
		["defense",10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,], 
		["resistances",2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,], 
]};
/*[19] Pierce			*/ var d263 = {values:[
		["chance",24,34,41,48,53,57,60,63,66,68,70,72,74,75,76,78,79,80,80,81,82,83,84,85,85,85,86,86,87,87,88,88,89,89,89,90,90,90,90,90,90,91,91,91,92,92,92,92,93,93,93,93,93,94,94,94,94,94,94,95,], 
]};

/*[20] Cold Arrow		*/ var d311 = {values:[
		["convert",52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,], 
		["cold min",2,5,8,11,14,17,20,23,29,35,41,47,53,59,65,71,79,87,95,103,111,119,135,151,167,183,199,215,245,275,305,335,365,395,425,455,485,515,545,575,605,635,665,695,725,755,785,815,845,875,905,935,965,995,1025,1055,1085,1115,1145,1175,], 
		["cold max",3,7,11,15,19,23,27,31,37,43,49,55,61,67,73,79,88,97,106,115,124,133,151,169,187,205,223,241,277,313,349,385,421,457,493,529,565,601,637,673,709,745,781,817,853,889,925,961,997,1033,1069,1105,1141,1177,1213,1249,1285,1321,1357,1393,], 
		["cold length",4,5.2,6.4,7.6,8.8,10,11.2,12.4,13.6,14.8,16,17.2,18.4,19.6,20.8,22,23.2,24.4,25.6,26.8,28,29.2,30.4,31.6,32.8,34,35.2,36.4,37.6,38.8,40,41.2,42.4,43.6,44.8,46,47.2,48.4,49.6,50.8,52,53.2,54.4,55.6,56.8,58,59.2,60.4,61.6,62.8,64,65.2,66.4,67.6,68.8,70,71.2,72.4,73.6,74.8,], 
		["attack rating bonus",10,19,28,37,46,55,64,73,82,91,100,109,118,127,136,145,154,163,172,181,190,199,208,217,226,235,244,253,262,271,280,289,298,307,316,325,334,343,352,361,370,379,388,397,406,415,424,433,442,451,460,469,478,487,496,505,514,523,532,541,], 
		["mana cost",2.5,2.6,2.7,2.8,3,3.1,3.2,3.3,3.5,3.6,3.7,3.8,4,4.1,4.2,4.3,4.5,4.6,4.7,4.8,5,5.1,5.2,5.3,5.5,5.6,5.7,5.8,6,6.1,6.2,6.3,6.5,6.6,6.7,6.8,7,7.1,7.2,7.3,7.5,7.6,7.7,7.8,8,8.1,8.2,8.3,8.5,8.6,8.7,8.8,9,9.1,9.2,9.3,9.5,9.6,9.7,9.8,], 
]};
/*[21] Magic Arrow		*/ var d312 = {values:[
		["convert",34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,], 
		["damage min",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["damage max",2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,], 
		["attack rating bonus",10,19,28,37,46,55,64,73,82,91,100,109,118,127,136,145,154,163,172,181,190,199,208,217,226,235,244,253,262,271,280,289,298,307,316,325,334,343,352,361,370,379,388,397,406,415,424,433,442,451,460,469,478,487,496,505,514,523,532,541,], 
		["mana cost",1.5,1.3,1.2,1.1,1,0.8,0.7,0.6,0.5,0.3,0.2,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,], 
]};
/*[22] Multiple Shot	*/ var d322 = {values:[
		["damage min",2,4,6,8,10,12,14,16,19,22,25,28,31,34,37,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180,184,188,192,196,200,204,208,212,216,], 
		["damage max",3,6,9,12,15,18,21,24,28,32,36,40,44,48,52,56,61,66,71,76,81,86,91,96,101,106,111,116,121,126,131,136,141,146,151,156,161,166,171,176,181,186,191,196,201,206,211,216,221,226,231,236,241,246,251,256,261,266,271,276,], 
		["arrows",2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,], 
		["mana cost",1.2,1.95,2.7,3.45,4.2,4.95,5.7,6.45,7.2,7.95,8.7,9.45,10.2,10.95,11.7,12.45,13.2,13.95,14.7,15.45,16.2,16.95,17.7,18.45,19.2,19.95,20.7,21.45,22.2,22.95,23.7,24.45,25.2,25.95,26.7,27.45,28.2,28.95,29.7,30.45,31.2,31.95,32.7,33.45,34.2,34.95,35.7,36.45,37.2,37.95,38.7,39.45,40.2,40.95,41.7,42.45,43.2,43.95,44.7,45.45,], 
]};
/*[23] Fire Arrow		*/ var d323 = {values:[
		["convert",52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,], 
		["avg fire min",5,10,16,21,26,31,37,42,50,58,67,75,83,91,99,108,120,132,145,157,169,181,194,206,219,231,243,255,268,280,292,304,317,329,342,354,366,378,391,403,415,427,440,452,465,477,489,501,514,526,538,550,563,575,588,600,612,624,637,649,], 
		["avg fire max",7,12,17,22,28,33,38,43,52,60,68,76,84,93,101,109,121,134,146,158,171,183,195,208,220,232,244,257,269,281,294,306,318,331,343,355,367,380,392,404,417,429,441,454,466,478,490,503,515,527,540,552,564,577,589,601,613,626,638,650,], 
		["attack rating",10,19,28,37,46,55,64,73,82,91,100,109,118,127,136,145,154,163,172,181,190,199,208,217,226,235,244,253,262,271,280,289,298,307,316,325,334,343,352,361,370,379,388,397,406,415,424,433,442,451,460,469,478,487,496,505,514,523,532,541,], 
		["fire min",3,7,11,15,19,23,27,31,37,43,49,55,61,67,73,79,88,97,106,115,124,133,151,169,187,205,223,241,281,321,361,401,441,481,521,561,601,641,681,721,761,801,841,881,921,961,1001,1041,1081,1121,1161,1201,1241,1281,1321,1361,1401,1441,1481,1521,], 
		["fire max",6,10,14,18,22,26,30,34,42,50,58,66,74,82,90,98,110,122,134,146,158,170,192,214,236,258,280,302,346,390,434,478,522,566,610,654,698,742,786,830,874,918,962,1006,1050,1094,1138,1182,1226,1270,1314,1358,1402,1446,1490,1534,1578,1622,1666,1710,], 
		["mana cost",3,3.1,3.2,3.3,3.5,3.6,3.7,3.8,4,4.1,4.2,4.3,4.5,4.6,4.7,4.8,5,5.1,5.2,5.3,5.5,5.6,5.7,5.8,6,6.1,6.2,6.3,6.5,6.6,6.7,6.8,7,7.1,7.2,7.3,7.5,7.6,7.7,7.8,8,8.1,8.2,8.3,8.5,8.6,8.7,8.8,9,9.1,9.2,9.3,9.5,9.6,9.7,9.8,10,10.1,10.2,10.3,], 
]};
/*[24] Ice Arrow		*/ var d341 = {values:[
		["cold min",6,12,18,24,30,36,42,48,60,72,84,96,108,120,132,144,162,180,198,216,234,252,277,304,330,355,382,407,444,480,515,552,587,624,660,695,732,767,804,840,875,912,947,984,1020,1055,1092,1127,1164,1200,1235,1272,1307,1344,1380,1415,1452,1487,1524,1560,], 
		["cold max",10,18,26,34,42,50,58,66,84,102,120,138,156,174,192,210,234,258,282,306,330,354,385,417,450,482,514,545,590,634,677,722,765,810,854,897,942,985,1030,1074,1117,1162,1205,1250,1294,1337,1382,1425,1470,1514,1557,1602,1645,1690,1734,1777,1822,1865,1910,1954,], 
		["freeze length",2,2.2,2.4,2.6,2.8,3,3.2,3.4,3.6,3.8,4,4.2,4.4,4.6,4.8,5,5.2,5.4,5.6,5.8,6,6.2,6.4,6.6,6.8,7,7.2,7.4,7.6,7.8,8,8.2,8.4,8.6,8.8,9,9.2,9.4,9.6,9.8,10,10.2,10.4,10.6,10.8,11,11.2,11.4,11.6,11.8,12,12.2,12.4,12.6,12.8,13,13.2,13.4,13.6,13.8,], 
		["attack rating bonus",20,29,38,47,56,65,74,83,92,101,110,119,128,137,146,155,164,173,182,191,200,209,218,227,236,245,254,263,272,281,290,299,308,317,326,335,344,353,362,371,380,389,398,407,416,425,434,443,452,461,470,479,488,497,506,515,524,533,542,551,], 
		["mana cost",2.7,3,3.2,3.5,3.7,4,4.2,4.5,4.7,5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.2,], 
]};
/*[25] Guided Arrow		*/ var d342 = {values:[
		["damage",10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,], 
		["mana cost",8,7.7,7.5,7.2,7,6.7,6.5,6.2,6,5.7,5.5,5.2,5,4.7,4.5,4.2,4,3.7,3.5,3.2,3,2.7,2.5,2.2,2,1.7,1.5,1.2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,], 
]};
/*[26] Exploding Arrow	*/ var d343 = {values:[
		["fire min",9,16,23,30,36,44,51,58,73,88,103,118,133,148,163,178,198,218,238,258,278,298,322,346,370,394,418,442,472,508,541,574,607,640,673,706,739,772,805,838,871,904,937,970,1003,1036,1069,1102,1135,1168,1201,1234,1267,1300,1333,1366,1399,1432,1465,1498,], 
		["fire max",14,23,31,41,50,59,68,76,94,111,128,145,161,179,196,213,235,256,279,301,323,345,372,399,426,453,480,507,542,577,612,647,682,717,752,787,822,857,892,927,962,997,1032,1067,1102,1137,1172,1207,1242,1277,1312,1347,1382,1417,1452,1487,1522,1557,1592,1627,], 
		["attack rating bonus",20,29,38,47,56,65,74,83,92,101,110,119,128,137,146,155,164,173,182,191,200,209,218,227,236,245,254,263,272,281,290,299,308,317,326,335,344,353,362,371,380,389,398,407,416,425,434,443,452,461,470,479,488,497,506,515,524,533,542,551,], 
		["mana cost",5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,], 
]};
/*[27] Strafe			*/ var d352 = {values:[
		["damage_min",3,5,7,9,11,13,15,17,20,23,26,29,32,35,38,41,45,49,53,57,61,65,71,77,83,89,95,101,108,115,122,129,136,143,150,157,164,171,178,185,192,199,206,213,220,227,234,241,248,255,262,269,276,283,290,297,304,311,318,325,], 
		["damage_max",4,7,10,13,16,19,22,25,28,33,37,41,45,49,53,57,62,67,72,77,82,87,93,99,105,111,117,123,130,137,144,151,158,165,172,179,186,193,200,207,214,221,228,235,242,249,256,263,270,277,284,291,298,305,312,319,326,333,340,347,], 
		["targets",5,6,7,8,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,], 
		["damage bonus",5,11,17,23,29,35,41,47,53,59,65,71,77,83,89,95,101,107,113,119,125,131,137,143,149,155,161,167,173,179,185,191,197,203,209,215,221,227,233,239,245,251,257,263,269,275,281,287,293,299,305,311,317,323,329,335,341,347,353,359,], 
		["mana cost",11,10.9,10.8,10.8,10.7,10.6,10.6,10.5,10.5,10.4,10.3,10.3,10.2,10.1,10.1,10,10,9.9,9.8,9.8,9.7,9.6,9.6,9.5,9.5,9.4,9.3,9.3,9.2,9.2,9.1,9,9,8.9,8.9,8.8,8.7,8.7,8.6,8.5,8.4,8.4,8.3,8.3,8.2,8.1,8.1,8,8,7.9,7.8,7.8,7.7,7.6,7.5,7.5,7.5,7.4,7.3,7.3,], 
		["strafe ias",], 
]};
/*[28] Immolation Arrow	*/ var d353 = {values:[
		["explosion min",16,37,60,82,103,125,148,170,198,228,257,285,315,343,372,402,440,477,516,554,592,630,676,722,768,814,860,906,958,1010,1062,1114,1166,1218,1270,1322,1374,1426,1478,1530,1582,1634,1686,1738,1790,1842,1894,1946,1998,2050,2102,2154,2206,2258,2310,2362,2414,2466,2518,2570,], 
		["explosion max",27,49,70,92,115,137,158,181,210,238,268,297,325,355,383,412,450,489,527,565,603,641,687,733,779,825,871,917,969,1021,1073,1125,1177,1229,1281,1333,1385,1437,1489,1541,1593,1645,1697,1749,1801,1853,1905,1957,2009,2061,2113,2165,2217,2269,2321,2373,2425,2477,2529,2581,], 
		["avg fire min",18,44,69,96,121,147,172,198,232,266,301,334,368,403,436,471,515,559,604,649,693,738,792,846,900,953,1007,1061,1122,1183,1244,1305,1366,1427,1488,1549,1609,1670,1731,1792,1853,1914,1975,2036,2097,2158,2219,2280,2341,2402,2463,2524,2585,2646,2707,2768,2829,2890,2950,3011,], 
		["avg fire max",31,56,83,108,134,159,185,210,245,279,313,347,381,415,449,484,528,572,617,662,706,751,805,858,912,966,1020,1074,1135,1196,1257,1318,1379,1440,1501,1562,1622,1683,1744,1805,1866,1927,1988,2049,2110,2171,2232,2293,2354,2415,2476,2537,2598,2658,2719,2780,2841,2902,2963,3024,], 
		["attack rating bonus",30,39,48,57,66,75,84,93,102,111,120,129,138,147,156,165,174,183,192,201,210,219,228,237,246,255,264,273,282,291,300,309,318,327,336,345,354,363,372,381,390,399,408,417,426,435,444,453,462,471,480,489,498,507,516,525,534,543,552,561,], 
		["mana cost",8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,], 
]};
/*[29] Freezing Arrow	*/ var d361 = {values:[
		["radius",], 
		["cold min",40,55,70,85,100,115,130,144,165,185,205,225,244,265,285,305,330,352,376,401,424,448,475,501,526,553,578,605,635,665,695,725,755,785,815,845,875,905,935,965,995,1025,1055,1085,1115,1145,1175,1205,1235,1265,1295,1325,1355,1385,1415,1445,1475,1505,1535,1565,], 
		["cold max",50,65,80,95,110,125,140,155,175,195,215,235,255,275,295,315,340,362,387,411,435,459,484,511,536,563,588,615,645,675,705,735,765,795,825,855,885,915,945,975,1005,1035,1065,1095,1125,1155,1185,1215,1245,1275,1305,1335,1365,1395,1425,1455,1485,1515,1545,1575,], 
		["freeze length",], 
		["attack rating bonus",40,49,58,67,76,85,94,103,112,121,130,139,148,157,166,175,184,193,202,211,220,229,238,247,256,265,274,283,292,301,310,319,328,337,346,355,364,373,382,391,400,409,418,427,436,445,454,463,472,481,490,499,508,517,526,535,544,553,562,571,], 
		["mana cost",4.5,4.7,5,5.2,5.5,5.7,6,6.2,6.5,6.7,7,7.2,7.5,7.7,8,8.2,8.5,8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.5,17.7,18,18.2,18.5,18.7,19,19.2,], 
]};

var skills_amazon = [
{data:d111, key:"111", code:6, name:"Jab", i:0, req:[], reqlvl:1, reqWeapon:["spear","javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Attacks with a series of rapid thrusts<br>using a javelin or spear class weapon<br><br>Deals 100% of Weapon Damage<br>Attacks three times", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Attack Rating: +"," percent<br>Damage: +"," percent<br>Mana Cost: ",""]},
{data:d122, key:"122", code:7, name:"Power Strike", i:1, req:[0], reqlvl:6, reqWeapon:["spear","javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Adds lightning damage to attacks with<br>javelin and spear class weapons<br><br>Deals 100% of Weapon Damage", syn_title:"<br>Power Strike Receives Bonuses From:<br>", syn_text:"Charged Strike: +20% Lightning Damage per Level<br>Lightning Strike: +20% Lightning Damage per Level", graytext:"", index:[0,""], text:["To Attack Rating: +"," percent<br>Lightning Damage: ","-","<br>Mana Cost: ",""]},
{data:d123, key:"123", code:8, name:"Poison Javelin", i:2, req:[], reqlvl:6, reqWeapon:["javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically enhances your javelin<br>to leave a trail of poison clouds", syn_title:"<br>Poison Javelin Receives Bonuses From:<br>", syn_text:"Plague Javelin: +15% Poison Damage per Level<br>Plague Javelin: -1% Enemy Poison Resistance per Level<br>2% Increased Poison Damage per Dexterity<br>+2 Additional Javelins While Having 100+ Total Dexterity", graytext:"", index:[0,""], text:["Poison Damage: ","-","<br>over 5 seconds<br>Mana Cost: ","<br>Lowers Resistance of poisoned targets by ","%<br>Cooldown: 0.48 seconds"], notupdated:0},
{data:d131, key:"131", code:9, name:"Fend", i:3, req:[0], reqlvl:12, reqWeapon:["spear","javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Attacks all adjacent targets<br><br>Deals 125% of Weapon Damage<br>Attacks up to twelve times", syn_title:"<br>Fend Receives Bonuses From:<br>", syn_text:"Jab: Attack Speed per level", graytext:"", index:[0,""], text:["Attack Rating: +"," percent<br>Damage: +"," percent<br>Mana Cost: 5",""], notupdated:0},
{data:d133, key:"133", code:10, name:"Lightning Bolt", i:4, req:[1,2,0], reqlvl:12, reqWeapon:["javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically converts your javelin into 3 bolts of lightning<br><br>Deals 100% of Weapon Damage<br>100% of Physical Damage converted to Lightning", syn_title:"<br>Lightning Bolt Receives Bonuses From:<br>", syn_text:"Lightning Fury: +12% Lightning Damage per Level<br>Power Strike: +12% Lightning Damage per Level", graytext:"", index:[0,""], text:["Lightning Damage: ","-","<br>Mana Cost: ",""], notupdated:0},
{data:d142, key:"142", code:11, name:"Charged Strike", i:5, req:[1,0], reqlvl:18, reqWeapon:["spear","javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Adds lightning damage to javelin and spear class weapons<br>and releases charged bolts upon impact", syn_title:"<br>Charged Strike Receives Bonuses From:<br>", syn_text:"Power Strike: +20% Lightning Damage per Level<br>Lightning Strike: +20% Lightning Damage per Level", graytext:"", index:[0,""], text:["Releases "," charged bolts<br>Lightning Damage: ","-","<br>Mana Cost: ",""]},
{data:d143, key:"143", code:12, name:"Plague Javelin", i:6, req:[4,1,0], reqlvl:18, reqWeapon:["javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically enhances your javelin to release<br>expanding clouds of poison upon impact", syn_title:"<br>Plague Javelin Receives Bonuses From:<br>", syn_text:"Poison Javelin: +22% Poison Damage per Level", graytext:"", index:[0,""], text:["Attack Rating: +"," percent<br>Poison Damage: ","-","<br>over 5 seconds<br>Mana Cost: ",""]},
{data:d151, key:"151", code:13, name:"Molten Strike", i:7, req:[3,0], reqlvl:24, reqWeapon:["spear","javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"A strike that creates balls of molten magma<br>which launch forth from the enemies you hit<br><br>Deals 85% of Weapon Damage", syn_title:"<br>Molten Strike Receives Bonuses From:<br>", syn_text:"Jab: +13% Fire Damage per Level", graytext:"", index:[0,""], text:["Attack Rating: +"," percent<br>Fire Damage: ","-","<br>Mana Cost: 7"], notupdated:0, damagewrong:0},
{data:d162, key:"162", code:14, name:"Lightning Strike", i:8, req:[5,1,0], reqlvl:30, reqWeapon:["spear","javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Adds lightning damage to javelin and spear class weapons<br>and releases chain lightning upon impact", syn_title:"<br>Lightning Strike Receives Bonuses From:<br>", syn_text:"Power Strike: +15% Lightning Damage per Level<br>Charged Strike: +15% Lightning Damage per Level", graytext:"", index:[0,""], text:[""," hits<br>Lightning Damage: ","-","<br>Mana Cost: 9",""]},
{data:d163, key:"163", code:15, name:"Lightning Fury", i:9, req:[6,4,1,0], reqlvl:30, reqWeapon:["javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Changes a thrown javelin into a powerful<br>bolt of lightning that splits on impact", syn_title:"<br>Lightning Fury Receives Bonuses From:<br>", syn_text:"Lightning Bolt: +2% Lightning Damage per Level<br>Power Strike: 2% Lightning Damage per Level", graytext:"", index:[0,""], text:["Releases "," bolts<br>Lightning Damage: ","-","<br>Mana Cost: ",""], notupdated:0},

{data:d211, key:"211", code:16, name:"Inner Sight", i:10, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:3, bindable:0, description:"Passive Aura - Illuminates nearby enemies<br>making them easier to hit<br>for you and your party", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Enemy Defense: ","<br>Radius: "," yards",""]},
{data:d213, key:"213", code:17, name:"Lethal Strike", i:11, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Your attacks have a chance to do double damage", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent critical strike chance",""]},
{data:d221, key:"221", code:18, name:"Phase Run", i:12, req:[10], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:5, bindable:2, description:"Transcend to a heightened state, granting<br>faster movement and recovery speed<br><br>Faster Hit Recovery: +30 percent<br>Walk/Run Speed: +30 percent", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Duration: "," seconds<br>"," percent chance to Reset Duration on Kill<br>Mana Cost: ",""], notupdated:0},
{data:d222, key:"222", code:19, name:"Dodge", i:13, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - You have a chance to dodge<br>a melee attack when attacking<br>or standing still", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent chance",""], notupdated:0},
{data:d232, key:"232", code:20, name:"Avoid", i:14, req:[], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - You have a chance to dodge enemy missiles<br>when attacking or standing still", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent chance",""], notupdated:0},
{data:d233, key:"233", code:21, name:"Penetrate", i:15, req:[11], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Increases your attack rating", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["To Attack Rating: +"," percent",""]},
{data:d242, key:"242", code:22, name:"Evade", i:16, req:[], reqlvl:18, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - You have a chance to dodge<br>a melee or missile attack<br>when walking or running", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent chance",""], notupdated:0},
{data:d251, key:"251", code:23, name:"Decoy", i:17, req:[12,10], reqlvl:24, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Creates a stationary duplicate of yourself that<br>draws fire from enemies and shoots arrows", syn_title:"<br>Decoy Receives Bonuses From:<br>", syn_text:"Pierce<br>Penetrate<br>Lethal Strike<br>Multiple Shot", graytext:"", index:[3,""], text:["Decoy has 100% of your Bows Physical Damage<br>Decoy has 50% of your Maximum Life<br>Uses Multiple Shot Skill Level: ","<br>Damage: ","-","Damage: ","-","<br>Elemental Resistances: +","%<br>Attack Rating: +","%<br>Life: +"," percent<br>Duration: "," seconds<br>Mana Cost: ",""]},
{data:d261, key:"261", code:24, name:"Valkyrie", i:18, req:[17,12,10], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Summons a powerful Valkyrie ally<br><br>Mana Cost: 30", syn_title:"<br>Valkyrie Receives Bonuses From:<br>", syn_text:"Jab: +18% Damage Per Level<br>Fend: +18% Damage Per Level<br>Lightning Strike: +20% Lightning Damage Per Level<br>Power Strike: +20% Lightning Damage Per Level<br>Phase Run<br>Penetrate<br>Lethal Strike<br>Dodge<br>Avoid<br>Evade", graytext:"", index:[0,""], text:["Lightning Damage: ","-","<br>Damage: ","-","<br>Life: ","<br>Attack Rating: +"," percent<br>Defense Bonus: +"," percent<br>Elemental Resistances: +"," percent"]},
{data:d263, key:"263", code:25, name:"Pierce", i:19, req:[15,11], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Your missiles have a chance to<br>pass through enemies that they hit", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent pierce chance",""]},

{data:d311, key:"311", code:26, name:"Cold Arrow", i:20, req:[], reqlvl:1, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically enhances your arrows or bolts<br>by adding cold damage and a slowing effect", syn_title:"<br>Cold Arrow Receives Bonuses From:<br>", syn_text:"Ice Arrow: +12% Cold Damage per Level<br>+2 Additional Arrows while having 100+ Total Dexterity", graytext:"", index:[1,"% Physical Damage to Elemental Damage<br>Deals 100% of Weapon Damage"], text:["Converts ","Cold Damage: ","-","<br>Cold Length: "," seconds<br>Attack Rating: +"," percent<br>Mana Cost: ",""]},
{data:d312, key:"312", code:27, name:"Magic Arrow", i:21, req:[], reqlvl:1, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Creates a magical arrow or bolt<br>that does extra damage<br><br>Always Pierces", syn_title:"<br>Magic Arrow Receives Bonuses From:<br>", syn_text:"+2 Additional Arrows while having 100+ Total Dexterity", graytext:"", index:[1,"% Physical Damage to Magic Damage<br>Deals 100% of Weapon Damage"], text:["Converts ","Damage: ","-","<br>Attack Rating: +"," percent<br>Mana Cost: ",""]},
{data:d322, key:"322", code:28, name:"Multiple Shot", i:22, req:[21], reqlvl:6, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically splits one arrow<br>or bolt into many<br><br>Deals 87% of Weapon Damage", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: ","-","<br>"," arrows<br>Mana Cost: ",""], notupdated:0, damagewrong:1},
{data:d323, key:"323", code:29, name:"Fire Arrow", i:23, req:[21], reqlvl:6, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically enhances your arrows or bolts<br>with fire, which leaves a burning trail behind it", syn_title:"<br>Fire Arrow Receives Bonuses From:<br>", syn_text:"Exploding Arrow: +12% Fire Damage per Level<br>Exploding Arrow: +12% Average Fire Damage per Second per Level", graytext:"", index:[1,"% Physical Damage to Elemental Damage<br>Deals 100% of Weapon Damage"], text:["Converts ","Average Fire Damage: ","-"," per second<br>To Attack Rating: +"," percent<br>Fire Damage: ","-","<br>Mana Cost: ",""]},
{data:d341, key:"341", code:30, name:"Ice Arrow", i:24, req:[20], reqlvl:18, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically enhances your arrow or bolt<br>to freeze your enemies<br>Leaves a trail of ice which deals damage over time", syn_title:"<br>Ice Arrow Receives Bonuses From:<br>", syn_text:"Cold Arrow: +10% Cold Damage per Level<br>Cold Arrow: +20% Cold damage over time per level<br>Freezing Arrow: +5% Freeze Length per Level<br>Freezing Arrow: +10% Cold damage over time per level<br>+2 Additional Arrows while having 100+ Total Dexterity", graytext:"", index:[0,""], text:["Cold Damage: ","-","<br>Freezes for "," seconds<br>Attack Rating: +"," percent<br>Mana Cost: ",""], incomplete:1},
{data:d342, key:"342", code:31, name:"Guided Arrow", i:25, req:[20,22,21], reqlvl:18, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Enhances your arrows and bolts<br>to track your target<br>or seek one of their own<br>Can shoot a random amount of additional<br>arrows in a random direction with levels<br><br>Always Hits<br><br>Deals 150% of Weapon Damage", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Mana Cost: ",""], notupdated:0},
{data:d343, key:"343", code:32, name:"Exploding Arrow", i:26, req:[23,21], reqlvl:18, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Enchants an arrow or bolt to explode on<br>contact, damaging all nearby enemies", syn_title:"<br>Exploding Arrow Receives Bonuses From:<br>", syn_text:"Fire Arrow: +20% Fire Damage per Level<br>Magic Arrow: +20% Fire Damage per Level", graytext:"", index:[0,""], text:["Fire Damage: ","-","<br>Attack Rating: +"," percent<br>Mana Cost: ",""]},
{data:d352, key:"352", code:33, name:"Strafe", i:27, req:[25,20,22,21], reqlvl:24, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically splits one arrow into several<br>that target multiple nearby enemies<br><br>Deals 100% of Weapon Damage<br>Gains 1% attack speed per level", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: ","-","<br>Attacks up to "," targets<br>Damage: +"," percent<br>Mana Cost: ","<br>Strafe IAS bonus: ",""], notupdated:0},
//{data:d352, key:"352", code:33, name:"Strafe", i:27, req:[25,20,22,21], reqlvl:24, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically splits one arrow into several<br>that target multiple nearby enemies<br><br>Deals 100% of Weapon Damage<br>Gains attack speed per level", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: ","-","<br>Attacks up to "," targets<br>Damage: +"," percent<br>Mana Cost: ",""], notupdated:0},
{data:d353, key:"353", code:34, name:"Immolation Arrow", i:28, req:[26,23,21], reqlvl:24, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Enhances arrows or bolts to<br>cause severe fire damage and<br>creates a pyre upon impact", syn_title:"<br>Immolation Arrow Receives Bonuses From:<br>", syn_text:"Fire Arrow: +16% Average Fire Damage per Second per Level<br>Exploding Arrow: +15% Fire Damage per Level", graytext:"", index:[0,""], text:["Fire Explosion Damage: ","-","<br>Fire Duration: 4 seconds<br>Average Fire Damage: ","-"," per second<br>Attack Rating: +"," percent<br>Mana Cost: ",""]},
{data:d361, key:"361", code:35, name:"Freezing Arrow", i:29, req:[24,20], reqlvl:30, reqWeapon:["bow","crossbow"], level:0, extra_levels:0, force_levels:0, bindable:2, description:"Magically enhances an arrow or bolt<br>to freeze entire groups of monsters", syn_title:"<br>Freezing Arrow Receives Bonuses From:<br>", syn_text:"Cold Arrow: +21% Cold Damage per Level<br>Ice Arrow: +4% Cold Damage per Level<br>Ice Arrow: +4% Freeze Length per Level", graytext:"", index:[1," yards"], text:["Radius: ","Cold Damage: ","-","<br>Freezes for "," seconds<br>Attack Rating: +"," percent<br>Mana Cost: ",""]}
];