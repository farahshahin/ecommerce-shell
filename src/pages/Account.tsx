import MicrofrontendFrame from "../components/MicrofrontendFrame";
import { microfrontends } from "../config/microfrontends";

export default function Account() {
  return (
    <MicrofrontendFrame  src={microfrontends.account} title="Account and Orders Microfrontend"
    />
  );
}