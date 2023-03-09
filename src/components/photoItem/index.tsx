import React from "react";

import * as C from "./styles";

import { Props } from "./types";

export const PhotoItem = ({ name, url }: Props) => {
  return (
    <C.Container>
      <img src={url} alt={name} />
      {name}
    </C.Container>
  );
};
