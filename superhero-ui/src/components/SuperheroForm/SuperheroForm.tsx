import { ChangeEvent, FormEvent, useState } from "react";
import { NewSuperhero } from "../../types/superhero";
import styles from "./SuperheroForm.module.css";

interface SuperheroFormProps {
  onSubmit: (
    hero: Omit<NewSuperhero, "humilityScore"> & { humilityScore: number }
  ) => Promise<void>;
}

export const SuperheroForm = ({ onSubmit }: SuperheroFormProps) => {
  const [newHero, setNewHero] = useState<NewSuperhero>({
    name: "",
    superpower: "",
    humilityScore: "",
  });
  const [error, setError] = useState<string>("");

  const validateHumilityScore = (score: string): boolean => {
    const numScore = Number(score);
    return !isNaN(numScore) && numScore >= 1 && numScore <= 10;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!validateHumilityScore(newHero.humilityScore)) {
      setError("Humility score must be a number between 1 and 10");
      return;
    }

    try {
      await onSubmit({
        ...newHero,
        humilityScore: Number(newHero.humilityScore),
      });
      setNewHero({ name: "", superpower: "", humilityScore: "" });
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while creating the superhero");
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setError("");

    // Immediate validation for humility score
    if (name === "humilityScore" && value !== "") {
      if (!validateHumilityScore(value)) {
        setError("Humility score must be a number between 1 and 10");
      }
    }

    setNewHero((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add New Superhero</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newHero.name}
          onChange={handleChange}
          placeholder="Superhero Name"
          required
        />
        <input
          type="text"
          name="superpower"
          value={newHero.superpower}
          onChange={handleChange}
          placeholder="Superpower"
          required
        />
        <input
          type="number"
          name="humilityScore"
          value={newHero.humilityScore}
          onChange={handleChange}
          placeholder="Humility Score (1-10)"
          min="1"
          max="10"
          step="1"
          required
        />
        <button type="submit">Add Superhero</button>
      </form>
    </div>
  );
};
