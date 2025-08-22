// Aguarda o HTML ser completamente carregado para rodar o script
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona os elementos do HTML
  const cnpjInput = document.getElementById('cnpj-input');
  const consultarBtn = document.getElementById('consultar-btn');
  const resultadoEl = document.getElementById('resultado');
  const loadingEl = document.getElementById('loading');

  // Função assíncrona para consultar o CNPJ
  async function consultarCNPJ() {
    const cnpj = cnpjInput.value.replace(/\D/g, '');

    if (cnpj.length !== 14) {
      resultadoEl.textContent = 'Erro: O CNPJ deve conter 14 números.';
      return;
    }
    
    loadingEl.classList.remove('hidden');
    resultadoEl.textContent = '';
    
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;

    try {
      // Usamos o 'fetch' para fazer a chamada na API
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CNPJ não encontrado.');
        }
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const data = await response.json();
      
      // JSON.stringify com 2 espaços de indentação para formatar a saída
      resultadoEl.textContent = JSON.stringify(data, null, 2);

    } catch (error) {
      resultadoEl.textContent = `Falha na consulta: ${error.message}`;
    } finally {
      // Esconde a mensagem de "Buscando..." ao final
      loadingEl.classList.add('hidden');
    }
  }

  // Adiciona o evento de 'click' no botão
  consultarBtn.addEventListener('click', consultarCNPJ);

  // Permite consultar pressionando "Enter"
  cnpjInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      consultarCNPJ();
    }
  });
});
