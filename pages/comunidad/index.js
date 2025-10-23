import React from 'react';
import CommunityHero from '../../components/comunidad/CommunityHero';
import Initiatives from '../../components/comunidad/Initiatives';
import Roadmap from '../../components/comunidad/Roadmap';
import JoinUs from '../../components/comunidad/JoinUs';
import styles from '../../styles/pages/Comunidad.module.css';

const ComunidadPage = () => {
  return (
    <div className={styles.container}>
      <CommunityHero />
      <Initiatives />
      <Roadmap />
      <JoinUs />
    </div>
  );
};

export default ComunidadPage;