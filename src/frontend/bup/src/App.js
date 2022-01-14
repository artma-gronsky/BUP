import './App.css';
import {SignInPage} from "./pages/sign-in-page/sign-in-page.component";
import {Navigate, Route, Routes} from "react-router-dom";
import NotFoundPage from "./pages/error-pages/not-found-page.component";
import {useEffect, useMemo, useState} from "react";
import {authenticationService} from "./services/authentication/authentication.service";
import MainPage from "./pages/main-page/main-page.component";

function App() {
    const [user, setUser] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(()=>{
       const authUnsub = authenticationService.currentUser.subscribe(user => {
           setUser(user);
           setIsDataLoaded(true);
       });
    },[])


    return (
        <div className="App">
            {isDataLoaded?
            <Routes>
                <Route path='*' element={<NotFoundPage/>}/>
                <Route exact path='/' element={(<Navigate to="/main"/>)}/>
                <Route path='/main/*' element={user ? (<MainPage/>) : (<Navigate to="/sign-in"/>)}/>
                <Route path='/sign-in' element={user ? (<Navigate to="/"/>) : (<SignInPage/>)}/>
            </Routes> : null}
        </div>
    );
}

export default App;
