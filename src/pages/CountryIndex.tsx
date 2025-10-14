import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon, GlobeAltIcon, SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';

interface VegDish {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookTime: string;
  mainIngredients: string[];
}

interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
  famousVegDishes: VegDish[];
  cuisine: string;
}

const CountryIndex: React.FC = () => {
  const [countries] = useState<Country[]>([
    // South Asia
    {
      code: 'in',
      name: 'India',
      flag: '🇮🇳',
      region: 'South Asia',
      cuisine: 'Indian',
      famousVegDishes: [
        {
          name: 'Palak Paneer',
          description: 'Creamy spinach curry with cottage cheese cubes',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['spinach', 'paneer', 'onions', 'tomatoes', 'spices']
        },
        {
          name: 'Dal Tadka',
          description: 'Spiced lentil curry with aromatic tempering',
          difficulty: 'Easy',
          cookTime: '25 minutes',
          mainIngredients: ['lentils', 'onions', 'tomatoes', 'garlic', 'cumin']
        },
        {
          name: 'Aloo Gobi',
          description: 'Dry curry with potatoes and cauliflower',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['potatoes', 'cauliflower', 'turmeric', 'ginger', 'spices']
        }
      ]
    },
    {
      code: 'np',
      name: 'Nepal',
      flag: '🇳🇵',
      region: 'South Asia',
      cuisine: 'Nepali',
      famousVegDishes: [
        {
          name: 'Dal Bhat',
          description: 'Traditional lentil soup served with rice and vegetables',
          difficulty: 'Easy',
          cookTime: '40 minutes',
          mainIngredients: ['lentils', 'rice', 'vegetables', 'spices', 'ghee']
        },
        {
          name: 'Gundruk',
          description: 'Fermented leafy green vegetable curry',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['fermented greens', 'garlic', 'ginger', 'chilies', 'turmeric']
        },
        {
          name: 'Sel Roti',
          description: 'Traditional ring-shaped rice bread',
          difficulty: 'Hard',
          cookTime: '45 minutes',
          mainIngredients: ['rice flour', 'milk', 'sugar', 'ghee', 'cardamom']
        }
      ]
    },
    {
      code: 'bd',
      name: 'Bangladesh',
      flag: '🇧🇩',
      region: 'South Asia',
      cuisine: 'Bengali',
      famousVegDishes: [
        {
          name: 'Shorshe Posto',
          description: 'Vegetables in mustard and poppy seed paste',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['mixed vegetables', 'mustard seeds', 'poppy seeds', 'green chilies', 'turmeric']
        },
        {
          name: 'Dal Bhaja',
          description: 'Bengali style spiced lentils',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['lentils', 'bay leaves', 'cumin', 'turmeric', 'ghee']
        },
        {
          name: 'Aloo Posto',
          description: 'Potatoes cooked in poppy seed paste',
          difficulty: 'Medium',
          cookTime: '25 minutes',
          mainIngredients: ['potatoes', 'poppy seeds', 'green chilies', 'mustard oil', 'nigella seeds']
        }
      ]
    },
    {
      code: 'lk',
      name: 'Sri Lanka',
      flag: '🇱🇰',
      region: 'South Asia',
      cuisine: 'Sri Lankan',
      famousVegDishes: [
        {
          name: 'Coconut Rice',
          description: 'Fragrant rice cooked in coconut milk',
          difficulty: 'Easy',
          cookTime: '25 minutes',
          mainIngredients: ['rice', 'coconut milk', 'curry leaves', 'onions', 'spices']
        },
        {
          name: 'Vegetable Curry',
          description: 'Mixed vegetables in spicy coconut curry',
          difficulty: 'Medium',
          cookTime: '35 minutes',
          mainIngredients: ['mixed vegetables', 'coconut milk', 'curry leaves', 'chili', 'turmeric']
        },
        {
          name: 'Pol Sambol',
          description: 'Spicy coconut relish with chilies',
          difficulty: 'Easy',
          cookTime: '10 minutes',
          mainIngredients: ['coconut', 'red chilies', 'onions', 'lime juice', 'salt']
        }
      ]
    },

    // East Asia
    {
      code: 'jp',
      name: 'Japan',
      flag: '🇯🇵',
      region: 'East Asia',
      cuisine: 'Japanese',
      famousVegDishes: [
        {
          name: 'Vegetable Sushi',
          description: 'Fresh sushi rolls with cucumber, avocado, and pickled vegetables',
          difficulty: 'Hard',
          cookTime: '60 minutes',
          mainIngredients: ['sushi rice', 'nori', 'cucumber', 'avocado', 'pickled radish']
        },
        {
          name: 'Agedashi Tofu',
          description: 'Lightly fried tofu in savory dashi broth',
          difficulty: 'Medium',
          cookTime: '20 minutes',
          mainIngredients: ['silken tofu', 'potato starch', 'dashi', 'soy sauce', 'mirin']
        },
        {
          name: 'Vegetable Tempura',
          description: 'Light and crispy battered vegetables',
          difficulty: 'Medium',
          cookTime: '25 minutes',
          mainIngredients: ['mixed vegetables', 'tempura flour', 'ice water', 'vegetable oil']
        }
      ]
    },
    {
      code: 'cn',
      name: 'China',
      flag: '🇨🇳',
      region: 'East Asia',
      cuisine: 'Chinese',
      famousVegDishes: [
        {
          name: 'Mapo Tofu (Vegetarian)',
          description: 'Silky tofu in spicy Sichuan sauce',
          difficulty: 'Medium',
          cookTime: '20 minutes',
          mainIngredients: ['silken tofu', 'sichuan peppercorns', 'chili bean paste', 'garlic', 'scallions']
        },
        {
          name: 'Vegetable Fried Rice',
          description: 'Wok-fried rice with mixed vegetables and soy sauce',
          difficulty: 'Easy',
          cookTime: '15 minutes',
          mainIngredients: ['rice', 'mixed vegetables', 'soy sauce', 'garlic', 'sesame oil']
        },
        {
          name: 'Buddha\'s Delight',
          description: 'Mixed vegetables and tofu in brown sauce',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['tofu', 'mushrooms', 'bamboo shoots', 'wood ear', 'soy sauce']
        }
      ]
    },
    {
      code: 'kr',
      name: 'South Korea',
      flag: '🇰🇷',
      region: 'East Asia',
      cuisine: 'Korean',
      famousVegDishes: [
        {
          name: 'Kimchi Fried Rice',
          description: 'Spicy fermented cabbage fried with rice',
          difficulty: 'Easy',
          cookTime: '15 minutes',
          mainIngredients: ['kimchi', 'rice', 'sesame oil', 'garlic', 'scallions']
        },
        {
          name: 'Bibimbap (Vegetarian)',
          description: 'Mixed rice bowl with vegetables and gochujang',
          difficulty: 'Medium',
          cookTime: '40 minutes',
          mainIngredients: ['rice', 'mixed vegetables', 'gochujang', 'sesame oil', 'seaweed']
        },
        {
          name: 'Pajeon (Vegetable)',
          description: 'Savory vegetable pancake with scallions',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['flour', 'scallions', 'vegetables', 'soy sauce', 'sesame oil']
        }
      ]
    },

    // Southeast Asia
    {
      code: 'th',
      name: 'Thailand',
      flag: '🇹🇭',
      region: 'Southeast Asia',
      cuisine: 'Thai',
      famousVegDishes: [
        {
          name: 'Pad Thai (Vegetarian)',
          description: 'Stir-fried rice noodles with tofu, vegetables, and tamarind sauce',
          difficulty: 'Medium',
          cookTime: '25 minutes',
          mainIngredients: ['rice noodles', 'tofu', 'bean sprouts', 'tamarind', 'peanuts']
        },
        {
          name: 'Green Curry (Vegetarian)',
          description: 'Spicy coconut curry with vegetables and Thai basil',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['green curry paste', 'coconut milk', 'eggplant', 'bamboo shoots', 'thai basil']
        },
        {
          name: 'Som Tam (Papaya Salad)',
          description: 'Fresh and spicy green papaya salad with lime dressing',
          difficulty: 'Easy',
          cookTime: '15 minutes',
          mainIngredients: ['green papaya', 'tomatoes', 'lime juice', 'palm sugar', 'peanuts']
        }
      ]
    },
    {
      code: 'vn',
      name: 'Vietnam',
      flag: '🇻🇳',
      region: 'Southeast Asia',
      cuisine: 'Vietnamese',
      famousVegDishes: [
        {
          name: 'Pho Chay (Vegetarian Pho)',
          description: 'Aromatic noodle soup with vegetables and herbs',
          difficulty: 'Medium',
          cookTime: '45 minutes',
          mainIngredients: ['rice noodles', 'vegetable broth', 'tofu', 'herbs', 'bean sprouts']
        },
        {
          name: 'Banh Mi Chay',
          description: 'Vietnamese sandwich with marinated tofu and vegetables',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['baguette', 'marinated tofu', 'pickled vegetables', 'cilantro', 'chili']
        },
        {
          name: 'Goi Cuon (Fresh Spring Rolls)',
          description: 'Fresh rice paper rolls with vegetables and herbs',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['rice paper', 'lettuce', 'herbs', 'rice noodles', 'peanut sauce']
        }
      ]
    },
    {
      code: 'id',
      name: 'Indonesia',
      flag: '🇮🇩',
      region: 'Southeast Asia',
      cuisine: 'Indonesian',
      famousVegDishes: [
        {
          name: 'Gado-Gado',
          description: 'Mixed vegetable salad with peanut sauce',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['mixed vegetables', 'tofu', 'tempeh', 'peanut sauce', 'crackers']
        },
        {
          name: 'Rendang Tahu',
          description: 'Tofu in rich coconut curry sauce',
          difficulty: 'Hard',
          cookTime: '60 minutes',
          mainIngredients: ['firm tofu', 'coconut milk', 'rendang spice paste', 'lemongrass', 'galangal']
        },
        {
          name: 'Sayur Lodeh',
          description: 'Vegetables in coconut milk curry',
          difficulty: 'Easy',
          cookTime: '25 minutes',
          mainIngredients: ['mixed vegetables', 'coconut milk', 'tempeh', 'bay leaves', 'galangal']
        }
      ]
    },
    {
      code: 'my',
      name: 'Malaysia',
      flag: '🇲🇾',
      region: 'Southeast Asia',
      cuisine: 'Malaysian',
      famousVegDishes: [
        {
          name: 'Char Kway Teow (Vegetarian)',
          description: 'Stir-fried flat rice noodles with vegetables',
          difficulty: 'Medium',
          cookTime: '20 minutes',
          mainIngredients: ['flat rice noodles', 'bean sprouts', 'chives', 'soy sauce', 'dark soy sauce']
        },
        {
          name: 'Laksa (Vegetarian)',
          description: 'Spicy coconut noodle soup with tofu',
          difficulty: 'Hard',
          cookTime: '50 minutes',
          mainIngredients: ['rice noodles', 'coconut milk', 'laksa paste', 'tofu', 'bean sprouts']
        },
        {
          name: 'Roti Canai with Dhal',
          description: 'Flaky flatbread served with lentil curry',
          difficulty: 'Hard',
          cookTime: '60 minutes',
          mainIngredients: ['flour', 'ghee', 'lentils', 'curry spices', 'onions']
        }
      ]
    },

    // Europe
    {
      code: 'it',
      name: 'Italy',
      flag: '🇮🇹',
      region: 'Southern Europe',
      cuisine: 'Italian',
      famousVegDishes: [
        {
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato, mozzarella, and fresh basil',
          difficulty: 'Medium',
          cookTime: '45 minutes',
          mainIngredients: ['pizza dough', 'tomatoes', 'mozzarella', 'basil', 'olive oil']
        },
        {
          name: 'Risotto ai Funghi',
          description: 'Creamy mushroom risotto with arborio rice',
          difficulty: 'Hard',
          cookTime: '40 minutes',
          mainIngredients: ['arborio rice', 'mushrooms', 'parmesan', 'white wine', 'vegetable stock']
        },
        {
          name: 'Caprese Salad',
          description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic',
          difficulty: 'Easy',
          cookTime: '10 minutes',
          mainIngredients: ['mozzarella', 'tomatoes', 'basil', 'balsamic vinegar', 'olive oil']
        }
      ]
    },
    {
      code: 'fr',
      name: 'France',
      flag: '🇫🇷',
      region: 'Western Europe',
      cuisine: 'French',
      famousVegDishes: [
        {
          name: 'Ratatouille',
          description: 'Classic Provençal vegetable stew with herbs',
          difficulty: 'Medium',
          cookTime: '45 minutes',
          mainIngredients: ['eggplant', 'zucchini', 'tomatoes', 'bell peppers', 'herbs de provence']
        },
        {
          name: 'French Onion Soup (Vegetarian)',
          description: 'Rich caramelized onion soup with cheese and croutons',
          difficulty: 'Medium',
          cookTime: '60 minutes',
          mainIngredients: ['onions', 'vegetable stock', 'gruyere cheese', 'bread', 'white wine']
        },
        {
          name: 'Quiche Lorraine (Vegetarian)',
          description: 'Savory custard tart with cheese and vegetables',
          difficulty: 'Hard',
          cookTime: '75 minutes',
          mainIngredients: ['pastry', 'eggs', 'cream', 'cheese', 'vegetables']
        }
      ]
    },
    {
      code: 'es',
      name: 'Spain',
      flag: '🇪🇸',
      region: 'Southern Europe',
      cuisine: 'Spanish',
      famousVegDishes: [
        {
          name: 'Paella Vegetariana',
          description: 'Traditional rice dish with vegetables and saffron',
          difficulty: 'Hard',
          cookTime: '50 minutes',
          mainIngredients: ['bomba rice', 'saffron', 'vegetables', 'olive oil', 'vegetable stock']
        },
        {
          name: 'Gazpacho',
          description: 'Cold tomato soup with vegetables and herbs',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['tomatoes', 'cucumber', 'bell pepper', 'onion', 'olive oil']
        },
        {
          name: 'Tortilla Española',
          description: 'Traditional potato and egg omelet',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['potatoes', 'eggs', 'onions', 'olive oil', 'salt']
        }
      ]
    },
    {
      code: 'gr',
      name: 'Greece',
      flag: '🇬🇷',
      region: 'Southern Europe',
      cuisine: 'Greek',
      famousVegDishes: [
        {
          name: 'Greek Salad (Horiatiki)',
          description: 'Fresh tomatoes, cucumber, olives, and feta cheese',
          difficulty: 'Easy',
          cookTime: '10 minutes',
          mainIngredients: ['tomatoes', 'cucumber', 'feta cheese', 'olives', 'olive oil']
        },
        {
          name: 'Spanakopita',
          description: 'Flaky phyllo pastry filled with spinach and feta',
          difficulty: 'Hard',
          cookTime: '60 minutes',
          mainIngredients: ['phyllo pastry', 'spinach', 'feta cheese', 'onions', 'dill']
        },
        {
          name: 'Dolmades',
          description: 'Grape leaves stuffed with rice, herbs, and pine nuts',
          difficulty: 'Medium',
          cookTime: '45 minutes',
          mainIngredients: ['grape leaves', 'rice', 'pine nuts', 'herbs', 'lemon juice']
        }
      ]
    },
    {
      code: 'de',
      name: 'Germany',
      flag: '🇩🇪',
      region: 'Central Europe',
      cuisine: 'German',
      famousVegDishes: [
        {
          name: 'Sauerbraten (Vegetarian)',
          description: 'Marinated roasted vegetables with gravy',
          difficulty: 'Hard',
          cookTime: '90 minutes',
          mainIngredients: ['root vegetables', 'vinegar', 'spices', 'vegetable stock', 'flour']
        },
        {
          name: 'Spaetzle with Cheese',
          description: 'Traditional egg noodles with cheese and onions',
          difficulty: 'Medium',
          cookTime: '40 minutes',
          mainIngredients: ['flour', 'eggs', 'cheese', 'onions', 'butter']
        },
        {
          name: 'Kartoffelpuffer',
          description: 'Crispy potato pancakes with applesauce',
          difficulty: 'Easy',
          cookTime: '25 minutes',
          mainIngredients: ['potatoes', 'onions', 'flour', 'eggs', 'vegetable oil']
        }
      ]
    },
    {
      code: 'gb',
      name: 'United Kingdom',
      flag: '🇬🇧',
      region: 'Northern Europe',
      cuisine: 'British',
      famousVegDishes: [
        {
          name: 'Vegetable Shepherd\'s Pie',
          description: 'Lentils and vegetables topped with mashed potatoes',
          difficulty: 'Medium',
          cookTime: '60 minutes',
          mainIngredients: ['lentils', 'mixed vegetables', 'potatoes', 'vegetable stock', 'herbs']
        },
        {
          name: 'Welsh Rarebit',
          description: 'Savory cheese sauce on toast',
          difficulty: 'Easy',
          cookTime: '15 minutes',
          mainIngredients: ['cheese', 'beer', 'mustard', 'bread', 'worcestershire sauce']
        },
        {
          name: 'Bubble and Squeak',
          description: 'Fried leftover vegetables with potatoes',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['potatoes', 'cabbage', 'carrots', 'butter', 'onions']
        }
      ]
    },

    // Americas
    {
      code: 'mx',
      name: 'Mexico',
      flag: '🇲🇽',
      region: 'North America',
      cuisine: 'Mexican',
      famousVegDishes: [
        {
          name: 'Vegetarian Tacos',
          description: 'Soft tortillas filled with beans, vegetables, and fresh salsa',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['tortillas', 'black beans', 'avocado', 'tomatoes', 'cilantro']
        },
        {
          name: 'Chiles Rellenos',
          description: 'Stuffed poblano peppers with cheese and herbs',
          difficulty: 'Hard',
          cookTime: '50 minutes',
          mainIngredients: ['poblano peppers', 'cheese', 'eggs', 'flour', 'tomato sauce']
        },
        {
          name: 'Elote (Mexican Street Corn)',
          description: 'Grilled corn with mayo, cheese, chili powder, and lime',
          difficulty: 'Easy',
          cookTime: '15 minutes',
          mainIngredients: ['corn', 'mayonnaise', 'cotija cheese', 'chili powder', 'lime']
        }
      ]
    },
    {
      code: 'us',
      name: 'United States',
      flag: '🇺🇸',
      region: 'North America',
      cuisine: 'American',
      famousVegDishes: [
        {
          name: 'Black Bean Burger',
          description: 'Hearty plant-based burger with vegetables',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['black beans', 'oats', 'vegetables', 'spices', 'burger bun']
        },
        {
          name: 'Mac and Cheese',
          description: 'Creamy pasta with cheese sauce',
          difficulty: 'Easy',
          cookTime: '25 minutes',
          mainIngredients: ['pasta', 'cheese', 'milk', 'butter', 'flour']
        },
        {
          name: 'California Salad',
          description: 'Fresh mixed greens with avocado and nuts',
          difficulty: 'Easy',
          cookTime: '10 minutes',
          mainIngredients: ['mixed greens', 'avocado', 'nuts', 'cranberries', 'vinaigrette']
        }
      ]
    },
    {
      code: 'ca',
      name: 'Canada',
      flag: '🇨🇦',
      region: 'North America',
      cuisine: 'Canadian',
      famousVegDishes: [
        {
          name: 'Poutine (Vegetarian)',
          description: 'Fries topped with cheese curds and vegetarian gravy',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['potatoes', 'cheese curds', 'vegetarian gravy', 'vegetable oil']
        },
        {
          name: 'Maple Glazed Carrots',
          description: 'Sweet carrots glazed with maple syrup',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['carrots', 'maple syrup', 'butter', 'thyme', 'salt']
        },
        {
          name: 'Tourtière (Vegetarian)',
          description: 'Traditional meat pie made with lentils and vegetables',
          difficulty: 'Hard',
          cookTime: '90 minutes',
          mainIngredients: ['pastry', 'lentils', 'vegetables', 'spices', 'vegetable stock']
        }
      ]
    },
    {
      code: 'br',
      name: 'Brazil',
      flag: '🇧🇷',
      region: 'South America',
      cuisine: 'Brazilian',
      famousVegDishes: [
        {
          name: 'Feijoada Vegetariana',
          description: 'Traditional bean stew with vegetables',
          difficulty: 'Medium',
          cookTime: '60 minutes',
          mainIngredients: ['black beans', 'vegetables', 'bay leaves', 'garlic', 'orange zest']
        },
        {
          name: 'Açaí Bowl',
          description: 'Superfruit bowl with granola and fresh fruits',
          difficulty: 'Easy',
          cookTime: '10 minutes',
          mainIngredients: ['açaí', 'granola', 'banana', 'berries', 'honey']
        },
        {
          name: 'Pão de Açúcar',
          description: 'Sweet bread with coconut and sugar',
          difficulty: 'Medium',
          cookTime: '45 minutes',
          mainIngredients: ['flour', 'coconut', 'sugar', 'eggs', 'butter']
        }
      ]
    },
    {
      code: 'ar',
      name: 'Argentina',
      flag: '🇦🇷',
      region: 'South America',
      cuisine: 'Argentine',
      famousVegDishes: [
        {
          name: 'Empanadas de Verdura',
          description: 'Baked pastries filled with vegetables and cheese',
          difficulty: 'Medium',
          cookTime: '45 minutes',
          mainIngredients: ['pastry', 'spinach', 'cheese', 'onions', 'eggs']
        },
        {
          name: 'Chimichurri Vegetables',
          description: 'Grilled vegetables with herb sauce',
          difficulty: 'Easy',
          cookTime: '25 minutes',
          mainIngredients: ['mixed vegetables', 'parsley', 'garlic', 'olive oil', 'vinegar']
        },
        {
          name: 'Provoleta',
          description: 'Grilled provolone cheese with herbs',
          difficulty: 'Easy',
          cookTime: '10 minutes',
          mainIngredients: ['provolone cheese', 'oregano', 'red pepper flakes', 'olive oil']
        }
      ]
    },

    // Africa
    {
      code: 'ma',
      name: 'Morocco',
      flag: '🇲🇦',
      region: 'North Africa',
      cuisine: 'Moroccan',
      famousVegDishes: [
        {
          name: 'Vegetable Tagine',
          description: 'Slow-cooked vegetables with aromatic spices in clay pot',
          difficulty: 'Medium',
          cookTime: '90 minutes',
          mainIngredients: ['mixed vegetables', 'preserved lemons', 'olives', 'moroccan spices', 'couscous']
        },
        {
          name: 'Moroccan Couscous',
          description: 'Fluffy semolina grains with vegetables and almonds',
          difficulty: 'Easy',
          cookTime: '30 minutes',
          mainIngredients: ['couscous', 'vegetables', 'almonds', 'raisins', 'cinnamon']
        },
        {
          name: 'Harira Soup (Vegetarian)',
          description: 'Hearty tomato and lentil soup with herbs',
          difficulty: 'Medium',
          cookTime: '40 minutes',
          mainIngredients: ['lentils', 'tomatoes', 'chickpeas', 'cilantro', 'ginger']
        }
      ]
    },
    {
      code: 'eg',
      name: 'Egypt',
      flag: '🇪🇬',
      region: 'North Africa',
      cuisine: 'Egyptian',
      famousVegDishes: [
        {
          name: 'Ful Medames',
          description: 'Traditional fava bean stew with herbs and spices',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['fava beans', 'garlic', 'lemon juice', 'olive oil', 'cumin']
        },
        {
          name: 'Koshari',
          description: 'Mixed rice, lentils, and pasta with spicy tomato sauce',
          difficulty: 'Medium',
          cookTime: '40 minutes',
          mainIngredients: ['rice', 'lentils', 'pasta', 'tomato sauce', 'fried onions']
        },
        {
          name: 'Mahshi',
          description: 'Stuffed vegetables with rice and herbs',
          difficulty: 'Hard',
          cookTime: '60 minutes',
          mainIngredients: ['vegetables', 'rice', 'herbs', 'tomato sauce', 'spices']
        }
      ]
    },
    {
      code: 'ng',
      name: 'Nigeria',
      flag: '🇳🇬',
      region: 'West Africa',
      cuisine: 'Nigerian',
      famousVegDishes: [
        {
          name: 'Jollof Rice (Vegetarian)',
          description: 'Spiced rice dish with vegetables and tomatoes',
          difficulty: 'Medium',
          cookTime: '45 minutes',
          mainIngredients: ['rice', 'tomatoes', 'peppers', 'onions', 'vegetable stock']
        },
        {
          name: 'Moi Moi',
          description: 'Steamed bean pudding with vegetables',
          difficulty: 'Hard',
          cookTime: '60 minutes',
          mainIngredients: ['black-eyed peas', 'peppers', 'onions', 'palm oil', 'vegetables']
        },
        {
          name: 'Plantain Porridge',
          description: 'Cooked plantains with vegetables and spices',
          difficulty: 'Easy',
          cookTime: '30 minutes',
          mainIngredients: ['plantains', 'palm oil', 'vegetables', 'crayfish', 'spices']
        }
      ]
    },
    {
      code: 'et',
      name: 'Ethiopia',
      flag: '🇪🇹',
      region: 'East Africa',
      cuisine: 'Ethiopian',
      famousVegDishes: [
        {
          name: 'Injera with Vegetables',
          description: 'Spongy flatbread served with spiced vegetable stews',
          difficulty: 'Hard',
          cookTime: '120 minutes',
          mainIngredients: ['teff flour', 'mixed vegetables', 'berbere spice', 'onions', 'garlic']
        },
        {
          name: 'Shiro',
          description: 'Ground chickpea or broad bean stew',
          difficulty: 'Easy',
          cookTime: '25 minutes',
          mainIngredients: ['chickpea flour', 'onions', 'garlic', 'berbere spice', 'tomatoes']
        },
        {
          name: 'Gomen',
          description: 'Spiced collard greens with garlic and ginger',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['collard greens', 'garlic', 'ginger', 'onions', 'turmeric']
        }
      ]
    },

    // Middle East
    {
      code: 'lb',
      name: 'Lebanon',
      flag: '🇱🇧',
      region: 'Middle East',
      cuisine: 'Lebanese',
      famousVegDishes: [
        {
          name: 'Hummus',
          description: 'Creamy chickpea dip with tahini and olive oil',
          difficulty: 'Easy',
          cookTime: '15 minutes',
          mainIngredients: ['chickpeas', 'tahini', 'lemon juice', 'garlic', 'olive oil']
        },
        {
          name: 'Tabbouleh',
          description: 'Fresh parsley salad with tomatoes and bulgur',
          difficulty: 'Easy',
          cookTime: '20 minutes',
          mainIngredients: ['parsley', 'tomatoes', 'bulgur', 'mint', 'lemon juice']
        },
        {
          name: 'Fattoush',
          description: 'Mixed salad with toasted pita bread',
          difficulty: 'Easy',
          cookTime: '15 minutes',
          mainIngredients: ['mixed vegetables', 'pita bread', 'sumac', 'olive oil', 'lemon juice']
        }
      ]
    },
    {
      code: 'il',
      name: 'Israel',
      flag: '🇮🇱',
      region: 'Middle East',
      cuisine: 'Israeli',
      famousVegDishes: [
        {
          name: 'Falafel',
          description: 'Deep-fried chickpea balls with herbs and spices',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['chickpeas', 'herbs', 'garlic', 'onions', 'cumin']
        },
        {
          name: 'Shakshuka',
          description: 'Eggs poached in spicy tomato sauce',
          difficulty: 'Easy',
          cookTime: '25 minutes',
          mainIngredients: ['eggs', 'tomatoes', 'peppers', 'onions', 'paprika']
        },
        {
          name: 'Israeli Salad',
          description: 'Diced cucumber and tomato salad with herbs',
          difficulty: 'Easy',
          cookTime: '10 minutes',
          mainIngredients: ['cucumbers', 'tomatoes', 'herbs', 'lemon juice', 'olive oil']
        }
      ]
    },
    {
      code: 'ir',
      name: 'Iran',
      flag: '🇮🇷',
      region: 'Middle East',
      cuisine: 'Persian',
      famousVegDishes: [
        {
          name: 'Kashk-e Bademjan',
          description: 'Fried eggplant with whey and herbs',
          difficulty: 'Medium',
          cookTime: '40 minutes',
          mainIngredients: ['eggplant', 'kashk', 'garlic', 'mint', 'walnuts']
        },
        {
          name: 'Kuku',
          description: 'Persian herb frittata with fresh herbs',
          difficulty: 'Medium',
          cookTime: '30 minutes',
          mainIngredients: ['eggs', 'fresh herbs', 'scallions', 'walnuts', 'barberries']
        },
        {
          name: 'Ash-e Reshteh',
          description: 'Thick noodle soup with herbs and beans',
          difficulty: 'Hard',
          cookTime: '90 minutes',
          mainIngredients: ['noodles', 'herbs', 'beans', 'lentils', 'kashk']
        }
      ]
    },

    // Oceania
    {
      code: 'au',
      name: 'Australia',
      flag: '🇦🇺',
      region: 'Oceania',
      cuisine: 'Australian',
      famousVegDishes: [
        {
          name: 'Veggie Meat Pie',
          description: 'Traditional meat pie made with vegetables and lentils',
          difficulty: 'Hard',
          cookTime: '75 minutes',
          mainIngredients: ['pastry', 'lentils', 'vegetables', 'vegetable stock', 'herbs']
        },
        {
          name: 'Lamington (Vegetarian)',
          description: 'Sponge cake covered in chocolate and coconut',
          difficulty: 'Medium',
          cookTime: '60 minutes',
          mainIngredients: ['sponge cake', 'chocolate', 'coconut', 'cream', 'jam']
        },
        {
          name: 'Bush Tomato Salad',
          description: 'Native Australian ingredients in fresh salad',
          difficulty: 'Easy',
          cookTime: '15 minutes',
          mainIngredients: ['bush tomatoes', 'native greens', 'macadamia nuts', 'lemon myrtle', 'olive oil']
        }
      ]
    },
    {
      code: 'nz',
      name: 'New Zealand',
      flag: '🇳🇿',
      region: 'Oceania',
      cuisine: 'New Zealand',
      famousVegDishes: [
        {
          name: 'Kumara Chips',
          description: 'Crispy sweet potato fries with herbs',
          difficulty: 'Easy',
          cookTime: '30 minutes',
          mainIngredients: ['kumara (sweet potato)', 'olive oil', 'rosemary', 'sea salt', 'garlic']
        },
        {
          name: 'Pavlova',
          description: 'Meringue dessert topped with fruit and cream',
          difficulty: 'Hard',
          cookTime: '120 minutes',
          mainIngredients: ['egg whites', 'sugar', 'cream', 'kiwi fruit', 'strawberries']
        },
        {
          name: 'Hokey Pokey Ice Cream',
          description: 'Vanilla ice cream with honeycomb candy',
          difficulty: 'Medium',
          cookTime: '45 minutes',
          mainIngredients: ['cream', 'vanilla', 'honeycomb candy', 'milk', 'sugar']
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiResults, setAiResults] = useState<string>('');
  const [showAIResults, setShowAIResults] = useState(false);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.famousVegDishes.some(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.mainIngredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  const toggleCountryExpansion = (countryCode: string) => {
    setExpandedCountry(expandedCountry === countryCode ? null : countryCode);
  };

  const searchWithAI = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    setIsAISearching(true);
    setShowAIResults(true);
    
    try {
      const prompt = `
You are a vegetarian cuisine expert. The user is searching for: "${searchTerm}"

Please provide helpful information about vegetarian dishes, countries, or cuisines related to this search. Include:

1. Relevant vegetarian dishes from different countries
2. Brief descriptions of the dishes
3. Key ingredients
4. Cultural significance or interesting facts
5. Cooking tips if applicable

Keep the response informative but concise, and focus only on vegetarian/vegan options. Format the response in a friendly, helpful manner.

Search query: "${searchTerm}"
`;

      const ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
      const searchModel = import.meta.env.VITE_SEARCH_MODEL || 'gemma2:latest';

      const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: searchModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          }
        })
      });

      if (!response.ok) {
        throw new Error('AI search service not available');
      }

      const data = await response.json();
      setAiResults(data.response);
      
    } catch (error) {
      console.error('AI search failed:', error);
      setAiResults('AI search is currently unavailable. Please make sure Ollama is running.');
    } finally {
      setIsAISearching(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Vegetarian Dishes Around the World</h1>
        <p className="text-lg text-gray-600 mb-2">
          Discover delicious vegetarian cuisines from different countries and cultures
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          <GlobeAltIcon className="h-4 w-4 mr-2" />
          {countries.length} Countries • Global Vegetarian Cuisine Explorer
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search countries, cuisines, dishes, or ingredients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && searchWithAI()}
              />
            </div>
            <button
              onClick={searchWithAI}
              disabled={isAISearching || !searchTerm.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <SparklesIcon className="h-4 w-4" />
              {isAISearching ? 'Searching...' : 'AI Search'}
            </button>
          </div>
          
          {searchTerm && (
            <p className="text-sm text-gray-600 text-center">
              Found {filteredCountries.length} countries matching "{searchTerm}"
            </p>
          )}
        </div>
      </div>

      {/* AI Results */}
      {showAIResults && (
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Search Results</h3>
              <button
                onClick={() => setShowAIResults(false)}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              {isAISearching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-gray-600">AI is searching for vegetarian dishes...</span>
                </div>
              ) : (
                <div className="text-gray-700 whitespace-pre-line">{aiResults}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <div key={country.code} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Country Header */}
            <button
              onClick={() => toggleCountryExpansion(country.code)}
              className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{country.name}</h3>
                    <p className="text-sm text-gray-600">{country.region}</p>
                    <p className="text-xs text-green-600 font-medium">{country.cuisine} Cuisine</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  {expandedCountry === country.code ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-xs text-gray-500">{country.famousVegDishes.length} dishes</span>
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {expandedCountry === country.code && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="space-y-4 mt-4">
                  {country.famousVegDishes.map((dish, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{dish.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(dish.difficulty)}`}>
                          {dish.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{dish.cookTime}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Main Ingredients:</p>
                        <div className="flex flex-wrap gap-1">
                          {dish.mainIngredients.map((ingredient, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCountries.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <GlobeAltIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No countries found</h3>
          <p className="text-gray-600 mb-4">Try searching for different keywords or use AI search for more results.</p>
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Show All Countries
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryIndex;
