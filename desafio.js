const readline = require('readline');

// Cria uma interface para ler dados do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Pergunta o nome do herói
rl.question('Digite o nome do herói (ou cancele para sair): ', (nome) => {
  if (!nome) {
    console.log('Saindo...');
    rl.close();
    return; // Sai se o nome estiver vazio
  }

  // Pergunta a quantidade de XP
  rl.question('Digite a quantidade de XP: ', (xp) => {
    if (!xp) {
      console.log('Saindo...');
      rl.close();
      return; // Sai se a entrada estiver vazia
    }

    const experiencia = parseInt(xp);
    let nivel;

    // Estruturas de decisão para determinar o nível
    if (experiencia < 1000) {
      nivel = "Ferro";
    } else if (experiencia <= 2000) {
      nivel = "Bronze";
    } else if (experiencia <= 5000) {
      nivel = "Prata";
    } else if (experiencia <= 7000) {
      nivel = "Ouro";
    } else if (experiencia <= 8000) {
      nivel = "Platina";
    } else if (experiencia <= 9000) {
      nivel = "Ascendente";
    } else if (experiencia <= 10000) {
      nivel = "Imortal";
    } else {
      nivel = "Radiante";
    }

    // Exibe a classificação do herói
    console.log(`O Herói de nome ${nome} está no nível de ${nivel}`);
    
    // Fecha a interface após a entrada
    rl.close();
  });
});
