import React, {useState} from 'react';

import BarChart from './BarChart/BarChart';
import LineBarChart from './LineBarChart/LineBarChart';

const Chart = (props) => {

    const [chartType, setChartType] = useState('Grouped');   
    const [lineChartStatus, setLineStatus] = useState(false); 

    const handleGraphChange = (e) => {
        if(e.target.value){
            setChartType(e.target.value);
        } else if(e.target.outerText === 'Go Back'){
            setLineStatus(false);
        } else {
            //Generate LineBar Chart
            setLineStatus(true);
        }
        
    }

    return (
        <div className="Chart">
            { !lineChartStatus ? <BarChart chartType={chartType} handleGraphChange={handleGraphChange} barData={props.barData}/> 
                               : <LineBarChart lineBarData={props.lineBarData} handleGraphChange={handleGraphChange}/>}
        </div>
    )
}

export default Chart;
