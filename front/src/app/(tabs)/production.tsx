import { ComingSoon } from '../../components/ComingSoon';

// FCT-32 / FCT-33: production history and charts (day, month, year).
export default function ProductionScreen() {
  return (
    <ComingSoon
      title="Production"
      icon="zap"
      text="Graphiques de production par jour, mois et année, à partir de l’historique simulé par l’API."
      sprint="sprint 3"
    />
  );
}
