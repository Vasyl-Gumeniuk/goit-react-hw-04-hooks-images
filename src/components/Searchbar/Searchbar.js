import { useState } from 'react';
import PropTypes from 'prop-types';
import searchIcon from '../../icons/searchIcon.svg';
import Notiflix from 'notiflix';
import styles from './styles.module.css';

Notiflix.Notify.init({
  position: 'right-top',
  width: '400px',
  fontSize: '20px',
});

export const Searchbar = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = evt => {
    const { value } = evt.currentTarget;
    setInputValue(value);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    if (inputValue.trim() === '') {
      Notiflix.Notify.info('Please enter request.');
      return;
    }

    let inputData = inputValue;

    onSubmit(inputData);
    resetForm();
  };

  const resetForm = () => {
    setInputValue('');
  };

  return (
    <header className={styles.searchbar}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <button type="submit" className={styles.button}>
          <img src={searchIcon} height={30} alt="search-icon"></img>
        </button>

        <input
          className={styles.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={inputValue}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
