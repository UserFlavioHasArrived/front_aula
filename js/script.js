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

// Função para buscar usuários por nome
function searchUsers(searchTerm) {
    if (searchTerm.length < 3) {
        document.getElementById("userSearchResults").innerHTML = "";
        return;
    }

    fetch(`http://localhost:8080/api/users/search?name=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(users => {
            const resultsDiv = document.getElementById("userSearchResults");
            resultsDiv.innerHTML = "";
            
            users.forEach(user => {
                const userElement = document.createElement("a");
                userElement.href = "#";
                userElement.className = "list-group-item list-group-item-action";
                userElement.innerHTML = `${user.name} (${user.email})`;
                userElement.onclick = (e) => {
                    e.preventDefault();
                    selectUser(user);
                };
                resultsDiv.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error("Error searching users:", error);
            document.getElementById("userSearchResults").innerHTML = 
                '<div class="text-danger">Error searching users</div>';
        });
}

// Função para selecionar um usuário
function selectUser(user) {
    document.getElementById("userId").value = user.id;
    document.getElementById("selectedUserName").textContent = `Selected: ${user.name}`;
    document.getElementById("userSearchResults").innerHTML = "";
    document.getElementById("userSearch").value = user.name;
}

// Adiciona evento de input para busca de usuários
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("userSearch");
    let debounceTimeout;

    searchInput.addEventListener("input", function(e) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            searchUsers(e.target.value);
        }, 300); // Aguarda 300ms após o usuário parar de digitar
    });
});
// Function to search users
function searchUsers(searchTerm) {
    if (searchTerm.length < 3) {
        document.getElementById("userSearchResults").innerHTML = "";
        return;
    }

    fetch(`http://localhost:8080/api/users/search?name=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(users => {
            const resultsDiv = document.getElementById("userSearchResults");
            resultsDiv.innerHTML = "";
            
            users.forEach(user => {
                const userElement = document.createElement("a");
                userElement.href = "#";
                userElement.className = "list-group-item list-group-item-action";
                userElement.innerHTML = `${user.name} (ID: ${user.id})`;
                userElement.onclick = (e) => {
                    e.preventDefault();
                    selectUser(user);
                };
                resultsDiv.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error("Error searching users:", error);
            document.getElementById("userSearchResults").innerHTML = 
                '<div class="text-danger">Error searching users</div>';
        });
}

// Function to select a user
function selectUser(user) {
    document.getElementById("userId").value = user.id;
    document.getElementById("selectedUserName").textContent = `Selected: ${user.name}`;
    document.getElementById("userSearchResults").innerHTML = "";
    document.getElementById("userSearch").value = user.name;
}

function salvarOrder() {
    // Captura os valores do formulário
    let order = {
        status: document.getElementById("status").value,
        userId: parseInt(document.getElementById("userId").value)
    };

    // Validação básica
    if (!order.userId) {
        alert("Por favor, selecione um usuário");
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
        // Store the order ID
        document.getElementById("orderId").value = data.id;
        // Enable the "Add Items" button
        document.getElementById("addItemsBtn").disabled = false;
    })
    .catch(error => {
        alert("Erro ao salvar pedido. Verifique os dados.");
        console.error("Erro:", error);
    });
}

// Function to search products
function searchProducts(searchTerm) {
    if (searchTerm.length < 3) {
        document.getElementById("productSearchResults").innerHTML = "";
        return;
    }

    fetch(`http://localhost:8080/api/products/search?name=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(products => {
            const resultsDiv = document.getElementById("productSearchResults");
            resultsDiv.innerHTML = "";
            
            products.forEach(product => {
                const productElement = document.createElement("a");
                productElement.href = "#";
                productElement.className = "list-group-item list-group-item-action";
                productElement.innerHTML = `${product.name} (Price: $${product.price})`;
                productElement.onclick = (e) => {
                    e.preventDefault();
                    selectProduct(product);
                };
                resultsDiv.appendChild(productElement);
            });
        })
        .catch(error => {
            console.error("Error searching products:", error);
            document.getElementById("productSearchResults").innerHTML = 
                '<div class="text-danger">Error searching products</div>';
        });
}

// Function to select a product
function selectProduct(product) {
    document.getElementById("productId").value = product.id;
    document.getElementById("selectedProductName").textContent = `Selected: ${product.name}`;
    document.getElementById("price").value = product.price;
    document.getElementById("productSearchResults").innerHTML = "";
    document.getElementById("productSearch").value = product.name;
}

function addItemsToOrder() {
    const orderId = document.getElementById("orderId").value;
    if (!orderId) {
        alert("Please save the order first");
        return;
    }
    
    // Set the order ID in the modal
    document.getElementById("modalOrderId").value = orderId;
    
    // Show the modal
    const modalElement = document.getElementById('orderItemModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function salvarOrderItem() {
    const orderItem = {
        orderId: parseInt(document.getElementById("modalOrderId").value),
        productId: parseInt(document.getElementById("productId").value),
        quantity: parseInt(document.getElementById("quantity").value),
        price: parseFloat(document.getElementById("price").value)
    };

    // Validation
    if (!orderItem.orderId || !orderItem.productId || !orderItem.quantity || !orderItem.price) {
        alert("Please fill in all fields");
        return;
    }

    fetch("http://localhost:8080/api/orderitems", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderItem)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error saving order item");
        }
        return response.json();
    })
    .then(data => {
        alert("Order item saved successfully!");
        // Clear the form
        document.getElementById("productId").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("price").value = "";
        document.getElementById("productSearch").value = "";
        document.getElementById("selectedProductName").textContent = "";
        
        // Update the order items table
        updateOrderItemsTable(orderItem.orderId);
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderItemModal'));
        modal.hide();
    })
    .catch(error => {
        alert("Error saving order item. Please check the data.");
        console.error("Error:", error);
    });
}

function updateOrderItemsTable(orderId) {
    fetch(`http://localhost:8080/api/orderitems/by-order/${orderId}`)
        .then(response => response.json())
        .then(items => {
            const tbody = document.getElementById("orderItemsTable").getElementsByTagName("tbody")[0];
            tbody.innerHTML = "";
            
            items.forEach(item => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                `;
            });
        })
        .catch(error => {
            console.error("Error fetching order items:", error);
        });
}

// Add event listener for user search
document.getElementById("userSearch").addEventListener("input", (e) => {
    searchUsers(e.target.value);
});
