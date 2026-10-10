import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Post } from "../../../types/post";

const redPinIcon = divIcon({
  className: "post-map__pin",
  html: `
    <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0Z" fill="#E23B2E"/>
      <circle cx="17" cy="17" r="6.5" fill="#FFFFFF"/>
    </svg>
  `,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
});

const InvalidateOnShow = ({ active }: { active: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (!active) return;
    const frame = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(frame);
  }, [active, map]);

  return null;
};

interface PostMapProps {
  post: Post;
  active: boolean;
}

const PostMap = ({ post, active }: PostMapProps) => {
  const position: [number, number] = [post.lat, post.lng];

  return (
    <MapContainer
      className="post-map"
      center={position}
      zoom={15}
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={redPinIcon} />
      <InvalidateOnShow active={active} />
    </MapContainer>
  );
};

export default PostMap;
