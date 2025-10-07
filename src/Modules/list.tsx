import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./List.module.css";

interface NasaThing {
  id: string;
  title: string;
  date: string;
  type: string;
  imageUrl: string;
  description?: string;
}

const List: React.FC = () => {
  const [data, setData] = useState<NasaThing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchWord, setSearchWord] = useState("galaxy");
  const [text, setText] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const getStuff = async (word: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://images-api.nasa.gov/search?q=${word}&media_type=image`
      );

      const results = res.data.collection.items
        .filter((x: any) => x.data && x.data[0] && x.links)
        .map((x: any) => ({
          id: x.data[0].nasa_id,
          description: x.data[0].description,
          title: x.data[0].title,
          date: x.data[0].date_created,
          type: x.data[0].media_type,
          imageUrl: x.links[0]?.href || "",
          
        }));

      setData(results);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStuff(searchWord);
  }, [searchWord]);

  useEffect(() => {
    const wait = setTimeout(() => {
      setSearchWord(text.trim() || "galaxy");
    }, 100);
    return () => clearTimeout(wait);
  }, [text]);

  const shown = [...data].sort((a, b) => {
    if (sortBy === "date") {
      const d1 = new Date(a.date).getTime() || 0;
      const d2 = new Date(b.date).getTime() || 0;
      return order === "asc" ? d1 - d2 : d2 - d1;
    } else {
      return order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });

  return (
    <div className={styles.listContainer}>
      <h2>Search</h2>

      <div className={styles.searchSortBar}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="type to search..."
          className={styles.input}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.select}
        >
          <option value="title">Sort by title</option>
          <option value="date">Sort by date</option>
        </select>

        <button
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          className={styles.button}
        >
          {order === "asc" ? "⬆ asc" : "⬇ desc"}
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.listVertical}>
  {shown.map((thing) => (
    <Link
      key={thing.id}
      to={`/detail/${thing.id}`}
      state={{ photos: shown }}
      className={styles.listItemLink}
    >
      <div className={styles.listItem}>
              <img
                src={thing.imageUrl || "https://via.placeholder.com/100"}
                alt={thing.title}
                className={styles.thumbnail}
              />
              <div className={styles.info}>
                <p className={styles.title}>{thing.title}</p>
                <p className={styles.date}>
                  {thing.date ? new Date(thing.date).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
};

export default List;