// Máscara simples: Ao digitar em altura, permitir apenas dígitos.
const alturaInput = document.getElementById('altura');
alturaInput.addEventListener('input', () => {
  alturaInput.value = alturaInput.value.replace(/\D/g,'');
});

const form = document.getElementById('formCadastro');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validações extras
  const nome = document.getElementById('nome').value.trim();
  const especie = document.getElementById('especie').value.trim();
  const dataPlantio = document.getElementById('dataPlantio').value;
  const localizacao = document.getElementById('localizacao').value.trim();
  const altura = document.getElementById('altura').value.trim();
  const observacoes = document.getElementById('observacoes').value.trim();
  
  // Verifica obrigatoriedade
  if(!nome || !especie || !dataPlantio || !localizacao || !altura) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }
  
  // Verifica regex do nome (somente letras)
  const nomeRegex = /^[A-Za-zÀ-ú\s]+$/;
  if(!nomeRegex.test(nome)){
    alert("O nome da planta deve conter apenas letras.");
    return;
  }
  
  const novaPlanta = {
    nome,
    especie,
    dataPlantio,
    localizacao,
    altura: parseInt(altura, 10),
    observacoes
  };
  
  try {
    const response = await fetch('https://my-db-4ce9d-default-rtdb.firebaseio.com/plantas.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novaPlanta)
    });
    
    if(response.ok) {
      alert('Planta cadastrada com sucesso!');
      form.reset();
    } else {
      alert('Erro ao cadastrar a planta!');
    }
  } catch (error) {
    console.error(error);
    alert('Falha na conexão com o banco de dados.');
  }
});