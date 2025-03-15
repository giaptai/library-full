// import { useAuth0 } from "@auth0/auth0-react";
// export const LoginButton = () => {
//     //cannot use loginWithRedirect ?
//     const { loginWithPopup } = useAuth0();

//     return <button className="btn btn-outline-light" onClick={() => loginWithPopup()}>Log In</button>;
// };

// export const LogoutButton = () => {
//     const { logout } = useAuth0();

//     return (
//         <button className="btn btn-outline-light" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
//             Log Out
//         </button>
//     );
// };
// export const Profile = () => {
//     const { user, isAuthenticated, isLoading } = useAuth0();

//     if (!isLoading && user) {
//         console.log(user.email);
//     }
//     // console.log(user?.sub, user?.name);

//     return (
//         isAuthenticated ? <LogoutButton/> : <LoginButton/>
//     );
// };