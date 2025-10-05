// url da base da api
const API_URL = "http://127.0.0.1:8085";

//listar apenas os nomes nomes.html
function listarNomes(){
  const lista = document.getElementById('listaNomes');
  lista.innerHTML = `<li>Buscando dados na API...</li>`;

  fetch(`${API_URL}/alunos/nomes`).then(response =>{
    if(!response.ok){
      throw new Error(`Erro de rede ou API: ${Response.status}`);
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

//cadastrar aluno

function cadastrarAluno(event){
  // 1 - impede o carregamento da página
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const idade = document.getElementById('idade').value;
  const feedback = document.createElement('p'); //elemento para feedback

  //limpa feedback anterior e validação básica

  const form = document.getElementById('formCadastro');
  const feedbackatual = form.querySelector('.feedback-message');
  if(feedbackatual){
    feedbackatual.remove();
  }

  if(!nome || !idade){
    feedback.textContent = "Por Favor, preencha todos os campos";
    feedback.style.color = 'red';
    feedback.className = 'feedback-message';
    form.appendChild(feedback);
    return;
  }

  //3 requisião post com fetch
  fetch(`${API_URL}/cadastroAluno`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    //envia os dados como json no corpo da reuisição
    body: JSON.stringify({nome:nome, idade: parseInt(idade)}),
  })
  .then(response =>{
    //se a resposta de rede falhar
    if(!response.ok){
      throw new Error(`Erro ${response.status}: Falha ao cadastrar`);
    }
    return response.json();
  })
  .then(data=>{
    //exibir mensagem de sucesso ou erro da api
    if(data.status === 'sucesso'){
      feedback.textContent = data.message;
      feedback.style.color = 'green';

      //redirecionamento após o sucesso
      setTimeout(()=>{
        window.location.href = 'nomes.html'//redireciona para a pagina de nomes
      },1000);
    }else{
      feedback.textContent = `Erro da API: ${data.message}`;
      feedback.style.color = 'red';
    }
    feedback.className = 'feedback-message';
    form.appendChild(feedback);
  })
  .catch(error =>{
    //trata error de rede ou servidor
    console.error('Erro de comunicação', error);
    feedback.textContent = `Erro de conexão: ${error.mensage}. Verifique se a API está online em ${API_URL}.`;
    feedback.styles.color = 'red';
    feedback.className = 'feedback-message';
    form.appendChild(feedback);
  });
}

//função ara detalhes

function listarTodosAlunos(){
  const conteudo = document.getElementById('conteudoAlunos');
  conteudo.innerHTML = `<p>Buscando detalhes na API...</p>`;
  
  // requisição get para a rota /resultado
  fetch(`${API_URL}/resultado`)
  .then(response =>{
    if(!response.ok){
      throw new Error(`Erro de rede ou API: ${response.status}`);
    }
    return response.json();
  })
  .then(data =>{
    //verifica o status da resposta da API
    if(data.status === 'sucesso' && data.alunos){
      //verifica se não houver alunos, exibe mensagem
      if(data.alunos.length === 0){
        conteudo.innerHTML= `Nenhum aluno cadastrado ainda.</p>`;
        return;
      }

      //3
      let html = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Idade</th>
            </tr>
          </thead>
        <tbody>
      `;

      // itera sobre os alunos para crias as linhas da tabela
      data.alunos.forEach(aluno =>{
        html += `
          <tr>
            <td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
          </tr>
        `;
      });

      //finaliza a tabela e insere no elemento html

      html += `
        </tbody>
      </table>
      `;

      conteudo.innerHTML = html;
    }else{
      conteudo.innerHTML = `<p>Erro ao receber dados: ${data.mensagem || 'Resposta da API inváida'}</p>`; 
    }
  }).catch(error => {
      console.error('Erro ao buscar alunos:', error);
      conteudo.innerHTML =` <p>Erro na comunicação: ${error.mensage}. Verifique se o servidor está rodando em ${API_URL}</p>`;
    });
}