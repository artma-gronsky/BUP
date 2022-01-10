import {Sidebar} from "primereact/sidebar";
import {useMemo, useState} from "react";

import './main-page.styles.scss';
import {Button} from "primereact/button";
import {useStateValue} from "../../contexts/state-context";
import {selectCurrentUser} from "../../redux/user/user.selects";
import {setCurrentUser} from "../../redux/user/user.action";
import {authenticationService} from "../../services/authentication/authentication.service";

const MainPage = () => {
    const [state, dispatch] = useStateValue();
    // const  currentUser = useMemo(()=>{
    //     return selectCurrentUser(state);
    // }, state);

    const [sideBarIsVisible, setSideBarIsVisible] = useState(false);

    const logout = () => {
        authenticationService.logout();
        dispatch(setCurrentUser(null));
    }

    return (<div className={sideBarIsVisible ? "menu-is-opened main-page" : "main-page"}>
        <Sidebar modal={false} visible={sideBarIsVisible} className="p-sidebar-sm" position="left"
                 onHide={() => setSideBarIsVisible(false)}>
            Content
        </Sidebar>

        <div className='main-page-header'>
            <i className={`pi pi-align-justify ${ sideBarIsVisible? "hide" : null}`}
               onClick={() => setSideBarIsVisible(true)}></i>

            <div className='menu-container'>
                <Button
                    onClick={()=>logout()}
                    style={{'backgroundColor': '#ffffff'}} label="Выйти" className="p-button-raised p-button-text"/>
            </div>
        </div>

        <div className='main-page-content'>

        </div>
    </div>);
}

export default MainPage;