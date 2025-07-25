'use client';
import { Card, Typography, Tag } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_description?: string;
  product_image?: string;
  product_category?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      hoverable
      style={{ width: 300 }}
      cover={
        <img
          alt={product.product_title}
          src={product.product_image}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
    >
      <Title level={4}>{product.product_title}</Title>
      <Tag color="blue">{product.product_category}</Tag>
      <Paragraph ellipsis={{ rows: 2 }}>{product.product_description}</Paragraph>
      <Title level={5} style={{ marginTop: 8 }}>
        Rp {product.product_price.toLocaleString('id-ID')}
      </Title>
    </Card>
  );
}
