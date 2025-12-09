import React from "react";
import MapView from "./MapView";
import PetCard from "./PetCard.jsx";
import ReportPetModal from "./ReportPetModal.jsx";
import MessagesView from "./MessagesViews.jsx";
import AlertsView from "./AlertsView.jsx";
import ProfileView from "./ProfileView.jsx";
import LoginModal from "./LoginModal.jsx"; // Importar LoginModal
import AlertModal from "./AlertModal.jsx"; // Importar el nuevo AlertModal
import { useAuth } from "./AuthContext.jsx"; // Importar hook de autenticación

// Componente principal que orquesta toda la aplicación.
function MainComponent() {
  const [currentMode, setCurrentMode] = React.useState("rescue");
  const [activeTab, setActiveTab] = React.useState("map");
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false); // Para Login/Register
  const [alertMessage, setAlertMessage] = React.useState(""); // Estado para el mensaje de alerta
  const [showAlertModal, setShowAlertModal] = React.useState(false); // Estado para mostrar el modal de alerta
  const [userLocation, setUserLocation] = React.useState(null);
  const [pets, setPets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [chattingWith, setChattingWith] = React.useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Efecto para obtener la geolocalización del usuario al cargar el componente.
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Efecto para cargar las mascotas.
  React.useEffect(() => {
    setLoading(true);

    // --- CÓDIGO PARA OBTENER DATOS DESDE LA API ---
    const fetchPets = async () => {
      try {
        // Usamos la URL completa del backend
        const response = await fetch('http://localhost:5001/api/pets');
        if (!response.ok) {
          throw new Error('Error al cargar las mascotas');
        }
        const data = await response.json();
        console.log('Mascotas cargadas desde API:', data); // Para debug
        // Mapeamos los datos para que coincidan con la estructura que espera el frontend
        const formattedPets = data
          .filter(pet => pet.location && pet.location.coordinates && pet.location.coordinates.length === 2) // Filtramos mascotas sin ubicación válida
          .map(pet => ({
            ...pet,
            id: pet._id, // React necesita una 'key' única, usamos _id
            lat: pet.location.coordinates[1], // MongoDB usa [longitud, latitud], Leaflet usa [latitud, longitud]
            lng: pet.location.coordinates[0],
          }));
        console.log('Mascotas formateadas:', formattedPets); // Para debug
        setPets(formattedPets);
      } catch (error) {
        console.error('Error al cargar mascotas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // Inicia un chat con un usuario y cambia a la pestaña de mensajes.
  const handleStartChat = (user) => {
    setChattingWith(user);
    setActiveTab('messages');
  };

  // Vuelve a la lista general de mensajes desde un chat individual.
  const handleBackToMessages = () => {
    setChattingWith(null);
  };

  const handleOpenReportModal = () => {
    if (!isAuthenticated) {
      setAlertMessage("Debes iniciar sesión para reportar una mascota.");
      setShowAlertModal(true);
    } else {
      setShowReportModal(true);
    }
  };

  // Función para manejar el éxito del reporte y actualizar el estado
  const handleReportSuccess = (newPet) => {
    console.log('Nueva mascota recibida en handleReportSuccess:', newPet); // Para debug
    
    // Verificar que tenga ubicación válida
    if (!newPet.location || !newPet.location.coordinates || newPet.location.coordinates.length < 2) {
      console.error('La mascota no tiene coordenadas válidas:', newPet);
      // Mostrar alerta al usuario
      setAlertMessage("Error: La mascota no tiene una ubicación válida.");
      setShowAlertModal(true);
      return;
    }
    
    // Formatear la nueva mascota para que coincida con la estructura esperada
    const formattedNewPet = {
      ...newPet,
      id: newPet._id, // Usar _id como id
      lat: newPet.location.coordinates[1], // MongoDB usa [lng, lat], leaflet usa [lat, lng]
      lng: newPet.location.coordinates[0],
    };
    
    console.log('Mascota formateada para agregar al estado:', formattedNewPet); // Para debug
    
    // Actualizar el estado de pets
    setPets((prevPets) => [formattedNewPet, ...prevPets]);
    setShowReportModal(false);
    
    // Cambiar a la vista de mapa para ver el nuevo marcador
    setActiveTab('map');
    
    // Mostrar mensaje de éxito
    setAlertMessage("¡Mascota reportada exitosamente! Se ha agregado al mapa.");
    setShowAlertModal(true);
  };

  // Renderiza la vista del mapa con los marcadores de mascotas y el botón para reportar.
  const renderMapView = () => (
    <div className="bg-gray-100 relative" style={{ height: "calc(100vh - 136px)", padding: 0, margin: 0 }}>
      <MapView 
        center={userLocation ? [userLocation.lat, userLocation.lng] : [-33.45, -70.66]}
        pets={pets}
        userLocation={userLocation}
        showUserMarker={false}
        onStartChat={handleStartChat}
        onCenterLocation={(location) => {
          console.log("Centrando en ubicación:", location);
        }}
      />
      <button
        onClick={handleOpenReportModal}
        className="absolute bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        style={{ zIndex: 1000 }}
      >
        <i className="fas fa-plus text-xl"></i>
      </button>
    </div>
  );

  // Renderiza la vista de lista con las tarjetas de cada mascota.
  const renderListView = () => (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentMode === "rescue" ? "Mascotas Perdidas/Encontradas" : "Disponibles para Adopción"}
          </h2>
          <button
            onClick={handleOpenReportModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            {currentMode === "rescue" ? "Reportar" : "Publicar"}
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p className="text-gray-600 mt-2">Cargando mascotas...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-paw text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron mascotas
            </h3>
            <p className="text-gray-500">
              {currentMode === "rescue"
                ? "No hay mascotas perdidas o encontradas en tu área"
                : "No hay mascotas disponibles para adopción cerca"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
              key={pet.id}
                pet={pet} 
                onStartChat={handleStartChat} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Determina qué vista principal renderizar según la pestaña activa.
  const renderContent = () => {
    switch (activeTab) {
      case "map":
        return renderMapView();
      case "list":
        return renderListView();
      case "messages":
        return <MessagesView user={chattingWith} onBack={handleBackToMessages} />;
      case "alerts":
        return <AlertsView />;
      case "profile":
        return <ProfileView onLoginClick={() => setShowAuthModal(true)} />;
      default:
        return renderMapView();
    }
  }

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <i className="fas fa-paw text-2xl text-blue-600 mr-3"></i>
              <h1 className="text-2xl font-bold text-gray-900">FindPaws</h1>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentMode("rescue")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentMode === "rescue"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="fas fa-search mr-2"></i>
                Rescate
              </button>
              <button
                onClick={() => setCurrentMode("adoption")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentMode === "adoption"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="fas fa-heart mr-2"></i>
                Adopción
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col pb-20">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around">
          {[
            { id: "map", icon: "fas fa-map", label: "Mapa" },
            { id: "list", icon: "fas fa-list", label: "Lista" },
            { id: "messages", icon: "fas fa-comments", label: "Mensajes" },
            { id: "alerts", icon: "fas fa-bell", label: "Alertas" },
            { id: "profile", icon: "fas fa-user", label: "Perfil" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className={`${tab.icon} text-lg mb-1`}></i>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showReportModal && (
        <ReportPetModal
          mode={currentMode}
          onClose={() => setShowReportModal(false)}
          onSuccess={handleReportSuccess}
          userLocation={userLocation}
        />
      )}

      {showAlertModal && (
        <AlertModal
          message={alertMessage}
          onClose={() => {
            setShowAlertModal(false);
            // Solo abrir modal de login si el mensaje era sobre autenticación
            if (alertMessage.includes("Debes iniciar sesión")) {
              setShowAuthModal(true);
            }
          }}
        />
      )}

      {showAuthModal && (
        <LoginModal
          onClose={() => setShowAuthModal(false)}
        />
      )}

    </div>
  );
}

export default MainComponent;