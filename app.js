// url da base da api
const API_URL = "http://127.0.0.1:8085";

//listar apenas os nomes nomes.html

function listarNomes(){
  const lista = document.getElementById('listaNomes');
  lista.innerHTML = `<li>Buscando dados na API...</li>`;

  fetch(`${API_URL}/alunos/nomes`).then(response =>{
    if(!response.ok){
      throw new error(`Erro de rede ou API: ${Response.status}`);
    }
    return response.json();
  })
  .then(data =>{
    //verifica se api retornou sucesso e a lista de nomes
    if(data.status == 'sucesso' && data.nomes){
      lista.innerHTML = ''; //limpa o "carregando"
      data.nomes.forEach(nome => {
        const li = document.createElement('li');
        li.textContent= nome;
        lista.appendChild(li);
      });
    }else{
      lista.innerHTML=`<li>Erro ao receber dados: ${data.mensagem || 'Resposta da API inválida'}</li>`
    }
  })
  .catch(error =>{
    console.error('Erro ao buscar nomes:', error);
    lista.innerHTML= `<li>Erro na comunicação: ${error.message}. Verifique se o servidor esta rodando em ${API_URL}</li>`;
  });
}