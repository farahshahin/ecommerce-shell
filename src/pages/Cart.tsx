import MicrofrontendFrame from "../components/MicrofrontendFrame";
import { microfrontends } from "../config/microfrontends";

export default function Cart() {
  return (
    <MicrofrontendFrame src={microfrontends.cart}  title="Cart and Checkout Microfrontend"/>
  );
}