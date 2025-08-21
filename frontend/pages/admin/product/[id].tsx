import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProductById, fetchProducts, Product } from '../../../lib/api';
import ProductDetailPage from '../../../components/ProductDetailPage';

interface Props {
  product: Product | null;
}

export default function AdminProductDetail({ product }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPage
      product={product}
      onBack={() => router.back()}
      onBuyNow={(quantity) => {
        // Handle buy now action
        router.push('/checkout');
      }}
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Fetch products for static generation
    // For admin pages, you might want to generate only a few or use fallback
    const productsResponse = await fetchProducts(0, 50); // Get first 50 products
    
    const paths = productsResponse.content.map((product) => ({
      params: { id: product.productId.toString() },
    }));

    return {
      paths,
      fallback: 'blocking', // Enable fallback for products not pre-generated
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    if (!params?.id || typeof params.id !== 'string') {
      return {
        notFound: true,
      };
    }

    const product = await fetchProductById(parseInt(params.id));
    
    return {
      props: {
        product,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        product: null,
      },
      revalidate: 60,
    };
  }
};