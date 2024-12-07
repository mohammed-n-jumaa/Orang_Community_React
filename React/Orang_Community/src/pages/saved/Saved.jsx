import React from 'react';
import "./Saved.scss";
import SavedPosts from "../../components/saveposts/SavedPosts";


const Saved = () => {
  return (
    <div className="home">
      <SavedPosts />
    </div>
  );
};

export default Saved;