import './App.css';
import {SignInPage} from "./pages/sign-in-page/sign-in-page.component";
import {Navigate, Route, Routes} from "react-router-dom";
import NotFoundPage from "./pages/error-pages/not-found-page.component";
import {useStateValue} from "./contexts/state-context";
import {selectCurrentUser} from "./redux/user/user.selects";
import {useEffect} from "react";
import {authenticationService} from "./services/authentication/authentication.service";
import {setCurrentUser} from "./redux/user/user.action";
import MainPage from "./pages/main-page/main-page.component";

function App() {
    const [state, dispatch] = useStateValue();
    const  currentUser = selectCurrentUser(state);

    useEffect(()=>{
       const user = authenticationService.currentUserValue;
       if(!!user){
           dispatch(setCurrentUser(user))
       }
    },[])

    return (
        <div className="App">
            <Routes>
                <Route exact path='/' element={currentUser ? (<MainPage to="/"/>) : (<Navigate to="/sign-in"/>)}/>
                <Route path='/sign-in'
                   element={currentUser ? (<Navigate to="/"/>) : (<SignInPage/>)}/>
                <Route path='*' element={<NotFoundPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
