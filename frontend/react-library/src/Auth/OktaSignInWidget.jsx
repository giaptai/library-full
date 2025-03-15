import { useEffect, useRef } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";

import { oktaConfig } from "../lib/oktaConfig";

const OktaSignInWidget = ({ onSuccess, onError }) => {
  const widgetRef = useRef();

  useEffect(() => {
    if (!widgetRef.current) {
      return false;
    }

    const widget = new OktaSignIn(oktaConfig);

    widget
      .showSignInToGetTokens({
        el: widgetRef.current,
      })
      .then(onSuccess)
      .catch(onError);

    return () => widget.remove();
  }, [onSuccess, onError]);

  return (
    <div className="container mt-5 mb-5">
      <div ref={widgetRef}></div>
    </div>
  );
};

export default OktaSignInWidget;

/*
https://github.com/zeekhoo-okta/okta-django-samples/issues/15
I don't know why but we need configure: policy evaluation failed for this request please check the policy configurations
Login into okta > Security > API, in Authorization Servers check default or add new  
Choose default or variable you added, navigate  "Access Policies" tab and
Don't have Access Policy ? must create, then need to create rules of the policy created
*/
