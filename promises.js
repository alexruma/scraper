let theVar='nada'

const promisesTest = new Promise((res,reject) =>{
  setTimeout(function(){
  theVar = 'nada who ART in nada';
res();
}, 650);
}).then(() => {console.log(theVar)}).catch((error) => {console.log('It didnt work')})
