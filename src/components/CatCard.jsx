import { useEffect, useState } from "react";
import "./CatCard.css";

function CatCard() {
  const [cat, setCat] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function getCat() {
      try {
        setError("");
        setLoading(true);
        const response = await fetch(
          "https://api.freeapi.app/api/v1/public/cats/cat/random",
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Could not load cat");
        }

        const data = await response.json();
        setCat(data.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError("Unable to load a cat profile right now.");
        }
      } finally {
        setLoading(false);
      }
    }

    getCat();

    return () => {
      controller.abort();
    };
  }, []);

  const renderRating = (value) => {
    const score = Number(value) || 0;
    return "★".repeat(score) + "☆".repeat(5 - score);
  };

  if (loading) {
    return (
      <main className="cat-page">
        <div className="cat-state">Loading cat profile...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="cat-page">
        <div className="cat-state cat-error">{error}</div>
      </main>
    );
  }

  return (
    <main className="cat-page">
      <section className="cat-hero">
        <p className="cat-kicker">Random breed profile</p>
        <h1>{cat.name || "Cat Profile"}</h1>
        <p>{cat.description}</p>
      </section>

      <article className="cat-card">
        <img className="cat-image" src={cat.image} alt={cat.name} />

        <div className="cat-content">
          <div className="cat-meta-grid">
            <p>
              <span>Origin</span>
              {cat.origin || "Unknown"}
            </p>
            <p>
              <span>Lifespan</span>
              {cat.life_span || "Unknown"} years
            </p>
            <p>
              <span>Weight</span>
              {cat?.weight?.metric || "N/A"} kg
            </p>
            <p>
              <span>Temperament</span>
              {cat.temperament || "Unknown"}
            </p>
          </div>

          <section className="cat-section">
            <h2>Traits</h2>
            <ul className="cat-traits">
              <li>
                <span>Adaptability</span>
                <strong>{renderRating(cat.adaptability)}</strong>
              </li>
              <li>
                <span>Affection</span>
                <strong>{renderRating(cat.affection_level)}</strong>
              </li>
              <li>
                <span>Child Friendly</span>
                <strong>{renderRating(cat.child_friendly)}</strong>
              </li>
              <li>
                <span>Dog Friendly</span>
                <strong>{renderRating(cat.dog_friendly)}</strong>
              </li>
              <li>
                <span>Intelligence</span>
                <strong>{renderRating(cat.intelligence)}</strong>
              </li>
            </ul>
          </section>

          {cat.wikipedia_url && (
            <a
              className="cat-link"
              href={cat.wikipedia_url}
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          )}
        </div>
      </article>
    </main>
  );
}

export default CatCard;
