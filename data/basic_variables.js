
fileInfo = {character:{class_name:""},skills:[],equipped:{charms:[]},corruptsEquipped:{},mercEquipped:{},socketed:{helm:[],armor:[],weapon:[],offhand:[]},effects:{},selectedSkill:["",""],mercenary:"",settings:{},ironGolem:""};
fileText = "";
character = {};
var skill_bonuses = {stamina_skillup:0, frw_skillup:0, defense_skillup:0, resistance_skillup:0, cstrike_skillup:0, ar_skillup:0, ar_skillup2:0, pierce_skillup:0, fRes_skillup:0, cRes_skillup:0, lRes_skillup:0, pRes_skillup:0, block_skillup:0, velocity_skillup:0, edged_damage:0, edged_ar:0, edged_cstrike:0, pole_damage:0, pole_ar:0, pole_cstrike:0, blunt_damage:0, blunt_ar:0, blunt_cstrike:0, thrown_damage:0, thrown_ar:0, thrown_pierce:0, claw_damage:0, claw_ar:0, claw_cstrike:0};
var base_stats = {level:1, skillpoints:0, statpoints:0, quests_completed:-1, running:-1, difficulty:3, strength_added:0, dexterity_added:0, vitality_added:0, energy_added:0, fRes_penalty:100, cRes_penalty:100, lRes_penalty:100, pRes_penalty:100, mRes_penalty:100, fRes:0, cRes:0, lRes:0, pRes:0, mRes:0, fRes_max_base:75, cRes_max_base:75, lRes_max_base:75, pRes_max_base:75, mRes_max_base:75, set_bonuses:[0,0,{},{},{},{},{}]}

var effects = {};
var duplicateEffects = {};
var skillList = []; var skillOptions = [];
var selectedSkill = [" ­ ­ ­ ­ Skill 1", " ­ ­ ­ ­ Skill 2"];

var offhandSetup = "";		// temporary variable
var tempSetup = 0;			// temporary variable
var mercenary = {name:"",level:1,base_aura:"",base_aura_level:1};
var offhandType = "none";
var lastCharm = "";			// last charm on mouse-over
var lastSocketable = "";	// last gem/rune/jewel on mouse-over
var lastSelected = "";
var settings = {coupling:1, autocast:1, parameters:0}
var monsterID = 2;
var MAX = 20;				// Highest Skill Hardpoints
var LIMIT = 60;				// Highest Skill Data
var RES_CAP = 95;
var game_version = 2;
var loaded = 0;

var socketed = {	// Gems/Runes/Jewels Socketed in Equipment
	helm:{sockets:0, socketsFilled:0, totals:{}, items:[{id:"",name:""},{id:"",name:""},{id:"",name:""}]},
	armor:{sockets:0, socketsFilled:0, totals:{}, items:[{id:"",name:""},{id:"",name:""},{id:"",name:""},{id:"",name:""}]},
	weapon:{sockets:0, socketsFilled:0, totals:{}, items:[{id:"",name:""},{id:"",name:""},{id:"",name:""},{id:"",name:""},{id:"",name:""},{id:"",name:""}]},
	offhand:{sockets:0, socketsFilled:0, totals:{}, items:[{id:"",name:""},{id:"",name:""},{id:"",name:""},{id:"",name:""},{id:"",name:""},{id:"",name:""}]},
};

var inv = [		// Charm Inventory
{onpickup:"?",pickup_x:0,pickup_y:0,empty:1,charms:[],in:["",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
{x:1,y:1,empty:1,load:"",id:"h11"},{x:1,y:1,empty:1,load:"",id:"h21"},{x:1,y:1,empty:1,load:"",id:"h31"},{x:1,y:1,empty:1,load:"",id:"h41"},{x:1,y:1,empty:1,load:"",id:"h51"},{x:1,y:1,empty:1,load:"",id:"h61"},{x:1,y:1,empty:1,load:"",id:"h71"},{x:1,y:1,empty:1,load:"",id:"h81"},{x:1,y:1,empty:1,load:"",id:"h91"},{x:1,y:1,empty:1,load:"",id:"h01"},
{x:1,y:1,empty:1,load:"",id:"h12"},{x:1,y:1,empty:1,load:"",id:"h22"},{x:1,y:1,empty:1,load:"",id:"h32"},{x:1,y:1,empty:1,load:"",id:"h42"},{x:1,y:1,empty:1,load:"",id:"h52"},{x:1,y:1,empty:1,load:"",id:"h62"},{x:1,y:1,empty:1,load:"",id:"h72"},{x:1,y:1,empty:1,load:"",id:"h82"},{x:1,y:1,empty:1,load:"",id:"h92"},{x:1,y:1,empty:1,load:"",id:"h02"},
{x:1,y:1,empty:1,load:"",id:"h13"},{x:1,y:1,empty:1,load:"",id:"h23"},{x:1,y:1,empty:1,load:"",id:"h33"},{x:1,y:1,empty:1,load:"",id:"h43"},{x:1,y:1,empty:1,load:"",id:"h53"},{x:1,y:1,empty:1,load:"",id:"h63"},{x:1,y:1,empty:1,load:"",id:"h73"},{x:1,y:1,empty:1,load:"",id:"h83"},{x:1,y:1,empty:1,load:"",id:"h93"},{x:1,y:1,empty:1,load:"",id:"h03"},
{x:1,y:1,empty:1,load:"",id:"h14"},{x:1,y:1,empty:1,load:"",id:"h24"},{x:1,y:1,empty:1,load:"",id:"h34"},{x:1,y:1,empty:1,load:"",id:"h44"},{x:1,y:1,empty:1,load:"",id:"h54"},{x:1,y:1,empty:1,load:"",id:"h64"},{x:1,y:1,empty:1,load:"",id:"h74"},{x:1,y:1,empty:1,load:"",id:"h84"},{x:1,y:1,empty:1,load:"",id:"h94"},{x:1,y:1,empty:1,load:"",id:"h04"}
];

var colors = {
	White:"#dddddd",
	Gray:"#707070",
	Blue:"#6666bb",	
	Yellow:"#cccc77",
	Gold:"#9b885e",
	Green:"#00f000",
	DarkGreen:"#255d16",
	Tan:"#9b8c6d",
	Black:"Black",
	Orange:"#c48736",
	Purple:"#9b2aea",
	Red:"#cc6666",
	Indigo:"#9980ff"
};

var equipped = { helm:{name:"none",tier:0}, armor:{name:"none",tier:0}, gloves:{name:"none",tier:0}, boots:{name:"none",tier:0}, belt:{name:"none",tier:0}, amulet:{name:"none",tier:0}, ring1:{name:"none",tier:0}, ring2:{name:"none",tier:0}, weapon:{name:"none",tier:0,twoHanded:0,type:""}, offhand:{name:"none",tier:0,type:""}, charms:{name:"none"} };
var mercEquipped = { helm:{name:"none"}, armor:{name:"none"}, weapon:{name:"none"}, offhand:{name:"none"} };
var corruptsEquipped = { helm:{name:"none"}, armor:{name:"none"}, gloves:{name:"none"}, boots:{name:"none"}, belt:{name:"none"}, amulet:{name:"none"}, ring1:{name:"none"}, ring2:{name:"none"}, weapon:{name:"none"}, offhand:{name:"none"} };
var golemItem = {name:"none"};

var oskills = ["oskill_Warp","oskill_Ball_Lightning","oskill_Inner_Sight","oskill_Lethal_Strike","oskill_Valkyrie","oskill_Magic_Arrow","oskill_Guided_Arrow","oskill_Multiple_Shot","oskill_Battle_Command","oskill_Battle_Orders","oskill_Battle_Cry","oskill_Bash","oskill_Edged_Weapon_Mastery","oskill_Lycanthropy","oskill_Werebear","oskill_Werewolf","oskill_Feral_Rage","oskill_Flame_Dash","oskill_Summon_Dire_Wolf","oskill_Armageddon","oskill_Desecrate","oskill_Zeal","oskill_Vengeance","oskill_Frigerate","oskill_Shiver_Armor","oskill_Blizzard","oskill_Cold_Mastery","oskill_Hydra","oskill_Fire_Ball","oskill_Fire_Wall","oskill_Meteor","oskill_Fire_Mastery","oskill_Whirlwind","oskill_Heart_of_Wolverine","oskill_Immolation_Arrow","oskill_Dashing_Strike","oskill_Dangoon_Discharge_Proc","oskill_DangoonChain_Proc","oskill_DestructionVolcano_Proc","oskill_DestructionMBoulder_Proc","oskill_DestructionNova_Proc","oskill_CTC_Discharge_Proc","oskill_CTC_Chain_Light_Proc","oskill_CTC_Volcano_Proc","oskill_CTC_MBoulder_Proc","oskill_CTC_Nova_Proc","oskill_Whirling_Axes","oskill_CTC_Fissure_Proc","oskill_CTC_Fissure_Proc","oskill_CTC_Bone_Spear_Proc","oskill_CTC_Poison_Nova_Proc","oskill_Evade","oskill_CTC_Ball_Lightning_Proc","oskill_Warmth","oskill_Deadly_Poison","oskill_Charge","oskill_Telekinesis","oskill_Strafe","oskill_Revive","oskill_Cleave"];
var oskills_info = {
	oskill_Warp:{name:"Warp",native_class:"none",i:0}, oskill_Ball_Lightning:{name:"Ball Lightning",native_class:"none",i:1}, oskill_Dangoon_Discharge_Proc:{name:"Dangoon Discharge Proc",native_class:"none",i:1}, oskill_DangoonChain_Proc:{name:"DangoonChain Proc",native_class:"none",i:1}, oskill_DestructionVolcano_Proc:{name:"DestructionVolcano Proc",native_class:"none",i:1}, oskill_DestructionMBoulder_Proc:{name:"DestructionMBoulder Proc",native_class:"none",i:1}, oskill_DestructionNova_Proc:{name:"DestructionNova Proc",native_class:"none",i:1}, oskill_CTC_Discharge_Proc:{name:"CTC Discharge Proc",native_class:"none",i:1}, oskill_CTC_Chain_Light_Proc:{name:"CTC Chain Light Proc",native_class:"none",i:1}, oskill_CTC_Volcano_Proc:{name:"CTC Volcano Proc",native_class:"none",i:1}, oskill_CTC_MBoulder_Proc:{name:"CTC MBoulder Proc",native_class:"none",i:1}, oskill_CTC_Nova_Proc:{name:"CTC Nova Proc",native_class:"none",i:1}, oskill_CTC_Fissure_Proc:{name:"CTC Fissure Proc",native_class:"none",i:1}, oskill_CTC_Bone_Spear_Proc:{name:"CTC Bone Spear Proc",native_class:"none",i:1}, oskill_CTC_Poison_Nova_Proc:{name:"CTC Poison Nova Proc",native_class:"none",i:1}, oskill_CTC_Ball_Lightning_Proc:{name:"CTC Ball Lightning Proc",native_class:"none",i:1},
	oskill_Inner_Sight:{name:"Inner Sight",native_class:"amazon",i:10}, oskill_Lethal_Strike:{name:"Lethal Strike",native_class:"amazon",i:11}, oskill_Valkyrie:{name:"Valkyrie",native_class:"amazon",i:18}, oskill_Magic_Arrow:{name:"Magic Arrow",native_class:"amazon",i:21}, oskill_Guided_Arrow:{name:"Guided Arrow",native_class:"amazon",i:25}, oskill_Multiple_Shot:{name:"Multiple Shot",native_class:"amazon",i:22}, oskill_Immolation_Arrow:{name:"Immolation Arrow",native_class:"amazon",i:28}, oskill_Evade:{name:"Evade",native_class:"amazon",i:16}, oskill_Strafe:{name:"Strafe",native_class:"amazon",i:27},
	oskill_Battle_Command:{name:"Battle Command",native_class:"barbarian",i:9}, oskill_Battle_Orders:{name:"Battle Orders",native_class:"barbarian",i:6}, oskill_Battle_Cry:{name:"Battle Cry",native_class:"barbarian",i:5}, oskill_Bash:{name:"Bash",native_class:"barbarian",i:24}, oskill_Edged_Weapon_Mastery:{name:"Edged Weapon Mastery",native_class:"barbarian",i:10}, oskill_Whirling_Axes:{name:"Whirling Axes",native_class:"barbarian",i:19}, oskill_Cleave:{name:"Cleave",native_class:"barbarian",i:24},
	oskill_Lycanthropy:{name:"Lycanthropy",native_class:"druid",i:12}, oskill_Werebear:{name:"Werebear",native_class:"druid",i:13}, oskill_Werewolf:{name:"Werewolf",native_class:"druid",i:11}, oskill_Feral_Rage:{name:"Feral Rage",native_class:"druid",i:14}, oskill_Flame_Dash:{name:"Flame Dash",native_class:"druid",i:2}, oskill_Summon_Dire_Wolf:{name:"Summon Dire Wolf",native_class:"druid",i:27}, oskill_Armageddon:{name:"Armageddon",native_class:"druid",i:9}, 
	oskill_Desecrate:{name:"Desecrate",native_class:"necromancer",i:15}, oskill_Deadly_Poison:{name:"Deadly Poison",native_class:"necromancer",i:11}, oskill_Revive:{name:"Revive",native_class:"necromancer",i:10}, 
	oskill_Zeal:{name:"Zeal",native_class:"paladin",i:23}, oskill_Vengeance:{name:"Vengeance",native_class:"paladin",i:25}, oskill_Dashing_Strike:{name:"Dashing Strike",native_class:"paladin",i:30}, oskill_Charge:{name:"Charge",native_class:"paladin",i:24},
	oskill_Frigerate:{name:"Frigerate",native_class:"sorceress",i:1}, oskill_Shiver_Armor:{name:"Shiver Armor",native_class:"sorceress",i:4}, oskill_Blizzard:{name:"Blizzard",native_class:"sorceress",i:6}, oskill_Cold_Mastery:{name:"Cold Mastery",native_class:"sorceress",i:10}, oskill_Hydra:{name:"Hydra",native_class:"sorceress",i:31}, oskill_Warmth:{name:"Warmth",native_class:"sorceress",i:23}, oskill_Fire_Ball:{name:"Fire Ball",native_class:"sorceress",i:26}, oskill_Fire_Wall:{name:"Fire Wall",native_class:"sorceress",i:27}, oskill_Meteor:{name:"Meteor",native_class:"sorceress",i:29}, oskill_Fire_Mastery:{name:"Fire Mastery",native_class:"sorceress",i:30}, oskill_Telekinesis:{name:"Telekinesis",native_class:"sorceress",i:13},
	oskill_Whirlwind:{name:"Whirlwind",native_class:"barbarian",i:27}, 
	oskill_Heart_of_Wolverine:{name:"Heart of Wolverine",native_class:"druid",i:23}, 
};

//var procs = ["proc_Dangoon_Discharge"]
//var procs_info = {
//	proc_Dangoon_Discharge:{name:"Discharge",native_class:"sorceress",i:18},
//};

var effect_cskills = {Inner_Sight:{native_class:"amazon",i:10}, Phase_Run:{native_class:"amazon",i:12}, Cloak_of_Shadows:{native_class:"assassin",i:14}, Venom:{native_class:"assassin",i:18}, Cyclone_Armor:{native_class:"druid",i:5}, Heart_of_Wolverine:{native_class:"druid",i:23}, Oak_Sage:{native_class:"druid",i:26}, Spirit_of_Barbs:{native_class:"druid",i:29}, Blood_Golem:{native_class:"necromancer",i:6}, Iron_Golem:{native_class:"necromancer",i:8}, Deadly_Poison:{native_class:"necromancer",i:11}, Enflame:{native_class:"sorceress",i:28}, Warmth:{native_class:"sorceress",i:23}};
var effect_ctcskills = {Venom:{native_class:"assassin",i:18}, Fade:{native_class:"assassin",i:15}, Firestorm:{native_class:"druid",i:0}, Molten_Boulder:{native_class:"druid",i:1}, Fissure:{native_class:"druid",i:4}, Cyclone_Armor:{native_class:"druid",i:5}, Volcano:{native_class:"druid",i:7}, Armageddon:{native_class:"druid",i:9},Hurricane:{native_class:"druid",i:10}, Flesh_Offering:{native_class:"necromancer",i:4}, Poison_Nova:{native_class:"necromancer",i:19}, Blizzard:{native_class:"sorceress",i:6}, Chilling_Armor:{native_class:"sorceress",i:8}, Frozen_Orb:{native_class:"sorceress",i:9}, Nova:{native_class:"sorceress",i:14}, Chain_Lightning:{native_class:"sorceress",i:16}, Discharge:{native_class:"sorceress",i:18}, Blaze:{native_class:"sorceress",i:24}, Fire_Ball:{native_class:"sorceress",i:26}, Enflame:{native_class:"sorceress",i:28}, Meteor:{native_class:"sorceress",i:29}, Hydra:{native_class:"sorceress",i:31}, Ice_Arrow:{name:"Ice Arrow",native_class:"amazon",i:24}, Molten_Strike:{name:"Molten Strike",native_class:"amazon",i:7}, Glacial_Spike:{name:"Glacial Spike",native_class:"sorceress",i:5}, Static_Field:{name:"Static Field",native_class:"sorceress",i:12}, War_Cry:{name:"War Cry",native_class:"barbarian",i:8}};

var non_items = [
{name:"Miscellaneous"},
{i:1, name:"Shrine: Skill", all_skills:2, duration:96, recharge:240, effect:"Skill"},
{i:2, name:"Shrine: Combat", damage_bonus:200, ar_shrine_bonus:200, duration:96, recharge:240, effect:"Combat"},	// AR bonus can stack with other Combat shrines (unimplemented)
{i:3, name:"Shrine: Armor", defense_bonus:100, duration:96, recharge:240, effect:"Armor"},
{i:4, name:"Shrine: Mana Regeneration", mana_regen:400, duration:96, recharge:240, effect:"Mana_Regeneration"},
{i:5, name:"Shrine: Fire Resist", fRes:75, duration:144, recharge:240, effect:"Resist_Fire"},
{i:6, name:"Shrine: Cold Resist", cRes:75, duration:144, recharge:240, effect:"Resist_Cold"},
{i:7, name:"Shrine: Lightning Resist", lRes:75, duration:144, recharge:240, effect:"Resist_Lightning"},
{i:8, name:"Shrine: Poison Resist", pRes:75, duration:144, recharge:240, effect:"Resist_Poison"},
{i:9, name:"Potion: Thawing", cRes:50, duration:30, effect:"Thawing"},												// stackable duration (unimplemented)
{i:10, name:"Potion: Antitode", pRes:50, duration:30, effect:"Antidote"},											// stackable duration (unimplemented)
];

var mercenaries = [
{name:"Mercenary"},
{i:1, name:"Rogue Scout ­ ­ ­ ­ ­ (Inner Sight)", aura:"Inner Sight"},
{i:2, name:"Desert Guard ­ ­ ­ ­ (Blessed Aim)", aura:"Blessed Aim"},
{i:3, name:"Desert Guard ­ ­ ­ ­ (Defiance)", aura:"Defiance"},
{i:4, name:"Desert Guard ­ ­ ­ ­ (Prayer)", aura:"Prayer"},
{i:5, name:"Iron Wolf ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ (Meditation)", aura:"Meditation"},
{i:6, name:"Iron Wolf ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ (Cleansing)", aura:"Cleansing"},
{i:7, name:"Iron Wolf ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ (Precision)", aura:"Precision"},
{i:8, name:"Barbarian ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ (Might)", aura:"Might"},
];

var auras_extra = [
	{name:"Thorns", values:[["thorns",250,290,330,370,410,450,490,530,570,610,650,690,730,770,810,850,890,930,970,1010,1050,1090,1130,1170,1210,1250,1290,1330,1370,1410,1450,1490,1530,1570,1610,1650,1690,1730,1770,1810,1850,1890,1930,1970,2010,2050,2090,2130,2170,2210,2250,2290,2330,2370,2410,2450,2490,2530]]},
	{name:"Inner Sight", values:[]},	// automatically copied from amazon.js
	{name:"Righteous Fire", values:[["percent of life as fire damage",45]]},
	{name:"Lifted Spirit", values:[["damage multiplier",10]]},
];
