export const oktaConfig = {
    clientId: '0oanaqbefjUt4ibAj5d7',
    issuer: 'https://dev-45041854.okta.com/oauth2/default',
    // domain: 'dev-b731ujia2ategk8i.us.auth0.com',
    redirectUri: 'https://localhost:5173/login/callback',
    // redirectUri: 'http://localhost:5173/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}
/**
 * need update redirectUri because it is https now
 * need update Okta dashboard redirectURl because it is https now
 */