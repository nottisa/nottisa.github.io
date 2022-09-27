module CityGame
{
  export interface ICellModifier
  {
    (range: number, strength: number): ICellModifierData;
  }
  export interface ICellModifierData
  {
    type: string;
    title: string;
    range: number;
    strength: number;
    targets: string[];
    scaling?: (number) => number;
    effect?:
    {
      multiplier?: number;
      addedProfit?: number;
    }
    landValue?:
    {
      radius: number;
      multiplier: number;
      scalingFN?: (strength: number) => number;
      falloffFN?: (dist: number, invertedDist: number) => number;
    }
  }
  export interface ICellModifierDescription
  {
    type: ICellModifier;
    range: number;
    strength: number;
  }
  export module cellModifiers
  {
    export var niceEnviroment: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "niceEnviroment",
        title: "Nice enviroment",
        range: range,
        strength: strength,
        targets: ["apartment", "office", "hotel"],
        effect:
        {
          multiplier: 0.3
        },
        landValue:
        {
          radius: 4,
          multiplier: 0.1,
          scalingFN: function(strength){ return 1+Math.log(strength/2); },
        }
      });
    }

    export var crowded: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "crowded",
        title: "Crowded",
        range: range,
        strength: strength,
        targets: ["apartment"],
        scaling: function(strength)
        {
          if (strength >= 5)
          {
            return 1+Math.log(strength);
          }
          else
          {
            return 0;
          }
        },
        effect:
        {
          multiplier: -0.1
        }
      });
    }

    export var population: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "population",
        title: "Nearby customers",
        range: range,
        strength: strength,
        targets: ["fastfood", "shopping"],
        effect:
        {
          addedProfit: 0.3,
          multiplier: 0.2
        },
        scaling: function(strength)
        {
          return strength;
        },
        landValue:
        {
          radius: 4,
          multiplier: 0.01
        }
      });
    }

    export var fastfoodCompetition: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "fastfoodCompetition",
        title: "Competing restaurants",
        range: range,
        strength: strength,
        targets: ["fastfood"],
        effect:
        {
          addedProfit: -0.25,
          multiplier: -0.3,
        }
      });
    }

    export var shoppingCompetition: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "shoppingCompetition",
        title: "Competing stores",
        range: range,
        strength: strength,
        targets: ["shopping"],
        effect:
        {
          addedProfit: -0.2,
          multiplier: -0.2,
        }
      });
    }

    export var nearbyShopping: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "nearbyShopping",
        title: "Nearby stores",
        range: range,
        strength: strength,
        targets: ["fastfood", "parking"],
        effect:
        {
          multiplier: 0.2
        }
      });
    }

    export var nearbyStation: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "nearbyStation",
        title: "Nearby station",
        range: range,
        strength: strength,
        targets: ["fastfood", "shopping", "office",
          "apartment", "parking", "hotel", "stadium"],
        effect:
        {
          addedProfit: 0.25,
          multiplier: 0.25
        },
        landValue:
        {
          radius: 20,
          multiplier: 0.05,
          falloffFN: function(distance, invertedDistance, invertedDistanceRatio)
          {
            return invertedDistance * invertedDistanceRatio;
          }
        }
      });
    }

    export var parkingCompetition: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "parkingCompetition",
        title: "Competing parking lots",
        range: range,
        strength: strength,
        targets: ["parking"],
        effect:
        {
          addedProfit: -0.2,
          multiplier: -0.2,
        }
      });
    }

    export var nearbyParking: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "nearbyParking",
        title: "Nearby parking",
        range: range,
        strength: strength,
        targets: ["fastfood", "shopping"],
        effect:
        {
          addedProfit: 0.25,
          multiplier: 0.1
        }
      });
    }

    export var nearbyFactory: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "nearbyFactory",
        title: "Nearby Factory",
        range: range,
        strength: strength,
        targets: ["fastfood", "shopping", "apartment", "office", "hotel"],
        effect:
        {
          multiplier: -0.15
        },
        landValue:
        {
          radius: 5,
          multiplier: -0.07,
          falloffFN: function(distance, invertedDistance, invertedDistanceRatio)
          {
            return invertedDistance * invertedDistanceRatio / 2;
          }
        }
      });
    }

    export var nearbyRoad: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "nearbyRoad",
        title: "Nearby Road",
        range: range,
        strength: strength,
        targets: ["parking"],
        effect:
        {
          multiplier: 0.15
        },
        scaling: function(strength)
        {
          return 1;
        }
      });
    }

    export var nearbyHotel: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "nearbyHotel",
        title: "Nearby Hotel",
        range: range,
        strength: strength,
        targets: ["office"],
        effect:
        {
          multiplier: 0.33
        },
        landValue:
        {
          radius: 6,
          multiplier: 0.05,
          falloffFN: function(distance, invertedDistance, invertedDistanceRatio)
          {
            return invertedDistance * invertedDistanceRatio / 2;
          }
        }
      });
    }

    export var hotelCompetition: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "hotelCompetition",
        title: "Competing hotels",
        range: range,
        strength: strength,
        targets: ["hotel"],
        effect:
        {
          multiplier: -0.2,
        }
      });
    }
    export var nearbyStadium: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "nearbyStadium",
        title: "Nearby stadium",
        range: range,
        strength: strength,
        targets: ["parking"],
        effect:
        {
          multiplier: 0.2,
        }
      });
    }
    export var stadiumCompetition: ICellModifier = function(range: number, strength: number = 1)
    {
      return(
      {
        type: "stadiumCompetition",
        title: "Competing stadiums",
        range: range,
        strength: strength,
        targets: ["stadium"],
        effect:
        {
          multiplier: -0.25,
        }
      });
    }
  }
}
