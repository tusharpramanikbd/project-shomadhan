const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="card glass w-96 shadow-lg">
        <div className="card-body">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email Address</legend>
            <input
              type="text"
              className="input"
              placeholder="example@email.com"
            />
            {/* <p className="label">Optional</p> */}
          </fieldset>
          <div className="mt-6">
            <button className="btn btn-primary btn-block">Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
