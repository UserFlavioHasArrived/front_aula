// Load all orders when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadAllOrders();
    
    // Add event listener for user search
    const searchInput = document.getElementById("userSearch");
    let debounceTimeout;

    searchInput.addEventListener("input", function(e) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            searchUsers(e.target.value);
        }, 300);
    });
});

function loadAllOrders() {
    fetch("http://localhost:8080/api/orders")
        .then(response => response.json())
        .then(orders => {
            displayOrders(orders);
        })
        .catch(error => {
            console.error("Error loading orders:", error);
        });
}

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
                    loadOrdersByUser(user.id);
                    document.getElementById("userSearch").value = user.name;
                    resultsDiv.innerHTML = "";
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

function loadOrdersByUser(userId) {
    fetch(`http://localhost:8080/api/orders/by-user/${userId}`)
        .then(response => response.json())
        .then(orders => {
            displayOrders(orders);
        })
        .catch(error => {
            console.error("Error loading orders for user:", error);
        });
}

function displayOrders(orders) {
    const tbody = document.getElementById("ordersTable").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    
    orders.forEach(order => {
        const row = tbody.insertRow();
        const formattedDate = new Date(order.moment).toLocaleString();
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${formattedDate}</td>
            <td>${order.userName}</td>
            <td>${order.status}</td>
            <td id="total-${order.id}">Loading...</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewOrderDetails(${order.id})">
                    View Details
                </button>
            </td>
        `;
        
        // Load order items to calculate total
        loadOrderTotal(order.id);
    });
}

function loadOrderTotal(orderId) {
    fetch(`http://localhost:8080/api/orderitems/by-order/${orderId}`)
        .then(response => response.json())
        .then(items => {
            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById(`total-${orderId}`).textContent = `$${total.toFixed(2)}`;
        })
        .catch(error => {
            console.error("Error loading order items:", error);
            document.getElementById(`total-${orderId}`).textContent = "Error";
        });
}

function viewOrderDetails(orderId) {
    // Load order details
    Promise.all([
        fetch(`http://localhost:8080/api/orders/${orderId}`).then(res => res.json()),
        fetch(`http://localhost:8080/api/orderitems/by-order/${orderId}`).then(res => res.json())
    ])
    .then(([order, items]) => {
        const formattedDate = new Date(order.moment).toLocaleString();
        document.getElementById("orderDetailInfo").innerHTML = `
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Date:</strong> ${formattedDate}<br>
            <strong>Status:</strong> ${order.status}<br>
            <strong>Customer:</strong> ${order.userName}
        `;

        const tbody = document.getElementById("orderItemsTableBody");
        tbody.innerHTML = "";
        let totalOrderValue = 0;

        items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalOrderValue += itemTotal;

            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;
        });

        document.getElementById("modalOrderTotal").textContent = `$${totalOrderValue.toFixed(2)}`;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        modal.show();
    })
    .catch(error => {
        console.error("Error loading order details:", error);
        alert("Error loading order details");
    });
}

function clearUserSearch() {
    document.getElementById("userSearch").value = "";
    document.getElementById("userSearchResults").innerHTML = "";
    loadAllOrders();
}
