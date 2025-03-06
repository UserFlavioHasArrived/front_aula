function salvar(){
    let nome = document.getElementById("nome").value;
    let idade = document.getElementById("idade").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    let usuario = {
        nome: nome,
        idade: idade,
        email: email,
        senha: senha
    }
    console.log(usuario);
    //converte o objeto para json
    localStorage.setItem("usuario", JSON.stringify(usuario));
    alert("usuário salvo com sucesso." + usuario);
    let usuarioSalvo = localStorage.getItem("usuario");
    // converte o json para objeto
    let dados = JSON.parse(usuarioSalvo);
    console.log(dados);
    console.log(dados.idade);
}

let nome = "Filipe";
let idade = 35;
const cidade = "Criciúma";
let a = 2;
let b = 2;
let soma = a + b;
//sout 
console.log("Nome:"+nome);
console.log("Idade:"+idade);
console.log("Soma:"+ (a+b));
console.log("Soma:"+soma);

let pessoa ={
    nome: "Filipe",
    idade: 38,
    email: "filipe@gmail.com",
    senha: "123"
}
console.log("Nome:"+pessoa.nome);
console.log("Idade:"+pessoa.idade);
console.log(pessoa);