import React, { useState } from 'react';
import Menu from './Menu';
import Product from './Product';
import Popular from './Popular';

function ParentComponent({refRestCart, page}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div>
      {page === 'Home' ? <Popular refreshCart={refRestCart}/> : null}
      <Menu onSelectCategory={handleCategorySelect} />
      <Product categoryId={selectedCategoryId}/>
    </div>
  );
}

export default ParentComponent;