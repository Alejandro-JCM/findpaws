import React, { useState, useEffect } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import useDebounce from "../hooks/useDebounce.js";
import { useUpload } from "../hooks/useUpload.js";
import { useAuth } from "./AuthContext.jsx";
import LocationPickerMap from "./LocationPickerMap.jsx";
import axios from "axios";

function ReportPetModal({ mode, onClose, onSuccess, userLocation }) {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
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
    status: mode === "adoption" ? "available_for_adoption" : "lost",
    locationCoords: null,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const provider = new OpenStreetMapProvider();
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [isPlacingOnMap, setIsPlacingOnMap] = useState(false);
  const [isLocationFromMap, setIsLocationFromMap] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const debouncedSearchTerm = useDebounce(formData.location_address, 300);
  const { upload, loading: uploading } = useUpload();
  const { user, isAuthenticated } = useAuth();

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    console.log('Archivos seleccionados para upload:', files);
    setUploadProgress(10);

    // Validar tamaño máximo (50MB por archivo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    const invalidFiles = files.filter(file => file.size > maxSize);

    if (invalidFiles.length > 0) {
      alert('Algunos archivos son demasiado grandes. Máximo 50MB por archivo.');
      return;
    }

    try {
      const { urls, error } = await upload({ files });
      setUploadProgress(100);

      if (error) {
        console.error('Error al subir archivos:', error);
        alert(`Error al subir archivos: ${error}`);
        return;
      }

      if (urls && urls.length > 0) {
        console.log('URLs recibidas del upload:', urls);
        
        // Ya no necesitamos convertir porque useUpload ya lo hace
        setImages((prev) => [...prev, ...urls]);
        setUploadProgress(0);
        
        // Mostrar mensaje de éxito
        if (urls.length === 1) {
          alert('1 archivo subido exitosamente');
        } else {
          alert(`${urls.length} archivos subidos exitosamente`);
        }
      }
    } catch (err) {
      console.error('Error en handleImageUpload:', err);
      setUploadProgress(0);
      alert('Error al procesar los archivos. Intenta de nuevo.');
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para poder reportar una mascota.");
      return;
    }

    if (images.length === 0) {
      alert("Por favor, sube al menos una foto de la mascota.");
      return;
    }

    if (!formData.locationCoords) {
      alert("Por favor, selecciona una ubicación en el mapa.");
      return;
    }

    setLoading(true);

    try {
      const token = user ? user.token : null;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      
      // 1. Preparar ubicación GeoJSON
      let locationData = null;
      if (formData.locationCoords) {
        locationData = {
          type: 'Point',
          coordinates: [formData.locationCoords[1], formData.locationCoords[0]], // [lng, lat]
        };
      }
      
      // 2. Crear objeto final para enviar
      const { location_address, locationCoords, ...restOfFormData } = formData;
      const petData = {
        ...restOfFormData,
        images: images, // URLs completas
        location: locationData,
        location_address: formData.location_address,
      };

      console.log('Enviando datos de mascota:', petData);

      const response = await axios.post("http://localhost:5001/api/pets", petData, config);
      const newPet = response.data;

      console.log('Mascota creada exitosamente:', newPet);

      // 3. Llamar a onSuccess con la nueva mascota
      onSuccess(newPet);
    } catch (error) {
      console.error("Error creating pet listing:", error);
      let message = "Error al crear la publicación. Por favor, inténtalo de nuevo.";
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        message = error.response.data.message || message;
      }
      
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 2 && !isLocationFromMap) {
      const santiagoBounds = [
        [-33.6, -70.8],
        [-33.3, -70.5],
      ];
      const fetchResults = async () => {
        const results = await provider.search({ 
          query: debouncedSearchTerm, 
          viewbox: santiagoBounds.flat() 
        });
        setSearchResults(results);
      };
      fetchResults();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleLocationAddressChange = (e) => {
    setFormData((prev) => ({ 
      ...prev, 
      location_address: e.target.value, 
      locationCoords: null 
    }));
    if (isLocationFromMap) {
      setIsLocationFromMap(false);
    }
  };

  const handleSelectLocation = (result) => {
    setFormData((prev) => ({
      ...prev,
      location_address: result.label,
      locationCoords: [result.y, result.x], // [lat, lng]
    }));
    setSearchResults([]);
  };

  const handleLocationFocus = () => {
    setShowLocationWarning(true);
  };

  const handleMapLocationSelect = async ({ lat, lng }) => {
    try {
      const results = await provider.search({ query: `${lat}, ${lng}` });
      const addressLabel = results.length > 0 ? results[0].label : `Ubicación seleccionada (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

      setFormData((prev) => ({
        ...prev,
        location_address: addressLabel,
        locationCoords: [lat, lng],
      }));
      setIsLocationFromMap(true);
      setIsPlacingOnMap(false);
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
      setFormData((prev) => ({
        ...prev,
        location_address: `Ubicación seleccionada (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        locationCoords: [lat, lng],
      }));
      setIsLocationFromMap(true);
      setIsPlacingOnMap(false);
    }
  };

  if (isPlacingOnMap) {
    return (
      <LocationPickerMap
        userLocation={userLocation}
        onLocationSelect={handleMapLocationSelect}
        onCancel={() => setIsPlacingOnMap(false)}
        petStatus={formData.status}
      />
    );
  }

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de reporte<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="lost"
                    checked={formData.status === "lost"}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Encontrada
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="available_for_adoption"
                    checked={formData.status === "available_for_adoption"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Adopción
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre (si se conoce)
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre de la mascota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No especificado</option>
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especie<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>Selecciona una especie</option>
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
                  name="breed"
                  type="text"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Raza"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  name="color"
                  type="text"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Color"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
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
                  name="age_estimate"
                  value={formData.age_estimate}
                  onChange={handleInputChange}
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
                Dirección o sector<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-2">
                <div className="relative flex-grow w-full">
                  <input
                    name="location_address"
                    value={formData.location_address}
                    onChange={handleLocationAddressChange}
                    onFocus={handleLocationFocus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dirección o sector"
                    autoComplete="off"
                    required
                  />
                  {searchResults.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                      {searchResults.map((result) => (
                        <li
                          key={result.raw.place_id}
                          className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectLocation(result)}
                        >
                          {result.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlacingOnMap(true)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-map-marker-alt"></i>
                  Posicionar en el mapa
                </button>
              </div>
              {showLocationWarning && (
                <p className="text-xs text-gray-500 mt-1">
                  <i className="fas fa-info-circle mr-1"></i> Por tu seguridad, te recomendamos no usar tu dirección exacta. Elige un punto de referencia cercano.
                </p>
              )}
              {formData.locationCoords && (
                <p className="text-xs text-green-600 mt-1">
                  <i className="fas fa-check-circle mr-1"></i> Ubicación seleccionada: {formData.locationCoords[0].toFixed(4)}, {formData.locationCoords[1].toFixed(4)}
                </p>
              )}
            </div>

            {mode === "rescue" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.status === "lost" ? "Fecha de desaparición" : "Fecha encontrada"}
                </label>
                <input
                  name="last_seen_date"
                  type="date"
                  value={formData.last_seen_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
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
                name="distinguishing_marks"
                value={formData.distinguishing_marks}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cicatrices, marcas únicas, detalles del collar, etc."
              />
            </div>

            {/* Sección de fotos mejorada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotos<span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-gray-500 ml-2">(Máximo 50 archivos, 50MB cada uno)</span>
              </label>
              <div className="mb-3">
                <input
                  type="file"
                  multiple
                  accept="*/*"  // Acepta cualquier tipo de archivo
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={uploading || images.length >= 50}
                />
                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Subiendo archivos... {uploadProgress}%</p>
                  </div>
                )}
              </div>
              
              {images.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {images.length} {images.length === 1 ? 'archivo' : 'archivos'} seleccionado{images.length === 1 ? '' : 's'}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            console.error('Error cargando archivo:', img);
                            e.target.src = 'https://via.placeholder.com/150?text=Archivo';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Eliminar archivo"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {images.length === 0 && (
                <p className="text-sm text-yellow-600 italic">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  Debes subir al menos una foto de la mascota.
                </p>
              )}
            </div>

            {mode === "rescue" && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={formData.is_emergency}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_emergency: e.target.checked }))}
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
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || uploading || images.length === 0 || !formData.locationCoords}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-blue-300 transition-colors flex items-center justify-center"
              >
                {loading || uploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {uploading ? "Subiendo..." : "Enviando..."}
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {mode === "rescue" ? "Reportar Mascota" : "Generar Reporte"}
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

export default ReportPetModal;  // ← ¡IMPORTANTE! Esto debe ser export default