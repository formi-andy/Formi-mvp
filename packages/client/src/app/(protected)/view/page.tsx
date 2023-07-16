import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const View = (props: Props) => {
  return (
    <div>
      <Link to="/record">
        <p>Record</p>
      </Link>
    </div>
  );
};

export default View;
