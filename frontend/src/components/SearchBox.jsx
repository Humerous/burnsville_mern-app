import React, { forwardRef, useState } from 'react';
import { SearchIcon } from './header/HeaderIcons';

const SearchBox = forwardRef(
  (
    {
      autoFocus = false,
      className = '',
      history,
      id = 'product-search',
      onNavigate,
    },
    inputRef
  ) => {
    const [keyword, setKeyword] = useState('');

    const submitHandler = (event) => {
      event.preventDefault();
      const searchTerm = keyword.trim();
      history.push(searchTerm ? `/search/${encodeURIComponent(searchTerm)}` : '/');
      onNavigate?.();
    };

    return (
      <form
        className={`burnsville-search ${className}`.trim()}
        onSubmit={submitHandler}
        role='search'
      >
        <label className='burnsville-header__sr-only' htmlFor={id}>
          Search products
        </label>
        <SearchIcon className='burnsville-search__icon' size={19} />
        <input
          autoFocus={autoFocus}
          autoComplete='off'
          className='burnsville-search__input'
          id={id}
          name='q'
          onChange={(event) => setKeyword(event.target.value)}
          placeholder='Search sauces'
          ref={inputRef}
          type='search'
          value={keyword}
        />
        <button className='burnsville-search__submit' type='submit'>
          Search
        </button>
      </form>
    );
  }
);

SearchBox.displayName = 'SearchBox';

export default SearchBox;
