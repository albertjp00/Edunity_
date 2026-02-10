
interface Props {
  title: string;
  value: string | number;
}

const StatsCard: React.FC<Props> = ({ title, value }) => {
  return (
    <div className="stats-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
};

export default StatsCard;
