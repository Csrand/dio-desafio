const prompt = require('prompt-sync')();

let vitorias = Number(prompt("Digite o número de Vitórias: "));
let derrotas = Number(prompt("Digite o número de Derrotas: "));

function calcularVitorias(vitorias, derrotas) {
    let totalVitorias = vitorias - derrotas;
    return totalVitorias;
}

function compararRanking(totalVitorias) {
    if (totalVitorias < 10) {
        console.log("Ranking: Ferro\n");
        return;
    }
    if (totalVitorias >= 11 && totalVitorias <= 20) {
        console.log("Ranking: Bronze\n");
        return;
    }
    if (totalVitorias >= 21 && totalVitorias <= 50) {
        console.log("Ranking: Prata\n");
        return;
    }
    if (totalVitorias >= 51 && totalVitorias <= 80) {
        console.log("Ranking: Ouro\n");
        return;
    }
    if (totalVitorias >= 81 && totalVitorias <= 90) {
        console.log("Ranking: Diamante\n");
        return;
    }
    if (totalVitorias >= 91 && totalVitorias <= 100) {
        console.log("Ranking: Lendário\n");
        return;
    }
    if (totalVitorias >= 101) {
        console.log("Ranking: Imortal\n");
        return;
    }
}

let totalVitorias = calcularVitorias(vitorias, derrotas);
compararRanking(totalVitorias);

