const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const Buffer = require("buffer").Buffer;

app.use(cors());
app.use(express.json()); // Add this line to parse JSON data in request bodies

app.get("/", (req, res) => {
  fs.readFile("Track/data.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

app.post("/encrypt", (req, res) => {
  const newData = req.body.userDetails;

  console.log(JSON.stringify(newData));
  const fileDetails = req.body.confindentialDetails;
  const jsonData = JSON.stringify(newData);
  const filesDetailsJsonData = JSON.stringify(fileDetails);
  const folderName = new Date().toISOString().replace(/[-:.]/g, "");
  fs.mkdir(`Track/${folderName}`, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Error happened");
    }

    // Perform encryption on the data
    const algorithm = "aes-256-ctr"; // Choose an encryption algorithm
    const keyName = fileDetails.key;
    console.log(keyName);
    let key = keyName; // Generate a random encryption key
    key = crypto
      .createHash("sha256")
      .update(String(key))
      .digest("base64")
      .substring(0, 32);
    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encryptedData = Buffer.concat([
      iv,
      cipher.update(jsonData),
      cipher.final(),
    ]);
    const fileName = `${fileDetails.fileName}.lic`; //fileName construction
    // Write the encrypted data to a file
    fs.writeFile(`Track/${folderName}/${fileName}`, encryptedData, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      
      // Write the updated JSON data back to the file
      const jsonFileName = `${fileDetails.fileName}.json`;
      const secondJsonFileName = `raw${fileDetails.fileName}.json`;

      fs.writeFile(
        `Track/${folderName}/${secondJsonFileName}`,
        filesDetailsJsonData,
        "utf8",
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
          }

          fs.writeFile(
            `Track/${folderName}/${jsonFileName}`,
            jsonData,
            "utf8",
            (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
              }

              res.status(201).json({
                encryptedData: encryptedData.toString("base64"),
                jsonData,
                filesDetailsJsonData,
              }); // Send a response indicating success and the newly added data
            }
          );
        }
      );
    });
  });
});

app.post("/decrypt", (req, res) => {
  const encryptedData = req.body.fileLocation.location;
  let key = req.body.key;
  console.log(encryptedData);
  console.log(key);
  const jsonData = JSON.parse(encryptedData);
  console.log(jsonData);

  const algorithm = "aes-256-ctr";
  key = crypto
    .createHash("sha256")
    .update(String(key))
    .digest("base64")
    .substring(0, 32);

  const decrypt = (encrypted) => {
    // GET THE IV: THE FIRST 16 BYTES
    const iv = encrypted.slice(0, 16);

    // GET THE REST
    encrypted = encrypted.slice(16);

    // CREATE DECIPHER
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    // DECRYPT IT
    const result = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return result;
  };

  fs.readFile(jsonData, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    // DECRYPT THE FILE DATA
    if (data) {
      const decryptedFile = decrypt(data);
      const decryptedData = decryptedFile.toString();
      console.log(decryptedData);

      let decryptedJson;
      try {
        decryptedJson = JSON.parse(decryptedData);
      } catch (error) {
        console.error(error);
        return res.status(500).send("Failed to parse decrypted data as JSON");
      }

      res.json({ decryptedData: decryptedJson });
    }
  });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
