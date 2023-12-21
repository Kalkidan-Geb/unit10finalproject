const ErrorsDisplay = ({ errors }) => {
  if (errors.length) {
    return (
      <div className="validation-errors">
        <h2>Validation Errors</h2>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <></>;
  }
};

export default ErrorsDisplay;