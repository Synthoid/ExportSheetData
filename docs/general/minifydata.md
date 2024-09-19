Minify Data
-----------
Removes human readability formatting from exported data to produce a smaller file. The data is exactly the same, just without indentation and formatting used to make it more easily readable by humans.

This is usually a good option to enable when exporting data that will only be read by parsers, not people.

### Example: ###

**Sheet name: `Pokemon`**

Name | Type1 | Type2 | Move1 | Move2 | Move3 | Move4
---- | ----- | ----- | ----- | ----- | ----- | -----
Bulbasaur | Grass | | Tackle | Growl | Leech Seed | Vine Whip
Ivysaur | Grass | Poison | Leech Seed | Vine Whip | Sleep Powder | Take Down
Venusaur | Grass | Poison | Leech Seed | Razor Leaf | Synthesis | Solar Beam

*Default Outputs:*

JSON:
```json
{
  "Pokemon": [
    {
      "Name": "Bulbasaur",
      "Type1": "Grass",
      "Move1": "Tackle",
      "Move2": "Growl",
      "Move3": "Leech Seed",
      "Move4": "Vine Whip"
    },
    {
      "Name": "Ivysaur",
      "Type1": "Grass",
      "Type2": "Poison",
      "Move1": "Leech Seed",
      "Move2": "Vine Whip",
      "Move3": "Sleep Powder",
      "Move4": "Take Down"
    },
    {
      "Name": "Venusaur",
      "Type1": "Grass",
      "Type2": "Poison",
      "Move1": "Leech Seed",
      "Move2": "Razor Leaf",
      "Move3": "Synthesis",
      "Move4": "Solar Beam"
    }
  ]
}
```

XML:
```xml
<data>
  <Pokemon>
    <Bulbasaur>
      <Name>Bulbasaur</Name>
      <Type1>Grass</Type1>
      <Move1>Tackle</Move1>
      <Move2>Growl</Move2>
      <Move3>Leech Seed</Move3>
      <Move4>Vine Whip</Move4>
    </Bulbasaur>
    <Ivysaur>
      <Name>Ivysaur</Name>
      <Type1>Grass</Type1>
      <Type2>Poison</Type2>
      <Move1>Leech Seed</Move1>
      <Move2>Vine Whip</Move2>
      <Move3>Sleep Powder</Move3>
      <Move4>Take Down</Move4>
    </Ivysaur>
    <Venusaur>
      <Name>Venusaur</Name>
      <Type1>Grass</Type1>
      <Type2>Poison</Type2>
      <Move1>Leech Seed</Move1>
      <Move2>Razor Leaf</Move2>
      <Move3>Synthesis</Move3>
      <Move4>Solar Beam</Move4>
    </Venusaur>
  </Pokemon>
</data>
```

*Minify Outputs:*

JSON:
```json
{"Pokemon":[{"Name":"Bulbasaur","Type1":"Grass","Move1":"Tackle","Move2":"Growl","Move3":"Leech Seed","Move4":"Vine Whip"},{"Name":"Ivysaur","Type1":"Grass","Type2":"Poison","Move1":"Leech Seed","Move2":"Vine Whip","Move3":"Sleep Powder","Move4":"Take Down"},{"Name":"Venusaur","Type1":"Grass","Type2":"Poison","Move1":"Leech Seed","Move2":"Razor Leaf","Move3":"Synthesis","Move4":"Solar Beam"}]}
```

XML:
```xml
<data><Pokemon><Bulbasaur><Name>Bulbasaur</Name><Type1>Grass</Type1><Move1>Tackle</Move1><Move2>Growl</Move2><Move3>Leech Seed</Move3><Move4>Vine Whip</Move4></Bulbasaur><Ivysaur><Name>Ivysaur</Name><Type1>Grass</Type1><Type2>Poison</Type2><Move1>Leech Seed</Move1><Move2>Vine Whip</Move2><Move3>Sleep Powder</Move3><Move4>Take Down</Move4></Ivysaur><Venusaur><Name>Venusaur</Name><Type1>Grass</Type1><Type2>Poison</Type2><Move1>Leech Seed</Move1><Move2>Razor Leaf</Move2><Move3>Synthesis</Move3><Move4>Solar Beam</Move4></Venusaur></Pokemon></data>
```

### File Sizes ###

Minifying can reduce your exported data's file size exponentially as your sheet gets larger. If we compare the exported files for the following data:

Name | Type1 | Type2 | Move1 | Move2 | Move3 | Move4
---- | ----- | ----- | ----- | ----- | ----- | -----
Bulbasaur | Grass | | Tackle | Growl | Leech Seed | Vine Whip
Ivysaur | Grass | Poison | Leech Seed | Vine Whip | Sleep Powder | Take Down
Venusaur | Grass | Poison | Leech Seed | Razor Leaf | Synthesis | Solar Beam
Charmander | Fire | | Growl | Scratch | Ember | Smokescreen
Charmeleon | Fire | | Scratch | Ember | Dragon Rage | Fire Fang
Charizard | Fire | Flying | Flamethrower | Fly | Dragon Claw | Slash
Squirtle | Water | | Tackle | Tail Whip | Water Gun | Withdraw
Wartortle | Water | | Bubble | Bite | Water Pulse | Rapid Spin
Blastoise | Water | | Surf | Bite | Hydro Pump | Ice Beam
Caterpie | Bug | | String Shot | Tackle | Bug Bite | 
Metapod | Bug | | Harden | | | 		
Butterfree | Bug | Flying | Psybeam | Sleep Powder | Bug Buzz | Air Slash
Weedle | Bug | Poison | Poison Sting | String Shot | Bug Bite	
Kakuna | Bug | Poison | Harden | | | 		
Beedrill | Bug | Poison | Pin Missile | Venoshock | Poison Jab | Fell Stinger
Pidgey | Normal | Flying | Tackle | Sand Attack | Gust | Quick Attack
Pideotto | Normal | Flying | Gust | Quick Attack | Whirlwind | Twister
Pidgeot | Normal | Flying | Wing Attack | Roost | Fly | Air Slash
Rattata | Normal | | Tackle | Tail Whip | Bite | Quick Attack
Raticate | Normal | | Crunch | Hyper fang | Super Fang | Double-Edge
Spearow | Normal | Flying | Growl | Peck | Leer | Pursuit
Fearow | Normal | Flying | Fury Attack | Aerial Ace | Mirror Move | Drill Peck
Ekans | Poison | | Leer | Wrap | Poison Sting | Bite
Arbok | Poison | | Glare | Coil | Bite | Acid
Pikachu | Electric | | Thunderbolt | Electo Ball | Surf | Quick Attack
Raichu | Electric | | Thunderbolt | Thunder Wave | Mega Punch | Light Screen
Sandshrew | Ground | | Defense Curl | Scratch | Sand Attack | Poison Sting
Sandslash | Ground | | Rollout | Magnitude | Swift | Slash
Nidoran♀ | Poison | | Growl | Scratch | Tail Whip | Double Kick
Nidorina | Poison | | Bite | Toxic Spikes | Double Kick | Poison Sting
Nidoqueen | Poison | Ground | Crunch | Toxic Spikes | Poison Fang | Earthquake
Nidoran♂ | Poison | | Leer | Peck | Focus Energy | Double Kick
Nidorino | Poison | | Horn Attack | Poison Sting | Double Kick | Peck
Nidoking | Poison | Ground | Horn Drill | Earthquake | Poison Jab | Horn Attack

We get the following file sizes:

Format | Default | Minified
------ | ------- | --------
JSON | 6 KB | 4 KB
XML | 7 KB | 5 KB

A file with just 34 rows is about 2 KB smaller after minifiying. Imagine 151 rows, or 251, or 1025!
