export interface CarbonFactors {
  diet: {
    vegan: number;
    vegetarian: number;
    pescatarian: number;
    flexitarian: number;
    meatLover: number;
    [key: string]: number;
  };
  transport: {
    vehicleType: {
      none: number;
      electric: number;
      hybrid: number;
      gasoline: number;
      diesel: number;
      [key: string]: number;
    };
    publicTransit: {
      never: number;
      occasional: number;
      frequent: number;
      [key: string]: number;
    };
    flights: {
      none: number;
      rare: number;
      moderate: number;
      frequent: number;
      [key: string]: number;
    };
  };
  energy: {
    homeSize: {
      apartment: number;
      mediumHouse: number;
      largeHouse: number;
      [key: string]: number;
    };
    electricitySource: {
      coal: number;
      gridMix: number;
      renewable: number;
      [key: string]: number;
    };
    heating: {
      gas: number;
      electricity: number;
      heatPump: number;
      [key: string]: number;
    };
  };
}

export const carbonFactors: CarbonFactors = {
  diet: {
    vegan: 1.5,
    vegetarian: 1.7,
    pescatarian: 2.1,
    flexitarian: 2.5,
    meatLover: 3.3
  },
  transport: {
    vehicleType: {
      none: 0,
      electric: 1.1,
      hybrid: 1.9,
      gasoline: 3.6,
      diesel: 4.1
    },
    publicTransit: {
      never: 0,
      occasional: 0.2,
      frequent: 0.5
    },
    flights: {
      none: 0,
      rare: 0.6,
      moderate: 1.8,
      frequent: 4.5
    }
  },
  energy: {
    homeSize: {
      apartment: 0.8,
      mediumHouse: 1.6,
      largeHouse: 2.4
    },
    electricitySource: {
      coal: 3.2,
      gridMix: 1.8,
      renewable: 0.1
    },
    heating: {
      gas: 1.5,
      electricity: 1.0,
      heatPump: 0.3
    }
  }
};

export interface RepeatableAction {
  id: string;
  label: string;
  category: string;
  co2Saved: number; // kg CO2e saved
  icon: string;
}

export const repeatableActions: RepeatableAction[] = [
  {
    id: 'public_transit',
    label: 'Took public transit instead of driving',
    category: 'travel',
    co2Saved: 4.6,
    icon: 'Bus'
  },
  {
    id: 'vegan_meal',
    label: 'Ate a plant-based meal',
    category: 'food',
    co2Saved: 1.5,
    icon: 'Utensils'
  },
  {
    id: 'line_dry',
    label: 'Line-dried a load of laundry',
    category: 'energy',
    co2Saved: 0.8,
    icon: 'Wind'
  },
  {
    id: 'turned_down_heating',
    label: 'Lowered thermostat by 2°F (or raised AC)',
    category: 'energy',
    co2Saved: 1.2,
    icon: 'Thermometer'
  },
  {
    id: 'reusable_bag',
    label: 'Used reusable bags and avoided plastic packaging',
    category: 'shopping',
    co2Saved: 0.3,
    icon: 'ShoppingBag'
  },
  {
    id: 'composted',
    label: 'Composted organic kitchen waste',
    category: 'waste',
    co2Saved: 0.5,
    icon: 'Trash2'
  },
  {
    id: 'recycled_materials',
    label: 'Recycled paper, glass, and metal containers',
    category: 'waste',
    co2Saved: 0.7,
    icon: 'Recycle'
  },
  {
    id: 'shorter_shower',
    label: 'Halved standard shower duration (saves freshwater heating)',
    category: 'water',
    co2Saved: 0.9,
    icon: 'Droplet'
  },
  {
    id: 'tap_turnoff',
    label: 'Turned off tap while brushing teeth & washing dishes',
    category: 'water',
    co2Saved: 0.4,
    icon: 'Droplet'
  }
];
