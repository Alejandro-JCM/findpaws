import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { getImageUrl } from "../utils/imageHelper";
import { useUpload } from "../hooks/useUpload";
import AlertModal from "./AlertModal";

function UserPetReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReport, setEditingReport] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const { user } = useAuth();
  const { upload, loading: uploading } = useUpload();

  useEffect(() => {
    // Si hay un usuario, busca sus reportes.
    // Esto se ejecutará cuando el componente se monte y el usuario ya esté disponible,
    // o cuando el usuario inicie sesión y el componente se actualice.
    if (user) {
      fetchUserReports();
    }
  }, [user]); // La dependencia es solo el usuario.

  const fetchUserReports = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get("http://localhost:5001/api/pets/mypets", config);
      setReports(response.data);
      setError("");
    } catch (err) {
      console.error("Error al cargar reportes:", err);
      setError("Error al cargar tus reportes. Intenta de nuevo.");
      setError("En futuras versiones se podrán modificar los registros realizados y el perfil de usuario.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReport = (report) => {
    setEditingReport({ ...report });
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  const handleSaveEdit = async () => {
    if (!editingReport) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { _id, user: reportUser, createdAt, updatedAt, ...updateData } = editingReport;

      // Validar que queden imágenes
      if (!updateData.images || updateData.images.length === 0) {
        setAlertMessage("❌ Error: El reporte debe tener al menos una imagen.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5001/api/pets/${_id}`,
        updateData,
        config
      );

      // Actualizar la lista de reportes
      setReports(reports.map(report => 
        report._id === _id ? { ...report, ...response.data } : report
      ));
      
      setEditingReport(null);
      setAlertMessage("✅ Reporte actualizado exitosamente");
    } catch (err) {
      console.error("Error al actualizar reporte:", err);
      setAlertMessage(`❌ Error: ${err.response?.data?.message || "No se pudo actualizar el reporte"}`);
    }
  };

  const handleImageUploadInEdit = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0 || !editingReport) return;

    try {
      const { urls, error } = await upload({ files });

      if (error) {
        setAlertMessage(`❌ Error al subir: ${error}`);
        return;
      }

      if (urls && urls.length > 0) {
        setEditingReport(prev => ({
          ...prev,
          images: [...prev.images, ...urls]
        }));
        setAlertMessage(`✅ ${urls.length} imágen(es) agregada(s).`);
      }
    } catch (err) {
      setAlertMessage("❌ Error inesperado al subir imágenes.");
    }
  };

  const handleDeleteReport = (reportId) => {
    setReportToDelete(reportId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`http://localhost:5001/api/pets/${reportToDelete}`, config);

      // Remover de la lista
      setReports(reports.filter(report => report._id !== reportToDelete));
      setAlertMessage("✅ Reporte eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar reporte:", err);
      setAlertMessage(`❌ Error: ${err.response?.data?.message || "No se pudo eliminar el reporte"}`);
    } finally {
      setShowDeleteConfirm(false);
      setReportToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "lost":
        return { text: "Perdido", color: "bg-red-100 text-red-700" };
      case "found":
        return { text: "Encontrado", color: "bg-green-100 text-green-700" };
      case "available_for_adoption":
        return { text: "En Adopción", color: "bg-orange-100 text-orange-700" };
      default:
        return { text: status, color: "bg-gray-100 text-gray-700" };
    }
  };

  const renderReportCard = (report) => (
    <div key={report._id} className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {report.name || "Sin nombre"}
          </h3>
          <p className="text-sm text-gray-500">
            Creado: {formatDate(report.createdAt)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusInfo(report.status).color}`}>
          {getStatusInfo(report.status).text}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {report.images && report.images.length > 0 ? (
            report.images.map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)}
                alt={`${report.name || "Mascota"} ${idx + 1}`}
                className="w-16 h-16 object-cover rounded-md border flex-shrink-0"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/64x64/cccccc/666666?text=Imagen";
                }}
              />
            ))
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md border">
              <i className="fas fa-image text-gray-400"></i>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Descripción:</span>{" "}
          {report.description || "Sin descripción"}
        </p>
        {report.location_address && (
          <p className="text-gray-600 text-sm mt-1">
            <i className="fas fa-map-marker-alt mr-1"></i>
            {report.location_address}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleEditReport(report)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i className="fas fa-edit"></i>
          Editar
        </button>
        <button
          onClick={() => handleDeleteReport(report._id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <i className="fas fa-trash"></i>
          Eliminar
        </button>
      </div>
    </div>
  );

  const renderEditForm = () => {
    if (!editingReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Editar Reporte</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la mascota
                </label>
                <input
                  type="text"
                  value={editingReport.name || ""}
                  onChange={(e) =>
                    setEditingReport({ ...editingReport, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre de la mascota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado del reporte
                </label>
                <div className="flex gap-4">
                  {["lost", "found", "available_for_adoption"].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={editingReport.status === status}
                        onChange={(e) =>
                          setEditingReport({ ...editingReport, status: e.target.value })
                        }
                        className="mr-2"
                      />
                      {status === "lost" && "Perdido"}
                      {status === "found" && "Encontrado"}
                      {status === "available_for_adoption" && "En Adopción"}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editingReport.description || ""}
                  onChange={(e) =>
                    setEditingReport({ ...editingReport, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe la mascota, comportamiento, circunstancias, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección o sector
                </label>
                <input
                  type="text"
                  value={editingReport.location_address || ""}
                  onChange={(e) =>
                    setEditingReport({ ...editingReport, location_address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Dirección o sector"
                />
              </div>

              {/* Sección para editar imágenes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes del reporte
                </label>
                {/* Previsualización de imágenes existentes */}
                {editingReport.images && editingReport.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                    {editingReport.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={getImageUrl(img)}
                          alt={`preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = editingReport.images.filter((_, i) => i !== idx);
                            setEditingReport({ ...editingReport, images: newImages });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Input para subir nuevas imágenes */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Añadir más imágenes
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUploadInEdit}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="mt-2 text-sm text-blue-600">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Subiendo...
                    </div>
                  )}
                  {editingReport.images.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      El reporte debe tener al menos una imagen.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={uploading || editingReport.images.length === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-blue-300 flex items-center justify-center gap-2"
                  >
                    {uploading && <i className="fas fa-spinner fa-spin"></i>}
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
        <p className="text-gray-600 mt-2">Cargando tus reportes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-tools text-2xl text-gray-400"></i>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-paw text-3xl text-gray-400 mb-3"></i>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No has creado reportes aún
        </h3>
        <p className="text-gray-500">
          Cuando reportes una mascota perdida, encontrada o en adopción, aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Mis Reportes ({reports.length})
        </h3>
        <p className="text-gray-600 text-sm">
          Aquí puedes ver, editar o eliminar los reportes que has creado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map(renderReportCard)}
      </div>

      {renderEditForm()}

      {showDeleteConfirm && (
        <AlertModal
          message="¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer."
          onClose={() => {
            setShowDeleteConfirm(false);
            setReportToDelete(null);
          }}
          onConfirm={confirmDeleteReport}
          showCancel={true}
        />
      )}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </>
  );
}

export default UserPetReports;