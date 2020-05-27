import React from 'react';
import style from './mybots.module.scss';

export default function ({ bot, bot_click }) {
  let logo = 'img/bots_logo/' + bot.logo;
  let icons = bot.social.map((soci_item, i) => {
    let icon = `img/social/35x35/${soci_item}.png`;
    return <img src={icon} key={i} alt='social' />;
  });

  return (
    <div className={style.bot_box} onClick={(e) => bot_click(bot)}>
      <div className={style.logo}>
        <img src={logo} alt={bot.name} />
      </div>
      <div className={style.date}>{bot.create_dt}</div>
      <div className={style.name}>{bot.name}</div>
      <div className={style.template}>{bot.template}</div>
      {/* <div className={style.settings}>
        <img src='img/settings.png' alt='Bot settings' />
      </div> */}
      <div className={style.social}>Channels:</div>
      <div className={style.icons}>{icons}</div>
      <div className={style.users}>Users:</div>
      <div className={style.users_val}>{bot.users}</div>
    </div>
  );
}
