
app.post("/encrypt", (req, res) => {
    const newData = req.body;
  
    // Read the existing JSON data from the file
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      let jsonData = JSON.parse(data);
      jsonData = [ ...jsonData, newData ]; // Add the new data to the existing JSON data array
      console.log(jsonData);
      // Write the updated JSON data back to the file
      fs.writeFile("data.json", JSON.stringify(jsonData), "utf8", (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
  
        res.status(201).json(newData); // Send a response indicating success and the newly added data
      });
    });
  });
