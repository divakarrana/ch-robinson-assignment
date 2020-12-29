import React, {useEffect} from 'react';
import "datatables.net-dt/css/jquery.dataTables.min.css";

const $ = require("jquery");
$.DataTable = require("datatables.net");

const Datatable = (props) => {
    let element;
    const columns = Object.keys(props.barData[0]).map(el => {return {data: el, title:el.toUpperCase()}});

    useEffect(() => {
        let $el = $(element);
        $el.DataTable({
            data: props.barData,
            columns,
            ordering:false
            
        })
    },[columns, element, props.barData]);

    return (
        <div className="Datatable">
            <table
                className="table table-borderless display"
                id="dataTable"
                width="100%"
                ref={(el) => (element = el)}
                 />
        </div>
    );
}

export default Datatable;
