require_relative 'main'

mehl = Recipe::Ingredient.new(name: 'Mehl')
mehl.save
mehl_405 = Recipe::IngredientVariation.new(name: '405', ingredient: mehl, description: 'Normales Mehl (Typ 405)')
mehl_405.save

eier = Recipe::Ingredient.new(name: 'Ei')
eier.save
eier_ = Recipe::IngredientVariation.new(ingredient: eier)
eier_.save

ingredients = Recipe::IngredientList.new
ingredients.save

i_mehl = Recipe::BaseIngredient.new(ingredient_list: ingredients, ingredient_variation: mehl_405, unit: 0, quantity: 500)
i_mehl.save

i_eier = Recipe::BaseIngredient.new(ingredient_list: ingredients, ingredient_variation: eier_, unit: 7, quantity: 5)
i_eier.save

spetzle = Recipe::Dish.new(name: 'Spetzle', ingredient_list: ingredients, instructions: "Zutaten mischen\nIn gesalzenem, kochenden Wasser garen", prep_time: 5 * 60, cook_time: 30 * 60)
spetzle.save

