import React from 'react';
import style from './style.css';

function Button(props) {
  return (
    <div className={style.button} onClick={props.onClick}>
      {props.text}
    </div>
  );
}

export default Button;
