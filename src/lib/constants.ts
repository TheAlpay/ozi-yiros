export const CATEGORIES = ['All', 'Yiros', 'Snack Pack', 'Pizza', 'Sauces', 'Extras', 'Deals'];

export const DEMO_DATA = [
  // Yiros ($18.90)
  { name: "Chicken Yiros", category: "Yiros", price: 18.90, ingredients: "Freshly marinated chicken, tzatziki sauce, tomato, onion, crunchy chips in grilled pita.", calories: 750, prepTime: "5m", isDeal: false, isVegetarian: false },
  { name: "Lamb Yiros", category: "Yiros", price: 18.90, ingredients: "Freshly marinated lamb, tzatziki sauce, tomato, onion, crunchy chips in grilled pita.", calories: 820, prepTime: "7m", isDeal: false, isVegetarian: false },
  { name: "Mix Yiros", category: "Yiros", price: 18.90, ingredients: "Chicken & lamb combo, tzatziki sauce, tomato, onion, crunchy chips in grilled pita.", calories: 890, prepTime: "8m", isDeal: false, isVegetarian: false },
  { name: "Grilled Haloumi Yiros", category: "Yiros", price: 18.90, ingredients: "Grilled haloumi, tzatziki, tomato, onion, crunchy chips in grilled pita.", calories: 680, prepTime: "5m", isDeal: false, isVegetarian: true },
  { name: "Falafel Fritters Yiros", category: "Yiros", price: 18.90, ingredients: "Handmade falafel, tzatziki, tomato, onion, crunchy chips in grilled pita.", calories: 650, prepTime: "6m", isDeal: false, isVegetarian: true },
  
  // Snack Packs ($19.90)
  { name: "Snack Pack", category: "Snack Pack", price: 19.90, ingredients: "Roasted meats served over hot chips with melted cheese.", calories: 950, prepTime: "6m", isDeal: false, isVegetarian: false },
  { name: "Meaty Pack", category: "Snack Pack", price: 19.90, ingredients: "Roasted meats, chips, fresh salad, selection of dips, and warm pita bread.", calories: 1100, prepTime: "8m", isDeal: false, isVegetarian: false },
  { name: "Low Carb Pack", category: "Snack Pack", price: 19.90, ingredients: "Roasted meats served with fresh salad, dips, and warm pita (no chips).", calories: 720, prepTime: "7m", isDeal: false, isVegetarian: false },
  { name: "Falafel Pack", category: "Snack Pack", price: 19.90, ingredients: "Handmade falafel served with chips, fresh salad, and dips.", calories: 810, prepTime: "7m", isDeal: false, isVegetarian: true },
  { name: "Rice Bowl", category: "Snack Pack", price: 19.90, ingredients: "Fragrant Turkish rice topped with roasted meats, fresh salads, and pita.", calories: 850, prepTime: "7m", isDeal: false, isVegetarian: false },
  { name: "Vegan Bowl", category: "Snack Pack", price: 19.90, ingredients: "Turkish rice, fresh garden salads, and house dressing.", calories: 520, prepTime: "5m", isDeal: false, isVegetarian: true },
  { name: "Salad Box", category: "Snack Pack", price: 19.90, ingredients: "Fresh salads, grilled haloumi, dips, and warm pita bread.", calories: 580, prepTime: "6m", isDeal: false, isVegetarian: true },

  // Pizzas (Slice: $7.90, Whole: $28.00)
  { name: "Meat Combo Pizza", category: "Pizza", price: 28.00, ingredients: "Lamb, chicken, capsicum, and onion. (Slice: $7.90)", calories: 1200, prepTime: "12m", isDeal: false, isVegetarian: false },
  { name: "Chargrill Chicken Pizza", category: "Pizza", price: 28.00, ingredients: "Grilled chicken, capsicum, mushroom, and onion. (Slice: $7.90)", calories: 1100, prepTime: "12m", isDeal: false, isVegetarian: false },
  { name: "BBQ Chicken Pizza", category: "Pizza", price: 28.00, ingredients: "Chicken, pineapple, capsicum, and BBQ sauce. (Slice: $7.90)", calories: 1150, prepTime: "12m", isDeal: false, isVegetarian: false },
  { name: "Hawaiian Pizza", category: "Pizza", price: 28.00, ingredients: "Chicken, onion, pineapple, and capsicum. (Slice: $7.90)", calories: 1080, prepTime: "12m", isDeal: false, isVegetarian: false },
  { name: "Lamb Pizza", category: "Pizza", price: 28.00, ingredients: "Marinated lamb, capsicum, onion, and fresh garlic. (Slice: $7.90)", calories: 1180, prepTime: "12m", isDeal: false, isVegetarian: false },
  { name: "Salami Pizza", category: "Pizza", price: 28.00, ingredients: "Salami, capsicum, and olives. (Slice: $7.90)", calories: 1120, prepTime: "12m", isDeal: false, isVegetarian: false },
  { name: "Margherita Pizza", category: "Pizza", price: 28.00, ingredients: "Garlic, tomato, fresh basil, and olive oil. (Slice: $7.90)", calories: 950, prepTime: "10m", isDeal: false, isVegetarian: true },
  { name: "Vegetarian Pizza", category: "Pizza", price: 28.00, ingredients: "Spinach, mushroom, capsicum, and feta cheese. (Slice: $7.90)", calories: 980, prepTime: "12m", isDeal: false, isVegetarian: true },

  // Sauces ($0.30)
  { name: "Tzatziki (Yoghurt Garlic)", category: "Sauces", price: 0.30, ingredients: "Traditional Greek garlic dip.", calories: 80, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "BBQ Sauce", category: "Sauces", price: 0.30, ingredients: "Sweet and smoky BBQ sauce.", calories: 60, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Tomato Sauce", category: "Sauces", price: 0.30, ingredients: "Classic tomato ketchup.", calories: 45, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Sour Cream", category: "Sauces", price: 0.30, ingredients: "Smooth and creamy sour cream.", calories: 110, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Hummus", category: "Sauces", price: 0.30, ingredients: "Classic chickpea dip.", calories: 95, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Mayonnaise", category: "Sauces", price: 0.30, ingredients: "Rich and creamy mayo.", calories: 120, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Sweet Chilli", category: "Sauces", price: 0.30, ingredients: "Zesty sweet chilli sauce.", calories: 70, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Hot Chilli", category: "Sauces", price: 0.30, ingredients: "Spicy hot chilli sauce.", calories: 65, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Beetroot Hummus", category: "Sauces", price: 0.30, ingredients: "Beetroot infused chickpea dip.", calories: 90, prepTime: "Ready", isDeal: false, isVegetarian: true },

  // Extras (Toppings)
  { name: "Cheese Extra", category: "Extras", price: 2.00, ingredients: "Additional portion of melted cheese.", calories: 150, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Olives Extra", category: "Extras", price: 1.50, ingredients: "Portion of sliced Kalamata olives.", calories: 45, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Jalapenos Extra", category: "Extras", price: 1.50, ingredients: "Portion of spicy jalapenos.", calories: 15, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Pineapple Extra", category: "Extras", price: 1.50, ingredients: "Portion of sweet pineapple chunks.", calories: 60, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Mushrooms Extra", category: "Extras", price: 1.50, ingredients: "Portion of grilled mushrooms.", calories: 30, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Halloumi Extra", category: "Extras", price: 3.00, ingredients: "Two additional slices of grilled halloumi.", calories: 180, prepTime: "Ready", isDeal: false, isVegetarian: true },

  // Deals
  { name: "Small Meal Deal", category: "Deals", price: 7.90, ingredients: "Can of Soft Drink or Water + Small Chips.", calories: 450, prepTime: "2m", isDeal: true, isVegetarian: false },
  { name: "Large Meal Deal", category: "Deals", price: 9.90, ingredients: "Bottle of Soft Drink or Water + Large Chips.", calories: 650, prepTime: "2m", isDeal: true, isVegetarian: false },
];
