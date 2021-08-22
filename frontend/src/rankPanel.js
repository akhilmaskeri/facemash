import './rankPanel.css';
import React from 'react';

class Panel extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            "display": "none",
            "order": [],
            "rankings": ""
        }

        this.expand = this.expand.bind(this);

    }

    expand(event){


        if(this.state.display === "none"){

            fetch("/ranking").then(val=>{
                return val.json();
            })
            .then(res =>{
                this.setState({"rankings": res.rank});
            });

            this.setState({"display": "block"});
        }
        else{
            this.setState({"display": "none"});
        }
    }

    render(){

        let members = [];

        for(let i=0; i< this.state.rankings.length; i++){
            members.push( 
                <li className="rankItem">
                    <img className="thumbnail" src={"/facemash/" + this.state.rankings[i].name} />
                    <p>{this.state.rankings[i].name.replace("_", " ").split(".")[0]}</p>
                </li> 
            )
        }
        
        return (
            <div className="footer" onClick={this.expand} >

                <div>Ranking</div>
                <div className="rankPanel"
                    style={{ display: this.state.display }}>
                    <br/>
                    <div className="list">
                        {members}
                    </div>
                </div>
            </div>


        )
    }
} 

export default Panel;