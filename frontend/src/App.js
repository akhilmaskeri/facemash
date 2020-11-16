import './App.css';
import React from 'react';
import Panel from './rankPanel';

class App extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      "left": { "name": "", "src": "" },
      "right": { "name": "", "src": "" },
    }

    this.onHit = this.onHit.bind(this);

  }

  componentDidMount(){

    fetch("/init").then(val =>{
      return val.json();
    })
    .then(data => {

      this.setState({ "left":  data.left  });
      this.setState({ "right": data.right });

      console.log(data);

    });

  }

  onHit(element) {

    let context = element.target.id;
    let opposite = (context === "left")? "right": "left";

    let url = "/hit?l=" + this.state.left.name + "&r=" + this.state.right.name + "&f=" + this.state[context].name;
    
    console.log(url);

    fetch(url).then(val => {
      return val.json();
    }).then(data => {

      var newState = {};
      newState[opposite] = data.image;
      this.setState(newState);
    })

  }

  render(){
    return (
      <div className="App">

        <header>
          <h1>
            FACEMASH
          </h1>
        </header>

          <h5 >Were we let in for our looks? No. Will we be judged on them? Yes.</h5> 
          <h3 >Who's Hotter? Click to Choose</h3> 
        

        <div className="appBody">
          <div className="imgContainer" >
            <div>
              <img className="img" id="left" src={this.state.left.src} alt="left" onClick={this.onHit}/>
              <p>{this.state.left.name.replace("_", " ")}</p>
            </div>
          </div>
          <div className="imgContainer">
            <div>
              <img className="img" id="right" src={this.state.right.src} alt="right" onClick={this.onHit}/>
              <p>{this.state.right.name.replace("_", " ")}</p>
            </div>
          </div>

          <div className="footer">
            <Panel/>
          </div>

        </div>

      </div>
    )
  }
}


export default App;
