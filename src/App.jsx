import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import Button from './components/Button/Button';
import ImageModal from './components/ImageModal/ImageModal';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import './App.css';

// Настройка axios для Unsplash API
axios.defaults.baseURL = 'https://api.unsplash.com';
axios.defaults.headers.common['Authorization'] = 'Client-ID GCFIpsn82hLPUCiquYWfLK3Oe7DufbbqqKasZBgO-Kc';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/search/photos', {
          params: {
            query: searchQuery,
            page,
            per_page: 12,
          },
        });

        setImages(prevImages => 
          page === 1 ? response.data.results : [...prevImages, ...response.data.results]
        );
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [searchQuery, page]);

  const handleSubmit = (query) => {
    setSearchQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="App">
      <SearchBar onSubmit={handleSubmit} />
      <Toaster position="top-right" />
      
      {error && <ErrorMessage message={error} />}
      
      <ImageGallery images={images} onImageClick={handleImageClick} />
      
      {isLoading && <Loader />}
      
      {images.length > 0 && !isLoading && (
        <Button onClick={handleLoadMore} />
      )}

      {selectedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          image={selectedImage}
        />
      )}
    </div>
  );
}

export default App;
