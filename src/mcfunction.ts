export default function(hljs: any) {
  return {
    name: 'mcfunction',
    keywords: {
      keyword:
        'advancement attribute ban ban-ip banlist bossbar clear clone data datapack debug defaultgamemode deop difficulty effect enchant execute experience fill forceload function gamemode gamerule give help kick kill list locate locatebiome loot me msg op pardon pardon-ip particle playsound publish recipe reload replaceitem save-all save-off save-on say schedule scoreboard seed setblock setidletimeout setworldspawn spawnpoint spectate spreadplayers stop stopsound summon tag team teammsg teleport tell tellraw time title tm tp trigger w weather whitelist worldborder xp',
      number: 'true false'
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'number', begin: '(\\-?\\d*\\.?\\d+)?(\\.\\.)(\\-?\\d*\\.?\\d+)?'
      },
      {
        className: 'number', begin: '(\\-?\\d*\\.?\\d+)'
      },
      {
        className: 'meta', begin: '@[parse]'
      },
      {
        begin: '[{,]\\s*(?=\\s*[A-Za-z0-9_]*\\s*:)',
        relevance: 0,
        contains: [
          {
            className: 'attr',
            begin: '[A-Za-z0-9_]*(?=\\s*:)',
            relevance: 0
          }
        ]
      },
      {
        begin: '[[,]\\s*(?=\\s*[a-z_]*\\s*=)',
        relevance: 0,
        contains: [
          {
            className: 'attr',
            begin: '[a-z_]*(?=\\s*=)',
            relevance: 0
          }
        ]
      },
      {
        className: 'string',
        begin: /<[a-z ]+>/,
      }
    ]
  }
}
