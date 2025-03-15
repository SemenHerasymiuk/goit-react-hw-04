import styles from './ImageCard.module.css';

const ImageCard = ({ image, onClick }) => {
  return (
    <div 
      className={styles.imageCard}
      onClick={() => onClick(image)}
    >
      <img
        src={image.urls.small}
        alt={image.alt_description || 'Image'}
        className={styles.image}
        loading="lazy"
      />
    </div>
  );
};

export default ImageCard; 