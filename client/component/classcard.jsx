import { Link } from "react-router-dom";
import "./style.css";

export default function ClassCard({ id, classes }) {

  return (
        <Link to={`/subject/${classes}`} className="class-card">
                <h2>{classes}</h2>
        </Link>
  );
}
