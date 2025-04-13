import React, { useState } from 'react';
import { Hand } from 'lucide-react';

const LibrasToggle = () => {
  const [showLibras, setShowLibras] = useState(false);

  return (
    <div style={styles.container}>
      <button onClick={() => setShowLibras(!showLibras)} style={styles.button}>
        <Hand size={24} color="#FFFFFF" />
        <span style={styles.text}>Libras</span>
      </button>
      {showLibras && (
        <div style={styles.librasContent}>
          <p>Conteúdo em Libras (ex.: link pra vídeo)</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '10px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  text: {
    color: '#FFFFFF',
    marginLeft: '5px',
  },
  librasContent: {
    marginTop: '10px',
    backgroundColor: '#FFFFFF',
    padding: '10px',
    borderRadius: '5px',
  },
};

export default LibrasToggle;