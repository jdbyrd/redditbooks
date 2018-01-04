import React from 'react';

const ListItem = (props) => (
  <div className = "book">
    <a href={props.book.url}><img src={props.book.img}/></a>
    <div className = "text">
      <a className = "link" href={props.book.url}>{props.book.title}</a>
      <span> by {props.book.author}</span>
    </div>
  </div>
)

export default ListItem;