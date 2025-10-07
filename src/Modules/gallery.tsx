import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Gallery.module.css";

interface NasaPic {
  id: string;
  title: string;
  date: string;
  albums: string[];
  imageUrl: string;
  description: string;
}

const Gallery: React.FC = () => {
  const [pics, setPics] = useState<NasaPic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchWord, setSearchWord] = useState("galaxy");
  const [text, setText] = useState("");
  const [albumFilter, setAlbumFilter] = useState("");

  const getPics = async (word: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://images-api.nasa.gov/search?q=${word}&media_type=image`
      );

      const items = res.data.collection.items
        .filter((x: any) => x.links?.[0]?.href)
        .slice(0, 50)
        .map((x: any) => {
          const data = x.data[0];
          const albums =
            data.album && data.album.length > 0 ? data.album : ["Other"];
          return {
            id: data.nasa_id,
            title: data.title,
            date: data.date_created,
            albums,
            imageUrl: x.links[0].href,
            description: data.description,
          };
        });

      setPics(items);
    } catch (err) {
      console.log("Problem fetching pics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPics(searchWord);
  }, [searchWord]);


  const albumSet = new Set<string>();
  let hasOther = false;

  pics.forEach((p) => {
    if (p.albums && p.albums.length > 0) {
      p.albums.forEach((a) => albumSet.add(a));
    } else {
      hasOther = true;
    }
  });

  const allAlbums = Array.from(albumSet).sort();
  if (hasOther || pics.some((p) => p.albums.includes("Other"))) {
    allAlbums.push("Other");
  }

  const shownPics = pics.filter(
    (p) => !albumFilter || p.albums.includes(albumFilter)
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchWord(text.trim() || "galaxy");
    setAlbumFilter("");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Gallery</h2>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search pictures"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Search
        </button>
      </form>

      <div className={styles.filters}>
        <select
          value={albumFilter}
          onChange={(e) => setAlbumFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">All Albums</option>
          {allAlbums.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <div className={styles.grid}>
          {shownPics.map((pic) => (
            <Link
              key={pic.id}
              to={`/detail/${pic.id}`}
              state={{ photos: shownPics }}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <img
                  src={pic.imageUrl || "https://via.placeholder.com/200"}
                  alt={pic.title}
                />
                <p className={styles.cardTitle}>{pic.title}</p>
                <p className={styles.cardDate}>
                  {pic.date ? pic.date.slice(0, 10) : "Unknown date"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
