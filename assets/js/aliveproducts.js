let aliveApi = async (categ) => {
    const response = await fetch(`http://localhost:3000/products/${categ}`);
    return await response.json();
}