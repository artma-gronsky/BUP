import React from "react";

import './not-found-page.styles.scss';
import bgrImage from "../../assets/images/sign-in-background.jpg";
import {Button} from "primereact/button";
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (<div className="not-found-page"
                 // style={{backgroundImage: `url(${bgrImage})`}}
    >
        <div className='title'> 404
            страница не найдена
        </div>
        <Button type="button" onClick={()=> navigate({pathname:"/"})} label="На главную" className="p-mt-2" />
    </div>)
}

export default NotFoundPage;