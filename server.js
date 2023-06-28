const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Add this line to parse JSON data in request bodies

app.get('/', (req, res) => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});

app.post('/encrypt', (req, res) => {
    const newData = req.body;

    // Read the existing JSON data from the file
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        let jsonData = JSON.parse(data);
        jsonData = { ...jsonData, newData }; // Add the new data to the existing JSON data array
        console.log(jsonData)
        // Write the updated JSON data back to the file
        fs.writeFile('data.json', JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            res.status(201).json(newData); // Send a response indicating success and the newly added data
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
