// import { useState } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';

import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
//The error you are encountering is due to TypeScript not being able 
// to find a type declaration for your JSX module. 
// You can resolve this by either: 1. Creating a type declaration file manually. 2. Using the // @ts-ignore directive.
//@ts-ignore
import LoginWidget from './Auth/LoginWidget';
import { MyUseref } from './layouts/Utils/learn-basic-hook/MyUseref';

import MyUseMemo from './layouts/Utils/learn-basic-hook/MyUseMemo';
import { MyUsecallback } from './layouts/Utils/learn-basic-hook/MyUsecallback';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';

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
      <Security oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={customAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Switch>
            {/* 
        now we are saying root path of slash exact with: keyword exact
        so this will only render HomePage 
        when it's nothing at the end of url I mean exactly nothing
        */}
            <Route path="/useref" exact><MyUseref /></Route>
            <Route path="/usecallback" exact><MyUsecallback /></Route>
            <Route path="/usermemo" exact><MyUseMemo /></Route>
            <Route path="/" exact><Redirect to='/home' /></Route>
            <Route path="/home"><HomePage /></Route>
            <Route path="/search"><SearchBooksPage /></Route>
            <Route path="/reviewlist/:bookId"><ReviewListPage /></Route>
            <Route path="/checkout/:bookId"><BookCheckoutPage /></Route>
            {/* okta */}
            <Route path="/login" render={() => <LoginWidget config={oktaConfig} />} />
            <Route path="/login/callback" component={LoginCallback} />
            <SecureRoute path="/shelf"><ShelfPage /></SecureRoute>
            <SecureRoute path="/messages"><MessagesPage /></SecureRoute>
            <SecureRoute path="/admin"><ManageLibraryPage /></SecureRoute>
            <SecureRoute path="/fees"><PaymentPage /></SecureRoute>
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
}

