import Image from "next/image";
import styles from "./page.module.css";
import Signup from "./(routes)/(unauthenticated)/signup/page";
import { lightTheme, darkTheme } from "@/theme/theme";

export default function BasePage() {
  return (
    <Signup/>
  );
}
