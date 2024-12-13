const tabela = document.getElementById('tabelaPlantas').querySelector('tbody');
    const btnImprimir = document.getElementById('btnImprimir');
    const editarSecao = document.getElementById('editarSecao');
    const formEdicao = document.getElementById('formEdicao');
    const cancelarEdicao = document.getElementById('cancelarEdicao');
    
    let plantas = {};
    
    async function carregarPlantas() {
      try {
        const response = await fetch('https://my-db-4ce9d-default-rtdb.firebaseio.com/plantas.json');
        if (response.ok) {
          const data = await response.json();
          plantas = data ? data : {};
          renderizarTabela();
        } else {
          alert('Erro ao carregar dados.');
        }
      } catch (error) {
        console.error(error);
        alert('Falha na conexão com o banco de dados.');
      }
    }
    
    function renderizarTabela() {
      tabela.innerHTML = '';
      if (!plantas) return;
      for (const id in plantas) {
        const p = plantas[id];
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
          <td>${p.nome}</td>
          <td>${p.especie}</td>
          <td>${p.dataPlantio}</td>
          <td>${p.localizacao}</td>
          <td>${p.altura}</td>
          <td>${p.observacoes ? p.observacoes : ''}</td>
          <td>
            <button class="btnEditar" data-id="${id}">Editar</button>
            <button class="btnRemover" data-id="${id}">Remover</button>
          </td>
        `;
        
        tabela.appendChild(tr);
      }
      
      const btnsEditar = document.querySelectorAll('.btnEditar');
      const btnsRemover = document.querySelectorAll('.btnRemover');
      
      btnsEditar.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          editarPlanta(id);
        });
      });
      
      btnsRemover.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm('Deseja remover esta planta?')) {
            await removerPlanta(id);
          }
        });
      });
    }
    
    async function removerPlanta(id) {
      try {
        const response = await fetch(`https://my-db-4ce9d-default-rtdb.firebaseio.com/plantas/${id}.json`, {
          method: 'DELETE'
        });
        if (response.ok) {
          delete plantas[id];
          renderizarTabela();
        } else {
          alert('Erro ao remover planta.');
        }
      } catch (error) {
        console.error(error);
        alert('Falha na conexão com o banco de dados.');
      }
    }
    
    function editarPlanta(id) {
      const p = plantas[id];
      document.getElementById('editId').value = id;
      document.getElementById('editNome').value = p.nome;
      document.getElementById('editEspecie').value = p.especie;
      document.getElementById('editDataPlantio').value = p.dataPlantio;
      document.getElementById('editLocalizacao').value = p.localizacao;
      document.getElementById('editAltura').value = p.altura;
      document.getElementById('editObservacoes').value = p.observacoes ? p.observacoes : '';
      
      editarSecao.style.display = 'block';
    }
    
    formEdicao.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('editId').value;
      const nome = document.getElementById('editNome').value.trim();
      const especie = document.getElementById('editEspecie').value.trim();
      const dataPlantio = document.getElementById('editDataPlantio').value;
      const localizacao = document.getElementById('editLocalizacao').value.trim();
      const altura = document.getElementById('editAltura').value.trim();
      const observacoes = document.getElementById('editObservacoes').value.trim();
      
      if(!nome || !especie || !dataPlantio || !localizacao || !altura) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      
      const nomeRegex = /^[A-Za-zÀ-ú\s]+$/;
      if(!nomeRegex.test(nome)){
        alert("O nome da planta deve conter apenas letras.");
        return;
      }
      
      const plantaAtualizada = {
        nome,
        especie,
        dataPlantio,
        localizacao,
        altura: parseInt(altura,10),
        observacoes
      };
      
      try {
        const response = await fetch(`https://my-db-4ce9d-default-rtdb.firebaseio.com/plantas/${id}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(plantaAtualizada)
        });
        
        if(response.ok) {
          plantas[id] = plantaAtualizada;
          renderizarTabela();
          editarSecao.style.display = 'none';
        } else {
          alert('Erro ao atualizar planta.');
        }
      } catch (error) {
        console.error(error);
        alert('Falha na conexão com o banco de dados.');
      }
    });
    
    cancelarEdicao.addEventListener('click', () => {
      editarSecao.style.display = 'none';
    });
    
    btnImprimir.addEventListener('click', () => {
      window.print();
    });
    
    // Máscara no campo editAltura (somente números)
    const editAltura = document.getElementById('editAltura');
    editAltura.addEventListener('input', () => {
      editAltura.value = editAltura.value.replace(/\D/g,'');
    });
    
    // Carrega os dados inicialmente
    carregarPlantas();