/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../eventmanager.ts" />

module CityGame
{
  
  export module UIComponents
  {
  
  export var SideMenuStats = React.createClass(
  {
    getInitialState: function()
    {
      return {
        hasLevelUpUpgrade: false,
        lastModifierCount: 0,
        canPrestige: false
      }
    },
    componentWillReceiveProps: function(newProps: any)
    {
      var newUpgradeCount =
        Object.keys(newProps.player.unlockedLevelUpModifiers).length;
  
      if (newUpgradeCount > 0)
      {
        this.setState({hasLevelUpUpgrade: true});
      }
      else if (newProps.player.level >= 100)
      {
        this.setState({canPrestige: true})
      }
  
      this.setState({lastModifierCount: newUpgradeCount})
    },
    componentDidMount: function()
    {
      var money = this.refs.moneyText.getDOMNode();
      var profit = this.refs.profitText.getDOMNode();
  
      var exp = this.refs.exp.getDOMNode();
  
      var expText = this.refs.expText.getDOMNode();
      var levelText = this.refs.levelText.getDOMNode();
  
      eventManager.addEventListener("updatePlayerMoney", function(event)
      {
        money.innerHTML = event.content.total;
        profit.innerHTML = "$" + event.content.rolling + "/d";
      });
  
      eventManager.addEventListener("updatePlayerExp", function(event)
      {
        var expString = event.content.experience + " / " + event.content.nextLevel;
        var levelString = "Level   " + event.content.level + " ";
  
        exp.value = event.content.percentage;
        expText.innerHTML = expString;
        levelText.innerHTML = levelString;
      });
  
      // forces update, kinda dumb
      this.props.player.addMoney(0);
    },
    handleOpenModifiers: function()
    {
      var self = this;
      var player = this.props.player;
      var lastIndex = Object.keys(player.unlockedLevelUpModifiers).length - 1;
      var lowestLevel = Object.keys(player.unlockedLevelUpModifiers).sort(function(a, b)
        {
          return parseInt(a) < parseInt(b) ? 1 : -1;
        })[lastIndex];
  
      var lowestModifierList = player.unlockedLevelUpModifiers[lowestLevel];
  
      if (!lowestModifierList)
      {
        this.setState(
        {
          hasLevelUpUpgrade: false
        });
  
        return;
      }
  
      eventManager.dispatchEvent({type: "makeModifierPopup",
        content:
        {
          player: player,
          text: ["Select your bonus perk for level " + lowestLevel,
          "You only get to pick one"],
          modifierList: lowestModifierList,
          excludeCost: true,
          okBtnText: "Select",
          onOk: function(selected)
          {
            var success = player.addLevelUpModifier(selected.data.modifier);
            eventManager.dispatchEvent({type: "updateReact", content: ""});
  
            self.setState(
            {
              hasLevelUpUpgrade: false
            });
  
            if (success !== false) return true;
            else return false;
          }
        }
      });
    },
  
    handleOpenPrestige: function()
    {
      if (!this.state.canPrestige)
      {
        return;
      }
      var onResetFN = function()
      {
        this.setState({canPrestige: false});
      }.bind(this);
  
      eventManager.dispatchEvent(
      {
        type: "prestigeReset",
        content: onResetFN
      });
    },
  
    render: function()
    {
      var progressProps: any =
      {
        id:"player-level",
        ref: "exp",
        value:0,
        max:100
      };
      var divProps: any =
      {
        id:"player-level-wrapper"
      };
  
      if (this.state.hasLevelUpUpgrade)
      {
        progressProps.className = "new-modifier";
  
        divProps.onClick = this.handleOpenModifiers;
        divProps.onTouchStart = this.handleOpenModifiers;
        divProps.className = "interactive";
      }
      else if (this.state.canPrestige)
      {
        progressProps.className = "new-modifier";
  
        divProps.onClick = this.handleOpenPrestige;
        divProps.onTouchStart = this.handleOpenPrestige;
        divProps.className = "interactive";
      }
  
      return(
        React.DOM.div( {id:"side-menu-stats"},
          React.DOM.div( divProps,
            React.DOM.progress( progressProps),
  
            React.DOM.div(
            {
              id:"level-string-container"
            },
              React.DOM.div(
              {
                id:"level-string-wrapper",
                className:"stat-string-wrapper"
              },
                React.DOM.span(
                {
                  ref: "levelText"
                }, null),
                React.DOM.span(
                {
                  ref: "expText"
                }, null)
              )
            )
          ),
          React.DOM.div( {id: "money-string-container"},
            React.DOM.div(
            {
              id:"money-string-wrapper",
              className:"stat-string-wrapper"
            },
              React.DOM.span(
              {
                ref: "moneyText"
              }, null),
              React.DOM.span(
              {
                ref: "profitText"
              }, null)
            )
          )
        )
      );
    }
  
  });
  
  }
}
