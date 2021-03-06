import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      books: [{title: 'Loading'}]
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/books', 
      success: (data) => {
        this.setState({
          books: data
        })
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (<div>
      <h1>What /r/Books Is Reading This Week!</h1>
      <List books={this.state.books}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));