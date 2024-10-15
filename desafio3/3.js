class Heroi {
  constructor(nome, idade, tipo) {
    this.nome = nome;
    this.idade = idade;
    this.tipo = tipo;
  }

  atacar() {
    let ataque;

    switch (this.tipo.toLowerCase()) {
      case 'mago':
        ataque = 'magia';
        break;
      case 'guerreiro':
        ataque = 'espada';
        break;
      case 'monge':
        ataque = 'artes marciais';
        break;
      case 'ninja':
        ataque = 'shuriken';
        break;
      default:
        ataque = 'ataque desconhecido';
    }
    console.log(`O ${this.tipo} atacou usando ${ataque}`);
  }
}

const mago = new Heroi('Merlin', 150, 'Mago');
const guerreiro = new Heroi('Conan', 35, 'Guerreiro');
const monge = new Heroi('Iroh', 60, 'Monge');
const ninja = new Heroi('Naruto', 20, 'Ninja');

mago.atacar();        
guerreiro.atacar(); 
monge.atacar();        
ninja.atacar();        

