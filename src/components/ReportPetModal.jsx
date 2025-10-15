import React from "react";
import { useUpload } from "../hooks/useUpload";

function ReportPetModal({ mode, onClose, onSuccess, userLocation }) {
  const [formData, setFormData] = React.useState({
    name: "",
    species: "dog",
    breed: "",
    color: "",
    size: "medium",
    age_estimate: "adult",
    gender: "",
    description: "",
    distinguishing_marks: "",
    location_address: "",
    last_seen_date: new Date().toISOString().split("T")[0],
    is_emergency: false,
    status: mode === "rescue" ? "lost" : "available_for_adoption",
  });
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { upload, loading: uploading } = useUpload();

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const uploadPromises = files.map(async (file) => {
      const { url, error } = await upload({ file });
      if (error) {
        console.error("Upload error:", error);
        return null;
      }
      return url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter((url) => url !== null);
    setImages((prev) => [...prev, ...validUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const petData = {
        ...formData,
        image_urls: images,
        location_lat: userLocation?.lat,
        location_lng: userLocation?.lng,
      };

      const response = await fetch("/api/pets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData),
      });

      if (!response.ok) throw new Error("Failed to create pet listing");

      onSuccess();
    } catch (error) {
      console.error("Error creating pet listing:", error);
      alert("Failed to create pet listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "rescue"
                ? "Reportar Mascota Perdida/Encontrada"
                : "Publicar Mascota en Adopción"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "rescue" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de reporte
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="lost"
                      checked={formData.status === "lost"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="mr-2"
                    />
                    Perdida
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="found"
                      checked={formData.status === "found"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="mr-2"
                    />
                    Encontrada
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre (si se conoce)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre de la mascota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especie *
                </label>
                <select
                  value={formData.species}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      species: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="dog">Perro</option>
                  <option value="cat">Gato</option>
                  <option value="bird">Ave</option>
                  <option value="rabbit">Conejo</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raza
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, breed: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Raza"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Color"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño
                </label>
                <select
                  value={formData.size}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, size: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad estimada
                </label>
                <select
                  value={formData.age_estimate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      age_estimate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="puppy/kitten">Cachorro/Gatito</option>
                  <option value="young">Joven</option>
                  <option value="adult">Adulto</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección o sector
              </label>
              <input
                type="text"
                value={formData.location_address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location_address: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dirección o sector"
              />
            </div>

            {mode === "rescue" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.status === "lost" ? "Fecha de desaparición" : "Fecha encontrada"}
                </label>
                <input
                  type="date"
                  value={formData.last_seen_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      last_seen_date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe la mascota, comportamiento, circunstancias, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Señales distintivas
              </label>
              <textarea
                value={formData.distinguishing_marks}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    distinguishing_marks: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cicatrices, marcas únicas, detalles del collar, etc."
              />
            </div>

            {/* Sección de fotos mejorada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotos
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {images.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 transition"
                        title="Eliminar foto"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {mode === "rescue" && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={formData.is_emergency}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_emergency: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                <label htmlFor="emergency" className="text-sm text-gray-700">
                  Es una emergencia (herida o en peligro inmediato)
                </label>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {mode === "rescue" ? "Reportar Mascota" : "Publicar en Adopción"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportPetModal;