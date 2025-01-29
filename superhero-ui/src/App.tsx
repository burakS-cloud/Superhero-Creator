import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { SuperheroForm } from "./components/SuperheroForm/SuperheroForm";
import { SuperheroList } from "./components/SuperheroList/SuperheroList";
import { superheroService } from "./services/superheroService";
import { Superhero } from "./types/superhero";

function App() {
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);

  useEffect(() => {
    fetchSuperheroes();
  }, []);

  const fetchSuperheroes = async (): Promise<void> => {
    try {
      const heroes = await superheroService.getAllSuperheroes();
      setSuperheroes(heroes);
    } catch (error) {
      console.error("Error fetching superheroes:", error);
    }
  };

  const handleCreateSuperhero = async (
    hero: Omit<Superhero, "id">
  ): Promise<void> => {
    try {
      await superheroService.createSuperhero(hero);
      fetchSuperheroes();
    } catch (error: any) {
      throw error;
    }
  };

  const handleDeleteSuperhero = async (id: number): Promise<void> => {
    try {
      await superheroService.deleteSuperhero(id);
      fetchSuperheroes();
    } catch (error) {
      console.error("Error deleting superhero:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Superhero Registry</h1>
      <SuperheroForm onSubmit={handleCreateSuperhero} />
      <SuperheroList
        superheroes={superheroes}
        onDelete={handleDeleteSuperhero}
      />
    </div>
  );
}

export default App;
