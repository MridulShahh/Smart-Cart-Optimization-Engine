const CATEGORY_MAP = {
  "Electronics": {
    allowedCrossCategories: ["Electronics Accessories"],
    subcategories: {
      "Laptops": ["Mouse", "Keyboard", "Laptop Bag", "Cooling Pad", "USB Hub", "External SSD", "Monitor"],
      "Mobile Phones": ["Charger", "Screen Protector", "Phone Case", "Earbuds", "Power Bank"],
      "Audio": ["Earbuds", "Headphone Stand", "Audio Cable"],
    }
  },
  "Fashion": {
    allowedCrossCategories: ["Fashion Accessories"],
    subcategories: {
      "Sneakers": ["Sports Socks", "Shoe Cleaner", "Shoe Bag", "Insoles", "Shoe Laces"],
      "Jeans": ["Belt", "T-Shirt", "Sneakers"],
      "Shirts": ["Tie", "Formal Pants", "Blazer"],
    }
  },
  "Beauty": {
    allowedCrossCategories: ["Beauty"],
    subcategories: {
      "Shampoo": ["Conditioner", "Hair Serum", "Hair Mask"],
      "Face Wash": ["Moisturizer", "Sunscreen", "Toner"],
    }
  },
  "Home": {
    allowedCrossCategories: ["Home"],
    subcategories: {
      "Dining Table": ["Dining Chairs", "Table Cover", "Placemats"],
      "Sofa": ["Cushion Covers", "Side Table", "Floor Lamp"],
    }
  },
  "Kitchen": {
    allowedCrossCategories: ["Kitchen"],
    subcategories: {
      "Mixer": ["Grinder Jar", "Cleaning Brush"],
    }
  },
};

module.exports = CATEGORY_MAP;
