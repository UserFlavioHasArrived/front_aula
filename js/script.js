function salvar(){
    let nome = document.getElementById("nome").value;
    let idade = document.getElementById("idade").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;
    //objeto javascript
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
    //enviar dados para o backend
    fetch(
        "http://localhost:8080/api/users",{
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(usuario),
        })
        .then((response)=>response.json())
        .then((data)=> {console.log("sucesso:",data);

        }).catch((error)=>{
            console.error("erro:",error)});
}
function salvarProduto(){
    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let description = document.getElementById("description").value;
    let imgUrl = document.getElementById("imgUrl").value;
    //objeto javascript
    let product = {
        name: name,
        price: price,
        description: description,
        imgUrl: imgUrl
    }
    //converte o objeto para json
    localStorage.setItem("product", JSON.stringify(product));
    alert("produto salvo com sucesso." + product);
    let productSalvo = localStorage.getItem("product");
    // converte o json para objeto
    let dados = JSON.parse(productSalvo);
   //enviar dados para o backend
    fetch(
        "http://localhost:8080/api/products",{
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(products),
        })
        .then((response)=>response.json())
        .then((data)=> {console.log("sucesso:",data);

        }).catch((error)=>{
            console.error("erro:",error)});
}