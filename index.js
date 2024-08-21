const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'list.json');

let shoppingList = [];

fs.readFile(filePath, 'utf-8', (error, jsonString) => {
    if (error){
        console.log(error);
    } else {
        try {
            const data = JSON.parse(jsonString);
            console.log(data.list);

            shoppingList = data.list || [];
            console.log(shoppingList);

        }catch(error){
            console.error('Couldnt Parse File', error);
        }
    }
});   

const server = http.createServer((req, res) =>{

    if (req.url === '/list' && req.method === 'GET'){
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.end(JSON.stringify({list: shoppingList}));  

    } else if (req.url === '/add' && req.method === 'POST'){
        let body ='';

        req.on('data', chunk => {
            body += chunk.toString(); 
        });

        req.on('end', () => {
            try {
                const newList = JSON.parse(body);
                
                shoppingList = newList.list;

                fs.writeFile(filePath, JSON.stringify({list: shoppingList}, null, 2),  error => {
                    if (error){
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Error writing to file");
                        console.error(error);
                    } else {
                        res.writeHead(200, {"Content-Type": "text/plain"});
                        res.end("List updated successfully");
                    }
                })

            }catch(error){
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Invalid JSON");
                console.error('Invalid JSON: ', error)
            }
        });


    } else {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("Hello worl");
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server is running on port 3000"));