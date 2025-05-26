import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './constructorSlice';

describe('Constructor Slice Reducer', () => {
  const defaultInitialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    loading: false,
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  describe('addIngredient action', () => {
    it('should add an ingredient to the ingredients array', () => {
      // Arrange
      const ingredient = {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
      };

      // Act
      const newState = constructorSlice(defaultInitialState, addIngredient(ingredient));

      // Assert
      const addedIngredient = newState.constructorItems.ingredients[0];
      expect(addedIngredient).toEqual({
        ...ingredient,
        id: expect.any(String)
      });
    });

    it('should add a bun to an empty bun slot', () => {
      // Arrange
      const bun = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      };

      // Act
      const newState = constructorSlice(defaultInitialState, addIngredient(bun));

      // Assert
      expect(newState.constructorItems.bun).toEqual({
        ...bun,
        id: expect.any(String)
      });
    });

    it('should replace existing bun with a new one', () => {
      // Arrange
      const initialStateWithBun = {
        ...defaultInitialState,
        constructorItems: {
          bun: {
            _id: '643d69a5c3f7b9001cfa093c',
            name: 'Краторная булка N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            id: 'existing-bun-id',
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
          },
          ingredients: []
        }
      };

      const newBun = {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      };

      // Act
      const newState = constructorSlice(initialStateWithBun, addIngredient(newBun));

      // Assert
      expect(newState.constructorItems.bun).toEqual({
        ...newBun,
        id: expect.any(String)
      });
    });
  });

  describe('removeIngredient action', () => {
    it('should remove an ingredient from the constructor', () => {
      // Arrange
      const stateWithIngredient = {
        ...defaultInitialState,
        constructorItems: {
          bun: null,
          ingredients: [
            {
              id: 'ingredient-id',
              _id: '643d69a5c3f7b9001cfa0944',
              name: 'Соус традиционный галактический',
              type: 'sauce',
              proteins: 42,
              fat: 24,
              carbohydrates: 42,
              calories: 99,
              price: 15,
              image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
            }
          ]
        }
      };

      // Act
      const newState = constructorSlice(stateWithIngredient, removeIngredient('ingredient-id'));

      // Assert
      expect(newState.constructorItems.ingredients).toEqual([]);
    });
  });

  describe('ingredient position actions', () => {
    const stateWithIngredients = {
      ...defaultInitialState,
      constructorItems: {
        bun: {
          id: 'bun-id',
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        },
        ingredients: [
          {
            id: 'ingredient-1',
            _id: '643d69a5c3f7b9001cfa0944',
            name: 'Соус традиционный галактический',
            type: 'sauce',
            proteins: 42,
            fat: 24,
            carbohydrates: 42,
            calories: 99,
            price: 15,
            image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
          },
          {
            id: 'ingredient-2',
            _id: '643d69a5c3f7b9001cfa0946',
            name: 'Хрустящие минеральные кольца',
            type: 'main',
            proteins: 808,
            fat: 689,
            carbohydrates: 609,
            calories: 986,
            price: 300,
            image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
          },
          {
            id: 'ingredient-3',
            _id: '643d69a5c3f7b9001cfa0947',
            name: 'Плоды Фалленианского дерева',
            type: 'main',
            proteins: 20,
            fat: 5,
            carbohydrates: 55,
            calories: 77,
            price: 874,
            image: 'https://code.s3.yandex.net/react/code/sp_1.png',
            image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
            image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
          }
        ]
      }
    };

    const expectedOrderAfterMove = [
      {
        id: 'ingredient-1',
        _id: '643d69a5c3f7b9001cfa0944',
        name: 'Соус традиционный галактический',
        type: 'sauce',
        proteins: 42,
        fat: 24,
        carbohydrates: 42,
        calories: 99,
        price: 15,
        image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
      },
      {
        id: 'ingredient-3',
        _id: '643d69a5c3f7b9001cfa0947',
        name: 'Плоды Фалленианского дерева',
        type: 'main',
        proteins: 20,
        fat: 5,
        carbohydrates: 55,
        calories: 77,
        price: 874,
        image: 'https://code.s3.yandex.net/react/code/sp_1.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
      },
      {
        id: 'ingredient-2',
        _id: '643d69a5c3f7b9001cfa0946',
        name: 'Хрустящие минеральные кольца',
        type: 'main',
        proteins: 808,
        fat: 689,
        carbohydrates: 609,
        calories: 986,
        price: 300,
        image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
      }
    ];

    it('should move an ingredient up in the list', () => {
      // Act
      const newState = constructorSlice(stateWithIngredients, moveIngredientUp(2));
      
      // Assert
      expect(newState.constructorItems.ingredients).toEqual(expectedOrderAfterMove);
    });

    it('should move an ingredient down in the list', () => {
      // Act
      const newState = constructorSlice(stateWithIngredients, moveIngredientDown(1));
      
      // Assert
      expect(newState.constructorItems.ingredients).toEqual(expectedOrderAfterMove);
    });
  });

  describe('orderBurger async action', () => {
    it('should handle pending state', () => {
      // Act
      const action = { type: orderBurger.pending.type, payload: null };
      const state = constructorSlice(defaultInitialState, action);
      
      // Assert
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state', () => {
      // Arrange
      const errorMessage = 'Failed to place order';
      const action = { 
        type: orderBurger.rejected.type, 
        error: { message: errorMessage } 
      };
      
      // Act
      const state = constructorSlice(defaultInitialState, action);
      
      // Assert
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orderModalData).toBe(null);
    });

    it('should handle fulfilled state', () => {
      // Arrange
      const orderData = { order: { number: 12345 } };
      const action = { 
        type: orderBurger.fulfilled.type, 
        payload: orderData 
      };
      
      // Act
      const state = constructorSlice(defaultInitialState, action);
      
      // Assert
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.orderModalData?.number).toBe(orderData.order.number);
    });
  });
});
