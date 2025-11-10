import { useRouter } from 'next/router';
import AppraisalForm from '../../../components/vender/AppraisalForm';

const AppraisalPage = () => {
  const router = useRouter();
  const { product } = router.query;

  // Puedes usar el 'product' slug para cargar datos específicos del producto desde una API
  // Por ahora, el componente AppraisalForm usa datos mock.

  // Verificar si el router está listo antes de renderizar
  if (!router.isReady || !product) {
    return <div>Cargando...</div>; // O una página de esqueleto
  }

  return <AppraisalForm productSlug={product} />;
};

// Usar getServerSideProps para manejar la ruta dinámica correctamente
export async function getServerSideProps(context) {
  const { product } = context.params;

  return {
    props: {
      productSlug: product,
    },
  };
}

export default AppraisalPage;
