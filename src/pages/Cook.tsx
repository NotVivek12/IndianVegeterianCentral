import { useState, useRef } from 'react';
import { CakeIcon, PlusIcon, XMarkIcon, ClockIcon, UsersIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Recipe {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
}

const Cook: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(['vegetarian']);
  const [mealType, setMealType] = useState('any');
  const [cookingTime, setCookingTime] = useState('any');
  const [difficulty, setDifficulty] = useState('any');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState('');
  
  const ingredientInputRef = useRef<HTMLInputElement>(null);

  // Comprehensive list of non-vegetarian ingredients
  const nonVegIngredients = [
    // Meat
    'chicken', 'beef', 'pork', 'lamb', 'mutton', 'goat', 'veal', 'duck', 'turkey', 'rabbit', 'venison',
    'bacon', 'ham', 'sausage', 'pepperoni', 'salami', 'prosciutto', 'chorizo', 'hot dog', 'frankfurter',
    'ground beef', 'ground chicken', 'ground pork', 'ground turkey', 'ground lamb', 'mince', 'minced meat',
    'steak', 'chops', 'ribs', 'wings', 'drumstick', 'thigh', 'breast', 'leg', 'shoulder',
    
    // Seafood
    'fish', 'salmon', 'tuna', 'cod', 'tilapia', 'mackerel', 'sardine', 'anchovy', 'herring', 'trout',
    'shrimp', 'prawn', 'lobster', 'crab', 'oyster', 'mussel', 'clam', 'scallop', 'squid', 'octopus',
    'crayfish', 'crawfish', 'sea bass', 'halibut', 'flounder', 'sole', 'snapper', 'grouper',
    
    // Poultry
    'poultry', 'fowl', 'game bird', 'quail', 'pheasant', 'goose',
    
    // Processed meat products
    'meatball', 'meat loaf', 'meat pie', 'burger patty', 'chicken nugget', 'fish stick', 'fish cake',
    'meat sauce', 'bolognese', 'carbonara', 'fish sauce', 'oyster sauce', 'anchovy paste',
    
    // Animal-derived ingredients that are not vegetarian
    'gelatin', 'gelatine', 'lard', 'tallow', 'suet', 'meat stock', 'chicken stock', 'beef stock',
    'fish stock', 'bone broth', 'chicken broth', 'beef broth', 'meat broth',
    
    // Regional/ethnic meat terms
    'keema', 'tandoori chicken', 'butter chicken', 'chicken tikka', 'mutton curry', 'fish curry',
    'biryani chicken', 'chicken biryani', 'meat biryani', 'korma chicken', 'vindaloo'
  ];

  const detectNonVegIngredients = (ingredientsList: string[]) => {
    const detected: string[] = [];
    
    ingredientsList.forEach(ingredient => {
      const lowerIngredient = ingredient.toLowerCase().trim();
      
      // Check for exact matches or partial matches
      nonVegIngredients.forEach(nonVegItem => {
        if (lowerIngredient.includes(nonVegItem) || nonVegItem.includes(lowerIngredient)) {
          if (!detected.includes(ingredient)) {
            detected.push(ingredient);
          }
        }
      });
    });
    
    return detected;
  };

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim().toLowerCase())) {
      const newIngredient = currentIngredient.trim().toLowerCase();
      
      // Check if the new ingredient is non-vegetarian
      const nonVegDetected = detectNonVegIngredients([newIngredient]);
      if (nonVegDetected.length > 0) {
        setError(`"${newIngredient}" is not suitable for vegetarian recipes. Please add only vegetarian ingredients.`);
        setCurrentIngredient('');
        ingredientInputRef.current?.focus();
        return;
      }
      
      // Clear any previous error and add the ingredient
      setError('');
      setIngredients([...ingredients, newIngredient]);
      setCurrentIngredient('');
      ingredientInputRef.current?.focus();
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const toggleDietaryPreference = (pref: string) => {
    setDietaryPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    // Check for non-vegetarian ingredients
    const nonVegDetected = detectNonVegIngredients(ingredients);
    if (nonVegDetected.length > 0) {
      setError(`Cannot generate vegetarian recipe. Non-vegetarian ingredients detected: ${nonVegDetected.join(', ')}. Please remove these ingredients and try again.`);
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const prompt = `
You are an expert vegetarian chef. Create a delicious vegetarian recipe using the following available ingredients and preferences:

AVAILABLE INGREDIENTS: ${ingredients.join(', ')}
DIETARY PREFERENCES: ${dietaryPreferences.join(', ')}
MEAL TYPE: ${mealType}
COOKING TIME: ${cookingTime}
DIFFICULTY LEVEL: ${difficulty}

Please create a complete recipe that:
1. Uses primarily the available ingredients (it's okay to add common pantry items)
2. Is strictly vegetarian (no meat, fish, or seafood)
3. Is practical and achievable
4. Includes clear step-by-step instructions

Respond in this exact JSON format:
{
  "name": "Recipe Name",
  "description": "Brief appetizing description",
  "prepTime": "X minutes",
  "cookTime": "X minutes", 
  "servings": "X people",
  "difficulty": "Easy/Medium/Hard",
  "ingredients": [
    "ingredient 1 with quantity",
    "ingredient 2 with quantity"
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "tips": [
    "Helpful tip 1",
    "Helpful tip 2"
  ]
}

Make sure the recipe is creative, flavorful, and makes good use of the available ingredients. Include approximate quantities for all ingredients.
`;

      const ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
      const recipeModel = import.meta.env.VITE_RECIPE_MODEL || 'gemma2:latest';

      const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: recipeModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama service not available. Make sure Ollama is running on ${ollamaBaseUrl}`);
      }

      const data = await response.json();
      const llmResponse = data.response;
      
      // Extract JSON from the response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const recipeData = JSON.parse(jsonMatch[0]);
      setRecipe(recipeData);
      
    } catch (error) {
      console.error('Recipe generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setIngredients([]);
    setCurrentIngredient('');
    setRecipe(null);
    setError('');
    setMealType('any');
    setCookingTime('any');
    setDifficulty('any');
    setDietaryPreferences(['vegetarian']);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cook With What You Have</h1>
        <p className="text-lg text-gray-600 mb-2">
          Tell us what ingredients you have, and we'll create a delicious vegetarian recipe for you!
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          <CakeIcon className="h-4 w-4 mr-2" />
          AI-Powered Recipe Generation
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Ingredients</h2>
            
            {/* Ingredient Input */}
            <div className="flex gap-2 mb-4">
              <input
                ref={ingredientInputRef}
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add vegetarian ingredients only (e.g., tomatoes, onions, rice, paneer)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={addIngredient}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add
              </button>
            </div>

            {/* Ingredients List */}
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredients.map((ingredient, index) => {
                const isNonVeg = detectNonVegIngredients([ingredient]).length > 0;
                return (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      isNonVeg 
                        ? 'bg-red-100 text-red-800 border border-red-300' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {isNonVeg && <span className="text-red-600">⚠️</span>}
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(index)}
                      className={`hover:${isNonVeg ? 'text-red-900' : 'text-green-800'} ${
                        isNonVeg ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Non-veg warning */}
            {ingredients.length > 0 && detectNonVegIngredients(ingredients).length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div>
                    <p className="text-red-700 font-medium text-sm">Non-vegetarian ingredients detected!</p>
                    <p className="text-red-600 text-sm">
                      Please remove: <strong>{detectNonVegIngredients(ingredients).join(', ')}</strong> to generate vegetarian recipes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {ingredients.length === 0 && (
              <p className="text-gray-500 text-sm italic">No ingredients added yet. Start typing to add some!</p>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Preferences</h3>
            
            <div className="space-y-4">
              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="any">Any</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>

              {/* Cooking Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Time</label>
                <select
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="any">Any</option>
                  <option value="quick">Quick (Under 30 mins)</option>
                  <option value="medium">Medium (30-60 mins)</option>
                  <option value="long">Long (Over 1 hour)</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="any">Any</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {['vegetarian', 'vegan', 'gluten-free', 'dairy-free'].map((pref) => (
                    <button
                      key={pref}
                      onClick={() => toggleDietaryPreference(pref)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        dietaryPreferences.includes(pref)
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-4">
            <button
              onClick={generateRecipe}
              disabled={isGenerating || ingredients.length === 0 || detectNonVegIngredients(ingredients).length > 0}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <CakeIcon className="h-5 w-5" />
                  Generate Recipe
                </>
              )}
            </button>
            
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Recipe Display Section */}
        <div className="space-y-6">
          {recipe ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.name}</h2>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                
                {/* Recipe Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    Prep: {recipe.prepTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    Cook: {recipe.cookTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersIcon className="h-4 w-4" />
                    Serves: {recipe.servings}
                  </div>
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {recipe.difficulty}
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                <ul className="space-y-1">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white text-sm rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              {recipe.tips && recipe.tips.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Chef's Tips</h3>
                  <ul className="space-y-2">
                    {recipe.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">💡</span>
                        <span className="text-gray-700 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <CakeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Cook?</h3>
              <p className="text-gray-600">
                Add your available ingredients and preferences, then click "Generate Recipe" to get a personalized vegetarian recipe created just for you!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cook;
