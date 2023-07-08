
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

  // app.post("/encrypt", (req, res) => {
//   const newData = req.body.userDetails;

//   console.log(JSON.stringify(newData));
//   const fileDetails = req.body.confindentialDetails;
//   const jsonData = JSON.stringify(newData);
//   const filesDetailsJsonData = JSON.stringify(fileDetails);
//   let folderName = new Date().toISOString().replace(/[-:.]/g, "");
//   fs.mkdir(`Track/${folderName}`, { recursive: true }, (err) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send("Internal Error happend");
//     }
//     // Perform encryption on the data
//     const algorithm = "aes-256-ctr"; // Choose an encryption algorithm
//     const keyName = fileDetails.key;
//     console.log(keyName);
//     let key = keyName; // Generate a random encryption key
//     key = crypto
//       .createHash("sha256")
//       .update(String(key))
//       .digest("base64")
//       .substring(0, 32);
//     const iv = crypto.randomBytes(16); // Generate a random initialization vector
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     const encryptedData = Buffer.concat([
//       iv,
//       cipher.update(jsonData),
//       cipher.final(),
//     ]);
//     const fileName = `${fileDetails.fileName}.lic`; //fileName construction
//     // Write the encrypted data to a file
//     fs.writeFile(`Track/${folderName}/${fileName}`, encryptedData, (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//       }
//     });

//     // Write the updated JSON data back to the file
//     const jsonFileName = `${fileDetails.fileName}.json`;
//     const secondJsonFileName = `raw${fileDetails.fileName}.json`;

//     fs.writeFile(
//       `Track/${folderName}/${secondJsonFileName}`,
//       filesDetailsJsonData,
//       "utf8",
//       (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send("Internal Server Error");
//         }

//         // res.status(201).json(filesDetailsJsonData); // Send a response indicating success and the newly added data
//       }
//     );

//     fs.writeFile(
//       `Track/${folderName}/${jsonFileName}`,
//       jsonData,
//       "utf8",
//       (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send("Internal Server Error");
//         }

//         res.status(201).json(jsonData); // Send a response indicating success and the newly added data
//       }
//     );
//   });
// });
