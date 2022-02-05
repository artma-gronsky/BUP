import {Sidebar} from "primereact/sidebar";
import {useMemo, useState} from "react";

import './main-page.styles.scss';
import {Button} from "primereact/button";
import {useStateValue} from "../../contexts/state-context";
import {setCurrentUser} from "../../redux/user/user.action";
import {authenticationService} from "../../services/authentication/authentication.service";
import {ListBox} from "primereact/listbox";
import {Navigate, Route, Routes, useLocation, useNavigate, useRoutes} from "react-router-dom";

const MainPage = () => {
    const [state, dispatch] = useStateValue();
    const [menu, setMenu] = useState({
        items:[
            { name: 'Все события', route:'/main' },
            { name: 'Тесты', route:'/main/test' },
        ]
    });


    const navigate = useNavigate();
    const location = useLocation();
    const selected = useMemo(()=>{

        let path = location.pathname.toLowerCase();
        if(path[path.length - 1] === '/')
            path = path.substring(0, path.length - 1);
        return menu.items.find(i => i.route === path);
    }, [location]);


    const [sideBarIsVisible, setSideBarIsVisible] = useState(false);

    const logout = () => {
        authenticationService.logout();
        dispatch(setCurrentUser(null));
    }

    return (<div className={sideBarIsVisible ? "menu-is-opened main-page" : "main-page"}>
        <Sidebar icons={"BUP"} modal={false} visible={sideBarIsVisible} className="p-sidebar-sm" position="left"
                 onHide={() => setSideBarIsVisible(false)}>
            <ListBox value={selected} options={menu.items} onChange={(e) => !!e?.value?.route && navigate({pathname: e.value.route})} optionLabel="name" style={{ width: '15rem' }} />
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
            <Routes>
                <Route path={"/"} element={(<div>MAIN</div>)}/>
                <Route path={"/test"} element={(<div>TEST</div>)}/>
                <Route path={"*"} element={<Navigate to={'/not-found'}/>}></Route>
            </Routes>
        </div>
    </div>);
}

export default MainPage;