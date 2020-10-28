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
   const {title,url,techs} = request.body;
   const id = uuid();
   console.log(isUuid(id));
   repositories.push(
        { 
            id,
            title,
            url,
            techs,
            likes: 0 
        });

    return response.status(201).json(repositories[repositories.length -1]);
})
.post('/repositories/:id/like',(request,response) => {
 const {id} = request.params;

 let repositoriesUpdated = repositories.find(repository =>{
   return  repository.id == id && (repository.likes = repository.likes+=1 );
  });

  return repositoriesUpdated 
  ? response.status(200).json(repositoriesUpdated) 
  : response.status(400).json({error:''})

})
.delete('/repositories/:id',(request,response)=>{
    const {id} = request.params;

   const element =  repositories.find(repositorie => repositorie.id === id);

   let index = repositories.indexOf(element);

   repositories.splice(index,1); 

   if(index < 0) return response.status(400).json({message:"repository not found"});

   return response.status(204).json({message:'repository has been deleted'})
    

})
.put('/repositories/:id',(request,response) =>{
    const { id } = request.params;
    const {title,url,techs} = request.body;

    const element = repositories.find(repository => repository.id == id );

    if(!element)return response.status(400).json({error:'repository not found'})

    const index = repositories.indexOf(element);

    repositories[index].title = title;
    repositories[index].url = url;
    repositories[index].techs = techs;

    return  response.status(200).json(repositories[index]);

});

module.exports = app;