import React from 'react'
import "./search.css"
import 'bootstrap-icons/font/bootstrap-icons.css';

const Search = () => {
  return (
    <div className='search'>
      <i className="bi bi-search"></i>
      <input type='text' placeholder='search'></input>
    </div>
  )
}

export default Search
