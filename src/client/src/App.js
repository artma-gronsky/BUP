import './App.css';
import {SignInPage} from "./pages/sign-in-page/sign-in-page.component";
import {Navigate, Route, Routes} from "react-router-dom";
import NotFoundPage from "./pages/error-pages/not-found-page.component";
import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import {authenticationService} from "./services/authentication/authentication.service";
import MainPage from "./pages/main-page/main-page.component";
import Preloader from "./components/preloader/preloader.component";
import {useStateValue} from "./contexts/state-context";
import {getLoading} from "./redux/global/global.selectors";
import {SetGlobalLoading} from "./redux/global/global.actions";

function App() {
    const [user, setUser] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [state, dispatch] = useStateValue();
    const isLoading = useMemo(()=>getLoading(state.global), [state]);

    useEffect(()=>{
       const authUnsub = authenticationService.currentUser.subscribe(user => {
           setUser(user);
           setIsDataLoaded(true);
           dispatch(new SetGlobalLoading(false));
       });
       return () => authUnsub?.unsubscribe();
    },[])


    return (
        <div className="App">
            <Preloader isLoading={isLoading}>
                {isDataLoaded?
                    <Routes>
                        <Route path='*' element={<NotFoundPage/>}/>
                        <Route exact path='/' element={(<Navigate to="/main"/>)}/>
                        <Route path='/main/*' element={user ? (<MainPage/>) : (<Navigate to="/sign-in"/>)}/>
                        <Route path='/sign-in' element={user ? (<Navigate to="/"/>) : (<SignInPage/>)}/>
                    </Routes> : null}
            </Preloader>

        </div>
    );
}

export default App;
