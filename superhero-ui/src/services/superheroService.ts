import axios from "axios";
import { NewSuperhero, Superhero } from "../types/superhero";

const API_URL = "http://localhost:3000/superheroes";

export const superheroService = {
  async getAllSuperheroes(): Promise<Superhero[]> {
    const response = await axios.get<Superhero[]>(API_URL);
    return response.data;
  },

  async createSuperhero(
    hero: Omit<NewSuperhero, "humilityScore"> & { humilityScore: number }
  ): Promise<Superhero> {
    const response = await axios.post<Superhero>(API_URL, hero);
    return response.data;
  },

  async deleteSuperhero(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
