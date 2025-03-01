import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, CardMedia, TextField, Container, Paper, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";

export default function Shopez() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "", gender: "" });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://td1wgndh5m.execute-api.us-east-1.amazonaws.com/dev/fetch");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.gender) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("https://td1wgndh5m.execute-api.us-east-1.amazonaws.com/dev/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      if (response.ok) {
        setProducts([...products, data]);
        setNewProduct({ name: "", price: "", image: "", gender: "" });
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Container>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Shopez
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Filter Section */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Filter</Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Men">Men</MenuItem>
                <MenuItem value="Women">Women</MenuItem>
                <MenuItem value="Unisex">Unisex</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Product Listing */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {products
              .filter((product) => filter === "" || product.gender === filter)
              .map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardMedia component="img" height="140" image={product.image || "https://via.placeholder.com/150"} alt={product.name} />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body1">${product.price}</Typography>
                      <Typography variant="body2" color="textSecondary">{product.gender}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Add Product Section */}
      <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Product
        </Typography>
        <TextField label="Product Name" name="name" fullWidth value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} sx={{ mb: 2 }} />
        <TextField label="Price" name="price" fullWidth value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} sx={{ mb: 2 }} />
        <TextField label="Image URL" name="image" fullWidth value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Gender</InputLabel>
          <Select name="gender" value={newProduct.gender} onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}>
            <MenuItem value="Men">Men</MenuItem>
            <MenuItem value="Women">Women</MenuItem>
            <MenuItem value="Unisex">Unisex</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>
    </Container>
  );
}
