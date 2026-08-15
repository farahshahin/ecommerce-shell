import MicrofrontendFrame from "../components/MicrofrontendFrame";
import { microfrontends } from "../config/microfrontends";

export default function Catalog() {
  return (
    <MicrofrontendFrame src={microfrontends.catalog} title="Catalog Microfrontend"/>
  );
}