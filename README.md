## Planner for Character Builds in Path of Diablo

### Features:
* up to date with current patch 21 Shungite
* all skill info up to level 60 & synergy calculations
* charm inventory, includes theory-crafting charms to emulate functions like high level BO or support sorc with enflame, etc.
  
![image](https://github.com/user-attachments/assets/17cd8140-a386-4d26-baeb-70bc640ce60a)

* saving/loading, URL-sharing
* equipment selection & modification (corrupting, socketing, upgrading)
* skill damage calculation
* breakdown of basic damage sources
  
![image](https://github.com/user-attachments/assets/af88094a-958d-4793-83a0-d64fe5dff44d)

* all character stats
* mercenary selection
* snapshotting for buffs
* important breakpoints, including a direct pre-filled link to mmmpld's ias calculator
  
![image](https://github.com/user-attachments/assets/4cadde05-de50-4df4-89cb-75e90df870b3)


### Controls:
* Click on the character's level or class to change them
* Use right click to remove points or items
* Shift and ctrl modify the amount added or removed (also works on items in the charm inventory)
* Corruptions may be selected via the narrow dropdowns to the left of each item dropdown
  
![image](https://github.com/user-attachments/assets/b55d8e28-4ab5-4172-af0c-bb173a222e7c)

* Upgrading can be done by ctrl-clicking the equipped item (ctrl + right-click to downgrade)
* Snapshot effects by ctrl-clicking the effect's icon
* Add jewels/runes/gems to items by dragging them from the inventory to an equipment slot that has open sockets

#### Mobile Users:
If your phone doesn't have a way to emulate ctrl+click or shift+click, you can still use the URL to enter any character info. Toggle *Shareable URL* in the menu to see how it should be formatted. Example:

https://build.pathofdiablo.com/?v=2&class=sorceress&level=99&quests=1&strength=45&vitality=460

### Known Issues:
* ~~Some spells that deal magic damage (ex: FoH, Bone Spear) are not affected by magic facets or charms; attacks (like Dashing Strike) do display properly~~ This was fixed, please report if you see otherwise.
* Displayed damage is incorrect for skills that care about on vs off weapon ED, added minus ED
charms to compensate
* ~~Barb combat skills remain "red" even when prerequisites are met~~ This has been fixed, barb combat tree rewritten to properly apply prerequisites. Please report if you see otherwise.
* ~~"+1 (each) skills" charm isn't applied to some skills~~
* Charms can't be moved into a new space below the original space if those spaces overlap
* Shift + Right Click in Firefox doesn't work (and still opens the default menu)
* Socketed gems/runes/jewels sometimes aren't aligned like they should be
* Snapshotted skills may not load correctly with saved files or shared URLs
* DoT (Damage over Time) stats are added without considering their time component
* Dual-Wielding damage may be incorrect (some on-weapon damage affixes affect both weapons)
* Minion damage may be incorrect (some bonuses from auras/items aren't included)

### Notes:
* Chance to Hit (displayed after Attack Rating) is an approximation for typical enemies at the character's level - it won't be accurate for bosses or monsters at much higher/lower levels
* Effective Magic Find (displayed after Magic Find) shows how much is applied to uniques

### Future Ideas:
* party tracking (i.e. buffs from party members)
    * Some party buff effects available via "charms" 
* Add calculated damage values for CtC (chance to cast) skills in a consistent manner
* Show damage breakdown instead of just the total damage 
* mercenary stats
* total calculated damage for minions
* IAS breakpoint info (frames per attack) for skills which don't use normal breakpoints
* breakdown of attack damage by type
* skill effectiveness (dps, area affected, movement capability)
* full GUI inventory/stash
* custom item creation & affix editing
* custom item-pool saving
* options for individual quests
* option for strict character validation (prevent invalid character states instead of just making text red)
* character importing
* monster stat calculations
* debuff tracking
* pvp info
* dynamic item/skill recommendations

### Contribute:

#### Updating Incorrect/Outdated Skill Data:

This planner is open-source, so improvements can be contributed by anyone through github. Here are the basic steps:
* Create a [fork](https://github.com/GreenDude120/path-of-diablo-planner/fork) (duplicate) of this repository
* Edit the files
* Submit a pull request (i.e. request your changes be pulled into this version)

### Getting started with Planner editing
Quick tour of the files within thie project: https://youtu.be/0GXcUw0btrA
#### Files and folders
Folders in the project include data, images, and saves. 
* Saves contains old save files, likely of little or no use
* Images contains pictures used in the panner web page, from weapons and armor to skill trees and icons. If a skill or skill tree changes, pictures in here would need to be updated.
* Data folder contains the most interesting/relevant files in regards to editing the planner:
    * basic_variables: includes some basic variables like font colors, list of oskills, charge skills & CTC skills, and some shrine mercenary and aura info
    * functions: the meat of the program, this is the brains of the planner
    * item_metadata: rune makeup of runewords, all base items in the game and their stats, includes details about, and formats appearance of, all stats/modifiers/properties you see in the planner. If you see text on an item, that text you see is formatted in this file.
    * items: includes default stat values, lists all skills, lists all items available in the planners drop down menu's, the sockets and corruptions available, charms, and socketables. If an item changes in any way, this is likely where the change would be made.
    * the skills subfolder, which includes a file for every classes skills and a file for "universal" skills, think ball lightning or any skill that's an oskill or universally available. If a skill were to get changed, this is where those changes would happen.
        * class js files include
            * starting class data, like attributes and breakpoints
            * skills with their narrative descriptions, prereqs, synergies, and other data
            * several equations/formulas to calculate buff values like frw or added defense or other non-damage data, and direct skill damage that includes synergy and other bonuses
            * comma separated lists of numbers for each skill. These lists represent things like min or max damage, radius, and mana cost, same as you'r see in the wiki's damage tables.
* Files used less or not at all, or files that won't need regular changes include:
    * index.html: only really needed if adding elements to the web page itself, not for content in the planner
    * license file
    * cname: should not be changed
    * to-do list: this can probably get deleted unless folks decide to actually use it as a to-do list
    * style.css
    * monsters.js: it's unused
    * all the spreadsheets and vanilla skill files: these are not used

#### Sample item changes
* If an item or runeword had a change from 30 IAS to 45 IAS, we'd find that item(or items) in the items file, and change it's property ias:30 to ias:45
* If the corruptions available to an item change, the new corruptions would have to replace the old curruptions in item.js

To add a new runeword:
* Define the runeword and the runes that make it in item_metadata
* Create the new runeword in items.js, using an existing similar runeword as a template or example is the easiest way
    * In the approriate section (ie, stay organized and don't add helmets in the middle of the weapons list) add the runeword by name, and add all of the properties it has with the appropriate values of those properties. If the property is a range, such as "10-15 fire resistance, the standard has been to add the highest value, so fres:15 for this example. (This assumes the property in question already exists, if that's not the case then the proprty will need to be defined in item_metadata before it can be assigned to an item. See Warlords Trust for an example. In this example "fres", or fire resistance, as a property is already defined in the item_metadata file.)
* Runewords can be added using any appropriate base you'd like, base items are defined in item_metadata

Adding a few runewords: https://youtu.be/_WvS_m0Co2A 

Adding Whirling Axes changes for Warlords Trust: https://youtu.be/f8X2HfnS6Lc 

#### Sample Skill changes
* If a skill is changed, fine the skill in the appropriate file (changes to freezing pulse would be made in the sorceress.js file for example) and make changes there. 

### Credits:

Originally created by BetweenWalls, the planner was forked to allow the PoD team & community to edit and update the planner in a timely fashion and without depending on a single user.
