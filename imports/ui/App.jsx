import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Grocerys } from '../api/grocerys.js';    
import Grocery from './Grocery.jsx';
import LoginGoogle from './Login.jsx';
import GroceryLogo from './Logo.jsx';
import AddGroceryForm from './AddGrocery.jsx';

// App component - represents the whole app
class App extends Component {

    constructor(props){
        super(props);
        
        this.state = {
          hideCompleted: false,  
          connect : false,
          userobj: null,
          error: null            
        };
    }

  renderGrocerys() {
    var connect = this.state.connect;
    if(connect){
        let filteredGrocerys = this.props.items;
        if(this.state.hideCompleted){
            filteredGrocerys = filteredGrocerys.filter(item => !item.checked);
        }
        return filteredGrocerys.map((item) => 
                               <Grocery key={item._id} itemed={item} connect={this.state.connect} userobj={this.state.userobj}/>
                              );
    }
  }
                               
handleSubmit(grocery){
        event.preventDefault();
        var connect = this.state.connect;
          if (connect){          
                const text = grocery;
                Meteor.call('grocerys.insert', text, this.state.userobj.email);
                
          }
    }
 
handleUserLogin(connect, userObj) {
    this.setState({
      connect: connect,
      userobj: userObj
    });
    if(userObj){
        Meteor.call('grocery.loginIn',userObj.name);
    }    
}

  render() {
    return (
        <div className="mw7-ns center">
          <div className="tc">
           <header className="sans-serif bg-blackheader pb2 pa3 br2">
              <GroceryLogo connect={this.state.connect} userobj={this.state.userobj}/>
          </header>
          </div>
          <div>
            <LoginGoogle connect={this.state.connect}  userobj={this.state.userobj} handleUserLogin={this.handleUserLogin.bind(this)}/>
            <AddGroceryForm   handleSubmit={this.handleSubmit.bind(this)} connect={this.state.connect}  userobj={this.state.userobj}/>                
              <section className="">
                {this.renderGrocerys()}
              </section>
            </div>
          </div>
    );
  }
}

App.propTypes ={
    items: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
    login: PropTypes.object
}

//https://guide.meteor.com/react.html#data
export default createContainer(() => {
  return {
      items: Grocerys.find({isDelete:false},{sort: { text: 1}}).fetch()
  };
}, App);

