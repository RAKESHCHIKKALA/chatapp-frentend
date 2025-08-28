import React from 'react'
import { Routes,Route } from 'react-router-dom';
import Home from '../pages/home/home';
import Signin from '../pages/signin/signin';
import Signup from '../pages/signup/signup';
import ProtectedRoute from "../components/protectedRoute/protectedRoute"
const  Routecomp=()=> {
  return (
    <Routes>
       <Route path={"/home"} element={<ProtectedRoute>
        <Home/>
        </ProtectedRoute>}/>
      <Route path ={"/"} element={<Signin/>}/>
      <Route path ={"/signup"} element={<Signup/>}/>
      <Route path={"*"} element ={<h1>page not found</h1>}/>
    </Routes>
  )
}

export default Routecomp
