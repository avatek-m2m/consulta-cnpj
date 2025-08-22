document.addEventListener('DOMContentLoaded', () => {
  const cnpjInput = document.getElementById('cnpj-input');
  const consultarBtn = document.getElementById('consultar-btn');
  const resultadoEl = document.getElementById('resultado');
  const loadingEl = document.getElementById('loading');

  // Mapeia os campos da API para rótulos mais amigáveis
  const campoParaRotulo = {
    "razao_social": "Razão Social",
    "nome_fantasia": "Nome Fantasia",
    "cnpj": "CNPJ",
    "uf": "UF",
    "municipio": "Município",
    "bairro": "Bairro",
    "logradouro": "Logradouro",
    "numero": "Número",
    "cep": "CEP",
    "ddd_telefone_1": "Telefone",
    "cnae_fiscal_descricao": "Atividade Principal (CNAE)",
    "descricao_situacao_cadastral": "Situação Cadastral",
    "data_situacao_cadastral": "Data da Situação",
    "capital_social": "Capital Social"
  };
  
  // Função que transforma o objeto JSON em HTML formatado
  function formatarResultado(data) {
    let html = '';
    
    for (const campo in campoParaRotulo) {
      if (data[campo]) { // Só exibe o campo se ele existir na resposta
        let valor = data[campo];
        // Formata o capital social como moeda
        if (campo === 'capital_social') {
          valor = parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        html += `
          <div class="item">
            <strong>${campoParaRotulo[campo]}:</strong>
            <span>${valor || 'Não informado'}</span>
          </div>
        `;
      }
    }
    return html;
  }

  async function consultarCNPJ() {
    const cnpj = cnpjInput.value.replace(/\D/g, '');

    if (cnpj.length !== 14) {
      resultadoEl.innerHTML = `<p class="error-message">Erro: O CNPJ deve conter 14 números.</p>`;
      return;
    }
    
    loadingEl.classList.remove('hidden');
    resultadoEl.innerHTML = ''; // Limpa o resultado anterior
    
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;

    try {
      // Adiciona um pequeno delay para a animação de loading ser visível
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'CNPJ não encontrado.' : 'Falha na comunicação com a API.');
      }
      
      const data = await response.json();
      resultadoEl.innerHTML = formatarResultado(data);

    } catch (error) {
      resultadoEl.innerHTML = `<p class="error-message">Falha na consulta: ${error.message}</p>`;
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  consultarBtn.addEventListener('click', consultarCNPJ);
  cnpjInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      consultarCNPJ();
    }
  });
});
