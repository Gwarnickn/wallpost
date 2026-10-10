import { useContext, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../api/ApiService";
import { PostsContext } from "../../context/Posts/PostsContext";
import CameraIcon from "./CameraIcon";
import "./scan.scss";

const EMPTY = {
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  place: "",
  lat: null as number | null,
  lng: null as number | null,
};

const Scan = () => {
  const navigate = useNavigate();
  const context = useContext(PostsContext);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "scanning" | "ready" | "saving"
  >("idle");
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // zdjęcie -> zmniejszenie do 1000px -> wysłanie do odczytania
  const onPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width * scale;
    canvas.height = bitmap.height * scale;
    canvas
      .getContext("2d")!
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL("image/jpeg", 0.8);

    setImage(photo);
    setError("");
    setStatus("scanning");
    try {
      const result = await ApiService.scanPoster(photo);
      if (result.isPoster === false) {
        setError("To nie wygląda na plakat wydarzenia. Zrób zdjęcie plakatu.");
        setStatus("idle");
        return;
      }
      setForm({ ...EMPTY, ...result });
      setDuplicate(result.duplicate ?? null);
    } catch (scanError) {
      console.error(scanError);
      setForm(EMPTY);
      setDuplicate(null);
      setError("Nie udało się odczytać plakatu – uzupełnij dane ręcznie.");
    }
    setStatus("ready");
  };

  const save = async () => {
    if (!form.title || !form.startDate) {
      setError("Podaj przynajmniej tytuł i datę rozpoczęcia.");
      return;
    }
    setStatus("saving");

    // gdy miejsca nie udało się znaleźć: bierzemy lokalizację telefonu, a w ostateczności Wrocław
    let lat = form.lat;
    let lng = form.lng;
    if (lat === null || lng === null) {
      const position = await new Promise<GeolocationPosition | null>(
        (resolve) =>
          navigator.geolocation.getCurrentPosition(resolve, () =>
            resolve(null),
          ),
      );
      lat = position?.coords.latitude ?? 51.1079;
      lng = position?.coords.longitude ?? 17.0385;
    }

    try {
      const created = await ApiService.createPost({
        title: form.title,
        startDate: form.startDate,
        endDate: form.endDate || form.startDate,
        description: form.description,
        image,
        lat,
        lng,
      });
      await context?.fetchPosts();
      navigate(`/map?post=${created.id}`);
    } catch (saveError) {
      console.error(saveError);
      const reason = (
        saveError as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      setError(reason ?? "Nie udało się dodać wydarzenia.");
      setStatus("ready");
    }
  };

  return (
    <div className="scan">
      <h1 className="scan__heading">Dodaj plakat</h1>
      <p className="scan__lead">
        Zrób zdjęcie, a tytuł, datę i miejsce uzupełnimy za Ciebie.
      </p>
      {error && <p className="scan__error">{error}</p>}

      <div className="scan__poster">
        {status === "idle" ? (
          <label className="scan__frame scan__frame--empty">
            <span className="scan__camera">
              <CameraIcon />
            </span>
            Zrób zdjęcie plakatu
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onPhoto}
              hidden
            />
          </label>
        ) : (
          <div
            className={`scan__frame ${status === "scanning" ? "scan__frame--scanning" : ""}`}
          >
            <img src={image} alt="" />
            {status === "scanning" && (
              <span className="scan__status">Czytam plakat…</span>
            )}
          </div>
        )}
      </div>
      {status === "ready" && duplicate && (
        <div className="scan__form">
          <div className="scan__place">
            <span>To wydarzenie już jest w Wallpoście</span>
            {duplicate.title}
          </div>

          <button
            className="scan__save"
            onClick={() => navigate(`/map?post=${duplicate.id}`)}
          >
            Zobacz wydarzenie
          </button>
          <button className="scan__retry" onClick={() => setDuplicate(null)}>
            To inne wydarzenie – dodaj mimo to
          </button>
        </div>
      )}
      {(status === "ready" || status === "saving") && !duplicate && (
        <div className="scan__form">
          <label>
            Tytuł
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <div className="scan__row">
            <label>
              Początek
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </label>
            <label>
              Koniec
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </label>
          </div>

          <label>
            Opis
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>

          <div className="scan__place">
            <span>Miejsce</span>
            {form.lat !== null
              ? form.place
              : "Nie rozpoznano – użyjemy Twojej lokalizacji"}
          </div>

          <button
            className="scan__save"
            onClick={save}
            disabled={status === "saving"}
          >
            {status === "saving" ? "Dodaję…" : "Dodaj wydarzenie"}
          </button>
          <button
            className="scan__retry"
            onClick={() => setStatus("idle")}
            disabled={status === "saving"}
          >
            Zrób inne zdjęcie
          </button>
        </div>
      )}
    </div>
  );
};

export default Scan;
