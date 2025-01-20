// import { useState } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/HomePage/SearchBooksPage/SearchBooksPage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin))
  }

  return (

    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='flex-grow-1'>
        <Switch>
          {/* 
        now we are saying root path of slash exact with: keyword exact
        so this will only render HomePage 
        when it's nothing at the end of url I mean exactly nothing
        */}
          <Route path="/" exact><Redirect to='/home' /></Route>
          <Route path="/home"><HomePage /></Route>
          <Route path="/search"><SearchBooksPage /></Route>
          <Route path="/checkout/:bookId"><BookCheckoutPage /></Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

