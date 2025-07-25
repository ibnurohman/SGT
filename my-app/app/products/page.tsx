'use client';
import {
  Table,
  Typography,
  Input,
  Space,
  Button,
  Modal,
  Form,
  message,
} from 'antd';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/auth-context'
import debounce from 'lodash/debounce';
import { getAuth } from 'firebase/auth';
const { Title } = Typography;
const { Search } = Input;
interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_category: string;
  product_description: string;
}
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [formKey, setFormKey] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [form] = Form.useForm();
const { getToken } = useAuth();
const auth = getAuth();
const user = auth.currentUser;
 useEffect(() => {
  const runFetch = async () => {
    const token = await user?.getIdToken();
    console.log('Fetched token:', token);
    if (!token) return;

    await fetchData(token, pageSize, currentPage, searchText);
  };
  if (user) {
    runFetch();
  }
}, [user]);

 const fetchData = useCallback(async (token: string, page: number, limit: number, search: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/products?page=${page}&limit=${limit}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response:', response.data); 

      setProducts(response.data.data); 
      setTotalProducts(response.data.pagination.total); 
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = await getToken();
      if (token) {
        await fetchData(token, currentPage, pageSize, searchText);
      } else {
        console.warn('No Firebase ID token available on load. Products may not be fetched.');
      }
    };
    fetchInitialData();
  }, [getToken, fetchData, currentPage, pageSize, searchText]); 


const handleRowClick = async (record: Product) => {
    setLoading(true); 
    try {
     
      const response = await axios.get(`/api/product?product_id=${record.product_id}`);
      setSelectedProduct(response.data.data); 
      setIsDetailModalOpen(true); 
    } catch (error) {
      message.error('Failed to fetch product details. Check console for more info.');
    } finally {
      setLoading(false);
    }
  };

 const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchText(value); 
      setCurrentPage(1); 
    }, 300),
    []
  );
 const handleOpenCreateModal = () => {
    setEditingProduct(null); 
    setFormKey(prevKey => prevKey + 1);
    form.resetFields();    
    setIsUpsertModalOpen(true);
  };
   const handleOpenEditModal = (record: Product) => {
    setEditingProduct(record);
    setFormKey(prevKey => prevKey + 1);
    form.setFieldsValue(record); 
    setIsUpsertModalOpen(true);
  };

  const handleUpsert = async (values: Product) => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        message.error('Authentication token not available. Please log in.');
        setLoading(false);
        return;
      }
      if (editingProduct) {
        const payload = { ...values, product_id: editingProduct.product_id };
        const response = await axios.put('/api/product', payload);
        message.success('Product updated successfully');
      } else {
        await axios.post('/api/product', values);
        message.success('Product created successfully');
      }

      form.resetFields();
      setIsUpsertModalOpen(false);
      
      await fetchData(token, currentPage, pageSize, searchText);

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
      message.error(`Failed to save product: ${err.response.data.error || err.response.data.message || 'Unknown error'}`);
    } else {
      message.error('Failed to save product: An unexpected error occurred.');
    }
    } finally {
      setLoading(false);
    }
  };
const handleDelete = async (productId: string) => {
    Modal.confirm({
      title: 'Konfirmasi Hapus',
      content: 'Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      onOk: async () => {
        setLoading(true);
        try {
          const token = await getToken();
          if (!token) {
            message.error('Authentication token not available. Please log in.');
            setLoading(false);
            return;
          }
          await axios.delete(`/api/product?product_id=${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          message.success('Product deleted successfully');
          await fetchData(token, currentPage, pageSize, searchText);
        } catch (err: any) {
          console.error('Failed to delete product (frontend error):', err);
          if (axios.isAxiosError(err) && err.response) {
            console.error('Backend Response Error Data (frontend):', err.response.data);
            message.error(`Failed to delete product: ${err.response.data.error || err.response.data.message || 'Unknown error'}`);
          } else {
            message.error('Failed to delete product: An unexpected error occurred.');
          }
        } finally {
          setLoading(false);
        }
      },
      onCancel() {
      },
    });
  };
  const columns = [
    {
      title: 'Product Title',
      dataIndex: 'product_title',
      key: 'title',
      render: (text: string, record: Product) => (
        <a onClick={() => handleRowClick(record)} style={{ cursor: 'pointer', color: '#1890ff' }}>
          {text}
        </a>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'product_price',
      key: 'price',
      render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
    },
    {
      title: 'Category',
      dataIndex: 'product_category',
      key: 'category',
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleOpenEditModal(record)}>Edit</Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.product_id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="p-8">
      <Title level={2}>Product List</Title>

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search product..."
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <Button type="primary" onClick={handleOpenCreateModal}>
          Create Product
        </Button>
      </Space>

      <Table
        loading={loading}
        dataSource={products}
        columns={columns}
        rowKey="product_id"
       pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalProducts, 
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      <Modal
        title={editingProduct ? "Edit Product" : "Create Product"} 
        open={isUpsertModalOpen} 
        onCancel={() => {
          setIsUpsertModalOpen(false);
          setEditingProduct(null); 
          form.resetFields();    
          setFormKey(prevKey => prevKey + 1);
        }}
        onOk={() => form.submit()}
        okText={editingProduct ? "Update" : "Create"}
      >
        <Form layout="vertical" form={form} onFinish={handleUpsert}
        key={formKey}
            initialValues={editingProduct || {}}>
          <Form.Item
            label="Product Title"
            name="product_title"
            rules={[
              { required: true, message: 'Please enter product title' },
              { min: 6, message: 'Product title must be at least 6 characters' } // <-- Tambahan validasi
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="product_price"
            rules={[{ required: true, message: 'Please enter product price' }
              ,
              { min: 4, message: 'Product price must be at least 4 characters' }
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="product_category"
            rules={[{ required: true, message: 'Please enter product category' },
              { min: 6, message: 'Product category must be at least 6 characters' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="product_description"
            rules={[{ required: true, message: 'Please enter product description' }
              ,
              { min: 20, message: 'Product description must be at least 20 characters' }
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
        <Modal
        title="Product Details"
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null); 
        }}
        footer={null} 
      >
        {selectedProduct ? ( 
          <div>
            <p><strong>Product ID:</strong> {selectedProduct.product_id}</p>
            <p><strong>Title:</strong> {selectedProduct.product_title}</p>
            <p><strong>Price:</strong> Rp {selectedProduct.product_price?.toLocaleString('id-ID')}</p>
            <p><strong>Category:</strong> {selectedProduct.product_category}</p>
            <p><strong>Description:</strong> {selectedProduct.product_description}</p>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
      </Modal>
    </main>
  );
}

