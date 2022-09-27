/// <reference path="tool.ts" />

module CityGame
{
  export module Tools
  {
    export class PlantTool extends Tool
    {
      constructor()
      {
        super();
        this.type = "plant";
        this.selectType = SelectionTypes.rectSelect;
        this.tintColor = 0x338833;
        this.mapmode = undefined;
      } 
      onActivate(target: Cell)
      {
        target.addPlant();
      }
    }
  }
}
