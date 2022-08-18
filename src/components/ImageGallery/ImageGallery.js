import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Notiflix from 'notiflix';
import fetchImages from '../../api/api';
import ImageGalleryList from './ImageGalleryList/ImageGalleryList';
import Button from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

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

export const ImageGallery = ({ searchValue }) => {
  const [imagesList, setImagesList] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(Status.IDLE);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);

  useEffect(() => {
    if (!searchValue) {
      return;
    }

    fetchPictures();
  }, [searchValue]);

  const fetchPictures = () => {
    setStatus(Status.PENDING);

    try {
      fetchImages(searchValue, page).then(res => {
        if (res.total === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          setStatus(Status.IDLE);
          setImagesList(null);
          return;
        }
        Notiflix.Notify.success(`Good, there are ${res.totalHits} results.`);
        setImagesList(res.hits);
        setPage(2);
        setStatus(Status.RESOLVED);
        setActiveBtn(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onBtnClick = () => {
    setStatus(Status.PENDING);
    setActiveBtn(true);

    try {
      fetchImages(searchValue, page).then(res => {
        if (page > res.totalHits / 12) {
          Notiflix.Notify.warning(
            'We are sorry, but you have reached the end of search results.'
          );
          setStatus(Status.IDLE);
          setActiveBtn(true);
          return;
        }

        setImagesList(prevImgList => [...prevImgList, ...res.hits]);
        setPage(prevPage => prevPage + 1);
        setStatus(Status.RESOLVED);
        setActiveBtn(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const setInfoForModal = url => {
    setModalImageUrl(url);
    toggleModal();
  };

  if (status === Status.PENDING) {
    Loading.dots();
  } else {
    Loading.remove();
  }

  if (imagesList || status === Status.RESOLVED) {
    return (
      <div>
        <ImageGalleryList
          imagesList={imagesList}
          setInfoForModal={setInfoForModal}
        />
        <Button onBtnClick={onBtnClick} disabled={activeBtn} />
        {showModal && (
          <Modal onClose={toggleModal} largeImageURL={modalImageUrl} />
        )}
      </div>
    );
  }
};

ImageGallery.propTypes = {
  searchValue: PropTypes.string.isRequired,
};
