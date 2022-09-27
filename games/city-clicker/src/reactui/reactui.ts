/// <reference path="../../lib/react.d.ts" />
/// <reference path="../../lib/pixi.d.ts" />

/// <reference path="../player.ts" />
/// <reference path="../employee.ts" />
/// <reference path="../actions.ts" />

/// <reference path="stage.ts" />

module CityGame
{
  export class ReactUI
  {

    idGenerator: number = 0;
    popups:
    {
      [id: number]:
      {
        type: string;
        props: any;
        zIndex: number;
      }
    } = {};
    notifications: any[] = [];
    topZIndex: number = 15;
    stage: any;
    frameImages: {[id: string]: HTMLImageElement;}
    icons: any = {};

    player: Player;

    updateInterval: any;

    constructor(player: Player, frameImages: {[id: string]: HTMLImageElement;})
    {
      this.player = player;
      this.frameImages = frameImages;
      this.init();
    }
    init()
    {
      React.initializeTouchEvents(true);
      this.addEventListeners();

      this.icons =
      {
        newEmployee: "img/icons/newemployee.png"
      };

      this.updateReact();

      // chrome doesnt work when called via reuqestAnimationFrame
      this.updateInterval = window.setInterval(this.updateReact.bind(this), 1000);
    }
    addEventListeners()
    {
      var self = this;

      eventManager.addEventListener("makeEmployeeActionPopup", function(event)
      {
        self.makeEmployeeActionPopup(event.content)
      });
      eventManager.addEventListener("makeRecruitPopup", function(event)
      {
        self.makeRecruitPopup(event.content)
      });
      eventManager.addEventListener("makeRecruitCompletePopup", function(event)
      {
        self.makeRecruitCompletePopup(event.content)
      });
      eventManager.addEventListener("makeRecruitCompleteNotification", function(event)
      {
        event.content.delay = 0;
        self.makeNotification(
        {
          icon: self.icons.newEmployee,
          onOk: self.makeRecruitCompletePopup.bind(self, event.content)
        });
      });
      eventManager.addEventListener("makeCellBuyPopup", function(event)
      {
        self.makeCellBuyPopup(event.content)
      });
      eventManager.addEventListener("makeConfirmPopup", function(event)
      {
        self.makeConfirmPopup(event.content)
      });
      eventManager.addEventListener("makePopup", function(event)
      {
        self.makePopup(event.content.type, event.content.props)
      });
      eventManager.addEventListener("makeInfoPopup", function(event)
      {
        self.makeInfoPopup(event.content)
      });
      eventManager.addEventListener("makeBuildingSelectPopup", function(event)
      {
        self.makeBuildingSelectPopup(event.content)
      });
      eventManager.addEventListener("makeBuildingConstructPopup", function(event)
      {
        self.makeBuildingConstructPopup(event.content)
      });
      eventManager.addEventListener("makeInputPopup", function(event)
      {
        self.makeInputPopup(event.content)
      });
      eventManager.addEventListener("makeLoadPopup", function(event)
      {
        self.makeLoadPopup()
      });
      eventManager.addEventListener("makeSavePopup", function(event)
      {
        self.makeSavePopup()
      });
      eventManager.addEventListener("makeModifierPopup", function(event)
      {
        self.makeModifierPopup(event.content);
      });
      eventManager.addEventListener("makeNotification", function(event)
      {
        self.makeNotification(event.content);
      });
      eventManager.addEventListener("closeTopPopup", function(event)
      {
        self.closeTopPopup()
      });
      eventManager.addEventListener("clearReact", function(event)
      {
        self.clear();
      });
      eventManager.addEventListener("updateReact", function(event)
      {
        self.updateReact()
      });
    }

    ///// /////

    makePopup(type:string, props:
      {

        employees?: {[key:string]: Employee};
        player?: Player;

        text?: any; // string or string[]

        onOk?: any;
        okBtnText?: string;
        onClose?: any;
        closeBtnText?: string;

        relevantSkills?: string[];
        action?: any;
      })
      {
        var key = this.idGenerator++;

        var onCloseCallback = props.onClose;
        props.onClose = function()
        {
          this.destroyPopup(key, onCloseCallback);
        }.bind(this);

        var zIndex = this.incrementZIndex();
        var popupProps: any = {};
        for (var prop in props)
        {
          popupProps[prop] = props[prop];
        };
        popupProps.key = key;

        var container = document.getElementById("react-popups")
        {
          
        }
        var basePos =
        {
          top: 0,
          left: 0
        }
        popupProps.initialStyle =
        {
          top: window.innerHeight / 3.5 - 120 + Object.keys(this.popups).length * 15,
          left: window.innerWidth / 3.5 - 120 + Object.keys(this.popups).length * 15,
          zIndex: zIndex
        };
        popupProps.incrementZIndex = this.incrementZIndex.bind(this, key);

        var popup =
        {
          type: type,
          props: popupProps,
          zIndex: zIndex
        };

        this.popups[key] = popup;
        this.updateReact();
      }

    makeEmployeeActionPopup(props: any)
    {
      this.makePopup("EmployeeActionPopup", props);
    }

    makeInfoPopup(props: any)
    {
      this.makePopup("InfoPopup", props);
    }
    makeLoadPopup()
    {
      this.makePopup("LoadPopup",
      {
        onOk: function(name)
        {
          eventManager.dispatchEvent(
          {
            type: "loadGame",
            content: name
          });
        }
      });
    }

    makeSavePopup()
    {
      this.makePopup("SavePopup",
      {
        onOk: function(name)
        {
          eventManager.dispatchEvent(
          {
            type: "saveGame",
            content: name
          });
        }
      });
    }

    makeModifierPopup(props:
    {
      player: Player;
      text?: any;
      modifierList?: any[];
      onOk?: any;
      onClose?: any;
      okBtnText?: string;
      excludeCost?: boolean;
    })
    {
      var onOk = props.onOk || function(selected)
      {
        props.player.addModifier(selected.data.modifier);
        eventManager.dispatchEvent({type: "updateReact", content: ""});

        return false;
      }


      this.makePopup("ModifierPopup",
      {
        player: props.player,
        text: props.text || null,
        modifierList: props.modifierList || props.player.unlockedModifiers,
        excludeCost: props.excludeCost || false,
        onOk: onOk,
        onClose: props.onClose || null,
        okBtnText: props.okBtnText || "Buy"
      });
    }

    makeRecruitPopup(props:
    {
      player: Player;
    })
    {
      var self = this;
      var recruitWithSelected = function(selected)
      {

        Actions.recruitEmployee(
        {
          playerId: props.player.id,
          employeeId: selected.employee.id
        });
      };
      this.makeEmployeeActionPopup(
      {
        player: props.player,
        relevantSkills: ["recruitment"],
        text: "Select employee in charge of recruitment",
        onOk: recruitWithSelected,
        okBtnText: "Select",
        action:
        {
          actionText: "Scouting new employees would take:",
          data:
          {
            time:
            {
              approximate: true,
              amount: 14
            }
          }
        }
      });
    }

    makeRecruitCompletePopup(props:
    {
      recruitingEmployee?: Employee;
      employees: {[key:string]: Employee};
      player: Player;
      text?: any;
      delay?: number;
    })
    {
      var self = this;
      var recruitConfirmFN = function(selected)
      {
        props.player.addEmployee(selected.employee);
      };

      if (!isFinite(props.delay)) props.delay = 2000;

      var recruitCloseFN = function(selected)
      {
        if (props.recruitingEmployee)
        {
          props.recruitingEmployee.active = true;
          self.updateReact();
        }
      }
      this.makeEmployeeActionPopup(
      {
        employees: props.employees,
        text: props.text || "Choose employee to recruit",
        onOk: recruitConfirmFN,
        onClose: recruitCloseFN,
        okBtnText: "Recruit",
        activationDelay: props.delay,
      });
    }

    makeCellBuyPopup(props:
    {
      player: Player;
      cell: any;
      onOk?: any;
    })
    {
      if (Object.keys(props.player.employees).length < 1)
      {
        this.makeInfoPopup({text: "Recruit some employees first"});
        return;
      }

      if (props.player.ownedCells[props.cell.gridPos]) return;
      if (props.cell.type.type === "water") return;
      if (props.cell.content) return;

      var buyCost = props.player.getCellBuyCost(props.cell);

      var buySelected = function(selected)
      {
        var adjusted = Actions.getActionCost(
          [selected.employee.skills["negotiation"]], buyCost).actual;

        if (props.player.money < adjusted)
        {
          eventManager.dispatchEvent(
          {
            type: "makeInfoPopup",
            content:
            {
              text: "Not enough funds"
            }
          });

          return false;
        }

        Actions.buyCell(
        {
          gridPos: props.cell.gridPos,
          boardId: props.cell.board.id,
          playerId: props.player.id,
          employeeId: selected.employee.id,
        });

        if (props.onOk) props.onOk.call();
        return true;
      }
      this.makeEmployeeActionPopup(
      {
        player: props.player,
        relevantSkills: ["negotiation"],
        text: "Select employee in charge of purchasing the plot",
        onOk: buySelected,
        okBtnText: "Buy",
        action:
        {
          target: props.cell,
          actionText: "Buying this plot would take:",
          
          data:
          {
            time:
            {
              approximate: true,
              amount: 14
            },
            cost:
            {
              approximate: false,
              amount: buyCost
            }
          }
        }
      });
    }
    makeConfirmPopup(props:
    {
      text: any;
      onOk: any;
      okBtnText?: string;
      onClose?: any;
      closeBtnText?: string;
    })
    {
      this.makePopup("ConfirmPopup", props);
    }
    makeBuildingSelectPopup(props:
    {
      player: Player;
      onOk: any;
    })
    {
      if (Object.keys(props.player.employees).length < 1)
      {
        this.makeInfoPopup({text: "Recruit some employees first"});
        return;
      }

      this.makePopup("BuildingListPopup",
      {
        player: props.player,
        buildingTemplates: cg.content.buildings,
        buildingImages: this.frameImages,
        onOk: props.onOk
      });
    }
    makeBuildingConstructPopup(props:
    {
      player: Player;
      buildingTemplate: any;
      cell: any;
      onOk?: any;
      text?: any;
    })
    {
      var buildBuilding = function(selected)
      {
        if (selected)
        {
          Actions.constructBuilding(
          {
            playerId: props.player.id,
            gridPos: props.cell.gridPos,
            boardId: props.cell.board.id,
            buildingType: props.buildingTemplate.type,
            employeeId: selected.employee.id
          });
          props.onOk.call();
        }
      }
      this.makeEmployeeActionPopup(
      {
        player: props.player,
        relevantSkills: ["construction"],
        text: "Select employee in charge of construction",
        onOk: buildBuilding,
        okBtnText: "Build",
        action:
        {
          target: props.cell,
          actionText: "Constructing this building would take:",
          data:
          {
            time:
            {
              approximate: true,
              amount: props.buildingTemplate.buildTime
            },
            cost:
            {
              approximate: false,
              amount: props.player.getBuildCost(props.buildingTemplate)
            }
          },
          baseDuration: props.buildingTemplate.buildTime,
          exactCost: props.buildingTemplate.cost,
          
        }
      });
    }

    makeInputPopup(props:
    {
      text: any;
      onOk: (string) => any;
      okBtnText?: string;
      onClose: any;
      closeBtnText?: string;
    })
    {
      this.makePopup("InputPopup", props);
    }

    ///// /////

    makeNotification(props:
    {
      onOk: any;
      icon: string;
      timeout?: number;

      id?: number;
      onClose?: any;
    })
    {
      props.id = this.idGenerator++;

      props.onClose = function()
      {
        props.onOk.call();
        this.removeNotification(props.id)
      }.bind(this);

      this.notifications.push(props);

      this.updateReact();
    }
    removeNotification(id)
    {
      this.notifications = this.notifications.filter(function(item)
      {
        return item.id !== id;
      });

      this.updateReact();
    }

    ///// OTHER METHODS /////

    incrementZIndex(key?)
    {
      var newZIndex = this.topZIndex++;
      if (key)
      {
        this.popups[key].zIndex = newZIndex;
      }
      return newZIndex;
    }
    destroyPopup(key, callback?)
    {
      if (callback) callback.call();

      this.popups[key] = null;
      delete this.popups[key];

      this.updateReact();
    }
    closeTopPopup()
    {
      if (Object.keys(this.popups).length < 1) return;
      else
      {
        var max = 0;
        var key;
        for (var popup in this.popups)
        {
          if (this.popups[popup].zIndex > max)
          {
            max = this.popups[popup].zIndex;
            key = popup;
          }
        }
        this.destroyPopup(key);
      }
    }

    clear()
    {
      this.clearNotifications();
      this.clearAllPopups();
    }
    clearNotifications()
    {
      this.notifications = [];
    }
    clearAllPopups()
    {
      this.popups = {};
    }

    updateReact()
    {
      if (document.hidden) 
      {
        return;
      }

      React.renderComponent(
        UIComponents.Stage(
        {
          popups: this.popups,
          notifications: this.notifications,
          player: this.player,
          frameImages: this.frameImages,

          showStats: undefined,
          fullScreenPopups: undefined
        }),
        document.getElementById("react-container")
      );
    }
  }
}
