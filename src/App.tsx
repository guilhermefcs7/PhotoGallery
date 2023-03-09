import { useState, useEffect, FormEvent } from "react";
import * as C from "./App.styles";
import * as Photos from "./services/photos";
import { Photo } from "./types/Photo";
import { PhotoItem } from "./components/photoItem";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);

      const photos = await Photos.getAll();

      setPhotos(photos);

      setLoading(false);
    };

    getPhotos();
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(false);

    const formData = new FormData(e.currentTarget);

    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      setIsSubmitting(true);

      const result = await Photos.SendFile(file);

      setIsSubmitting(false);

      if (result instanceof Error) {
        return alert(`${result.name} - ${result.message}`);
      }

      const newPhotoList = [...photos];

      newPhotoList.push(result);

      setPhotos(newPhotoList);
    }
  };

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input
            type="submit"
            value={isSubmitting ? "Enviando..." : "Enviar"}
          />
        </C.UploadForm>

        {loading && (
          <C.ScreenWarning>
            <span>Carregando...</span>
          </C.ScreenWarning>
        )}

        {!loading && photos.length > 0 && (
          <C.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name} />
            ))}
          </C.PhotoList>
        )}

        {!loading && photos.length === 0 && (
          <C.ScreenWarning>
            <span>Não há fotos cadastradas.</span>
          </C.ScreenWarning>
        )}
      </C.Area>
    </C.Container>
  );
};

export default App;
