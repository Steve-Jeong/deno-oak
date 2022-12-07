console.log('javascript /public/js/app.js is loaded.');
const prButton = document.getElementById('prButton')
const printLorem = document.getElementById('printLorem')
prButton.addEventListener('click', ()=>{
  printLorem.innerHTML = '<h1>Lorem10</h1>'

})