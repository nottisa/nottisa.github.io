/// <reference path="../../lib/react.d.ts" />

/// <reference path="../../data/levelupmodifiers.ts" />

/// <reference path="../eventmanager.ts" />
/// <reference path="../utility.ts" />

/// <reference path="draggable.ts" />
/// <reference path="splitmultilinetext.ts" />
/// <reference path="modifierlist.ts" />
/// <reference path="statlist.ts" />
/// <reference path="employeelist.ts" />

/// <reference path="list.ts" />

module CityGame
{
  
  export module UIComponents
  {
  
    export var Stats = React.createClass({
      mixins: [SplitMultilineText],
  
      toggleSelf: function()
      {
        eventManager.dispatchEvent({type:"toggleFullScreenPopup", content:null});
      },
  
      render: function()
      {
        var player = this.props.player;
        var allStats = [];
  
        var clicks = player.clicks;
  
        var generalStats =
        [
          {
            title: "Money:",
            content: "$" + beautify(player.money)
          },
          {
            title: "Clicks:",
            content: player.clicks
          },
          {
            title: "Money from clicks:",
            content: "$" + (player.incomePerType.click ? beautify(player.incomePerType.click) : 0)
          },
          {
            title: "Owned plots:",
            content: player.ownedCellsAmount
          },
          {
            title: "Owned buildings:",
            content: (function(player)
            {
              var amount = 0;
              for (var category in player.ownedContent)
              {
                amount += player.ownedContent[category].length;
              }
              return amount;
            }(player))
          }
        ];
        var generalStatList = UIComponents.StatList(
        {
          stats: generalStats,
          header: "General",
          key: "generalStatList"
        });
  
        allStats.push(generalStatList);
  
        var prestigeModifier = 1 + player.prestige * 0.005
        if (player.LevelUpModifiers.prestigeEffectIncrease1)
        {
          prestigeModifier *= (1 + player.prestige * 0.0025);
        }
        var prestigeStats =
        [
          {
            title: "Times reset:",
            content: player.timesReset
          },
          {
            title: "Prestige:",
            content: player.prestige.toFixed(),
            subContent: "for a total of " + ((prestigeModifier -1)*100).toFixed(1) + "% " +
              "extra profit"
          },
          {
            title: "Current experience:",
            content: beautify(player.experience)
          },
          {
            title: "Total experience:",
            content: beautify(player.totalResetExperience + player.experience)
          }
        ];
        var prestigeStatList = UIComponents.StatList(
        {
          stats: prestigeStats,
          header: "Prestige",
          key: "prestigeStatList"
        });
  
        allStats.push(prestigeStatList);
  
        if (player.permanentLevelupUpgrades.length > 0)
        {
          var permModifiers = [];
          for (var i = 0; i < player.permanentLevelupUpgrades.length; i++)
          {
            permModifiers.push(LevelUpModifiers[player.permanentLevelupUpgrades[i]]);
          }
          var permModifierList = UIComponents.ModifierList(
          {
            ref: "permModifierList",
            modifiers: permModifiers,
            excludeCost: true
          });
  
          allStats.push(
            React.DOM.div({className: "stat-group", key:"permModifierList"},
              React.DOM.div({className: "stat-header"}, "Permanent perks"),
              permModifierList
            )
          );
        }
  
        if (Object.keys(player.LevelUpModifiers).length > 0)
        {
          var perks = [];
          for (var _mod in player.LevelUpModifiers)
          {
            if (player.permanentLevelupUpgrades.indexOf(_mod) > -1) continue;
            else perks.push(player.LevelUpModifiers[_mod]);
          }
          var perkList = UIComponents.ModifierList(
          {
            ref: "perkList",
            modifiers: perks,
            excludeCost: true
          });
  
          allStats.push(
            React.DOM.div({className: "stat-group", key:"perkList"},
              React.DOM.div({className: "stat-header"}, "Unlocked perks"),
              perkList
            )
          );
        }
  
        if (Object.keys(player.modifiers).length > 0)
        {
          var unlocks = [];
          for (var _mod in player.modifiers)
          {
            unlocks.push(player.modifiers[_mod]);
          }
          var unlockList = UIComponents.ModifierList(
          {
            ref: "unlockList",
            modifiers: unlocks,
            excludeCost: true
          });
  
          allStats.push(
            React.DOM.div({className: "stat-group", key:"unlockList"},
              React.DOM.div({className: "stat-header"}, "Upgrades"),
              unlockList
            )
          );
        }
        if (Object.keys(player.employees).length > 0)
        {
          var employeeList = UIComponents.EmployeeList(
          {
            ref: "employeeList",
            employees: player.employees
          });
  
          allStats.push(
            React.DOM.div({className: "stat-group", key:"employeeList"},
              React.DOM.div({className: "stat-header"}, "Employees"),
              employeeList
            )
          );
        }
  
        return(
          React.DOM.div({className: "all-stats"},
            React.DOM.a({id:"close-info", className:"close-popup", href:"#",
              onClick: this.toggleSelf,
              onTouchStart: this.toggleSelf
            },"X"),
            allStats
          )
        );
  
      }
    });
  }
}
