import React from 'react';
import Link from 'next/link';
import CalendarDay from './CalendarDay';

function Calendar() {
    
    const programari=[
        {
            start_minute:900,
            end_minute:945,
            name:"Ovidiu",
            id:"1234"
        },
        {
            start_minute:600,
            end_minute:645,
            name:"Monica",
            id:"124"
        },
        {
            start_minute:300,
            end_minute:330,
            name:"Andrei",
            id:"123"
        },

    ]

    return ( 
    CalendarDay(programari)
    );
}

export default Calendar;