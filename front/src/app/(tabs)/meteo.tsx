import { ComingSoon } from '../../components/ComingSoon';

// FCT-20 / FCT-22: weather of the installation and 7-day forecast (Open-Meteo through the API).
export default function MeteoScreen() {
  return (
    <ComingSoon
      title="Météo"
      icon="sun"
      text="Météo du jour, prévisions à 7 jours et production estimée pour chaque jour."
      sprint="sprint 3"
    />
  );
}
