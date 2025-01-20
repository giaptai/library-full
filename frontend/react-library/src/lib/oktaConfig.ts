export const oktaConfig = {
    clientId: 'A4SMlcUu64IV36MYwNCORgNpgY61Gp7P',
    issuer: 'https://dev-b731ujia2ategk8i.us.auth0.com/oauth2/default',
    domain: 'dev-b731ujia2ategk8i.us.auth0.com',
    redirectUri: 'http://localhost:5173/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}