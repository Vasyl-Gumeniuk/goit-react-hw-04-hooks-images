import { useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';

export function App() {
  const [searchValue, setSearchValue] = useState('');

  const addSearchValue = inputData => {
    setSearchValue(inputData);
  };

  return (
    <div>
      <Searchbar onSubmit={addSearchValue} />
      <ImageGallery searchValue={searchValue} />
    </div>
  );
}
