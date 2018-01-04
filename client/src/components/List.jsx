import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
    <h4> There are { props.books.length } books being read so far.</h4>
    { props.books.map(book => <ListItem book={book}/>)}
  </div>
)

export default List;