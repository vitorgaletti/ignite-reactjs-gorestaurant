import { useEffect, useState } from 'react';

import { api } from '../../services/api';

import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { IFood } from '../../types';

import { FoodsContainer } from './styles';

const Dashboard = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalIsOpen, setModaIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');
      const data = response.data;
      setFoods(data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(food: IFood) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: IFood) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food
      });

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModaIsOpen(!modalIsOpen);
  }

  function toggleEditModal() {
    setEditModalIsOpen(!editModalIsOpen);
  }

  function handleEditFood(food: IFood) {
    setEditingFood(food);
    setEditModalIsOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalIsOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalIsOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
