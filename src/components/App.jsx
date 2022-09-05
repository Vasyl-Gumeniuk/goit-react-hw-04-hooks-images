import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import fetchImages from '../api/api';
import Button from '../components/Button/Button';
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  position: 'right-top',
  width: '400px',
  fontSize: '20px',
  timeout: 3000,
});

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export function App() {
  const [searchValue, setSearchValue] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(Status.IDLE);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);
  const [totalHits, setTotalHits] = useState(null);

  const addSearchValue = inputData => {
    setSearchValue(inputData);
    resetStates();
  };

  useEffect(() => {
    if (!searchValue) {
      return;
    }

    fetchPictures();
  }, [searchValue, page]);

  const fetchPictures = () => {
    setStatus(Status.PENDING);
    setActiveBtn(true);

    try {
      fetchImages(searchValue, page).then(res => {
        if (res.total === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          setStatus(Status.IDLE);
          setImagesList([]);
          return;
        }

        if (page === 1) {
          Notiflix.Notify.success(`Good, there are ${res.totalHits} results.`);
        }

        if (res.hits.length !== 0) {
          setImagesList(prevImgList => [...prevImgList, ...res.hits]);
          setStatus(Status.RESOLVED);
          setActiveBtn(false);
          setTotalHits(res.totalHits);
        }

        if (page > res.totalHits / 12) {
          Notiflix.Notify.warning(
            'We are sorry, but you have reached the end of search results.'
          );
          setStatus(Status.IDLE);
          return;
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const resetStates = () => {
    setImagesList([]);
    setPage(1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const setInfoForModal = url => {
    setModalImageUrl(url);
    toggleModal();
  };

  return (
    <div>
      <Searchbar onSubmit={addSearchValue} />
      <ImageGallery
        searchValue={searchValue}
        imagesList={imagesList}
        status={status}
        modalImageUrl={modalImageUrl}
        showModal={showModal}
        toggleModal={toggleModal}
        setInfoForModal={setInfoForModal}
      />
      {imagesList.length > 0 && imagesList.length < totalHits && (
        <Button
          onBtnClick={() => setPage(prevPage => prevPage + 1)}
          disabled={activeBtn}
        />
      )}
      ;
    </div>
  );
}
