Using `clear` with a `[<maxCount>]` of 0 will return the amount of items a player has, without actually clearing any of them.

This means we can use `execute store` to save that number somewhere and then execute depending on that:

```mcfunction
execute store result score @s diamonds run clear @s diamond 0
execute if score @s diamonds matches 4.. run say I have at least 4 diamonds
```
