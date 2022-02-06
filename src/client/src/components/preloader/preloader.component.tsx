import React from "react";
import './preloader.styles.scss';
import circlesPreloader from "../../assets/images/Circles-menu-3.gif";


const Preloader: React.FC<{isLoading: boolean}> = ({isLoading, children}) => {
    return (<div className='preloader-container'>
        {isLoading && (<div className='loader' style={{backgroundImage: `url(${circlesPreloader})`}}></div>)}
        {children}
    </div>)
}

export default Preloader;