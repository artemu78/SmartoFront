export default (
  state = {
    schemes: [],
    show_menu: false,
    show_content: false,
    header: false,
    show_profile: false,
    show_mybots: false,
    show_plan: false,
    show_service: false,
    show_regsplash: true
  },
  action
) => {
  let new_st;

  let all_false = {
    show_menu: false,
    show_content: false,
    header: false,
    show_profile: false,
    show_mybots: false,
    show_plan: false,
    show_service: false,
    show_regsplash: false,
    show_bot: false,
    show_support: false
  };

  switch (action.type) {
    case 'SHOW_PROFILE':
      new_st = Object.assign({}, state, all_false, {
        header: true,
        show_profile: true
      });
      break;
    case 'SHOW_ALLTEMPL':
      new_st = Object.assign({}, state, all_false, {
        show_menu: true,
        show_content: true,
        header: true
      });
      break;
    case 'SHOW_MYBOTS':
      new_st = Object.assign({}, state, all_false, {
        header: true,
        show_mybots: true
      });
      break;
    case 'SHOW_BOT':
      new_st = Object.assign({}, state, all_false, {
        header: true,
        bot: action.bot,
        show_bot: true
      });
      break;
    case 'SHOW_SUPPORT':
      new_st = Object.assign({}, state, all_false, {
        header: true,
        show_support: true
      });
      break;
    case 'SHOW_PLAN':
      new_st = Object.assign({}, state, all_false, {
        header: true,
        show_plan: true
      });
      break;
    case 'SHOW_SERVICE':
      new_st = Object.assign({}, state, all_false, {
        header: true,
        show_service: true
      });
      break;
    case 'SHOW_HEADER':
      new_st = Object.assign({}, state, all_false, {
        show_profile: true,
        user_name: action.user_name,
        userpic: action.userpic
      });
      break;
    case 'SET_USER_PROFILE':
      new_st = Object.assign({}, state, {
        user_phohe: action.user_phohe
      });
      break;
    case 'SHOW_REGSPLASH':
      new_st = Object.assign({}, state, all_false, {
        header: true,
        show_mybots: true,
        show_payment: true,
        show_regsplash: true
      });
      break;
    case 'SET_BOT_SCHEME':
      let schemes = Object.assign({}, state.schemes);
      schemes[action.bot] = action.scheme;
      new_st = Object.assign({}, state, { schemes });
      break;
    default:
      new_st = Object.assign({}, all_false, state);
  }

  return new_st;
};
