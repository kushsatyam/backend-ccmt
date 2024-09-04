const express = require("express");
const serverless = require("serverless-http");
const app = express();
const cors = require("cors");
const CCMTdata = require('./2024CCMT.json');

const { Parser } = require('json2csv');
const fs = require('fs');

app.use(express.json());
app.use(cors());

app.use("/.netlify/functions/app", router);



app.get('/', (req, res) => {
    let tableRows = CCMTdata.map((row) =>{
        if(row.Category=='OBC-NCL'){

            let info = `<tr>
            <td>${row.SNO}</td>
            <td>${row.Round}</td>
            <td>${row.Institute}</td>
            <td>${row.ProgramName}</td>
            <td>${row.Group}</td>
            <td>${row.Category}</td>
            <td>${row.OpeningRank}</td>
            <td>${row.ClosingRank}</td>
        </tr>
    `
    return info;
             
        }
       } ).join('');

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GATE Scores Table</title>
    </head>
    <body>

        <h2>GATE Scores Table</h2>

        <table border="1" width="100%">
            <thead>
                <tr>
                    <th>S. No.</th>
                    <th>Round</th>
                    <th>Institute</th>
                    <th>PG Program</th>
                    <th>Group</th>
                    <th>Category</th>
                    <th>Max GATE Score</th>
                    <th>Min GATE Score</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>

    </body>
    </html>
`;

    res.send(html);
    // console.log(CCMTdata);
    // res.status(200).json(CCMTdata.CounsellingData);
    // res.status(200).json(CCMTdata.ColumnDetails)
})


app.get('/download-csv', (req, res) => {
    const fields = ['RoundName', 'InstituteName', 'ProgramName', 'groupName', 'Category', 'OpeningRank', 'ClosingRank'];
    const opts = { fields };
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(CCMTdata.CounsellingData);

        res.header('Content-Type', 'text/csv');
        res.attachment('counselling_data.csv');
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating CSV');
    }
});


app.listen(5000, () => {
    console.log('server run at port 5000');
});

module.exports.handler = serverless(app);