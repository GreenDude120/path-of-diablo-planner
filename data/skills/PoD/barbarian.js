
var character_barbarian = {class_name:"Barbarian", strength:30, dexterity:20, vitality:25, energy:10, life:55, mana:10, stamina:192, levelup_life:2, levelup_stamina:1, levelup_mana:1, ar_per_dexterity:5, life_per_vitality:4, stamina_per_vitality:1, mana_per_energy:1, starting_strength:30, starting_dexterity:20, starting_vitality:25, starting_energy:10, ar_const:20, block_const:4, skill_layout:"./images/skill_trees/PoD/barbarian.png", mana_regen:1.66,
	weapon_frames:{dagger:15, sword:[15,17], axe:[15,18], mace:[15,18], thrown:[15,15], staff:18, polearm:18, scepter:15, wand:15, javelin:15, spear:18, bow:14, crossbow:19},
	// Skills that may adjust IAS breakpoints: Frenzy, Whirlwind, Concentrate, Bash, Stun, Cleave
	fcr_frames:13, fcr_bp:[0, 9, 20, 37, 63, 105, 200],
	fhr_frames:9, fhr_bp:[0, 7, 15, 27, 48, 86, 200],
	fbr_frames:7, fbr_bp:[0, 9, 20, 42, 86, 280],
	
	// getSkillData - gets skill info from the skills data table
	//	skill: skill object for the skill in question
	//	lvl: level of the skill
	//	elem: which element of the skill to return
	// result: value of the skill element at the specified level
	// ---------------------------------
	 //synergies here 
	getSkillData : function(skill, lvl, elem) {
		var result = skill.data.values[elem][lvl];
		
		if (skill.name == "War Cry" && elem < 2) { 			result *= ((1 + (0.18*skills[2].level + 0.18*skills[5].level)) * (1+character.physicalDamage/100)) }
		//if (skill.name == "War Cry" && elem == 2) { 		result = Math.floor((1+result/100)*8) }	// TOCHECK: replace 8 with actual radius (show total radius instead of radius bonus?)
		if (skill.name == "Battle Command" && elem == 0) { 	result = 1+Math.floor(skill.level/10) }
		if (skill.name == "Double Swing" && elem == 0) { 	result += (5*skills[28].level) }
		if (skill.name == "Frenzy" && elem == 0) { 			result = ((0 + (1.00*skills[28].level) * (1+character.mDamage/100))) }
		if (skill.name == "Frenzy" && elem == 1) { 			result += (10*skills[21].level) }
		if (skill.name == "Frenzy" && elem == 1) { 			result += (4*skills[14].level) }
		if (skill.name == "Frenzy" && elem == 3) { 			result = (7.5 + .1*skills[14].level) }
//		if (skill.name == "Frenzy" && elem == 1) { 			result *= (1 + (0.10*skills[28].level)) }
		if (skill.name == "Frenzy" && elem == 1) { 			result *= (1 + (0.01*skills[28].level)) }
		
		if (skill.name == "Concentrate" && elem == 2) { 	result += (5*skills[28].level + 10*skills[2].level + 10*skills[6].level) }
		if (skill.name == "Cleave" && elem < 2) { 			result *= (1 + (0.15*skills[26].level)) * (1+character.physicalDamage/100) }
		//if (skill.name == "Pulverize" && elem < 2) { 			result *= (1 + (0.15*skills[31].level)) }
		if (skill.name == "Stun" && elem < 2) { 			result *= ((1 + (0.10*skills[28].level + 0.10*skills[0].level)) * (1+character.mDamage/100)) }
		if (skill.name == "Stun" && elem == 2) { 			result += (5*skills[23].level) }
		if (skill.name == "Bash" && elem == 2) { 			result += (5*skills[23].level) }
		if (skill.name == "Bash" && elem == 3) { 			result += (10*skills[25].level) }
// Build double throw
//		if (skill.name == "Double Throw" && equipped.weapon.name != "none" && elem < 2) {
//			phys_min = (character.base_damage_min * (1+character.e_damage/100) + character.damage_min + character.level*character.min_damage_per_level);
//			phys_max = (character.base_damage_max * (1+character.e_damage/100) + character.damage_max + character.level*character.max_damage_per_level);
//		}
//		if (skill.name == "Double Throw" && elem == 0) {		result = phys_min * (1 + (0.08*skills[22].level)) }
//		if (skill.name == "Double Throw" && elem == 1) {		result = phys_max * (1 + (0.08*skills[22].level)) }
		if (skill.name == "Double Throw" && elem < 2 ) { 	result *= (1 + (0.08*skills[29].level)) }

//		if (skill.name == "Leap Attack" && elem == 0) { 	result += (20*skills[22].level) }
		if (skill.name == "Leap Slam" && elem == 0) { 	result += (20*skills[22].level) }
		if (skill.name == "Ethereal Throw" && elem < 2) { 	result *= ((1 + (0.04*skills[27].level + 0.04*skills[28].level)) * (1+character.mDamage/100)) }
//		if (skill.name == "Whirling Axes" && elem < 2) { 	result *= ((1 + (0.14*skills[8].level + 0.14*skills[21].level + 0.01*Math.floor(character.dexterity + character.all_attributes)))) }
		if (skill.name == "Whirling Axes" && elem < 2) { 	result *= ((1 + 0.14*skills[5].level + 0.14*skills[21].level + 0.01*((character.dexterity + character.all_attributes)))) }
//		if (skill.name == "Flame Dash" && elem < 3 && elem > 0) { result *= ((1 + 0.10*skills[1].level + 0.01*((character.energy + character.all_attributes)*(1+character.max_energy/100))) * (1+character.fDamage/100)) }
//		if (skill.name == "Discharge" && elem < 3 && elem > 0) { result *= ((1 + 0.03*sk[12].level + 0.03*sk[14].level + 0.01*Math.floor(((character.energy + character.all_attributes)*(1+character.max_energy/100))/2)) * (1+c.lDamage/100)) }
	return result
	},
	
	// getBuffData - gets a list of stats corresponding to a persisting buff
	//	effect: array element object for the buff
	// result: indexed array including stats affected and their values
	// ---------------------------------
	getBuffData : function(skill) {
		var lvl = skill.level + skill.extra_levels;
		var result = {};
		
		if (skill.name == "Battle Command") { result.all_skills = 1+Math.floor(skill.level/10); result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Shout") { result.defense_bonus = skill.data.values[0][lvl]; result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Battle Orders") { result.max_stamina = skill.data.values[1][lvl]; result.max_life = skill.data.values[2][lvl]; result.max_mana = skill.data.values[3][lvl]; result.duration = skill.data.values[0][lvl]; }
		if (skill.name == "Frenzy") { result.ias_skill = skill.data.values[4][lvl]; result.frw_skillup = skill.data.values[6][lvl]; result.duration = 7.5 + skill.data.values[2] ; }
// Build double throw
		if (skill.name == "Double Throw") { result.thrown_ar = skill.data.values[2][lvl]; }
//		if (skill.name == "Power Throw") { result.damage_bonus = skill.data.values[0][lvl]; result.duration = 2.2; }
		if (skill.name == "Edged Weapon Mastery") { result.edged_damage = skill.data.values[0][lvl]; result.edged_ar = skill.data.values[1][lvl]; result.edged_cstrike = skill.data.values[2][lvl]; }
		if (skill.name == "Pole Weapon Mastery") { result.pole_damage = skill.data.values[0][lvl]; result.pole_ar = skill.data.values[1][lvl]; result.pole_cstrike = skill.data.values[2][lvl]; }
		if (skill.name == "Blunt Weapon Mastery") { result.blunt_damage = skill.data.values[0][lvl]; result.blunt_ar = skill.data.values[1][lvl]; result.blunt_cstrike = skill.data.values[2][lvl]; }
		if (skill.name == "Thrown Weapon Mastery") { result.thrown_damage = skill.data.values[0][lvl]; result.thrown_ar = skill.data.values[1][lvl]; result.thrown_pierce = skill.data.values[2][lvl]; result.thrown_cstrike = skill.data.values[3][lvl]; }
		if (skill.name == "Increased Stamina") { result.stamina_skillup = skill.data.values[0][lvl]; }
		if (skill.name == "Iron Skin") { result.defense_skillup = skill.data.values[0][lvl]; }
		if (skill.name == "Increased Speed") { result.frw_skillup = skill.data.values[0][lvl]; }
		if (skill.name == "Natural Resistance") { result.resistance_skillup = skill.data.values[0][lvl]; }
		if (skill.name == "Counter Attack") { result.counterattack = skill.data.values[0][lvl]; }
		if (skill.name == "Puncture") { result.owounds = skill.data.values[0][lvl]; }
		//if (skill.name == "Pulverize") { result.Pulverize = skill.data.values[2][lvl]; }
		// Debuffs:
		if (skill.name == "Howl") { result.flee_distance = skill.data.values[0][lvl]; result.duration = skill.data.values[1][lvl]; }
		if (skill.name == "Taunt") { result.enemy_damage = skill.data.values[0][lvl]; result.enemy_attack = skill.data.values[1][lvl]; }	// duration unlisted
		if (skill.name == "Battle Cry") { result.duration = skill.data.values[0][lvl]; result.enemy_defense = skill.data.values[1][lvl]; result.enemy_damage = skill.data.values[2][lvl]; }
		if (skill.name == "Grim Ward") { result.duration = skill.data.values[0][lvl]; result.radius = skill.data.values[1][lvl]; result.enemy_physRes = skill.data.values[2][lvl]; }
		if (skill.name == "Whirling Axes") { result.whirlychance = skill.data.values[2][lvl]; }
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
		if (typeof(skill.damaging) != 'undefined') { attack = skill.damaging.attack; spell = skill.damaging.spell; }
		var e_damage_offhand = 0; if (offhandType == "weapon") { e_damage_offhand = (~~(equipped["offhand"].e_damage) + ~~(socketed["offhand"].totals.e_damage) + ~~(corruptsEquipped["offhand"].e_damage)); };
		var damage_enhanced = character.damage_bonus + character.e_damage - e_damage_offhand;

		if (skill.name == "War Cry") {				damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Double Swing") { 	damage_bonus = character.getSkillData(skill,lvl,0); ar_bonus = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Frenzy") { 			weapon_damage = 100; mDamage_min = phys_min*character.getSkillData(skill,lvl,0)/100; mDamage_max = phys_max*character.getSkillData(skill,lvl,0)/100; damage_bonus = character.getSkillData(skill,lvl,1); ar_bonus = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Concentrate") {		weapon_damage = 160; ar_bonus = character.getSkillData(skill,lvl,1); damage_bonus = character.getSkillData(skill,lvl,2); }
		else if (skill.name == "Cleave") { 			weapon_damage = 60; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Pulveroze") { 		weapon_damage = 60; damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Pulverize") { 		damage_min = character.getSkillData(skill,lvl,1); damage_max = character.getSkillData(skill,lvl,2); ar_bonus = character.getSkillData(skill,lvl,0); }
		else if (skill.name == "Stun") { 			mDamage_min = character.getSkillData(skill,lvl,0); mDamage_max = character.getSkillData(skill,lvl,1); ar_bonus = character.getSkillData(skill,lvl,2); }
//	Build double throw
		else if (skill.name == "Double Throw") {	weapon_damage = 100; damage_bonus = character.getSkillData(skill,lvl,0); ar_bonus = character.getSkillData(skill,lvl,1);   }	
//		else if (skill.name == "Power Throw") {		weapon_damage = 120; ar_bonus = character.getSkillData(skill,lvl,1); damage_min = character.getSkillData(skill,lvl,2); damage_max = character.getSkillData(skill,lvl,3); }	
		else if (skill.name == "Bash") { 			weapon_damage = 100-(100/100*character.getSkillData(skill,lvl,0)); ar_bonus = character.getSkillData(skill,lvl,2); damage_bonus = character.getSkillData(skill,lvl,3); mDamage_min = phys_min*((110/100*character.getSkillData(skill,lvl,0))/100)*(phys_mult+damage_bonus/100) * (1+character.mDamage/100); mDamage_max = phys_max*((110/100*character.getSkillData(skill,lvl,0))/100)*(phys_mult+damage_bonus/100) * (1+character.mDamage/100); }
//		else if (skill.name == "Leap Attack") {		weapon_damage = 175; ar_bonus = character.getSkillData(skill,lvl,1); damage_bonus = character.getSkillData(skill,lvl,0); }
//		else if (skill.name == "Leap Slam") {		weapon_damage = 175; ar_bonus = character.getSkillData(skill,lvl,1); damage_bonus = character.getSkillData(skill,lvl,0); }
		else if (skill.name == "Ethereal Throw") { 	weapon_damage = 60; mDamage_min = character.getSkillData(skill,lvl,0); mDamage_max = character.getSkillData(skill,lvl,1); }
		else if (skill.name == "Whirlwind") {		ar_bonus = character.getSkillData(skill,lvl,1); damage_bonus = character.getSkillData(skill,lvl,0); }
//		else if (skill.name == "Leap") {			weapon_damage = character.getSkillData(skill,lvl,0); }
		else if (skill.name == "Leap Slam") {		weapon_damage = character.getSkillData(skill,lvl,0); }
		else if (skill.name == "Whirling Axes") {	damage_min = character.getSkillData(skill,lvl,0); damage_max = character.getSkillData(skill,lvl,1); }
		
		if (typeof(skill.reqWeapon) != 'undefined') { var match = 0; for (let w = 0; w < skill.reqWeapon.length; w++) {
			if (equipped.weapon.type == skill.reqWeapon[w]) {
				if (skill.name == "Frenzy" || skill.name == "Double Swing" || skill.name == "Double Throw") { for (let x = 0; x < skill.reqWeapon.length; x++) {
					if (equipped.offhand.type == skill.reqWeapon[x]) { match = 1 }
				} }
				else { match = 1 }
			}
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
		if (skill.i = 8){
			addmore = "no"
		}		
		if (attack == 0){
			addmore = "no"
		}		
		if (attack != 0){
			addmore = "yes"
		}

//		else{
//		addmore = "yes"
//		}

		var result = {min:skillMin,max:skillMax,ar:skillAr};
		return result
		return skill2Breakdown; 
	},
	
	// setSkillAmounts - helps update class-related skill levels, called by calculateSkillAmounts()
	//	s: index of skill
	// ---------------------------------
	setSkillAmounts : function(s) {
		skills[s].extra_levels += character.skills_barbarian
		if (s < 10) {
			skills[s].extra_levels += character.skills_warcries
			skills[s].extra_levels += character.skills_tree1
//		} else if (s > 17 && s < 29) {
		} else if (s > 20) {
			skills[s].extra_levels += character.skills_combat_barbarian
			skills[s].extra_levels += character.skills_tree3
		} else {
			skills[s].extra_levels += character.skills_masteries
			skills[s].extra_levels += character.skills_tree2
		}
	}
};

/*[ 0] Howl				*/ var d111 = {values:[
		["distance",20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180,184,188,192,196,200,204,208,212,216,220,224,228,232,236,240,244,248,252,256,], 
		["duration",4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,], 
]};
/*[ 1] Find Potion		*/ var d113 = {values:[
		["chance",40,48,55,60,65,68,71,73,76,77,79,81,82,83,84,86,86,87,88,88,89,90,90,91,91,92,93,93,93,93,94,94,95,95,95,95,95,96,96,96,96,97,97,97,97,97,97,97,98,98,98,98,98,99,99,99,99,99,99,100,], 
]};
/*[ 2] Taunt			*/ var d121 = {values:[
		["target damage",-10,-12,-14,-16,-18,-20,-22,-24,-26,-28,-30,-32,-34,-36,-38,-40,-42,-44,-46,-48,-50,-52,-54,-56,-58,-60,-62,-64,-66,-68,-70,-72,-74,-76,-78,-80,-82,-84,-86,-88,-90,-92,-94,-96,-98,-100,-102,-104,-106,-108,-110,-112,-114,-116,-118,-120,-122,-124,-126,-128,], 
		["target attack",-10,-12,-14,-16,-18,-20,-22,-24,-26,-28,-30,-32,-34,-36,-38,-40,-42,-44,-46,-48,-50,-52,-54,-56,-58,-60,-62,-64,-66,-68,-70,-72,-74,-76,-78,-80,-82,-84,-86,-88,-90,-92,-94,-96,-98,-100,-102,-104,-106,-108,-110,-112,-114,-116,-118,-120,-122,-124,-126,-128,], 
]};
/*[ 3] Shout			*/ var d122 = {values:[
		["defense",100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,650,660,670,680,690,], 
		["duration",95,105,115,125,135,145,155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325,335,345,355,365,375,385,395,405,415,425,435,445,455,465,475,485,495,505,515,525,535,545,555,565,575,585,595,605,615,625,635,645,655,665,675,685,], 
]};
/*[ 4] Find Item		*/ var d133 = {values:[
		["chance",37,41,44,47,49,51,52,53,54,55,56,57,57,58,58,59,59,60,60,60,61,61,61,62,62,62,62,62,63,63,63,63,63,63,63,64,64,64,64,64,64,64,64,64,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,66,], 
]};
/*[ 5] Battle Cry		*/ var d141 = {values:[
		["duration",12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,], 
		["defense",-50,-52,-54,-56,-58,-60,-62,-64,-66,-68,-70,-72,-74,-76,-78,-80,-82,-84,-86,-88,-90,-92,-94,-96,-98,-100,-102,-104,-106,-108,-110,-112,-114,-116,-118,-120,-122,-124,-126,-128,-130,-132,-134,-136,-138,-140,-142,-144,-146,-148,-150,-152,-154,-156,-158,-160,-162,-164,-166,-168,], 
		["damage",-25,-27,-29,-31,-33,-35,-37,-39,-41,-43,-45,-47,-49,-51,-53,-55,-57,-59,-61,-63,-65,-67,-69,-71,-73,-75,-77,-79,-81,-83,-85,-87,-89,-91,-93,-95,-97,-99,-101,-103,-105,-107,-109,-111,-113,-115,-117,-119,-121,-123,-125,-127,-129,-131,-133,-135,-137,-139,-141,-143,], 
]};
/*[ 6] Battle Orders	*/ var d152 = {values:[
		["duration",95,105,115,125,135,145,155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325,335,345,355,365,375,385,395,405,415,425,435,445,455,465,475,485,495,505,515,525,535,545,555,565,575,585,595,605,615,625,635,645,655,665,675,685,], 
		["stamina",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["life",12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,], 
		["mana",12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,], 
]};
/*[ 7] Grim Ward		*/ var d153 = {values:[
		["duration",10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,], 
		["radius",3.3,4,4.6,5.3,6,6.6,7.3,8,8.6,9.3,10,10.6,11.3,12,12.6,13.3,14,14.6,15.3,16,16.6,17.3,18,18.6,19.3,20,20.6,21.3,22,22.6,23.3,24,24.6,25.3,26,26.6,27.3,28,28.6,29.3,30,30.6,31.3,32,32.6,33.3,34,34.6,35.3,36,36.6,37.3,38,38.6,39.3,40,40.6,41.3,42,42.6,], 
		["enemy resist",-10,-12,-14,-16,-18,-20,-22,-24,-26,-28,-30,-32,-34,-36,-38,-40,-42,-44,-46,-48,-50,-52,-54,-56,-58,-60,-62,-64,-66,-68,-70,-72,-74,-76,-78,-80,-82,-84,-86,-88,-90,-92,-94,-96,-98,-100,-102,-104,-106,-108,-110,-112,-114,-116,-118,-120,-122,-124,-126,-128,], 
]};
/*[ 8] War Cry			*/ var d161 = {values:[
		["damage min",17,26,33,42,50,58,66,73,86,98,110,122,133,145,158,170,188,205,223,242,260,278,300,322,344,366,388,410,440,470,500,530,560,590,620,650,680,710,740,770,800,830,860,890,920,950,980,1010,1040,1070,1100,1130,1160,1190,1220,1250,1280,1310,1340,1370,], 
		["damage max",30,40,50,60,70,80,90,100,116,132,148,164,180,195,211,227,252,276,300,323,348,372,400,428,456,484,512,540,576,612,648,684,720,756,792,828,864,900,936,972,1008,1044,1080,1116,1152,1188,1224,1260,1296,1332,1368,1404,1440,1476,1512,1548,1584,1620,1656,1692,], 
		["radius bonus",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["mana cost",8.7,9,9.2,9.5,9.7,10,10.2,10.5,10.7,11,11.2,11.5,11.7,12,12.2,12.5,12.7,13,13.2,13.5,13.7,14,14.2,14.5,14.7,15,15.2,15.5,15.7,16,16.2,16.5,16.7,17,17.2,17.5,17.7,18,18.2,18.5,18.7,19,19.2,19.5,19.7,20,20.2,20.5,20.7,21,21.2,21.5,21.7,22,22.2,22.5,22.7,23,23.2,23.5,], 
]};
/*[ 9] Battle Command	*/ var d162 = {values:[
		["skills",], 
		["duration",95,105,115,125,135,145,155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325,335,345,355,365,375,385,395,405,415,425,435,445,455,465,475,485,495,505,515,525,535,545,555,565,575,585,595,605,615,625,635,645,655,665,675,685,], 
]};

/*[10] Edged Mastery	*/ var d211 = {values:[
		["damage",30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,], 
		["attack rating",50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,], 
		["crit chance",5,7,12,15,17,19,20,21,23,23,24,25,26,26,27,28,28,28,29,29,29,30,30,30,30,31,31,31,31,31,32,32,32,32,32,32,32,33,33,33,33,33,33,33,33,33,33,33,34,34,34,34,34,34,34,34,34,34,34,35,], 
]};
/*[11] Pole Mastery		*/ var d212 = {values:[
		["damage",30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,], 
		["attack rating",50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,], 
		["crit chance",5,7,12,15,17,19,20,21,23,23,24,25,26,26,27,28,28,28,29,29,29,30,30,30,30,31,31,31,31,31,32,32,32,32,32,32,32,33,33,33,33,33,33,33,33,33,33,33,34,34,34,34,34,34,34,34,34,34,34,35,], 
]};
/*[12] Blunt Mastery	*/ var d213 = {values:[
		["damage",30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,], 
		["attack rating",50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,], 
		["crit chance",5,7,12,15,17,19,20,21,23,23,24,25,26,26,27,28,28,28,29,29,29,30,30,30,30,31,31,31,31,31,32,32,32,32,32,32,32,33,33,33,33,33,33,33,33,33,33,33,34,34,34,34,34,34,34,34,34,34,34,35,], 
]};
/*[13] Thrown Mastery	*/ var d222 = {values:[
		["damage",30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,], 
		["attack rating",50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,], 
		["pierce",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["crit chance",5,7,12,15,17,19,20,21,23,23,24,25,26,26,27,28,28,28,29,29,29,30,30,30,30,31,31,31,31,31,32,32,32,32,32,32,32,33,33,33,33,33,33,33,33,33,33,33,34,34,34,34,34,34,34,34,34,34,34,35,], 
]};
/*[14] Increased Stamina*/ var d231 = {values:[
		["stamina",50,75,100,125,150,175,200,225,250,275,300,325,350,375,400,425,450,475,500,525,550,575,600,625,650,675,700,725,750,775,800,825,850,875,900,925,950,975,1000,1025,1050,1075,1100,1125,1150,1175,1200,1225,1250,1275,1300,1325,1350,1375,1400,1425,1450,1475,1500,1525,], 
]};
/*[15] Counter Attack	*/ var d232 = {values:[
		["chance",3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,], 
]};
/*[16] Iron Skin		*/ var d243 = {values:[
		["defense",30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,], 
]};
///*[17] Increased Speed	*/ var d251 = {values:[
//		["speed",16,20,24,27,30,32,33,34,36,37,38,39,40,40,41,42,42,42,43,43,44,44,44,45,45,45,46,46,46,46,46,46,47,47,47,47,47,48,48,48,48,48,48,48,48,48,48,48,49,49,49,49,49,49,49,49,49,49,49,50,], 
//]};
/*[18] Increased Speed	*/ var d251 = {values:[
	["speed",13,18,22,26,29,31,33,35,37,38,39,41,42,43,43,45,45,47,47,48,48,48,49,50,50,51,51,52,53,53,53,54,54,54,54,56,56,56,56,57,57,58,58,59,59,59,59,60,61,62,62,62,62,62,62,63,63,63,63,64,], 
]}; //		1          4           8           12         16          20          24          28          32          36           40         44          48          52          56          60
/*[18] Puncture			*/ var d252 = {values:[
		["open wounds",4,7,9,11,13,14,15,15,16,17,18,18,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,], 
		["bleed damage",1,2,3,4,5,7,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,], 
]};
/*[19] Whirling Axes		*/ var d262 = {values:[
//						1 2  3  4  5  6  7  8  9  10 								20										30										40										50
		["damage min",7, 11, 14, 18, 22, 25, 29, 32, 38, 43, 48, 54, 59, 65, 70, 76, 84, 91, 99, 108, 116, 124, 134, 144, 154, 163, 174, 183, 197, 210, 224, 237, 250, 264, 278, 292, 306, 320, 335, 350, 365, 381, 397, 413, 429, 446, 463, 480, 498, 516, 534, 552, 571, 590, 609, 629, 649, 669, 690, 710,],
		["damage max",12, 17, 22, 26, 31, 35, 40, 44, 51, 59, 65, 73, 80, 87, 94, 102, 112, 123, 134, 144, 155, 166, 179, 191, 204, 216, 229, 242, 258, 274, 290, 306, 322, 338, 355, 372, 389, 407, 425, 442, 461, 479, 497, 516, 535, 554, 574, 594, 614, 635, 655, 676, 697, 718, 740, 762, 784, 806, 828, 851,],
//		["damage min",11,16,22,27,32,37,42,48,55,63,71,79,87,94,102,110,122,133,145,157,169,180,195,209,223,237,252,266,286,305,325,344,364,383,403,422,442,461,481,500,520,539,559,578,598,617,637,656,676,695,715,734,754,773,793,812,832,851,871,890,], 
//		["damage max",19,26,32,39,45,52,58,65,75,85,96,106,117,127,13719,26,33,39,46,52,59,66,76,87,97,108,118,129,139,150,166,182,198,213,229,245,264,282,300,319,337,356,380,403,427,450,474,498,523,548,573,599,625,651,678,705,732,760,788,816,845,874,904,934,964,995,1026,1057,1089,1121,1153,1186,1219,148,163,179,195,210,226,241,260,278,296,314,332,351,374,397,421,444,468,491,514,538,561,585,608,631,655,678,702,725,748,772,795,819,842,865,889,912,936,959,982,1006,1029,1053,1076,1099,], 
//						1						   10
		["whirlychance",12,14,16,18,20,22,24,26,28,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,],
//		["whirlychance",4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,], 
]};
/*[20]Natural Resistance*/ var d263 = {values:[
		["resistances",11,20,27,33,37,41,44,46,49,51,53,54,56,57,58,60,60,61,62,63,63,64,65,65,66,66,67,67,68,68,69,69,69,69,69,70,70,71,71,71,71,72,72,72,72,72,72,72,73,73,73,73,73,74,74,74,74,74,74,75,], 
]};

/*[21] Double Swing		*/ var d311 = {values:[
//		["damage",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,], 
		["damage",5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,], 
//		["attack rating",15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,], 
		["attack rating",15,23,31,39,47,55,63,71,79,87,95,103,111,119,127,135,143,151,159,167,175,183,191,199,207,215,223,231,239,247,255,263,271,279,287,295,303,311,319,327,335,343,351,359,367,375,383,391,399,407,415,423,431,439,447,455,463,471,479,487,495,503,],
		["mana cost",1,0.875,0.75,0.625,0.5,0.375,0.25,0.125,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,], 
]};
/*[22] Frenzy			*/ var d321 = {values:[
		["",], 
		["damage",20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,], 
		["attack rating",38,46,54,62,70,78,86,94,102,110,118,126,134,142,150,158,166,174,182,190,198,206,214,222,230,238,246,254,262,270,278,286,294,302,310,318,326,334,342,350,358,366,374,382,390,398,406,414,422,430,438,446,454,462,470,478,486,494,502,510,],
		["duration",], 
		["attack speed min",9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,], 
		["attack speed max",9,13,15,18,20,21,22,23,24,25,26,26,27,28,28,29,29,29,29,30,30,30,31,31,31,31,32,32,32,32,32,32,32,32,32,33,33,33,33,33,33,33,33,33,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,35,], 
		["movement speed min",36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,], 
		["movement speed max",36,45,52,58,62,66,69,71,74,76,78,79,81,82,83,85,85,86,87,88,88,89,90,91,91,91,92,92,93,93,94,94,94,94,94,95,95,96,96,96,96,97,97,97,97,97,97,97,98,98,98,98,98,99,99,99,99,99,99,100,], 
		["mana cost",1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,], 
]};
/*[23] Bash				*/ var d322 = {values:[
	["magic conversion",46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,100,100,100,100,100,], 
	["magic damage",46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,100,100,100,100,100,], 
//	["attack rating",20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,], 
//	["damage",50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,620,630,640,], 
	["attack rating",17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,],
	["damage",10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,],
]};
/*[24] Cleave			*/ var d323 = {values:[
		["damage min",2,3,4,5,6,7,8,9,10,12,15,17,18,21,23,24,28,30,34,37,40,43,47,51,55,59,63,67,72,77,82,87,92,97,102,107,112,117,122,127,132,137,142,147,152,157,162,167,172,177,182,187,192,197,202,207,212,217,222,227,], 
		["damage max",4,6,8,10,11,14,16,18,20,23,27,30,32,36,38,42,44,48,50,54,57,60,64,68,72,76,80,84,89,94,99,104,109,114,119,124,129,134,139,144,149,154,159,164,169,174,179,184,189,194,199,204,209,214,219,224,229,234,239,244,], 
		["mana cost",4.5,4.3,4.1,3.9,3.7,3.5,3.3,3.1,3,2.8,2.6,2.4,2.2,2,1.8,1.6,1.5,1.3,1.1,0.9,0.7,0.5,0.3,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,], 
]};
/*[25] Stun				*/ var d332 = {values:[
		["magic min",13,24,35,46,57,68,79,90,106,122,138,154,170,186,202,218,240,262,284,306,328,350,378,406,434,462,490,518,552,586,620,654,688,722,756,790,824,858,892,926,960,994,1028,1062,1096,1130,1164,1198,1232,1266,1300,1334,1368,1402,1436,1470,1504,1538,1572,1606,], 
		["magic max",19,35,51,67,83,99,115,131,153,175,197,219,241,263,285,307,337,367,397,427,457,487,525,563,601,639,677,715,759,803,847,891,935,979,1023,1067,1111,1155,1199,1243,1287,1331,1375,1419,1463,1507,1551,1595,1639,1683,1727,1771,1815,1859,1903,1947,1991,2035,2079,2123,], 
		["attack rating",15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,], 
		["duration",0.8,1,1.2,1.4,1.6,1.8,2,2.2,2.4,2.6,2.8,3,3.2,3.4,3.6,3.8,3.8,3.9,4,4.1,4.2,4.2,4.3,4.4,4.5,4.6,4.6,4.7,4.8,4.9,5,5,5.1,5.2,5.3,5.4,5.4,5.5,5.6,5.7,5.8,5.8,5.9,6,6.1,6.2,6.2,6.3,6.4,6.5,6.6,6.6,6.7,6.8,6.9,7,7,7.1,7.2,7.3,], 
]};
///*[26] Leap				*/ var d333 = {values:[
//	["damage",51,53,54,56,57,59,60,62,63,65,66,68,69,71,72,74,75,77,78,80,81,83,84,86,87,89,90,92,93,95,96,98,99,101,102,104,105,107,108,110,111,113,114,116,117,119,120,122,123,125,126,128,129,131,132,134,135,137,138,140,], 
//	["radius",12,12.6,14,14.6,15.3,15.3,16,16,16.6,16.6,16.6,17.3,17.3,17.3,17.3,18,18,18,18,18,18,18.6,18.6,18.6,18.6,18.6,18.6,18.6,18.6,18.6,18.6,18.6,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,20,], 
//]};
/*[26] Leap Slam	 		*/ var d333 = {values:[
	["damage",51,53,54,56,57,59,60,62,63,65,66,68,69,71,72,74,75,77,78,80,81,83,84,86,87,89,90,92,93,95,96,98,99,101,102,104,105,107,108,110,111,113,114,116,117,119,120,122,123,125,126,128,129,131,132,134,135,137,138,140,], 
	["radius",12,12.6,14,14.6,15.3,15.3,16,16,16.6,16.6,16.6,17.3,17.3,17.3,17.3,18,18,18,18,18,18,18.6,18.6,18.6,18.6,18.6,18.6,18.6,18.6,18.6,18.6,18.6,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,19.3,20,], 
]};
/*[27] Double Throw		*/ var d341 = {values:[
		["damage",15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,], 
//		["damage max",],	
		["attack rating",20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,], 
]};
///*[27] Power Throw		*/ var d341 = {values:[
//		["damage bonus",15,25,35,45,55,65,75,85,95,105,115,125,135,145,155,165,175,185,195,205,215,225,235,245,255,265,275,285,295,305,315,325,335,345,355,365,375,385,395,405,415,425,435,445,455,465,475,485,495,505,515,525,535,545,555,565,575,585,595,605,], 
//		["attack rating",20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,580,590,600,610,], 
//		["damage min",1,2,3,4,5,6,7,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,], 
//		["damage max",2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,], 
//		["mana cost",1,2,2,3,3,4,4,4,5,5,6,6,7,7,8,8,9,9,9,10,10,11,11,12,12,13,13,14,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,22,23,23,24,24,24,25,25,26,26,27,27,28,28,], 
//]}; 
/*[28] Concentrate		*/ var d342 = {values:[
	["defense",100,112,124,136,148,160,172,184,196,208,220,232,244,256,268,280,292,304,316,328,340,352,364,376,388,400,412,424,436,448,460,472,484,496,508,520,532,544,556,568,580,592,604,616,628,640,652,664,676,688,700,712,724,736,748,760,772,784,796,808,], 
	["attack rating",80,88,96,104,112,120,128,136,144,152,160,168,176,184,192,200,208,216,224,232,240,248,256,264,272,280,288,296,304,312,320,328,336,344,352,360,368,376,384,392,400,408,416,424,432,440,448,456,464,472,480,488,496,504,512,520,528,536,544,552,], 
	["damage",50,57,64,71,78,85,92,99,106,113,120,127,134,141,148,155,162,169,176,183,190,197,204,211,218,225,232,239,246,253,260,267,274,281,288,295,302,309,316,323,330,337,344,351,358,365,372,379,386,393,400,407,414,421,428,435,442,449,456,463,], 
]};

///*[29] Leap Attack		*/ var d353 = {values:[
//		["damage",100,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1000,1050,1100,1150,1200,1250,1300,1350,1400,1450,1500,1550,1600,1650,1700,1750,1800,1850,1900,1950,2000,2050,2100,2150,2200,2250,2300,2350,2400,2450,2500,2550,2600,2650,2700,2750,2800,2850,2900,2950,3000,3050,], 
//		["attack rating",70,85,100,115,130,145,160,175,190,205,220,235,250,265,280,295,310,325,340,355,370,385,400,415,430,445,460,475,490,505,520,535,550,565,580,595,610,625,640,655,670,685,700,715,730,745,760,775,790,805,820,835,850,865,880,895,910,925,940,955,], 
//]};
/*[29] Ethereal Throw	*/ var d361 = {values:[
		["damage min",13,23,34,45,56,68,79,90,106,121,138,154,169,185,202,218,240,261,283,306,328,350,378,406,434,462,490,518,552,586,620,654,688,722,756,790,824,858,892,926,960,994,1028,1062,1096,1130,1164,1198,1232,1266,1300,1334,1368,1402,1436,1470,1504,1538,1572,1606,], 
		["damage max",19,34,51,67,82,98,115,131,153,175,196,219,241,263,284,306,336,367,396,427,457,487,525,563,601,639,677,715,759,803,847,891,935,979,1023,1067,1111,1155,1199,1243,1287,1331,1375,1419,1463,1507,1551,1595,1639,1683,1727,1771,1815,1859,1903,1947,1991,2035,2079,2123,], 
		["mana cost",5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,], 
]};
/*[30] Whirlwind		*/ var d362 = {values:[
		["damage",-75,-69,-63,-57,-51,-45,-39,-33,-27,-21,-15,-9,-3,3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93,99,105,111,117,123,129,135,141,147,153,159,165,171,177,183,189,195,201,207,213,219,225,231,237,243,249,255,261,267,273,279,], 
		["attack rating",10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,], 
		["mana cost",5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34,34.5,], 
]};

var skills_barbarian = [
{data:d111, key:"111", code:128, name:"Howl", i:0, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Sends nearby monsters<br>scrambling away in fear", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Enemy runs up to "," yards<br>Enemy runs for "," seconds<br>Mana Cost: 4",""]},
{data:d113, key:"113", code:129, name:"Find Potion", i:1, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Use on the corpse of a slain monster<br>for a chance to find a potion", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent chance<br>Mana Cost: 1",""]},
{data:d121, key:"121", code:130, name:"Taunt", i:2, req:[0], reqlvl:6, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Enrages a monster into relentlessly attacking", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Target's Damage: "," percent<br>Target's Attack: "," percent<br>Mana Cost: 4",""]},
{data:d122, key:"122", code:131, name:"Shout", i:3, req:[0], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Warns of impending danger and improves the defense<br>rating of you and your party", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Defense: +"," percent<br>Duration: "," seconds<br>Mana Cost: 4",""], notupdated:0},
{data:d133, key:"133", code:132, name:"Find Item", i:4, req:[1], reqlvl:12, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Use on the corpse of a slain monster<br>to find hidden treasures", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent chance<br>Mana Cost: 5",""]},
{data:d141, key:"141", code:133, name:"Battle Cry", i:5, req:[2,0], reqlvl:18, level:0, extra_levels:0, force_levels:0, bindable:1, description:"Fearsome cry that decreases<br>enemies' defense rating and damage", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Defense: "," percent<br>Damage: "," percent<br>Mana Cost: 5",""]},
{data:d152, key:"152", code:134, name:"Battle Orders", i:6, req:[3,0], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Improves the maximum mana, life and<br>stamina of you and your party", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Max Stamina: "," percent<br>Max Life: "," percent<br>Max Mana: "," percent<br>Mana Cost: 7",""], notupdated:0},
{data:d153, key:"153", code:135, name:"Grim Ward", i:7, req:[4,1], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Turn a corpse into a horrifying totem,<br>decreasing the physical resistance of<br>nearby enemies", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Duration: "," seconds<br>Radius: "," yards<br>Enemy Physical Resistance: "," percent",""]},
{data:d161, key:"161", code:136, name:"War Cry", i:8, req:[5,6,2,3,0], reqlvl:30, level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:0,spell:1}, description:"Injures and stuns all nearby enemies", syn_title:"<br>War Cry Receives Bonuses From:<br>", syn_text:"Taunt: +18% Damage per Level<br>Battle Cry: +18% Damage per Level", graytext:"", index:[0,""], text:["Damage: ","-","<br>Cry Travel Speed: ","%<br>Stun Length: 1 second<br>Mana Cost: ",""], notupdated:0},
{data:d162, key:"162", code:137, name:"Battle Command", i:9, req:[6,3,0], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:5, bindable:1, description:"Increases all current skill levels for you and your party", syn_title:"", syn_text:"", graytext:"<br>Base Level 1: +1 to All Skills<br>Base Level 10: +2 to All Skills<br>Base Level 20: +3 to All Skills<br>", index:[1," to All Skills"], text:["+","Duration: "," seconds<br>Mana Cost: 11",""]},

{data:d211, key:"211", code:138, name:"Edged Weapon Mastery", i:10, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Improves sword, axe & dagger fighting skill", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>"," percent chance of Critical Strike",""]},
{data:d212, key:"212", code:139, name:"Pole Weapon Mastery", i:11, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Improves polearm & spear fighting skill", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>"," percent chance of Critical Strike",""]},
{data:d213, key:"213", code:140, name:"Blunt Weapon Mastery", i:12, req:[], reqlvl:1, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Improves mace, scepter & staff fighting skill", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>"," percent chance of Critical Strike",""]},
{data:d222, key:"222", code:141, name:"Thrown Weapon Mastery", i:13, req:[], reqlvl:6, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Improves thrown weapon fighting skill", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>+","% Piercing Attack with Ranged Weapons<br>"," percent chance of Critical Strike",""]},
{data:d231, key:"231", code:142, name:"Increased Stamina", i:14, req:[], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Increases your stamina", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Stamina Bonus: +"," percent",""]},
{data:d232, key:"232", code:310, name:"Counter Attack", i:15, req:[], reqlvl:12, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Hit back your attackers with main hand weapon<br><br>Deals 100% of Weapon Damage", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Chance to counter attack: "," percent"]},
{data:d243, key:"243", code:143, name:"Iron Skin", i:16, req:[], reqlvl:18, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Improves defense rating", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["+"," percent",""]},
{data:d251, key:"251", code:144, name:"Increased Speed", i:17, req:[14], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Increases walk and run speed", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Walk/Run Speed: +"," percent",""], notupdated:0},
{data:d252, key:"252", code:311, name:"Puncture", i:18, req:[], reqlvl:24, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Opens a deep wound in the flesh of enemies", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""," percent chance to Open Wounds<br>Wounds Bleed Damage: "," per second"]},
//{data:d262, key:"262", code:312, name:"Whirling Axes", i:19, req:[], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:5, bindable:2, damaging:{attack:2,spell:0}, description:"Passive - Attacks release multiple whirling axes", syn_title:"<br>Whirling Axes Receives Bonuses From:<br>", syn_text:"War Cry: +14% Damage per Level<br>Double Swing: 14% Damage per Level<br>+1% Increased Damage per Dexterity", graytext:"", index:[0,""], text:["Damage: ","-","<br>"," percent chance to release axes on melee hit"], damagetoohigh:1},
{data:d262, key:"262", code:312, name:"Whirling Axes", i:19, req:[], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:5, bindable:2, damaging:{attack:2,spell:0}, description:"Passive - Attacks release multiple whirling axes", syn_title:"<br>Whirling Axes Receives Bonuses From:<br>", syn_text:"Battle Cry: +14% Damage per Level<br>Double Swing: 14% Damage per Level<br>+1% Increased Damage per Dexterity", graytext:"", index:[0,""], text:["Damage: ","-","<br>"," percent chance to release axes on melee hit"], notupdated:0},
{data:d263, key:"263", code:145, name:"Natural Resistance", i:20, req:[16], reqlvl:30, level:0, extra_levels:0, force_levels:0, effect:1, bindable:0, description:"Passive - Increases natural resistances<br>to elemental and poison damage", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Resistances: +"," percent",""]},

{data:d311, key:"311", code:146, name:"Double Swing", i:21, req:[], reqlvl:1, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, notupdated:1, description:"When two weapon are equipped<br>attacks two targets if possible,<br>or one target twice<br><br>Deals 100% of Weapon Damage", syn_title:"<br>Double Swing Receives Bonuses From:<br>", syn_text:"Bash: +5% Damage per Level", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>Mana Cost: ",""], notupdated:0},
{data:d321, key:"321", code:146, name:"Frenzy", i:22, req:[21], reqlvl:6, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand"], level:0, extra_levels:0, force_levels:0, effect:4, bindable:2, damaging:{attack:1,spell:0}, description:"Allows you to swing two weapons at once<br>East successful attack increases your overall speed<br>Requires you to equip two weapons", syn_title:"<br>Frenzy Receives Bonuses From:<br>", syn_text:"Double Swing: +10% Damage per Level<br>Increased Stamina: +10% Damage per Level<br>Bash: +1% Magic Damage per Level <red>(Bash synergy damage display may be incorrect)</red><br>", graytext:"", index:[1," percent<br>"], text:["Deals 100% of Weapon Damage<br>Magic Damage: +","Damage: +"," percent<br>Attack Rating: +"," percent<br>Duration:"," seconds<br>Attack Speed: +","-"," percent<br>Walk/Run Speed: +","-"," percent<br>Mana Cost: ",""], notupdated:0},
{data:d322, key:"322", code:152, name:"Bash", i:23, req:[], reqlvl:6, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"Powerful blow that converts physical damage to<br>magic and knocks back enemies", syn_title:"<br>Bash Receives Bonuses From:<br>", syn_text:"Stun: +10% Damage per Level<br>Concentrate: +5% Attack Rating per Level", graytext:"", index:[1,"% Physical Damage converted to Magic"], text:["Deals 100% of Weapon Damage<br>","Magic Damage: "," percent<br>Attack Rating: +"," percent<br>Damage: +"," percent<br>Mana Cost: 2",""], notupdated:0, damagewrong:1},
{data:d323, key:"323", code:148, name:"Cleave", i:24, req:[], reqlvl:6, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:1}, description:"Attacks in an arc, dealing damage<br>to all enemies caught in the swing<br><br>Deals 60% of Weapon Damage", syn_title:"<br>Cleave Receives Bonuses From:<br>", syn_text:"Leap Slam: +15% Damage per Level", graytext:"", index:[0,""], text:["Damage: ","-","<br>Mana Cost: ",""], notupdated:0},
{data:d332, key:"332", code:149, name:"Stun", i:25, req:[23], reqlvl:12, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"An attack that stuns your target<br>and deals magic damage around it<br><br>Deals 100% of Weapon Damage", syn_title:"<br>Stun Receives Bonuses From:<br>", syn_text:"Bash: +10% Magic Damage per Level<br>Concentrate: +5% Attack Rating per Level<br>Howl +10% Magic Damage per Level", graytext:"", index:[0,""], text:["Magic Damage: ","-","<br>Attack Rating: +"," percent<br>Duration: "," seconds<br>Mana Cost: 2",""], notupdated:0},
//{data:d333, key:"333", code:150, name:"Leap", i:26, req:[24], reqlvl:12, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"Leaps away from danger<br>or into the fray", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Deals ","% of Weapon Damage<br>Radius: "," yards",""], notupdated:1},
{data:d333, key:"333", code:150, name:"Leap Slam", i:26, req:[24], reqlvl:12, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"Leaps away from danger<br>or into the fray", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Deals ","% of Weapon Damage<br>Radius: "," yards",""], notupdated:0},
{data:d341, key:"341", code:151, name:"Double Throw", i:27, req:[22], reqlvl:18, reqWeapon:["thrown","javelin"], level:0, extra_levels:0, force_levels:0, effect:0, bindable:2, damaging:{attack:2,spell:0}, description:"Throw both your left & right throwing weapons<br><br>(Alternate Mode): Throw your right-hand<br>throwing weapon, twice", syn_title:"<br>Double Throw Receives Bonuses From:<br>", syn_text:"Etheral Throw: +8% Damage per Level", graytext:"", index:[0,""], text:["Damage: +","%<br>To Attack Rating: +"," percent<br><br>Mana Cost: 1"], notupdated:0, damagewrong:1},
{data:d342, key:"342", code:147, name:"Concentrate", i:28, req:[25,26], reqlvl:18, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"Attack that is not interruptible and<br>improves attack and defense rating<br><br>Deals 160% of Weapon Damage", syn_title:"<br>Concentrate Receives Bonuses From:<br>", syn_text:"Bash: +5% Damage per Level<br>Battle Orders: +10% Damage per Level<br>Taunt: +10% Damage per Level", graytext:"", index:[0,""], text:["Defense Bonus: +"," percent<br>Attack Rating: +"," percent<br>Damage: +"," percent<br>Mana Cost: 2",""]},
{data:d361, key:"361", code:154, name:"Ethereal Throw", i:29, req:[22,28], reqlvl:30, reqWeapon:["thrown","javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:2,spell:0}, description:"Throw your weapon with tremendous force,<br>converting it into a burst of energy<br>that explodes upon impact<br><br>Deals 60% of Weapon Damage", syn_title:"<br>Ethereal Throw Receives Bonuses From:<br>", syn_text:"Power Throw: +4% Magic Damage per Level<br>Bash: +4% Magic Damage per Level", graytext:"", index:[0,""], text:["Magic Damage: ","-","<br>Mana Cost: ",""]},
{data:d362, key:"362", code:155, name:"Whirlwind", i:30, req:[28], reqlvl:30, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm","claw"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"A whirling dance of death<br>that cuts a path through the<br>legions of your enemies<br><br>Deals 100% of Weapon Damage", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>Mana Cost: ",""], notupdated:0},
];

/*
{data:d311, key:"311", code:146, name:"Double Swing", i:21, req:[], reqlvl:1, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"When two weapon are equipped<br>attacks two targets if possible,<br>or one target twice<br><br>Deals 100% of Weapon Damage", syn_title:"<br>Double Swing Receives Bonuses From:<br>", syn_text:"Bash: +5% Damage per Level", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>Mana Cost: ",""]},
//{data:d312, key:"312", code:146, name:"Double Swing", i:21, req:[], reqlvl:1, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"When two weapon are equipped<br>attacks two targets if possible,<br>or one target twice<br><br>Deals 100% of Weapon Damage", syn_title:"<br>Double Swing Receives Bonuses From:<br>", syn_text:"Bash: +5% Damage per Level", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>Mana Cost: ",""]},
{data:d321, key:"321", code:146, name:"Frenzy", i:22, req:[], reqlvl:6, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand"], level:0, extra_levels:0, force_levels:0, effect:4, bindable:2, damaging:{attack:1,spell:0}, description:"Allows you to swing two weapons at once<br>East successful attack increases your overall speed<br>Requires you to equip two weapons", syn_title:"<br>Frenzy Receives Bonuses From:<br>", syn_text:"Double Swing: +10% Damage per Level<br>Increased Stamina: +10% Damage per Level<br>Bash: +1% Magic Damage per Level <red>(Bash synergy damage display may be incorrect)</red><br>Concentrate: +8% Attack Rating per Level", graytext:"", index:[1," percent<br>Duration: 7.5 seconds"], text:["Deals 115% of Weapon Damage<br>Magic Damage: +","Damage: +"," percent<br>Attack Rating: +"," percent<br>Attack Speed: +","-"," percent<br>Walk/Run Speed: +","-"," percent<br>Mana Cost: ",""]},
{data:d322, key:"322", code:152, name:"Bash", i:28, req:[], reqlvl:6, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"Powerful blow that converts physical damage to<br>magic and knocks back enemies", syn_title:"<br>Bash Receives Bonuses From:<br>", syn_text:"Stun: +10% Damage per Level<br>Concentrate: +5% Attack Rating per Level", graytext:"", index:[1,"% Physical Damage converted to Magic"], text:["Deals 110% of Weapon Damage<br>","Magic Damage: "," percent<br>Attack Rating: +"," percent<br>Damage: +"," percent<br>Mana Cost: 2",""]},
{data:d323, key:"323", code:148, name:"Cleave", i:24, req:[21], reqlvl:6, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:1}, description:"Attacks in an arc, dealing damage<br>to all enemies caught in the swing<br><br>Deals 60% of Weapon Damage", syn_title:"<br>Cleave Receives Bonuses From:<br>", syn_text:"Double Swing: +15% Damage per Level", graytext:"", index:[0,""], text:["Damage: ","-","<br>Mana Cost: ",""]},
{data:d332, key:"332", code:149, name:"Stun", i:25, req:[28], reqlvl:12, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"An attack that stuns your target<br>and deals magic damage around it<br><br>Deals 100% of Weapon Damage", syn_title:"<br>Stun Receives Bonuses From:<br>", syn_text:"Bash: +10% Magic Damage per Level<br>Concentrate: +5% Attack Rating per Level<br>War Cry +10% Magic Damage per Level", graytext:"", index:[0,""], text:["Magic Damage: ","-","<br>Attack Rating: +"," percent<br>Duration: "," seconds<br>Mana Cost: 2",""]},
{data:d333, key:"333", code:150, name:"Leap", i:26, req:[21,24], reqlvl:12, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"Leaps away from danger<br>or into the fray", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Deals ","% of Weapon Damage<br>Radius: "," yards",""]},
{data:d341, key:"341", code:151, name:"Double Throw", i:27, req:[22], reqlvl:18, reqWeapon:["thrown","javelin"], level:0, extra_levels:0, force_levels:0, effect:0, bindable:2, damaging:{attack:2,spell:0}, description:"Throw both your left & right throwing weapons<br><br>(Alternate Mode): Throw your right-hand<br>throwing weapon, twice", syn_title:"<br>Double Throw Receives Bonuses From:<br>", syn_text:"Frenzy I guess?: +8% Damage per Level", graytext:"", index:[0,""], text:["To Attack Rating: +"," percent<br><br>Mana Cost: 1"]},
																																																																																																					
//{data:d341, key:"341", code:151, name:"Power Throw", i:27, req:[22], reqlvl:18, reqWeapon:["thrown","javelin"], level:0, extra_levels:0, force_levels:0, effect:3, bindable:2, damaging:{attack:2,spell:0}, description:"Gathers momentum to unleash a powerful throw<br>that deals damage to the target and nearby enemies<br><br>Deals 120% of Weapon Damage<br><br>Increases Physical Damage for 2.2 seconds", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent<br>To Attack Rating: +"," percent<br>Damage: ","-","<br>Mana Cost: ",""]},
{data:d342, key:"342", code:147, name:"Concentrate", i:23, req:[28,25], reqlvl:18, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"Attack that is not interruptible and<br>improves attack and defense rating<br><br>Deals 160% of Weapon Damage", syn_title:"<br>Concentrate Receives Bonuses From:<br>", syn_text:"Bash: +5% Damage per Level<br>Battle Orders: +10% Damage per Level<br>Taunt: +10% Damage per Level", graytext:"", index:[0,""], text:["Defense Bonus: +"," percent<br>Attack Rating: +"," percent<br>Damage: +"," percent<br>Mana Cost: 2",""]},
//{data:d353, key:"353", code:153, name:"Leap Attack", i:25, req:[22,18,28], reqlvl:24, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm"], level:0, extra_levels:0, force_levels:0, bindable:1, damaging:{attack:1,spell:0}, description:"Leaps to and attacks target enemy<br>in one swift assault<br><br>Deals 175% of Weapon Damage", syn_title:"<br>Leap Attack Receives Bonuses From:<br>", syn_text:"Leap: +20% Damage per Level", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>Mana Cost: 4",""], incomplete:1}, 
//{data:d361, key:"361", code:153, name:"None", i:2, req:[], reqlvl:100, level:0, extra_levels:0, force_levels:0, bindable:0, description:"", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:[""]},
{data:d361, key:"361", code:154, name:"Ethereal Throw", i:30, req:[23,25,27,28], reqlvl:30, reqWeapon:["thrown","javelin"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:2,spell:0}, description:"Throw your weapon with tremendous force,<br>converting it into a burst of energy<br>that explodes upon impact<br><br>Deals 60% of Weapon Damage", syn_title:"<br>Ethereal Throw Receives Bonuses From:<br>", syn_text:"Power Throw: +4% Magic Damage per Level<br>Bash: +4% Magic Damage per Level", graytext:"", index:[0,""], text:["Magic Damage: ","-","<br>Mana Cost: ",""]},
{data:d362, key:"362", code:155, name:"Whirlwind", i:31, req:[25,28], reqlvl:30, reqWeapon:["axe","mace","club","hammer","sword","dagger","thrown","javelin","scepter","wand","staff","spear","polearm","claw"], level:0, extra_levels:0, force_levels:0, bindable:2, damaging:{attack:1,spell:0}, description:"A whirling dance of death<br>that cuts a path through the<br>legions of your enemies<br><br>Deals 100% of Weapon Damage", syn_title:"", syn_text:"", graytext:"", index:[0,""], text:["Damage: +"," percent<br>Attack Rating: +"," percent<br>Mana Cost: ",""]},
*/