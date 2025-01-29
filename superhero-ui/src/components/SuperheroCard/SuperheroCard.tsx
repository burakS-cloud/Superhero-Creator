import { Superhero } from "../../types/superhero.ts";
import styles from "./SuperheroCard.module.css";

interface SuperheroCardProps {
  hero: Superhero;
  onDelete: (id: number) => Promise<void>;
}

export const SuperheroCard = ({ hero, onDelete }: SuperheroCardProps) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${hero.name}?`)) {
      await onDelete(hero.id);
    }
  };

  return (
    <div className={styles.card}>
      <h3>{hero.name}</h3>
      <p>
        <strong>Superpower:</strong> {hero.superpower}
      </p>
      <p>
        <strong>Humility Score:</strong> {hero.humilityScore}
      </p>
      <button onClick={handleDelete} className={styles.deleteButton}>
        Delete
      </button>
    </div>
  );
};
