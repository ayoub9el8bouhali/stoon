import { useNavigate } from "react-router-dom";
import { ListingForm } from "../components/forms/ListingForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

export function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addListing } = useData();

  const submit = async (module, payload) => {
    const created = await addListing(module, payload, user);
    navigate(`/annonces/${module}/${created.id}`);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Créer une annonce</h1>
          <p>Publiez une colocation, un document, un trajet, un événement, un service ou une offre.</p>
        </div>
      </div>
      <section className="form-panel">
        <ListingForm onSubmit={submit} />
      </section>
    </div>
  );
}
