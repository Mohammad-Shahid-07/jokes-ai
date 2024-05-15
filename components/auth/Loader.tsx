import React from "react";
import styles from "./styles.module.css";

interface Props {
  color?: string;
  speed?: string;
  size?: string;
}

const Loader = ({ color, speed, size }: Props) => {
  const dotStyle: React.CSSProperties = {
    "--uib-size": size || "100px",
    "--uib-color": color || "black",
    "--uib-speed": speed || "2.5s",
    "--uib-dot-size": `calc(${size || "80px"} * 0.18)`
  } as React.CSSProperties;

  return (
    <div className={styles.container} style={dotStyle}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default Loader;