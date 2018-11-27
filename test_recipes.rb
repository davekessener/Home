require_relative 'main'

mehl = Ingredient.new(name: 'Mehl')
mehl.save
mehl_405 = IngredientVariation.new(name: '405', ingredient: mehl, description: 'Normales Mehl (Typ 405)', unit: 1)
mehl_405.save

eier = Ingredient.new(name: 'Ei')
eier.save
eier_ = IngredientVariation.new(ingredient: eier, unit: 0)
eier_.save

ingredients = IngredientList.new
ingredients.save

i_mehl = BaseIngredient.new(ingredient_list: ingredients, ingredient_variation: mehl_405, quantity: 500)
i_mehl.save

i_eier = BaseIngredient.new(ingredient_list: ingredients, ingredient_variation: eier_, quantity: 5)
i_eier.save

spetzle = Dish.new(name: 'Spetzle', ingredient_list: ingredients, instructions: "Zutaten mischen\nIn gesalzenem, kochenden Wasser garen", prep_time: 5 * 60, cook_time: 30 * 60)
spetzle.save

