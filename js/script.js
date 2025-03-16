function salvar(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let phone = document.getElementById("phone").value;
    let birthDate = document.getElementById("birthDate").value;
    let roles = document.getElementById("roles").value;
    //objeto javascript
    let usuario = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        birthDate: birthDate,
        roles: roles
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
function salvarProduto() {
    let selectedCategories = Array.from(document.getElementById("category").selectedOptions)
                                  .map(option => Number(option.value)); // Convertendo para número

    let produto = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        price: parseFloat(document.getElementById("price").value),
        imgUrl: document.getElementById("imgUrl").value,
        categories: selectedCategories
    };

    fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(data => console.log("Produto salvo:", data))
    .catch(error => console.error("Erro ao salvar produto:", error));
}

// document.addEventListener("DOMContentLoaded", function () {
//     carregarCategorias();
// });

function carregarCategorias() {
    fetch("http://localhost:8080/api/categorys") // Endpoint do backend
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("category");
            data.forEach(category => {
                let option = document.createElement("option");
                option.value = category.id; // Ajuste conforme a estrutura do CategoryDTO
                option.textContent = category.name; // Ajuste conforme a estrutura do CategoryDTO
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar categorias:", error));
}

function salvarUser() {
    // Captura os valores do formulário
    let user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value,
        birthDate: document.getElementById("birthdate").value, // Corrigido o ID para "birthdate"
        roles: document.getElementById("roles").value,
    };
    // Envia os dados para a API
    fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao salvar usuário");
        }
        return response.json();
    })
    .then(data => {
        alert("Usuário salvo com sucesso!");
        console.log("Usuário salvo:", data);
    })
    .catch(error => {
        alert("Erro ao salvar usuário. Verifique os dados.");
        console.error("Erro:", error);
    });
}

function salvarOrder() {
    // Captura os valores do formulário
    let order = {
        status: document.getElementById("status").value,
        userId: parseInt(document.getElementById("userId").value)
    };

    // Validação básica
    if (!order.userId) {
        alert("Por favor, insira um ID de usuário válido");
        return;
    }

    // Envia os dados para a API
    fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao salvar pedido");
        }
        return response.json();
    })
    .then(data => {
        alert("Pedido salvo com sucesso!");
        console.log("Pedido salvo:", data);
        // Limpa o campo de usuário após salvar
        document.getElementById("userId").value = "";
        // Reset status to default
        document.getElementById("status").value = "WAITING_PAYMENT";
    })
    .catch(error => {
        alert("Erro ao salvar pedido. Verifique os dados.");
        console.error("Erro:", error);
    });
}
