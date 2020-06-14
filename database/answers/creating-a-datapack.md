Data packs are folders in a world that can be used to add or modify recipes, loot tables, advancements, structures, functions and tags.

### Layout
This is the general layout of a data pack.
```
📁 datapacks
| 📁 <data pack name>
| | 📄 pack.mcmeta (required)
| | 📁data
| | | 📁 minecraft
| | | | 📁 tags
| | | | | 📁 functions
| | | | | | 📄 load.json
| | | | | | 📄 tick.json
| | | 📁 <namespace>
| | | | 📁 advancements
| | | | 📁 functions
| | | | | 📄 hello.mcfunction
| | | | 📁 loot_tables
| | | | 📁 predicates
| | | | 📁 recipes
| | | | 📁 structures
| | | | 📁 tags
| | | | | 📁 blocks
| | | | | 📁 entity_types
| | | | | 📁 fluids
| | | | | 📁 functions
| | | | | 📁 items
```

### Setup
We start by creating a folder `<data pack name>` inside the `datapacks` folder of our world. You can give this any name.

Now we create the `pack.mcmeta` file.
```json
{
  "pack": {
    "pack_format": 5,
    "description": "The description of your data pack"
  }
}
```

When you run `/reload` in game, you can see your data pack has loaded with `/datapack list`.
