import { Card, CardContent,Typography } from '@material-ui/core'
import React from 'react'
import './Infobox.css';
function Infobox({title, cases, active, total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active&& 'infoBox--selected'}`}>
            <CardContent>
                {/* title */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                {/* number of cases */}
                <h2 className="infoBox__cases">{cases}</h2>

                {/* t0tal number of cases */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>

        </Card>
    )
}

export default Infobox
