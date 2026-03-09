const ProgressBar = ({ solved, total }) => {
  const percentage = total ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
      <p className="text-xs text-gray-600 mt-1">
        {solved} / {total} solved ({percentage}%)
      </p>
    </div>
  );
};

export default ProgressBar;