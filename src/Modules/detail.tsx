import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "./Detail.module.css";

interface Photo {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  description?: string;
}

interface LocationState {
  photos: Photo[];
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState;
  const photos = state?.photos || [];

  const currentIndex = photos.findIndex((p) => p.id === id);
  const currentPhoto =
    currentIndex >= 0 ? photos[currentIndex] : photos[0];

  const handlePrev = () => {
    const prevIndex =
      currentIndex <= 0 ? photos.length - 1 : currentIndex - 1;
    const prevPhoto = photos[prevIndex];
    navigate(`/detail/${prevPhoto.id}`, { state: { photos } });
  };

  const handleNext = () => {
    const nextIndex =
      currentIndex >= photos.length - 1 ? 0 : currentIndex + 1;
    const nextPhoto = photos[nextIndex];
    navigate(`/detail/${nextPhoto.id}`, { state: { photos } });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{currentPhoto.title}</h2>
      <p className={styles.date}>
        Date Created:{" "}
        {currentPhoto.date
          ? new Date(currentPhoto.date).toLocaleDateString()
          : "Unknown"}
      </p>
        {currentPhoto.description && (
          <p className={styles.description}>{currentPhoto.description}</p>
        )}

      <img
        src={currentPhoto.imageUrl || "https://via.placeholder.com/400"}
        alt={currentPhoto.title}
        className={styles.image}
      />

      <div className={styles.buttons}>
        <button onClick={handlePrev} className={styles.button}>
          &lt; Previous
        </button>
        <button onClick={handleNext} className={styles.button}>
          Next &gt;
        </button>
      </div>

    </div>
  );
};

export default Detail;