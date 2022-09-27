/// <reference path="../../lib/react.d.ts" />
/// 
/// <reference path="../eventmanager.ts" />
/// <reference path="../utility.ts" />
/// 
/// <reference path="optionlist.ts" />
/// 
/// <reference path="../options.ts" />

module CityGame
{
  
  export module UIComponents
  {
    declare var LZString: any;
    export var OptionsPopup = React.createClass({
      toggleSelf: function()
      {
        eventManager.dispatchEvent({type:"toggleFullScreenPopup", content:null});
      },
  
      handleImport: function()
      {
        var imported = this.refs.importTextArea.getDOMNode().value;
        if (!imported) return;
        var decoded = LZString.decompressFromBase64(imported);
  
        localStorage.setItem("tempImported", decoded);
  
        eventManager.dispatchEvent({type: "loadGame", content: "tempImported"});
  
        localStorage.removeItem("tempImported");
      },
      handleExport: function()
      {
        eventManager.dispatchEvent({type: "saveGame", content: "tempImported"});
  
        var encoded = LZString.compressToBase64(localStorage.getItem("tempImported"));
        this.refs.importTextArea.getDOMNode().value = encoded;
  
        localStorage.removeItem("tempImported");
      },
      
      render: function()
      {
        var allOptions = [];
  
  
        var importExport =
        [
          {
            content: React.DOM.div({id:"import-export-container"},
              React.DOM.div({id:"import-export-buttons"},
                React.DOM.button(
                  {
                    id:"import-button",
                    onClick: this.handleImport,
                    onTouchStart: this.handleImport
                  }, "Import"),
                React.DOM.button(
                  {
                    id:"export-button",
                    onClick: this.handleExport,
                    onTouchStart: this.handleExport
                  }, "Export")
              ),
              React.DOM.textarea({id:"import-export-text", ref:"importTextArea"})
              
            )
          }
        ];
        var importExportList = UIComponents.OptionList(
        {
          options: importExport,
          header: "Import & Export",
          key: "importExportList"
        });
  
        allOptions.push(importExportList);
  
        var visualOptions =
        [
          {
            content: React.DOM.div(null,
              React.DOM.input(
                {
                  type: "checkbox",
                  id:"draw-click-popups",
                  name:"draw-click-popups",
                  defaultChecked: Options.drawClickPopups,
                  onChange: function(){eventManager.dispatchEvent(
                  {
                    type: "toggleDrawClickPopups", content: ""
                  })}
                }
              ),
              React.DOM.label(
              {
                htmlFor: "draw-click-popups"
              }, "Draw click popups")
            )
          }
        ];
        var visualOptionList = UIComponents.OptionList(
        {
          options: visualOptions,
          header: "Visual & Performance",
          key: "visualOptionList"
        });
  
        allOptions.push(visualOptionList);
  
        var otherOptions =
        [
          {
            content: React.DOM.div(
              {
                title: "Amount of rolling autosaves to keep"
              },
              React.DOM.input(
              {
                type: "number",
                id: "autosave-limit",
                className: "small-number-input",
                defaultValue: Options.autosaveLimit,
                step: 1,
                min: 1,
                max: 9,
                onChange: function(e)
                {
                  var _target = <any> e.target;
                  var value = _target.value;
                  if (value === Options.autosaveLimit) return;
                  eventManager.dispatchEvent(
                  {
                    type: "setAutosaveLimit",
                    content: value
                  })
                }
              }),
              React.DOM.label(
              {
                htmlFor: "autosave-limit"
              }, "Autosave limit")
            )
          },
          {
            content: React.DOM.div(
              {
                title: "Automatically switch back to clicking after performing an action\n"+
                "Can be overridden by holding shift key"
              },
              React.DOM.input(
                {
                  type: "checkbox",
                  id:"auto-switch-tools",
                  name:"auto-switch-tools",
                  defaultChecked: Options.autoSwitchTools,
                  onChange: function(){eventManager.dispatchEvent(
                  {
                    type: "toggleAutoSwitchTools", content: ""
                  })}
                }
              ),
              React.DOM.label(
              {
                htmlFor: "auto-switch-tools"
              }, "Automatically switch to clicking")
            )
          }
        ];
        var otherOptionList = UIComponents.OptionList(
        {
          options: otherOptions,
          header: "Other",
          key: "otherOptionList"
        });
  
        allOptions.push(otherOptionList);
  
        return(
          React.DOM.div({className: "all-options"},
            React.DOM.a({id:"close-info", className:"close-popup", href:"#",
              onClick: this.toggleSelf,
              onTouchStart: this.toggleSelf
            },"X"),
            allOptions
          )
        );
      }
    });
  }
}
