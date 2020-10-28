const express = require('express');
const {uuid,isUuid} = require('uuidv4');
const app = express();
const cors = require('cors');
const { request, response, json } = require('express');

app
.use(express.json())
.use(cors());

const repositories = [];

app
.get('/repositories',(request,response)=>response.status(200).json(repositories))
.post('/repositories',(request,response)=>{
   const {id,title,url,techs} = request.body;
    if(!isUuid(id))return response.status(400).json({error:"invalid ID"}); 
    repositories.push(
        { 
            id,
            title,
            url,
            techs,
            likes: 0 
        });

    return response.status(201).json({message:'repository has been registered'});
})
.post('/repositories/:id/like',(request,response) => {
  const {id} = request.params;
  repositories.find(repositorie =>{
    repositorie.id == id 
    ? repositorie.likes = repositorie.likes+=1 
    : null;
  });

  return response.status(201).json({message:`Likes +1`})

})
.delete('/repositories/:id',(request,response)=>{
    const {id} = request.params;

   const element =  repositories.find(repositorie => repositorie.id === id);

   let index = repositories.indexOf(element);

   repositories.splice(index,1); 

   if(index < 0) return response.status(401).json({message:"repositorie not found"});

   return response.status(202).json({message:'repository has been deleted'})
    

})
.put('/repositories/:id',(request,response) =>{
    const { id } = request.params;
    const {title,url,techs} = request.body;

    const element = repositories.find(repositorie => repositorie.id == id );

    const index = repositories.indexOf(element);

    repositories[index].title = title;
    repositories[index].url = url;
    repositories[index].techs = techs;

    return  response.status(200).json({message:'Data has been updated'})

});

module.exports = app;