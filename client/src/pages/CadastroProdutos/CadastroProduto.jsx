import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Button, 
  Grid, 
  Divider, 
  Container 
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/produtos";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CadastroProduto = () => {
  const query = useQuery();
  const id = query.get('id');
  const navigate = useNavigate();
  
  const [produto, setProduto] = useState({
    nome: '',
    codigo: '',
    unidade: '',
    preco: '',
    estoque: ''
  });

  useEffect(() => {
    if (id) {
      fetch(`${url}?id=${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Erro ao buscar produto');
          }
          return res.json();
        })
        .then((data) => {
          console.log("Produto retornado:", data); // Debug: verifique o que está sendo retornado
          if (data && data.length > 0) { // Verifique se o retorno contém produtos
            setProduto({
              nome: data[0].nome || '',
              codigo: data[0].codigo || '',
              unidade: data[0].unidade || '',
              preco: data[0].preco || '',
              estoque: data[0].estoque || ''
            });
          } else {
            console.error("Produto não encontrado");
          }
        })
        .catch((error) => console.error("Erro ao buscar produto:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto(prevProduto => ({
      ...prevProduto,
      [name]: value
    }));
  };
  
  const handleSaveProduto = async () => {
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${url}/${id}` : url;
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (res.ok) {
        navigate('/produtos');
      } else {
        const errorData = await res.json();
        console.error('Erro ao salvar produto:', errorData);
        alert(`Erro: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {id ? 'Editar Produto' : 'Cadastro de Produto'}
      </Typography>
      <Box component="form">
        <Typography variant="h6" gutterBottom>
          Produtos
        </Typography>
        <Divider />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Nome" 
              variant="outlined" 
              name="nome"
              value={produto.nome}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Código (SKU)" 
              variant="outlined" 
              name="codigo"
              value={produto.codigo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Unidade" 
              variant="outlined" 
              name="unidade"
              value={produto.unidade}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Preço" 
              variant="outlined" 
              name="preco"
              value={produto.preco}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Estoque" 
              variant="outlined" 
              name="estoque"
              value={produto.estoque}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={() => navigate('/produtos')}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveProduto}
          >
            Salvar Produto
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CadastroProduto;
