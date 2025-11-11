import { useState, useEffect } from 'react';
import Image from 'next/image';
import { isBuenFinActive } from '../../config/promotions';
import styles from '../../styles/components/campaign-modal.module.css';

const MODAL_STORAGE_KEY = 'buenFin2025ModalDismissed';

export default function CampaignModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const campaignActive = isBuenFinActive();
    const hasBeenDismissed = sessionStorage.getItem(MODAL_STORAGE_KEY);

    if (campaignActive && !hasBeenDismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(MODAL_STORAGE_KEY, 'true');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar">
          &times;
        </button>
        <Image
          src="/images/hero/offers/buen-fin-pop-up.png"
          alt="Promoción Buen Fin"
          width={600}
          height={600}
          layout="responsive"
        />
      </div>
    </div>
  );
}
