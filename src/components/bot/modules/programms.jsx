import React, { Component } from 'react';
const { connect } = require('react-redux');
const utils = require('./../../../utils.js');

class ProgrammsModule extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  send () {
    let add = { l: utils.getCookie('l'), b: this.props.bot.id };
    let obj = Object.assign({}, this.state, add);
    let str = JSON.stringify(obj);
    utils.sendRequest(str, this.handleResponse, 'data/save_data.php');
  }

  handleResponse (response) {
    window.webix.message({
      text: 'Company data saved',
      type: 'info',
      expire: 5000,
      id: 'message1'
    });
  }

  handleChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render () {
    return ([
      <aside key="0">
        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel">
          <div class="modal-dialog" role="document">
            <div class="modal-content">

              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                  aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="editModalLabel">Редактирование</h4>
              </div>

              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label for="edit-name" class="control-label">Название:</label>
                    <input type="text" class="form-control" id="edit-name"/>
                  </div>
                </form>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                <button type="button" id="modalSaveBtn" data-dismiss="modal" class="btn btn-success">Сохранить
                </button>
              </div>

            </div>
          </div>
        </div>
      </aside>,
      <div class="container-fluid" key="1">
        <div class="row">
          <main class="col-sm-9 col-md-10 main">
            <h4 class="page-header">Программы</h4>

            <div class="form-group">
              <textarea class="form-control" id="enterText" placeholder="Вводный текст"></textarea>
            </div>

            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

              <div class="panel panel-default top" data-num="1">

                <div class="panel-heading" role="tab">
                  <h4 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse_1"
                      aria-expanded="false" aria-controls="collapse_1">Программа 1</a>
                    <a href="#" class="btn btn-edit" data-toggle="modal" data-target="#editModal">
                      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                    </a>
                    <a href="javascript:void(0);" class="btn pull-right">
                      <span class="glyphicon glyphicon-minus topMinus" aria-hidden="true"></span>
                    </a>
                  </h4>
                </div>

                <div id="collapse_1" class="panel-collapse collapse in" role="tabpanel"
                  aria-labelledby="collapse_1">
                  <div class="panel-body">

                    <div class="form-group txtGroup">
                      <textarea class="form-control  pull-left" placeholder="Вводный текст"></textarea>
                      <a href="javascript:void(0);" class="btn">
                        <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                      </a>
                    </div>

                    <div class="form-group lnkGroup">
                      <div class="btn-group-vertical lnkInputBlock" role="group" aria-label="...">
                        <input type="text" class="form-control" placeholder="Введите ссылку"/>
                        <input type="text" class="form-control" placeholder="Введите название кнопки"/>
                      </div>
                      <a href="javascript:void(0);" class="btn">
                        <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                      </a>
                    </div>

                    <div class="form-group dropdown">
                      <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    Добавить
                        <span class="caret"></span>
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
                        <li><a href="javascript:void(0);" class="chText">Текстовое поле</a></li>
                        <li><a href="javascript:void(0);" class="chLink">Ссылку</a></li>
                        <li><a href="javascript:void(0);" class="chImg">Изображение</a></li>
                      </ul>
                    </div>

                    <div class="panel-group sub-group" id="sub_accordion_1" role="tablist"
                      aria-multiselectable="true">

                      <div class="panel panel-default" data-num="1">

                        <div class="panel-heading" role="tab">
                          <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#sub_accordion_1"
                              href="#sub_collapse_1_1"
                              aria-expanded="false" aria-controls="sub_collapse_1_1">Спикер</a>
                            <a href="#" class="btn btn-edit" data-toggle="modal"
                              data-target="#editModal">
                              <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                            </a>
                            <a href="javascript:void(0);" class="btn pull-right">
                              <span class="glyphicon glyphicon-minus subMinus"
                                aria-hidden="true"></span>
                            </a>
                          </h4>
                        </div>

                        <div id="sub_collapse_1_1" class="panel-collapse collapse" role="tabpanel"
                          aria-labelledby="sub_collapse_1_1">
                          <div class="panel-body">

                            <div class="form-group txtGroup">
                              <textarea class="form-control  pull-left"
                                placeholder="Вводный текст"></textarea>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="img imgGroup">
                              <a href="#" class="thumbnail pull-left">
                                <img src="http://placehold.it/350x200" class="img-responsive" alt="demo"/>
                              </a>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="clearfix"></div>

                            <div class="form-group lnkGroup">
                              <div class="btn-group-vertical lnkInputBlock" role="group"
                                aria-label="...">
                                <input type="text" class="form-control" placeholder="Введите ссылку"/>
                                <input type="text" class="form-control" placeholder="Введите название кнопки"/>
                              </div>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="form-group dropdown">
                              <button class="btn btn-default dropdown-toggle" type="button"
                                id="sub_dropdownMenu1"
                                data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="true">
                                                    Добавить
                                <span class="caret"></span>
                              </button>
                              <ul class="dropdown-menu" aria-labelledby="sub_dropdownMenu1">
                                <li><a href="javascript:void(0);" class="chText">Текстовое поле</a>
                                </li>
                                <li><a href="javascript:void(0);" class="chLink">Ссылку</a></li>
                                <li><a href="javascript:void(0);" class="chImg">Изображение</a></li>
                              </ul>
                            </div>

                          </div>

                        </div>

                      </div>

                      <div class="panel panel-default" data-num="2">

                        <div class="panel-heading" role="tab">
                          <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#sub_accordion_1"
                              href="#sub_collapse_1_2"
                              aria-expanded="false" aria-controls="sub_collapse_1_2">Формат и цена</a>
                            <a href="#" class="btn btn-edit" data-toggle="modal"
                              data-target="#editModal">
                              <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                            </a>
                            <a href="javascript:void(0);" class="btn pull-right">
                              <span class="glyphicon glyphicon-minus subMinus"
                                aria-hidden="true"></span>
                            </a>
                          </h4>
                        </div>

                        <div id="sub_collapse_1_2" class="panel-collapse collapse in" role="tabpanel"
                          aria-labelledby="sub_collapse_1_2">
                          <div class="panel-body">

                            <div class="form-group txtGroup">
                              <textarea class="form-control  pull-left"
                                placeholder="Вводный текст"></textarea>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="img imgGroup">
                              <a href="#" class="thumbnail pull-left">
                                <img src="http://placehold.it/350x200" class="img-responsive" alt="demo"/>
                              </a>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="clearfix"></div>

                            <div class="form-group lnkGroup">
                              <div class="btn-group-vertical lnkInputBlock" role="group"
                                aria-label="...">
                                <input type="text" class="form-control" placeholder="Введите ссылку"/>
                                <input type="text" class="form-control" placeholder="Введите название кнопки"/>
                              </div>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="form-group dropdown">
                              <button class="btn btn-default dropdown-toggle" type="button"
                                id="sub_dropdownMenu"
                                data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="true">
                                                    Добавить
                                <span class="caret"></span>
                              </button>
                              <ul class="dropdown-menu" aria-labelledby="sub_dropdownMenu">
                                <li><a href="javascript:void(0);" class="chText">Текстовое поле</a>
                                </li>
                                <li><a href="javascript:void(0);" class="chLink">Ссылку</a></li>
                                <li><a href="javascript:void(0);" class="chImg">Изображение</a></li>
                              </ul>
                            </div>

                          </div>

                        </div>

                      </div>

                      <div class="panel panel-default" data-num="3">

                        <div class="panel-heading" role="tab">
                          <h4 class="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#sub_accordion_1"
                              href="#sub_collapse_1_3"
                              aria-expanded="false" aria-controls="sub_collapse_1_3">Тема и тезисы</a>
                            <a href="#" class="btn btn-edit" data-toggle="modal"
                              data-target="#editModal">
                              <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                            </a>
                            <a href="javascript:void(0);" class="btn pull-right">
                              <span class="glyphicon glyphicon-minus subMinus"
                                aria-hidden="true"></span>
                            </a>
                          </h4>
                        </div>

                        <div id="sub_collapse_1_3" class="panel-collapse collapse" role="tabpanel"
                          aria-labelledby="sub_collapse_1_3">
                          <div class="panel-body">

                            <div class="form-group txtGroup">
                              <textarea class="form-control  pull-left"
                                placeholder="Вводный текст"></textarea>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="img imgGroup">
                              <a href="#" class="thumbnail pull-left">
                                <img src="http://placehold.it/350x200" class="img-responsive" alt="demo"/>
                              </a>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="clearfix"></div>

                            <div class="form-group lnkGroup">
                              <div class="btn-group-vertical lnkInputBlock" role="group"
                                aria-label="...">
                                <input type="text" class="form-control" placeholder="Введите ссылку"/>
                                <input type="text" class="form-control" placeholder="Введите название кнопки"/>
                              </div>
                              <a href="javascript:void(0);" class="btn">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                              </a>
                            </div>

                            <div class="form-group dropdown">
                              <button class="btn btn-default dropdown-toggle" type="button"
                                id="sub_dropdownMenu2"
                                data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="true">
                                                    Добавить
                                <span class="caret"></span>
                              </button>
                              <ul class="dropdown-menu" aria-labelledby="sub_dropdownMenu2">
                                <li><a href="javascript:void(0);" class="chText">Текстовое поле</a>
                                </li>
                                <li><a href="javascript:void(0);" class="chLink">Ссылку</a></li>
                                <li><a href="javascript:void(0);" class="chImg">Изображение</a></li>
                              </ul>
                            </div>

                          </div>

                        </div>

                      </div>
                      <a class="btn btn-success chSubBlock" href="javascript:void(0);" role="button">Добавить подраздел</a>
                    </div>

                  </div>
                </div>
              </div>

              <div class="form-group">
                <a class="btn btn-success chBlock" href="javascript:void(0);" role="button">Добавить раздел</a>
              </div>

              <div class="form-group">
                <a class="btn btn-danger json" href="javascript:void(0);" role="button">JSON</a>
              </div>

            </div>
          </main>
        </div>
      </div>
    ]);
  }
}

const mapStateToProps = state => ({
  show_mybots: state.show_mybots,
  bot: state.bot
});

export default connect(
  mapStateToProps
)(ProgrammsModule);
