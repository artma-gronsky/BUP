import React from "react";

import './not-found-page.styles.scss';
import bgrImage from "../../assets/images/sign-in-background.jpg";

const NotFoundPage = () => {
    return (<div className="not-found-page" style={{backgroundImage: `url(${bgrImage})`}}>
        <div className='title'> 404
            страница не найдена
        </div>
    </div>)
}

export default NotFoundPage;