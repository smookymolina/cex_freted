import { useRouter } from 'next/router';
import AppraisalForm from '../../../components/vender/AppraisalForm';

const AppraisalPage = () => {
  const router = useRouter();
  const { product } = router.query;

  // Puedes usar el 'product' slug para cargar datos específicos del producto desde una API
  // Por ahora, el componente AppraisalForm usa datos mock.

  if (!product) {
    return <div>Cargando...</div>; // O una página de esqueleto
  }

  return <AppraisalForm productSlug={product} />;
};

export default AppraisalPage;
