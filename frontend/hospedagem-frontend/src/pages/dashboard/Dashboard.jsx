import Bread from "../../components/bread/Bread";

//Page que é acessada por ADMINISTRADORES, nela é renderizada um dashboard de powerBI por meio do iframe.
const Dashboard = () => {
  const iFrame = "https://app.powerbi.com/view?r=eyJrIjoiYTdlYmRhM2MtODVjZS00NjJhLWI3ZWMtOTMzYjE0NWZhYmUzIiwidCI6IjJjZjdkNGQ1LWJkMWItNDk1Ni1hY2Y4LTI5OTUzOTliMjE2OCJ9";

  return (
    <div className="container d-flex justify-content-center min-vh-100 user-select-none">
      <div className="w-100">
        <div>
          <Bread current={"DASHBOARD"} />
        </div>
        <div>
          <iframe
            className="shadow"
            title="Power BI Dashboard"
            width="100%"
            height="800"
            src={iFrame}
            frameBorder="0"
            allowFullScreen="true"
            loading="eager"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
