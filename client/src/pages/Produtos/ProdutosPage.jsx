// ProdutosPage.js
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, IconButton, Menu, MenuItem, Select, TextField, Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Add, FilterList, MoreVert, Edit, Delete, Inventory } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const url = "http://localhost:5000/produtos"; // URL para a API de produtos

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro na resposta da API');
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleDeleteProduto = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const res = await fetch(`${url}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error('Erro ao excluir produto');
        setProdutos(prev => prev.filter(produto => produto.id !== id));
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
      }
    }
  };
  
  // const handleDeleteProduto = async (id) => {
  //   try {
  //     await fetch(`${url}/${id}`, { method: "DELETE" });
  //     setProdutos(prev => prev.filter(produto => produto.id !== id));
  //   } catch (error) {
  //     console.error("Erro ao excluir produto:", error);
  //   }
  // };

  const columns = [
    { field: 'nome', headerName: 'Descrição', width: 200 },
    { field: 'codigo', headerName: 'Código', width: 150 },
    { field: 'unidade', headerName: 'Unidade', width: 100 },
    { field: 'preco', headerName: 'Preço', width: 100 },
    { field: 'estoque', headerName: 'Estoque', width: 100 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="primary"
            onClick={(event) => handleOpenMenu(event, params.row.id)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && menuRowId === params.row.id}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => {
              // navigate(`/produtos/cadastro/${params.row.id}`);
              navigate(`/produtos/cadastro?id=${params.row.id}`);
              handleCloseMenu();
            }}>
              <Edit fontSize="small" /> Editar
            </MenuItem>
            <MenuItem onClick={() => { handleDeleteProduto(params.row.id); handleCloseMenu(); }}>
              <Delete fontSize="small" /> Excluir
            </MenuItem>
            <MenuItem onClick={() => {
              // Navegar para a página de estoques, passando o produto selecionado
              navigate(`/estoques/${params.row.id}`, { state: { produto: params.row } });
              handleCloseMenu();
            }}>
              <Inventory fontSize="small" /> Estoque
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Produtos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={() => navigate('/produtos/cadastro')}
        >
          Incluir cadastro
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" gap={2}>
          <Select defaultValue="" displayEmpty>
            <MenuItem value="">Situação</MenuItem>
            <MenuItem value="ultimo">Últimos incluídos</MenuItem>
            <MenuItem value="ativo">Ativo</MenuItem>
          </Select>
          <Select defaultValue="" displayEmpty>
            <MenuItem value="">Categoria</MenuItem>
            <MenuItem value="categoria1">Categoria 1</MenuItem>
            <MenuItem value="categoria2">Categoria 2</MenuItem>
          </Select>
          <Select defaultValue="" displayEmpty>
            <MenuItem value="">Classificação</MenuItem>
            <MenuItem value="classificacao1">Classificação 1</MenuItem>
            <MenuItem value="classificacao2">Classificação 2</MenuItem>
          </Select>
          <Select defaultValue="" displayEmpty>
            <MenuItem value="">Tipo</MenuItem>
            <MenuItem value="tipo1">Tipo 1</MenuItem>
            <MenuItem value="tipo2">Tipo 2</MenuItem>
          </Select>
          <Button variant="outlined" startIcon={<FilterList />}>Filtrar</Button>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <TextField placeholder="Pesquisar por código, descrição" variant="outlined" size="small" />
          <IconButton color="primary">
            <Search />
          </IconButton>
        </Box>
      </Box>

      <Box height={400} sx={{ width: '100%' }}>
        <DataGrid
          rows={produtos}
          columns={columns}
          pageSize={10}
          // checkboxSelection
          loading={loading}
        />
      </Box>
    </Container>
  );
};

export default ProdutosPage;
