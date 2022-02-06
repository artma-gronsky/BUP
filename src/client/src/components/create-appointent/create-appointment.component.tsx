import React, { useState} from "react";

import { Steps } from 'primereact/steps';
import {LoadScene} from "./load-scene/load-scene.component";

const CreateAppointment: React.FC = ()=>{
    const [items] = useState<object[]>( [
        {label: 'Загрузить сцену'},
        {label: 'Места для бронирования'},
        {label: 'Прочее'}
    ]);

    const [activeIndex, setActiveIndex] = useState<number>(0);


     return (<div className={'create-appointment-container'}>
        <h5>Создание нового события</h5>
        <Steps model={items} activeIndex={activeIndex} />

        <LoadScene/>
    </div>);
}

export default CreateAppointment;