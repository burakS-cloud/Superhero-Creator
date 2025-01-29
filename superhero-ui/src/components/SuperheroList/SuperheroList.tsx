import { Superhero } from "../../types/superhero.ts";
import { SuperheroCard } from "../SuperheroCard/SuperheroCard.tsx";
import styles from "./SuperheroList.module.css";

interface SuperheroListProps {
  superheroes: Superhero[];
  onDelete: (id: number) => Promise<void>;
}

export const SuperheroList = ({
  superheroes,
  onDelete,
}: SuperheroListProps) => {
  return (
    <div className={styles.listContainer}>
      <h2>Superheroes (Sorted by Humility)</h2>
      <div className={styles.grid}>
        {superheroes.map((hero) => (
          <SuperheroCard key={hero.id} hero={hero} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};
