import { Capacitor } from '@capacitor/core';

const CallSettingsButton = () => {
  const openCallSettings = async () => {
    if (Capacitor.getPlatform() === 'android') {
      const plugin = (window as any).Capacitor.Plugins.CallSettings;
      await plugin.openCallSettings();
    } else {
      alert('Esse recurso só funciona no Android.');
    }
  };

  return (
    <button
      onClick={openCallSettings}
      style={{
        backgroundColor: '#1F51E6',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '20px'
      }}
    >
      Ativar Bloqueador de Chamadas
    </button>
  );
};

export default CallSettingsButton;
