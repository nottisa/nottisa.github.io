/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class NothingTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "nothing";
        this.selectType = SelectionTypes.singleSelect;
        this.tintColor = null;
        this.mapmode = undefined;
        this.button = null;
      }
      onActivate(target: Cell)
      {
      }
    }
  }
}
