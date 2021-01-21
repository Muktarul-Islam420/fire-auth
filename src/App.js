import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser] = useState();
  const[user,setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    phone: '',
    
   
  })

  const  provider = new firebase.auth.GoogleAuthProvider();
  var FacebookProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
     const {displayName,email,photoURL} = res.user;
     const signedInUser ={
       isSignedIn: true,
       name:displayName,
       email:email,
       photoURL:photoURL
     }
     setUser(signedInUser);
    })
    .catch(err => {
      console.log(err);
      console.log(err.massage);
    })
  }
  const handleSignInFacebook = () => {
    firebase.auth().signInWithPopup(FacebookProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  const handleSignUt = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name:'',
        email:'',
        photoURL:'',
        error: '',
        newUser: '',
        success: false
      }
      setUser(signedOutUser);
    })
    .catch(err => {
      console.log(err.massage);
    })
  }



  const handleBlur = (e) => {
    let isFieldValid = true;
    // console.log(e.target.name,e.target.value);
  
  if( e.target.name === 'email'){
    isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
  }

    if( e.target.name === 'password'){
      isFieldValid= /^[A-z][a-z0-9_-]{8,19}$/.test(e.target.value);
    }
  if(isFieldValid){
    const newUserInfo = {...user}
    newUserInfo[e.target.name] = e.target.value;
    setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    console.log(user.email, user.password);
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch( error => {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.success = false;
        newUserInfo.error = error.message;
        setUser(newUserInfo);
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('Sign in user info', res.user);
       
      })
      .catch(function(error) {
        const newUserInfo = {...user};
        newUserInfo.success = false;
        newUserInfo.error = error.message;
        setUser(newUserInfo);
      });
    }
    e.preventDefault();
  }
  const updateUserName = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
      console.log('user name updated successfully');
    }).catch(function(error) {
      console.log(error);
    });
  }


  return (
 
    <div className="container-all">
     
         {
          user.isSignedIn?  <button onClick={handleSignUt}>Sign out</button>:
          <button className="btn" onClick={handleSignIn}>Sign in</button>
        }
        <br/>
        <button onClick={handleSignInFacebook}> Sign in with Facebook</button>
       {
         user.isSignedIn && <div className="container"> 
           
           <h2>Welcome, {user.name}</h2>
          <p>Your email address is: {user.email}</p>
           <img src={user.photoURL} className="image" alt=""/>
            </div>   
       }
  
         <form onSubmit={handleSubmit}>
           <h1>Registration Form</h1>
           <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="New User" id=""/>
           <label htmlFor="New User">New user Sign Up</label>
           <br/>
          {newUser &&  <input type="text" onBlur={handleBlur} name="name" placeholder="Your name" id="name"/>}
           <br/>
           <input type="text" onBlur={handleBlur} name="email" id="email" placeholder="Your email here" required/>
           <br/>
           <input type="password" onBlur={handleBlur} name="password" id="password" placeholder="Your Password here"  required/>
           <br/>
           <input type="submit" value={newUser ? 'Sign Up':'Log In'}/>
         </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {user.success &&  <p style={{color: 'green'}}>Your {newUser ?'registration' : 'Logged In'} was successfully</p>}
    </div> 
  );
}

export default App;
