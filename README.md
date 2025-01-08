How this project was made:

- Open terminal in project folder

Frontend Setup (React, MUI)
-

1. Create frontend with create-react-app: ```npx create-react-app frontend --template typescript```

2. Install MUI: ```npm install @mui/material @emotion/react @emotion/styled```
 
Backend Setup (Mongoose, Express)
-

3. ```cd ./..```
4. Create backend folder
5. ```cd backend```
6. ```npm init -y```
7. ```npm install express mongoose typescript @types/express @types/mongoose nodemon ts-node cors dotenv```
8. Create server.ts

```
const express = require('express')
require('dotenv').config()
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())

var mongoose = require('mongoose')

const source = process.env.ATLAS_CONNECTION

mongoose.connect(source, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const connection = mongoose.connection
connection.once('open', () => {
    console.log("DB connected.");
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Successfully served on port: ${PORT}.`);
})
```

9. Create model. Example given is a new file called "obj.model.ts"

```
var mongoose = require('mongoose')
const Schema = mongoose.Schema

const objSchema = new Schema({
    id: Schema.Types.ObjectId,
    text: Schema.Types.String,
    time: Schema.Types.Date
})

const Obj = mongoose.model('Obj', objSchema)
module.exports = Obj
```

10. Create router. Example given is a new file called "obj.router.ts"

```
const Obj = require('./obj.model')
const router = require('express').Router()
import express, { Request, Response } from "express";

router.route('/create').post((req: Request, res: Response) => {
    const newObj = new Obj(req.body)
    newObj.save().then((obj: typeof Obj) => res.json(obj))
})

router.get("/", async (req: Request, res: Response) => {
    const data = await Obj.find();
    res.send({ data: data });
});

router.delete("/", async (req: Request, res: Response) => {
    const deletedDocument = await Obj.deleteOne({_id: req.body.id,});
    res.send(deletedDocument);
});

router.patch("/", async (req: Request, res: Response) => {
    const result = await Obj.updateOne({ _id: req.body.id }, { $set: { text: req.body.text } });
    res.status(200).send({
        data: result,
    });
});

module.exports = router
```

11. Add route to server.ts

The following lines were added to the bottom of "server.ts"

```
const objRoutes = require('./obj.router')
app.use('/obj', objRoutes)
```

12. Change "main" in "package.json" from "index.js" to "server.ts"

Example modified package.json is given:
```
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "server.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/express": "^5.0.0",
    "@types/mongoose": "^5.11.97",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mongoose": "^8.9.3",
    "nodemon": "^3.1.9",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.3"
  }
}
```

13. Create a tsconfig.json using ```tsc --init```


Database Setup (MongoDB)
-
14. Create a Cluster
15. Get a Connection String
16. Create .env file with ATLAS_CONNECTION defined. Ensure that you create a .gitignore file to ignore .env to prevent pushing your credentials to github.

Starting it all up...
-
17. Open a terminal in /frontend and use ```npm start```
18. Open a terminal in /backend and use ```nodemon server```

Sample Frontend...
-

A sample app.tsx is given that displays jsons from the backend and can submit a new object. MUI components are used.

```
import './App.css';
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';

async function getData() {
  const response = await fetch(`http://localhost:5000/obj/`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
  return response.json();
}

export default function App() {

  const [text, setText] = useState('Hello World!');
  const [textFieldInput, setSummary] = useState('');
  const [newPostWatcher, setNewPostWatcher] = useState(0);
  const handleTextField = (event: React.ChangeEvent<HTMLInputElement>) => setSummary(event.target.value);

  useEffect(() => {
    getData().then((data) => {
      setText(JSON.stringify(data));
    });
  }, [newPostWatcher]);

  const handlePost = async (text: String)=> {
    const response = await fetch(`http://localhost:5000/obj/create/`, {
        method: "POST",
        body: JSON.stringify({
          text: text
      }),
      headers: { "Content-Type": "application/json" },
    });
    setNewPostWatcher(newPostWatcher + 1);
    return response.json();
  };

  return (
    <Box>
      <Typography>
        {text}
      </Typography>
      <TextField value={textFieldInput} onChange={handleTextField}/>
      <Button onClick={ () => {handlePost(textFieldInput)} }>Post</Button>
    </Box>
  );
}
```

